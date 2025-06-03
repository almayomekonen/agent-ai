import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { v4 as uuidv4 } from "uuid";
import {
  ConversationStatus,
  FieldCompleteness,
  REQUIRED_FIELDS,
  isConversationComplete,
} from "../../types/completeness";
import type { OnePagerData } from "../../types/onepager";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { history, onePagerData, conversationId = uuidv4() } = body;

    if (!history || !Array.isArray(history)) {
      return NextResponse.json(
        { error: "Missing or invalid history" },
        { status: 400 }
      );
    }

    // אם יש כבר נתוני One Pager, בדוק אותם
    // אחרת, נסה לחלץ מההיסטוריה
    const dataToAnalyze: Partial<OnePagerData> =
      onePagerData || (await extractPartialOnePagerFromHistory(history));

    // בדיקת שלמות לכל שדה
    const fieldsCompleteness = await analyzeFieldsCompleteness(dataToAnalyze);

    // חישוב ציון כולל
    const overallScore = calculateOverallScore(fieldsCompleteness);

    // קביעת סטטוס השיחה
    const status = isConversationComplete({
      conversationId,
      status: "in-progress", // ערך התחלתי
      fields: fieldsCompleteness,
      overallScore,
      startTime: new Date(),
      lastUpdateTime: new Date(),
    })
      ? "complete"
      : "in-progress";

    // יצירת סטטוס שיחה מלא
    const conversationStatus: ConversationStatus = {
      conversationId,
      status,
      fields: fieldsCompleteness,
      overallScore,
      startTime: new Date(),
      lastUpdateTime: new Date(),
    };

    // זיהוי שדות שיש לשפר
    const fieldsToImprove = getFieldsToImprove(fieldsCompleteness);

    return NextResponse.json({
      conversationStatus,
      isComplete: conversationStatus.status === "complete",
      fieldsToImprove,
      nextFieldToFocus: getNextFieldToFocus(fieldsCompleteness),
      suggestedQuestions: await generateFollowUpQuestions(
        fieldsToImprove,
        history
      ),
    });
  } catch (error) {
    console.error("Error checking completeness:", error);
    return NextResponse.json(
      {
        error: "Failed to check completeness",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// חילוץ נתוני One Pager חלקיים מההיסטוריה
async function extractPartialOnePagerFromHistory(
  history: string[]
): Promise<Partial<OnePagerData>> {
  try {
    const prompt = `
חלץ מידע לOne Pager מתוך השיחה הבאה. אל תמציא מידע שאינו קיים.
הנה השיחה:
${history.join("\n")}

החזר רק JSON במבנה הבא, כאשר השדות ריקים אם אין מידע:
{
  "about": "תיאור המיזם (ריק אם לא נמסר)",
  "mission": "החזון והמטרה (ריק אם לא נמסר)",
  "values": "ערכי הליבה (ריק אם לא נמסר)",
  "financial": "המודל העסקי (ריק אם לא נמסר)",
  "achievements": "הישגים מרכזיים (ריק אם לא נמסר)",
  "callToAction": "קריאה לפעולה (ריק אם לא נמסר)"
}
`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4o",
      response_format: { type: "json_object" },
    });

    const response = completion.choices[0]?.message?.content || "{}";
    return JSON.parse(response);
  } catch (error) {
    console.error("Error extracting partial OnePager:", error);
    return {};
  }
}

// ניתוח שלמות השדות
async function analyzeFieldsCompleteness(
  data: Partial<OnePagerData>
): Promise<Record<string, FieldCompleteness>> {
  const fields: Record<string, FieldCompleteness> = {};
  const currentTime = new Date();

  // הגדרת השדות והבדיקות
  const fieldDefinitions = [
    { name: "about", required: true, minLength: 20 },
    { name: "mission", required: true, minLength: 15 },
    { name: "values", required: false, minLength: 10 },
    { name: "financial", required: true, minLength: 15 },
    { name: "achievements", required: false, minLength: 10 },
    { name: "callToAction", required: false, minLength: 10 },
  ];

  // בדיקת כל שדה
  for (const field of fieldDefinitions) {
    const value = data[field.name as keyof OnePagerData] || "";
    const isEmpty = !value || value.trim() === "";
    const isPartial = !isEmpty && value.length < field.minLength;

    const status: FieldStatus = isEmpty
      ? "empty"
      : isPartial
      ? "partial"
      : "complete";
    const score = isEmpty
      ? 0
      : isPartial
      ? 3
      : Math.min(10, 5 + Math.floor(value.length / 20));

    fields[field.name] = {
      fieldName: field.name,
      status,
      requiredForCompletion: field.required,
      score,
      feedback: getFeedbackForField(field.name, status, value),
      lastUpdated: currentTime,
    };
  }

  return fields;
}

// חישוב ציון כולל
function calculateOverallScore(
  fields: Record<string, FieldCompleteness>
): number {
  let totalScore = 0;

  // ציונים גבוהים יותר לשדות חשובים
  const fieldWeights: Record<string, number> = {
    about: 2.5,
    mission: 2,
    financial: 2,
    values: 1,
    achievements: 1.5,
    callToAction: 1,
  };

  let totalWeight = 0;

  for (const fieldName in fields) {
    const weight = fieldWeights[fieldName] || 1;
    totalScore += fields[fieldName].score * weight;
    totalWeight += weight;
  }

  return Math.round((totalScore / totalWeight) * 10) / 10;
}

// קבלת שדות לשיפור
function getFieldsToImprove(
  fields: Record<string, FieldCompleteness>
): string[] {
  const toImprove: string[] = [];

  // קודם כל שדות הכרחיים חסרים
  for (const fieldName of REQUIRED_FIELDS) {
    if (fields[fieldName]?.status === "empty") {
      toImprove.push(fieldName);
    }
  }

  // אחר כך שדות הכרחיים חלקיים
  for (const fieldName of REQUIRED_FIELDS) {
    if (fields[fieldName]?.status === "partial") {
      toImprove.push(fieldName);
    }
  }

  // לבסוף שדות לא הכרחיים חסרים
  for (const fieldName in fields) {
    if (
      !REQUIRED_FIELDS.includes(fieldName) &&
      fields[fieldName].status === "empty"
    ) {
      toImprove.push(fieldName);
    }
  }

  return toImprove;
}

function getNextFieldToFocus(
  fields: Record<string, FieldCompleteness>
): string {
  for (const fieldName of REQUIRED_FIELDS) {
    if (fields[fieldName]?.status === "empty") {
      return fieldName;
    }
  }

  for (const fieldName of REQUIRED_FIELDS) {
    if (fields[fieldName]?.status === "partial") {
      return fieldName;
    }
  }

  for (const fieldName in fields) {
    if (fields[fieldName].status === "empty") {
      return fieldName;
    }
  }

  let lowestScore = 10;
  let lowestField = Object.keys(fields)[0];

  for (const fieldName in fields) {
    if (fields[fieldName].score < lowestScore) {
      lowestScore = fields[fieldName].score;
      lowestField = fieldName;
    }
  }

  return lowestField;
}

function getFeedbackForField(
  fieldName: string,
  status: FieldStatus,
  value: string
): string {
  if (status === "empty") {
    return `שדה ${getHebrewFieldName(fieldName)} חסר. יש למלא מידע זה.`;
  }

  if (status === "partial") {
    return `מידע ${getHebrewFieldName(fieldName)} חלקי. יש להרחיב תיאור זה.`;
  }

  if (value.length < 50) {
    return `מידע ${getHebrewFieldName(fieldName)} תקין, אך ניתן להרחיב.`;
  }

  return `מידע ${getHebrewFieldName(fieldName)} מפורט ושלם.`;
}

async function generateFollowUpQuestions(
  fieldsToImprove: string[],
  history: string[]
): Promise<Record<string, string>> {
  if (fieldsToImprove.length === 0) {
    return {};
  }

  const questions: Record<string, string> = {};

  for (const field of fieldsToImprove.slice(0, 3)) {
    questions[field] = await generateQuestionForField(field, history);
  }

  return questions;
}

async function generateQuestionForField(
  field: string,
  history: string[]
): Promise<string> {
  try {
    const fieldQuestionMap: Record<string, string> = {
      about: "מה בדיוק המיזם שלכם עושה ולמי הוא מיועד?",
      mission: "מהו החזון והמטרה של המיזם בטווח הארוך?",
      values: "אילו ערכי ליבה מנחים את המיזם שלכם?",
      financial: "איך המודל העסקי שלכם עובד ומהם מקורות ההכנסה?",
      achievements: "אילו הישגים משמעותיים או אבני דרך כבר השגתם?",
      callToAction: "מה הייתם רוצים שקוראי ה-One Pager יעשו אחרי קריאתו?",
    };

    if (history.length < 4) {
      return (
        fieldQuestionMap[field] ||
        `ספר עוד על ה${getHebrewFieldName(field)} של המיזם`
      );
    }

    const prompt = `
הנה שיחה עם יזם:
${history.join("\n")}

אני צריך לשאול שאלה ממוקדת כדי לקבל מידע על ${getHebrewFieldName(
      field
    )} של המיזם.
השאלה צריכה להיות מותאמת למה שכבר נאמר בשיחה ולהשיג מידע משלים.
השאלה צריכה להיות קצרה (משפט אחד), ממוקדת ובעברית טבעית.

השאלה:
`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4o",
      max_tokens: 100,
      temperature: 0.7,
    });

    return (
      completion.choices[0]?.message?.content?.trim() || fieldQuestionMap[field]
    );
  } catch (error) {
    console.error("Error generating question:", error);
    return `ספר עוד על ה${getHebrewFieldName(field)} של המיזם`;
  }
}

function getHebrewFieldName(fieldName: string): string {
  const hebrewNames: Record<string, string> = {
    about: "תיאור המיזם",
    mission: "חזון ומטרה",
    values: "ערכי הליבה",
    financial: "מודל עסקי",
    achievements: "הישגים",
    callToAction: "קריאה לפעולה",
  };

  return hebrewNames[fieldName] || fieldName;
}

type FieldStatus = "empty" | "partial" | "complete";

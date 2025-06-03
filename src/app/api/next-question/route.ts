import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

// שאלות קבועות שאפשר להשתמש בהן
const DEFAULT_QUESTIONS = [
  "ספר לי מה המיזם שלכם עושה ולמי הוא מיועד?",
  "מהו החזון והמטרה ארוכת הטווח של המיזם?",
  "איך המודל העסקי שלכם עובד? מהם מקורות ההכנסה?",
  "מהם הערכים המרכזיים שמנחים את החברה?",
  "אילו הישגים משמעותיים כבר השגתם עד כה?",
  "מה הייתם רוצים שהקוראים יעשו אחרי קריאת ה-One Pager?",
];

export async function POST(req: NextRequest) {
  try {
    const { history } = await req.json();

    if (!history || !Array.isArray(history) || history.length === 0) {
      return NextResponse.json(
        { nextQuestion: DEFAULT_QUESTIONS[0] },
        { status: 200 }
      );
    }

    // בדיקת שלמות השדות לזיהוי החסרים
    let fieldsToFocus = [];
    try {
      const completenessRes = await fetch(
        new URL("/api/check-completeness", req.url),
        {
          method: "POST",
          body: JSON.stringify({ history }),
          headers: { "Content-Type": "application/json" },
        }
      );

      if (completenessRes.ok) {
        const completenessData = await completenessRes.json();
        fieldsToFocus = completenessData.fieldsToImprove || [];

        // אם יש שאלה מוצעת מוכנה, השתמש בה
        if (
          completenessData.suggestedQuestions &&
          Object.keys(completenessData.suggestedQuestions).length > 0
        ) {
          const nextField = completenessData.nextFieldToFocus;
          if (nextField && completenessData.suggestedQuestions[nextField]) {
            return NextResponse.json(
              { nextQuestion: completenessData.suggestedQuestions[nextField] },
              { status: 200 }
            );
          }
        }
      }
    } catch (error) {
      console.error("Error checking completeness:", error);
      // ממשיך לגישה הסטנדרטית אם יש שגיאה
    }

    // בדיקה האם זו השאלה הראשונה
    if (
      history.length === 0 ||
      !history.some((msg) => msg.startsWith("סוכן:"))
    ) {
      return NextResponse.json(
        { nextQuestion: DEFAULT_QUESTIONS[0] },
        { status: 200 }
      );
    }

    // בניית פרומפט חכם לשאלה הבאה עם התמקדות בשדות חסרים
    const prompt = `
אתה עוזר חכם שמייצר שאלה הבאה בשיחה עם יזם כדי ליצור One Pager איכותי.
One Pager הוא דף מידע קצר שמתמצת מיזם עסקי. הנה השדות החשובים שצריך לכלול בו:
- תיאור המיזם: מה המיזם עושה ולמי הוא מיועד
- חזון ומטרה: המטרה ארוכת הטווח של המיזם
- מודל עסקי: איך המיזם מרוויח כסף
- ערכי ליבה: הערכים שמנחים את המיזם
- הישגים: אבני דרך משמעותיות שכבר הושגו
- קריאה לפעולה: מה רוצים שהקוראים יעשו אחרי קריאת ה-One Pager

הנה ההיסטוריה של השיחה עד כה:
${history.join("\n")}

${
  fieldsToFocus.length > 0
    ? `ניתוח תוכן גילה שחסר מידע לגבי השדות הבאים: ${fieldsToFocus.join(", ")}. 
  אנא התמקד באחד מהם בשאלה הבאה.`
    : "שאל שאלה שתעזור להשלים מידע חסר ולהעמיק את הבנת המיזם."
}

שאלה הבאה (בעברית, משפט אחד, ממוקד וקצר):
`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4o",
      temperature: 0.7,
      max_tokens: 150,
    });

    const nextQuestion =
      completion.choices[0]?.message?.content?.trim() || DEFAULT_QUESTIONS[0];

    return NextResponse.json({ nextQuestion }, { status: 200 });
  } catch (error) {
    console.error("Error generating next question:", error);
    return NextResponse.json(
      {
        error: "Failed to generate next question",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

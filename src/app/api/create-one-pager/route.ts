import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { chatHistory } = body;

    if (!chatHistory || !Array.isArray(chatHistory)) {
      return NextResponse.json(
        { error: "Missing or invalid chatHistory" },
        { status: 400 }
      );
    }

    const prompt = `
הנה תמלול שיחה עם יזם על מיזם חדש:

${chatHistory.join("\n")}

מטרה: צור סיכום one-pager שיווקי תמציתי ואפקטיבי המציג את המיזם בצורה מקצועית.

הנחיות:
1. הסתמך אך ורק על המידע מהשיחה - אל תמציא פרטים.
2. צור תוכן תמציתי אך משכנע בכל קטגוריה.
3. בכל קטגוריה, הגבל את האורך לכ-50-80 מילים בלבד.
4. המסר צריך להיות אפקטיבי, מדויק ומותאם למטרות שיווקיות.

החזר את התוצאה בפורמט JSON בדיוק עם השדות הבאים:
{
  "about": "תיאור קצר וממוקד של המיזם - מה הוא, מה הוא עושה, ולמי הוא מיועד",
  "mission": "החזון והמטרה של המיזם - מה הוא שואף להשיג",
  "values": "הערכים המרכזיים של המיזם והעקרונות המנחים אותו",
  "financial": "תמצית המודל העסקי ו/או המצב הפיננסי של המיזם",
  "achievements": "הישגים עיקריים או אבני דרך של המיזם עד כה",
  "callToAction": "קריאה לפעולה - מה היזם רוצה שהקורא יעשה אחרי קריאת ה-One Pager"
}
`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4",
    });

    const raw = completion.choices[0]?.message?.content || "";
    const jsonStart = raw.indexOf("{");
    if (jsonStart === -1)
      throw new Error("Invalid response format from OpenAI");

    const json = raw.slice(jsonStart);
    const parsed = JSON.parse(json);

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Error generating One Pager:", error);
    return NextResponse.json(
      {
        error: "Failed to generate One Pager",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

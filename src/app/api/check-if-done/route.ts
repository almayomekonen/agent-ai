import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import type {
  ChatCompletionSystemMessageParam,
  ChatCompletionUserMessageParam,
  ChatCompletionAssistantMessageParam,
} from "openai/resources/chat/completions";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { history } = body;

    if (!history || !Array.isArray(history)) {
      return NextResponse.json(
        { error: "Missing or invalid history" },
        { status: 400 }
      );
    }

    const systemPrompt = `
אתה סוכן AI מראיין יזמים ליצירת One Pager. עליך לשאול שאלות ממוקדות כדי להשלים מידע חסר.
אל תחרוג מ-6 שאלות בסך הכול.

שים לב: אם אחת מהתשובות אינה ברורה, ריקה, כללית מדי או לא עונה על השאלה — אין להתקדם!
במקרה כזה, החזר שאלה שמחדדת או מבקשת הבהרה.

נושאים הכרחיים לבדיקה:
1. מהות המיזם וערך ייחודי (מה המוצר/שירות?)
2. קהל יעד והבעיה הנפתרת (למי ומה הבעיה?)
3. מודל עסקי ומקורות הכנסה (איך מרוויחים כסף?)
4. חזון וערכים (לאן חותרים?)
5. הישגים (מה כבר הושג?)

אם כל המידע קיים - החזר את המחרוזת DONE בלבד.
`;

    const messages: (
      | ChatCompletionSystemMessageParam
      | ChatCompletionUserMessageParam
      | ChatCompletionAssistantMessageParam
    )[] = [
      { role: "system", content: systemPrompt },
      ...(history.map((msg: string, index: number) => ({
        role: index % 2 === 0 ? "assistant" : "user",
        content: msg,
      })) as (
        | ChatCompletionUserMessageParam
        | ChatCompletionAssistantMessageParam
      )[]),
      {
        role: "user",
        content:
          "בהתבסס על השיחה עד כה, האם אפשר להפיק כבר One Pager? אם כן החזר DONE, אחרת החזר את השאלה החסרה הבאה בלבד.",
      },
    ];

    const response = await openai.chat.completions.create({
      messages,
      model: "gpt-4o",
      temperature: 0.3,
      max_tokens: 150,
    });

    const content = response.choices[0]?.message?.content?.trim() || "";

    const done = content === "DONE";
    const nextQuestion = done ? null : content;

    return NextResponse.json({ done, nextQuestion });
  } catch (error) {
    console.error("Error checking if done:", error);
    return NextResponse.json(
      {
        error: "Failed to check completion",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

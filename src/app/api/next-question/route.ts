import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";

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
אתה סוכן AI חכם שמראיין יזמים כדי ליצור One Pager למיזם שלהם. 
מטרתך היא להוציא את המידע החיוני ביותר במינימום שאלות (מקסימום 4 שאלות בסך הכל).

הנחיות חשובות:
1. שאל שאלה אחת בלבד בכל פעם, אך ודא שהיא מקיפה ועמוקה.
2. התמקד בשאלות שיוציאו את המידע החיוני ביותר להכנת One Pager מקצועי.
3. הימנע משאלות כלליות מדי - התאם את השאלה למידע שכבר התקבל.
4. התחשב בכמה שאלות כבר נשאלו, והתמקד בפערי מידע.

נושאי מפתח שחייבים לכסות:
- מהות המיזם והערך הייחודי שלו
- קהל היעד והבעיה שהמיזם פותר
- מודל עסקי/הכנסות
- חזון, ערכים והישגים
`;

    const messages: ChatCompletionMessageParam[] = [
      { role: "system", content: systemPrompt },
      ...(history.map((msg: string, index: number) => ({
        role: index % 2 === 0 ? "assistant" : "user",
        content: msg,
      })) as ChatCompletionMessageParam[]),
      {
        role: "user",
        content:
          "מה השאלה הבאה והאפקטיבית ביותר שתעזור לי ליצור One Pager מקיף למיזם?",
      },
    ];

    const response = await openai.chat.completions.create({
      messages,
      model: "gpt-4",
      temperature: 0.7,
    });

    const nextQuestion = response.choices[0]?.message?.content || "";
    return NextResponse.json({ nextQuestion });
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

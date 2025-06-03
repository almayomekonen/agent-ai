import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { REQUIRED_FIELDS } from "../../types/completeness";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
  maxRetries: 3,
  timeout: 60000,
});

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const startTime = Date.now();

  try {
    const body = await req.json();
    const { history: chatHistory } = body;

    if (!chatHistory || !Array.isArray(chatHistory)) {
      return NextResponse.json(
        {
          error: "Missing or invalid chatHistory",
          details: "A valid array of conversation messages is required",
        },
        { status: 400 }
      );
    }

    if (chatHistory.length < 2) {
      return NextResponse.json(
        {
          error: "Insufficient conversation history",
          details: "Please provide more conversation context",
        },
        { status: 400 }
      );
    }

    let fieldsToFocus: string[] = [];
    let isComplete = false;
    let completenessError = null;

    try {
      const completenessRes = await fetch(
        new URL("/api/check-completeness", req.url),
        {
          method: "POST",
          body: JSON.stringify({ history: chatHistory }),
          headers: { "Content-Type": "application/json" },
        }
      );

      if (completenessRes.ok) {
        const completenessData = await completenessRes.json();
        fieldsToFocus = completenessData.fieldsToImprove || [];
        isComplete = completenessData.isComplete;

        const missingRequiredFields = fieldsToFocus.filter((field) =>
          REQUIRED_FIELDS.includes(field)
        );

        if (missingRequiredFields.length > 0) {
          console.warn(
            `Creating One Pager with missing required fields: ${missingRequiredFields.join(
              ", "
            )}`
          );
        }
      } else {
        completenessError = `Completeness check failed with status ${completenessRes.status}`;
        console.error(completenessError);
      }
    } catch (error) {
      completenessError =
        error instanceof Error ? error.message : String(error);
      console.error("Error checking completeness:", error);
    }

    const systemMessage = isComplete
      ? "אתה מחלץ סיכום שיווקי תמציתי ומקצועי מתוך שיחה עם יזם, לצורך יצירת One Pager. אל תמציא מידע שאינו מופיע בשיחה. החזר אך ורק JSON תקני במבנה שהוגדר."
      : `אתה מחלץ סיכום שיווקי תמציתי ומקצועי מתוך שיחה עם יזם, לצורך יצירת One Pager. 
      שים לב שחסר מידע בשדות הבאים: ${fieldsToFocus.join(", ")}. 
      השתמש במה שקיים בשיחה ואל תמציא מידע. אם אין מידע כלל עבור שדה מסוים, השאר אותו ריק.
      החזר אך ורק JSON תקני במבנה שהוגדר.`;

    const messages: ChatCompletionMessageParam[] = [
      {
        role: "system",
        content: systemMessage,
      },
      {
        role: "user",
        content: chatHistory.join("\n"),
      },
    ];

    const functions = [
      {
        name: "generate_one_pager",
        description:
          "מחזיר סיכום שיווקי תמציתי בפורמט One Pager על בסיס שיחה עם יזם.",
        parameters: {
          type: "object",
          properties: {
            about: {
              type: "string",
              description:
                "תיאור קצר וממוקד של המיזם - מה הוא, מה הוא עושה, ולמי הוא מיועד",
            },
            mission: {
              type: "string",
              description: "חזון ומטרה של המיזם",
            },
            values: {
              type: "string",
              description: "ערכים מרכזיים ועקרונות מנחים",
            },
            financial: {
              type: "string",
              description: "המודל העסקי או מצב פיננסי עכשווי",
            },
            achievements: {
              type: "string",
              description: "הישגים עיקריים או אבני דרך",
            },
            callToAction: {
              type: "string",
              description: "קריאה לפעולה לאחר קריאת ה-One Pager",
            },
          },
          required: [
            "about",
            "mission",
            "values",
            "financial",
            "achievements",
            "callToAction",
          ],
        },
      },
    ];

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages,
        tools: [
          {
            type: "function",
            function: functions[0],
          },
        ],
        tool_choice: {
          type: "function",
          function: { name: "generate_one_pager" },
        },
      });

      const toolCall = completion.choices[0].message?.tool_calls?.[0];
      if (!toolCall || toolCall.function.name !== "generate_one_pager") {
        throw new Error("Missing or invalid tool function call");
      }

      let args;
      try {
        args = JSON.parse(toolCall.function.arguments);
      } catch (error) {
        console.error("JSON parse error:", error, toolCall.function.arguments);
        throw new Error("Failed to parse function arguments as JSON");
      }

      const processingTime = Date.now() - startTime;

      return NextResponse.json({
        ...args,
        _meta: {
          isComplete,
          missingFields: fieldsToFocus,
          completenessError,
          processingTimeMs: processingTime,
          timestamp: new Date().toISOString(),
        },
      });
    } catch (openAIError) {
      console.error("OpenAI API error:", openAIError);

      return NextResponse.json(
        {
          error: "AI model error",
          message: "Failed to generate One Pager with the AI model",
          details:
            openAIError instanceof Error
              ? openAIError.message
              : "Unknown error",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error generating One Pager:", error);

    return NextResponse.json(
      {
        error: "Failed to generate One Pager",
        message: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

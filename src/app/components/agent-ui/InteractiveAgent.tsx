"use client";

import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import AgentQuestion from "./AgentQuestion";
import UserInput from "./UserInput";
import ConversationHistory from "./ConversationHistory";
import OnePagerDisplay from "./OnePagerDisplay";
import TipCard from "./TipCard";
import ThinkingIndicator from "../ui/isThinking";
import type { OnePagerData } from "../../types/onepager";

const MAX_QUESTIONS = 4;

export default function InteractiveAgent() {
  const [conversation, setConversation] = useState<string[]>([]);
  const [userInput, setUserInput] = useState("");
  const [agentQuestion, setAgentQuestion] = useState(
    "שלום! ספר לי מה המיזם שלך?"
  );
  const [isFinished, setIsFinished] = useState(false);
  const [onePager, setOnePager] = useState<OnePagerData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isThinking, setIsThinking] = useState(false); // מצב חדש לחשיבה
  const [questionCount, setQuestionCount] = useState(0);
  const [showFinishEarly, setShowFinishEarly] = useState(false);

  const pdfRef = useRef<HTMLDivElement>(null);

  // מחשב את מספר השאלות ששאל הסוכן (עבור מד ההתקדמות)
  useEffect(() => {
    const agentMessages = conversation.filter((msg) => msg.startsWith("סוכן:"));
    setQuestionCount(agentMessages.length);

    // מציג אפשרות לסיים מוקדם אחרי 2 שאלות
    if (agentMessages.length >= 2 && !isFinished) {
      setShowFinishEarly(true);
    }
  }, [conversation, isFinished]);

  // פונקציה לשליחת התשובה ולקבלת השאלה הבאה
  const sendAnswer = async () => {
    if (!userInput.trim()) return;

    const updatedConversation = [...conversation, `יזם: ${userInput}`];
    setConversation(updatedConversation);
    setUserInput("");

    // בדיקה אם הגענו למספר המקסימלי של שאלות
    const currentQuestionCount = conversation.filter((msg) =>
      msg.startsWith("סוכן:")
    ).length;

    if (currentQuestionCount >= MAX_QUESTIONS - 1) {
      await generateOnePager(updatedConversation);
      return;
    }

    // הפעלת מצב חשיבה לפני קריאה לשרת
    setIsThinking(true);

    // קבלת השאלה הבאה מהסוכן
    try {
      const res = await fetch("/api/next-question", {
        method: "POST",
        body: JSON.stringify({ history: updatedConversation }),
      });

      if (!res.ok) throw new Error("שגיאה בקבלת השאלה הבאה");

      const data = await res.json();
      setAgentQuestion(data.nextQuestion);
      // בדיקה אם התשובה כבר מכילה "סוכן:" כדי למנוע הכפלה
      const formattedQuestion = data.nextQuestion.startsWith("סוכן:")
        ? data.nextQuestion
        : `סוכן: ${data.nextQuestion}`;
      setConversation([...updatedConversation, formattedQuestion]);

      // מציג הודעה אם נשארה שאלה אחת אחרונה
      if (currentQuestionCount === MAX_QUESTIONS - 2) {
        toast.info("זו השאלה האחרונה לפני יצירת ה-One Pager");
      }
    } catch (error) {
      console.error("שגיאה בקבלת השאלה הבאה:", error);
      toast.error("שגיאה בקבלת השאלה הבאה, אנא נסה שוב");
    } finally {
      // כיבוי מצב חשיבה
      setIsThinking(false);
    }
  };

  // פונקציה ליצירת ה-One Pager
  const generateOnePager = async (conversationHistory: string[]) => {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/create-one-pager", {
        method: "POST",
        body: JSON.stringify({ chatHistory: conversationHistory }),
      });

      if (!res.ok) throw new Error("שגיאה ביצירת ה-One Pager");

      const data = await res.json();
      setOnePager(data);
      setIsFinished(true);
      toast.success("🎉 One Pager נוצר בהצלחה");
    } catch (error) {
      console.error("שגיאה ביצירת ה-One Pager:", error);
      toast.error("שגיאה ביצירת ה-One Pager, אנא נסה שוב");
    } finally {
      setIsGenerating(false);
    }
  };

  // פונקציה לסיום מוקדם ויצירת ה-One Pager
  const finishEarly = async () => {
    if (conversation.length < 2) return;
    await generateOnePager(conversation);
  };

  // פונקציה להורדת ה-PDF
  const handleDownloadPDF = async () => {
    if (!pdfRef.current) return;
    setIsDownloading(true);

    try {
      const html2pdf = (await import("html2pdf.js")).default;
      await html2pdf()
        .set({
          margin: 0.5,
          filename: `OnePager-${new Date().toISOString().split("T")[0]}.pdf`,
          html2canvas: { scale: 2 },
          jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
        })
        .from(pdfRef.current)
        .save();

      toast.success("📄 PDF הורד בהצלחה");
    } catch (error) {
      console.error("שגיאה בהורדת ה-PDF:", error);
      toast.error("שגיאה בהורדת ה-PDF, אנא נסה שוב");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <main className="min-h-screen px-6 py-8 sm:px-8 max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-orange-400 to-pink-500 text-transparent bg-clip-text">
        🚀 סוכן מדבר - One Pager
      </h1>

      {/* מד התקדמות - מציג רק כשהשיחה לא הסתיימה */}
      {!isFinished && (
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-10">
          <div
            className="bg-gradient-to-r from-orange-400 to-pink-500 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${(questionCount / MAX_QUESTIONS) * 100}%` }}
          ></div>
          <div className="text-sm text-gray-500 text-center mt-3">
            שאלה {questionCount} מתוך {MAX_QUESTIONS}
          </div>
        </div>
      )}

      {/* אזור השאלות והתשובות */}
      {!isFinished && (
        <div className="space-y-4">
          {/* הצגת אינדיקטור חשיבה או השאלה */}
          {isThinking ? (
            <ThinkingIndicator />
          ) : (
            <AgentQuestion question={agentQuestion} />
          )}

          <UserInput
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onSend={sendAnswer}
            isGenerating={isGenerating || isThinking} // השבתת הכפתור גם בזמן חשיבה
          />

          {/* כפתור לסיום מוקדם */}
          {showFinishEarly &&
            !isThinking && ( // מסתיר בזמן חשיבה
              <div className="flex justify-center mt-4">
                <button
                  onClick={finishEarly}
                  className="px-4 py-2 text-sm bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 flex items-center gap-2 shadow-md"
                  disabled={isGenerating || isThinking}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  צור One Pager עכשיו
                </button>
              </div>
            )}
        </div>
      )}

      {/* היסטוריית השיחה */}
      {conversation.length > 0 && (
        <ConversationHistory messages={conversation} />
      )}

      {/* תצוגת ה-One Pager */}
      {onePager && (
        <OnePagerDisplay
          onePager={onePager}
          pdfRef={pdfRef}
          onDownload={handleDownloadPDF}
          isDownloading={isDownloading}
        />
      )}

      <TipCard />
    </main>
  );
}

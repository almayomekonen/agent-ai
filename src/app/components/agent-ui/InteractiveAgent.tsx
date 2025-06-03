"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { toast } from "sonner";
import dynamic from "next/dynamic";
import AgentQuestion from "./AgentQuestion";
import UserInput from "./UserInput";
import ConversationHistory from "./ConversationHistory";
import TipCard from "./TipCard";
import ThinkingIndicator from "../ui/isThinking";
import { useConversationStore } from "@/lib/conversationStore";

const ProfessionalOnePagerDisplay = dynamic(
  () => import("../pdf/ProfessionalOnePagerDisplay"),
  {
    loading: () => (
      <div className="w-full p-8 rounded-xl bg-gray-800/30 animate-pulse flex justify-center items-center">
        <p className="text-gray-400">טוען את ה-One Pager...</p>
      </div>
    ),
    ssr: false,
  }
);

const MAX_QUESTIONS = 6;
const API_TIMEOUT = 30000;

export default function InteractiveAgent() {
  const [userInput, setUserInput] = useState("");
  const pdfRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const {
    conversation,
    questionCount,
    isFinished,
    onePager,
    isGenerating,
    isThinking,
    isDownloading,
    showFinishEarly,
    addMessage,
    setOnePager,
    setFinished,
    setIsThinking,
    setIsGenerating,
    setIsDownloading,
    setShowFinishEarly,
  } = useConversationStore();

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  useEffect(() => {
    const agentMessages = conversation.filter((msg) => msg.startsWith("סוכן:"));
    setShowFinishEarly(agentMessages.length >= 2 && !isFinished);
  }, [conversation, isFinished, setShowFinishEarly]);

  const fetchWithTimeout = useCallback(
    async (url: string, options: RequestInit) => {
      abortControllerRef.current = new AbortController();
      const { signal } = abortControllerRef.current;

      const timeoutId = setTimeout(() => {
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }
      }, API_TIMEOUT);

      try {
        const response = await fetch(url, { ...options, signal });
        clearTimeout(timeoutId);
        return response;
      } catch (error) {
        clearTimeout(timeoutId);
        throw error;
      }
    },
    []
  );

  const sendAnswer = async () => {
    if (!userInput.trim()) return;

    const updatedConversation = [...conversation, `יזם: ${userInput}`];
    setUserInput("");

    const currentQuestionCount = updatedConversation.filter((msg) =>
      msg.startsWith("סוכן:")
    ).length;

    if (currentQuestionCount >= MAX_QUESTIONS) {
      await generateOnePager(updatedConversation);
      return;
    }

    setIsThinking(true);

    try {
      const res = await fetchWithTimeout("/api/next-question", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ history: updatedConversation }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "שגיאה בקבלת השאלה הבאה");
      }

      const data = await res.json();
      const formattedQuestion = data.nextQuestion.startsWith("סוכן:")
        ? data.nextQuestion
        : `סוכן: ${data.nextQuestion}`;

      addMessage(`יזם: ${userInput}`);
      addMessage(formattedQuestion);

      if (currentQuestionCount === MAX_QUESTIONS - 1) {
        toast.info("זו השאלה האחרונה לפני יצירת ה-One Pager");
      }
    } catch (error) {
      console.error("שגיאה בקבלת השאלה הבאה:", error);
      if (error instanceof DOMException && error.name === "AbortError") {
        toast.error("הבקשה לקחה יותר מדי זמן. אנא נסה שוב.");
      } else {
        toast.error("שגיאה בקבלת השאלה הבאה, אנא נסה שוב");
      }

      addMessage(`יזם: ${userInput}`);
    } finally {
      setIsThinking(false);
    }
  };

  const generateOnePager = async (conversationHistory: string[]) => {
    setIsGenerating(true);
    try {
      const res = await fetchWithTimeout("/api/create-one-pager", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ history: conversationHistory }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "שגיאה ביצירת ה-One Pager");
      }

      const data = await res.json();
      setOnePager(data);
      setFinished(true);
      toast.success("🎉 One Pager נוצר בהצלחה");
    } catch (error) {
      console.error("שגיאה ביצירת ה-One Pager:", error);
      if (error instanceof DOMException && error.name === "AbortError") {
        toast.error(
          "יצירת ה-One Pager לקחה יותר מדי זמן. אנא נסה שוב בעוד מספר רגעים."
        );
      } else {
        toast.error("שגיאה ביצירת ה-One Pager, אנא נסה שוב");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const finishEarly = async () => {
    if (conversation.length < 2) return;
    await generateOnePager(conversation);
  };

  const handleDownloadPDF = async () => {
    if (!pdfRef.current) return;
    setIsDownloading(true);

    try {
      const html2pdfModule = await import("html2pdf.js");
      const html2pdf = html2pdfModule.default;

      const preprocessHtml = (element: HTMLElement): HTMLElement => {
        try {
          const allElements = element.querySelectorAll("*");

          allElements.forEach((el: Element) => {
            if (el instanceof HTMLElement) {
              const style = window.getComputedStyle(el);

              const hasOklch = (prop: string): boolean => {
                try {
                  const propValue = style.getPropertyValue(prop);
                  return (
                    typeof propValue === "string" && propValue.includes("oklch")
                  );
                } catch {
                  return false;
                }
              };

              if (hasOklch("color")) {
                el.style.color = "#1f2937";
              }
              if (hasOklch("background-color")) {
                el.style.backgroundColor = "white";
              }
              if (hasOklch("border-color")) {
                el.style.borderColor = "#e5e7eb";
              }
            }
          });
        } catch (error) {
          console.warn("Non-critical error in PDF preprocessing:", error);
        }

        return element;
      };

      const date = new Date();
      const formattedDate = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

      await html2pdf()
        .set({
          margin: 0,
          filename: `OnePager-${formattedDate}.pdf`,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: {
            scale: 2,
            useCORS: true,
            letterRendering: true,
            logging: false,
            dpi: 300,
            width: 794,
            height: 1123,
            onclone: preprocessHtml,
          },
          jsPDF: {
            unit: "mm",
            format: "a4",
            orientation: "portrait",
            compress: true,
          },
          pagebreak: { mode: "avoid-all" },
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

  const latestAgentQuestion =
    [...conversation].reverse().find((msg) => msg.startsWith("סוכן:")) ||
    "שלום! ספר לי מה המיזם שלך?";

  return (
    <main className="min-h-[100dvh] flex flex-col">
      <div className="flex-1 overflow-y-auto px-3 sm:px-8 pb-32 md:pb-28">
        <div className="max-w-4xl mx-auto space-y-6 pt-4 sm:pt-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-center bg-gradient-to-r from-orange-400 to-pink-500 text-transparent bg-clip-text break-words">
            🚀 סוכן מדבר - One Pager
          </h1>

          {!isFinished && (
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6 sm:mb-10">
              <div
                className="bg-gradient-to-r from-orange-400 to-pink-500 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${(questionCount / MAX_QUESTIONS) * 100}%` }}
              ></div>
              <div className="text-sm text-gray-500 text-center mt-2">
                שאלה {questionCount} מתוך {MAX_QUESTIONS}
              </div>
            </div>
          )}

          {!isFinished && conversation.length <= 4 && <TipCard />}

          <div className="space-y-4 sm:space-y-6">
            {conversation.length > 0 && (
              <ConversationHistory messages={conversation} />
            )}

            {!isFinished && (
              <div className="mt-3 mb-3 sm:mt-4 sm:mb-4">
                {isThinking ? (
                  <ThinkingIndicator />
                ) : (
                  <AgentQuestion question={latestAgentQuestion} />
                )}
              </div>
            )}
          </div>

          {onePager && (
            <ProfessionalOnePagerDisplay
              onePager={onePager}
              pdfRef={pdfRef}
              onDownload={handleDownloadPDF}
              isDownloading={isDownloading}
            />
          )}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black to-transparent pb-3 pt-8 z-10">
        <div className="max-w-4xl mx-auto px-3 sm:px-8">
          {!isFinished && (
            <div className="space-y-3">
              <UserInput
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onSend={sendAnswer}
                isGenerating={isGenerating || isThinking}
              />

              {showFinishEarly && !isThinking && (
                <div className="flex justify-center mt-2">
                  <button
                    onClick={finishEarly}
                    className="px-3 py-1.5 sm:px-4 sm:py-2 text-sm bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 flex items-center gap-1 sm:gap-2 shadow-md"
                    disabled={isGenerating || isThinking}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      className="sm:w-4 sm:h-4"
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
        </div>
      </div>
    </main>
  );
}

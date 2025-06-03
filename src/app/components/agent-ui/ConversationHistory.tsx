"use client";

import React, { useEffect, useRef } from "react";

interface ConversationHistoryProps {
  messages: string[];
}

export default function ConversationHistory({
  messages,
}: ConversationHistoryProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll למטה כשמגיעה הודעה חדשה
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (messages.length === 0) return null;

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center border border-orange-400/30">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            className="text-orange-300"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
        </div>
        <h2 className="text-lg sm:text-xl font-semibold text-orange-300">
          שיחה עד כה:
        </h2>
      </div>

      {messages.map((msg, idx) => {
        const isUserMessage = msg.startsWith("יזם:");
        const isAgentMessage = msg.startsWith("סוכן:");
        const cleanMessage = msg.replace(/^(יזם:|סוכן:)\s*/, "");

        return (
          <div
            key={idx}
            className={`group transition-all duration-300 hover:scale-[1.01] ${
              isUserMessage ? "ml-4 sm:ml-8" : "mr-4 sm:mr-8"
            }`}
          >
            <div
              className={`relative p-3 sm:p-4 rounded-xl shadow-lg backdrop-blur-sm border transition-all duration-300 ${
                isUserMessage
                  ? "bg-gradient-to-r from-orange-900/30 via-orange-800/20 to-orange-700/30 border-orange-500/30 hover:border-orange-400/50"
                  : isAgentMessage
                  ? "bg-gradient-to-r from-blue-900/30 via-indigo-800/20 to-blue-700/30 border-blue-500/30 hover:border-blue-400/50"
                  : "bg-gray-800/40 border-gray-600/30"
              }`}
            >
              {/* Message Type Indicator */}
              <div className="flex items-start gap-3">
                <div
                  className={`flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold ${
                    isUserMessage
                      ? "bg-orange-500/20 text-orange-300 border border-orange-400/40"
                      : isAgentMessage
                      ? "bg-blue-500/20 text-blue-300 border border-blue-400/40"
                      : "bg-gray-500/20 text-gray-300 border border-gray-400/40"
                  }`}
                >
                  {isUserMessage ? "👤" : isAgentMessage ? "🤖" : "💬"}
                </div>

                <div className="flex-1 min-w-0">
                  {/* Message Header */}
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-xs sm:text-sm font-medium ${
                        isUserMessage
                          ? "text-orange-300"
                          : isAgentMessage
                          ? "text-blue-300"
                          : "text-gray-300"
                      }`}
                    >
                      {isUserMessage
                        ? "היזם"
                        : isAgentMessage
                        ? "הסוכן"
                        : "הודעה"}
                    </span>
                    <div
                      className={`w-1 h-1 rounded-full ${
                        isUserMessage
                          ? "bg-orange-400"
                          : isAgentMessage
                          ? "bg-blue-400"
                          : "bg-gray-400"
                      }`}
                    ></div>
                  </div>

                  {/* Message Content */}
                  <p className="text-white text-sm sm:text-base leading-relaxed whitespace-pre-wrap break-words">
                    {cleanMessage}
                  </p>
                </div>
              </div>

              {/* Side Border */}
              <div
                className={`absolute top-0 ${
                  isUserMessage ? "right-0" : "left-0"
                } w-1 h-full rounded-full ${
                  isUserMessage
                    ? "bg-gradient-to-b from-orange-400 to-orange-600"
                    : isAgentMessage
                    ? "bg-gradient-to-b from-blue-400 to-blue-600"
                    : "bg-gradient-to-b from-gray-400 to-gray-600"
                }`}
              ></div>
            </div>
          </div>
        );
      })}

      {/* Auto-scroll anchor */}
      <div ref={messagesEndRef} className="h-1" />
    </div>
  );
}

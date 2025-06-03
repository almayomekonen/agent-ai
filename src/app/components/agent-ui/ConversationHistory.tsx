"use client";

import React, { useEffect, useRef } from "react";

interface ConversationHistoryProps {
  messages: string[];
}

export default function ConversationHistory({
  messages,
}: ConversationHistoryProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 🚀 Auto scroll למטה כשמגיעה הודעה חדשה
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="space-y-2">
      <h2 className="text-xl font-semibold text-orange-400 flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
          />
        </svg>
        שיחה:
      </h2>

      {messages.map((msg, idx) => (
        <div
          key={idx}
          className={`p-3 rounded-lg ${
            msg.startsWith("יזם:")
              ? "bg-neutral-800/70 border-r-4 border-orange-500 mr-4"
              : "bg-blue-600/20 border-r-4 border-blue-500 mr-4"
          } backdrop-blur-sm transition-all hover:shadow-md`}
        >
          {msg}
        </div>
      ))}

      {/* 🎯 הנקודה שה-scroll יגיע אליה */}
      <div ref={messagesEndRef} />
    </div>
  );
}

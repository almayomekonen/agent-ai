"use client";

import { ChangeEvent, KeyboardEvent } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { Button } from "@/app/components/ui/button";
import { SendHorizonal } from "lucide-react";

interface UserInputProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onSend: () => void;
  isGenerating: boolean;
}

export default function UserInput({
  value,
  onChange,
  onSend,
  isGenerating,
}: UserInputProps) {
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="relative bg-neutral-800/90 border border-neutral-600 rounded-xl transition-all hover:border-neutral-500 focus-within:border-orange-400/50">
      <TextareaAutosize
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        placeholder="כתוב את התשובה שלך כאן..."
        minRows={1}
        maxRows={4}
        className="w-full bg-transparent text-white placeholder:text-gray-400 text-sm focus:outline-none resize-none p-4 pr-16"
      />
      <div className="absolute bottom-3 left-3">
        <Button
          onClick={onSend}
          disabled={isGenerating || !value.trim()}
          className="p-3 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white transition-colors disabled:opacity-50"
        >
          {isGenerating ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <SendHorizonal className="w-5 h-5" />
          )}
        </Button>
      </div>
    </div>
  );
}

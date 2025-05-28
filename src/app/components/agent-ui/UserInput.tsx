import { Button } from "@/app/components/ui/button";
import { ChangeEvent } from "react";

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
  return (
    <div className="relative">
      <textarea
        value={value}
        onChange={onChange}
        placeholder="תשובת היזם..."
        className="w-full bg-neutral-800/50 backdrop-blur-sm text-white border border-neutral-700 rounded-xl p-4 h-28 focus:outline-none focus:ring-2 focus:ring-orange-400/50 focus:border-orange-500 transition-all shadow-inner resize-none"
      />
      <div className="absolute bottom-3 right-3">
        <Button
          onClick={onSend}
          disabled={isGenerating || !value.trim()}
          className="rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-medium px-4 py-2 transition-all disabled:opacity-50 shadow-lg shadow-orange-500/20"
        >
          {isGenerating ? (
            <span className="flex items-center">
              <svg
                className="animate-spin -mr-1 ml-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              מעבד...
            </span>
          ) : (
            <span>🚀 שלח תשובה</span>
          )}
        </Button>
      </div>
    </div>
  );
}

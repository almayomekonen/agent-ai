interface AgentQuestionProps {
  question: string;
}

export default function AgentQuestion({ question }: AgentQuestionProps) {
  return (
    <div className="relative">
      <div className="absolute -left-4 -top-4 bg-blue-500 rounded-full p-2 shadow-lg shadow-blue-500/20">
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
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>
      </div>
      <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 backdrop-blur-sm rounded-xl p-5 pl-6 shadow-xl border border-blue-500/20">
        <p className="text-white font-medium">{question}</p>
      </div>
    </div>
  );
}

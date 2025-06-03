interface AgentQuestionProps {
  question: string;
}

// מיפוי נושאים לאייקונים, שמות תצוגה וצבעים
const topicMap: Record<
  string,
  { icon: string; label: string; colorClass: string }
> = {
  מיזם: {
    icon: "🚀",
    label: "על המיזם",
    colorClass: "from-blue-500 to-indigo-600",
  },
  תיאור: {
    icon: "📝",
    label: "תיאור המיזם",
    colorClass: "from-blue-500 to-indigo-600",
  },
  עושה: {
    icon: "🔍",
    label: "על המיזם",
    colorClass: "from-blue-500 to-indigo-600",
  },
  חזון: {
    icon: "🔭",
    label: "חזון ומטרה",
    colorClass: "from-purple-500 to-indigo-600",
  },
  מטרה: {
    icon: "🎯",
    label: "חזון ומטרה",
    colorClass: "from-purple-500 to-indigo-600",
  },
  ערכים: {
    icon: "💎",
    label: "ערכי ליבה",
    colorClass: "from-pink-500 to-purple-600",
  },
  עקרונות: {
    icon: "⚖️",
    label: "ערכי ליבה",
    colorClass: "from-pink-500 to-purple-600",
  },
  מודל: {
    icon: "💰",
    label: "מודל עסקי",
    colorClass: "from-emerald-500 to-teal-600",
  },
  עסקי: {
    icon: "💼",
    label: "מודל עסקי",
    colorClass: "from-emerald-500 to-teal-600",
  },
  הכנסה: {
    icon: "💵",
    label: "מודל עסקי",
    colorClass: "from-emerald-500 to-teal-600",
  },
  הישג: {
    icon: "🏆",
    label: "הישגים",
    colorClass: "from-amber-500 to-orange-600",
  },
  "אבן דרך": {
    icon: "📊",
    label: "אבני דרך",
    colorClass: "from-amber-500 to-orange-600",
  },
  פעולה: {
    icon: "🔔",
    label: "קריאה לפעולה",
    colorClass: "from-red-500 to-orange-600",
  },
  יעד: { icon: "📣", label: "קהל יעד", colorClass: "from-blue-400 to-sky-500" },
  לקוח: {
    icon: "👥",
    label: "קהל יעד",
    colorClass: "from-blue-400 to-sky-500",
  },
  תחרות: {
    icon: "⚔️",
    label: "תחרות בשוק",
    colorClass: "from-rose-500 to-red-600",
  },
  מתחרים: {
    icon: "🥊",
    label: "תחרות בשוק",
    colorClass: "from-rose-500 to-red-600",
  },
  טכנולוגיה: {
    icon: "⚙️",
    label: "טכנולוגיה",
    colorClass: "from-gray-500 to-slate-600",
  },
  פתרון: {
    icon: "💡",
    label: "הפתרון",
    colorClass: "from-yellow-400 to-amber-500",
  },
  בעיה: {
    icon: "🔧",
    label: "הבעיה והפתרון",
    colorClass: "from-yellow-400 to-amber-500",
  },
  אתגר: {
    icon: "🧩",
    label: "אתגרים",
    colorClass: "from-fuchsia-500 to-pink-600",
  },
};

// פונקציה לזיהוי הנושא מתוך השאלה
function identifyTopic(question: string): {
  icon: string;
  label: string;
  colorClass: string;
} {
  // הסר את הפרפיקס "סוכן: " אם קיים
  const cleanQuestion = question.replace(/^סוכן: /, "").toLowerCase();

  // בדוק אם אחד ממילות המפתח קיים בשאלה
  for (const [keyword, details] of Object.entries(topicMap)) {
    if (cleanQuestion.includes(keyword.toLowerCase())) {
      return details;
    }
  }

  // ברירת מחדל אם לא נמצא נושא ספציפי
  return {
    icon: "💬",
    label: "שאלה נוספת",
    colorClass: "from-blue-500 to-indigo-600",
  };
}

export default function AgentQuestion({ question }: AgentQuestionProps) {
  const { icon, label, colorClass } = identifyTopic(question);

  return (
    <div className="relative">
      <div
        className={`absolute -left-5 -top-5 bg-gradient-to-br ${colorClass} rounded-full p-2.5 shadow-lg animate-pulse-slow`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          fill="none"
          viewBox="0 0 24 24"
          stroke="white"
          className="animate-pulse-slow"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>
      </div>
      <div
        className={`bg-gradient-to-r from-blue-500/10 to-indigo-500/10 backdrop-blur-sm rounded-xl p-5 pl-7 shadow-xl border border-blue-500/20 hover:shadow-lg transition-all`}
      >
        <div className="flex items-center gap-3">
          <span
            className="text-3xl transition-all"
            role="img"
            aria-label={label}
          >
            {icon}
          </span>
          <div>
            <p className="text-white font-medium text-lg">{label}</p>
            <p className="text-blue-200/80 text-sm mt-0.5 font-light line-clamp-2 hover:line-clamp-none transition-all">
              {question.replace(/^סוכן: /, "")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

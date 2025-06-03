import React, { useState } from "react";

export default function TipCard() {
  const [isExpanded, setIsExpanded] = useState(false);

  const tips = [
    {
      title: "ענה בהרחבה על השאלות הראשונות",
      description:
        "השאלות הראשונות הן המשמעותיות ביותר. ככל שתספק מידע מפורט יותר בתחילת השיחה, כך ה-One Pager יהיה מקיף ומדויק יותר.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
          />
        </svg>
      ),
    },
    {
      title: "התייחס לכל המידע החיוני",
      description:
        "ודא שאתה מתייחס לערך הייחודי של המיזם, קהל היעד, המודל העסקי, החזון והערכים. אלו הנושאים המרכזיים שיכללו ב-One Pager.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      ),
    },
    {
      title: "הצג מספרים ונתונים אם יש לך",
      description:
        "נתונים ומספרים ספציפיים מוסיפים אמינות ל-One Pager. אם יש לך מידע כמותי על הישגים, לקוחות או הכנסות, שתף אותו.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="bg-gradient-to-r mt-8 from-blue-900/40 via-indigo-900/30 to-purple-900/40 backdrop-blur-sm rounded-xl border border-blue-500/20 shadow-lg hover:shadow-xl transition-all duration-300">
      <div
        className="flex justify-between items-center cursor-pointer p-4 sm:p-5"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 border border-blue-400/30">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              className="sm:w-5 sm:h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-blue-100 font-medium text-sm sm:text-base leading-tight">
              טיפים לשיחה מוצלחת עם הסוכן החכם
            </h2>
          </div>
        </div>

        <div className="flex-shrink-0 ml-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            className="sm:w-5 sm:h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`text-blue-300 transition-transform duration-300 ${
                isExpanded ? "transform rotate-180" : ""
              }`}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      {isExpanded && (
        <div className="px-4 pb-4 sm:px-5 sm:pb-5 space-y-4">
          {tips.map((tip, index) => (
            <div key={index} className="flex gap-3 items-start group">
              <div className="w-8 h-8 bg-blue-500/10 rounded-full flex items-center justify-center flex-shrink-0 border border-blue-400/20 group-hover:bg-blue-500/20 transition-colors">
                <span className="text-blue-300 group-hover:text-blue-200 transition-colors">
                  {tip.icon}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-medium text-blue-100 text-sm sm:text-base mb-1 group-hover:text-white transition-colors">
                  {tip.title}
                </h3>
                <p className="text-xs sm:text-sm text-blue-200/80 leading-relaxed group-hover:text-blue-100/90 transition-colors">
                  {tip.description}
                </p>
              </div>
            </div>
          ))}

          <div className="bg-blue-500/10 backdrop-blur-sm p-3 sm:p-4 rounded-lg mt-4 border border-blue-400/20">
            <div className="flex items-start gap-2">
              <span className="text-lg flex-shrink-0 mt-0.5">💡</span>
              <p className="text-xs sm:text-sm text-blue-100 font-medium leading-relaxed">
                <strong>טיפ מתקדם:</strong> תוכל ללחוץ על כפתור &quot;צור One
                Pager עכשיו&quot; בכל שלב אם אתה מרגיש שסיפקת מספיק מידע.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

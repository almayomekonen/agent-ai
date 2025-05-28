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
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100 shadow-sm hover:shadow transition-all">
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h2 className="text-lg font-medium text-blue-800 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="text-blue-600 mr-2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          טיפים לשיחה מוצלחת עם הסוכן החכם
        </h2>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className={`text-blue-600 transition-transform duration-300 ${
            isExpanded ? "transform rotate-180" : ""
          }`}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>

      {isExpanded && (
        <div className="mt-4 space-y-4">
          {tips.map((tip, index) => (
            <div key={index} className="flex gap-3 items-start">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600">{tip.icon}</span>
              </div>
              <div>
                <h3 className="font-medium text-blue-900">{tip.title}</h3>
                <p className="text-sm text-blue-700 mt-1">{tip.description}</p>
              </div>
            </div>
          ))}

          <div className="bg-blue-100 p-3 rounded-lg mt-4">
            <p className="text-sm text-blue-800 font-medium">
              💡 טיפ מתקדם: תוכל ללחוץ על כפתור &quot;צור One Pager עכשיו&quot;
              בכל שלב אם אתה מרגיש שסיפקת מספיק מידע.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

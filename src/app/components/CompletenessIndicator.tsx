import React from "react";
import { ConversationStatus } from "../types/completeness";
import { CheckCircle, AlertTriangle, Info } from "lucide-react";

interface CompletenessIndicatorProps {
  conversationStatus: ConversationStatus;
}

const fieldNameMapping: Record<string, string> = {
  about: "תיאור המיזם",
  mission: "חזון ומטרה",
  values: "ערכי ליבה",
  financial: "מודל עסקי",
  achievements: "הישגים",
  callToAction: "קריאה לפעולה",
};

const statusIcons = {
  empty: <AlertTriangle className="w-4 h-4 text-red-500" />,
  partial: <Info className="w-4 h-4 text-yellow-500" />,
  complete: <CheckCircle className="w-4 h-4 text-green-500" />,
};

const statusColors = {
  empty: "bg-red-50 border-red-200",
  partial: "bg-yellow-50 border-yellow-200",
  complete: "bg-green-50 border-green-200",
};

const statusBadgeColors = {
  empty: "bg-red-100 text-red-800",
  partial: "bg-yellow-100 text-yellow-800",
  complete: "bg-green-100 text-green-800",
};

export const CompletenessIndicator: React.FC<CompletenessIndicatorProps> = ({
  conversationStatus,
}) => {
  const { fields, overallScore } = conversationStatus;

  const sortedFields = Object.entries(fields).sort((a, b) => {
    const statusOrder = { empty: 0, partial: 1, complete: 2 };
    const statusA = statusOrder[a[1].status];
    const statusB = statusOrder[b[1].status];

    if (statusA !== statusB) return statusA - statusB;
    if (a[1].requiredForCompletion !== b[1].requiredForCompletion) {
      return a[1].requiredForCompletion ? -1 : 1;
    }
    return 0;
  });

  const requiredFields = sortedFields.filter(
    ([, field]) => field.requiredForCompletion
  );
  const requiredCompleted = requiredFields.filter(
    ([, field]) => field.status === "complete"
  ).length;
  const requiredCompletionPercentage =
    requiredFields.length > 0
      ? Math.round((requiredCompleted / requiredFields.length) * 100)
      : 0;

  const ProgressBar = () => (
    <div className="w-full bg-gray-200 rounded-md h-2 overflow-hidden">
      <div
        className={`h-full transition-all duration-500 ease-in-out ${
          requiredCompletionPercentage === 100
            ? "bg-green-500"
            : "bg-yellow-400"
        }`}
        style={{ width: `${requiredCompletionPercentage}%` }}
      />
    </div>
  );

  const getOverallScoreBadge = () => {
    if (overallScore >= 8) return "bg-green-100 text-green-800";
    if (overallScore >= 5) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <div className="p-6 border border-gray-200 rounded-xl bg-white shadow-sm">
      <div className="flex flex-col gap-4">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-lg text-gray-800">
            סטטוס שלמות ה-One Pager
          </h3>
          <span
            className={`px-3 py-1 rounded-md text-sm font-medium ${getOverallScoreBadge()}`}
          >
            ציון: {overallScore}/10
          </span>
        </div>

        {/* Progress Section */}
        <div>
          <p className="mb-2 text-sm text-gray-600">
            שדות הכרחיים: {requiredCompletionPercentage}% הושלמו
          </p>
          <ProgressBar />
        </div>

        <div className="border-t border-gray-200 pt-3 mt-2" />

        <h4 className="font-bold text-md text-gray-800">פירוט סטטוס השדות:</h4>

        {/* Fields Status */}
        <div className="flex flex-col gap-3">
          {sortedFields.map(([fieldName, field]) => (
            <div
              key={fieldName}
              className={`p-3 rounded-lg border flex items-center gap-3 transition-all duration-200 hover:shadow-sm ${
                statusColors[field.status]
              }`}
            >
              <div className="flex-shrink-0">{statusIcons[field.status]}</div>

              <div className="flex-1">
                <span className="font-medium text-gray-800">
                  {fieldNameMapping[fieldName] || fieldName}
                  {field.requiredForCompletion && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    statusBadgeColors[field.status]
                  }`}
                  title={field.feedback || ""}
                >
                  {field.status === "empty"
                    ? "חסר"
                    : field.status === "partial"
                    ? "חלקי"
                    : "מלא"}
                </span>

                <span className="text-sm text-gray-600 min-w-[40px] text-center">
                  {field.score}/10
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Recommendation */}
        {conversationStatus.status !== "complete" && (
          <div className="mt-2 p-4 rounded-lg bg-blue-50 border border-blue-200">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <p className="font-medium text-blue-700 text-sm">
                המלצה: השלם את השדות החסרים לקבלת One Pager מלא ואיכותי.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompletenessIndicator;

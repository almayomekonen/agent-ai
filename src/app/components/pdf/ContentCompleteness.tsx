import React from "react";
import CompletenessIndicator from "../CompletenessIndicator";
import { ConversationStatus } from "../../types/completeness";

interface ContentCompletenessProps {
  isLoading: boolean;
  completenessStatus: ConversationStatus | null;
  onRefresh: () => void;
}

const ContentCompleteness: React.FC<ContentCompletenessProps> = ({
  isLoading,
  completenessStatus,
  onRefresh,
}) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        ניתוח שלמות התוכן ב-One Pager
      </h2>
      {isLoading ? (
        <LoadingState />
      ) : completenessStatus ? (
        <CompletenessIndicator conversationStatus={completenessStatus} />
      ) : (
        <EmptyState onRefresh={onRefresh} />
      )}
    </div>
  );
};

const LoadingState: React.FC = () => (
  <div className="text-center py-10">
    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
    <p className="text-gray-600">בודק את שלמות התוכן...</p>
  </div>
);

interface EmptyStateProps {
  onRefresh: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onRefresh }) => (
  <div className="text-center py-10">
    <p className="text-gray-600">אין נתוני שלמות זמינים. נסה לרענן.</p>
    <button
      onClick={onRefresh}
      className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
    >
      בדוק שלמות
    </button>
  </div>
);

export default ContentCompleteness;

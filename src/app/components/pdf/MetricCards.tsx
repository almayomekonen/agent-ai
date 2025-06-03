import React from "react";
import { DollarSign, Target, FileText, Trophy } from "lucide-react";

interface MetricCardsProps {
  metrics: {
    businessMaturity: string;
    visionClarity: string;
    contentDepth: string;
    achievementFocus: string;
  };
  insights: {
    financialWords: number;
    missionSentences: number;
    totalContent: number;
    achievementItems: number;
  };
}

export const MetricCards: React.FC<MetricCardsProps> = ({
  metrics,
  insights,
}) => {
  return (
    <div className="w-full px-6 py-6 bg-gray-50 rounded-xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border-l-4 border-green-500 shadow-md hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">בגרות עסקית</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {metrics.businessMaturity}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {insights.financialWords} מילים
              </p>
            </div>
            <div className="bg-green-50 p-3 rounded-full">
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border-l-4 border-blue-500 shadow-md hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">בהירות חזון</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">
                {metrics.visionClarity}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {insights.missionSentences} משפטים
              </p>
            </div>
            <div className="bg-blue-50 p-3 rounded-full">
              <Target className="w-8 h-8 text-blue-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border-l-4 border-purple-500 shadow-md hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">עומק תוכן</p>
              <p className="text-2xl font-bold text-purple-600 mt-1">
                {metrics.contentDepth}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {insights.totalContent} תווים
              </p>
            </div>
            <div className="bg-purple-50 p-3 rounded-full">
              <FileText className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border-l-4 border-orange-500 shadow-md hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">מיקוד הישגים</p>
              <p className="text-2xl font-bold text-orange-600 mt-1">
                {metrics.achievementFocus}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {insights.achievementItems} נושאים
              </p>
            </div>
            <div className="bg-orange-50 p-3 rounded-full">
              <Trophy className="w-8 h-8 text-orange-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricCards;

import React from "react";
import { FileText, Target, Zap, DollarSign, Trophy } from "lucide-react";
import type { OnePagerData } from "../../types/onepager";

interface OnePagerContentProps {
  onePager: OnePagerData;
  insights: {
    aboutWords: number;
    aboutLength: number;
    financialWords: number;
    achievementItems: number;
  };
  metrics: {
    businessMaturity: string;
    visionClarity: string;
    contentDepth: string;
    achievementFocus: string;
  };
  onEdit?: (field: string, value: string) => void;
  fullWidth?: boolean;
}

const OnePagerContent: React.FC<OnePagerContentProps> = ({
  onePager,
  insights,
  metrics,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
      <div className="lg:col-span-5 space-y-6">
        <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">אודות המיזם</h2>
            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {insights.aboutWords} מילים
            </span>
          </div>
          <p className="text-gray-700 leading-relaxed text-lg">
            {onePager.about}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-purple-100 to-purple-200 rounded-lg">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">חזון ומטרה</h2>
              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {metrics.visionClarity}
              </span>
            </div>
            <p className="text-gray-700 leading-relaxed">{onePager.mission}</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-green-100 to-green-200 rounded-lg">
                <Zap className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">ערכי הליבה</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">{onePager.values}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-green-100 to-green-200 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">המודל העסקי</h2>
            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {insights.financialWords} מילים - {metrics.businessMaturity}
            </span>
          </div>
          <p className="text-gray-700 leading-relaxed">{onePager.financial}</p>
        </div>
      </div>

      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-yellow-100 to-yellow-200 rounded-lg">
              <Trophy className="w-6 h-6 text-yellow-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">הישגים עיקריים</h2>
            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {insights.achievementItems} נושאים
            </span>
          </div>
          <p className="text-gray-700 leading-relaxed">
            {onePager.achievements}
          </p>
        </div>

        <div className="bg-gradient-to-r from-red-500 to-red-700 rounded-xl p-6 shadow-lg text-white">
          <div className="flex flex-col items-center text-center mb-4">
            <div className="text-3xl mb-2">🚀</div>
            <h2 className="text-xl font-bold">הזמנה לפעולה</h2>
          </div>
          <p className="leading-relaxed opacity-90 mb-4 text-center">
            {onePager.callToAction}
          </p>
          <button className="w-full bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm border border-white border-opacity-20 py-3 px-4 rounded-lg font-bold text-white transition-all duration-300">
            📧 צור קשר עכשיו
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnePagerContent;

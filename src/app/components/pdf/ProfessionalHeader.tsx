import React from "react";
import { InsightsType, MetricsType } from "../../utils/content-metrics";

interface ProfessionalHeaderProps {
  insights: InsightsType;
  metrics: MetricsType;
}

const ProfessionalHeader: React.FC<ProfessionalHeaderProps> = ({
  insights,
  metrics,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6 text-white">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-right">
            <h1 className="text-3xl font-bold mb-2">One Pager יזמי</h1>
            <p className="text-blue-100 text-lg">
              ניתוח מתקדם • {insights.totalContent} תווים •{" "}
              {metrics.contentDepth}
            </p>
          </div>
          <div className="text-center md:text-right">
            <p className="text-blue-100 text-sm">נוצר על ידי</p>
            <p className="text-xl font-bold">Methodian AI</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalHeader;

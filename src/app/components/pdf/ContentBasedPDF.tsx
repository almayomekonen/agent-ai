import React from "react";
import { OnePagerData } from "../../types/onepager";
import {
  extractRealInsights,
  calculateContentMetrics,
} from "../../utils/content-metrics";

interface ContentBasedPDFProps {
  data: OnePagerData;
}

const ContentBasedPDF: React.FC<ContentBasedPDFProps> = ({ data }) => {
  const insights = extractRealInsights(data);
  const metrics = calculateContentMetrics(insights);
  const currentDate = new Date().toLocaleDateString("he-IL");

  return (
    <div
      className="w-full min-h-screen bg-white font-sans text-sm leading-relaxed text-gray-800 box-border"
      style={{
        width: "794px",
        minHeight: "1123px",
        background: "white",
        color: "#1f2937",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Header עם פרטי התוכן */}
      <div
        className="p-8 text-white text-center"
        style={{
          background: "linear-gradient(to right, #3b82f6, #8b5cf6)",
          color: "white",
        }}
      >
        <h1 className="text-3xl font-bold mb-2">🚀 One Pager יזמי</h1>
        <p className="text-sm opacity-90 mb-5">
          תמצית אסטרטגית מקצועית • {insights.totalContent} תווים •{" "}
          {insights.aboutWords + insights.financialWords} מילים
        </p>
        <div
          className="inline-block py-1.5 px-4 text-xs font-bold rounded-xl"
          style={{
            background: "rgba(255,255,255,0.15)",
            border: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          📊 רמת פירוט: {metrics.contentDepth} | בגרות עסקית:{" "}
          {metrics.businessMaturity}
        </div>
      </div>

      {/* מטריקות תוכן */}
      <div
        className="p-6 md:p-8 border-b border-gray-200"
        style={{ background: "#f8fafc" }}
      >
        <h3 className="text-sm font-bold text-gray-800 mb-4 text-center">
          📈 ניתוח תוכן מקצועי
        </h3>

        <div className="flex justify-around">
          <MetricItem
            icon="💼"
            title="בגרות עסקית"
            value={metrics.businessMaturity}
            subtext={`${insights.financialWords} מילים`}
            color="#059669"
          />
          <MetricItem
            icon="🎯"
            title="בהירות חזון"
            value={metrics.visionClarity}
            subtext={`${insights.missionSentences} משפטים`}
            color="#0ea5e9"
          />
          <MetricItem
            icon="📝"
            title="עומק תוכן"
            value={metrics.contentDepth}
            subtext={`${insights.totalContent} תווים`}
            color="#f59e0b"
          />
          <MetricItem
            icon="🏆"
            title="מיקוד הישגים"
            value={metrics.achievementFocus}
            subtext={`${insights.achievementItems} נושאים`}
            color="#8b5cf6"
          />
        </div>
      </div>

      {/* תוכן המיזם */}
      <div className="p-6 md:p-8">
        {/* אודות המיזם */}
        <ContentSection
          icon="🎯"
          iconBg="#3b82f6"
          title="אודות המיזם"
          stats={`(${insights.aboutWords} מילים, ${insights.aboutLength} תווים)`}
          content={data.about}
        />

        {/* שורה 1: חזון + ערכים */}
        <div className="flex gap-4 mb-4 flex-col md:flex-row">
          <ContentSection
            icon="🚀"
            iconBg="#0ea5e9"
            title="חזון ומטרה"
            stats={`(${metrics.visionClarity})`}
            content={data.mission}
            className="flex-1"
          />
          <ContentSection
            icon="⚡"
            iconBg="#059669"
            title="ערכי הליבה"
            content={data.values}
            className="flex-1"
          />
        </div>

        {/* שורה 2: מודל עסקי + הישגים */}
        <div className="flex gap-4 mb-4 flex-col md:flex-row">
          <ContentSection
            icon="💰"
            iconBg="#f59e0b"
            title="המודל העסקי"
            stats={`(${insights.financialWords} מילים - ${metrics.businessMaturity})`}
            content={data.financial}
            className="flex-[1.5]"
            bgColor="#fffbeb"
            borderColor="#fbbf24"
            textColor="#92400e"
          />
          <ContentSection
            icon="🏆"
            iconBg="#f59e0b"
            title="הישגים עיקריים"
            stats={`(${insights.achievementItems} נושאים)`}
            content={data.achievements}
            className="flex-1"
            bgColor="#fffbeb"
            borderColor="#fbbf24"
            textColor="#92400e"
          />
        </div>

        {/* CTA + סיכום תוכן */}
        <div className="flex gap-4 flex-col md:flex-row">
          {/* CTA */}
          <div
            className="rounded-lg p-4 text-white text-center flex-1"
            style={{
              background: "linear-gradient(to right, #dc2626, #b91c1c)",
              color: "white",
            }}
          >
            <div className="text-2xl mb-1">🚀</div>
            <h3 className="text-sm font-bold mb-2">הזמנה לפעולה</h3>
            <p className="text-xs leading-normal opacity-95 mb-2 text-right">
              {data.callToAction}
            </p>
            <div
              className="py-1.5 px-3 text-xs font-bold inline-block rounded-md"
              style={{
                background: "rgba(255,255,255,0.15)",
                border: "1px solid rgba(255,255,255,0.3)",
              }}
            >
              📧 צור קשר עכשיו
            </div>
          </div>

          {/* סיכום התוכן */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 flex-1">
            <h4 className="text-xs font-bold text-gray-800 mb-3 text-center">
              📊 ניתוח תוכן
            </h4>

            <div className="text-xs text-gray-600 text-right leading-relaxed">
              <div className="mb-1.5">
                <strong>סך תווים:</strong>{" "}
                {insights.totalContent.toLocaleString()}
              </div>
              <div className="mb-1.5">
                <strong>מילים במודל עסקי:</strong> {insights.financialWords}
              </div>
              <div className="mb-1.5">
                <strong>משפטי חזון:</strong> {insights.missionSentences}
              </div>
              <div>
                <strong>רמת פירוט:</strong> {metrics.contentDepth}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer עם פרטי התוכן */}
      <div
        className="py-3 px-8 flex justify-between items-center"
        style={{
          background: "#1f2937",
          color: "white",
          position: "absolute",
          bottom: "0",
          left: "0",
          right: "0",
        }}
      >
        <div className="text-xs opacity-80">
          נוצר על ידי ניתוח תוכן מתקדם • {currentDate} • בגרות עסקית:{" "}
          {metrics.businessMaturity}
        </div>
        <div className="flex items-center gap-1.5">
          <div
            className="w-[18px] h-[18px] rounded flex items-center justify-center text-xs"
            style={{ background: "#3b82f6", color: "white" }}
          >
            🧠
          </div>
          <div className="text-xs font-bold" style={{ color: "#3b82f6" }}>
            METHODIAN AI
          </div>
        </div>
      </div>
    </div>
  );
};

interface MetricItemProps {
  icon: string;
  title: string;
  value: string;
  subtext: string;
  color: string;
}

const MetricItem: React.FC<MetricItemProps> = ({
  icon,
  title,
  value,
  subtext,
  color,
}) => (
  <div className="text-center flex-1">
    <div className="text-base mb-1">{icon}</div>
    <div className="text-[9px] text-gray-500 font-bold mb-0.5">{title}</div>
    <div className="text-sm font-bold" style={{ color }}>
      {value}
    </div>
    <div className="text-[8px] text-gray-400">{subtext}</div>
  </div>
);

interface ContentSectionProps {
  icon: string;
  iconBg: string;
  title: string;
  stats?: string;
  content: string;
  className?: string;
  bgColor?: string;
  borderColor?: string;
  textColor?: string;
}

const ContentSection: React.FC<ContentSectionProps> = ({
  icon,
  iconBg,
  title,
  stats,
  content,
  className = "",
  bgColor = "white",
  borderColor = "#e5e7eb",
  textColor = "#374151",
}) => (
  <div
    className={`rounded-lg p-4 mb-4 ${className}`}
    style={{
      background: bgColor,
      border: `1px solid ${borderColor}`,
    }}
  >
    <div className="flex items-center mb-3">
      <div
        className="text-white w-7 h-7 rounded flex items-center justify-center text-xs ml-2.5"
        style={{ background: iconBg, color: "white" }}
      >
        {icon}
      </div>
      <h2 className="text-sm font-bold text-gray-800">{title}</h2>
      {stats && <span className="text-xs text-gray-500 mr-2">{stats}</span>}
    </div>
    <p
      className="text-xs leading-relaxed text-right"
      style={{ color: textColor }}
    >
      {content}
    </p>
  </div>
);

export default ContentBasedPDF;

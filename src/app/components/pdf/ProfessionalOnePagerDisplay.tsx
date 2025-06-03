import React, {
  MutableRefObject,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { Download } from "lucide-react";
import type { OnePagerData } from "../../types/onepager";
import MetricCards from "./MetricCards";
import OnePagerContent from "./OnePagerContent";
import AnalysisDashboard from "./AnalysisDashboard";
import { ConversationStatus } from "../../types/completeness";
import ContentBasedPDF from "../pdf/ContentBasedPDF";
import ProfessionalHeader from "./ProfessionalHeader";
import TabNavigation, { TabType } from "./TabNavigation";
import ContentCompleteness from "./ContentCompleteness";
import {
  extractRealInsights,
  calculateContentMetrics,
} from "../../utils/content-metrics";

// Custom PDF-safe component to avoid oklch colors
const PDFSafeWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <div
    style={{
      background: "white",
      color: "#1f2937",
      fontFamily: "Arial, sans-serif",
    }}
  >
    {children}
  </div>
);

interface ProfessionalOnePagerDisplayProps {
  onePager: OnePagerData;
  pdfRef: MutableRefObject<HTMLDivElement | null>;
  onDownload: () => void;
  isDownloading: boolean;
  history?: string[];
}

const ProfessionalOnePagerDisplay: React.FC<
  ProfessionalOnePagerDisplayProps
> = ({ onePager, pdfRef, onDownload, isDownloading, history = [] }) => {
  const [activeTab, setActiveTab] = useState<TabType>("onePager");
  const [completenessStatus, setCompletenessStatus] =
    useState<ConversationStatus | null>(null);
  const [isLoadingStatus, setIsLoadingStatus] = useState(false);

  // Use ref to track if we've already checked completeness for this data
  const checkedRef = useRef<string>("");

  const insights = extractRealInsights(onePager);
  const metrics = calculateContentMetrics(insights);

  const checkCompleteness = useCallback(async () => {
    if (!onePager) return;

    setIsLoadingStatus(true);
    try {
      const res = await fetch("/api/check-completeness", {
        method: "POST",
        body: JSON.stringify({
          onePagerData: onePager,
          history: history,
        }),
      });

      if (!res.ok) throw new Error("שגיאה בבדיקת שלמות השדות");

      const data = await res.json();
      setCompletenessStatus(data.conversationStatus);
    } catch (error) {
      console.error("שגיאה בבדיקת שלמות השדות:", error);
    } finally {
      setIsLoadingStatus(false);
    }
  }, [onePager, history]);

  // בדיקת שלמות השדות בטעינה הראשונית - רק פעם אחת לכל onePager
  useEffect(() => {
    const currentDataKey = JSON.stringify(onePager);
    if (currentDataKey !== checkedRef.current) {
      checkedRef.current = currentDataKey;
      checkCompleteness();
    }
  }, [onePager, checkCompleteness]);

  // רנדור תוכן לפי הלשונית הפעילה
  const renderTabContent = () => {
    switch (activeTab) {
      case "onePager":
        return (
          <OnePagerContent
            onePager={onePager}
            insights={insights}
            metrics={metrics}
          />
        );
      case "analysis":
        return (
          <AnalysisDashboard
            onePager={onePager}
            insights={insights}
            metrics={metrics}
          />
        );
      case "completeness":
        return (
          <ContentCompleteness
            isLoading={isLoadingStatus}
            completenessStatus={completenessStatus}
            onRefresh={checkCompleteness}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="mt-10 space-y-6">
      {/* Header with gradient background */}
      <ProfessionalHeader insights={insights} metrics={metrics} />

      {/* Tab navigation */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* Metric cards - visible in specific tabs */}
      {activeTab !== "completeness" && (
        <MetricCards metrics={metrics} insights={insights} />
      )}

      {/* Tab content */}
      <div className="min-h-[500px]">{renderTabContent()}</div>

      {/* PDF hidden content - wrapped to avoid oklch issues */}
      <div className="hidden">
        <div ref={pdfRef} style={{ background: "white", color: "#1f2937" }}>
          <PDFSafeWrapper>
            <ContentBasedPDF data={onePager} />
          </PDFSafeWrapper>
        </div>
      </div>

      {/* Download button */}
      <div className="flex justify-center mt-8">
        <button
          onClick={onDownload}
          disabled={isDownloading}
          className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
        >
          <Download className="w-5 h-5" />
          {isDownloading
            ? "מכין PDF מתקדם..."
            : "הורד One Pager מבוסס ניתוח תוכן"}
        </button>
      </div>
    </div>
  );
};

export default ProfessionalOnePagerDisplay;

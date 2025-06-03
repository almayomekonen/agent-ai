import { OnePagerData } from "../types/onepager";

export interface InsightsType {
  aboutWords: number;
  aboutLength: number;
  missionSentences: number;
  financialWords: number;
  achievementItems: number;
  ctaLength: number;
  totalContent: number;
}

export interface MetricsType {
  businessMaturity: string;
  visionClarity: string;
  contentDepth: string;
  achievementFocus: string;
}

// 🧠 חילוץ תובנות אמיתיות מהנתונים הקיימים
export const extractRealInsights = (data: OnePagerData): InsightsType => {
  // נתונים אמיתיים על סמך התוכן שהמשתמש הכניס
  const aboutLength = data.about?.length || 0;
  const aboutWords = data.about?.split(" ").length || 0;
  const missionSentences =
    data.mission?.split(".").filter((s) => s.trim()).length || 1;
  const financialWords = data.financial?.split(" ").length || 0;
  const achievementItems =
    data.achievements?.split(/[,.]/).filter((s) => s.trim()).length || 1;
  const ctaLength = data.callToAction?.length || 0;

  return {
    aboutWords,
    aboutLength,
    missionSentences,
    financialWords,
    achievementItems,
    ctaLength,
    totalContent:
      aboutLength +
      (data.mission?.length || 0) +
      (data.financial?.length || 0) +
      (data.achievements?.length || 0) +
      ctaLength,
  };
};

// 📊 חישוב מטריקות אמיתיות על סמך התוכן
export const calculateContentMetrics = (
  insights: InsightsType
): MetricsType => {
  // בגרות עסקית על סמך פירוט המודל העסקי
  const businessMaturity =
    insights.financialWords > 50
      ? "מתקדמת"
      : insights.financialWords > 25
      ? "בינונית"
      : "התחלתית";

  // בהירות חזון על סמך מספר המשפטים
  const visionClarity =
    insights.missionSentences >= 3
      ? "גבוהה"
      : insights.missionSentences >= 2
      ? "בינונית"
      : "בסיסית";

  // עמק תוכן על סמך סך המילים
  const contentDepth =
    insights.totalContent > 800
      ? "מפורט מאוד"
      : insights.totalContent > 500
      ? "מפורט"
      : insights.totalContent > 300
      ? "סטנדרטי"
      : "קצר";

  // מיקוד הישגים
  const achievementFocus =
    insights.achievementItems > 5
      ? "מגוון רחב"
      : insights.achievementItems > 3
      ? "מגוון טוב"
      : "ממוקד";

  return {
    businessMaturity,
    visionClarity,
    contentDepth,
    achievementFocus,
  };
};

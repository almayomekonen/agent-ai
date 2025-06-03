import React from "react";
import {
  BarChart,
  PieChart,
  LineChart,
  ArrowUpRight,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  BarChart2,
  DollarSign,
} from "lucide-react";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import type { OnePagerData } from "../../types/onepager";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

interface AnalysisDashboardProps {
  onePager: OnePagerData;
  insights: {
    aboutWords: number;
    aboutLength: number;
    missionSentences: number;
    financialWords: number;
    achievementItems: number;
    ctaLength: number;
    totalContent: number;
  };
  metrics: {
    businessMaturity: string;
    visionClarity: string;
    contentDepth: string;
    achievementFocus: string;
  };
}

const getMetricScore = (
  value: string,
  metrics: AnalysisDashboardProps["metrics"]
): number => {
  const scoreMap: Record<string, number> = {
    מתקדמת: 10,
    בינונית: 7,
    התחלתית: 4,

    גבוהה: 10,

    "בהירות בינונית": 7,
    "בהירות בסיסית": 4,

    "מפורט מאוד": 10,
    מפורט: 8,
    סטנדרטי: 6,
    קצר: 4,

    "מגוון רחב": 10,
    "מגוון טוב": 7,
    ממוקד: 5,
  };

  if (value === "בינונית" && metrics.visionClarity === value) {
    return 7;
  }
  if (value === "בסיסית" && metrics.visionClarity === value) {
    return 4;
  }

  return scoreMap[value] || 5;
};

const getBenchmarkValues = (metricType: string): number => {
  const benchmarks: Record<string, number> = {
    businessMaturity: 7.5,
    visionClarity: 8,
    contentDepth: 7,
    achievementFocus: 6.5,
  };

  return benchmarks[metricType] || 7;
};

const DollarSignIcon = () => <DollarSign className="w-6 h-6 text-green-600" />;
const VisionIcon = () => <TrendingUp className="w-6 h-6 text-blue-600" />;
const ContentIcon = () => <BarChart2 className="w-6 h-6 text-purple-600" />;
const AchievementIcon = () => (
  <ArrowUpRight className="w-6 h-6 text-yellow-600" />
);
const CheckMarkIcon = () => <CheckCircle className="w-6 h-6 text-green-600" />;

const generateRecommendations = (
  metrics: AnalysisDashboardProps["metrics"],
  insights: AnalysisDashboardProps["insights"]
) => {
  const recommendations = [];

  if (getMetricScore(metrics.businessMaturity, metrics) < 7) {
    recommendations.push({
      title: "חיזוק המודל העסקי",
      description: "פרט יותר את מקורות ההכנסה, מבנה העלויות ויעדים פיננסיים",
      icon: <DollarSignIcon />,
      severity: "medium",
    });
  }

  if (getMetricScore(metrics.visionClarity, metrics) < 8) {
    recommendations.push({
      title: "הבהרת החזון",
      description: "הוסף 1-2 משפטים המתארים את החזון לטווח הארוך",
      icon: <VisionIcon />,
      severity:
        getMetricScore(metrics.visionClarity, metrics) < 5 ? "high" : "medium",
    });
  }

  if (insights.totalContent < 500) {
    recommendations.push({
      title: "העמקת התוכן",
      description: "הוסף תוכן משמעותי בחלקים החשובים",
      icon: <ContentIcon />,
      severity: "medium",
    });
  }

  if (insights.achievementItems < 3) {
    recommendations.push({
      title: "הרחבת הישגים",
      description: "הוסף לפחות 2-3 הישגים נוספים להעשרת הסיפור",
      icon: <AchievementIcon />,
      severity: "medium",
    });
  }

  if (recommendations.length === 0) {
    recommendations.push({
      title: "המשך בכיוון הנוכחי",
      description: "התוכן נראה מאוזן ומפורט היטב",
      icon: <CheckMarkIcon />,
      severity: "low",
    });
  }

  return recommendations;
};

const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({
  onePager,
  insights,
  metrics,
}) => {
  const businessMaturityScore = getMetricScore(
    metrics.businessMaturity,
    metrics
  );
  const visionClarityScore = getMetricScore(metrics.visionClarity, metrics);
  const contentDepthScore = getMetricScore(metrics.contentDepth, metrics);
  const achievementFocusScore = getMetricScore(
    metrics.achievementFocus,
    metrics
  );

  const overallScore = Math.round(
    (businessMaturityScore +
      visionClarityScore +
      contentDepthScore +
      achievementFocusScore) /
      4
  );

  const metricsChartData = {
    labels: ["בגרות עסקית", "בהירות חזון", "עומק תוכן", "מיקוד הישגים"],
    datasets: [
      {
        label: "המיזם שלך",
        data: [
          businessMaturityScore,
          visionClarityScore,
          contentDepthScore,
          achievementFocusScore,
        ],
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 2,
      },
      {
        label: "בנצ׳מרק ענפי",
        data: [
          getBenchmarkValues("businessMaturity"),
          getBenchmarkValues("visionClarity"),
          getBenchmarkValues("contentDepth"),
          getBenchmarkValues("achievementFocus"),
        ],
        backgroundColor: "rgba(139, 92, 246, 0.3)",
        borderColor: "rgba(139, 92, 246, 0.8)",
        borderWidth: 2,
      },
    ],
  };

  const contentDistributionData = {
    labels: ["אודות", "חזון ומטרה", "מודל עסקי", "הישגים", "הזמנה לפעולה"],
    datasets: [
      {
        data: [
          insights.aboutLength || 1,
          onePager.mission?.length || 1,
          onePager.financial?.length || 1,
          onePager.achievements?.length || 1,
          insights.ctaLength || 1,
        ],
        backgroundColor: [
          "rgba(59, 130, 246, 0.8)",
          "rgba(139, 92, 246, 0.8)",
          "rgba(16, 185, 129, 0.8)",
          "rgba(245, 158, 11, 0.8)",
          "rgba(239, 68, 68, 0.8)",
        ],
        borderWidth: 1,
        borderColor: "#ffffff",
      },
    ],
  };

  const recommendations = generateRecommendations(metrics, insights);

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="text-center md:text-right mb-4 md:mb-0">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              ניתוח מתקדם
            </h2>
            <p className="text-gray-600">
              ניתוח מקיף של One Pager עם המלצות ותובנות
            </p>
          </div>

          <div className="flex items-center bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl shadow-sm">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">פוטנציאל לשיפור 🚀</p>
              <div className="relative">
                <div className="w-24 h-24 rounded-full flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 text-white text-3xl font-bold">
                  {overallScore}/10
                </div>
                <div className="absolute -top-1 -right-1 bg-white rounded-full p-1 shadow">
                  {overallScore >= 8 ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : overallScore >= 6 ? (
                    <TrendingUp className="w-5 h-5 text-yellow-500" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-orange-500" />
                  )}
                </div>
              </div>
              <p className="text-sm mt-2 font-medium text-gray-700">
                {overallScore >= 8
                  ? "נראה מצוין! המשך כך"
                  : overallScore >= 6
                  ? "יש בסיס טוב – נשאר לחדד"
                  : "יש פוטנציאל גדול – בוא נחזק יחד"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BarChart className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">מדדי איכות תוכן</h3>
          </div>
          <div className="h-80">
            <Bar
              data={metricsChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    max: 10,
                    ticks: {
                      stepSize: 2,
                    },
                  },
                },
                plugins: {
                  legend: {
                    position: "top",
                    align: "end",
                  },
                  title: {
                    display: false,
                  },
                },
              }}
            />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <PieChart className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">התפלגות תוכן</h3>
          </div>
          <div className="h-80">
            <Doughnut
              data={contentDistributionData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "right",
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-green-100 rounded-lg">
            <ArrowUpRight className="w-5 h-5 text-green-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-800">המלצות לשיפור</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.map((rec, index) => (
            <div
              key={index}
              className={`p-4 rounded-xl border ${
                rec.severity === "high"
                  ? "border-red-200 bg-red-50"
                  : rec.severity === "medium"
                  ? "border-yellow-200 bg-yellow-50"
                  : "border-green-200 bg-green-50"
              }`}
            >
              <div className="flex gap-3">
                <div className="mt-1">{rec.icon}</div>
                <div>
                  <h4 className="font-bold text-gray-800 mb-1">{rec.title}</h4>
                  <p className="text-gray-600 text-sm">{rec.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200 space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <LineChart className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">נתונים מספריים</h3>
            <p className="text-gray-500 text-sm">
              מבט מהיר על אורך, עומק וגיוון התוכן שלך ב-One Pager
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-gray-50 p-4 rounded-xl space-y-1">
            <p className="text-sm text-gray-500">סך תווי תוכן</p>
            <p className="text-3xl font-bold text-gray-800">
              {insights.totalContent}
            </p>
            <p className="text-xs text-gray-500">
              כמות כוללת – מדד לאורכו של המסמך
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl space-y-1">
            <p className="text-sm text-gray-500">מילים באודות</p>
            <p className="text-3xl font-bold text-gray-800">
              {insights.aboutWords}
            </p>
            <p className="text-xs text-gray-500">האם תיארת מספיק על המיזם?</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl space-y-1">
            <p className="text-sm text-gray-500">מילים במודל העסקי</p>
            <p className="text-3xl font-bold text-gray-800">
              {insights.financialWords}
            </p>
            <p className="text-xs text-gray-500">
              ככל שתפרט יותר – כך תיראה רציני יותר
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl space-y-1">
            <p className="text-sm text-gray-500">משפטי חזון</p>
            <p className="text-3xl font-bold text-gray-800">
              {insights.missionSentences}
            </p>
            <p className="text-xs text-gray-500">
              חזון ברור משפיע על איך תיתפס
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisDashboard;

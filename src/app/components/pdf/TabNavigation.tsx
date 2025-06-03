import React from "react";

type TabType = "onePager" | "analysis" | "completeness";

interface TabNavigationProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  setActiveTab,
}) => {
  return (
    <div className="flex border-b">
      <TabButton
        active={activeTab === "onePager"}
        onClick={() => setActiveTab("onePager")}
        activeColor="text-blue-600 border-blue-600"
      >
        תצוגת One Pager
      </TabButton>
      <TabButton
        active={activeTab === "analysis"}
        onClick={() => setActiveTab("analysis")}
        activeColor="text-purple-600 border-purple-600"
      >
        ניתוח מתקדם
      </TabButton>
      <TabButton
        active={activeTab === "completeness"}
        onClick={() => setActiveTab("completeness")}
        activeColor="text-green-600 border-green-600"
      >
        שלמות התוכן
      </TabButton>
    </div>
  );
};

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  activeColor: string;
}

const TabButton: React.FC<TabButtonProps> = ({
  active,
  onClick,
  children,
  activeColor,
}) => {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-4 text-center font-bold text-lg transition-all duration-300 ${
        active
          ? `${activeColor} border-b-2`
          : "text-gray-500 hover:text-gray-700"
      }`}
    >
      {children}
    </button>
  );
};

export default TabNavigation;
export type { TabType };

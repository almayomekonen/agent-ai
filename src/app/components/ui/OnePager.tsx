"use client";

import React, { MutableRefObject, useState } from "react";
import type { OnePagerData } from "@/app/types/onepager";
import dynamic from "next/dynamic";

const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  { ssr: false }
);

const PdfTemplate = dynamic(() => import("@/app/components/pdf/PdfTemplate"), {
  ssr: false,
});

interface OnePagerDisplayProps {
  onePager: OnePagerData;
  pdfRef: MutableRefObject<HTMLDivElement | null>;
  onDownload: () => void;
  isDownloading: boolean;
}

export default function OnePagerDisplay({
  onePager,
  pdfRef,
  onDownload,
  isDownloading,
}: OnePagerDisplayProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [activeTab, setActiveTab] = useState<"preview" | "download">("preview");

  // רכיב HTML פשוט לתצוגה בממשק (לא ל-PDF) - משמש גם ל-legacy PDF
  const SimplePDF = ({ data }: { data: OnePagerData }) => (
    <div style={{ padding: "30px", fontFamily: "Arial", color: "#000" }}>
      <h1 style={{ textAlign: "center", color: "#E37B27" }}>🚀 One Pager</h1>
      {Object.entries(data).map(([key, value]) => (
        <div key={key} style={{ marginBottom: "20px" }}>
          <h2
            style={{ fontSize: "18px", fontWeight: "bold", color: "#FFB547" }}
          >
            {key.replace(/([A-Z])/g, " $1")}
          </h2>
          <p>{value}</p>
        </div>
      ))}
    </div>
  );

  // טוען את תצוגת ה-PDF רק כשצריך
  const PdfPreview = dynamic(() => import("@/app/components/pdf/PdfTemplate"), {
    ssr: false,
    loading: () => (
      <div className="w-full h-96 flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="text-center">
          <svg
            className="animate-spin h-10 w-10 text-blue-500 mx-auto mb-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="text-gray-500">טוען תצוגה מקדימה...</p>
        </div>
      </div>
    ),
  });

  return (
    <div className="mt-10 space-y-8">
      {/* הודעת הצלחה */}
      <div className="bg-gradient-to-r from-green-50 to-teal-50 p-4 rounded-lg border border-green-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white text-xl">
            ✓
          </div>
          <div>
            <h3 className="text-lg font-medium text-green-800">
              המיזם שלך מוכן!
            </h3>
            <p className="text-green-600">
              ה-One Pager נוצר בהצלחה. עכשיו אפשר לצפות בו או להוריד אותו בפורמט
              PDF.
            </p>
          </div>
        </div>
      </div>

      {/* טאבים */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex" aria-label="Tabs">
          <button
            onClick={() => setActiveTab("preview")}
            className={`${
              activeTab === "preview"
                ? "border-orange-500 text-orange-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } py-4 px-1 border-b-2 font-medium text-sm w-1/2 text-center`}
          >
            תצוגה מקדימה
          </button>
          <button
            onClick={() => setActiveTab("download")}
            className={`${
              activeTab === "download"
                ? "border-orange-500 text-orange-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } py-4 px-1 border-b-2 font-medium text-sm w-1/2 text-center`}
          >
            הורדה והפצה
          </button>
        </nav>
      </div>

      {/* תצוגת המידע בדף */}
      {activeTab === "preview" && (
        <div className="bg-white/95 backdrop-blur-sm p-8 rounded-xl shadow-2xl text-black space-y-6 border border-neutral-200 transition-all hover:shadow-orange-500/10">
          <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-orange-600 to-amber-500 text-transparent bg-clip-text">
            🚀 One Pager
          </h1>

          {Object.entries(onePager).map(([key, value]) => (
            <div key={key} className="group">
              <h2 className="text-xl font-semibold text-orange-600 capitalize group-hover:text-orange-700 transition-colors flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-orange-500 rounded-full"></span>
                {key.replace(/([A-Z])/g, " $1")}
              </h2>
              <p className="text-gray-800 mt-1 pl-4 border-r-2 border-orange-200 pr-2">
                {value}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* אלמנט מוסתר לשימוש עם html2pdf */}
      <div style={{ display: "none" }}>
        <div ref={pdfRef}>
          <SimplePDF data={onePager} />
        </div>
      </div>

      {/* אפשרויות הורדה */}
      {activeTab === "download" && (
        <div className="bg-white/95 backdrop-blur-sm p-8 rounded-xl shadow-2xl border border-neutral-200">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
            הורדת ה-One Pager
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* אפשרות PDF בסיסי */}
            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="mb-4 text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  className="w-12 h-12 text-red-500 mx-auto"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                  />
                </svg>
                <h3 className="mt-2 text-lg font-semibold text-gray-800">
                  PDF בסיסי
                </h3>
              </div>
              <p className="text-gray-600 mb-4 text-center">
                הורדה מהירה של קובץ PDF בפורמט בסיסי ונקי
              </p>
              <Button
                onClick={onDownload}
                disabled={isDownloading}
                className="w-full rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-3 transition-all"
              >
                {isDownloading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -mr-1 ml-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    מכין PDF בסיסי...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="mr-2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    הורד PDF בסיסי
                  </span>
                )}
              </Button>
            </div>

            {/* אפשרות PDF מקצועי */}
            <div className="border border-gray-200 rounded-lg p-6 bg-gradient-to-b from-blue-50 to-white hover:shadow-md transition-shadow">
              <div className="mb-4 text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  className="w-12 h-12 text-blue-600 mx-auto"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h3 className="mt-2 text-lg font-semibold text-gray-800">
                  PDF מקצועי
                </h3>
                <div className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full mt-1">
                  מומלץ
                </div>
              </div>
              <p className="text-gray-600 mb-4 text-center">
                הורדה של קובץ PDF בעיצוב מקצועי עם גרפים וויזואליזציה
              </p>
              {typeof window !== "undefined" && (
                <PDFDownloadLink
                  document={<PdfTemplate data={onePager} />}
                  fileName={`OnePager-${
                    new Date().toISOString().split("T")[0]
                  }.pdf`}
                  className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 transition-all inline-flex items-center justify-center"
                >
                  {({ loading }) =>
                    loading ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="animate-spin mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        מכין PDF מקצועי...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          className="mr-2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                          />
                        </svg>
                        הורד PDF מקצועי
                      </span>
                    )
                  }
                </PDFDownloadLink>
              )}
            </div>
          </div>

          {/* תצוגה מקדימה של PDF מקצועי */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              תצוגה מקדימה של PDF מקצועי
            </h3>
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="mb-4 flex items-center text-blue-600 hover:text-blue-800 transition-colors"
            >
              {showPreview ? (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="mr-1"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                  הסתר תצוגה מקדימה
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="mr-1"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                  הצג תצוגה מקדימה
                </>
              )}
            </button>
            {showPreview && <PdfPreview data={onePager} />}
          </div>
        </div>
      )}
    </div>
  );
}

// רכיב כפתור פנימי
function Button({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { className?: string }) {
  return (
    <button
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

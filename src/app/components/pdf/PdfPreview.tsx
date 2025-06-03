"use client";

import React, { useState, useEffect } from "react";
import { OnePagerData } from "@/app/types/onepager";
import dynamic from "next/dynamic";

const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
  { ssr: false }
);

const PdfTemplate = dynamic(() => import("@/app/components/pdf/PdfTemplate"), {
  ssr: false,
});

interface PdfPreviewProps {
  data: OnePagerData;
}

export default function PdfPreview({ data }: PdfPreviewProps) {
  const [isClient, setIsClient] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-gray-100 rounded-lg border border-gray-200">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-500">טוען תצוגה מקדימה...</p>
        </div>
      </div>
    );
  }

  const containerClasses = isFullscreen
    ? "fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
    : "w-full h-[600px] overflow-hidden rounded-lg shadow-lg relative";

  return (
    <div className={containerClasses}>
      <button
        onClick={() => setIsFullscreen(!isFullscreen)}
        className="absolute top-2 right-2 z-10 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full transition-all"
        aria-label={isFullscreen ? "צא ממסך מלא" : "מסך מלא"}
      >
        {isFullscreen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5"
            />
          </svg>
        )}
      </button>

      <PDFViewer
        width="100%"
        height="100%"
        style={{
          border: "none",
          borderRadius: isFullscreen ? "0" : "0.5rem",
        }}
      >
        <PdfTemplate data={data} />
      </PDFViewer>
    </div>
  );
}

import { Button } from "@/app/components/ui/button";
import { MutableRefObject } from "react";
import type { OnePagerData } from "../../types/onepager";

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

  return (
    <div className="mt-10 space-y-6">
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

      <div style={{ display: "none" }}>
        <div ref={pdfRef}>
          <SimplePDF data={onePager} />
        </div>
      </div>

      <div className="flex justify-center">
        <Button
          onClick={onDownload}
          disabled={isDownloading}
          className="rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-medium px-6 py-3 transition-all shadow-lg shadow-green-500/20"
        >
          {isDownloading ? (
            <span className="flex items-center">
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
              מכין PDF...
            </span>
          ) : (
            <span className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="mr-1"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              הורד כ-PDF
            </span>
          )}
        </Button>
      </div>
    </div>
  );
}

import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata = {
  title: "סוכן AI ל-One Pager",
  description: "יצירת דוחות עסקיים חכמים בזמן אמת באמצעות שיחה עם יזם.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he" dir="rtl">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="description"
          content="יצירת דוחות עסקיים חכמים בזמן אמת באמצעות שיחה עם יזם."
        />
        <meta
          name="keywords"
          content="One Pager, סוכן AI, יזם, דוח עסקי, שיחה עם יזם"
        />

        <link rel="icon" href="/agent.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans bg-background text-foreground`}
      >
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}

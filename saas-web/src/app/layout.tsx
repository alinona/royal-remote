import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s | EduFlow",
    default: "EduFlow — نظام إدارة المدارس",
  },
  description: "منصة متكاملة وذكية لإدارة المدارس الحكومية",
  keywords: ["إدارة مدارس", "نظام تعليمي", "ذكاء اصطناعي", "حضور", "درجات"],
  authors: [{ name: "EduFlow Team" }],
  creator: "EduFlow",
  metadataBase: new URL("https://eduflow.sa"),
  openGraph: {
    type: "website",
    locale: "ar_SA",
    url: "https://eduflow.sa",
    title: "EduFlow — نظام إدارة المدارس",
    description: "منصة متكاملة وذكية لإدارة المدارس الحكومية",
    siteName: "EduFlow",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8f9fd" },
    { media: "(prefers-color-scheme: dark)",  color: "#0d1117" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

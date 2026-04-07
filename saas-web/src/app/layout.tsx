import type { Metadata } from "next";
import { Inter, Cairo } from "next/font/google";
import "@/styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-display",
  display: "swap",
});

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
      </head>
      <body className={`${inter.variable} ${cairo.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}

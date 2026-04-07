"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { motion } from "framer-motion";

interface AppLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export function AppLayout({ children, title }: AppLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile(e.matches);
      if (e.matches) setMobileMenuOpen(false);
    };
    update(mq);
    mq.addEventListener("change", update as (e: MediaQueryListEvent) => void);
    return () => mq.removeEventListener("change", update as (e: MediaQueryListEvent) => void);
  }, []);

  const mainMargin = isMobile ? 0 : sidebarCollapsed ? 72 : 260;

  return (
    <div className="min-h-screen bg-background geometric-bg" dir="rtl">
      <Sidebar
        collapsed={sidebarCollapsed}
        onCollapse={setSidebarCollapsed}
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
        isMobile={isMobile}
      />
      <Topbar
        sidebarCollapsed={sidebarCollapsed}
        title={title}
        isMobile={isMobile}
        onMobileMenuToggle={() => setMobileMenuOpen(v => !v)}
      />

      <motion.main
        animate={{ marginRight: mainMargin }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="pt-16 min-h-screen"
      >
        <div className="p-4 md:p-6 max-w-[1600px] mx-auto">
          {children}
        </div>
      </motion.main>
    </div>
  );
}

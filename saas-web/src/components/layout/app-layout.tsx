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
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
        onMobileMenuToggle={() => setMobileMenuOpen(true)}
        isMobile={isMobile}
      />

      <motion.main
        animate={{
          marginRight: isMobile ? 0 : (sidebarCollapsed ? 72 : 260),
        }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="pt-16 min-h-screen transition-all"
      >
        <div className="p-4 md:p-6 max-w-[1600px] mx-auto overflow-x-hidden">
          {children}
        </div>
      </motion.main>
    </div>
  );
}

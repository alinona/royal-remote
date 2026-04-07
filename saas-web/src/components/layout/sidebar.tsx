"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Users, GraduationCap, CalendarCheck,
  BarChart3, FolderOpen, Bot, ClipboardList, BookOpen,
  Settings, LogOut, ChevronLeft, School, Bell, Shield,
  Layers, ChevronRight, X
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

const navItems = [
  {
    group: "الرئيسية",
    items: [
      { href: "/dashboard", label: "لوحة التحكم", icon: LayoutDashboard, badge: null },
    ],
  },
  {
    group: "الإدارة الأكاديمية",
    items: [
      { href: "/students", label: "الطلاب", icon: Users, badge: "1248" },
      { href: "/classes", label: "الصفوف والمدرسون", icon: GraduationCap, badge: null },
      { href: "/attendance", label: "الحضور والغياب", icon: CalendarCheck, badge: null },
      { href: "/grades", label: "الدرجات والتقييم", icon: BookOpen, badge: null },
    ],
  },
  {
    group: "الأدوات",
    items: [
      { href: "/files", label: "إدارة الملفات", icon: FolderOpen, badge: null },
      { href: "/ai-assistant", label: "المساعد الذكي", icon: Bot, badge: "جديد" },
      { href: "/reports", label: "التقارير", icon: BarChart3, badge: null },
    ],
  },
  {
    group: "النظام",
    items: [
      { href: "/activity-log", label: "سجل النشاطات", icon: ClipboardList, badge: null },
      { href: "/settings", label: "الإعدادات", icon: Settings, badge: null },
    ],
  },
];

interface SidebarProps {
  collapsed: boolean;
  onCollapse: (v: boolean) => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
  isMobile: boolean;
}

export function Sidebar({ collapsed, onCollapse, mobileOpen, onMobileClose, isMobile }: SidebarProps) {
  const pathname = usePathname();
  const effectiveCollapsed = isMobile ? false : collapsed;

interface SidebarContentProps {
  collapsed: boolean;
  showCollapseToggle: boolean;
  onCollapse?: () => void;
  onNavClick?: () => void;
  pathname: string;
}

function SidebarContent({ collapsed, showCollapseToggle, onCollapse, onNavClick, pathname }: SidebarContentProps) {
  return (
    <>
      <AnimatePresence>
        {isMobile && mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-ink/50 backdrop-blur-sm"
            onClick={onMobileClose}
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ 
          width: effectiveCollapsed ? 72 : 260,
          x: isMobile ? (mobileOpen ? 0 : 260) : 0 // RTL translation
        }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex flex-col",
          "bg-card border-l border-border",
          "shadow-[0_0_40px_hsl(var(--ink)/0.06)]"
        )}
      >
        <div className="flex items-center h-16 px-4 border-b border-border flex-shrink-0 relative">
          <motion.div
            animate={{ justifyContent: effectiveCollapsed ? "center" : "flex-start" }}
            className="flex items-center gap-3 w-full"
          >
            <div className="relative flex-shrink-0">
              <motion.div
                className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-glow"
                whileHover={{ scale: 1.05 }}
              >
                <School className="w-5 h-5 text-white" strokeWidth={2} />
              </motion.div>
              <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-success border-2 border-card" />
            </div>

            <AnimatePresence>
              {!effectiveCollapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <p className="font-bold text-ink text-sm leading-tight">EduFlow</p>
                  <p className="text-[10px] text-ink-muted leading-tight">نظام إدارة المدارس</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {!isMobile && (
            <motion.button
              onClick={() => onCollapse(!collapsed)}
              className={cn(
                "absolute -left-3 top-1/2 -translate-y-1/2",
                "w-6 h-6 rounded-full bg-card border border-border shadow-card",
                "flex items-center justify-center text-ink-muted",
                "hover:bg-surface-50 hover:text-ink transition-colors"
              )}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <motion.div animate={{ rotate: collapsed ? 180 : 0 }} transition={{ duration: 0.25 }}>
                <ChevronRight className="w-3 h-3" />
              </motion.div>
            </motion.button>
          )}

          {isMobile && (
            <button onClick={onMobileClose} className="absolute left-4 text-ink-muted hover:text-ink p-1">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-1">
          {navItems.map((group) => (
            <div key={group.group} className="mb-2">
              <AnimatePresence>
                {!effectiveCollapsed && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-[10px] font-semibold text-ink-subtle uppercase tracking-widest px-3 py-2"
                  >
                    {group.group}
                  </motion.p>
                )}
              </AnimatePresence>

              <div className="space-y-0.5">
                {group.items.map((item) => (
                  <NavItem
                    key={item.href}
                    {...item}
                    active={pathname === item.href || pathname.startsWith(item.href + "/")}
                    collapsed={effectiveCollapsed}
                    onClick={() => isMobile && onMobileClose()}
                  />
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="flex-shrink-0 p-3 border-t border-border">
          <motion.div
            className={cn(
              "flex items-center gap-3 p-2.5 rounded-xl",
              "hover:bg-surface-50 cursor-pointer transition-colors",
              effectiveCollapsed && "justify-center"
            )}
            whileHover={{ scale: 1.01 }}
          >
            <div className="relative flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-xs font-bold text-primary-700">م.ن</span>
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-success border border-card" />
            </div>

            <AnimatePresence>
              {!effectiveCollapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.2 }}
                  className="flex-1 min-w-0"
                >
                  <p className="text-xs font-semibold text-ink truncate">منى السلمي</p>
                  <p className="text-[10px] text-ink-muted truncate">مديرة المدرسة</p>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {!effectiveCollapsed && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-ink-subtle hover:text-danger transition-colors p-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.aside>
    </>
  );
}

interface NavItemProps {
  href: string;
  label: string;
  icon: React.ElementType;
  badge?: string | null;
  active: boolean;
  collapsed: boolean;
  onClick?: () => void;
}

function NavItem({ href, label, icon: Icon, badge, active, collapsed, onClick }: NavItemProps) {
  return (
    <Link href={href} className="block" onClick={onClick}>
      <motion.div
        className={cn(
          "relative flex items-center gap-3 px-3 py-2.5 rounded-xl",
          "text-sm font-medium transition-colors duration-200",
          "group cursor-pointer overflow-hidden",
          collapsed && "justify-center px-2",
          active
            ? "bg-primary-50 text-primary-700"
            : "text-ink-muted hover:bg-surface-50 hover:text-ink"
        )}
        whileHover={{ x: active ? 0 : -2 }}
        whileTap={{ scale: 0.97 }}
      >
        {active && (
          <motion.div
            layoutId="activeNavIndicator"
            className="absolute inset-y-0 right-0 w-0.5 rounded-full bg-primary"
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          />
        )}

        <Icon
          className={cn(
            "flex-shrink-0",
            active ? "text-primary-600" : "text-ink-muted group-hover:text-ink"
          )}
          style={{ width: 18, height: 18 }}
          strokeWidth={active ? 2 : 1.75}
        />

        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.2 }}
              className="flex-1 truncate"
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {!collapsed && badge && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className={cn(
                "text-[10px] font-semibold px-1.5 py-0.5 rounded-full",
                badge === "جديد"
                  ? "bg-accent text-white"
                  : "bg-surface-100 text-ink-muted"
              )}
            >
              {badge}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </Link>
  );
}

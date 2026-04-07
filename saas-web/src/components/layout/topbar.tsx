"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Bell, X, Command, Moon, Sun, Zap,
  Clock, TrendingUp, Menu,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { mockStudents } from "@/lib/utils/mock-data";

// ─── Topbar Component ─────────────────────────────────────────────────────────

interface TopbarProps {
  sidebarCollapsed: boolean;
  title?: string;
  isMobile?: boolean;
  onMobileMenuToggle?: () => void;
}

export function Topbar({ sidebarCollapsed, title, isMobile, onMobileMenuToggle }: TopbarProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  // Apply dark mode to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Keyboard shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
        setTimeout(() => searchRef.current?.focus(), 100);
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
        setSearchQuery("");
        setNotifOpen(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Close notifications when clicking outside
  useEffect(() => {
    if (!notifOpen) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as Element;
      if (!target.closest("[data-notif-panel]") && !target.closest("[data-notif-btn]")) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [notifOpen]);

  // Search results
  const results = searchQuery.length > 1
    ? mockStudents.filter(s =>
        s.fullName.includes(searchQuery) ||
        s.studentCode.includes(searchQuery) ||
        s.nationalId.includes(searchQuery)
      )
    : [];

  const rightOffset = isMobile ? 0 : sidebarCollapsed ? 72 : 260;

  return (
    <>
      <motion.header
        className={cn(
          "fixed top-0 left-0 z-30 h-16 bg-card/90 backdrop-blur-xl",
          "border-b border-border flex items-center gap-2 md:gap-4 px-3 md:px-6",
        )}
        style={{ right: rightOffset }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Mobile menu button */}
        {isMobile && (
          <motion.button
            onClick={onMobileMenuToggle}
            className="p-2 rounded-xl hover:bg-surface-50 text-ink-muted hover:text-ink transition-colors flex-shrink-0"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Menu className="w-5 h-5" />
          </motion.button>
        )}

        {/* Page title */}
        <div className="flex-1 min-w-0">
          {title && (
            <motion.h1
              key={title}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm md:text-base font-semibold text-ink truncate"
            >
              {title}
            </motion.h1>
          )}
        </div>

        {/* Search trigger */}
        <motion.button
          onClick={() => { setSearchOpen(true); setTimeout(() => searchRef.current?.focus(), 100); }}
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-xl",
            "bg-surface-50 border border-border",
            "text-ink-muted text-sm",
            "hover:bg-surface-100 hover:border-surface-200 transition-all",
            "group",
            isMobile ? "w-10 justify-center" : "w-48"
          )}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
        >
          <Search className="w-4 h-4 text-ink-subtle flex-shrink-0" />
          {!isMobile && (
            <>
              <span className="flex-1 text-right text-ink-subtle text-xs">بحث سريع...</span>
              <kbd className="hidden sm:flex items-center gap-1 text-[10px] px-1.5 py-0.5 bg-surface-100 border border-border rounded-md">
                <Command className="w-2.5 h-2.5" />K
              </kbd>
            </>
          )}
        </motion.button>

        {/* Notifications */}
        <div className="relative">
          <motion.button
            data-notif-btn
            onClick={() => setNotifOpen(v => !v)}
            className="relative p-2 rounded-xl hover:bg-surface-50 text-ink-muted hover:text-ink transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-danger border-2 border-card" />
          </motion.button>

          <AnimatePresence>
            {notifOpen && (
              <NotificationsPanel onClose={() => setNotifOpen(false)} isMobile={isMobile} />
            )}
          </AnimatePresence>
        </div>

        {/* Theme toggle */}
        <motion.button
          onClick={() => setDarkMode(v => !v)}
          className="p-2 rounded-xl hover:bg-surface-50 text-ink-muted hover:text-ink transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title={darkMode ? "الوضع النهاري" : "الوضع الليلي"}
        >
          <AnimatePresence mode="wait">
            {darkMode ? (
              <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                <Sun className="w-5 h-5" />
              </motion.div>
            ) : (
              <motion.div key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                <Moon className="w-5 h-5" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Academic year badge (hidden on small mobile) */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-primary-50 text-primary-700 rounded-xl border border-primary-100 flex-shrink-0">
          <Zap className="w-3.5 h-3.5" />
          <span className="text-xs font-semibold">1446 / 1447</span>
        </div>
      </motion.header>

      {/* Search Modal */}
      <AnimatePresence>
        {searchOpen && (
          <SearchModal
            query={searchQuery}
            onQueryChange={setSearchQuery}
            results={results}
            onClose={() => { setSearchOpen(false); setSearchQuery(""); }}
            searchRef={searchRef}
          />
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Search Modal ─────────────────────────────────────────────────────────────

interface SearchModalProps {
  query: string;
  onQueryChange: (v: string) => void;
  results: typeof mockStudents;
  onClose: () => void;
  searchRef: React.RefObject<HTMLInputElement>;
}

function SearchModal({ query, onQueryChange, results, onClose, searchRef }: SearchModalProps) {
  const router = useRouter();
  const recentSearches = ["عمر الشمري", "الصف الأول - أ", "اختبار الرياضيات"];

  const handleStudentClick = (studentId: string) => {
    onClose();
    router.push(`/students?id=${studentId}`);
  };

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-ink/20 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: -16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: -16 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "fixed top-20 left-4 right-4 md:left-1/2 md:right-auto md:-translate-x-1/2 z-50",
          "md:w-full md:max-w-xl",
          "bg-card rounded-2xl border border-border shadow-card-hover",
          "overflow-hidden"
        )}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <Search className="w-4 h-4 text-ink-muted flex-shrink-0" />
          <input
            ref={searchRef}
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="ابحث عن طالب، صف، مدرس..."
            className="flex-1 bg-transparent text-ink text-sm placeholder:text-ink-subtle outline-none text-right"
            dir="rtl"
          />
          {query && (
            <button onClick={() => onQueryChange("")} className="text-ink-muted hover:text-ink">
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:block text-[10px] px-1.5 py-0.5 bg-surface-50 border border-border rounded text-ink-muted">Esc</kbd>
        </div>

        {/* Results */}
        <div className="max-h-72 overflow-y-auto p-2">
          {query.length > 1 ? (
            results.length > 0 ? (
              <div>
                <p className="text-[10px] font-semibold text-ink-subtle uppercase tracking-wider px-3 py-2">
                  نتائج البحث ({results.length})
                </p>
                {results.map((student) => (
                  <SearchResultItem
                    key={student.id}
                    title={student.fullName}
                    subtitle={`${student.studentCode} · ${student.class.name}`}
                    type="student"
                    onClick={() => handleStudentClick(student.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center py-8 text-ink-subtle">
                <Search className="w-8 h-8 mb-2 opacity-40" />
                <p className="text-sm">لا توجد نتائج لـ &quot;{query}&quot;</p>
              </div>
            )
          ) : (
            <div>
              <p className="text-[10px] font-semibold text-ink-subtle uppercase tracking-wider px-3 py-2">
                <Clock className="w-3 h-3 inline ml-1" />
                عمليات بحث حديثة
              </p>
              {recentSearches.map((s) => (
                <SearchResultItem
                  key={s}
                  title={s}
                  type="recent"
                  onClick={() => onQueryChange(s)}
                />
              ))}
              <div className="border-t border-border mt-2 pt-2">
                <p className="text-[10px] font-semibold text-ink-subtle uppercase tracking-wider px-3 py-2">
                  <TrendingUp className="w-3 h-3 inline ml-1" />
                  الأكثر بحثًا
                </p>
                {["الصف الأول - أ", "درجات الرياضيات", "تقرير الحضور"].map((s) => (
                  <SearchResultItem
                    key={s}
                    title={s}
                    type="trending"
                    onClick={() => onQueryChange(s)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-border px-4 py-2 flex items-center gap-4 text-[10px] text-ink-subtle">
          <span><kbd className="px-1 py-0.5 bg-surface-50 border border-border rounded text-[10px]">↑↓</kbd> للتنقل</span>
          <span><kbd className="px-1 py-0.5 bg-surface-50 border border-border rounded text-[10px]">↵</kbd> للفتح</span>
          <span><kbd className="px-1 py-0.5 bg-surface-50 border border-border rounded text-[10px]">Esc</kbd> للإغلاق</span>
        </div>
      </motion.div>
    </>
  );
}

function SearchResultItem({
  title,
  subtitle,
  type,
  onClick,
}: {
  title: string;
  subtitle?: string;
  type: "student" | "class" | "teacher" | "recent" | "trending";
  onClick: () => void;
}) {
  const icons = {
    student: "👤",
    class: "🏫",
    teacher: "👨‍🏫",
    recent: "🕐",
    trending: "📈",
  };

  return (
    <motion.button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-surface-50 text-right transition-colors"
      whileHover={{ x: -2 }}
    >
      <span className="text-base w-6 text-center flex-shrink-0">{icons[type]}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-ink truncate">{title}</p>
        {subtitle && <p className="text-xs text-ink-muted truncate">{subtitle}</p>}
      </div>
    </motion.button>
  );
}

// ─── Notifications Panel ─────────────────────────────────────────────────────

function NotificationsPanel({ onClose, isMobile }: { onClose: () => void; isMobile?: boolean }) {
  const notifications = [
    { id: 1, title: "34 طالبًا في خطر أكاديمي", desc: "تحليل الذكاء الاصطناعي", time: "منذ 5 دقائق", urgent: true },
    { id: 2, title: "انتهى تسجيل الحضور - الصف 1أ", desc: "أحمد الزهراني", time: "منذ 10 دقائق", urgent: false },
    { id: 3, title: "تقرير نهاية الفصل جاهز", desc: "نظام التقارير", time: "منذ ساعة", urgent: false },
  ];

  return (
    <motion.div
      data-notif-panel
      initial={{ opacity: 0, y: 8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.96 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "absolute top-full mt-2 z-50",
        "bg-card rounded-2xl border border-border shadow-card-hover",
        "overflow-hidden",
        isMobile
          ? "left-0 right-0 w-auto mx-2"
          : "left-0 w-80"
      )}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <button onClick={onClose} className="text-ink-muted hover:text-ink transition-colors">
          <X className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-ink">الإشعارات</span>
          <span className="px-1.5 py-0.5 bg-danger text-white text-[10px] rounded-full font-bold">3</span>
        </div>
      </div>

      <div className="divide-y divide-border">
        {notifications.map((n) => (
          <motion.div
            key={n.id}
            className={cn(
              "flex gap-3 p-4 hover:bg-surface-50 cursor-pointer transition-colors text-right",
              n.urgent && "bg-red-50/50"
            )}
            whileHover={{ x: -2 }}
          >
            <div className="flex-1 min-w-0">
              <p className={cn("text-sm font-medium", n.urgent ? "text-danger" : "text-ink")}>{n.title}</p>
              <p className="text-xs text-ink-muted mt-0.5">{n.desc}</p>
              <p className="text-[10px] text-ink-subtle mt-1">{n.time}</p>
            </div>
            {n.urgent && (
              <div className="w-2 h-2 rounded-full bg-danger mt-1.5 flex-shrink-0 animate-pulse" />
            )}
          </motion.div>
        ))}
      </div>

      <div className="p-3">
        <button className="w-full text-center text-xs text-primary-600 hover:text-primary-700 font-medium py-1.5 rounded-lg hover:bg-primary-50 transition-colors">
          عرض جميع الإشعارات
        </button>
      </div>
    </motion.div>
  );
}

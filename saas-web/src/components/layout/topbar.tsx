"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Bell, X, Command, Moon, Sun, Zap, Menu,
  ChevronDown, Clock, TrendingUp, LogOut, Settings, User
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { mockStudents } from "@/lib/utils/mock-data";

interface TopbarProps {
  sidebarCollapsed: boolean;
  title?: string;
  onMobileMenuToggle: () => void;
  isMobile: boolean;
}

export function Topbar({ sidebarCollapsed, title, onMobileMenuToggle, isMobile }: TopbarProps) {
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [darkMode]);

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
          "fixed top-0 left-0 z-30 h-16 bg-card/80 backdrop-blur-xl",
          "border-b border-border flex items-center gap-2 md:gap-4 px-4 md:px-6",
          "transition-all duration-300"
        )}
        style={{
          right: isMobile ? 0 : (sidebarCollapsed ? "72px" : "260px"),
        }}
      >
        {isMobile && (
          <button onClick={onMobileMenuToggle} className="p-2 -mr-2 text-ink-muted hover:text-ink">
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div className="flex-1 overflow-hidden">
          {title && (
            <motion.h1
              key={title}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-base md:text-lg font-semibold text-ink truncate"
            >
              {title}
            </motion.h1>
          )}
        </div>

        <motion.button
          onClick={() => { setSearchOpen(true); setTimeout(() => searchRef.current?.focus(), 100); }}
          className={cn(
            "flex items-center gap-2 px-2 md:px-3 py-2 rounded-xl",
            "bg-surface-50 border border-border",
            "text-ink-muted text-sm",
            "hover:bg-surface-100 hover:border-surface-200 transition-all",
            "group w-10 md:w-48 justify-center md:justify-start"
          )}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
        >
          <Search className="w-4 h-4 text-ink-subtle" />
          <span className="hidden md:flex flex-1 text-right text-ink-subtle">بحث سريع...</span>
          <kbd className="hidden md:flex items-center gap-1 text-[10px] px-1.5 py-0.5 bg-surface-100 border border-border rounded-md">
            <Command className="w-2.5 h-2.5" />
            K
          </kbd>
        </motion.button>

        <div className="relative">
          <motion.button
            onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
            className="relative p-2 rounded-xl hover:bg-surface-50 text-ink-muted hover:text-ink transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-danger border-2 border-card" />
          </motion.button>
          <AnimatePresence>{notifOpen && <NotificationsPanel onClose={() => setNotifOpen(false)} />}</AnimatePresence>
        </div>

        <motion.button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 hidden md:flex rounded-xl hover:bg-surface-50 text-ink-muted hover:text-ink transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title={darkMode ? "الوضع النهاري" : "الوضع الليلي"}
        >
          <AnimatePresence mode="wait">
            {darkMode ? (
              <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}><Sun className="w-5 h-5" /></motion.div>
            ) : (
              <motion.div key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}><Moon className="w-5 h-5" /></motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        {!isMobile && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-50 text-primary-700 rounded-xl border border-primary-100 hidden lg:flex">
            <Zap className="w-3.5 h-3.5" />
            <span className="text-xs font-semibold">1446 / 1447</span>
          </div>
        )}

        <div className="relative ml-2">
          <button onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }} className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center cursor-pointer border border-primary-200">
             <span className="text-xs font-bold text-primary-700">م.ن</span>
          </button>
          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute top-full left-0 mt-2 w-48 bg-card border border-border shadow-card-hover rounded-xl p-2 z-50 text-right"
              >
                <div className="px-3 py-2 border-b border-border mb-2">
                  <p className="text-sm font-semibold text-ink">منى السلمي</p>
                  <p className="text-xs text-ink-muted">مديرة المدرسة</p>
                </div>
                <button onClick={() => { setProfileOpen(false); router.push("/settings"); }} className="w-full flex justify-between items-center px-3 py-2 text-sm text-ink-muted hover:bg-surface-50 hover:text-ink rounded-lg transition-colors">
                  <User className="w-4 h-4 ml-2" /> إعدادات الحساب
                </button>
                <button onClick={() => { setProfileOpen(false); router.push("/auth"); }} className="w-full flex justify-between items-center px-3 py-2 text-sm text-danger hover:bg-red-50 rounded-lg transition-colors mt-1">
                  <LogOut className="w-4 h-4 ml-2" /> تسجيل الخروج
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>

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
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-ink/30 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: -16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: -16 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "relative z-[70] w-full max-w-xl max-h-[85vh]",
          "bg-card rounded-2xl border border-border shadow-card-hover",
          "flex flex-col overflow-hidden"
        )}
        onClick={(e) => e.stopPropagation()}
      >
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
          <kbd className="hidden sm:inline-block text-[10px] px-1.5 py-0.5 bg-surface-50 border border-border rounded text-ink-muted">Esc</kbd>
        </div>
        <div className="flex-1 overflow-y-auto p-2" dir="rtl">
          {query.length > 1 ? (
            results.length > 0 ? (
              <div>
                <p className="text-[10px] font-semibold text-ink-subtle uppercase tracking-wider px-3 py-2 text-right">نتائج البحث ({results.length})</p>
                {results.map((student) => (
                  <SearchResultItem key={student.id} title={student.fullName} subtitle={`${student.studentCode} · ${student.class.name}`} type="student" onClick={() => { window.location.href = `/students?search=${student.studentCode}`; onClose(); }} />
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
              <p className="text-[10px] font-semibold text-ink-subtle uppercase tracking-wider px-3 py-2 text-right">
                <Clock className="w-3 h-3 inline ml-1" /> عمليات بحث حديثة
              </p>
              {recentSearches.map((s) => <SearchResultItem key={s} title={s} type="recent" onClick={() => onQueryChange(s)} />)}
              <div className="border-t border-border mt-2 pt-2">
                <p className="text-[10px] font-semibold text-ink-subtle uppercase tracking-wider px-3 py-2 text-right">
                  <TrendingUp className="w-3 h-3 inline ml-1" /> الأكثر بحثًا
                </p>
                {["الصف الأول - أ", "درجات الرياضيات", "تقرير الحضور"].map((s) => <SearchResultItem key={s} title={s} type="trending" onClick={() => onQueryChange(s)} />)}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function SearchResultItem({ title, subtitle, type, onClick }: { title: string; subtitle?: string; type: "student" | "class" | "teacher" | "recent" | "trending"; onClick: () => void; }) {
  const icons = { student: "👤", class: "🏫", teacher: "👨‍🏫", recent: "🕐", trending: "📈" };
  return (
    <motion.button onClick={onClick} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-surface-50 text-right transition-colors" whileHover={{ x: -2 }}>
      <span className="text-base w-6 text-center flex-shrink-0">{icons[type]}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-ink truncate text-right">{title}</p>
        {subtitle && <p className="text-xs text-ink-muted truncate text-right">{subtitle}</p>}
      </div>
    </motion.button>
  );
}

function NotificationsPanel({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const notifications = [
    { id: 1, title: "34 طالبًا في خطر أكاديمي", desc: "تحليل الذكاء الاصطناعي", time: "منذ 5 دقائق", urgent: true, href: "/ai-assistant" },
    { id: 2, title: "انتهى تسجيل الحضور - الصف 1أ", desc: "أحمد الزهراني", time: "منذ 10 دقائق", urgent: false, href: "/attendance" },
    { id: 3, title: "تقرير نهاية الفصل جاهز", desc: "نظام التقارير", time: "منذ ساعة", urgent: false, href: "/reports" },
  ];
  return (
    <motion.div initial={{ opacity: 0, y: 8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.96 }} transition={{ duration: 0.2 }} className={cn("absolute top-full left-0 mt-2 w-72 md:w-80", "bg-card rounded-2xl border border-border shadow-card-hover", "overflow-hidden z-50 text-right")} dir="rtl">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <button onClick={onClose} className="text-ink-muted hover:text-ink"><X className="w-4 h-4" /></button>
        <div className="flex items-center gap-2"><span className="text-sm font-semibold text-ink">الإشعارات</span><span className="px-1.5 py-0.5 bg-danger text-white text-[10px] rounded-full font-bold">3</span></div>
      </div>
      <div className="divide-y divide-border">
        {notifications.map((n) => (
          <motion.div key={n.id} onClick={() => { onClose(); router.push(n.href); }} className={cn("flex gap-3 p-4 hover:bg-surface-50 cursor-pointer transition-colors text-right", n.urgent && "bg-red-50/50")} whileHover={{ x: -2 }}>
            <div className="flex-1 min-w-0">
              <p className={cn("text-sm font-medium", n.urgent ? "text-danger" : "text-ink")}>{n.title}</p>
              <p className="text-xs text-ink-muted mt-0.5">{n.desc}</p>
              <p className="text-[10px] text-ink-subtle mt-1">{n.time}</p>
            </div>
            {n.urgent && <div className="w-2 h-2 rounded-full bg-danger mt-1.5 flex-shrink-0 animate-pulse" />}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart2, Download, FileText, TrendingUp, Users,
  CalendarCheck, BookOpen, Filter, Printer, Share2, Check,
} from "lucide-react";
import { AppLayout } from "@/components/layout/app-layout";
import { Stagger, StaggerItem, FadeIn } from "@/components/ui/motion";
import {
  AttendanceAreaChart, GradeDonutChart, PerformanceBarChart,
} from "@/components/dashboard/attendance-chart";
import { cn } from "@/lib/utils/cn";
import {
  mockMonthlyData, mockGradeDistribution, mockAttendanceData, mockStudents,
} from "@/lib/utils/mock-data";
import { formatPercent, formatGradeColor } from "@/lib/utils/format";

// ─── Report Templates ─────────────────────────────────────────────────────────

const reportTemplates = [
  {
    id: "attendance",
    title: "تقرير الحضور الشهري",
    description: "تفصيلي لنسب الحضور والغياب لكل صف",
    icon: CalendarCheck,
    color: "text-green-600 bg-green-50",
    tags: ["حضور", "شهري"],
  },
  {
    id: "grades",
    title: "تقرير درجات الشعبة",
    description: "ملخص درجات الطلاب في جميع المواد",
    icon: BookOpen,
    color: "text-blue-600 bg-blue-50",
    tags: ["درجات", "شعبة"],
  },
  {
    id: "performance",
    title: "تقرير الأداء الأكاديمي",
    description: "مقارنة أداء الصفوف والمدرسين",
    icon: TrendingUp,
    color: "text-purple-600 bg-purple-50",
    tags: ["أداء", "مقارنة"],
  },
  {
    id: "at-risk",
    title: "تقرير الطلاب المعرضين للخطر",
    description: "قائمة الطلاب الذين يحتاجون متابعة فورية",
    icon: Users,
    color: "text-red-600 bg-red-50",
    tags: ["خطر", "تدخل"],
  },
  {
    id: "behavior",
    title: "تقرير السلوك والانضباط",
    description: "إحصائيات الإيجابيات والسلبيات السلوكية",
    icon: FileText,
    color: "text-amber-600 bg-amber-50",
    tags: ["سلوك", "انضباط"],
  },
  {
    id: "comprehensive",
    title: "التقرير الشامل للمدرسة",
    description: "لمحة عامة شاملة عن جميع جوانب المدرسة",
    icon: BarChart2,
    color: "text-indigo-600 bg-indigo-50",
    tags: ["شامل", "إدارة"],
  },
];

const filterTags = ["الكل", "حضور", "درجات", "أداء", "خطر", "سلوك", "شامل"];

// ─── Reports Page ─────────────────────────────────────────────────────────────

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<"templates" | "preview">("templates");
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [activeFilter, setActiveFilter] = useState("الكل");
  const [downloadedReports, setDownloadedReports] = useState<Set<string>>(new Set());
  const [generatedCount, setGeneratedCount] = useState(24);
  const [shareSuccess, setShareSuccess] = useState(false);

  const handleGenerate = async (id: string) => {
    setSelectedReport(id);
    setGenerating(true);
    await new Promise(r => setTimeout(r, 2000));
    setGenerating(false);
    setGenerated(true);
    setGeneratedCount(c => c + 1);
    setActiveTab("preview");
  };

  const handleDownloadTemplate = (id: string) => {
    setDownloadedReports(prev => new Set([...prev, id]));
    const template = reportTemplates.find(t => t.id === id);
    // Generate CSV-like download for demo
    const content = `تقرير: ${template?.title}\nتاريخ الإنشاء: ${new Date().toLocaleDateString("ar-SA")}\n\nالبيانات التفصيلية:\n${mockStudents.map(s => `${s.fullName},${s.class.name},${s.gpa}%,${s.attendanceRate}%`).join("\n")}`;
    const blob = new Blob(["\ufeff" + content], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${template?.title ?? "تقرير"}_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setTimeout(() => {
      setDownloadedReports(prev => { const n = new Set(prev); n.delete(id); return n; });
    }, 3000);
  };

  const handleExportPDF = () => {
    window.print();
  };

  const handleShareReport = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 2500);
    });
  };

  const filteredTemplates = activeFilter === "الكل"
    ? reportTemplates
    : reportTemplates.filter(t => t.tags.some(tag => tag === activeFilter || t.title.includes(activeFilter)));

  return (
    <AppLayout title="التقارير والتحليلات">
      <div className="space-y-6">
        {/* Summary KPIs */}
        <Stagger className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "التقارير المُنشأة هذا الشهر", value: generatedCount.toString(), icon: FileText, color: "text-blue-600 bg-blue-50" },
            { label: "آخر تحديث", value: "اليوم", icon: CalendarCheck, color: "text-green-600 bg-green-50" },
            { label: "التقارير المشاركة", value: "8", icon: Share2, color: "text-purple-600 bg-purple-50" },
            { label: "الصادرة للطباعة", value: "12", icon: Printer, color: "text-amber-600 bg-amber-50" },
          ].map(stat => (
            <StaggerItem key={stat.label}>
              <div className="card-base p-4 flex items-center gap-3">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0", stat.color.split(" ")[1])}>
                  <stat.icon className={cn("w-5 h-5", stat.color.split(" ")[0])} strokeWidth={1.8} />
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-ink">{stat.value}</p>
                  <p className="text-xs text-ink-muted">{stat.label}</p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 bg-surface-50 border border-border rounded-xl p-1 w-fit">
          {[
            { id: "templates", label: "قوالب التقارير" },
            { id: "preview", label: "معاينة التقرير" },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as "templates" | "preview")}
              className={cn(
                "px-5 py-2 rounded-lg text-sm font-medium transition-all",
                activeTab === tab.id
                  ? "bg-white shadow-card text-ink"
                  : "text-ink-muted hover:text-ink"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "templates" ? (
          <>
            {/* Filters */}
            <FadeIn delay={0.05}>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-sm text-ink-muted flex items-center gap-1.5">
                  <Filter className="w-4 h-4" />
                  تصفية:
                </span>
                {filterTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => setActiveFilter(tag)}
                    className={cn(
                      "px-3 py-1.5 rounded-xl border text-xs font-medium transition-all",
                      activeFilter === tag
                        ? "bg-primary text-white border-primary shadow-glow"
                        : "border-border bg-surface-50 text-ink-muted hover:text-ink hover:bg-surface-100"
                    )}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </FadeIn>

            {/* Report Templates Grid */}
            <Stagger className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTemplates.map(template => (
                <StaggerItem key={template.id}>
                  <ReportTemplateCard
                    template={template}
                    onGenerate={() => handleGenerate(template.id)}
                    onDownload={() => handleDownloadTemplate(template.id)}
                    generating={generating && selectedReport === template.id}
                    downloaded={downloadedReports.has(template.id)}
                  />
                </StaggerItem>
              ))}
            </Stagger>

            {filteredTemplates.length === 0 && (
              <FadeIn>
                <div className="card-base p-12 text-center">
                  <BarChart2 className="w-12 h-12 text-ink-subtle mx-auto mb-3 opacity-40" />
                  <p className="text-ink-muted text-sm">لا توجد تقارير تطابق هذا التصنيف</p>
                </div>
              </FadeIn>
            )}
          </>
        ) : (
          <ReportPreview
            generated={generated}
            onBrowseTemplates={() => setActiveTab("templates")}
            onExportPDF={handleExportPDF}
            onShare={handleShareReport}
            shareSuccess={shareSuccess}
          />
        )}
      </div>
    </AppLayout>
  );
}

// ─── Report Template Card ─────────────────────────────────────────────────────

function ReportTemplateCard({
  template, onGenerate, onDownload, generating, downloaded,
}: {
  template: typeof reportTemplates[0];
  onGenerate: () => void;
  onDownload: () => void;
  generating: boolean;
  downloaded: boolean;
}) {
  return (
    <motion.div
      className="card-base p-5 hover:shadow-card-hover text-right group"
      whileHover={{ y: -2 }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex gap-1.5 flex-wrap">
          {template.tags.map(tag => (
            <span key={tag} className="badge-neutral text-[10px]">{tag}</span>
          ))}
        </div>
        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0", template.color.split(" ")[1])}>
          <template.icon className={cn("w-5 h-5", template.color.split(" ")[0])} strokeWidth={1.8} />
        </div>
      </div>

      <h3 className="text-sm font-bold text-ink">{template.title}</h3>
      <p className="text-xs text-ink-muted mt-1">{template.description}</p>

      <div className="flex items-center gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <motion.button
          onClick={onGenerate}
          className={cn(
            "btn-primary text-xs flex-1 justify-center h-8",
            generating && "opacity-60 cursor-not-allowed"
          )}
          disabled={generating}
          whileTap={{ scale: 0.97 }}
        >
          {generating ? (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              جارٍ الإنشاء...
            </div>
          ) : (
            "إنشاء التقرير"
          )}
        </motion.button>
        <motion.button
          onClick={onDownload}
          className={cn(
            "w-8 h-8 rounded-xl border flex items-center justify-center transition-colors",
            downloaded
              ? "border-green-300 bg-green-50 text-green-600"
              : "border-border text-ink-muted hover:text-ink hover:bg-surface-50"
          )}
          whileTap={{ scale: 0.9 }}
          title="تحميل مباشر"
        >
          {downloaded ? <Check className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
        </motion.button>
      </div>
    </motion.div>
  );
}

// ─── Report Preview ───────────────────────────────────────────────────────────

function ReportPreview({
  generated, onBrowseTemplates, onExportPDF, onShare, shareSuccess,
}: {
  generated: boolean;
  onBrowseTemplates: () => void;
  onExportPDF: () => void;
  onShare: () => void;
  shareSuccess: boolean;
}) {
  if (!generated) {
    return (
      <FadeIn>
        <div className="card-base p-12 text-center">
          <BarChart2 className="w-16 h-16 text-ink-subtle mx-auto mb-4 opacity-40" />
          <p className="text-ink-muted text-sm">اختر تقريرًا من القوالب لمعاينته هنا</p>
          <button
            onClick={onBrowseTemplates}
            className="btn-primary mt-4 text-sm"
          >
            استعرض القوالب
          </button>
        </div>
      </FadeIn>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Report Header */}
      <div className="card-base p-6 bg-gradient-to-l from-primary-50 to-transparent text-right no-print">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onExportPDF} className="btn-secondary gap-2 text-sm">
              <Printer className="w-4 h-4" />
              طباعة
            </button>
            <button
              onClick={onShare}
              className={cn(
                "btn-secondary gap-2 text-sm transition-colors",
                shareSuccess && "bg-green-50 border-green-300 text-green-700"
              )}
            >
              {shareSuccess ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
              {shareSuccess ? "تم النسخ!" : "مشاركة"}
            </button>
            <button onClick={onExportPDF} className="btn-primary gap-2 text-sm">
              <Download className="w-4 h-4" />
              تصدير PDF
            </button>
          </div>
          <div>
            <h2 className="text-lg font-bold text-ink">التقرير الشامل للمدرسة</h2>
            <p className="text-xs text-ink-muted mt-1">الفصل الدراسي الأول (الشعبة الحالية) | العام 1446/1447</p>
          </div>
        </div>
      </div>

      {/* Report Charts Grid */}
      <div className="grid grid-cols-2 gap-6">
        <div className="card-base p-5">
          <div className="text-right mb-3">
            <h3 className="text-sm font-semibold text-ink">مسار الحضور الأسبوعي</h3>
          </div>
          <AttendanceAreaChart data={mockMonthlyData} />
        </div>
        <div className="card-base p-5">
          <div className="text-right mb-3">
            <h3 className="text-sm font-semibold text-ink">توزيع الدرجات</h3>
          </div>
          <GradeDonutChart data={mockGradeDistribution} />
        </div>
      </div>

      {/* Performance per class */}
      <div className="card-base p-5">
        <div className="text-right mb-4">
          <h3 className="text-sm font-semibold text-ink">أداء الطلاب حسب الصف</h3>
          <p className="text-xs text-ink-muted">مقارنة الحضور والدرجات</p>
        </div>
        <PerformanceBarChart
          data={mockAttendanceData.map(d => ({ name: d.label, value: d.value }))}
        />
      </div>

      {/* Student Performance Table */}
      <div className="card-base overflow-hidden">
        <div className="px-5 py-3 border-b border-border text-right">
          <h3 className="text-sm font-semibold text-ink">أداء الطلاب التفصيلي</h3>
        </div>
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 px-5 py-2.5 bg-surface-50 border-b border-border">
          {["الطالب", "الصف", "المعدل", "الحضور", "الخطر"].map(h => (
            <span key={h} className="text-[11px] font-semibold text-ink-muted text-right">{h}</span>
          ))}
        </div>
        <div className="divide-y divide-border">
          {mockStudents.map((student) => (
            <div key={student.id} className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 px-5 py-3 items-center">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-primary-100 flex items-center justify-center">
                  <span className="text-xs font-bold text-primary-700">{student.firstName.charAt(0)}</span>
                </div>
                <span className="text-sm text-ink font-medium">{student.fullName}</span>
              </div>
              <span className="text-sm text-ink-muted text-right">{student.class.name}</span>
              <span className={cn("text-sm font-bold text-right", formatGradeColor(student.gpa ?? 0))}>
                {student.gpa?.toFixed(1)}%
              </span>
              <span className={cn(
                "text-sm font-bold text-right",
                (student.attendanceRate ?? 0) >= 90 ? "text-green-600" : "text-red-600"
              )}>
                {formatPercent(student.attendanceRate ?? 0)}
              </span>
              <span className={cn(
                "badge text-[10px]",
                student.riskLevel === "high" ? "bg-red-100 text-red-700" :
                student.riskLevel === "medium" ? "bg-amber-100 text-amber-700" :
                "bg-green-100 text-green-700"
              )}>
                {student.riskLevel === "high" ? "مرتفع" : student.riskLevel === "medium" ? "متوسط" : "منخفض"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

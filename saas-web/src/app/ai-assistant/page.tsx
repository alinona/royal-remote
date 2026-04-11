"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot, Send, Sparkles, FileText, BarChart2, ClipboardList,
  BookOpen, Wand2, RefreshCw, Copy, Check, X, ChevronDown,
  Lightbulb, AlertTriangle, TrendingUp,
} from "lucide-react";
import { AppLayout } from "@/components/layout/app-layout";
import { FadeIn, Stagger, StaggerItem } from "@/components/ui/motion";
import { GeometricMesh } from "@/components/ui/geometric-shapes";
import { cn } from "@/lib/utils/cn";
import { formatRelative } from "@/lib/utils/format";

// ─── Message Types ────────────────────────────────────────────────────────────

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  type?: "text" | "insight" | "exam" | "report";
}

// ─── Quick Prompts ────────────────────────────────────────────────────────────

const quickPrompts = [
  {
    icon: AlertTriangle,
    label: "تحليل المخاطر",
    prompt: "حلّل أداء الطلاب وحدّد من هم في خطر الرسوب مع توصيات تفصيلية",
    color: "text-red-600 bg-red-50 border-red-100",
  },
  {
    icon: FileText,
    label: "إنشاء اختبار",
    prompt: "أنشئ اختبارًا للصف الأول في مادة الرياضيات - موضوع: الكسور - 10 أسئلة متنوعة",
    color: "text-blue-600 bg-blue-50 border-blue-100",
  },
  {
    icon: BarChart2,
    label: "تقرير الأداء",
    prompt: "أنشئ تقريرًا تحليليًا شاملًا عن أداء الطلاب في الشعبة الحالية",
    color: "text-green-600 bg-green-50 border-green-100",
  },
  {
    icon: ClipboardList,
    label: "خطة درس",
    prompt: "ساعدني في إنشاء خطة درس تفاعلية لموضوع المعادلات للصف الخامس",
    color: "text-purple-600 bg-purple-50 border-purple-100",
  },
  {
    icon: TrendingUp,
    label: "تنبؤ الأداء",
    prompt: "تنبأ بأداء الطلاب في نهاية الشعبة/الترم بناءً على البيانات الحالية",
    color: "text-amber-600 bg-amber-50 border-amber-100",
  },
  {
    icon: BookOpen,
    label: "تصحيح الواجب",
    prompt: "ساعدني في إنشاء معيار تصحيح موضوعي لواجب اللغة العربية",
    color: "text-indigo-600 bg-indigo-50 border-indigo-100",
  },
];

// ─── AI Assistant Page ────────────────────────────────────────────────────────

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "مرحبًا! أنا مساعدك الذكي لإدارة المدرسة. يمكنني مساعدتك في:\n\n• تحليل أداء الطلاب والتنبؤ بالمشاكل\n• إنشاء اختبارات وواجبات\n• تقديم تقارير تفصيلية\n• إنشاء خطط دروس تفاعلية\n• تقديم توصيات مخصصة\n\nكيف يمكنني مساعدتك اليوم؟",
      timestamp: new Date(),
      type: "text",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (content: string) => {
    if (!content.trim() || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      // Call real AI API
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: content,
          history: messages.slice(-10).map(m => ({ role: m.role, content: m.content })),
          context: {
            school: "مدرسة منارات المستقبل النموذجية",
            totalStudents: 1248,
            avgAttendance: "92.4%",
            avgGPA: "78.6%",
            atRiskCount: 34,
            currentYear: "1446/1447",
          },
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const json = await res.json();
      const responseContent: string = json?.data?.content
        ?? "عذرًا، حدث خطأ في الحصول على الإجابة. حاول مرة أخرى.";

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: responseContent,
        timestamp: new Date(),
        type: "insight",
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch {
      // Fallback to local responses if API unavailable
      const responses: Record<string, string> = {
        "تحليل": "**تحليل الأداء الأكاديمي - الشعبة الحالية 1446/1447**\n\nبعد تحليل شامل لبيانات 1,248 طالبًا:\n\n**الطلاب في خطر مرتفع (34 طالبًا):**\n• 18 طالبًا بسبب ضعف الحضور (<75%)\n• 12 طالبًا بسبب انخفاض الدرجات (<50%)\n• 4 طلاب بسبب مشاكل سلوكية متكررة\n\n**التوصيات الفورية:**\n1. تنظيم جلسات دعم أكاديمي للطلاب المتعثرين\n2. التواصل مع أولياء الأمور خلال 48 ساعة\n3. مراجعة خطة التدريس لمواد الضعف",
        "اختبار": "**اختبار الرياضيات - الكسور - الصف الأول**\n\n*المدة: 45 دقيقة | الدرجة الكاملة: 40*\n\n**القسم الأول: الاختيار من متعدد (20 درجة)**\n\n1. ما هو الكسر الذي يمثل نصف الكل؟ أ) 1/4  ب) 1/2  ج) 2/3  د) 3/4\n\n**القسم الثاني: أسئلة قصيرة (12 درجة)**\n\n**القسم الثالث: مسائل تطبيقية (8 درجات)**",
        "تقرير": "**التقرير التحليلي الشامل**\n\n📊 **الملخص:**\n- متوسط الحضور: 92.4%\n- متوسط الدرجات: 78.6%\n- المتفوقون: 25.2%\n\n📈 **الأفضل أداءً:**\n1. التربية الإسلامية: 87.3%\n2. اللغة العربية: 82.1%",
      };
      const key = Object.keys(responses).find(k => content.includes(k)) ?? "";
      const fallbackContent = responses[key]
        ?? "عذرًا، لا يمكن الاتصال بخدمة الذكاء الاصطناعي حاليًا. يرجى التحقق من إعداد ANTHROPIC_API_KEY والمحاولة مرة أخرى.";

      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: fallbackContent,
        timestamp: new Date(),
        type: "text",
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const copyMessage = async (id: string, content: string) => {
    await navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <AppLayout title="المساعد الذكي">
      <div className="flex flex-col md:flex-row gap-4 md:gap-6 h-[calc(100vh-10rem)] min-h-[500px]">
        {/* Sidebar - Quick Prompts */}
        <div className="md:w-64 flex-shrink-0 space-y-3 md:space-y-4 overflow-x-auto md:overflow-y-auto">
          <div className="flex md:flex-col gap-2 md:gap-0 md:space-y-4">
          <FadeIn>
            <div className="card-base p-4">
              <div className="flex items-center gap-2 text-right mb-3">
                <Sparkles className="w-4 h-4 text-accent" />
                <h3 className="text-sm font-semibold text-ink">إجراءات سريعة</h3>
              </div>
              <div className="space-y-2">
                {quickPrompts.map((p) => (
                  <motion.button
                    key={p.label}
                    onClick={() => sendMessage(p.prompt)}
                    className={cn(
                      "w-full flex items-center gap-2.5 p-3 rounded-xl border text-right",
                      "hover:shadow-card transition-all duration-200",
                      p.color
                    )}
                    whileHover={{ scale: 1.02, x: -2 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <p.icon className="w-4 h-4 flex-shrink-0" strokeWidth={1.8} />
                    <span className="text-xs font-medium">{p.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* AI Capabilities */}
          <FadeIn delay={0.1}>
            <div className="card-base p-4">
              <h3 className="text-xs font-semibold text-ink-muted uppercase tracking-wide mb-3 text-right">قدرات الذكاء الاصطناعي</h3>
              <div className="space-y-2">
                {[
                  { icon: TrendingUp, label: "تحليل البيانات", active: true },
                  { icon: Lightbulb, label: "توليد المحتوى", active: true },
                  { icon: AlertTriangle, label: "كشف المخاطر", active: true },
                  { icon: BarChart2, label: "التنبؤ", active: true },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between">
                    <span className={cn(
                      "flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full",
                      item.active ? "bg-green-100 text-green-600" : "bg-surface-100 text-ink-muted"
                    )}>
                      {item.active ? "نشط" : "قريبًا"}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-ink-muted">{item.label}</span>
                      <item.icon className="w-3.5 h-3.5 text-ink-subtle" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col card-base overflow-hidden">
          {/* Chat Header */}
          <div className="relative px-5 py-4 border-b border-border bg-gradient-to-l from-primary-600/5 to-accent/5 flex-shrink-0">
            <div className="flex items-center gap-3 justify-end">
              <div className="text-right">
                <h2 className="text-sm font-bold text-ink">EduFlow AI</h2>
                <p className="text-xs text-green-600 flex items-center gap-1 justify-end">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                  متاح الآن
                </p>
              </div>
              <motion.div
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-glow"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <Bot className="w-5 h-5 text-white" />
              </motion.div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {messages.map((msg) => (
              <MessageBubble
                key={msg.id}
                message={msg}
                copied={copiedId === msg.id}
                onCopy={() => copyMessage(msg.id, msg.content)}
              />
            ))}

            {/* Loading indicator */}
            <AnimatePresence>
              {loading && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="flex items-end gap-3 justify-end"
                >
                  <div className="bg-surface-50 border border-border rounded-2xl rounded-br-sm px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        {[0, 0.2, 0.4].map((delay) => (
                          <motion.div
                            key={delay}
                            className="w-2 h-2 rounded-full bg-primary-400"
                            animate={{ y: [0, -6, 0] }}
                            transition={{ duration: 0.8, repeat: Infinity, delay }}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-ink-muted">يفكر...</span>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="flex-shrink-0 border-t border-border p-4">
            <div className="flex items-end gap-3">
              <motion.button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || loading}
                className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all",
                  input.trim() && !loading
                    ? "bg-primary text-white shadow-glow"
                    : "bg-surface-100 text-ink-muted cursor-not-allowed"
                )}
                whileHover={input.trim() && !loading ? { scale: 1.05 } : {}}
                whileTap={input.trim() && !loading ? { scale: 0.95 } : {}}
              >
                <Send className="w-4 h-4" />
              </motion.button>

              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage(input);
                    }
                  }}
                  placeholder="اكتب رسالتك هنا... (Enter للإرسال، Shift+Enter لسطر جديد)"
                  className={cn(
                    "w-full px-4 py-3 rounded-xl border border-border bg-surface-50",
                    "text-ink text-sm placeholder:text-ink-subtle text-right",
                    "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
                    "resize-none transition-all duration-200"
                  )}
                  rows={1}
                  dir="rtl"
                  style={{ minHeight: "44px", maxHeight: "120px" }}
                />
              </div>

              <motion.button
                onClick={() => {
                  setMessages([messages[0]]);
                  setInput("");
                }}
                className="w-10 h-10 rounded-xl flex items-center justify-center text-ink-muted hover:bg-surface-50 hover:text-ink border border-border transition-all flex-shrink-0"
                whileTap={{ scale: 0.9 }}
                title="محادثة جديدة"
              >
                <RefreshCw className="w-4 h-4" />
              </motion.button>
            </div>
            <p className="text-[10px] text-ink-subtle text-center mt-2">
              المساعد الذكي يستخدم بيانات المدرسة لتقديم رؤى دقيقة ومخصصة
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

// ─── Message Bubble ───────────────────────────────────────────────────────────

function MessageBubble({
  message, copied, onCopy,
}: {
  message: Message;
  copied: boolean;
  onCopy: () => void;
}) {
  const isUser = message.role === "user";

  // Format content with basic markdown
  const formatContent = (text: string) => {
    return text.split("\n").map((line, i) => {
      const formatted = line
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/^•\s/, '<span class="ml-2">•</span> ')
        .replace(/^(\d+)\.\s/, '<span class="font-bold text-primary-600 ml-1">$1.</span> ');

      return (
        <span
          key={i}
          dangerouslySetInnerHTML={{ __html: formatted }}
          className="block"
        />
      );
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={cn(
        "flex items-end gap-3",
        isUser ? "flex-row" : "flex-row-reverse"
      )}
    >
      {/* Avatar */}
      <div className={cn(
        "w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0",
        isUser
          ? "bg-primary-100"
          : "bg-gradient-to-br from-primary to-accent shadow-glow"
      )}>
        {isUser ? (
          <span className="text-xs font-bold text-primary-700">م</span>
        ) : (
          <Bot className="w-4 h-4 text-white" />
        )}
      </div>

      {/* Bubble */}
      <div className={cn(
        "max-w-[75%] group relative",
        isUser ? "items-start" : "items-end"
      )}>
        <div className={cn(
          "px-4 py-3 rounded-2xl text-sm leading-relaxed text-right whitespace-pre-line",
          isUser
            ? "bg-primary text-white rounded-bl-sm"
            : "bg-surface-50 border border-border text-ink rounded-br-sm"
        )}>
          {isUser ? message.content : formatContent(message.content)}
        </div>

        <div className={cn(
          "flex items-center gap-2 mt-1",
          isUser ? "justify-start" : "justify-end"
        )}>
          <span className="text-[10px] text-ink-subtle">{formatRelative(message.timestamp)}</span>

          {!isUser && (
            <button
              onClick={onCopy}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-ink-subtle hover:text-ink p-0.5 rounded"
            >
              {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

// ─── AI API Route ─────────────────────────────────────────────────────────────

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `أنت مساعد ذكاء اصطناعي متخصص في إدارة المدارس الحكومية السعودية.
لديك خبرة في:
- تحليل أداء الطلاب وتحديد المخاطر الأكاديمية
- إنشاء اختبارات وواجبات متوازنة وفق المناهج السعودية
- تقديم توصيات تربوية مبنية على البيانات
- إعداد التقارير الأكاديمية المفصلة
- اقتراح استراتيجيات التدريس الفعّالة

أسلوبك: مهني، دقيق، مفيد، باللغة العربية الفصحى.
استخدم تنسيق Markdown في إجاباتك لتحسين القراءة.
عند تقديم بيانات، اذكر الأرقام والنسب المئوية بوضوح.`;

export async function POST(req: NextRequest) {
  try {
    const { message, context, history } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { code: "INVALID_INPUT", message: "الرسالة مطلوبة" },
        { status: 400 }
      );
    }

    // Build messages
    const messages: Anthropic.MessageParam[] = [];

    // Add context about the school if provided
    if (context) {
      messages.push({
        role: "user",
        content: `السياق الحالي:\n${JSON.stringify(context, null, 2)}\n\nاستخدم هذه البيانات في إجاباتك.`,
      });
      messages.push({
        role: "assistant",
        content: "فهمت السياق. سأستخدم بيانات مدرستك في تحليلاتي وإجاباتي.",
      });
    }

    // Add history
    if (history && Array.isArray(history)) {
      for (const msg of history.slice(-10)) { // Last 10 messages
        messages.push({
          role: msg.role === "user" ? "user" : "assistant",
          content: msg.content,
        });
      }
    }

    // Add current message
    messages.push({ role: "user", content: message });

    const response = await client.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 2048,
      system: SYSTEM_PROMPT,
      messages,
    });

    const content = response.content[0];
    if (content.type !== "text") {
      throw new Error("Unexpected response type");
    }

    return NextResponse.json({
      data: {
        content: content.text,
        usage: {
          inputTokens: response.usage.input_tokens,
          outputTokens: response.usage.output_tokens,
        },
      },
    });
  } catch (error) {
    console.error("AI API error:", error);

    if (error instanceof Anthropic.APIError) {
      return NextResponse.json(
        { code: "AI_ERROR", message: "خطأ في خدمة الذكاء الاصطناعي", details: error.message },
        { status: error.status ?? 500 }
      );
    }

    return NextResponse.json(
      { code: "INTERNAL_ERROR", message: "خطأ داخلي في الخادم" },
      { status: 500 }
    );
  }
}

// ─── GET - AI Insights ────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  try {
    // In production: fetch from AI analysis job results stored in DB
    const insights = [
      {
        id: "ai1",
        type: "risk",
        severity: "high",
        title: "34 طالبًا في خطر أكاديمي",
        description: "تحليل الذكاء الاصطناعي يكشف أن هؤلاء الطلاب لديهم احتمالية رسوب تتجاوز 65%",
        confidence: 87,
        actionItems: ["جدولة جلسات دعم", "التواصل مع أولياء الأمور"],
        createdAt: new Date().toISOString(),
      },
    ];

    return NextResponse.json({ data: insights });
  } catch (error) {
    return NextResponse.json(
      { code: "INTERNAL_ERROR", message: "خطأ في استرجاع التحليلات" },
      { status: 500 }
    );
  }
}

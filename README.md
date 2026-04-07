# EduFlow — نظام إدارة المدارس الحكومية

منصة SaaS متكاملة لإدارة المدارس الحكومية مع تطبيق موبايل مخصص للمدرسين.

---

## 🏗 هيكل المشروع

```
royal-remote/
├── saas-web/          # Next.js 14 SaaS Dashboard
└── mobile-app/        # React Native / Expo Teacher App
```

---

## ⚡ حزمة التقنيات

### الواجهة الأمامية (SaaS)
| التقنية | الاستخدام |
|---------|-----------|
| **Next.js 14** (App Router) | الإطار الأساسي، SSR، API Routes |
| **TypeScript** | سلامة الأنواع |
| **Tailwind CSS** | التصميم والتنسيق |
| **Framer Motion** | الحركات والانتقالات |
| **Recharts** | الرسوم البيانية |
| **Zustand** | إدارة الحالة |
| **TanStack Query** | حالة الخادم والتخزين المؤقت |
| **Radix UI** | مكونات واجهة المستخدم |

### الخلفية (Backend)
| التقنية | الاستخدام |
|---------|-----------|
| **Next.js API Routes** | RESTful API |
| **Prisma ORM** | طبقة قاعدة البيانات |
| **PostgreSQL** | قاعدة البيانات الرئيسية |
| **Redis** | التخزين المؤقت، الجلسات |
| **Claude API** | الذكاء الاصطناعي |
| **Zod** | التحقق من البيانات |

### تطبيق الموبايل
| التقنية | الاستخدام |
|---------|-----------|
| **React Native + Expo** | إطار الموبايل |
| **Reanimated 3** | الحركات عالية الأداء |
| **Expo SQLite** | قاعدة البيانات المحلية (Offline) |
| **Expo SecureStore** | تخزين آمن للبيانات الحساسة |
| **Expo LocalAuthentication** | المصادقة البيومترية |

---

## 🎨 نظام التصميم

### الفلسفة التصميمية
- **لا تصميم تقليدي** — واجهات حية وديناميكية
- **أشكال هندسية** — دوائر، ماسات، سداسيات هندسية
- **حركات ناعمة** — Spring animations, Micro-interactions
- **ألوان ذكية** — CSS Custom Properties مع دعم Dark Mode
- **RTL أصلي** — مبني للغة العربية من الأساس

### نظام الألوان
```css
--primary:  232 76% 55%  /* Indigo عميق */
--accent:   268 85% 64%  /* Violet كهربائي */
--success:  142 70% 40%  /* أخضر */
--warning:   38 92% 50%  /* ذهبي */
--danger:     0 80% 55%  /* أحمر */
```

---

## 📱 ميزات التطبيق

### نظام SaaS
- ✅ لوحة تحكم تفاعلية مع KPIs حية
- ✅ إدارة الطلاب (بحث ذكي، ملف رقمي شامل)
- ✅ إدارة الصفوف والمدرسين
- ✅ تسجيل الحضور بواجهة سريعة
- ✅ إدخال الدرجات مع تحليل فوري
- ✅ إدارة الملفات (Documents, Sheets, PDF)
- ✅ مساعد ذكاء اصطناعي متخصص
- ✅ تقارير وتحليلات متقدمة
- ✅ سجل نشاطات مع تتبع كامل

### تطبيق المدرسين
- ✅ تسجيل دخول بكلمة مرور / PIN / بصمة
- ✅ عرض الصفوف الخاصة بالمدرس
- ✅ تسجيل الحضور السريع
- ✅ دعم العمل أوفلاين مع مزامنة تلقائية
- ✅ إشعارات التنبيهات الفورية

---

## 🚀 تشغيل المشروع

### متطلبات النظام
```
Node.js >= 18
PostgreSQL >= 14
Redis >= 6 (اختياري)
```

### SaaS Dashboard
```bash
cd saas-web
npm install
cp .env.example .env.local
# أضف متغيرات البيئة
npm run db:generate
npm run db:push
npm run dev
```

### تطبيق الموبايل
```bash
cd mobile-app
npm install
npx expo start
```

---

## 🔐 متغيرات البيئة

```env
# قاعدة البيانات
DATABASE_URL="postgresql://user:pass@localhost:5432/eduflow"

# الذكاء الاصطناعي
ANTHROPIC_API_KEY="sk-ant-..."

# المصادقة
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"

# التخزين
REDIS_URL="redis://localhost:6379"
S3_BUCKET="eduflow-files"
S3_REGION="me-south-1"
```

---

## 📊 هيكل قاعدة البيانات

```
School (مستأجر)
├── Users (مستخدمون)
│   └── Sessions
├── Teachers (مدرسون)
├── ClassSections (صفوف)
├── Students (طلاب)
├── Subjects (مواد)
├── Grades (درجات)
├── AttendanceRecords (حضور)
├── BehaviorRecords (سلوك)
├── FileItems (ملفات)
├── Folders (مجلدات)
├── ActivityLogs (سجل نشاطات)
└── AIInsights (تحليلات ذكاء اصطناعي)
```

---

## 🤖 قدرات الذكاء الاصطناعي

| الميزة | الوصف |
|--------|-------|
| **تحليل المخاطر** | كشف الطلاب المعرضين للرسوب بدقة 87%+ |
| **التنبؤ** | توقع الأداء الأكاديمي وانخفاض الحضور |
| **إنشاء الاختبارات** | توليد أسئلة متوازنة حسب المنهج |
| **التقارير** | إنشاء تقارير تفصيلية تلقائيًا |
| **التوصيات** | اقتراحات مخصصة للمدرسين والإدارة |

---

## 🔒 الأمان

- **RBAC** — نظام صلاحيات دقيق (مدير عام / مدير مدرسة / مدرس / سكرتير)
- **تشفير** — HTTPS + JWT + bcrypt
- **مصادقة ثنائية** — TOTP Support
- **سجل كامل** — تتبع جميع العمليات مع IP والوقت
- **Multi-tenant** — عزل تام بين البيانات

---

## 📁 هيكل مجلدات الكود

```
saas-web/src/
├── app/                    # صفحات Next.js (App Router)
│   ├── auth/               # صفحة تسجيل الدخول
│   ├── dashboard/          # لوحة التحكم
│   ├── students/           # إدارة الطلاب
│   ├── classes/            # الصفوف والمدرسون
│   ├── attendance/         # الحضور والغياب
│   ├── grades/             # الدرجات
│   ├── files/              # إدارة الملفات
│   ├── ai-assistant/       # المساعد الذكي
│   ├── reports/            # التقارير
│   ├── activity-log/       # سجل النشاطات
│   └── api/                # API Routes
├── components/
│   ├── ui/                 # مكونات عامة
│   ├── layout/             # التخطيط (Sidebar, Topbar)
│   └── dashboard/          # مكونات لوحة التحكم
├── lib/
│   ├── utils/              # أدوات مساعدة
│   └── ai/                 # تكامل الذكاء الاصطناعي
├── types/                  # تعريفات TypeScript
└── styles/                 # CSS عام
```
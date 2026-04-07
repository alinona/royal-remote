import type {
  Student, Teacher, ClassSection, AttendanceRecord,
  Grade, BehaviorRecord, FileItem, Folder, ActivityLog,
  DashboardKPIs, AIInsight, ChartDataPoint,
} from "@/types";

// ─── Mock KPIs ───────────────────────────────────────────────────────────────

export const mockKPIs: DashboardKPIs = {
  totalStudents: 1248,
  activeStudents: 1196,
  totalTeachers: 87,
  totalClasses: 42,
  avgAttendanceRate: 92.4,
  avgGPA: 78.6,
  atRiskCount: 34,
  todayAbsent: 56,
  trends: {
    students: 3.2,
    attendance: -1.1,
    grades: 2.8,
    atRisk: -8.5,
  },
};

// ─── Mock Teachers ───────────────────────────────────────────────────────────

export const mockTeachers: Teacher[] = [
  {
    id: "t1", nationalId: "1012345678", employeeCode: "T001",
    firstName: "أحمد", lastName: "الزهراني", fullName: "أحمد الزهراني",
    gender: "male", email: "ahmed@school.edu.sa", phone: "0512345678",
    specialization: "الرياضيات", status: "active", schoolId: "s1",
    classes: [], subjects: [], hireDate: new Date("2018-09-01"),
    qualifications: ["بكالوريوس رياضيات", "دبلوم تربوي"], createdAt: new Date("2018-09-01"),
  },
  {
    id: "t2", nationalId: "1023456789", employeeCode: "T002",
    firstName: "فاطمة", lastName: "العتيبي", fullName: "فاطمة العتيبي",
    gender: "female", email: "fatima@school.edu.sa", phone: "0523456789",
    specialization: "اللغة العربية", status: "active", schoolId: "s1",
    classes: [], subjects: [], hireDate: new Date("2019-09-01"),
    qualifications: ["بكالوريوس لغة عربية"], createdAt: new Date("2019-09-01"),
  },
  {
    id: "t3", nationalId: "1034567890", employeeCode: "T003",
    firstName: "محمد", lastName: "القحطاني", fullName: "محمد القحطاني",
    gender: "male", email: "mohammad@school.edu.sa", phone: "0534567890",
    specialization: "العلوم", status: "active", schoolId: "s1",
    classes: [], subjects: [], hireDate: new Date("2020-09-01"),
    qualifications: ["بكالوريوس علوم"], createdAt: new Date("2020-09-01"),
  },
];

// ─── Mock Classes ─────────────────────────────────────────────────────────────

export const mockClasses: ClassSection[] = [
  {
    id: "c1", name: "الصف الأول - أ", grade: 1, section: "أ",
    academicYear: "1446", schoolId: "s1", teacherId: "t1",
    teacher: mockTeachers[0], studentsCount: 32, subjectsCount: 8,
    room: "101", createdAt: new Date(),
  },
  {
    id: "c2", name: "الصف الأول - ب", grade: 1, section: "ب",
    academicYear: "1446", schoolId: "s1", teacherId: "t2",
    teacher: mockTeachers[1], studentsCount: 30, subjectsCount: 8,
    room: "102", createdAt: new Date(),
  },
  {
    id: "c3", name: "الصف الثاني - أ", grade: 2, section: "أ",
    academicYear: "1446", schoolId: "s1", teacherId: "t3",
    teacher: mockTeachers[2], studentsCount: 28, subjectsCount: 9,
    room: "201", createdAt: new Date(),
  },
];

// ─── Mock Students ────────────────────────────────────────────────────────────

export const mockStudents: Student[] = [
  {
    id: "s1", nationalId: "2012345678", studentCode: "STU001",
    firstName: "عمر", lastName: "الشمري", fullName: "عمر الشمري",
    gender: "male", dateOfBirth: new Date("2012-05-15"), status: "active",
    schoolId: "s1", classId: "c1", class: mockClasses[0],
    guardianName: "خالد الشمري", guardianPhone: "0501234567",
    guardianRelation: "أب", address: "الرياض، حي النزهة",
    enrollmentDate: new Date("2020-09-01"), academicYear: "1446",
    tags: ["متميز", "متفوق"], age: 12, gpa: 92.5,
    attendanceRate: 97, behaviorScore: 95, riskLevel: "low",
    createdAt: new Date("2020-09-01"), updatedAt: new Date(),
  },
  {
    id: "s2", nationalId: "2023456789", studentCode: "STU002",
    firstName: "سارة", lastName: "الدوسري", fullName: "سارة الدوسري",
    gender: "female", dateOfBirth: new Date("2012-08-20"), status: "active",
    schoolId: "s1", classId: "c1", class: mockClasses[0],
    guardianName: "منى الدوسري", guardianPhone: "0512345678",
    guardianRelation: "أم", address: "الرياض، حي الملقا",
    enrollmentDate: new Date("2020-09-01"), academicYear: "1446",
    tags: [], age: 12, gpa: 85.0,
    attendanceRate: 88, behaviorScore: 80, riskLevel: "medium",
    createdAt: new Date("2020-09-01"), updatedAt: new Date(),
  },
  {
    id: "s3", nationalId: "2034567890", studentCode: "STU003",
    firstName: "يوسف", lastName: "الغامدي", fullName: "يوسف الغامدي",
    gender: "male", dateOfBirth: new Date("2011-12-10"), status: "active",
    schoolId: "s1", classId: "c2", class: mockClasses[1],
    guardianName: "صالح الغامدي", guardianPhone: "0523456789",
    guardianRelation: "أب", address: "الرياض، حي العليا",
    enrollmentDate: new Date("2019-09-01"), academicYear: "1446",
    tags: ["يحتاج متابعة"], age: 13, gpa: 62.0,
    attendanceRate: 74, behaviorScore: 65, riskLevel: "high",
    createdAt: new Date("2019-09-01"), updatedAt: new Date(),
  },
  {
    id: "s4", nationalId: "2045678901", studentCode: "STU004",
    firstName: "نورة", lastName: "العنزي", fullName: "نورة العنزي",
    gender: "female", dateOfBirth: new Date("2012-03-25"), status: "active",
    schoolId: "s1", classId: "c1", class: mockClasses[0],
    guardianName: "أحمد العنزي", guardianPhone: "0534567890",
    guardianRelation: "أب", address: "الرياض، حي الروضة",
    enrollmentDate: new Date("2020-09-01"), academicYear: "1446",
    tags: ["نشطة"], age: 12, gpa: 78.5,
    attendanceRate: 95, behaviorScore: 88, riskLevel: "low",
    createdAt: new Date("2020-09-01"), updatedAt: new Date(),
  },
];

// ─── Mock Attendance Data ─────────────────────────────────────────────────────

export const mockAttendanceData: ChartDataPoint[] = [
  { label: "السبت", value: 94 },
  { label: "الأحد", value: 91 },
  { label: "الاثنين", value: 96 },
  { label: "الثلاثاء", value: 89 },
  { label: "الأربعاء", value: 93 },
];

// ─── Mock Grade Distribution ──────────────────────────────────────────────────

export const mockGradeDistribution: ChartDataPoint[] = [
  { label: "ممتاز (90+)", value: 312, color: "#10b981" },
  { label: "جيد جدًا (80-89)", value: 428, color: "#3b82f6" },
  { label: "جيد (70-79)", value: 286, color: "#f59e0b" },
  { label: "مقبول (60-69)", value: 142, color: "#f97316" },
  { label: "ضعيف (<60)", value: 80, color: "#ef4444" },
];

// ─── Mock Monthly Enrollment ──────────────────────────────────────────────────

export const mockMonthlyData: ChartDataPoint[] = [
  { label: "سبت", value: 92, secondary: 85 },
  { label: "أكت", value: 94, secondary: 88 },
  { label: "نوف", value: 91, secondary: 82 },
  { label: "ديس", value: 88, secondary: 79 },
  { label: "يناير", value: 93, secondary: 86 },
  { label: "فبر", value: 95, secondary: 90 },
  { label: "مارس", value: 94, secondary: 87 },
];

// ─── Mock AI Insights ────────────────────────────────────────────────────────

export const mockAIInsights: AIInsight[] = [
  {
    id: "ai1",
    type: "risk",
    severity: "high",
    title: "34 طالبًا في خطر أكاديمي",
    description: "تحليل الذكاء الاصطناعي يكشف أن هؤلاء الطلاب لديهم احتمالية رسوب تتجاوز 65% إذا لم يتم التدخل الفوري.",
    affectedStudents: ["s3"],
    confidence: 87,
    actionItems: [
      "جدولة جلسات دعم إضافية",
      "التواصل مع أولياء الأمور",
      "مراجعة خطة الدراسة",
    ],
    createdAt: new Date(),
  },
  {
    id: "ai2",
    type: "prediction",
    severity: "medium",
    title: "انخفاض متوقع في الحضور الأسبوع القادم",
    description: "بناءً على الأنماط التاريخية والتقويم الأكاديمي، يُتوقع انخفاض نسبة الحضور بمقدار 8-12% الأسبوع القادم.",
    confidence: 73,
    actionItems: [
      "إرسال تذكيرات للطلاب وأولياء الأمور",
      "مراجعة جدول الاختبارات",
    ],
    createdAt: new Date(),
  },
  {
    id: "ai3",
    type: "recommendation",
    severity: "low",
    title: "فرصة تحسين أداء الصف الثاني",
    description: "الصف الثاني - أ يظهر أداءً استثنائيًا في الرياضيات. يُنصح بتطبيق نفس أسلوب التدريس على الفصول الأخرى.",
    affectedClasses: ["c3"],
    confidence: 91,
    actionItems: [
      "توثيق أساليب التدريس المستخدمة",
      "مشاركة الخبرة مع بقية المدرسين",
    ],
    createdAt: new Date(),
  },
];

// ─── Mock Activity Logs ───────────────────────────────────────────────────────

export const mockActivityLogs: ActivityLog[] = [
  {
    id: "log1",
    userId: "u1",
    user: { id: "u1", name: "أحمد الزهراني", role: "teacher" },
    action: "attendance_recorded",
    resource: "attendance",
    resourceId: "c1",
    details: { classId: "c1", date: "2024-01-15", count: 32 },
    schoolId: "s1",
    createdAt: new Date(Date.now() - 5 * 60000),
  },
  {
    id: "log2",
    userId: "u2",
    user: { id: "u2", name: "فاطمة العتيبي", role: "teacher" },
    action: "grade_entered",
    resource: "grade",
    resourceId: "s2",
    details: { subject: "اللغة العربية", score: 85, type: "quiz" },
    schoolId: "s1",
    createdAt: new Date(Date.now() - 15 * 60000),
  },
  {
    id: "log3",
    userId: "u3",
    user: { id: "u3", name: "منى السلمي", role: "school_admin" },
    action: "created",
    resource: "student",
    resourceId: "s4",
    details: { studentName: "نورة العنزي" },
    schoolId: "s1",
    createdAt: new Date(Date.now() - 30 * 60000),
  },
  {
    id: "log4",
    userId: "u1",
    user: { id: "u1", name: "أحمد الزهراني", role: "teacher" },
    action: "uploaded",
    resource: "file",
    details: { fileName: "اختبار الرياضيات - الفصل الثاني.pdf" },
    schoolId: "s1",
    createdAt: new Date(Date.now() - 45 * 60000),
  },
  {
    id: "log5",
    userId: "u4",
    user: { id: "u4", name: "خالد المطيري", role: "school_admin" },
    action: "report_generated",
    resource: "report",
    details: { reportType: "تقرير الحضور الشهري" },
    schoolId: "s1",
    createdAt: new Date(Date.now() - 60 * 60000),
  },
];

// ─── Mock Files ───────────────────────────────────────────────────────────────

export const mockFolders: Folder[] = [
  {
    id: "f1", name: "الاختبارات", parentId: undefined,
    schoolId: "s1", ownerId: "u1",
    color: "#6366f1", icon: "folder-pen",
    filesCount: 24, size: 15728640, createdAt: new Date(),
  },
  {
    id: "f2", name: "الواجبات المنزلية", parentId: undefined,
    schoolId: "s1", ownerId: "u1",
    color: "#f59e0b", icon: "folder-open",
    filesCount: 18, size: 8388608, createdAt: new Date(),
  },
  {
    id: "f3", name: "المناهج والكتب", parentId: undefined,
    schoolId: "s1", ownerId: "u1",
    color: "#10b981", icon: "folder",
    filesCount: 12, size: 52428800, createdAt: new Date(),
  },
];

export const mockFiles: FileItem[] = [
  {
    id: "fi1", name: "اختبار الرياضيات - الفصل الثاني.pdf",
    type: "pdf", mimeType: "application/pdf", size: 2097152,
    url: "/files/math-exam.pdf", parentId: "f1",
    schoolId: "s1", ownerId: "u1",
    tags: ["رياضيات", "اختبار"], isPublic: false, isShared: true,
    sharedWith: ["t1", "t2"], version: 2,
    createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: "fi2", name: "جدول درجات الفصل الأول.xlsx",
    type: "spreadsheet", mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    size: 524288, url: "/files/grades.xlsx", parentId: "f1",
    schoolId: "s1", ownerId: "u2",
    tags: ["درجات"], isPublic: false, isShared: false,
    sharedWith: [], version: 5,
    createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: "fi3", name: "خطة الدرس - الجبر.docx",
    type: "document", mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    size: 131072, url: "/files/lesson-plan.docx", parentId: "f2",
    schoolId: "s1", ownerId: "u1",
    tags: ["خطة درس", "جبر"], isPublic: true, isShared: true,
    sharedWith: ["all"], version: 1,
    createdAt: new Date(), updatedAt: new Date(),
  },
];

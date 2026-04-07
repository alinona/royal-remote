// ─── Core Domain Types ───────────────────────────────────────────────────────

export type UserRole = "super_admin" | "school_admin" | "teacher" | "secretary";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  schoolId: string;
  createdAt: Date;
  lastActiveAt: Date;
  permissions: Permission[];
}

export type Permission =
  | "students:read" | "students:write" | "students:delete"
  | "classes:read"  | "classes:write"  | "classes:delete"
  | "grades:read"   | "grades:write"
  | "attendance:read" | "attendance:write"
  | "files:read"    | "files:write"    | "files:delete"
  | "reports:read"  | "reports:export"
  | "ai:use"
  | "settings:manage"
  | "users:manage";

// ─── School ──────────────────────────────────────────────────────────────────

export interface School {
  id: string;
  name: string;
  nameAr: string;
  code: string;
  logoUrl?: string;
  address: string;
  city: string;
  region: string;
  phone: string;
  email: string;
  principalName: string;
  academicYear: string;
  studentsCount: number;
  teachersCount: number;
  classesCount: number;
  settings: SchoolSettings;
  createdAt: Date;
}

export interface SchoolSettings {
  gradeScale: "100" | "letter" | "gpa";
  attendanceMethod: "daily" | "per_period";
  workingDays: number[];
  periodsPerDay: number;
  termCount: 2 | 3;
  features: {
    ai: boolean;
    fileManager: boolean;
    behaviorTracking: boolean;
    parentPortal: boolean;
  };
  theme: {
    primaryHue: number;
    accentHue: number;
  };
}

// ─── Student ─────────────────────────────────────────────────────────────────

export type Gender = "male" | "female";
export type StudentStatus = "active" | "inactive" | "graduated" | "transferred" | "suspended";

export interface Student {
  id: string;
  nationalId: string;
  studentCode: string;
  firstName: string;
  lastName: string;
  fullName: string;
  gender: Gender;
  dateOfBirth: Date;
  photoUrl?: string;
  status: StudentStatus;
  schoolId: string;
  classId: string;
  class: ClassSection;
  guardianName: string;
  guardianPhone: string;
  guardianEmail?: string;
  guardianRelation: string;
  address: string;
  enrollmentDate: Date;
  academicYear: string;
  notes?: string;
  tags: string[];
  // Computed
  age: number;
  gpa?: number;
  attendanceRate?: number;
  behaviorScore?: number;
  riskLevel?: "low" | "medium" | "high";
  createdAt: Date;
  updatedAt: Date;
}

// ─── Class ───────────────────────────────────────────────────────────────────

export interface ClassSection {
  id: string;
  name: string;
  grade: number;
  section: string;
  academicYear: string;
  schoolId: string;
  teacherId: string;
  teacher: Teacher;
  studentsCount: number;
  subjectsCount: number;
  room?: string;
  schedule?: WeeklySchedule;
  createdAt: Date;
}

export interface GradeLevel {
  grade: number;
  name: string;
  nameAr: string;
  sections: ClassSection[];
}

// ─── Teacher ─────────────────────────────────────────────────────────────────

export type TeacherStatus = "active" | "on_leave" | "inactive";

export interface Teacher {
  id: string;
  nationalId: string;
  employeeCode: string;
  firstName: string;
  lastName: string;
  fullName: string;
  gender: Gender;
  photoUrl?: string;
  email: string;
  phone: string;
  specialization: string;
  status: TeacherStatus;
  schoolId: string;
  classes: ClassSection[];
  subjects: Subject[];
  hireDate: Date;
  qualifications: string[];
  createdAt: Date;
}

// ─── Subject ─────────────────────────────────────────────────────────────────

export interface Subject {
  id: string;
  name: string;
  nameAr: string;
  code: string;
  gradeLevel: number;
  weeklyHours: number;
  teacherId: string;
  classId: string;
  color: string;
}

// ─── Schedule ────────────────────────────────────────────────────────────────

export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface Period {
  index: number;
  startTime: string;
  endTime: string;
  subjectId?: string;
  subject?: Subject;
  room?: string;
}

export interface WeeklySchedule {
  [day: number]: Period[];
}

// ─── Attendance ──────────────────────────────────────────────────────────────

export type AttendanceStatus = "present" | "absent" | "late" | "excused";

export interface AttendanceRecord {
  id: string;
  studentId: string;
  classId: string;
  subjectId?: string;
  date: Date;
  status: AttendanceStatus;
  minutesLate?: number;
  note?: string;
  recordedBy: string;
  recordedAt: Date;
}

export interface AttendanceSummary {
  studentId: string;
  totalDays: number;
  present: number;
  absent: number;
  late: number;
  excused: number;
  rate: number;
}

// ─── Grades ──────────────────────────────────────────────────────────────────

export type GradeType = "quiz" | "homework" | "midterm" | "final" | "project" | "participation";

export interface Grade {
  id: string;
  studentId: string;
  subjectId: string;
  classId: string;
  type: GradeType;
  score: number;
  maxScore: number;
  percentage: number;
  term: 1 | 2 | 3;
  academicYear: string;
  date: Date;
  notes?: string;
  enteredBy: string;
  enteredAt: Date;
}

export interface SubjectGradeSummary {
  subjectId: string;
  subject: Subject;
  quizAvg: number;
  homeworkAvg: number;
  midterm?: number;
  final?: number;
  total: number;
  grade: string;
  term: number;
}

export interface StudentAcademicReport {
  student: Student;
  term: number;
  academicYear: string;
  subjects: SubjectGradeSummary[];
  gpa: number;
  rank: number;
  classSize: number;
  attendanceRate: number;
  behaviorScore: number;
  comments: string;
  promotionStatus: "promoted" | "retained" | "pending";
}

// ─── Behavior ────────────────────────────────────────────────────────────────

export type BehaviorType = "positive" | "negative" | "neutral";
export type BehaviorCategory =
  | "discipline" | "participation" | "respect" | "teamwork"
  | "punctuality" | "homework" | "achievement" | "other";

export interface BehaviorRecord {
  id: string;
  studentId: string;
  classId: string;
  type: BehaviorType;
  category: BehaviorCategory;
  description: string;
  severity?: 1 | 2 | 3;
  points: number;
  date: Date;
  recordedBy: string;
}

// ─── Files ───────────────────────────────────────────────────────────────────

export type FileType = "document" | "spreadsheet" | "pdf" | "image" | "video" | "audio" | "archive" | "other";

export interface FileItem {
  id: string;
  name: string;
  type: FileType;
  mimeType: string;
  size: number;
  url: string;
  thumbnailUrl?: string;
  parentId?: string;
  schoolId: string;
  ownerId: string;
  classId?: string;
  subjectId?: string;
  studentId?: string;
  tags: string[];
  isPublic: boolean;
  isShared: boolean;
  sharedWith: string[];
  version: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Folder {
  id: string;
  name: string;
  parentId?: string;
  schoolId: string;
  ownerId: string;
  color: string;
  icon: string;
  filesCount: number;
  size: number;
  createdAt: Date;
}

// ─── AI ──────────────────────────────────────────────────────────────────────

export interface AIInsight {
  id: string;
  type: "risk" | "improvement" | "anomaly" | "recommendation" | "prediction";
  severity: "low" | "medium" | "high" | "critical";
  title: string;
  description: string;
  affectedStudents?: string[];
  affectedClasses?: string[];
  confidence: number;
  actionItems: string[];
  createdAt: Date;
}

export interface ExamQuestion {
  id: string;
  type: "mcq" | "true_false" | "short_answer" | "essay";
  text: string;
  options?: string[];
  correctAnswer?: string | number;
  points: number;
  difficulty: "easy" | "medium" | "hard";
  topic: string;
}

export interface GeneratedExam {
  id: string;
  title: string;
  subjectId: string;
  classId: string;
  duration: number;
  totalPoints: number;
  questions: ExamQuestion[];
  createdBy: string;
  createdAt: Date;
}

// ─── Activity Log ────────────────────────────────────────────────────────────

export type ActivityAction =
  | "created" | "updated" | "deleted" | "viewed"
  | "logged_in" | "logged_out"
  | "uploaded" | "downloaded" | "exported"
  | "grade_entered" | "attendance_recorded"
  | "report_generated" | "ai_query";

export interface ActivityLog {
  id: string;
  userId: string;
  user: Pick<User, "id" | "name" | "role">;
  action: ActivityAction;
  resource: string;
  resourceId?: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  schoolId: string;
  createdAt: Date;
}

// ─── Reports ─────────────────────────────────────────────────────────────────

export interface ReportFilter {
  schoolId: string;
  academicYear?: string;
  term?: number;
  classId?: string;
  subjectId?: string;
  gradeLevel?: number;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface DashboardKPIs {
  totalStudents: number;
  activeStudents: number;
  totalTeachers: number;
  totalClasses: number;
  avgAttendanceRate: number;
  avgGPA: number;
  atRiskCount: number;
  todayAbsent: number;
  trends: {
    students: number;
    attendance: number;
    grades: number;
    atRisk: number;
  };
}

export interface ChartDataPoint {
  label: string;
  value: number;
  secondary?: number;
  color?: string;
}

// ─── API Response ────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  message?: string;
  meta?: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string[]>;
}

// ─── Search ──────────────────────────────────────────────────────────────────

export interface SearchResult {
  type: "student" | "teacher" | "class" | "file";
  id: string;
  title: string;
  subtitle: string;
  avatarUrl?: string;
  url: string;
  highlights?: string[];
}

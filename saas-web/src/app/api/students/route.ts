import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// ─── Validation Schemas ───────────────────────────────────────────────────────

const createStudentSchema = z.object({
  nationalId:      z.string().min(10).max(10),
  firstName:       z.string().min(2).max(50),
  lastName:        z.string().min(2).max(50),
  gender:          z.enum(["MALE", "FEMALE"]),
  dateOfBirth:     z.string().datetime(),
  classId:         z.string().cuid(),
  guardianName:    z.string().min(2),
  guardianPhone:   z.string().min(10),
  guardianEmail:   z.string().email().optional(),
  guardianRelation:z.string(),
  address:         z.string(),
  enrollmentDate:  z.string().datetime().optional(),
  notes:           z.string().optional(),
  tags:            z.array(z.string()).optional(),
});

const querySchema = z.object({
  search:    z.string().optional(),
  status:    z.enum(["ACTIVE", "INACTIVE", "GRADUATED", "TRANSFERRED", "SUSPENDED"]).optional(),
  classId:   z.string().optional(),
  gradeLevel:z.coerce.number().optional(),
  risk:      z.enum(["low", "medium", "high"]).optional(),
  page:      z.coerce.number().default(1),
  limit:     z.coerce.number().max(100).default(20),
  sort:      z.enum(["name", "code", "createdAt", "gpa", "attendance"]).default("name"),
  order:     z.enum(["asc", "desc"]).default("asc"),
});

// ─── GET /api/students ────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const params = querySchema.parse(Object.fromEntries(searchParams));

    // In production, get schoolId from auth session
    const schoolId = req.headers.get("x-school-id") ?? "demo";

    // Mock response (replace with Prisma query)
    const mockStudents = [
      {
        id: "s1",
        studentCode: "STU001",
        firstName: "عمر",
        lastName: "الشمري",
        fullName: "عمر الشمري",
        gender: "MALE",
        status: "ACTIVE",
        class: { id: "c1", name: "الصف الأول - أ", grade: 1 },
        gpa: 92.5,
        attendanceRate: 97,
        riskLevel: "low",
        createdAt: new Date().toISOString(),
      },
    ];

    return NextResponse.json({
      data: mockStudents,
      meta: {
        total: 1248,
        page: params.page,
        limit: params.limit,
        pages: Math.ceil(1248 / params.limit),
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { code: "VALIDATION_ERROR", message: "بيانات غير صالحة", details: error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    console.error("GET /api/students error:", error);
    return NextResponse.json(
      { code: "INTERNAL_ERROR", message: "خطأ داخلي في الخادم" },
      { status: 500 }
    );
  }
}

// ─── POST /api/students ───────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = createStudentSchema.parse(body);

    const schoolId = req.headers.get("x-school-id") ?? "demo";

    // Generate student code
    const studentCode = `STU${Date.now().toString().slice(-6)}`;

    // In production: create in DB with Prisma
    const student = {
      id: `s_${Date.now()}`,
      studentCode,
      ...data,
      schoolId,
      fullName: `${data.firstName} ${data.lastName}`,
      age: Math.floor((Date.now() - new Date(data.dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000)),
      status: "ACTIVE",
      enrollmentDate: data.enrollmentDate ?? new Date().toISOString(),
      academicYear: "1446",
      tags: data.tags ?? [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Log activity (in production)
    // await logActivity({ action: "CREATED", resource: "student", resourceId: student.id, ... });

    return NextResponse.json(
      { data: student, message: "تم إنشاء سجل الطالب بنجاح" },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { code: "VALIDATION_ERROR", message: "بيانات غير صالحة", details: error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    console.error("POST /api/students error:", error);
    return NextResponse.json(
      { code: "INTERNAL_ERROR", message: "خطأ داخلي في الخادم" },
      { status: 500 }
    );
  }
}

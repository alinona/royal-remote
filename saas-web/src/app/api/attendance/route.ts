import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const attendanceSchema = z.object({
  classId:     z.string(),
  date:        z.string(),
  records:     z.array(z.object({
    studentId:   z.string(),
    status:      z.enum(["PRESENT", "ABSENT", "LATE", "EXCUSED"]),
    minutesLate: z.number().optional(),
    note:        z.string().optional(),
  })),
  subjectId:   z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = attendanceSchema.parse(body);
    const schoolId = req.headers.get("x-school-id") ?? "demo";
    const teacherId = req.headers.get("x-teacher-id") ?? "t1";

    // In production: bulk upsert to DB
    const results = data.records.map(r => ({
      id: `att_${r.studentId}_${data.date}`,
      ...r,
      classId: data.classId,
      date: data.date,
      schoolId,
      recordedById: teacherId,
      createdAt: new Date().toISOString(),
    }));

    return NextResponse.json({
      data: results,
      message: `تم تسجيل حضور ${results.length} طالب بنجاح`,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { code: "VALIDATION_ERROR", details: error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { code: "INTERNAL_ERROR", message: "خطأ في تسجيل الحضور" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const classId = searchParams.get("classId");
  const date = searchParams.get("date");
  const schoolId = req.headers.get("x-school-id") ?? "demo";

  // Mock attendance summary
  return NextResponse.json({
    data: {
      classId,
      date,
      summary: {
        total: 32,
        present: 28,
        absent: 2,
        late: 1,
        excused: 1,
        rate: 87.5,
      },
      records: [],
    },
  });
}

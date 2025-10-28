import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CheckCircle, XCircle, Calendar } from "lucide-react";
import { redirect } from "next/navigation";
import { AttendanceFilters } from "@/app/components/instructor/attendance-filters";
import { AttendanceList } from "@/app/components/instructor/attendance-list";

// FIX: Define an interface based on the shape of the enrollment data
interface EnrollmentWithStudent {
  id: string;
  student_id: string;
  students: {
    id: string;
    name: string;
    email: string;
  } | null; // The foreign table 'students' can be null
}

export default async function InstructorAttendancePage({
  searchParams,
}: {
  searchParams: Promise<{ course?: string; date?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Get instructor's courses
  const { data: courses } = await supabase
    .from("courses")
    .select("id, title")
    .eq("instructor_id", user.id)
    .order("title");

  if (!courses || courses.length === 0) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="py-12">
            <p className="text-center text-gray-500">
              No courses assigned. Contact admin to get courses assigned.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const selectedCourse = params?.course || courses[0]?.id;
  const selectedDate = params?.date || new Date().toISOString().split("T")[0];

  // Get enrollments for selected course
  const { data: enrollments } = await supabase
    .from("enrollments")
    .select(
      `
      id,
      student_id,
      students!enrollments_student_id_fkey(
        id,
        name,
        email
      )
    `
    )
    .eq("course_id", selectedCourse)
    .eq("status", "active")
    // FIX: Apply the type to the returned data
    .returns<EnrollmentWithStudent[]>();

  // Get attendance records for selected date
  const { data: attendanceRecords } = await supabase
    .from("attendance")
    .select("*")
    .eq("course_id", selectedCourse)
    .eq("session_date", selectedDate);

  // Merge data
  const studentsWithAttendance = enrollments?.map(
    (enrollment: EnrollmentWithStudent) => {
      // FIX: Use the defined interface
      const attendanceRecord = attendanceRecords?.find(
        (a) => a.enrollment_id === enrollment.id
      );

      return {
        enrollmentId: enrollment.id,
        studentId: enrollment.student_id,
        // Use optional chaining for safety, as students can be null
        studentName: enrollment.students?.name || "Unknown",
        studentEmail: enrollment.students?.email || "Unknown",
        attendanceStatus: attendanceRecord?.status || "unmarked",
        attendanceId: attendanceRecord?.id,
        notes: attendanceRecord?.notes,
      };
    }
  );

  // Calculate stats
  const totalStudents = studentsWithAttendance?.length || 0;
  const presentCount =
    studentsWithAttendance?.filter((s) => s.attendanceStatus === "present")
      .length || 0;
  const absentCount =
    studentsWithAttendance?.filter((s) => s.attendanceStatus === "absent")
      .length || 0;
  // FIX: (Proactive fix for unused var) Prefix with _
  const _lateCount =
    studentsWithAttendance?.filter((s) => s.attendanceStatus === "late")
      .length || 0;
  const attendanceRate =
    totalStudents > 0 ? Math.round((presentCount / totalStudents) * 100) : 0;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Mark Attendance</h1>
        <p className="text-gray-600 mt-1">
          Record student attendance for your courses
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Students
              </CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalStudents}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">
                Present
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {presentCount}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">
                Absent
              </CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{absentCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">
                Attendance Rate
              </CardTitle>
              <Calendar className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">
              {attendanceRate}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <AttendanceFilters
        courses={courses}
        selectedCourse={selectedCourse}
        selectedDate={selectedDate}
      />

      {/* Attendance List */}
      <AttendanceList
        students={studentsWithAttendance || []}
        courseId={selectedCourse}
        sessionDate={selectedDate}
      />
    </div>
  );
}

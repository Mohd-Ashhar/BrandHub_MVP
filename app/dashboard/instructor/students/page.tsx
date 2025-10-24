import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Mail, BookOpen } from "lucide-react";
import { redirect } from "next/navigation";

// FIX: Define interface for the student data from Supabase
interface StudentRow {
  id: string;
  name: string;
  email: string;
  engagement_score: number | null;
  [key: string]: any; // Allow other properties from select *
}

// FIX: Define interface for the final student object with added properties
interface StudentWithCourses extends StudentRow {
  enrollments_count: number;
  courses: string[];
}

export default async function InstructorStudentsPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Get instructor's course IDs
  const { data: courses } = await supabase
    .from("courses")
    .select("id, title")
    .eq("instructor_id", user.id);

  const courseIds = courses?.map((c) => c.id) || [];

  console.log("📚 Instructor courses:", courses);
  console.log("📝 Course IDs:", courseIds);

  // If no courses, return early
  if (courseIds.length === 0) {
    return (
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Students</h1>
          <p className="text-gray-600 mt-1">
            All students enrolled in your courses
          </p>
        </div>
        <Card>
          <CardContent className="py-12">
            <p className="text-center text-gray-500">
              No courses assigned yet. Contact admin to get courses assigned.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Get all enrollments for instructor's courses
  const { data: enrollments, error: enrollmentError } = await supabase
    .from("enrollments")
    .select("*")
    .in("course_id", courseIds)
    .eq("status", "active");

  console.log("📊 Enrollments:", enrollments);
  console.log("❌ Enrollment error:", enrollmentError);

  // Get student IDs from enrollments
  const studentIds = enrollments?.map((e) => e.student_id) || [];
  const uniqueStudentIds = [...new Set(studentIds)];

  console.log("👥 Student IDs:", uniqueStudentIds);

  // Fetch student details
  let students: StudentWithCourses[] = []; // FIX: Use StudentWithCourses[]
  if (uniqueStudentIds.length > 0) {
    const { data: studentsData } = await supabase
      .from("students")
      .select("*")
      .in("id", uniqueStudentIds)
      .returns<StudentRow[]>(); // FIX: Add .returns() for type safety

    console.log("👨‍🎓 Students data:", studentsData);

    // Add enrollment count and courses to each student
    students =
      studentsData?.map((student): StudentWithCourses => {
        // FIX: Type student and return
        const studentEnrollments = enrollments?.filter(
          (e) => e.student_id === student.id
        );
        const studentCourses = studentEnrollments?.map((e) => {
          const course = courses?.find((c) => c.id === e.course_id);
          return course?.title || "Unknown";
        });

        return {
          ...student,
          enrollments_count: studentEnrollments?.length || 0,
          courses: studentCourses || [],
        };
      }) || [];
  }

  const avgEngagement =
    students.length > 0
      ? Math.round(
          students.reduce((acc, s) => acc + (s.engagement_score || 0), 0) /
            students.length
        )
      : 0;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Students</h1>
        <p className="text-gray-600 mt-1">
          All students enrolled in your courses
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{students.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Active Enrollments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{enrollments?.length || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Avg Engagement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{avgEngagement}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Students List */}
      <Card>
        <CardHeader>
          <CardTitle>All Students</CardTitle>
        </CardHeader>
        <CardContent>
          {students && students.length > 0 ? (
            <div className="space-y-3">
              {students.map((student: StudentWithCourses) => {
                // FIX: Type student
                const initials = student.name
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2);

                return (
                  <div
                    key={student.id}
                    className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-blue-100 text-blue-700">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-lg">{student.name}</p>
                          <p className="text-sm text-gray-500 flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {student.email}
                          </p>
                          <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                            <BookOpen className="h-3 w-3" />
                            Enrolled in {student.enrollments_count} course(s)
                          </p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {student.courses.map(
                              (courseName: string, idx: number) => (
                                <Badge
                                  key={idx}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {courseName}
                                </Badge>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                      <Badge
                        className={
                          student.engagement_score &&
                          student.engagement_score >= 70
                            ? "bg-green-100 text-green-700"
                            : student.engagement_score &&
                              student.engagement_score >= 50
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }
                      >
                        {student.engagement_score || 0}% engaged
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-center py-12 text-gray-500">
              No students enrolled in your courses yet.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

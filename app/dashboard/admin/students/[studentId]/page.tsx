import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { EnrollmentForm } from "@/app/components/admin/enrollment-form";
import { DeleteStudentButton } from "@/app/components/admin/delete-student-button";

export default async function StudentDetailPage({
  params,
}: {
  params: Promise<{ studentId: string }>;
}) {
  const { studentId } = await params;
  const supabase = createClient();

  console.log("🔍 Looking for student:", studentId);

  // Fetch student
  const { data: student, error: studentError } = await supabase
    .from("students")
    .select("*")
    .eq("id", studentId)
    .single();

  if (!student || studentError) {
    console.error("❌ Student not found:", studentError);
    notFound();
  }

  console.log("✅ Found student:", student.name, student.email);

  // Fetch available courses
  const { data: allCourses } = await supabase
    .from("courses")
    .select("id, title, status")
    .in("status", ["active", "upcoming"])
    .order("title");

  // ✅ FIX: Better enrollment query with debug logging
  const { data: enrollmentsRaw, error: enrollmentError } = await supabase
    .from("enrollments")
    .select("*")
    .eq("student_id", studentId);

  console.log("📊 Raw enrollments:", enrollmentsRaw);
  console.log("❌ Enrollment error:", enrollmentError);

  // Build enrollments with course details
  let enrollments: any[] = [];
  if (enrollmentsRaw && enrollmentsRaw.length > 0) {
    const courseIds = enrollmentsRaw.map((e) => e.course_id);
    console.log("📚 Course IDs:", courseIds);

    const { data: coursesData } = await supabase
      .from("courses")
      .select("*")
      .in("id", courseIds);

    console.log("📚 Courses data:", coursesData);

    enrollments = enrollmentsRaw.map((enrollment) => {
      const course = coursesData?.find((c) => c.id === enrollment.course_id);
      return {
        ...enrollment,
        course: course || null,
      };
    });

    console.log("✅ Final enrollments:", enrollments);
  }

  // Filter available courses
  const enrolledCourseIds = enrollments.map((e) => e.course_id);
  const availableCourses =
    allCourses?.filter((c) => !enrolledCourseIds.includes(c.id)) || [];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link href="/dashboard/admin/students">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Students
          </Button>
        </Link>
        <div className="flex gap-2">
          <Link href={`/dashboard/admin/students/${studentId}/edit`}>
            <Button variant="outline">Edit</Button>
          </Link>
          <DeleteStudentButton
            studentId={studentId}
            studentName={student.name}
          />
        </div>
      </div>

      {/* Debug Info - Remove after testing */}
      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="pt-4">
          <p className="text-sm font-mono">
            <strong>Debug:</strong> Student ID: {studentId}
          </p>
          <p className="text-sm font-mono">
            Enrollments found: {enrollments.length}
          </p>
          <p className="text-sm font-mono">
            Available courses: {availableCourses.length}
          </p>
        </CardContent>
      </Card>

      {/* Student Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-2xl">{student.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 text-gray-600">
              <Mail className="h-4 w-4" />
              <span>{student.email}</span>
            </div>
            {student.phone_number && (
              <div className="flex items-center gap-2 text-gray-600">
                <Phone className="h-4 w-4" />
                <span>{student.phone_number}</span>
              </div>
            )}
            {(student.city || student.state) && (
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>
                  {[student.city, student.state].filter(Boolean).join(", ")}
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Engagement Score</p>
              <p className="text-2xl font-bold">{student.engagement_score}%</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Enrolled Courses</p>
              <p className="text-2xl font-bold">{enrollments.length}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Joined</p>
              <p className="text-sm">
                {new Date(student.created_at).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enroll in New Course */}
      {availableCourses && availableCourses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Enroll in a New Course</CardTitle>
          </CardHeader>
          <CardContent>
            <EnrollmentForm
              studentId={studentId}
              availableCourses={availableCourses}
            />
          </CardContent>
        </Card>
      )}

      {/* Enrolled Courses */}
      <Card>
        <CardHeader>
          <CardTitle>Enrolled Courses ({enrollments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {enrollments && enrollments.length > 0 ? (
            <div className="space-y-4">
              {enrollments.map((enrollment) => (
                <div
                  key={enrollment.id}
                  className="border rounded-lg p-4 flex items-center justify-between hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold">
                      {enrollment.course?.title || "Course not found"}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {enrollment.course?.description || "No description"}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-sm">
                      <Badge>{enrollment.course?.status || "unknown"}</Badge>
                      <span className="text-gray-500">
                        Progress: {enrollment.progress}%
                      </span>
                      <span className="text-gray-500">
                        Enrolled:{" "}
                        {new Date(
                          enrollment.enrollment_date
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  {enrollment.course && (
                    <Link
                      href={`/dashboard/admin/courses/${enrollment.course_id}`}
                    >
                      <Button variant="outline" size="sm">
                        View Course
                      </Button>
                    </Link>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center py-8 text-gray-500">
              This student is not enrolled in any courses yet.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

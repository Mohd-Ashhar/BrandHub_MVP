import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, BookOpen, Award } from "lucide-react";
import { redirect } from "next/navigation";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export default async function InstructorPerformancePage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Get instructor's courses
  const { data: courses } = await supabase
    .from("courses")
    .select("id, title, current_enrolled, capacity, status")
    .eq("instructor_id", user.id);

  const courseIds = courses?.map((c) => c.id) || [];

  // Get all enrollments
  const { data: enrollments } = await supabase
    .from("enrollments")
    .select("student_id, progress, status")
    .in("course_id", courseIds);

  // Get attendance stats
  const { data: attendanceRecords } = await supabase
    .from("attendance")
    .select("status")
    .in("course_id", courseIds);

  // Calculate stats
  const totalStudents = [...new Set(enrollments?.map((e) => e.student_id))]
    .length;
  const totalEnrollments = enrollments?.length || 0;
  const avgProgress =
    enrollments && enrollments.length > 0
      ? Math.round(
          enrollments.reduce((acc, e) => acc + (e.progress || 0), 0) /
            enrollments.length
        )
      : 0;

  const presentCount =
    attendanceRecords?.filter((a) => a.status === "present").length || 0;
  const totalAttendance = attendanceRecords?.length || 0;
  const attendanceRate =
    totalAttendance > 0
      ? Math.round((presentCount / totalAttendance) * 100)
      : 0;

  // Course performance
  const coursePerformance = courses?.map((course) => {
    const courseEnrollments = enrollments?.filter((e) => e.status === "active");
    const avgCourseProgress =
      courseEnrollments && courseEnrollments.length > 0
        ? Math.round(
            courseEnrollments.reduce((acc, e) => acc + (e.progress || 0), 0) /
              courseEnrollments.length
          )
        : 0;

    const fillRate = course.capacity
      ? Math.round(((course.current_enrolled || 0) / course.capacity) * 100)
      : 0;

    return {
      ...course,
      avgProgress: avgCourseProgress,
      fillRate,
    };
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Teaching Performance
        </h1>
        <p className="text-gray-600 mt-1">View your teaching analytics</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Courses
              </CardTitle>
              <BookOpen className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{courses?.length || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Students
              </CardTitle>
              <Users className="h-4 w-4 text-green-600" />
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
                Avg Completion
              </CardTitle>
              <Award className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{avgProgress}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">
                Attendance Rate
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{attendanceRate}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Course Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Course Performance</CardTitle>
        </CardHeader>
        <CardContent>
          {coursePerformance && coursePerformance.length > 0 ? (
            <div className="space-y-6">
              {coursePerformance.map((course) => (
                <div key={course.id} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{course.title}</h3>
                      <p className="text-sm text-gray-500">
                        {course.current_enrolled}/{course.capacity} students
                        enrolled
                      </p>
                    </div>
                    <Badge
                      className={
                        course.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }
                    >
                      {course.status}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">
                        Enrollment Fill Rate
                      </span>
                      <span className="font-medium">{course.fillRate}%</span>
                    </div>
                    <Progress value={course.fillRate} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">
                        Avg Student Progress
                      </span>
                      <span className="font-medium">{course.avgProgress}%</span>
                    </div>
                    <Progress value={course.avgProgress} className="h-2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center py-12 text-gray-500">
              No course performance data available yet.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

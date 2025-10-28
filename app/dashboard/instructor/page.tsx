import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  BookOpen,
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function InstructorDashboardPage() {
  const supabase = createClient();

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get profile info
  const { data: profile } = await supabase
    .from("profiles")
    .select("name, email")
    .eq("id", user.id)
    .single();

  // Fetch instructor's courses
  const { data: courses, count: coursesCount } = await supabase
    .from("courses")
    .select(
      `
      *,
      brands!courses_brand_id_fkey(name, id)
    `,
      { count: "exact" }
    )
    .eq("instructor_id", user.id);

  // Get total students across all instructor's courses
  const courseIds = courses?.map((c) => c.id) || [];

  const { count: totalStudents } = await supabase
    .from("enrollments")
    .select("*", { count: "exact", head: true })
    .in("course_id", courseIds)
    .eq("status", "active");

  // Get upcoming courses (courses that haven't ended yet)
  const { data: upcomingCourses, count: upcomingCount } = await supabase
    .from("courses")
    .select(
      `
      *,
      brands!courses_brand_id_fkey(name)
    `,
      { count: "exact" }
    )
    .eq("instructor_id", user.id)
    .gte("end_date", new Date().toISOString())
    .order("start_date", { ascending: true })
    .limit(5);

  // Get recent enrollments in instructor's courses
  const { data: recentEnrollments } = await supabase
    .from("enrollments")
    .select(
      `
      *,
      students!enrollments_student_id_fkey(
        name,
        email
      ),
      courses!enrollments_course_id_fkey(
        title,
        brands!courses_brand_id_fkey(name)
      )
    `
    )
    .in("course_id", courseIds)
    .order("enrolled_at", { ascending: false })
    .limit(5);

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {profile?.name?.split(" ")[0] || "Instructor"}! 👋
        </h1>
        <p className="text-gray-600 mt-1">
          Here&apos;s what&apos;s happening with your courses today
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              My Courses
            </CardTitle>
            <BookOpen className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {coursesCount || 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">Total courses assigned</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Students
            </CardTitle>
            <Users className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {totalStudents || 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Across all your courses
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Upcoming Classes
            </CardTitle>
            <Calendar className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {upcomingCount || 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">Scheduled this month</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Avg. Completion
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">78%</div>
            <p className="text-xs text-gray-500 mt-1">
              Student completion rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Link href="/dashboard/instructor/attendance">
            <div className="p-4 border-2 border-dashed border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all cursor-pointer group">
              <CheckCircle className="h-8 w-8 text-green-600 mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-gray-900">Mark Attendance</h3>
              <p className="text-sm text-gray-500 mt-1">
                Record student attendance
              </p>
            </div>
          </Link>

          <Link href="/dashboard/instructor/courses">
            <div className="p-4 border-2 border-dashed border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer group">
              <BookOpen className="h-8 w-8 text-blue-600 mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-gray-900">View Courses</h3>
              <p className="text-sm text-gray-500 mt-1">Manage your courses</p>
            </div>
          </Link>

          <Link href="/dashboard/instructor/students">
            <div className="p-4 border-2 border-dashed border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all cursor-pointer group">
              <Users className="h-8 w-8 text-purple-600 mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-gray-900">View Students</h3>
              <p className="text-sm text-gray-500 mt-1">
                See all enrolled students
              </p>
            </div>
          </Link>

          <Link href="/dashboard/instructor/analytics">
            <div className="p-4 border-2 border-dashed border-gray-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all cursor-pointer group">
              <TrendingUp className="h-8 w-8 text-orange-600 mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-gray-900">Performance</h3>
              <p className="text-sm text-gray-500 mt-1">
                View teaching analytics
              </p>
            </div>
          </Link>
        </CardContent>
      </Card>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Courses */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              Upcoming Classes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingCourses && upcomingCourses.length > 0 ? (
              <div className="space-y-3">
                {upcomingCourses.map((course) => (
                  <div
                    key={course.id}
                    className="flex items-start justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">
                        {course.title}
                      </h4>
                      <p className="text-sm text-gray-500 mt-1">
                        {course.brands?.name}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(course.start_date).toLocaleDateString(
                          "en-IN",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </p>
                    </div>
                    <Link href={`/dashboard/instructor/courses/${course.id}`}>
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No upcoming classes</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Enrollments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-600" />
              Recent Enrollments
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentEnrollments && recentEnrollments.length > 0 ? (
              <div className="space-y-3">
                {recentEnrollments.map((enrollment) => (
                  <div
                    key={enrollment.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                        <span className="text-sm font-semibold text-green-700">
                          {enrollment.students?.name
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                            .slice(0, 2) || "??"}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {enrollment.students?.name || "Unknown"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {enrollment.courses?.title}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(enrollment.enrolled_at).toLocaleDateString(
                        "en-IN",
                        { day: "numeric", month: "short" }
                      )}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No recent enrollments</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Teaching Tips */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white rounded-lg">
              <AlertCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2">
                💡 Teaching Tip of the Day
              </h3>
              <p className="text-gray-700 text-sm">
                Students who receive personalized feedback within 24 hours are
                42% more likely to complete the course. Consider using the
                &quot;At-Risk Students&quot; feature to identify students who need extra
                attention.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
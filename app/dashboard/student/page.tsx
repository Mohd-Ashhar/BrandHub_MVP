import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen,
  Calendar,
  Award,
  TrendingUp,
  Sparkles,
  Clock,
  CheckCircle,
  Target,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function StudentDashboardPage() {
  const supabase = createClient();

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get student profile
  const { data: student } = await supabase
    .from("students")
    .select("name, email, engagement_score, created_at")
    .eq("id", user.id)
    .single();

  // Get enrolled courses with progress
  const { data: enrollments, count: enrollmentCount } = await supabase
    .from("enrollments")
    .select(
      `
      *,
      courses!enrollments_course_id_fkey(
        *,
        brands!courses_brand_id_fkey(name, logo),
        instructors:instructor_id(name)
      )
    `,
      { count: "exact" }
    )
    .eq("student_id", user.id)
    .eq("status", "active")
    .order("enrolled_at", { ascending: false });

  // Get completed courses
  const { count: completedCount } = await supabase
    .from("enrollments")
    .select("*", { count: "exact", head: true })
    .eq("student_id", user.id)
    .eq("status", "completed");

  // Calculate average progress
  const avgProgress =
    enrollments && enrollments.length > 0
      ? Math.round(
          enrollments.reduce((sum, e) => sum + (e.progress || 0), 0) /
            enrollments.length
        )
      : 0;

  // Get upcoming classes (courses that haven't ended yet)
  const { data: upcomingCourses } = await supabase
    .from("enrollments")
    .select(
      `
      *,
      courses!enrollments_course_id_fkey(
        id,
        title,
        start_date,
        end_date,
        brands!courses_brand_id_fkey(name)
      )
    `
    )
    .eq("student_id", user.id)
    .eq("status", "active")
    .gte("courses.end_date", new Date().toISOString())
    .order("courses.start_date", { ascending: true })
    .limit(3);

  // Get recommended courses (placeholder - you can enhance with AI later)
  const { data: recommendedCourses } = await supabase
    .from("courses")
    .select(
      `
      *,
      brands!courses_brand_id_fkey(name, logo)
    `
    )
    .gte("start_date", new Date().toISOString())
    .limit(3);

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            Welcome back, {student?.name?.split(" ")[0] || "Student"}!
          </h1>
          <p className="text-gray-600 mt-1">
            Continue your learning journey and achieve your goals
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Enrolled Courses
            </CardTitle>
            <BookOpen className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {enrollmentCount || 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">Active enrollments</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Completed
            </CardTitle>
            <CheckCircle className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {completedCount || 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">Courses finished</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Avg. Progress
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {avgProgress}%
            </div>
            <Progress value={avgProgress} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Engagement
            </CardTitle>
            <Target className="h-5 w-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {student?.engagement_score || 0}%
            </div>
            <p className="text-xs text-gray-500 mt-1">Keep it up!</p>
          </CardContent>
        </Card>
      </div>

      {/* Continue Learning Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-600" />
            Continue Learning
          </CardTitle>
        </CardHeader>
        <CardContent>
          {enrollments && enrollments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {enrollments.slice(0, 3).map((enrollment) => (
                <div
                  key={enrollment.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                      <BookOpen className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 mb-1">
                        {enrollment.courses?.brands?.name}
                      </p>
                      <h3 className="font-semibold text-gray-900 line-clamp-2">
                        {enrollment.courses?.title}
                      </h3>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium">
                        {enrollment.progress || 0}%
                      </span>
                    </div>
                    <Progress value={enrollment.progress || 0} />
                  </div>

                  <Link
                    href={`/dashboard/student/courses/${enrollment.course_id}`}
                  >
                    <Button className="w-full mt-4" size="sm">
                      Continue
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                No courses yet
              </h3>
              <p className="text-gray-500 mb-4">
                Start your learning journey by enrolling in a course
              </p>
              <Link href="/dashboard/student/courses">
                <Button>Browse Courses</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Classes */}
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
                {upcomingCourses.map((enrollment) => (
                  <div
                    key={enrollment.id}
                    className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 rounded-lg bg-purple-100 flex flex-col items-center justify-center">
                        <span className="text-lg font-bold text-purple-700">
                          {new Date(enrollment.courses.start_date).getDate()}
                        </span>
                        <span className="text-xs text-purple-600">
                          {new Date(
                            enrollment.courses.start_date
                          ).toLocaleDateString("en-IN", { month: "short" })}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 truncate">
                        {enrollment.courses.title}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {enrollment.courses.brands?.name}
                      </p>
                      <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                        <Clock className="h-3 w-3" />
                        {new Date(
                          enrollment.courses.start_date
                        ).toLocaleTimeString("en-IN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
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

        {/* Recommended Courses */}
        <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-yellow-500" />
              Recommended For You
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recommendedCourses && recommendedCourses.length > 0 ? (
              <div className="space-y-3">
                {recommendedCourses.map((course) => (
                  <div
                    key={course.id}
                    className="bg-white p-4 rounded-lg border border-blue-200 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-3 mb-2">
                      <div className="h-10 w-10 rounded bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center flex-shrink-0">
                        <BookOpen className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 line-clamp-1">
                          {course.title}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {course.brands?.name}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-blue-700 bg-blue-100 px-2 py-1 rounded inline-block mb-3">
                      Based on your learning goals
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      Enroll Now
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Sparkles className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No recommendations available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Motivational Banner */}
      <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-none">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              <Award className="h-16 w-16 text-yellow-300" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2">
                Keep Learning, Keep Growing!
              </h3>
              <p className="text-purple-100 text-sm">
                You&apos;re on track to complete{" "}
                <strong>{enrollmentCount || 0}</strong> courses. Every lesson
                brings you closer to your goals. Stay focused and keep pushing
                forward!
              </p>
            </div>
            <Link href="/dashboard/student/certificates">
              <Button variant="secondary" className="hidden md:block">
                View Achievements
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
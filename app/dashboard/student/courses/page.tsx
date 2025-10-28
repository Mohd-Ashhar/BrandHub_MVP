import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Calendar } from "lucide-react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function StudentCoursesPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Get enrolled courses
  const { data: enrollments } = await supabase
    .from("enrollments")
    .select(
      `
      *,
      courses!enrollments_course_id_fkey(
        *,
        brands!courses_brand_id_fkey(name, logo)
      )
    `
    )
    .eq("student_id", user.id)
    .order("enrolled_at", { ascending: false });

  const activeCourses = enrollments?.filter((e) => e.status === "active") || [];
  const completedCourses =
    enrollments?.filter((e) => e.status === "completed") || [];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
        <p className="text-gray-600 mt-1">Track your learning journey</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Enrolled
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{enrollments?.length || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Active Courses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{activeCourses.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{completedCourses.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Active Courses */}
      {activeCourses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Active Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeCourses.map((enrollment) => (
                <div
                  key={enrollment.id}
                  className="border rounded-lg p-4 hover:bg-gray-50"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <BookOpen className="h-5 w-5 text-blue-600" />
                        <h3 className="font-semibold text-lg">
                          {enrollment.courses?.title}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {enrollment.courses?.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(
                            enrollment.courses?.start_date
                          ).toLocaleDateString()}
                        </span>
                        <Badge>{enrollment.courses?.brands?.name}</Badge>
                      </div>
                    </div>
                    <Link
                      href={`/dashboard/student/courses/${enrollment.course_id}`}
                    >
                      <Button size="sm">Continue Learning</Button>
                    </Link>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium">
                        {enrollment.progress}%
                      </span>
                    </div>
                    <Progress value={enrollment.progress} className="h-2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Completed Courses */}
      {completedCourses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Completed Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {completedCourses.map((enrollment) => (
                <div
                  key={enrollment.id}
                  className="border rounded-lg p-4 bg-green-50"
                >
                  <h3 className="font-semibold mb-1">
                    {enrollment.courses?.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {enrollment.courses?.brands?.name}
                  </p>
                  <Badge className="bg-green-100 text-green-700">
                    ✓ Completed
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {enrollments && enrollments.length === 0 && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">
                You&apos;re not enrolled in any courses yet.
              </p>
              <Link href="/dashboard/student">
                <Button>Browse Courses</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
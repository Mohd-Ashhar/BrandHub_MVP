import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Award, BookOpen } from "lucide-react";
import { redirect } from "next/navigation";

export default async function StudentProgressPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Get student data
  const { data: student } = await supabase
    .from("students")
    .select("engagement_score")
    .eq("id", user.id)
    .single();

  // Get all enrollments
  const { data: enrollments } = await supabase
    .from("enrollments")
    .select(
      `
      *,
      courses!enrollments_course_id_fkey(title)
    `
    )
    .eq("student_id", user.id);

  const avgProgress =
    enrollments && enrollments.length > 0
      ? Math.round(
          enrollments.reduce((sum, e) => sum + e.progress, 0) /
            enrollments.length
        )
      : 0;

  const completedCount =
    enrollments?.filter((e) => e.progress === 100).length || 0;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Progress</h1>
        <p className="text-gray-600 mt-1">Track your learning achievements</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">
                Engagement Score
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {student?.engagement_score || 0}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">
                Avg Progress
              </CardTitle>
              <BookOpen className="h-4 w-4 text-green-600" />
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
                Completed
              </CardTitle>
              <Award className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{completedCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Course Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Course Progress</CardTitle>
        </CardHeader>
        <CardContent>
          {enrollments && enrollments.length > 0 ? (
            <div className="space-y-6">
              {enrollments.map((enrollment) => (
                <div key={enrollment.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">{enrollment.courses?.title}</h3>
                    <span className="text-sm font-semibold">
                      {enrollment.progress}%
                    </span>
                  </div>
                  <Progress value={enrollment.progress} className="h-3" />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center py-8 text-gray-500">
              No course progress to display yet.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

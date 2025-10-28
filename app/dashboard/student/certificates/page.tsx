import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Download } from "lucide-react";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";

export default async function StudentCertificatesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Get completed courses
  const { data: completedEnrollments } = await supabase
    .from("enrollments")
    .select(
      `
      *,
      courses!enrollments_course_id_fkey(
        title,
        brands!courses_brand_id_fkey(name)
      )
    `
    )
    .eq("student_id", user.id)
    .eq("progress", 100)
    .order("updated_at", { ascending: false });

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Certificates</h1>
        <p className="text-gray-600 mt-1">
          View and download your course completion certificates
        </p>
      </div>

      {completedEnrollments && completedEnrollments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {completedEnrollments.map((enrollment) => (
            <Card
              key={enrollment.id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
                <div className="flex items-center justify-between">
                  <Award className="h-8 w-8 text-purple-600" />
                  <span className="text-xs text-gray-500">
                    {new Date(enrollment.updated_at).toLocaleDateString()}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <h3 className="font-semibold text-lg mb-2">
                  {enrollment.courses?.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {enrollment.courses?.brands?.name}
                </p>
                <Button className="w-full" variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Download Certificate
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                Complete a course to earn your first certificate!
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

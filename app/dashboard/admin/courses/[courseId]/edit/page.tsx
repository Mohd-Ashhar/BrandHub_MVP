import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { EditCourseForm } from "@/app/components/admin/edit-course-form";

export default async function EditCoursePage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const supabase = createClient();

  const { data: course } = await supabase
    .from("courses")
    .select("*")
    .eq("id", courseId)
    .single();

  if (!course) {
    notFound();
  }

  const { data: brands } = await supabase
    .from("brands")
    .select("id, name")
    .order("name");

  const { data: instructors } = await supabase
    .from("profiles")
    .select("id, name, email")
    .eq("role", "instructor")
    .order("name");

  return (
    <div className="p-6 space-y-6">
      <Link href="/dashboard/admin/courses">
        <Button variant="ghost" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Courses
        </Button>
      </Link>

      <div>
        <h1 className="text-3xl font-bold text-gray-900">Edit Course</h1>
        <p className="text-gray-600 mt-1">Update course information</p>
      </div>

      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle>Course Information</CardTitle>
        </CardHeader>
        <CardContent>
          <EditCourseForm
            course={course}
            brands={brands || []}
            instructors={instructors || []}
          />
        </CardContent>
      </Card>
    </div>
  );
}

import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CourseForm } from "@/app/components/admin/course-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function NewCoursePage() {
  const supabase = await createClient();

  // Fetch brands for dropdown
  const { data: brands } = await supabase
    .from("brands")
    .select("id, name")
    .order("name");

  // Fetch instructors for dropdown
  const { data: instructors } = await supabase
    .from("profiles")
    .select("id, name, email")
    .eq("role", "instructor")
    .order("name");

  return (
    <div className="p-6 space-y-6">
      {/* Back Button */}
      <Link href="/dashboard/admin/courses">
        <Button variant="ghost" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Courses
        </Button>
      </Link>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Add New Course</h1>
        <p className="text-gray-600 mt-1">
          Create a new course or workshop for your students
        </p>
      </div>

      {/* Form Card */}
      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle>Course Information</CardTitle>
        </CardHeader>
        <CardContent>
          <CourseForm brands={brands || []} instructors={instructors || []} />
        </CardContent>
      </Card>
    </div>
  );
}

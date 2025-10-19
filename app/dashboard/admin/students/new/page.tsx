import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StudentForm } from "@/app/components/admin/student-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function NewStudentPage() {
  const supabase = createClient();

  // Fetch brands for dropdown
  const { data: brands } = await supabase
    .from("brands")
    .select("id, name")
    .order("name");

  return (
    <div className="p-6 space-y-6">
      {/* Back Button */}
      <Link href="/dashboard/admin/students">
        <Button variant="ghost" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Students
        </Button>
      </Link>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Add New Student</h1>
        <p className="text-gray-600 mt-1">
          Create a new student account and enroll them in courses
        </p>
      </div>

      {/* Form Card */}
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Student Information</CardTitle>
        </CardHeader>
        <CardContent>
          <StudentForm brands={brands || []} />
        </CardContent>
      </Card>
    </div>
  );
}

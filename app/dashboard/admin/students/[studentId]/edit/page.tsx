import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { EditStudentForm } from "@/app/components/admin/edit-student-form";

export default async function EditStudentPage({
  params,
}: {
  params: Promise<{ studentId: string }>;
}) {
  const { studentId } = await params;
  const supabase = await createClient();

  const { data: student } = await supabase
    .from("students")
    .select("*")
    .eq("id", studentId)
    .single();

  if (!student) {
    notFound();
  }

  const { data: brands } = await supabase
    .from("brands")
    .select("id, name")
    .order("name");

  return (
    <div className="p-6 space-y-6">
      <Link href={`/dashboard/admin/students/${studentId}`}>
        <Button variant="ghost" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Student
        </Button>
      </Link>

      <div>
        <h1 className="text-3xl font-bold text-gray-900">Edit Student</h1>
        <p className="text-gray-600 mt-1">Update student information</p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Student Information</CardTitle>
        </CardHeader>
        <CardContent>
          <EditStudentForm student={student} brands={brands || []} />
        </CardContent>
      </Card>
    </div>
  );
}

import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { enrollStudent } from "../actions";

export default async function StudentDetailPage({
  params,
}: {
  params: { studentId: string };
}) {
  const supabase = createClient();
  const { studentId } = params;

  // Fetch student details
  const { data: student } = await supabase
    .from("students")
    .select("*")
    .eq("id", studentId)
    .single();

  if (!student) {
    notFound();
  }

  // Fetch all available courses for the dropdown
  const { data: allCourses } = await supabase
    .from("courses")
    .select("id, title");

  // Fetch courses this student is already enrolled in
  const { data: enrolledCoursesData } = await supabase
    .from("enrollments")
    .select("courses(id, title)")
    .eq("student_id", studentId);

  // ✅ FIX 1: Use flatMap to correctly create a single array of course objects
  const enrolledCourses =
    enrolledCoursesData?.flatMap((e) => e.courses).filter(Boolean) || [];

  const enrolledCourseIds = new Set(enrolledCourses.map((c) => c?.id));

  // Filter out courses the student is already enrolled in for the dropdown
  const availableCourses =
    allCourses?.filter((c) => !enrolledCourseIds.has(c.id)) || [];

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold">{student.name}</h1>
      <p className="text-lg text-gray-600">{student.email}</p>

      <hr className="my-8" />

      {/* Enrollment Form */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Enroll in a New Course</h2>
        {/* ✅ FIX 2: Wrap the server action in an async function to fix the type error */}
        <form
          action={async (formData) => {
            "use server";
            await enrollStudent(formData);
          }}
          className="flex items-center gap-4 max-w-md"
        >
          <input type="hidden" name="studentId" value={student.id} />
          <Select name="courseId" required>
            <SelectTrigger>
              <SelectValue placeholder="Select a course..." />
            </SelectTrigger>
            <SelectContent>
              {availableCourses.length > 0 ? (
                availableCourses.map((course) => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.title}
                  </SelectItem>
                ))
              ) : (
                <div className="p-4 text-sm text-gray-500">
                  No available courses.
                </div>
              )}
            </SelectContent>
          </Select>
          <Button type="submit">Enroll</Button>
        </form>
      </div>

      {/* List of Enrolled Courses */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Enrolled Courses</h2>
        {enrolledCourses.length > 0 ? (
          <ul className="list-disc pl-5 space-y-2">
            {enrolledCourses.map(
              (course) => course && <li key={course.id}>{course.title}</li>
            )}
          </ul>
        ) : (
          <p>This student is not enrolled in any courses yet.</p>
        )}
      </div>
    </div>
  );
}

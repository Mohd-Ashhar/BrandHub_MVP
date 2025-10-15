"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// ... (keep createStudent, updateStudent, deleteStudent)

export async function createStudent(formData: FormData) {
  /* ... */
}
export async function updateStudent(id: string, formData: FormData) {
  /* ... */
}
export async function deleteStudent(id: string) {
  /* ... */
}

// New function for enrollment
export async function enrollStudent(formData: FormData) {
  const supabase = createClient();
  const studentId = formData.get("studentId") as string;
  const courseId = formData.get("courseId") as string;

  if (!studentId || !courseId) {
    return {
      success: false,
      message: "Student ID and Course ID are required.",
    };
  }

  try {
    const { error } = await supabase.from("enrollments").insert({
      student_id: studentId,
      course_id: courseId,
    });

    if (error) {
      // This will catch unique constraint violations, etc.
      throw new Error(`Could not enroll student: ${error.message}`);
    }

    // Revalidate the specific student's page to show the new enrollment
    revalidatePath(`/dashboard/students/${studentId}`);
    return { success: true };
  } catch (e: any) {
    console.error(e.message);
    // You could return a more specific message based on the error
    return { success: false, message: "A database error occurred." };
  }
}

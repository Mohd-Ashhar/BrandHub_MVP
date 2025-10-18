"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createStudent(formData: FormData, brandId: string) {
  const supabase = createClient();
  try {
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      brand_id: brandId,
    };
    const { error } = await supabase.from("students").insert(data);
    if (error) throw new Error(`Could not create student: ${error.message}`);
    revalidatePath("/dashboard/students");
    return { success: true };
  } catch (e: any) {
    return { success: false, message: e.message };
  }
}

export async function updateStudent(
  id: string,
  formData: FormData,
  brandId: string
) {
  const supabase = createClient();
  try {
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
    };
    const { error } = await supabase
      .from("students")
      .update(data)
      .eq("id", id)
      .eq("brand_id", brandId);
    if (error) throw new Error(`Could not update student: ${error.message}`);
    revalidatePath("/dashboard/students");
    return { success: true };
  } catch (e: any) {
    return { success: false, message: e.message };
  }
}

export async function deleteStudent(id: string, brandId: string) {
  const supabase = createClient();
  try {
    const { error } = await supabase
      .from("students")
      .delete()
      .eq("id", id)
      .eq("brand_id", brandId);
    if (error) throw new Error(`Could not delete student: ${error.message}`);
    revalidatePath("/dashboard/students");
    return { success: true };
  } catch (e: any) {
    return { success: false, message: e.message };
  }
}

export async function enrollStudent(formData: FormData) {
  const supabase = createClient();
  try {
    const data = {
      student_id: formData.get("studentId") as string,
      course_id: formData.get("courseId") as string,
    };

    // Validate that both IDs are present
    if (!data.student_id || !data.course_id) {
      throw new Error("Student ID and Course ID are required.");
    }

    const { error } = await supabase.from("enrollments").insert(data);

    if (error) {
      // This will catch database errors, like trying to enroll in the same course twice
      throw new Error(`Could not enroll student: ${error.message}`);
    }

    // Revalidate the student detail page to show the new enrolled course
    revalidatePath(`/dashboard/students/${data.student_id}`);
    return { success: true };
  } catch (e: any) {
    console.error(e.message);
    return { success: false, message: e.message };
  }
}

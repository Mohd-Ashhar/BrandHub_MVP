"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createStudent(formData: FormData) {
  const supabase = createClient();
  try {
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
    };
    const { error } = await supabase.from("students").insert(data);
    if (error) throw new Error(`Could not create student: ${error.message}`);
    revalidatePath("/dashboard/students");
    return { success: true };
  } catch (e: any) {
    return { success: false, message: e.message };
  }
}

export async function updateStudent(id: string, formData: FormData) {
  const supabase = createClient();
  try {
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
    };
    const { error } = await supabase.from("students").update(data).eq("id", id);
    if (error) throw new Error(`Could not update student: ${error.message}`);
    revalidatePath("/dashboard/students");
    return { success: true };
  } catch (e: any) {
    return { success: false, message: e.message };
  }
}

export async function deleteStudent(id: string) {
  const supabase = createClient();
  try {
    const { error } = await supabase.from("students").delete().eq("id", id);
    if (error) throw new Error(`Could not delete student: ${error.message}`);
    revalidatePath("/dashboard/students");
    return { success: true };
  } catch (e: any) {
    return { success: false, message: e.message };
  }
}

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
      throw new Error(`Could not enroll student: ${error.message}`);
    }

    revalidatePath(`/dashboard/students/${studentId}`);
    return { success: true };
  } catch (e: any) {
    return { success: false, message: e.message };
  }
}

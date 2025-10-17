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
  // ... (no changes needed for enrollStudent as it uses student_id and course_id)
}

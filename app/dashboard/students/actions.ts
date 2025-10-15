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

    if (error) {
      throw new Error(`Could not create student: ${error.message}`);
    }

    revalidatePath("/dashboard/students");
    return { success: true };
  } catch (e: any) {
    console.error(e.message);
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

    if (error) {
      throw new Error(`Could not update student: ${error.message}`);
    }

    revalidatePath("/dashboard/students");
    return { success: true };
  } catch (e: any) {
    console.error(e.message);
    return { success: false, message: e.message };
  }
}

export async function deleteStudent(id: string) {
  const supabase = createClient();
  try {
    const { error } = await supabase.from("students").delete().eq("id", id);

    if (error) {
      throw new Error(`Could not delete student: ${error.message}`);
    }

    revalidatePath("/dashboard/students");
    return { success: true };
  } catch (e: any) {
    console.error(e.message);
    return { success: false, message: e.message };
  }
}

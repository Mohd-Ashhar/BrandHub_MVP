"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createCourse(formData: FormData) {
  const supabase = createClient();
  try {
    const data = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
    };

    const { error } = await supabase.from("courses").insert(data);

    if (error) {
      throw new Error(`Could not create course: ${error.message}`);
    }

    revalidatePath("/dashboard/courses");
    return { success: true };
  } catch (e: any) {
    console.error(e.message);
    return { success: false, message: e.message };
  }
}

export async function updateCourse(id: string, formData: FormData) {
  const supabase = createClient();
  try {
    const data = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
    };

    const { error } = await supabase.from("courses").update(data).eq("id", id);

    if (error) {
      throw new Error(`Could not update course: ${error.message}`);
    }

    revalidatePath("/dashboard/courses");
    return { success: true };
  } catch (e: any) {
    console.error(e.message);
    return { success: false, message: e.message };
  }
}

export async function deleteCourse(id: string) {
  const supabase = createClient();
  try {
    const { error } = await supabase.from("courses").delete().eq("id", id);

    if (error) {
      throw new Error(`Could not delete course: ${error.message}`);
    }

    revalidatePath("/dashboard/courses");
    return { success: true };
  } catch (e: any) {
    console.error(e.message);
    return { success: false, message: e.message };
  }
}

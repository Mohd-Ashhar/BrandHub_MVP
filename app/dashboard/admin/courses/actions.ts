"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// ============================================
// CREATE COURSE
// ============================================
export async function createCourse(formData: FormData) {
  const supabase = createClient();

  try {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const brandId = formData.get("brandId") as string;
    const instructorId = formData.get("instructorId") as string;
    const startDate = formData.get("startDate") as string;
    const endDate = formData.get("endDate") as string;
    const capacity = parseInt(formData.get("capacity") as string);
    const price = parseFloat(formData.get("price") as string) || 0;

    // Validate required fields
    if (!title || !startDate || !endDate || !capacity) {
      return {
        success: false,
        message: "Please fill in all required fields",
      };
    }

    // Validate dates
    if (new Date(endDate) <= new Date(startDate)) {
      return {
        success: false,
        message: "End date must be after start date",
      };
    }

    // Insert course
    const { data, error } = await supabase
      .from("courses")
      .insert({
        title,
        description: description || null,
        brand_id: brandId || null,
        instructor_id: instructorId || null,
        start_date: startDate,
        end_date: endDate,
        capacity,
        price,
        status: "upcoming",
        current_enrolled: 0,
      })
      .select()
      .single();

    if (error) {
      console.error("Course creation error:", error);
      return {
        success: false,
        message: `Failed to create course: ${error.message}`,
      };
    }

    revalidatePath("/dashboard/admin/courses");
    return {
      success: true,
      message: "Course created successfully",
      courseId: data.id,
    };
  } catch (e: unknown) {
    // FIX: Change any to unknown
    console.error("Unexpected error:", e);
    // FIX: Add type guard
    let message = "An unexpected error occurred";
    if (e instanceof Error) {
      message = e.message;
    }
    return {
      success: false,
      message: message,
    };
  }
}

// ============================================
// UPDATE COURSE
// ============================================
export async function updateCourse(id: string, formData: FormData) {
  const supabase = createClient();

  try {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const brandId = formData.get("brandId") as string;
    const instructorId = formData.get("instructorId") as string;
    const startDate = formData.get("startDate") as string;
    const endDate = formData.get("endDate") as string;
    const capacity = parseInt(formData.get("capacity") as string);
    const price = parseFloat(formData.get("price") as string);

    const { error } = await supabase
      .from("courses")
      .update({
        title,
        description,
        brand_id: brandId || null,
        instructor_id: instructorId || null,
        start_date: startDate,
        end_date: endDate,
        capacity,
        price,
      })
      .eq("id", id);

    if (error) {
      return {
        success: false,
        message: `Failed to update course: ${error.message}`,
      };
    }

    revalidatePath("/dashboard/admin/courses");
    revalidatePath(`/dashboard/admin/courses/${id}`);
    return { success: true, message: "Course updated successfully" };
  } catch (e: unknown) {
    // FIX: Change any to unknown
    // FIX: Add type guard
    let message = "An unexpected error occurred";
    if (e instanceof Error) {
      message = e.message;
    }
    return { success: false, message: message };
  }
}

// ============================================
// DELETE COURSE
// ============================================
export async function deleteCourse(id: string) {
  const supabase = createClient();

  try {
    const { error } = await supabase.from("courses").delete().eq("id", id);

    if (error) {
      return {
        success: false,
        message: `Failed to delete course: ${error.message}`,
      };
    }

    revalidatePath("/dashboard/admin/courses");
    return { success: true, message: "Course deleted successfully" };
  } catch (e: unknown) {
    // FIX: Change any to unknown
    // FIX: Add type guard
    let message = "An unexpected error occurred";
    if (e instanceof Error) {
      message = e.message;
    }
    return { success: false, message: message };
  }
}

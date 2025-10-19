"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// ============================================
// CREATE STUDENT (Complete Workflow)
// ============================================
export async function createStudent(formData: FormData) {
  const supabase = createClient(true);

  try {
    // 1. Extract form data
    const email = formData.get("email") as string;
    const name = formData.get("name") as string;
    const password = formData.get("password") as string;
    const phoneNumber = formData.get("phoneNumber") as string;
    const city = formData.get("city") as string;
    const state = formData.get("state") as string;
    const brandId = formData.get("brandId") as string;

    // 2. Validate required fields
    if (!email || !name || !password) {
      return {
        success: false,
        message: "Email, name, and password are required",
      };
    }

    // 3. Create auth user (using service role)
    const { data: authData, error: authError } =
      await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true, // Auto-confirm email
        user_metadata: {
          full_name: name,
          role: "student",
        },
      });

    if (authError) {
      console.error("Auth creation error:", authError);
      return {
        success: false,
        message: `Failed to create auth user: ${authError.message}`,
      };
    }

    if (!authData.user) {
      return {
        success: false,
        message: "No user returned from auth creation",
      };
    }

    // 4. Create profile
    const { error: profileError } = await supabase.from("profiles").insert({
      id: authData.user.id,
      email,
      name,
      role: "student",
      brand_id: brandId || null,
    });

    if (profileError) {
      console.error("Profile creation error:", profileError);
      // Try to clean up auth user if profile fails
      await supabase.auth.admin.deleteUser(authData.user.id);
      return {
        success: false,
        message: `Failed to create profile: ${profileError.message}`,
      };
    }

    // 5. Create student record
    const { error: studentError } = await supabase.from("students").insert({
      id: authData.user.id,
      email,
      name,
      phone_number: phoneNumber || null,
      city: city || null,
      state: state || null,
      brand_id: brandId || null,
      engagement_score: 0,
    });

    if (studentError) {
      console.error("Student creation error:", studentError);
      // Clean up
      await supabase.from("profiles").delete().eq("id", authData.user.id);
      await supabase.auth.admin.deleteUser(authData.user.id);
      return {
        success: false,
        message: `Failed to create student: ${studentError.message}`,
      };
    }

    revalidatePath("/dashboard/admin/students");
    return { success: true, message: "Student created successfully" };
  } catch (e: any) {
    console.error("Unexpected error:", e);
    return {
      success: false,
      message: e.message || "An unexpected error occurred",
    };
  }
}

// ============================================
// UPDATE STUDENT
// ============================================
export async function updateStudent(id: string, formData: FormData) {
  const supabase = createClient();

  try {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phoneNumber = formData.get("phoneNumber") as string;
    const city = formData.get("city") as string;
    const state = formData.get("state") as string;

    // Update student record
    const { error: studentError } = await supabase
      .from("students")
      .update({
        name,
        email,
        phone_number: phoneNumber || null,
        city: city || null,
        state: state || null,
      })
      .eq("id", id);

    if (studentError) {
      return {
        success: false,
        message: `Failed to update student: ${studentError.message}`,
      };
    }

    // Also update profile
    await supabase.from("profiles").update({ name, email }).eq("id", id);

    revalidatePath("/dashboard/admin/students");
    revalidatePath(`/dashboard/admin/students/${id}`);
    return { success: true, message: "Student updated successfully" };
  } catch (e: any) {
    return { success: false, message: e.message };
  }
}

// ============================================
// DELETE STUDENT (Soft Delete)
// ============================================
export async function deleteStudent(id: string) {
  const supabase = createClient();

  try {
    // Option 1: Soft delete (recommended)
    const { error } = await supabase
      .from("students")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", id);

    // Option 2: Hard delete (if you prefer)
    // const { error } = await supabase.auth.admin.deleteUser(id);

    if (error) {
      return {
        success: false,
        message: `Failed to delete student: ${error.message}`,
      };
    }

    revalidatePath("/dashboard/admin/students");
    return { success: true, message: "Student deleted successfully" };
  } catch (e: any) {
    return { success: false, message: e.message };
  }
}

// ============================================
// ENROLL STUDENT
// ============================================
export async function enrollStudent(formData: FormData) {
  const supabase = createClient();

  try {
    const studentId = formData.get("studentId") as string;
    const courseId = formData.get("courseId") as string;

    if (!studentId || !courseId) {
      return {
        success: false,
        message: "Student ID and Course ID are required",
      };
    }

    // Check if already enrolled
    const { data: existing } = await supabase
      .from("enrollments")
      .select("id")
      .eq("student_id", studentId)
      .eq("course_id", courseId)
      .single();

    if (existing) {
      return {
        success: false,
        message: "Student is already enrolled in this course",
      };
    }

    // Create enrollment
    const { error } = await supabase.from("enrollments").insert({
      student_id: studentId,
      course_id: courseId,
      status: "active",
      progress: 0,
    });

    if (error) {
      return {
        success: false,
        message: `Failed to enroll student: ${error.message}`,
      };
    }

    revalidatePath(`/dashboard/admin/students/${studentId}`);
    return { success: true, message: "Student enrolled successfully" };
  } catch (e: any) {
    return { success: false, message: e.message };
  }
}

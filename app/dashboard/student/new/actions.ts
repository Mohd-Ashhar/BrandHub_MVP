"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createStudent(formData: FormData) {
  const supabase = await createClient();

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    // 1. Create auth user
    const { data: authData, error: authError } =
      await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          name,
        },
      });

    if (authError) throw authError;

    // 2. Create profile
    const { error: profileError } = await supabase.from("profiles").insert({
      id: authData.user.id,
      name,
      email,
      role: "student",
    });

    if (profileError) throw profileError;

    // 3. Create student record ✅ THIS IS CRITICAL
    const { error: studentError } = await supabase.from("students").insert({
      id: authData.user.id,
      name,
      email,
      engagement_score: 0,
    });

    if (studentError) throw studentError;

    revalidatePath("/dashboard/admin/students");
    return { success: true };
  } catch (error: unknown) {
    // FIX: Change any to unknown
    console.error("Error creating student:", error);
    // FIX: Add type guard
    let message = "An unexpected error occurred";
    if (error instanceof Error) {
      message = error.message;
    }
    return { success: false, message: message };
  }
}

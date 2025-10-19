// Create app/dashboard/student/actions.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function enrollInCourse(courseId: string) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, message: "Unauthorized" };

  // Check if already enrolled
  const { data: existing } = await supabase
    .from("enrollments")
    .select("id")
    .eq("student_id", user.id)
    .eq("course_id", courseId)
    .single();

  if (existing) {
    return { success: false, message: "Already enrolled" };
  }

  // Create enrollment
  const { error } = await supabase.from("enrollments").insert({
    student_id: user.id,
    course_id: courseId,
    status: "active",
    progress: 0,
  });

  if (error) return { success: false, message: error.message };

  revalidatePath("/dashboard/student");
  return { success: true, message: "Enrolled successfully!" };
}

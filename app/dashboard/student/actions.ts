"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function enrollInCourse(courseId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "Unauthorized" };
  }

  try {
    // Check if already enrolled
    const { data: existing } = await supabase
      .from("enrollments")
      .select("id")
      .eq("student_id", user.id)
      .eq("course_id", courseId)
      .single();

    if (existing) {
      return { success: false, message: "Already enrolled in this course" };
    }

    // Check course capacity
    const { data: course } = await supabase
      .from("courses")
      .select("current_enrolled, capacity")
      .eq("id", courseId)
      .single();

    if (course && course.current_enrolled >= course.capacity) {
      return { success: false, message: "Course is full" };
    }

    // Create enrollment
    const { error: enrollError } = await supabase.from("enrollments").insert({
      student_id: user.id,
      course_id: courseId,
      status: "active",
      progress: 0,
      enrolled_at: new Date().toISOString(),
    });

    if (enrollError) throw enrollError;

    // Update course enrollment count
    const { error: updateError } = await supabase.rpc("increment_enrollment", {
      course_uuid: courseId,
    });

    if (updateError) {
      console.warn("Could not increment enrollment count:", updateError);
    }

    revalidatePath("/dashboard/student");
    revalidatePath("/dashboard/student/courses");
    revalidatePath("/dashboard/student/browse");

    return { success: true, message: "Successfully enrolled!" };
  } catch (error: unknown) {
    // FIX: Change any to unknown
    console.error("Enrollment error:", error);
    // FIX: Add type guard
    let message = "Failed to enroll";
    if (error instanceof Error) {
      message = error.message;
    }
    return { success: false, message: message };
  }
}

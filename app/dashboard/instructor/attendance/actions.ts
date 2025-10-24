"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function markAttendance(formData: FormData) {
  const supabase = createClient();

  const enrollmentId = formData.get("enrollmentId") as string;
  const studentId = formData.get("studentId") as string;
  const courseId = formData.get("courseId") as string;
  const sessionDate = formData.get("sessionDate") as string;
  const status = formData.get("status") as string;
  const attendanceId = formData.get("attendanceId") as string | null;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "Unauthorized" };
  }

  try {
    if (attendanceId) {
      // Update existing record
      const { error } = await supabase
        .from("attendance")
        .update({
          status,
          updated_at: new Date().toISOString(),
        })
        .eq("id", attendanceId);

      if (error) throw error;
    } else {
      // Create new record
      const { error } = await supabase.from("attendance").insert({
        enrollment_id: enrollmentId,
        student_id: studentId,
        course_id: courseId,
        session_date: sessionDate,
        status,
        marked_by: user.id,
      });

      if (error) throw error;
    }

    revalidatePath("/dashboard/instructor/attendance");
    return { success: true, message: "Attendance marked successfully" };
  } catch (error: unknown) {
    // FIX: Change any to unknown
    console.error("Error marking attendance:", error);
    // FIX: Add type guard
    let message = "An unexpected error occurred";
    if (error instanceof Error) {
      message = error.message;
    }
    return { success: false, message: message };
  }
}

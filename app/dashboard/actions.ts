"use server";

import { createClient } from "@/lib/supabase/server";

export async function getEnrollmentsPerCourse() {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("get_course_enrollment_counts");

  if (error) {
    console.error("Error fetching enrollments per course:", error);
    return [];
  }
  return data;
}

export async function getStudentGrowthOverTime() {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("get_daily_student_signups");

  if (error) {
    console.error("Error fetching student growth data:", error);
    return [];
  }
  return data;
}

"use server";

import { createClient } from "@/lib/supabase/server";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText } from "ai";
import { createStreamableValue } from "@ai-sdk/rsc"; // ✅ Changed from ai/rsc

// Get enrollment counts per course
export async function getEnrollmentsPerCourse() {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_course_enrollment_counts");

  if (error) {
    console.error("Error fetching enrollments per course:", error);
    return [];
  }

  return data || [];
}

// Get student growth over time
export async function getStudentGrowthOverTime() {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_daily_student_signups");

  if (error) {
    console.error("Error fetching student growth data:", error);
    return [];
  }

  return data || [];
}

// Get top performing students
export async function getTopStudents() {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_top_students", {
    limit_count: 10,
  });

  if (error) {
    console.error("Error fetching top students:", error);
    return [];
  }

  return data || [];
}

// Get course completion rates
export async function getCourseCompletionRates() {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_course_completion_rates");

  if (error) {
    console.error("Error fetching completion rates:", error);
    return [];
  }

  return data || [];
}

// Get dashboard summary stats
export async function getDashboardStats() {
  const supabase = await createClient();

  // Total students
  const { count: totalStudents } = await supabase
    .from("students")
    .select("*", { count: "exact", head: true });

  // Total courses
  const { count: totalCourses } = await supabase
    .from("courses")
    .select("*", { count: "exact", head: true });

  // Total enrollments
  const { count: totalEnrollments } = await supabase
    .from("enrollments")
    .select("*", { count: "exact", head: true });

  // Active courses
  const { count: activeCourses } = await supabase
    .from("courses")
    .select("*", { count: "exact", head: true })
    .eq("status", "active");

  // Average engagement
  const { data: avgData } = await supabase
    .from("students")
    .select("engagement_score");

  const avgEngagement =
    avgData && avgData.length > 0
      ? Math.round(
          avgData.reduce((acc, s) => acc + (s.engagement_score || 0), 0) /
            avgData.length
        )
      : 0;

  return {
    totalStudents: totalStudents || 0,
    totalCourses: totalCourses || 0,
    totalEnrollments: totalEnrollments || 0,
    activeCourses: activeCourses || 0,
    avgEngagement,
  };
}

// AI Insight Generation
export async function getAIInsight(data: string) {
  const stream = createStreamableValue("");

  (async () => {
    try {
      const google = createGoogleGenerativeAI({
        apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
      });

      const { textStream } = await streamText({
        model: google("gemini-2.5-flash"),
        prompt: `
You are a senior business analyst for BrandHub, an online education platform managing multiple brands (Be10X, Office Master, ProfitUni, etc.).

Analyze this data and provide 3-4 concise, actionable insights:

${data}

Focus on:
1. Enrollment trends and opportunities
2. Student engagement patterns
3. Course performance
4. Growth recommendations

Format as bullet points. Be specific and data-driven.
        `,
      });

      for await (const delta of textStream) {
        stream.update(delta);
      }

      stream.done();
    } catch (error) {
      console.error("AI Insight error:", error);
      stream.update("Failed to generate insights. Please check your API key.");
      stream.done();
    }
  })();

  return stream.value;
}

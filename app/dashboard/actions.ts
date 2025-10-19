"use server";

import { createClient } from "@/lib/supabase/server";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText } from "ai";
import { createStreamableValue } from "@ai-sdk/rsc";

// Full implementation of analytics functions
export async function getEnrollmentsPerCourse() {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("get_course_enrollment_counts");

  if (error) {
    console.error("Error fetching enrollments per course:", error);
    return [];
  }

  return data;
}a

export async function getStudentGrowthOverTime() {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("get_daily_student_signups");

  if (error) {
    console.error("Error fetching student growth data:", error);
    return [];
  }

  return data;
}

// Corrected AI Insight Action
export async function getAIInsight(data: string) {
  const stream = createStreamableValue("");

  (async () => {
    const google = createGoogleGenerativeAI({
      apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    });

    const { textStream } = await streamText({
      model: google("gemini-2.5-pro"), // Changed from "models/gemini-pro"
      prompt: `
        You are a senior business analyst for an online education platform called BrandHub.
        Your task is to provide concise, actionable insights based on the following data.
        The data represents student enrollment numbers per course and new student sign-ups over time.
        
        Data: ${data}
        
        Provide three bullet points of actionable business advice. Focus on trends and opportunities.
        Keep the insights brief and to the point. Start your response with "Here are the key insights:"
      `,
    });

    for await (const delta of textStream) {
      stream.update(delta);
    }

    stream.done();
  })();

  return stream.value;
}

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// ============================================
// LOGIN ACTION
// ============================================
export async function login(formData: FormData) {
  const supabase = await createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { data: authData, error } = await supabase.auth.signInWithPassword(
    data
  );

  if (error) {
    console.error("Login error:", error);
    redirect("/login?message=Invalid email or password");
  }

  // ✅ FIX: Check if profile exists, create if missing
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role, brand_id")
    .eq("id", authData.user.id)
    .single();

  if (profileError || !profile) {
    console.error("Profile not found, creating...", profileError);

    // Create profile from auth user metadata
    const { error: createError } = await supabase.from("profiles").insert({
      id: authData.user.id,
      email: authData.user.email,
      name: authData.user.user_metadata?.full_name || authData.user.email,
      role: authData.user.user_metadata?.role || "student",
    });

    if (createError) {
      console.error("Failed to create profile:", createError);
      redirect(
        "/login?message=Could not fetch user profile. Please contact support."
      );
    }

    // Retry fetching profile
    const { data: newProfile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", authData.user.id)
      .single();

    if (!newProfile) {
      redirect("/login?message=Could not fetch user profile");
    }

    // Use new profile for redirect
    revalidatePath("/", "layout");
    switch (newProfile.role) {
      case "admin":
        redirect("/dashboard/admin");
      case "instructor":
        redirect("/dashboard/instructor");
      case "student":
        redirect("/dashboard/student");
      default:
        redirect("/dashboard");
    }
  }

  revalidatePath("/", "layout");

  // Role-based redirect
  switch (profile.role) {
    case "admin":
      redirect("/dashboard/admin");
    case "instructor":
      redirect("/dashboard/instructor");
    case "student":
      redirect("/dashboard/student");
    default:
      redirect("/dashboard");
  }
}

// ============================================
// SIGNUP ACTION
// ============================================
export async function signup(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("name") as string;
  const role = (formData.get("role") as string) || "student";

  // Validate role
  if (!["student", "instructor", "admin"].includes(role)) {
    redirect("/signup?message=Invalid role selected");
  }

  // Sign up with Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role: role,
      },
    },
  });

  if (authError) {
    console.error("Signup error:", authError);
    redirect(`/signup?message=${encodeURIComponent(authError.message)}`);
  }

  if (!authData.user) {
    redirect("/signup?message=Could not create account");
  }

  // ✅ IMPORTANT: Create profile manually (don't rely on trigger)
  const { error: profileError } = await supabase.from("profiles").insert({
    id: authData.user.id,
    email: email,
    name: fullName,
    role: role,
    created_at: new Date().toISOString(),
  });

  if (profileError) {
    console.error("Profile creation error:", profileError);
    // Continue anyway - trigger might have created it
  }

  // If student role, create student record
  if (role === "student") {
    const { error: studentError } = await supabase.from("students").insert({
      id: authData.user.id,
      email: email,
      name: fullName,
      engagement_score: 0,
    });

    if (studentError) {
      console.error("Student record creation error:", studentError);
    }
  }

  // If instructor role, create instructor record
  if (role === "instructor") {
    const { error: instructorError } = await supabase
      .from("instructors")
      .insert({
        id: authData.user.id,
        email: email,
        name: fullName,
      });

    if (instructorError) {
      console.error("Instructor record creation error:", instructorError);
    }
  }

  revalidatePath("/", "layout");
  redirect("/login?message=Account created successfully! Please sign in.");
}

// ============================================
// SIGNOUT ACTION
// ============================================
export async function signout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}

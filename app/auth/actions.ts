"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// ============================================================
// LOGIN ACTION (Enhanced with Role-Based Redirect)
// ============================================================
export async function login(formData: FormData) {
  const supabase = createClient();

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

  // Fetch user role from profiles table
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role, brand_id")
    .eq("id", authData.user.id)
    .single();

  if (profileError) {
    console.error("Profile fetch error:", profileError);
    redirect("/login?message=Could not fetch user profile");
  }

  revalidatePath("/", "layout");

  // Role-based redirect
  switch (profile?.role) {
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

// ============================================================
// SIGNUP ACTION (Enhanced with Role and Name)
// ============================================================
export async function signup(formData: FormData) {
  const supabase = createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("name") as string;
  const role = (formData.get("role") as string) || "student"; // Default to student

  // Validate role
  if (!["student", "instructor", "admin"].includes(role)) {
    redirect("/login?message=Invalid role selected");
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
    redirect("/login?message=Could not create account");
  }

  if (!authData.user) {
    redirect("/login?message=Could not create account");
  }

  // Create profile in profiles table
  const { error: profileError } = await supabase.from("profiles").insert({
    id: authData.user.id,
    email: email,
    name: fullName,
    role: role,
  });

  if (profileError) {
    console.error("Profile creation error:", profileError);
    // Continue anyway - profile might already exist
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

  // If instructor role, create instructor record (if you have instructors table)
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

  // Check if email confirmation is required
  // If you disabled email confirmation in Supabase, redirect to dashboard
  // Otherwise, show confirmation message
  redirect(
    "/login?message=Account created! Please check your email to verify."
  );
}

// ============================================================
// SIGNOUT ACTION
// ============================================================
export async function signout() {
  const supabase = createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}

// ============================================================
// GET CURRENT USER WITH ROLE (Helper Function)
// ============================================================
export async function getCurrentUser() {
  const supabase = createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return null;
  }

  // Fetch profile with role
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, email, name, role, brand_id, created_at")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    return null;
  }

  return {
    ...user,
    role: profile.role,
    name: profile.name,
    brand_id: profile.brand_id,
  };
}

// ============================================================
// GET USER ROLE (Helper Function)
// ============================================================
export async function getUserRole() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, brand_id")
    .eq("id", user.id)
    .single();

  return profile?.role || null;
}

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function login(formData: FormData) {
  const supabase = createClient();

  // type-casting here for convenience
  // in a real app you should validate values
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    // TODO: better error handling
    console.error(error);
    redirect("/login?message=Could not authenticate user");
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signup(formData: FormData) {
  const supabase = createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    // TODO: better error handling
    console.error(error);
    redirect("/login?message=Could not authenticate user");
  }

  // By default, Supabase sends a confirmation email.
  // You can disable this in your Supabase project settings if you want to log in immediately.
  revalidatePath("/", "layout");
  redirect("/login?message=Check email to continue sign in process");
}

export async function signout() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

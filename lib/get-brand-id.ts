import { createClient } from "@/lib/supabase/server";

export async function getBrandId(): Promise<string | null> {
  const supabase = await createClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("brand_id")
    .eq("id", user.id)
    .single();

  if (error) {
    console.error("Error fetching brand_id:", error);
    return null;
  }

  return profile?.brand_id || null;
}

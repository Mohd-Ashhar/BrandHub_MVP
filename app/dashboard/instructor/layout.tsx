import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { InstructorNav } from "@/app/components/layout/instructor-nav";

export default async function InstructorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Verify instructor role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, name, email")
    .eq("id", user.id)
    .single();

  // Only allow instructors (admins can also access for testing purposes)
  if (profile?.role !== "instructor" && profile?.role !== "admin") {
    redirect("/dashboard/unauthorized");
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <InstructorNav userName={profile?.name || user.email || "Instructor"} />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}

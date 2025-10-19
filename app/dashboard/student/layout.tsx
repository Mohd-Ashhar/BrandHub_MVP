import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { StudentNav } from "@/app/components/layout/student-nav";

export default async function StudentLayout({
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

  // Verify student role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, name, email")
    .eq("id", user.id)
    .single();

  // Only allow students (admins can also access for testing purposes)
  if (profile?.role !== "student" && profile?.role !== "admin") {
    redirect("/dashboard/unauthorized");
  }

  // Get student data
  const { data: student } = await supabase
    .from("students")
    .select("engagement_score")
    .eq("id", user.id)
    .single();

  return (
    <div className="flex h-screen bg-gray-50">
      <StudentNav
        userName={profile?.name || user.email || "Student"}
        engagementScore={student?.engagement_score || 0}
      />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}

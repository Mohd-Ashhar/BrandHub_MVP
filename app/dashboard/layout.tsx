import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Sidebar from "@/app/components/Sidebar"; // Adjusted path from original code
import Header from "@/app/components/Header"; // Adjusted path from original code
import { AI } from "@/app/action"; // Import the AI provider

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <AI>
      {" "}
      {/* This provider is essential */}
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <div className="flex flex-1 flex-col">
          <Header email={user.email!} />
          <main className="flex-1 p-6 overflow-y-auto">{children}</main>
        </div>
      </div>
    // </AI>
  );
}

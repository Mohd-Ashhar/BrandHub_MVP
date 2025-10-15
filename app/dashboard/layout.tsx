import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

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
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Header email={user.email!} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
import * as React from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Sidebar from "@/app/components/Sidebar";
import Header from "@/app/components/Header";
import { AI } from "@/app/action";

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

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("brand_id, brands(name)")
    .eq("id", user.id)
    .single();

  if (error) {
    console.error("Profile fetch error:", error);
  }

  const brandName = profile?.brands?.name || "No Brand Assigned";

  return (
    <AI>
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Header userName={user.email || ""} brandName={brandName} />
          <main className="flex-1 overflow-auto p-6">{children}</main>
        </div>
      </div>
    </AI>
  );
}

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

  const { data: profile } = await supabase
    .from("profiles")
    .select("brand_id, brands(name)")
    .eq("id", user.id)
    .single();

  const brandId = profile?.brand_id;

  // FIX: Supabase returns the joined 'brands' as an array of objects.
  // We access the 'name' from the first object in the array.
  const brandName = profile?.brands?.[0]?.name || "No Brand Assigned";

  // Pass brandId down to page components
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { brandId } as {
        brandId: string | null;
      });
    }
    return child;
  });

  return (
    <AI>
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <div className="flex flex-1 flex-col">
          <Header email={user.email!} brandName={brandName} />
          <main className="flex-1 p-6 overflow-y-auto">
            {childrenWithProps}
          </main>
        </div>
      </div>
    </AI>
  );
}

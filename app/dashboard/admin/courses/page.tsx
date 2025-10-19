import { createClient } from "@/lib/supabase/server";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { getBrandId } from "@/lib/get-brand-id";

export default async function CoursesPage() {
  const brandId = await getBrandId();

  if (!brandId) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500 text-xl">Unable to load courses.</p>
        <p className="text-gray-600">
          No brand is associated with your user account.
        </p>
      </div>
    );
  }

  const supabase = createClient();

  const { data: courses, error } = await supabase
    .from("courses")
    .select("*")
    .eq("brand_id", brandId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching courses:", error);
    return (
      <div className="text-center py-10">
        <p className="text-red-500 text-xl">Unable to load courses.</p>
        <p className="text-gray-600">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={courses || []} brandId={brandId} />
    </div>
  );
}

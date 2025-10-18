import { createClient } from "@/lib/supabase/server";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { getBrandId } from "@/lib/get-brand-id";

export default async function StudentsPage() {
  const brandId = await getBrandId();

  if (!brandId) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500 text-xl">Unable to load students.</p>
        <p className="text-gray-600">
          No brand is associated with your user account.
        </p>
      </div>
    );
  }

  const supabase = createClient();

  const { data: students, error } = await supabase
    .from("students")
    .select("*")
    .eq("brand_id", brandId);

  if (error) {
    console.error("Error fetching students:", error);
    return (
      <div className="text-center py-10">
        <p className="text-red-500 text-xl">Unable to load students.</p>
        <p className="text-gray-600">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={students || []} brandId={brandId} />
    </div>
  );
}

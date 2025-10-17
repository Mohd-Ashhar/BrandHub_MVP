import { createClient } from "@/lib/supabase/server";
import { columns } from "./columns";
import { DataTable } from "./data-table";

export default async function StudentsPage({
  brandId,
}: {
  brandId: string | null;
}) {
  // FIX: Add a guard clause to prevent DB query if brandId is missing
  if (!brandId) {
    // This will be rendered inside the layout, so the user sees a helpful message.
    return (
      <div className="container mx-auto py-10 text-center">
        <h1 className="text-xl font-bold text-destructive">
          Unable to load students.
        </h1>
        <p className="text-muted-foreground">
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
    return <div>Error loading data.</div>;
  }

  const studentData = students || [];

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Students</h1>
      <DataTable columns={columns} data={studentData} brandId={brandId} />
    </div>
  );
}

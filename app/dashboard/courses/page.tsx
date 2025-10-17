import { createClient } from "@/lib/supabase/server";
import { columns } from "./columns";
import { DataTable } from "./data-table";

export default async function CoursesPage({
  brandId,
}: {
  brandId: string | null;
}) {
  // FIX: Add a guard clause here as well
  if (!brandId) {
    return (
      <div className="container mx-auto py-10 text-center">
        <h1 className="text-xl font-bold text-destructive">
          Unable to load courses.
        </h1>
        <p className="text-muted-foreground">
          No brand is associated with your user account.
        </p>
      </div>
    );
  }

  const supabase = createClient();
  const { data: courses, error } = await supabase
    .from("courses")
    .select("*")
    .eq("brand_id", brandId);

  if (error) {
    console.error("Error fetching courses:", error);
    return <div>Error loading data.</div>;
  }

  const courseData = courses || [];

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Courses</h1>
      <DataTable columns={columns} data={courseData} brandId={brandId} />
    </div>
  );
}

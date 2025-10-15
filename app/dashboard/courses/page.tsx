import { createClient } from "@/lib/supabase/server";
import { columns } from "./columns";
import { DataTable } from "./data-table";

export default async function CoursesPage() {
  const supabase = createClient();
  const { data: courses, error } = await supabase.from("courses").select("*");

  if (error) {
    console.error("Error fetching courses:", error);
    return <div>Error loading data.</div>;
  }

  const courseData = courses || [];

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Courses</h1>
      <DataTable columns={columns} data={courseData} />
    </div>
  );
}

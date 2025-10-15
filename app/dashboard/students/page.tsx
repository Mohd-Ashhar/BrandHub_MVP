import { createClient } from "@/lib/supabase/server";
import { columns } from "./columns";
import { DataTable } from "./data-table";

export default async function StudentsPage() {
  const supabase = createClient();
  const { data: students, error } = await supabase.from("students").select("*");

  if (error) {
    console.error("Error fetching students:", error);
    // Handle error appropriately, maybe show an error message
    return <div>Error loading data.</div>;
  }
  
  // Ensure students is not null, default to empty array if it is
  const studentData = students || [];

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Students</h1>
      <DataTable columns={columns} data={studentData} />
    </div>
  );
}
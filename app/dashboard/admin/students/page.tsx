// app/dashboard/admin/students/page.tsx
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Filter } from "lucide-react";
import Link from "next/link";
import { StudentsTable } from "@/app/components/admin/students-table";

export default async function AdminStudentsPage({
  searchParams,
}: {
  searchParams: { search?: string; brand?: string };
}) {
  const supabase = createClient();

  // Build query
  let query = supabase.from("students").select(
    `
      *,
      profiles!students_id_fkey(email, name),
      enrollments(
        id,
        courses(brands(name))
      )
    `,
    { count: "exact" }
  );

  // Apply search filter
  if (searchParams.search) {
    query = query.or(
      `name.ilike.%${searchParams.search}%,email.ilike.%${searchParams.search}%`
    );
  }

  const { data: students, count } = await query.order("created_at", {
    ascending: false,
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Students</h1>
          <p className="text-gray-600 mt-1">
            Manage all students across House of EdTech brands
          </p>
        </div>
        <Link href="/dashboard/admin/students/new">
          <Button size="lg" className="gap-2">
            <Plus className="h-5 w-5" />
            Add Student
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{count || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Active Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {students?.filter((s) => s.engagement_score >= 50).length || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Avg Engagement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {students && students.length > 0
                ? Math.round(
                    students.reduce(
                      (acc, s) => acc + (s.engagement_score || 0),
                      0
                    ) / students.length
                  )
                : 0}
              %
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              New This Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {students?.filter((s) => {
                const createdDate = new Date(s.created_at);
                const now = new Date();
                return (
                  createdDate.getMonth() === now.getMonth() &&
                  createdDate.getFullYear() === now.getFullYear()
                );
              }).length || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Students</CardTitle>
            <div className="flex items-center gap-2">
              <form className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    name="search"
                    placeholder="Search students..."
                    className="pl-10 w-64"
                    defaultValue={searchParams.search}
                  />
                </div>
                <Button type="submit" variant="outline">
                  Search
                </Button>
              </form>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <StudentsTable students={students || []} />
        </CardContent>
      </Card>
    </div>
  );
}

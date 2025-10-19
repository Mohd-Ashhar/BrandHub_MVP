import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import Link from "next/link";
import { Edit } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default async function AdminStudentsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const params = await searchParams;
  const supabase = createClient();

  // Simple query - no complex joins
  let query = supabase.from("students").select("*", { count: "exact" });

  // Apply search if provided
  if (params?.search) {
    query = query.or(
      `name.ilike.%${params.search}%,email.ilike.%${params.search}%`
    );
  }

  const { data: students, count } = await query.order("created_at", {
    ascending: false,
  });

  // Simple stats
  const activeStudents =
    students?.filter((s) => s.engagement_score >= 50).length || 0;
  const avgEngagement =
    students && students.length > 0
      ? Math.round(
          students.reduce((acc, s) => acc + (s.engagement_score || 0), 0) /
            students.length
        )
      : 0;
  const newThisMonth =
    students?.filter((s) => {
      const created = new Date(s.created_at);
      const now = new Date();
      return (
        created.getMonth() === now.getMonth() &&
        created.getFullYear() === now.getFullYear()
      );
    }).length || 0;

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
            <div className="text-3xl font-bold">{activeStudents}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Avg Engagement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{avgEngagement}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              New This Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{newThisMonth}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Students</CardTitle>
            <form className="flex items-center gap-2" method="GET">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  name="search"
                  placeholder="Search students..."
                  className="pl-10 w-64"
                  defaultValue={params?.search}
                />
              </div>
              <Button type="submit" variant="outline">
                Search
              </Button>
            </form>
          </div>
        </CardHeader>
        <CardContent>
          {students && students.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-medium text-gray-600">
                      Student
                    </th>
                    <th className="text-left p-4 font-medium text-gray-600">
                      Email
                    </th>
                    <th className="text-left p-4 font-medium text-gray-600">
                      Engagement Score
                    </th>
                    <th className="text-left p-4 font-medium text-gray-600">
                      Joined
                    </th>
                    <th className="text-right p-4 font-medium text-gray-600">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => {
                    const initials = (student.name || "?")
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2);

                    const getEngagementColor = (score: number) => {
                      if (score >= 80) return "bg-green-100 text-green-700";
                      if (score >= 60) return "bg-yellow-100 text-yellow-700";
                      return "bg-red-100 text-red-700";
                    };

                    return (
                      <tr
                        key={student.id}
                        className="border-b hover:bg-gray-50"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              <AvatarFallback className="bg-blue-100 text-blue-700">
                                {initials}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">
                                {student.name || "N/A"}
                              </div>
                              <div className="text-sm text-gray-500">
                                {student.city || "No city"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-gray-600">{student.email}</td>
                        <td className="p-4">
                          <Badge
                            className={getEngagementColor(
                              student.engagement_score || 0
                            )}
                          >
                            {student.engagement_score || 0}%
                          </Badge>
                        </td>
                        <td className="p-4 text-gray-600">
                          {new Date(student.created_at).toLocaleDateString(
                            "en-IN",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </td>
                        <td className="p-4 text-right">
                          <Link
                            href={`/dashboard/admin/students/${student.id}`}
                          >
                            <Button variant="outline" size="sm">
                              View
                            </Button>
                          </Link>
                        </td>

                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/dashboard/admin/students/${student.id}/edit`}
                            >
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No students found</p>
              <Link href="/dashboard/admin/students/new">
                <Button>Add First Student</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { DeleteCourseButton } from "@/app/components/admin/delete-course-button";

export default async function AdminCoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  let query = supabase.from("courses").select("*", { count: "exact" });

  if (params?.search) {
    query = query.ilike("title", `%${params.search}%`);
  }

  const { data: courses, count } = await query.order("created_at", {
    ascending: false,
  });

  const activeCourses =
    courses?.filter((c) => c.status === "active").length || 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700";
      case "upcoming":
        return "bg-blue-100 text-blue-700";
      case "completed":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Courses</h1>
          <p className="text-gray-600 mt-1">Manage courses and workshops</p>
        </div>
        <Link href="/dashboard/admin/courses/new">
          <Button size="lg" className="gap-2">
            <Plus className="h-5 w-5" />
            Add Course
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Courses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{count || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Active Courses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{activeCourses}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Capacity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {courses?.reduce((acc, c) => acc + (c.capacity || 0), 0) || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Courses List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Courses</CardTitle>
            <form className="flex items-center gap-2" method="GET">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  name="search"
                  placeholder="Search courses..."
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
          {courses && courses.length > 0 ? (
            <div className="space-y-4">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{course.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {course.description || "No description"}
                      </p>
                      <div className="flex items-center gap-4 mt-3 text-sm">
                        <Badge className={getStatusColor(course.status)}>
                          {course.status}
                        </Badge>
                        <span className="text-gray-500">
                          Capacity: {course.current_enrolled || 0}/
                          {course.capacity}
                        </span>
                        <span className="text-gray-500">
                          {new Date(course.start_date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    {/* ✅ Edit/Delete Buttons */}
                    <div className="flex items-center gap-2 ml-4">
                      <Link href={`/dashboard/admin/courses/${course.id}/edit`}>
                        <Button variant="outline" size="sm" className="gap-2">
                          <Edit className="h-4 w-4" />
                          Edit
                        </Button>
                      </Link>
                      <DeleteCourseButton
                        courseId={course.id}
                        courseTitle={course.title}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No courses found</p>
              <Link href="/dashboard/admin/courses/new">
                <Button>Create First Course</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

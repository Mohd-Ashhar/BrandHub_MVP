import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, Calendar } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function InstructorCoursesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Fetch instructor's courses with enrollment counts
  const { data: courses } = await supabase
    .from("courses")
    .select(
      `
      *,
      brands!courses_brand_id_fkey(name)
    `
    )
    .eq("instructor_id", user.id)
    .order("start_date", { ascending: false });

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
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
        <p className="text-gray-600 mt-1">
          Manage and view all courses you&apos;re teaching
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Courses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{courses?.length || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Active Courses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {courses?.filter((c) => c.status === "active").length || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {courses?.reduce(
                (acc, c) => acc + (c.current_enrolled || 0),
                0
              ) || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Courses List */}
      <Card>
        <CardHeader>
          <CardTitle>All My Courses</CardTitle>
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
                      <div className="flex items-center gap-3 mb-2">
                        <BookOpen className="h-5 w-5 text-blue-600" />
                        <h3 className="font-semibold text-lg">
                          {course.title}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        {course.description || "No description"}
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <Badge className={getStatusColor(course.status)}>
                          {course.status}
                        </Badge>
                        {course.brands && (
                          <span className="text-gray-500">
                            Brand: {course.brands.name}
                          </span>
                        )}
                        <span className="flex items-center gap-1 text-gray-500">
                          <Users className="h-4 w-4" />
                          {course.current_enrolled || 0}/{course.capacity}{" "}
                          students
                        </span>
                        <span className="flex items-center gap-1 text-gray-500">
                          <Calendar className="h-4 w-4" />
                          {new Date(course.start_date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <Link href={`/dashboard/instructor/courses/${course.id}`}>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                No courses assigned yet. Contact admin to get courses assigned
                to you.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

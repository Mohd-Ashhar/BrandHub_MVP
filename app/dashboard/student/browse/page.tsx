import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Calendar, Users, IndianRupee } from "lucide-react";
import { redirect } from "next/navigation";
import { EnrollButton } from "@/app/components/student/enroll-button";

export default async function BrowseCoursesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Get all active courses
  const { data: courses } = await supabase
    .from("courses")
    .select(
      `
      *,
      brands!courses_brand_id_fkey(name, logo)
    `
    )
    .in("status", ["active", "upcoming"])
    .order("start_date", { ascending: true });

  // Get student's enrollments
  const { data: enrollments } = await supabase
    .from("enrollments")
    .select("course_id")
    .eq("student_id", user.id);

  const enrolledCourseIds = enrollments?.map((e) => e.course_id) || [];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Browse Courses</h1>
        <p className="text-gray-600 mt-1">
          Discover courses and start your learning journey
        </p>
      </div>

      {courses && courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => {
            const isEnrolled = enrolledCourseIds.includes(course.id);
            const isFull =
              (course.current_enrolled || 0) >= (course.capacity || 0);
            const spotsLeft =
              (course.capacity || 0) - (course.current_enrolled || 0);

            return (
              <Card
                key={course.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <BookOpen className="h-6 w-6 text-blue-600" />
                    <Badge variant="outline">{course.brands?.name}</Badge>
                  </div>
                  <CardTitle className="text-lg">{course.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {course.description || "No description available"}
                  </p>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Calendar className="h-4 w-4" />
                      Starts:{" "}
                      {new Date(course.start_date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                    <div className="flex items-center gap-2 text-gray-500">
                      <Users className="h-4 w-4" />
                      {course.current_enrolled || 0}/{course.capacity || 0}{" "}
                      enrolled
                      {!isFull && !isEnrolled && spotsLeft <= 5 && (
                        <Badge variant="destructive" className="text-xs">
                          Only {spotsLeft} spots left!
                        </Badge>
                      )}
                    </div>
                    {course.price && (
                      <div className="flex items-center gap-1 text-lg font-bold text-blue-600">
                        <IndianRupee className="h-5 w-5" />
                        {course.price.toLocaleString("en-IN")}
                      </div>
                    )}
                  </div>

                  <Badge
                    className={
                      course.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-blue-100 text-blue-700"
                    }
                  >
                    {course.status}
                  </Badge>

                  <EnrollButton
                    courseId={course.id}
                    isEnrolled={isEnrolled}
                    isFull={isFull}
                  />
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                No courses available at the moment.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Calendar, Users } from "lucide-react";
import { EnrollButton } from "@/app/components/student/enroll-button";
import { redirect } from "next/navigation";

export default async function BrowseCoursesPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Get all available courses
  const { data: courses } = await supabase
    .from("courses")
    .select(
      `
      *,
      brands!courses_brand_id_fkey(name)
    `
    )
    .eq("status", "active")
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
        <h1 className="text-3xl font-bold">Browse Courses</h1>
        <p className="text-gray-600 mt-1">
          Discover courses and start learning
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses?.map((course) => {
          const isEnrolled = enrolledCourseIds.includes(course.id);
          const isFull = course.current_enrolled >= course.capacity;

          return (
            <Card key={course.id}>
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                  <Badge>{course.brands?.name}</Badge>
                </div>
                <CardTitle className="text-lg">{course.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">{course.description}</p>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Calendar className="h-4 w-4" />
                    {new Date(course.start_date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2 text-gray-500">
                    <Users className="h-4 w-4" />
                    {course.current_enrolled}/{course.capacity} enrolled
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-blue-600">
                      ₹{course.price}
                    </span>
                  </div>
                </div>

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
    </div>
  );
}

import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock } from "lucide-react";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";

export default async function StudentSchedulePage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Get upcoming courses
  const { data: upcomingCourses } = await supabase
    .from("enrollments")
    .select(
      `
      *,
      courses!enrollments_course_id_fkey(
        id,
        title,
        start_date,
        end_date,
        brands!courses_brand_id_fkey(name)
      )
    `
    )
    .eq("student_id", user.id)
    .eq("status", "active")
    .gte("courses.end_date", new Date().toISOString())
    .order("courses.start_date", { ascending: true });

  // Group by date
  const groupedByDate = upcomingCourses?.reduce((acc: any, enrollment: any) => {
    const date = new Date(enrollment.courses.start_date).toLocaleDateString(
      "en-US",
      {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    );
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(enrollment);
    return acc;
  }, {});

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Class Schedule</h1>
        <p className="text-gray-600 mt-1">View your upcoming classes</p>
      </div>

      {groupedByDate && Object.keys(groupedByDate).length > 0 ? (
        <div className="space-y-6">
          {Object.entries(groupedByDate).map(([date, courses]: [string, any]) => (
            <Card key={date}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  {date}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {courses.map((enrollment: any) => (
                    <div
                      key={enrollment.id}
                      className="border rounded-lg p-4 hover:bg-gray-50"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">
                            {enrollment.courses.title}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {enrollment.courses.brands?.name}
                          </p>
                          <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                            <Clock className="h-4 w-4" />
                            {new Date(
                              enrollment.courses.start_date
                            ).toLocaleTimeString("en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>
                        <Badge>Upcoming</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No upcoming classes scheduled.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

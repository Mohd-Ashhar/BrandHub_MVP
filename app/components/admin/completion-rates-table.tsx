import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy } from "lucide-react";

interface Course {
  course_id: string;
  course_title: string;
  total_enrollments: number;
  completed_count: number;
  completion_rate: number;
}

export function CompletionRatesTable({ courses }: { courses: Course[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-orange-600" />
          Course Completion Rates
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {courses.slice(0, 10).map((course) => (
            <div key={course.course_id} className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="font-medium text-sm">{course.course_title}</p>
                <span className="text-sm font-semibold text-gray-700">
                  {course.completion_rate}%
                </span>
              </div>
              <Progress value={Number(course.completion_rate)} className="h-2" />
              <p className="text-xs text-gray-500">
                {course.completed_count} of {course.total_enrollments} students completed
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

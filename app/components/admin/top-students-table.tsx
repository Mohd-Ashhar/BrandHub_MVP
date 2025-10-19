import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award } from "lucide-react";
import Link from "next/link";

interface Student {
  student_id: string;
  student_name: string;
  student_email: string;
  engagement_score: number;
  enrollments_count: number;
}

export function TopStudentsTable({ students }: { students: Student[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5 text-yellow-600" />
          Top Performing Students
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {students.slice(0, 10).map((student, index) => (
            <Link
              key={student.student_id}
              href={`/dashboard/admin/students/${student.student_id}`}
            >
              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors border">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium">{student.student_name}</p>
                    <p className="text-sm text-gray-500">
                      {student.student_email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className="bg-green-100 text-green-700">
                    {student.engagement_score}% engaged
                  </Badge>
                  <span className="text-sm text-gray-600">
                    {student.enrollments_count} courses
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

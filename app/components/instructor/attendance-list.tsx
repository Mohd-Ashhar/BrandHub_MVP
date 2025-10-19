import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MarkAttendanceForm } from "./mark-attendance-form";

interface AttendanceListProps {
  students: any[];
  courseId: string;
  sessionDate: string;
}

export function AttendanceList({
  students,
  courseId,
  sessionDate,
}: AttendanceListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Attendance</CardTitle>
      </CardHeader>
      <CardContent>
        {students && students.length > 0 ? (
          <div className="space-y-3">
            {students.map((student) => {
              const initials = student.studentName
                .split(" ")
                .map((n: string) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2);

              return (
                <div
                  key={student.enrollmentId}
                  className="border rounded-lg p-4 hover:bg-gray-50"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-blue-100 text-blue-700">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{student.studentName}</p>
                        <p className="text-sm text-gray-500">
                          {student.studentEmail}
                        </p>
                      </div>
                    </div>
                    <MarkAttendanceForm
                      enrollmentId={student.enrollmentId}
                      studentId={student.studentId}
                      courseId={courseId}
                      sessionDate={sessionDate}
                      currentStatus={student.attendanceStatus}
                      attendanceId={student.attendanceId}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-center py-12 text-gray-500">
            No students enrolled in this course.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

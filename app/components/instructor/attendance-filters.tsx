"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";

interface AttendanceFiltersProps {
  courses: { id: string; title: string }[];
  selectedCourse: string;
  selectedDate: string;
}

export function AttendanceFilters({
  courses,
  selectedCourse,
  selectedDate,
}: AttendanceFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleCourseChange = (courseId: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("course", courseId);
    router.push(`/dashboard/instructor/attendance?${params.toString()}`);
  };

  const handleDateChange = (date: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("date", date);
    router.push(`/dashboard/instructor/attendance?${params.toString()}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Course & Date</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Course</label>
            <Select value={selectedCourse} onValueChange={handleCourseChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select course" />
              </SelectTrigger>
              <SelectContent>
                {courses.map((course) => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Date</label>
            <input
              type="date"
              defaultValue={selectedDate}
              onChange={(e) => handleDateChange(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

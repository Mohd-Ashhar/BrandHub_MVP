"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, CheckCircle2 } from "lucide-react";
import { enrollStudent } from "@/app/dashboard/admin/students/actions";

interface Course {
  id: string;
  title: string;
  status: string;
}

export function EnrollmentForm({
  studentId,
  availableCourses,
}: {
  studentId: string;
  availableCourses: Course[];
}) {
  const router = useRouter();
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleEnroll = async () => {
    if (!selectedCourse) return;

    setLoading(true);
    setError("");
    setSuccess(false);

    const formData = new FormData();
    formData.append("studentId", studentId);
    formData.append("courseId", selectedCourse);

    const result = await enrollStudent(formData);

    if (result.success) {
      setSuccess(true);
      setSelectedCourse("");
      router.refresh();
      setTimeout(() => setSuccess(false), 3000);
    } else {
      setError(result.message || "Failed to enroll student");
    }

    setLoading(false);
  };

  return (
    <div className="flex items-end gap-4">
      <div className="flex-1 space-y-2">
        <Select
          value={selectedCourse}
          onValueChange={setSelectedCourse}
          disabled={loading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a course..." />
          </SelectTrigger>
          <SelectContent>
            {availableCourses.map((course) => (
              <SelectItem key={course.id} value={course.id}>
                {course.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {error && <p className="text-sm text-red-600">{error}</p>}
        {success && (
          <p className="text-sm text-green-600 flex items-center gap-1">
            <CheckCircle2 className="h-4 w-4" />
            Student enrolled successfully!
          </p>
        )}
      </div>
      <Button onClick={handleEnroll} disabled={!selectedCourse || loading}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Enroll
      </Button>
    </div>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { enrollInCourse } from "@/app/dashboard/student/actions";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export function EnrollButton({
  courseId,
  isEnrolled,
  isFull,
}: {
  courseId: string;
  isEnrolled: boolean;
  isFull: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleEnroll = async () => {
    setLoading(true);
    const result = await enrollInCourse(courseId);
    if (result.success) {
      router.push("/dashboard/student/courses");
    } else {
      alert(result.message);
    }
    setLoading(false);
  };

  if (isEnrolled) {
    return (
      <Button disabled variant="outline" className="w-full">
        Already Enrolled
      </Button>
    );
  }

  if (isFull) {
    return (
      <Button disabled variant="outline" className="w-full">
        Course Full
      </Button>
    );
  }

  return (
    <Button onClick={handleEnroll} disabled={loading} className="w-full">
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Enroll Now
    </Button>
  );
}

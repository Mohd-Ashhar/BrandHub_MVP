"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle, XCircle, Clock, Loader2 } from "lucide-react";
import { markAttendance } from "@/app/dashboard/instructor/attendance/actions";
import { useRouter } from "next/navigation";

interface MarkAttendanceFormProps {
  enrollmentId: string;
  studentId: string;
  courseId: string;
  sessionDate: string;
  currentStatus: string;
  attendanceId?: string;
}

export function MarkAttendanceForm({
  enrollmentId,
  studentId,
  courseId,
  sessionDate,
  currentStatus,
  attendanceId,
}: MarkAttendanceFormProps) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (status === "unmarked") return;

    setLoading(true);
    const formData = new FormData();
    formData.append("enrollmentId", enrollmentId);
    formData.append("studentId", studentId);
    formData.append("courseId", courseId);
    formData.append("sessionDate", sessionDate);
    formData.append("status", status);
    if (attendanceId) formData.append("attendanceId", attendanceId);

    await markAttendance(formData);
    router.refresh();
    setLoading(false);
  };

  const getStatusIcon = (statusValue: string) => {
    switch (statusValue) {
      case "present":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "absent":
        return <XCircle className="h-4 w-4 text-red-600" />;
      case "late":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Select value={status} onValueChange={setStatus} disabled={loading}>
        <SelectTrigger className="w-36">
          <div className="flex items-center gap-2">
            {getStatusIcon(status)}
            <SelectValue />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="present">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              Present
            </div>
          </SelectItem>
          <SelectItem value="absent">
            <div className="flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-600" />
              Absent
            </div>
          </SelectItem>
          <SelectItem value="late">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-600" />
              Late
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
      {status !== currentStatus && (
        <Button onClick={handleSubmit} disabled={loading} size="sm">
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save
        </Button>
      )}
    </div>
  );
}

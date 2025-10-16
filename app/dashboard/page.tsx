import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getEnrollmentsPerCourse, getStudentGrowthOverTime } from "./actions";
import { EnrollmentsBarChart } from "../components/charts/EnrollmentsBarChart";
import { StudentGrowthLineChart } from "../components/charts/StudentGrowthLineChart";
import { AIInsight } from "./ai-insight";

export default async function DashboardPage() {
  const enrollmentsData = await getEnrollmentsPerCourse();
  const studentGrowthData = await getStudentGrowthOverTime();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard Analytics</h1>

      {/* AI Insight Component */}
      <AIInsight
        enrollmentsData={enrollmentsData}
        studentGrowthData={studentGrowthData}
      />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Enrollments per Course</CardTitle>
          </CardHeader>
          <CardContent>
            <EnrollmentsBarChart data={enrollmentsData} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>New Students per Day</CardTitle>
          </CardHeader>
          <CardContent>
            <StudentGrowthLineChart data={studentGrowthData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

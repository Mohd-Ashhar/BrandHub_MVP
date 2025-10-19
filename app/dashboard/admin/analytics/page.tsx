import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  BookOpen,
  TrendingUp,
  Award,
  Activity,
  GraduationCap,
} from "lucide-react";
import {
  getDashboardStats,
  getEnrollmentsPerCourse,
  getStudentGrowthOverTime,
  getTopStudents,
  getCourseCompletionRates,
} from "./actions";
import { EnrollmentChart } from "@/app/components/admin/enrollment-chart2";
import { StudentGrowthChart } from "@/app/components/admin/student-growth-chart";
import { AIInsight } from "@/app/components/admin/ai-insight";
import { TopStudentsTable } from "@/app/components/admin/top-students-table";
import { CompletionRatesTable } from "@/app/components/admin/completion-rates-table";

export default async function AdminAnalyticsPage() {
  const stats = await getDashboardStats();
  const enrollmentsData = await getEnrollmentsPerCourse();
  const studentGrowthData = await getStudentGrowthOverTime();
  const topStudents = await getTopStudents();
  const completionRates = await getCourseCompletionRates();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Analytics Dashboard
        </h1>
        <p className="text-gray-600 mt-1">
          Comprehensive insights across all House of EdTech brands
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Students
              </CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalStudents}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Courses
              </CardTitle>
              <BookOpen className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalCourses}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Enrollments
              </CardTitle>
              <GraduationCap className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalEnrollments}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">
                Active Courses
              </CardTitle>
              <Activity className="h-4 w-4 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.activeCourses}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">
                Avg Engagement
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.avgEngagement}%</div>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
      <AIInsight
        enrollmentsData={enrollmentsData}
        studentGrowthData={studentGrowthData}
      />

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EnrollmentChart data={enrollmentsData} />
        <StudentGrowthChart data={studentGrowthData} />
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopStudentsTable students={topStudents} />
        <CompletionRatesTable courses={completionRates} />
      </div>
    </div>
  );
}

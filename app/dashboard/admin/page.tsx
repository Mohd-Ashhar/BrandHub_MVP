import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, TrendingUp, DollarSign, BarChart3 } from "lucide-react";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  // Fetch stats
  const { count: studentCount } = await supabase
    .from("students")
    .select("*", { count: "exact", head: true });

  const { count: courseCount } = await supabase
    .from("courses")
    .select("*", { count: "exact", head: true });

  const { count: enrollmentCount } = await supabase
    .from("enrollments")
    .select("*", { count: "exact", head: true });

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Manage all House of EdTech brands and operations
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Students
            </CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studentCount || 0}</div>
            <p className="text-xs text-gray-500 mt-1">Across all brands</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{courseCount || 0}</div>
            <p className="text-xs text-gray-500 mt-1">Active and upcoming</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Enrollments
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{enrollmentCount || 0}</div>
            <p className="text-xs text-gray-500 mt-1">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹10.5Cr</div>
            <p className="text-xs text-gray-500 mt-1">This quarter</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/dashboard/admin/students/new"
            className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Users className="h-6 w-6 mb-2 text-blue-600" />
            <h3 className="font-semibold">Add Student</h3>
            <p className="text-sm text-gray-500">Enroll new student</p>
          </Link>

          <Link
            href="/dashboard/admin/courses/new"
            className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <BookOpen className="h-6 w-6 mb-2 text-green-600" />
            <h3 className="font-semibold">Create Course</h3>
            <p className="text-sm text-gray-500">Add new workshop</p>
          </Link>

          <Link
            href="/dashboard/admin/analytics"
            className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <BarChart3 className="h-6 w-6 mb-2 text-purple-600" />
            <h3 className="font-semibold">View Analytics</h3>
            <p className="text-sm text-gray-500">Performance insights</p>
          </Link>

          <Link
            href="/dashboard/admin/students"
            className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <TrendingUp className="h-6 w-6 mb-2 text-orange-600" />
            <h3 className="font-semibold">Manage Students</h3>
            <p className="text-sm text-gray-500">View all students</p>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

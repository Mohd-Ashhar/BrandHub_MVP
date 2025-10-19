"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  Award,
  TrendingUp,
  LogOut,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard/student",
    icon: LayoutDashboard,
  },
  {
    title: "My Courses",
    href: "/dashboard/student/courses",
    icon: BookOpen,
  },
  {
    title: "Schedule",
    href: "/dashboard/student/schedule",
    icon: Calendar,
  },
  {
    title: "Certificates",
    href: "/dashboard/student/certificates",
    icon: Award,
  },
  {
    title: "My Progress",
    href: "/dashboard/student/progress",
    icon: TrendingUp,
  },
];

interface StudentNavProps {
  userName: string;
  userEmail: string;
  engagementScore: number;
}

export function StudentNav({
  userName,
  userEmail,
  engagementScore,
}: StudentNavProps) {
  const pathname = usePathname();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex h-screen w-64 flex-col bg-gradient-to-b from-purple-900 to-purple-800 text-white">
      {/* Header */}
      <div className="p-6 border-b border-purple-700">
        <div className="flex items-center gap-3">
          <GraduationCap className="h-8 w-8" />
          <div>
            <h2 className="text-xl font-bold">BrandHub</h2>
            <p className="text-sm text-purple-200">Student Portal</p>
          </div>
        </div>
      </div>

      {/* User Profile */}
      <div className="p-4 border-b border-purple-700">
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-purple-700 text-white">
              {getInitials(userName)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{userName}</p>
            <p className="text-xs text-purple-200">Student</p>
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-purple-200">LMS Progress Together!</span>
            <span className="font-medium">{engagementScore}%</span>
          </div>
          <Progress value={engagementScore} className="h-2 bg-purple-700" />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                  isActive
                    ? "bg-white text-purple-900 font-medium"
                    : "text-purple-100 hover:bg-purple-700"
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{item.title}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Sign Out */}
      <div className="p-4 border-t border-purple-700">
        <form action="/auth/signout" method="post">
          <Button
            type="submit"
            variant="ghost"
            className="w-full justify-start text-purple-100 hover:bg-purple-700 hover:text-white"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Sign Out
          </Button>
        </form>
      </div>
    </div>
  );
}

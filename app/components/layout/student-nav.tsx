"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  Award,
  TrendingUp,
  LogOut,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { signout } from "@/app/auth/actions";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

interface StudentNavProps {
  userName: string;
  engagementScore: number;
}

export function StudentNav({ userName, engagementScore }: StudentNavProps) {
  const pathname = usePathname();

  const navItems = [
    {
      href: "/dashboard/student",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      href: "/dashboard/student/courses",
      label: "My Courses",
      icon: BookOpen,
    },
    {
      href: "/dashboard/student/schedule",
      label: "Schedule",
      icon: Calendar,
    },
    {
      href: "/dashboard/student/certificates",
      label: "Certificates",
      icon: Award,
    },
    {
      href: "/dashboard/student/progress",
      label: "My Progress",
      icon: TrendingUp,
    },
  ];

  // Get initials for avatar
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // Determine engagement color
  const getEngagementColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <aside className="w-64 bg-gradient-to-b from-purple-900 to-purple-800 text-white flex flex-col shadow-xl">
      {/* Header */}
      <div className="p-6 border-b border-purple-700">
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="h-8 w-8 text-yellow-300" />
          <div>
            <h1 className="text-xl font-bold">BrandHub</h1>
            <p className="text-xs text-purple-200">Student Portal</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-purple-700">
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="h-10 w-10 bg-purple-600">
            <AvatarFallback className="bg-purple-600 text-white font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{userName}</p>
            <p className="text-xs text-purple-200">Student</p>
          </div>
        </div>

        {/* Engagement Score */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-purple-200">Engagement Score</span>
            <span
              className={`font-bold ${getEngagementColor(engagementScore)}`}
            >
              {engagementScore}%
            </span>
          </div>
          <Progress value={engagementScore} className="h-2 bg-purple-700" />
          <p className="text-xs text-purple-300">
            {engagementScore >= 80
              ? "🔥 Excellent! Keep it up!"
              : engagementScore >= 60
              ? "💪 Good progress!"
              : "📚 Let's improve together!"}
          </p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-white text-purple-900 shadow-md font-medium"
                  : "text-purple-100 hover:bg-purple-700 hover:text-white"
              }`}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              <span className="text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Sign Out */}
      <div className="p-4 border-t border-purple-700">
        <form action={signout}>
          <Button
            type="submit"
            variant="ghost"
            className="w-full justify-start text-purple-100 hover:text-white hover:bg-purple-700 transition-colors"
          >
            <LogOut className="h-5 w-5 mr-3" />
            <span className="text-sm">Sign Out</span>
          </Button>
        </form>
      </div>
    </aside>
  );
}

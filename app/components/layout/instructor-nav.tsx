"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  ClipboardCheck,
  TrendingUp,
  LogOut,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard/instructor",
    icon: LayoutDashboard,
  },
  {
    title: "My Courses",
    href: "/dashboard/instructor/courses",
    icon: BookOpen,
  },
  {
    title: "My Students",
    href: "/dashboard/instructor/students",
    icon: Users,
  },
  {
    title: "Attendance",
    href: "/dashboard/instructor/attendance",
    icon: ClipboardCheck,
  },
  {
    title: "Performance",
    href: "/dashboard/instructor/performance",
    icon: TrendingUp,
  },
];

interface InstructorNavProps {
  userName: string;
  userEmail: string;
}

export function InstructorNav({ userName, userEmail }: InstructorNavProps) {
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
    <div className="flex h-screen w-64 flex-col bg-gradient-to-b from-green-900 to-green-800 text-white">
      {/* Header */}
      <div className="p-6 border-b border-green-700">
        <div className="flex items-center gap-3">
          <GraduationCap className="h-8 w-8" />
          <div>
            <h2 className="text-xl font-bold">BrandHub</h2>
            <p className="text-sm text-green-200">Instructor Portal</p>
          </div>
        </div>
      </div>

      {/* User Profile */}
      <div className="p-4 border-b border-green-700">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-green-700 text-white">
              {getInitials(userName)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{userName}</p>
            <p className="text-xs text-green-200">Instructor</p>
          </div>
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
                    ? "bg-white text-green-900 font-medium"
                    : "text-green-100 hover:bg-green-700"
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
      <div className="p-4 border-t border-green-700">
        <form action="/auth/signout" method="post">
          <Button
            type="submit"
            variant="ghost"
            className="w-full justify-start text-green-100 hover:bg-green-700 hover:text-white"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Sign Out
          </Button>
        </form>
      </div>
    </div>
  );
}

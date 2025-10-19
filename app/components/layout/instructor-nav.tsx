"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  ClipboardCheck,
  BarChart3,
  LogOut,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { signout } from "@/app/auth/actions";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface InstructorNavProps {
  userName: string;
}

export function InstructorNav({ userName }: InstructorNavProps) {
  const pathname = usePathname();

  const navItems = [
    {
      href: "/dashboard/instructor",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      href: "/dashboard/instructor/courses",
      label: "My Courses",
      icon: BookOpen,
    },
    {
      href: "/dashboard/instructor/students",
      label: "My Students",
      icon: Users,
    },
    {
      href: "/dashboard/instructor/attendance",
      label: "Attendance",
      icon: ClipboardCheck,
    },
    {
      href: "/dashboard/instructor/analytics",
      label: "Performance",
      icon: BarChart3,
    },
  ];

  // Get initials for avatar
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <aside className="w-64 bg-gradient-to-b from-green-900 to-green-800 text-white flex flex-col shadow-xl">
      {/* Header */}
      <div className="p-6 border-b border-green-700">
        <div className="flex items-center gap-3 mb-2">
          <GraduationCap className="h-8 w-8" />
          <div>
            <h1 className="text-xl font-bold">BrandHub</h1>
            <p className="text-xs text-green-200">Instructor Portal</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-green-700">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 bg-green-600">
            <AvatarFallback className="bg-green-600 text-white font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{userName}</p>
            <p className="text-xs text-green-200">Instructor</p>
          </div>
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
                  ? "bg-white text-green-900 shadow-md font-medium"
                  : "text-green-100 hover:bg-green-700 hover:text-white"
              }`}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              <span className="text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Sign Out */}
      <div className="p-4 border-t border-green-700">
        <form action={signout}>
          <Button
            type="submit"
            variant="ghost"
            className="w-full justify-start text-green-100 hover:text-white hover:bg-green-700 transition-colors"
          >
            <LogOut className="h-5 w-5 mr-3" />
            <span className="text-sm">Sign Out</span>
          </Button>
        </form>
      </div>
    </aside>
  );
}

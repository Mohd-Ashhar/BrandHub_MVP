"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, BookOpen, BarChart3, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signout } from "@/app/auth/actions";

export function AdminNav() {
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/admin/students", label: "Students", icon: Users },
    { href: "/dashboard/admin/courses", label: "Courses", icon: BookOpen },
    { href: "/dashboard/admin/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/dashboard/admin/settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-2xl font-bold">BrandHub</h1>
        <p className="text-sm text-slate-400 mt-1">Admin Portal</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <form action={signout}>
          <Button
            type="submit"
            variant="ghost"
            className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800"
          >
            <LogOut className="h-5 w-5 mr-3" />
            Sign Out
          </Button>
        </form>
      </div>
    </aside>
  );
}

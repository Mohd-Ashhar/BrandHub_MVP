import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-64 flex-shrink-0 bg-gray-800 p-6 text-white">
      <h1 className="mb-8 text-2xl font-bold">BrandHub</h1>
      <nav className="flex flex-col space-y-4">
        <Link href="/dashboard" className="rounded px-4 py-2 hover:bg-gray-700">
          Dashboard
        </Link>
        <Link href="/dashboard/students" className="rounded px-4 py-2 hover:bg-gray-700">
          Students
        </Link>
        <Link href="/dashboard/courses" className="rounded px-4 py-2 hover:bg-gray-700">
          Courses
        </Link>
      </nav>
    </aside>
  );
}
import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { createClient } from "./lib/supabase/server";

export async function middleware(request: NextRequest) {
  // Update user's auth session
  await updateSession(request);

  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // ============================================================
  // PUBLIC ROUTES (Accessible to everyone)
  // ============================================================
  const publicRoutes = ["/", "/login", "/signup"];
  const isPublicRoute = publicRoutes.includes(pathname);

  // ============================================================
  // PROTECT DASHBOARD ROUTES (Redirect to login if not authenticated)
  // ============================================================
  if (!user && pathname.startsWith("/dashboard")) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname); // Store intended destination
    return NextResponse.redirect(loginUrl);
  }

  // ============================================================
  // REDIRECT AUTHENTICATED USERS FROM AUTH PAGES
  // ============================================================
  if (user && (pathname === "/login" || pathname === "/signup")) {
    // Fetch user role to redirect to correct dashboard
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile) {
      switch (profile.role) {
        case "admin":
          return NextResponse.redirect(
            new URL("/dashboard/admin", request.url)
          );
        case "instructor":
          return NextResponse.redirect(
            new URL("/dashboard/instructor", request.url)
          );
        case "student":
          return NextResponse.redirect(
            new URL("/dashboard/student", request.url)
          );
        default:
          return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }
  }

  // ============================================================
  // ROLE-BASED ACCESS CONTROL
  // ============================================================
  if (user && pathname.startsWith("/dashboard")) {
    // Fetch user role
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const userRole = profile?.role;

    // Admin routes - only accessible to admins
    if (pathname.startsWith("/dashboard/admin") && userRole !== "admin") {
      return NextResponse.redirect(
        new URL("/dashboard/unauthorized", request.url)
      );
    }

    // Instructor routes - only accessible to instructors and admins
    if (
      pathname.startsWith("/dashboard/instructor") &&
      userRole !== "instructor" &&
      userRole !== "admin"
    ) {
      return NextResponse.redirect(
        new URL("/dashboard/unauthorized", request.url)
      );
    }

    // Student routes - only accessible to students (and optionally admins)
    if (
      pathname.startsWith("/dashboard/student") &&
      userRole !== "student" &&
      userRole !== "admin"
    ) {
      return NextResponse.redirect(
        new URL("/dashboard/unauthorized", request.url)
      );
    }

    // Auto-redirect from generic /dashboard to role-specific dashboard
    if (pathname === "/dashboard") {
      switch (userRole) {
        case "admin":
          return NextResponse.redirect(
            new URL("/dashboard/admin", request.url)
          );
        case "instructor":
          return NextResponse.redirect(
            new URL("/dashboard/instructor", request.url)
          );
        case "student":
          return NextResponse.redirect(
            new URL("/dashboard/student", request.url)
          );
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api (API routes)
     * - public files (images, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

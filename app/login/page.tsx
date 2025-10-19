import { login } from "../auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function LoginPage({
  searchParams,
}: {
  searchParams: { message?: string; redirect?: string };
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">
            Sign in to BrandHub
          </CardTitle>
          <CardDescription>
            Enter your credentials to access your dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={login} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
              />
            </div>

            {searchParams?.message && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
                {searchParams.message}
              </div>
            )}

            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </form>

          <div className="mt-4 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link href="/signup" className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </div>

          {/* Demo Accounts */}
          <div className="mt-6 border-t pt-6">
            <p className="text-sm font-medium text-gray-700 mb-3">
              Demo Accounts:
            </p>
            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex justify-between items-center bg-blue-50 p-2 rounded">
                <span>
                  <strong>Admin:</strong> admin@test.com
                </span>
                <span className="text-gray-500">Password: Test@123</span>
              </div>
              <div className="flex justify-between items-center bg-green-50 p-2 rounded">
                <span>
                  <strong>Instructor:</strong> instructor@test.com
                </span>
                <span className="text-gray-500">Password: Test@123</span>
              </div>
              <div className="flex justify-between items-center bg-purple-50 p-2 rounded">
                <span>
                  <strong>Student:</strong> student@test.com
                </span>
                <span className="text-gray-500">Password: Test@123</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

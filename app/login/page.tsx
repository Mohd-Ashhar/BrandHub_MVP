import { login, signup } from "../auth/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login or Sign Up</CardTitle>
          <CardDescription>
            Enter your email below to login to your account or to sign up.
          </CardDescription>
        </CardHeader>
        <form>
            <CardContent className="grid gap-4">
                <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="m@example.com" required />
                </div>
                <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" required />
                </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
                <Button formAction={login} className="w-full">Sign In</Button>
                <Button formAction={signup} variant="outline" className="w-full">Sign Up</Button>
            </CardFooter>
        </form>
      </Card>
    </main>
  );
}
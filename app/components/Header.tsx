import { signout } from "@/app/auth/actions";
import { Button } from "../../components/ui/button";

interface HeaderProps {
    email: string;
}

export default function Header({ email }: HeaderProps) {
  return (
    <header className="flex w-full items-center justify-between border-b p-4">
      <div>
        <p className="text-sm text-gray-500">Welcome, {email}</p>
      </div>
      <form>
        <Button formAction={signout} variant="outline">Sign Out</Button>
      </form>
    </header>
  );
}
import { signout } from "@/app/auth/actions";
import { Button } from "../../components/ui/button";

interface HeaderProps {
  email: string;
  brandName: string; // Add brandName to props
}

export default function Header({ email, brandName }: HeaderProps) {
  return (
    <header className="flex w-full items-center justify-between border-b p-4">
      <div>
        <p className="text-sm text-gray-500">Welcome, {email}</p>
        <p className="text-lg font-semibold">{brandName}</p>
      </div>
      <form>
        <Button formAction={signout} variant="outline">
          Sign Out
        </Button>
      </form>
    </header>
  );
}

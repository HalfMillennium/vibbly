import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import vibblyLogo from "@assets/vibbly_logo.png";
import { UserButton, useClerk, useUser } from "@clerk/clerk-react";

export default function AppHeader() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <header className="w-full py-4 px-4 sm:px-6 border-b bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/">
          <a className="flex items-center space-x-2">
            <img src={vibblyLogo} alt="vibbly logo" className="h-16 w-auto" />
          </a>
        </Link>

        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/create">Create</Link>
              </Button>
              <Button onClick={logout} variant="ghost" size="sm">
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/register">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

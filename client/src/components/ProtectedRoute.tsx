import { ReactNode } from "react";
import { Link } from "wouter";
import { useUser } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";

interface ProtectedRouteProps {
  children: ReactNode;
  requireSubscription?: boolean;
}

export default function ProtectedRoute({
  children,
  requireSubscription = true,
}: ProtectedRouteProps) {
  const { isSignedIn, isLoaded } = useUser();

  // Show loading while Clerk loads
  if (!isLoaded) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // If not signed in, show login prompt
  if (!isSignedIn) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <h2 className="text-2xl font-bold mb-4">Sign in required</h2>
          <p className="text-muted-foreground mb-6">
            You need to be signed in to access this page.
          </p>
          <div className="space-y-3">
            <Button asChild className="w-full">
              <Link href="/login">Sign In</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/signup">Create Account</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // If subscription is required, show subscription prompt
  if (requireSubscription) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <h2 className="text-2xl font-bold mb-4">Subscription required</h2>
          <p className="text-muted-foreground mb-6">
            This feature requires an active subscription.
          </p>
          <div className="space-y-3">
            <Button asChild className="w-full">
              <Link href="/subscribe">Get Subscription</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/pricing">View Pricing</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Show content if signed in and no subscription required
  return <>{children}</>;
}

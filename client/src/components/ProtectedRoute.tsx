import { ReactNode, useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';

interface ProtectedRouteProps {
  children: ReactNode;
  requireSubscription?: boolean;
}

export default function ProtectedRoute({ 
  children, 
  requireSubscription = true 
}: ProtectedRouteProps) {
  const { isAuthenticated, isSubscribed, isLoading } = useAuth();
  const { isSignedIn, isLoaded: isClerkLoaded } = useUser();
  const [, setLocation] = useLocation();
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    // Prevent multiple redirects by tracking if we've already redirected
    if (hasRedirected) return;

    // Wait for both Clerk and our custom auth hook to load
    if (!isLoading && isClerkLoaded) {
      if (!isSignedIn) {
        // Not signed in with Clerk, redirect to login
        console.log("Protected route: not signed in, redirecting to login");
        setHasRedirected(true);
        setTimeout(() => setLocation('/login'), 50);
      } else if (!isAuthenticated) {
        // Signed in with Clerk but not in our database yet,
        // go to subscription check to sync the accounts
        console.log("Protected route: signed in but not authenticated in database, redirecting to subscription check");
        setHasRedirected(true);
        setTimeout(() => setLocation('/subscription-check'), 50);
      } else if (requireSubscription && !isSubscribed) {
        // Authenticated but not subscribed, redirect to subscription page
        console.log("Protected route: authenticated but not subscribed, redirecting to subscribe");
        setHasRedirected(true);
        setTimeout(() => setLocation('/subscribe'), 50);
      }
    }
  }, [isLoading, isClerkLoaded, isSignedIn, isAuthenticated, isSubscribed, requireSubscription, setLocation, hasRedirected]);

  // Show loading spinner while checking auth status
  if (isLoading || !isClerkLoaded) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Show children if authenticated and subscription requirements are met
  if (isSignedIn && isAuthenticated && (!requireSubscription || isSubscribed)) {
    return <>{children}</>;
  }

  // Return loading state while redirecting (prevents flash of content)
  return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="ml-2">Redirecting...</p>
    </div>
  );
}
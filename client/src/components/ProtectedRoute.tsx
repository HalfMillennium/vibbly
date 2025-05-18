import { ReactNode, useEffect } from 'react';
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

  useEffect(() => {
    // Wait for both Clerk and our custom auth hook to load
    if (!isLoading && isClerkLoaded) {
      if (!isSignedIn) {
        // Not signed in with Clerk, redirect to login
        setLocation('/login');
      } else if (!isAuthenticated) {
        // Signed in with Clerk but not in our database yet,
        // go to subscription check to sync the accounts
        setLocation('/subscription-check');
      } else if (requireSubscription && !isSubscribed) {
        // Authenticated but not subscribed, redirect to subscription page
        setLocation('/subscribe');
      }
    }
  }, [isLoading, isClerkLoaded, isSignedIn, isAuthenticated, isSubscribed, requireSubscription, setLocation]);

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

  // Return null while redirecting (prevents flash of content)
  return null;
}
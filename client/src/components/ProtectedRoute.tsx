import { ReactNode, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  requireSubscription?: boolean;
}

export default function ProtectedRoute({ 
  children, 
  requireSubscription = true 
}: ProtectedRouteProps) {
  const { isAuthenticated, isSubscribed, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        // Not authenticated, redirect to login
        setLocation('/login');
      } else if (requireSubscription && !isSubscribed) {
        // Authenticated but not subscribed, redirect to subscription page
        setLocation('/subscribe');
      }
    }
  }, [isLoading, isAuthenticated, isSubscribed, requireSubscription, setLocation]);

  // Show loading spinner while checking auth status
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Show children if authenticated and subscription requirements are met
  if (isAuthenticated && (!requireSubscription || isSubscribed)) {
    return <>{children}</>;
  }

  // Return null while redirecting (prevents flash of content)
  return null;
}
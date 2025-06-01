import { ReactNode } from 'react';
import { useUser } from '@clerk/clerk-react';

interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export default function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { isLoaded, isSignedIn } = useUser();

  // Wait for Clerk to finish loading
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // Show fallback or redirect if not authenticated
  if (!isSignedIn) {
    return fallback || (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Please sign in to access this page.</div>
      </div>
    );
  }

  return <>{children}</>;
}
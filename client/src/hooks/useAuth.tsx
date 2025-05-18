import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLocation } from 'wouter';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useUser, useClerk } from '@clerk/clerk-react';

// Define user type
interface User {
  id: number;
  email: string;
  username: string;
  isSubscribed: boolean;
  subscriptionStatus: string | null;
  stripeCustomerId?: string | null;
}

// Define auth context type
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isSubscribed: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { isSignedIn, user: clerkUser } = useUser();
  const { signOut } = useClerk();

  // Check if user is authenticated
  const isAuthenticated = !!user;
  
  // Check if user has active subscription
  const isSubscribed = isAuthenticated && !!user?.stripeCustomerId;

  // Check auth status when Clerk user changes
  useEffect(() => {
    if (isSignedIn && clerkUser) {
      checkAuthStatus();
    } else {
      setUser(null);
      setIsLoading(false);
    }
  }, [isSignedIn, clerkUser]);

  // Function to check authentication status
  const checkAuthStatus = async () => {
    setIsLoading(true);
    try {
      const response = await apiRequest('GET', '/api/auth/me');
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        // Don't redirect here, let the ProtectedRoute component handle redirects
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Login function is handled by Clerk
  const login = async (email: string, password: string): Promise<boolean> => {
    // This is just a stub for compatibility
    return true;
  };

  // Register function is handled by Clerk
  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    // This is just a stub for compatibility
    return true;
  };

  // Logout function with Clerk
  const logout = async () => {
    setIsLoading(true);
    try {
      await signOut();
      setUser(null);
      setLocation('/');
    } catch (error) {
      console.error('Error during logout:', error);
      toast({
        title: 'Logout failed',
        description: 'An error occurred during logout. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated,
    isSubscribed,
    login,
    register,
    logout,
    checkAuthStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
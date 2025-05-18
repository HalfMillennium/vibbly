import { useUser } from "@clerk/clerk-react";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import AppHeader from "./AppHeader";
import AppFooter from "./AppFooter";
import CustomSignInForm from "./CustomSignInForm";
import CustomSignUpForm from "./CustomSignUpForm";

export function SignInPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-muted">
      <AppHeader />
      <main className="flex-1 flex justify-center items-center px-4 py-8">
        <CustomSignInForm />
      </main>
      <AppFooter />
    </div>
  );
}

export function SignUpPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-muted">
      <AppHeader />
      <main className="flex-1 flex justify-center items-center px-4 py-8">
        <CustomSignUpForm />
      </main>
      <AppFooter />
    </div>
  );
}

export function SubscriptionCheckPage() {
  const { isSignedIn, user } = useUser();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  // Check subscription status when user is signed in
  useEffect(() => {
    if (isSignedIn && user) {
      // Sync with our backend
      const checkSubscription = async () => {
        try {
          const response = await apiRequest('GET', '/api/auth/me');
          
          if (response.ok) {
            const userData = await response.json();
            
            // Check if user has a subscription
            if (userData.isSubscribed) {
              // User has a subscription, redirect to create page
              setLocation('/create');
            } else {
              // User doesn't have a subscription, redirect to subscribe page
              setLocation('/subscribe');
            }
          } else {
            // User exists in Clerk but not in our database, redirect to subscribe
            setLocation('/subscribe');
          }
        } catch (error) {
          console.error('Error checking subscription:', error);
          toast({
            title: 'Error',
            description: 'Failed to check subscription status. Please try again.',
            variant: 'destructive',
          });
          setLocation('/subscribe');
        }
      };
      
      // Run the check
      checkSubscription();
    } else if (!isSignedIn) {
      // Not signed in, redirect to login
      setLocation('/login');
    }
  }, [isSignedIn, user, setLocation, toast]);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-muted">
      <AppHeader />
      <main className="flex-1 flex justify-center items-center px-4 py-8">
        <div className="w-full max-w-md text-center">
          <h1 className="text-2xl font-bold mb-4">Checking your subscription...</h1>
          <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-muted-foreground">
            We're verifying your account details.
          </p>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
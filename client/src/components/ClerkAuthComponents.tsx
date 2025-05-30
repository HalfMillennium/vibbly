import { SignIn, SignUp, useUser } from "@clerk/clerk-react";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import AppHeader from "./AppHeader";
import AppFooter from "./AppFooter";

export function SignInPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-muted">
      <AppHeader />
      <main className="flex-1 flex justify-center items-center px-4 py-8">
        <div className="w-full max-w-md">
          <SignIn redirectUrl="/subscription-check" />
        </div>
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
        <div className="w-full max-w-md">
          <SignUp redirectUrl="/subscription-check" />
        </div>
      </main>
      <AppFooter />
    </div>
  );
}

export function SubscriptionCheckPage() {
  const { isSignedIn, user, isLoaded } = useUser();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [hasChecked, setHasChecked] = useState(false);

  // Check subscription status when user is signed in
  useEffect(() => {
    // Only run once per page load
    if (hasChecked) return;

    // Wait for Clerk to load
    if (!isLoaded) return;

    if (isSignedIn && user) {
      setHasChecked(true);

      // Sync with our backend
      const checkSubscription = async () => {
        try {
          console.log("Checking subscription status...");
          const response = await apiRequest("GET", "/api/auth/me");

          if (response.ok) {
            const userData = await response.json();
            console.log("Subscription check: User data received", userData);

            // If user has a Stripe customer ID, consider them subscribed
            if (userData.stripeCustomerId) {
              console.log("User has customer ID, redirecting to create page");
              // Use a small delay to prevent rapid redirects
              setTimeout(() => setLocation("/create"), 100);
            } else {
              console.log("User has no subscription, redirecting to subscribe page");
              setTimeout(() => setLocation("/subscribe"), 100);
            }
          } else {
            console.log("User not found in database, redirecting to subscribe");
            setTimeout(() => setLocation("/subscribe"), 100);
          }
        } catch (error) {
          console.error("Error checking subscription:", error);
          toast({
            title: "Error",
            description: "Failed to check subscription status. Please try again.",
            variant: "destructive",
          });
          setTimeout(() => setLocation("/subscribe"), 100);
        }
      };

      checkSubscription();
    } else if (isLoaded && !isSignedIn) {
      console.log("Not signed in with Clerk, redirecting to login");
      setHasChecked(true);
      setTimeout(() => setLocation("/login"), 100);
    }
  }, [isSignedIn, user, isLoaded, setLocation, toast, hasChecked]);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-muted">
      <AppHeader />
      <main className="flex-1 flex justify-center items-center px-4 py-8">
        <div className="w-full max-w-md text-center">
          <h1 className="text-2xl font-bold mb-4">
            Checking your subscription...
          </h1>
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

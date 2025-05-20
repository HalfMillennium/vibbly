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
  const [isChecking, setIsChecking] = useState(false);

  // Check subscription status when user is signed in
  useEffect(() => {
    // Avoid multiple checks
    if (isChecking) return;

    // Wait for Clerk to load
    if (!isLoaded) return;

    if (isSignedIn && user) {
      // Mark as checking to prevent multiple API calls
      setIsChecking(true);

      // Sync with our backend
      const checkSubscription = async () => {
        try {
          console.log("Checking subscription status...");
          const response = await apiRequest("GET", "/api/auth/me");

          if (response.ok) {
            const userData = await response.json();

            console.log("Subscription check: User data received", userData);

            // Check if user has a subscription (has a Stripe customer ID)
            if (!!userData.stripeCustomerId) {
              console.log("User has subscription, redirecting to create page");
              // User has a subscription, redirect to create page
              window.location.href = "/create"; // Use direct navigation instead of wouter
            } else {
              console.log(
                "User has no subscription, redirecting to subscribe page",
              );
              // User doesn't have a subscription, redirect to subscribe page
              window.location.href = "/subscribe"; // Use direct navigation instead of wouter
            }
          } else {
            console.log("User not found in database, redirecting to subscribe");
            // User exists in Clerk but not in our database, redirect to subscribe
            window.location.href = "/subscribe"; // Use direct navigation instead of wouter
          }
        } catch (error) {
          console.error("Error checking subscription:", error);
          toast({
            title: "Error",
            description:
              "Failed to check subscription status. Please try again.",
            variant: "destructive",
          });
          // On error, safer to just go to subscription page
          window.location.href = "/subscribe"; // Use direct navigation instead of wouter
        }
      };

      // Run the check
      checkSubscription();
    } else if (isLoaded && !isSignedIn) {
      console.log("Not signed in with Clerk, redirecting to login");
      // Not signed in, redirect to login
      window.location.href = "/login"; // Use direct navigation instead of wouter
    }
  }, [isSignedIn, user, isLoaded, setLocation, toast, isChecking]);

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

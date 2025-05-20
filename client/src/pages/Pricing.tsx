import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";

export default function Pricing() {
  const { isAuthenticated, isSubscribed } = useAuth();

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-muted">
      <AppHeader />
      <main className="flex-1 container max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Simple, Transparent Pricing</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get unlimited access to all ClipMaster features with our simple subscription plan.
          </p>
        </div>

        <div className="max-w-md mx-auto bg-card rounded-xl border shadow-lg overflow-hidden">
          <div className="bg-primary p-6 text-primary-foreground">
            <h2 className="text-2xl font-bold">Premium Plan</h2>
            <div className="mt-4 flex items-baseline">
              <span className="text-5xl font-bold">$9.99</span>
              <span className="ml-2 text-xl text-primary-foreground/90">/month</span>
            </div>
          </div>
          
          <div className="p-6">
            <ul className="space-y-4">
              <li className="flex items-start">
                <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Unlimited clip creation</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>HD quality clips</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Subtitles included</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Clip library management</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Easy sharing options</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Priority support</span>
              </li>
            </ul>

            <div className="mt-8">
              {!isAuthenticated ? (
                <Button asChild className="w-full">
                  <Link href="/login">Sign in to subscribe</Link>
                </Button>
              ) : isSubscribed ? (
                <Button disabled className="w-full bg-green-600 hover:bg-green-700">
                  You're subscribed!
                </Button>
              ) : (
                <Button asChild className="w-full">
                  <Link href="/subscribe">Subscribe Now</Link>
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground">
            Questions about our pricing? <Link href="/contact" className="text-primary hover:underline">Contact us</Link>
          </p>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
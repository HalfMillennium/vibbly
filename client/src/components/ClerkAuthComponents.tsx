import { SignIn, SignUp, useUser } from "@clerk/clerk-react";
import { Link, useLocation } from "wouter";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import AppHeader from "./AppHeader";
import AppFooter from "./AppFooter";

export function SignInPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-muted">
      <AppHeader />
      <main className="flex-1 flex justify-center items-center px-4 py-8">
        <div className="w-full max-w-md">
          <SignIn redirectUrl="/create" />
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
          <SignUp redirectUrl="/create" />
        </div>
      </main>
      <AppFooter />
    </div>
  );
}

export function SubscriptionCheckPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-muted">
      <AppHeader />
      <main className="flex-1 flex justify-center items-center px-4 py-8">
        <div className="w-full max-w-md text-center">
          <h1 className="text-2xl font-bold mb-4">
            Welcome!
          </h1>
          <p className="mt-4 text-muted-foreground mb-6">
            Please choose how you'd like to proceed.
          </p>
          <div className="space-y-4">
            <Button asChild className="w-full">
              <Link href="/subscribe">Get Subscription</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/create">Go to Create</Link>
            </Button>
          </div>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}

import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import NotFound from "@/pages/not-found";
import CreatePage from "@/pages/CreateClipPage";
import LandingPage from "@/pages/LandingPage";
import MyClipsPage from "@/pages/MyClipsPage";
import ProtectedRoute from "@/components/ProtectedRoute";
import { SignIn, useUser } from "@clerk/clerk-react";

function Router() {
  const { isSignedIn } = useUser();

  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/create">
        <ProtectedRoute fallback={
          <div className="flex items-center justify-center min-h-screen">
            <div className="w-full max-w-md">
              <SignIn 
                appearance={{
                  elements: {
                    rootBox: "mx-auto",
                    card: "bg-background border shadow-lg"
                  }
                }}
                signUpUrl="/create"
                redirectUrl="/create"
              />
            </div>
          </div>
        }>
          <CreatePage />
        </ProtectedRoute>
      </Route>
      <Route path="/my-clips">
        <ProtectedRoute fallback={
          <div className="flex items-center justify-center min-h-screen">
            <div className="w-full max-w-md">
              <SignIn 
                appearance={{
                  elements: {
                    rootBox: "mx-auto",
                    card: "bg-background border shadow-lg"
                  }
                }}
                signUpUrl="/my-clips"
                redirectUrl="/my-clips"
              />
            </div>
          </div>
        }>
          <MyClipsPage />
        </ProtectedRoute>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="clipcraft-theme">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;

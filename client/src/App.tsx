import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ClerkProvider } from "@/lib/clerk-provider";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Landing from "@/pages/Landing";
import { SignInPage, SignUpPage, SubscriptionCheckPage } from "@/components/ClerkAuthComponents";
import Subscribe from "@/pages/Subscribe";
import SubscriptionSuccess from "@/pages/SubscriptionSuccess";
import SubscriptionCancel from "@/pages/SubscriptionCancel";
import Pricing from "@/pages/Pricing";
import Features from "@/pages/Features";
import Contact from "@/pages/Contact";
import ClearAuth from "@/pages/ClearAuth";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/create">
        <ProtectedRoute requireSubscription={true}>
          <Home />
        </ProtectedRoute>
      </Route>
      <Route path="/login" component={SignInPage} />
      <Route path="/signup" component={SignUpPage} />
      {/* Subscription check without protected route to prevent loops */}
      <Route path="/subscription-check" component={SubscriptionCheckPage} />
      <Route path="/subscribe">
        {/* No protected route for subscription page to prevent loops */}
        <Subscribe />
      </Route>
      <Route path="/subscription/success">
        <ProtectedRoute requireSubscription={false}>
          <SubscriptionSuccess />
        </ProtectedRoute>
      </Route>
      <Route path="/subscription/cancel">
        <ProtectedRoute requireSubscription={false}>
          <SubscriptionCancel />
        </ProtectedRoute>
      </Route>
      {/* New pages */}
      <Route path="/pricing" component={Pricing} />
      <Route path="/features" component={Features} />
      <Route path="/contact" component={Contact} />
      {/* Debug route to clear auth state */}
      <Route path="/clear-auth" component={ClearAuth} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ClerkProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </AuthProvider>
      </ClerkProvider>
    </QueryClientProvider>
  );
}

export default App;

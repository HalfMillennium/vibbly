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
import ResetPassword from "@/pages/ResetPassword";
import SharedClip from "@/pages/SharedClip";
import Subscribe from "@/pages/Subscribe";
import SubscriptionSuccess from "@/pages/SubscriptionSuccess";
import SubscriptionCancel from "@/pages/SubscriptionCancel";

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
      <Route path="/subscription-check" component={SubscriptionCheckPage} />
      <Route path="/reset-password" component={ResetPassword} />
      <Route path="/subscribe">
        <ProtectedRoute requireSubscription={false}>
          <Subscribe />
        </ProtectedRoute>
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

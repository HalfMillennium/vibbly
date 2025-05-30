import { useEffect } from "react";
import { useClerk } from "@clerk/clerk-react";
import { useLocation } from "wouter";

export default function ClearAuth() {
  const { signOut } = useClerk();
  const [, setLocation] = useLocation();

  useEffect(() => {
    const clearAuthState = async () => {
      try {
        // Clear all browser storage
        localStorage.clear();
        sessionStorage.clear();
        
        // Sign out from Clerk
        await signOut();
        
        // Clear cookies (best effort)
        document.cookie.split(";").forEach(function(c) {
          document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });
        
        // Redirect to home
        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
      } catch (error) {
        console.error("Error clearing auth state:", error);
        // Force redirect anyway
        window.location.href = "/";
      }
    };

    clearAuthState();
  }, [signOut]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Clearing Authentication State</h1>
        <p className="text-muted-foreground">Please wait while we reset your session...</p>
        <div className="mt-4">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
        </div>
      </div>
    </div>
  );
}
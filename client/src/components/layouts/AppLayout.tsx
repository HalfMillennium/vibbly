import { ReactNode } from "react";
import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";

interface LandingPageLayoutProps {
  children: ReactNode;
}

export default function LandingPageLayout({ children }: LandingPageLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 text-gray-800 dark:text-gray-200 transition-colors">
      <AppHeader />
      
      <main className="flex-grow">
        {children}
      </main>
      
      <AppFooter />
    </div>
  );
}
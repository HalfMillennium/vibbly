import { ReactNode } from "react";
import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";

interface CreatePageLayoutProps {
  children: ReactNode;
}

export default function CreatePageLayout({ children }: CreatePageLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 text-gray-800 dark:text-gray-200 transition-colors">
      <AppHeader />
      
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-8 flex-grow">
        {children}
      </main>
      
      <AppFooter />
    </div>
  );
}
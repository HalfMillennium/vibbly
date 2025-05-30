import { Bookmark, User, Scissors } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";

export default function AppHeader() {
  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-10 border-b dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex items-center gap-1.5">
              <Scissors className="h-5 w-5 text-primary" />
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                <span className="text-primary">Clip</span>Craft
              </h1>
            </div>
            <span className="ml-2 text-xs bg-primary/10 text-primary rounded-full px-2 py-0.5 hidden sm:inline-block">
              Beta
            </span>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
            <Button 
              variant="ghost" 
              size="sm"
              className="text-gray-600 dark:text-gray-300 hover:text-primary hover:bg-primary/5 hidden sm:flex items-center gap-1.5"
              title="View Saved Clips"
            >
              <Bookmark className="h-4 w-4" />
              <span className="text-sm">My Clips</span>
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-600 dark:text-gray-300 hover:text-primary hover:bg-primary/5 sm:hidden"
              title="View Saved Clips"
            >
              <Bookmark className="h-4 w-4" />
            </Button>
            
            <ModeToggle />
            
            <Button 
              variant="outline"
              size="sm"
              className="flex items-center gap-1.5 text-sm bg-white dark:bg-gray-800 dark:text-white"
            >
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Sign in</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

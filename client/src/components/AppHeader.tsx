import { Bookmark, User, Scissors } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";

export default function AppHeader() {
  return (
    <header className="glass-nav sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex items-center gap-1.5">
              <Scissors className="h-5 w-5 text-primary" />
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                <span className="text-primary">Clip</span>Craft
              </h1>
            </div>
            <span className="ml-2 text-xs bg-primary/20 text-primary rounded-2xl px-3 py-1 hidden sm:inline-block backdrop-blur-sm">
              Beta
            </span>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
            <Button 
              variant="ghost" 
              size="sm"
              className="text-gray-600 dark:text-gray-300 hover:text-primary hover:bg-white/20 dark:hover:bg-white/10 rounded-2xl hidden sm:flex items-center gap-1.5 glass-button"
              title="View Saved Clips"
            >
              <Bookmark className="h-4 w-4" />
              <span className="text-sm">My Clips</span>
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-600 dark:text-gray-300 hover:text-primary hover:bg-white/20 dark:hover:bg-white/10 rounded-2xl sm:hidden glass-button"
              title="View Saved Clips"
            >
              <Bookmark className="h-4 w-4" />
            </Button>
            
            <ModeToggle />
            
            <Button 
              variant="outline"
              size="sm"
              className="flex items-center gap-1.5 text-sm glass-button rounded-2xl border-white/30 dark:border-white/20"
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

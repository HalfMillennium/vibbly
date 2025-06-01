import { Bookmark, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { Link, useLocation } from "wouter";
import vibblyLogo from "@assets/vibbly_logo.png";
import { useUser, SignInButton, UserButton } from "@clerk/clerk-react";

export default function AppHeader() {
  const [location] = useLocation();
  const isLandingPage = location === "/";
  const { isSignedIn, user } = useUser();

  return (
    <header className="glass-nav sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex items-center gap-3">
              <Link to="/">
                <button className=" transition-colors">
                  <img
                    src={vibblyLogo}
                    alt="Vibbly"
                    className="h-6 w-auto object-contain dark:invert"
                  />
                </button>
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {isSignedIn && (
              <>
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 dark:text-gray-300 hover:text-primary hover:bg-white/20 dark:hover:bg-white/10 rounded-2xl hidden sm:flex items-center gap-1.5 glass-button"
                  title="View Saved Clips"
                >
                  <Link to="/my-clips">
                    <Bookmark className="h-4 w-4" />
                    <span className="text-sm">My Clips</span>
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="ghost"
                  size="icon"
                  className="text-gray-600 dark:text-gray-300 hover:text-primary hover:bg-white/20 dark:hover:bg-white/10 rounded-2xl sm:hidden glass-button"
                  title="View Saved Clips"
                >
                  <Link to="/my-clips">
                    <Bookmark className="h-4 w-4" />
                  </Link>
                </Button>
              </>
            )}

            <ModeToggle />

            {isSignedIn ? (
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8",
                    userButtonPopoverCard: "bg-background border shadow-lg dark:bg-gray-800 dark:border-gray-700",
                    userButtonPopoverActions: "bg-background dark:bg-gray-800",
                    userButtonPopoverActionButton: "text-foreground hover:bg-muted dark:text-gray-200 dark:hover:bg-gray-700",
                    userButtonPopoverActionButtonText: "text-foreground dark:text-gray-200",
                    userButtonPopoverActionButtonIcon: "text-foreground dark:text-gray-200"
                  },
                  variables: {
                    colorPrimary: "hsl(var(--primary))",
                    colorBackground: "hsl(var(--background))",
                    colorText: "hsl(var(--foreground))",
                    colorTextSecondary: "hsl(var(--muted-foreground))",
                    colorInputBackground: "hsl(var(--input))",
                    colorInputText: "hsl(var(--foreground))",
                    borderRadius: "0.5rem"
                  }
                }}
                showName={false}
              />
            ) : (
              <SignInButton 
                mode="modal"
                appearance={{
                  elements: {
                    modalContent: "bg-background dark:bg-gray-800",
                    card: "bg-background dark:bg-gray-800 border dark:border-gray-700",
                    headerTitle: "text-foreground dark:text-gray-200",
                    headerSubtitle: "text-muted-foreground dark:text-gray-400",
                    socialButtonsBlockButton: "border dark:border-gray-600 text-foreground dark:text-gray-200 hover:bg-muted dark:hover:bg-gray-700",
                    dividerLine: "bg-border dark:bg-gray-600",
                    dividerText: "text-muted-foreground dark:text-gray-400",
                    formFieldInput: "bg-input dark:bg-gray-700 border dark:border-gray-600 text-foreground dark:text-gray-200",
                    formFieldLabel: "text-foreground dark:text-gray-200",
                    identityPreviewText: "text-foreground dark:text-gray-200",
                    formButtonPrimary: "bg-primary text-primary-foreground hover:bg-primary/90"
                  },
                  variables: {
                    colorPrimary: "hsl(var(--primary))",
                    colorBackground: "hsl(var(--background))",
                    colorText: "hsl(var(--foreground))",
                    colorTextSecondary: "hsl(var(--muted-foreground))",
                    colorInputBackground: "hsl(var(--input))",
                    colorInputText: "hsl(var(--foreground))",
                    borderRadius: "0.5rem"
                  }
                }}
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1.5 text-sm glass-button rounded-2xl border-white/30 dark:border-white/20"
                >
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">Sign in</span>
                </Button>
              </SignInButton>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

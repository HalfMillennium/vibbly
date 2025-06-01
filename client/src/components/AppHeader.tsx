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
                    userButtonPopoverCard: "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg",
                    userButtonPopoverHeader: "bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700",
                    userButtonPopoverMain: "bg-white dark:bg-gray-800",
                    userButtonPopoverFooter: "bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700",
                    userButtonPopoverActions: "bg-white dark:bg-gray-800",
                    userButtonPopoverActionButton: "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700",
                    userButtonPopoverActionButtonText: "text-gray-700 dark:text-gray-200",
                    userButtonPopoverActionButtonIcon: "text-gray-500 dark:text-gray-400",
                    userPreviewMainIdentifier: "text-gray-900 dark:text-gray-100",
                    userPreviewSecondaryIdentifier: "text-gray-600 dark:text-gray-400"
                  }
                }}
                showName={false}
              />
            ) : (
              <SignInButton 
                mode="modal"
                appearance={{
                  elements: {
                    modalContent: "bg-white dark:bg-gray-900",
                    modalCloseButton: "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200",
                    card: "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700",
                    cardBox: "bg-white dark:bg-gray-800",
                    header: "bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700",
                    headerTitle: "text-gray-900 dark:text-gray-100",
                    headerSubtitle: "text-gray-600 dark:text-gray-400",
                    main: "bg-white dark:bg-gray-800",
                    footer: "bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700",
                    footerActionText: "text-gray-600 dark:text-gray-400",
                    footerActionLink: "text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300",
                    socialButtonsBlockButton: "border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 bg-white dark:bg-gray-800",
                    socialButtonsBlockButtonText: "text-gray-700 dark:text-gray-200",
                    dividerLine: "bg-gray-200 dark:bg-gray-600",
                    dividerText: "text-gray-500 dark:text-gray-400",
                    formFieldInput: "bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100",
                    formFieldLabel: "text-gray-700 dark:text-gray-300",
                    formFieldWarningText: "text-red-600 dark:text-red-400",
                    identityPreviewText: "text-gray-900 dark:text-gray-100",
                    identityPreviewEditButton: "text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300",
                    formButtonPrimary: "bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-600 dark:hover:bg-blue-700",
                    formButtonReset: "text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
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

import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Play, Video } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import vibblyLogo from "@assets/vibbly_logo.png";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 transition-colors">
      {/* Navigation */}
      <nav className="glass-nav sticky top-0 z-50 py-4">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={vibblyLogo}
                alt="Vibbly"
                className="h-8 w-auto object-contain dark:invert"
              />
            </div>

            <div className="flex items-center space-x-4">
              <ModeToggle />
              <Button
                asChild
                className="bg-primary hover:bg-primary/90 text-white rounded-2xl px-6 py-2 glass-button"
              >
                <Link to="/create">Try it free</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 md:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="glass-card p-12 mb-16">
            <h1 className="text-5xl md:text-7xl font-bold gradient-text leading-tight mb-6">
              Create stunning
              <br />
              YouTube clips
            </h1>

            <p className="text-xl text-gray-700 dark:text-gray-200 mb-8 max-w-2xl mx-auto font-medium">
              Extract and share the best moments from YouTube videos with
              precision timing controls and seamless sharing.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                asChild
                size="lg"
                className="px-8 py-4 rounded-2xl text-lg w-full sm:w-auto border-0 soft-shadow"
              >
                <Link to="/create">
                  <Play className="h-5 w-5 mr-2" />
                  Start creating clips
                </Link>
              </Button>
            </div>
          </div>

          {/* Simple Feature Points */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Video className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-3 text-lg">
                Precise Timing
              </h3>
              <p className="text-gray-700 dark:text-gray-200">
                Set exact start and end times with intuitive timeline controls
              </p>
            </div>

            <div className="glass-card p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Play className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-3 text-lg">
                Instant Preview
              </h3>
              <p className="text-gray-700 dark:text-gray-200">
                Preview your clips before creating to ensure perfect timing
              </p>
            </div>

            <div className="glass-card p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-6">
                <div className="w-8 h-8 text-primary">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.50-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92S19.61 16.08 18 16.08z" />
                  </svg>
                </div>
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-3 text-lg">
                Easy Sharing
              </h3>
              <p className="text-gray-700 dark:text-gray-200">
                Generate shareable links for your clips instantly
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

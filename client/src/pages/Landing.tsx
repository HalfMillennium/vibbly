import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Scissors, Play } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-900 py-4 border-b dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Scissors className="h-5 w-5 text-primary" />
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                <span className="text-primary">Clip</span>Craft
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <ModeToggle />
              <Button asChild className="bg-primary hover:bg-primary/90 text-white rounded-full px-6 py-2">
                <Link to="/create">Try it free</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 md:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white leading-tight mb-6">
            Create stunning<br />
            YouTube clips
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Extract and share the best moments from YouTube videos with precision timing controls and seamless sharing.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-full text-lg w-full sm:w-auto">
              <Link to="/create">
                <Play className="h-5 w-5 mr-2" />
                Start creating clips
              </Link>
            </Button>
          </div>

          {/* Simple Feature Points */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Scissors className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Precise Timing</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Set exact start and end times with intuitive timeline controls</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Play className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Instant Preview</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Preview your clips before creating to ensure perfect timing</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-6 h-6 text-primary">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.50-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92S19.61 16.08 18 16.08z"/>
                  </svg>
                </div>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Easy Sharing</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Generate shareable links for your clips instantly</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
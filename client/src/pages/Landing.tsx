import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Scissors } from "lucide-react";
import appLogo from "../assets/vibbly_logo.png";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <img src={appLogo} alt="Vibbly Logo" className="h-6 w-auto" />
            </div>

            {/* Desktop navigation */}
            <div className="hidden md:flex items-center md:space-x-8 lg:space-x-16">
              <a
                href="#"
                className="text-gray-600 hover:text-gray-900 text-sm font-medium"
              >
                Features
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-gray-900 text-sm font-medium"
              >
                Pricing
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-gray-900 text-sm font-medium"
              >
                Reach Out
              </a>
            </div>

            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-700 text-sm font-medium hidden sm:inline-block"
              >
                Log in
              </Link>
              <Button
                asChild
                className="bg-primary hover:bg-primary/90 text-white rounded-full"
              >
                <Link to="/register">Sign up</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - simplified and more minimal */}
      <section className="py-20 md:py-32 flex flex-col items-center justify-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
            Create and share YouTube video clips in seconds
          </h1>
          
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            vibbly lets you easily create, customize, and share clips from any YouTube video with just a few clicks.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              asChild
              className="bg-primary hover:bg-primary/90 text-white px-8 py-5 rounded-full text-base w-full sm:w-auto"
            >
              <Link to="/signup">Get Started</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-100 px-8 py-5 rounded-full text-base w-full sm:w-auto mt-3 sm:mt-0"
            >
              <Link to="/login">Log in</Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Simple feature section */}
      <section className="pb-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 pt-10 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-8">
            How It Works
          </h2>
          
          <div className="flex flex-col md:flex-row justify-between gap-8 text-center">
            <div className="flex-1 p-6 rounded-lg">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-xl">1</span>
                </div>
              </div>
              <h3 className="text-xl font-medium mb-2">Paste YouTube Link</h3>
              <p className="text-gray-600">Simply paste any YouTube video URL to get started</p>
            </div>
            
            <div className="flex-1 p-6 rounded-lg">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-xl">2</span>
                </div>
              </div>
              <h3 className="text-xl font-medium mb-2">Select Timestamps</h3>
              <p className="text-gray-600">Choose the start and end times for your perfect clip</p>
            </div>
            
            <div className="flex-1 p-6 rounded-lg">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 text-xl">3</span>
                </div>
              </div>
              <h3 className="text-xl font-medium mb-2">Share Your Clip</h3>
              <p className="text-gray-600">Get a shareable link for your clip in seconds</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

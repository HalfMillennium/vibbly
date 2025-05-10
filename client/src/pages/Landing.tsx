import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Scissors } from "lucide-react";

// Import SVG assets
import businessManSvg from "../assets/business-man.svg";
import cafeTableSvg from "../assets/cafe-table.svg";
import rainyCafeSvg from "../assets/rainy-cafe.svg";
import sampleClip1Svg from "../assets/sample-clip-1.svg";
import sampleClip2Svg from "../assets/sample-clip-2.svg";
import sampleClip3Svg from "../assets/sample-clip-3.svg";
import sampleClip4Svg from "../assets/sample-clip-4.svg";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Scissors className="h-5 w-5 text-primary" />
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">
                <span className="text-primary">Clip</span>Craft
              </h1>
            </div>
            
            {/* Desktop navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <a href="#" className="text-gray-600 hover:text-gray-900 text-sm font-medium">Style library</a>
              <a href="#" className="text-gray-600 hover:text-gray-900 text-sm font-medium">Features</a>
              <a href="#" className="text-gray-600 hover:text-gray-900 text-sm font-medium">Who we serve</a>
              <a href="#" className="text-gray-600 hover:text-gray-900 text-sm font-medium">Pricing</a>
              <a href="#" className="text-gray-600 hover:text-gray-900 text-sm font-medium">Resources</a>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-gray-700 text-sm font-medium hidden sm:inline-block">Log in</Link>
              <Button asChild className="bg-primary hover:bg-primary/90 text-white rounded-full">
                <Link to="/register">Sign up</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
            Create <span className="inline-block align-middle mx-1 sm:mx-2">🎬</span> stunning,
            <br />
            brand-ready <span className="inline-block align-middle mx-1 sm:mx-2">✨</span> visuals
          </h1>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 mt-6 text-xs sm:text-sm text-gray-600">
            <span>• Maintain style consistency</span>
            <span>• Secure and private</span>
            <span>• Own full rights to any image</span>
          </div>
          
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild className="bg-primary hover:bg-primary/90 text-white px-6 sm:px-8 py-4 sm:py-6 rounded-full text-sm sm:text-base w-full sm:w-auto">
              <Link to="/register">Get Started</Link>
            </Button>
            <Button asChild variant="outline" className="bg-[#222] text-white hover:bg-[#333] border-0 px-6 sm:px-8 py-4 sm:py-6 rounded-full text-sm sm:text-base w-full sm:w-auto mt-3 sm:mt-0">
              <Link to="/login">Log in</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Tabs */}
      <section className="pb-16 md:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center md:space-x-8 mb-12 gap-3 md:gap-0">
            <button className="text-primary font-medium border-b-2 border-primary pb-2 text-sm sm:text-base">Create visuals</button>
            <button className="text-gray-600 hover:text-gray-900 pb-2 text-sm sm:text-base">Train style models</button>
            <button className="text-gray-600 hover:text-gray-900 pb-2 text-sm sm:text-base">Refine creations</button>
            <button className="text-gray-600 hover:text-gray-900 pb-2 text-sm sm:text-base">Own your models</button>
          </div>
          
          {/* Featured Content/Screenshot */}
          <div className="rounded-lg overflow-hidden shadow-lg border border-gray-200 bg-white">
            <div className="p-1">
              <div className="flex items-center gap-1.5 p-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <div className="flex-1 text-center text-xs text-gray-400">clipcraft.ai</div>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-4 p-3 sm:p-4">
                {/* First row - line drawings in the style of the screenshot */}
                <div className="aspect-square bg-gray-100 rounded-md p-2 sm:p-3 flex items-center justify-center overflow-hidden">
                  <img src={businessManSvg} alt="Business person with umbrella" className="w-full h-auto object-contain" />
                </div>
                <div className="aspect-square bg-gray-100 rounded-md p-2 sm:p-3 flex items-center justify-center overflow-hidden relative">
                  <img src={rainyCafeSvg} alt="Cafe on a rainy day" className="w-full h-auto object-contain" />
                  <div className="absolute bottom-1 left-1 right-1 text-center">
                    <span className="text-xs text-gray-500 italic hidden md:block">a vintage-style cafe on a rainy day</span>
                  </div>
                </div>
                <div className="aspect-square bg-gray-100 rounded-md p-2 sm:p-3 flex items-center justify-center overflow-hidden">
                  <img src={cafeTableSvg} alt="Cafe table" className="w-full h-auto object-contain" />
                </div>
                <div className="aspect-square bg-gray-100 rounded-md p-2 sm:p-3 flex items-center justify-center overflow-hidden relative">
                  <img src={rainyCafeSvg} alt="Additional rainy scene" className="w-full h-auto object-contain" />
                  <div className="absolute top-2 right-2 text-xs bg-gray-200 rounded-full h-5 w-5 flex items-center justify-center">
                    119
                  </div>
                </div>
                
                {/* Second row - colorful illustrations */}
                <div className="aspect-square bg-blue-50 rounded-md p-2 sm:p-3 flex items-center justify-center overflow-hidden">
                  <img src={sampleClip1Svg} alt="Sample clip" className="w-full h-auto object-contain" />
                </div>
                <div className="aspect-square bg-green-50 rounded-md p-2 sm:p-3 flex items-center justify-center overflow-hidden">
                  <img src={sampleClip2Svg} alt="Sample clip" className="w-full h-auto object-contain" />
                </div>
                <div className="aspect-square bg-yellow-50 rounded-md p-2 sm:p-3 flex items-center justify-center overflow-hidden">
                  <img src={sampleClip3Svg} alt="Sample clip" className="w-full h-auto object-contain" />
                </div>
                <div className="aspect-square bg-purple-50 rounded-md p-2 sm:p-3 flex items-center justify-center overflow-hidden">
                  <img src={sampleClip4Svg} alt="Sample clip" className="w-full h-auto object-contain" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Scissors } from "lucide-react";

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
            <div className="flex items-center space-x-4">
              <a href="#" className="text-gray-600 hover:text-gray-900 text-sm font-medium">Style library</a>
              <a href="#" className="text-gray-600 hover:text-gray-900 text-sm font-medium">Features</a>
              <a href="#" className="text-gray-600 hover:text-gray-900 text-sm font-medium">Who we serve</a>
              <a href="#" className="text-gray-600 hover:text-gray-900 text-sm font-medium">Pricing</a>
              <a href="#" className="text-gray-600 hover:text-gray-900 text-sm font-medium">Resources</a>
            </div>
            <div className="flex items-center space-x-4">
              <a href="#" className="text-gray-700 text-sm font-medium">Log in</a>
              <Button asChild className="bg-primary hover:bg-primary/90 text-white rounded-full">
                <a href="#">Start for free</a>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
            Create <span className="inline-block align-middle mx-2">🎬</span> stunning,
            <br />
            brand-ready <span className="inline-block align-middle mx-2">✨</span> visuals
          </h1>
          
          <div className="flex items-center justify-center gap-2 mt-6 text-sm text-gray-600">
            <span>• Maintain style consistency</span>
            <span>• Secure and private</span>
            <span>• Own full rights to any image</span>
          </div>
          
          <div className="mt-8 flex items-center justify-center gap-4">
            <Button asChild className="bg-primary hover:bg-primary/90 text-white px-8 py-6 rounded-full text-base">
              <Link to="/create">Start for free</Link>
            </Button>
            <Button variant="outline" className="bg-[#222] text-white hover:bg-[#333] border-0 px-8 py-6 rounded-full text-base">
              <a href="#">Book a demo</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Tabs */}
      <section className="pb-16 md:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center space-x-8 mb-12">
            <button className="text-primary font-medium border-b-2 border-primary pb-2">Create visuals</button>
            <button className="text-gray-600 hover:text-gray-900 pb-2">Train style models</button>
            <button className="text-gray-600 hover:text-gray-900 pb-2">Refine creations</button>
            <button className="text-gray-600 hover:text-gray-900 pb-2">Own your models</button>
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
              
              <div className="grid grid-cols-4 gap-4 p-4">
                {/* Sample visualization of video clip editing interface */}
                <div className="aspect-square bg-gray-100 rounded-md p-3 flex items-center justify-center overflow-hidden">
                  <img src="/sample-content-1.svg" alt="Video clip" className="w-full h-auto object-contain" />
                </div>
                <div className="aspect-square bg-gray-100 rounded-md p-3 flex items-center justify-center overflow-hidden">
                  <img src="/sample-content-2.svg" alt="Video clip" className="w-full h-auto object-contain" />
                </div>
                <div className="aspect-square bg-gray-100 rounded-md p-3 flex items-center justify-center overflow-hidden">
                  <img src="/sample-content-3.svg" alt="Video clip" className="w-full h-auto object-contain" />
                </div>
                <div className="aspect-square bg-gray-100 rounded-md p-3 flex items-center justify-center overflow-hidden">
                  <img src="/sample-content-4.svg" alt="Video clip" className="w-full h-auto object-contain" />
                </div>
                <div className="aspect-square bg-gray-100 rounded-md p-3 flex items-center justify-center overflow-hidden">
                  <img src="/sample-content-5.svg" alt="Video clip" className="w-full h-auto object-contain" />
                </div>
                <div className="aspect-square bg-gray-100 rounded-md p-3 flex items-center justify-center overflow-hidden">
                  <img src="/sample-content-6.svg" alt="Video clip" className="w-full h-auto object-contain" />
                </div>
                <div className="aspect-square bg-gray-100 rounded-md p-3 flex items-center justify-center overflow-hidden">
                  <img src="/sample-content-7.svg" alt="Video clip" className="w-full h-auto object-contain" />
                </div>
                <div className="aspect-square bg-gray-100 rounded-md p-3 flex items-center justify-center overflow-hidden">
                  <img src="/sample-content-8.svg" alt="Video clip" className="w-full h-auto object-contain" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
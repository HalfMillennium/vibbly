import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";

export default function Features() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-muted">
      <AppHeader />
      <main className="flex-1 container max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Features</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to create, manage, and share your YouTube clips with ease.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Precise Clip Creation</h3>
              <p className="text-muted-foreground">
                Create perfect clips with frame-precise controls. Set your start and end times with accuracy to capture exactly what you need.
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">One-Click Sharing</h3>
              <p className="text-muted-foreground">
                Share your clips instantly with a unique URL. Perfect for sending highlights to friends, colleagues, or posting on social media.
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Subtitle Support</h3>
              <p className="text-muted-foreground">
                Include or exclude subtitles in your clips. Make your content accessible and easy to understand for all viewers.
              </p>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Clip Library</h3>
              <p className="text-muted-foreground">
                Access all your clips in one organized library. Search, filter, and manage your clips with ease.
              </p>
            </div>
          </div>

          {/* Feature 5 */}
          <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Secure Storage</h3>
              <p className="text-muted-foreground">
                Your clips are stored securely in the cloud. Access them from anywhere, anytime, with peace of mind.
              </p>
            </div>
          </div>

          {/* Feature 6 */}
          <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Fast Performance</h3>
              <p className="text-muted-foreground">
                Experience lightning-fast clip creation and playback. Our optimized platform ensures a smooth experience.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-6">Ready to start creating amazing clips?</h2>
          <div className="flex justify-center gap-4 flex-wrap">
            <Button asChild size="lg">
              <Link href="/pricing">See Pricing</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/create">Try It Now</Link>
            </Button>
          </div>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
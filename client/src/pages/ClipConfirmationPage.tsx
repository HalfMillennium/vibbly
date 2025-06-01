import { useLocation, Link } from "wouter";
import { useEffect, useState, useRef, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink, Share2, CheckCircle, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import CreatePageLayout from "@/components/layouts/CreatePage";
import ConfettiGenerator from "confetti-js";

export default function ClipConfirmationPage() {
  const { toast } = useToast();
  const [location] = useLocation();
  const [shareId, setShareId] = useState<string | null>(null);
  const confettiRef = useRef<HTMLCanvasElement>(null);
  const searchParams = useMemo(
    () => new URLSearchParams(window.location.search),
    [location],
  );
  // Extract share ID from URL parameters
  useEffect(() => {
    setShareId(searchParams.get("shareId"));
  }, [location]);

  // Trigger confetti animation when shareId is available
  useEffect(() => {
    if (shareId && confettiRef.current) {
      const confettiSettings = {
        target: confettiRef.current,
        max: 80,
        size: 1,
        animate: true,
        props: ["circle", "square", "triangle"],
        colors: [
          [165, 104, 246],
          [139, 69, 19],
          [204, 204, 204],
          [80, 200, 120],
          [255, 69, 0],
        ],
        clock: 25,
        rotate: true,
        width: window.innerWidth,
        height: window.innerHeight,
        start_from_edge: false,
        respawn: false,
      };

      const confetti = new ConfettiGenerator(confettiSettings);
      confetti.render();

      // Stop confetti after 4 seconds
      setTimeout(() => {
        confetti.clear();
      }, 4000);

      return () => {
        confetti.clear();
      };
    }
  }, [shareId]);

  const clipUrl = shareId ? `${window.location.origin}/view/${shareId}` : "";

  const handleCopyLink = () => {
    if (clipUrl) {
      navigator.clipboard.writeText(clipUrl);
      toast({
        title: "Link copied!",
        description: "Clip URL has been copied to clipboard",
      });
    }
  };

  const handleOpenClip = () => {
    if (shareId) {
      window.open(`/view/${shareId}`, "_blank");
    }
  };

  if (!shareId) {
    return (
      <CreatePageLayout>
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="glass-card p-8 text-center">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Something went wrong
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              We couldn't find your clip. Please try creating it again.
            </p>
            <Button asChild>
              <Link to="/create">Create New Clip</Link>
            </Button>
          </div>
        </div>
      </CreatePageLayout>
    );
  }

  return (
    <CreatePageLayout>
      {/* Confetti Canvas */}
      <canvas
        ref={confettiRef}
        className="fixed inset-0 pointer-events-none z-50"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      />

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
        {/* Success Header */}
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto animate-bounce">
            <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
              Clip Created Successfully!
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Your clip is ready to share with the world
            </p>
          </div>
        </div>

        {/* Share URL Card */}
        <Card className="glass-card">
          <CardContent className="p-6 space-y-4">
            <div className="text-center">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Share Your Clip
              </h2>

              {/* URL Display */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border-2 border-dashed border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 text-sm font-mono text-gray-700 dark:text-gray-300 break-all">
                  <span className="flex-1">{clipUrl}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleCopyLink}
                className="flex-1"
                variant="outline"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Link
              </Button>

              <Button
                onClick={handleOpenClip}
                className="flex-1"
                variant="default"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Open Clip
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button asChild className="flex-1" variant="default">
            <Link to="/my-clips">View My Clips</Link>
          </Button>

          <Button asChild className="flex-1" variant="outline">
            <Link to="/create">Create Another Clip</Link>
          </Button>
        </div>
      </div>
    </CreatePageLayout>
  );
}

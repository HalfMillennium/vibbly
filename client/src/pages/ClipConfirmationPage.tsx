import { useEffect, useState } from "react";
import { useLocation, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Share2, ExternalLink, Copy, Play } from "lucide-react";
import { formatTime } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import CreatePageLayout from "@/components/layouts/CreatePage";

interface Clip {
  id: number;
  shareId: string;
  clipTitle: string;
  videoTitle: string;
  videoId: string;
  startTime: number;
  endTime: number;
  includeSubtitles: boolean;
  createdAt: string;
}

export default function ClipConfirmationPage() {
  const { toast } = useToast();
  const [location] = useLocation();
  const [clipId, setClipId] = useState<string | null>(null);

  // Extract clip ID from URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(location.split('?')[1] || '');
    const id = urlParams.get('id');
    setClipId(id);
  }, [location]);

  const { data: clip, isLoading } = useQuery<Clip>({
    queryKey: ['/api/clips', clipId],
    enabled: !!clipId,
  });

  const handleCopyLink = () => {
    if (clip) {
      const clipUrl = `${window.location.origin}/clip/${clip.shareId}`;
      navigator.clipboard.writeText(clipUrl);
      toast({
        title: "Link copied!",
        description: "Clip URL has been copied to clipboard",
      });
    }
  };

  const handleWatchOriginal = () => {
    if (clip) {
      window.open(`https://youtube.com/watch?v=${clip.videoId}&t=${clip.startTime}s`, '_blank');
    }
  };

  if (isLoading) {
    return (
      <CreatePageLayout>
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="glass-card p-8 text-center">
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
            </div>
          </div>
        </div>
      </CreatePageLayout>
    );
  }

  if (!clip) {
    return (
      <CreatePageLayout>
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="glass-card p-8 text-center">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Clip not found
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              The clip you're looking for doesn't exist or has been removed.
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
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Success Header */}
        <div className="glass-card p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Clip Created Successfully!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Your video clip has been created and is ready to share
          </p>
        </div>

        {/* Clip Details */}
        <Card className="glass-card">
          <div className="relative aspect-video overflow-hidden rounded-t-lg">
            <img
              src={`https://img.youtube.com/vi/${clip.videoId}/maxresdefault.jpg`}
              alt={clip.clipTitle}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 right-2">
              <Badge variant="secondary" className="text-xs">
                {formatTime(clip.endTime - clip.startTime)}
              </Badge>
            </div>
          </div>
          
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2 text-lg">
              {clip.clipTitle}
            </h3>
            
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              From: {clip.videoTitle}
            </p>
            
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-6">
              <span>{formatTime(clip.startTime)} - {formatTime(clip.endTime)}</span>
              {clip.includeSubtitles && (
                <Badge variant="outline" className="text-xs">CC</Badge>
              )}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Button 
                variant="outline" 
                onClick={handleCopyLink}
                className="flex items-center gap-2"
              >
                <Copy className="h-4 w-4" />
                Copy Link
              </Button>
              
              <Button 
                variant="outline" 
                onClick={handleWatchOriginal}
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                Watch Original
              </Button>
              
              <Button 
                asChild
                className="flex items-center gap-2"
              >
                <Link to="/my-clips">
                  <Play className="h-4 w-4" />
                  View All Clips
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild variant="outline" size="lg">
            <Link to="/create">Create Another Clip</Link>
          </Button>
          
          <Button asChild size="lg">
            <Link to="/my-clips">Go to My Clips</Link>
          </Button>
        </div>
      </div>
    </CreatePageLayout>
  );
}
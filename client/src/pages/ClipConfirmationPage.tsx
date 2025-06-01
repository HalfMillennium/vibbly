import { useQuery } from "@tanstack/react-query";
import { useLocation, Link } from "wouter";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, ExternalLink, Share2, Play, CheckCircle } from "lucide-react";
import { formatTime, formatDate } from "@/lib/utils";
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
  const [shareId, setShareId] = useState<string | null>(null);

  // Extract share ID from URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(location.split('?')[1] || '');
    const id = urlParams.get('shareId');
    setShareId(id);
  }, [location]);

  const { data: clip, isLoading, error } = useQuery<Clip>({
    queryKey: [`/api/clips/share/${shareId}`],
    enabled: !!shareId,
  });

  const handleCopyLink = () => {
    if (clip) {
      const clipUrl = `${window.location.origin}/view/${clip.shareId}`;
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
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto"></div>
            </div>
          </div>
        </div>
      </CreatePageLayout>
    );
  }

  if (error || !clip) {
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

  const clipDuration = clip.endTime - clip.startTime;

  return (
    <CreatePageLayout>
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        {/* Success Header */}
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Clip Created Successfully!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Your clip is ready to share with the world
          </p>
        </div>

        {/* Clip Details Card */}
        <Card className="glass-card overflow-hidden">
          <div className="relative aspect-video">
            <img
              src={`https://img.youtube.com/vi/${clip.videoId}/maxresdefault.jpg`}
              alt={clip.clipTitle}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <Link href={`/view/${clip.shareId}`}>
                <Button
                  size="lg"
                  className="bg-white/90 hover:bg-white text-black rounded-full px-6"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Watch Clip
                </Button>
              </Link>
            </div>
            <div className="absolute bottom-4 right-4">
              <Badge variant="secondary" className="bg-black/70 text-white">
                <Clock className="w-3 h-3 mr-1" />
                {formatTime(clipDuration)}
              </Badge>
            </div>
          </div>

          <CardContent className="p-6 space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {clip.clipTitle}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                from "{clip.videoTitle}"
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center py-4 border-t border-gray-200 dark:border-gray-700">
              <div className="space-y-1">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Duration
                </div>
                <div className="font-semibold text-gray-900 dark:text-gray-100">
                  {formatTime(clipDuration)}
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Start Time
                </div>
                <div className="font-semibold text-gray-900 dark:text-gray-100">
                  {formatTime(clip.startTime)}
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  End Time
                </div>
                <div className="font-semibold text-gray-900 dark:text-gray-100">
                  {formatTime(clip.endTime)}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                onClick={handleCopyLink}
                className="flex-1"
                variant="outline"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Copy Share Link
              </Button>
              
              <Button
                onClick={handleWatchOriginal}
                className="flex-1"
                variant="outline"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Watch Original
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild className="flex-1" variant="default">
                <Link to="/my-clips">
                  View My Clips
                </Link>
              </Button>
              
              <Button asChild className="flex-1" variant="outline">
                <Link to="/create">
                  Create Another Clip
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Created Date */}
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          Created on {formatDate(clip.createdAt)}
        </div>
      </div>
    </CreatePageLayout>
  );
}
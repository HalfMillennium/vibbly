import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Play, Pause, RotateCcw, Clock, ExternalLink } from "lucide-react";
import { formatTime } from "@/lib/utils";
import useYouTubePlayer from "@/hooks/useYouTubePlayer";

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

export default function ViewClipPage() {
  const [location] = useLocation();
  const [shareId, setShareId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loopEnabled, setLoopEnabled] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Extract share ID from URL path
  useEffect(() => {
    const pathSegments = location.split('/');
    const id = pathSegments[pathSegments.length - 1];
    setShareId(id);
  }, [location]);

  const { data: clip, isLoading, error } = useQuery<Clip>({
    queryKey: [`/api/clips/share/${shareId}`],
    enabled: !!shareId,
  });

  const { 
    player, 
    loadVideo, 
    play,
    pause,
    seekTo,
    getCurrentTime: getPlayerCurrentTime 
  } = useYouTubePlayer(containerRef);

  // Load video when clip data is available
  useEffect(() => {
    if (clip && loadVideo) {
      loadVideo(clip.videoId, () => {
        // Use a small delay to ensure player is ready
        setTimeout(() => {
          if (player) {
            player.seekTo(clip.startTime);
            setCurrentTime(clip.startTime);
          }
        }, 500);
      });
    }
  }, [clip, loadVideo]);

  // Monitor player state changes
  useEffect(() => {
    if (!player) return;

    const checkPlayerState = () => {
      try {
        const time = getPlayerCurrentTime();
        if (time !== currentTime) {
          setCurrentTime(time);
        }
      } catch (error) {
        // Player might not be ready yet
      }
    };

    const interval = setInterval(checkPlayerState, 100);
    return () => clearInterval(interval);
  }, [player, getPlayerCurrentTime]);

  // Handle clip boundary checking
  useEffect(() => {
    if (!player || !clip) return;

    const checkClipBounds = () => {
      const time = currentTime;
      
      if (time >= clip.endTime) {
        if (loopEnabled) {
          seekTo(clip.startTime);
          setCurrentTime(clip.startTime);
        } else {
          pause();
          setIsPlaying(false);
        }
      }
    };

    const interval = setInterval(checkClipBounds, 100);
    return () => clearInterval(interval);
  }, [player, clip, loopEnabled, currentTime, seekTo, pause]);

  const handlePlayPause = () => {
    if (!player || !clip) return;

    if (isPlaying) {
      pause();
      setIsPlaying(false);
    } else {
      // If we're at or past the end, restart from beginning
      if (currentTime >= clip.endTime || currentTime < clip.startTime) {
        seekTo(clip.startTime);
        setCurrentTime(clip.startTime);
      }
      play();
      setIsPlaying(true);
    }
  };

  const handleRestart = () => {
    if (!clip) return;
    seekTo(clip.startTime);
    setCurrentTime(clip.startTime);
    setIsPlaying(false);
  };

  const openOriginalVideo = () => {
    if (!clip) return;
    window.open(`https://youtube.com/watch?v=${clip.videoId}&t=${clip.startTime}s`, '_blank');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-purple-900/20 dark:to-indigo-900/30 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 dark:text-gray-300 text-lg font-medium">Loading clip...</p>
        </div>
      </div>
    );
  }

  if (error || !clip) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-purple-900/20 dark:to-indigo-900/30 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4 p-8 text-center backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-white/20">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Clip Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The clip you're looking for doesn't exist or may have been removed.
          </p>
          <Button 
            onClick={() => window.location.href = '/'}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            Go Home
          </Button>
        </Card>
      </div>
    );
  }

  const clipDuration = clip.endTime - clip.startTime;
  const progress = ((currentTime - clip.startTime) / clipDuration) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-purple-900/20 dark:to-indigo-900/30">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8 space-y-2">
          <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 animate-pulse">
            Shared Clip
          </Badge>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            {clip.clipTitle}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            from "{clip.videoTitle}"
          </p>
        </div>

        {/* Video Player */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="mb-8 video-container-wrapper">
            <div className="video-container" ref={containerRef}>
              <div
                id="youtube-player"
                className="w-full h-full bg-black"
                key="youtube-player-container"
              />

              {/* Clip Indicator Overlay */}
              {clip && (
                <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1.5 rounded-full text-xs flex items-center">
                  <Clock className="h-3 w-3 mr-1.5" />
                  <span className="font-medium">
                    {formatTime(clip.endTime - clip.startTime)}
                  </span>
                </div>
              )}

              {/* Custom Video Controls Overlay */}
              {clip && (
                <div className="video-controls">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={handlePlayPause}
                        className="text-white hover:text-primary transition"
                      >
                        {isPlaying ? (
                          <Pause className="h-5 w-5 sm:h-6 sm:w-6" />
                        ) : (
                          <Play className="h-5 w-5 sm:h-6 sm:w-6" />
                        )}
                      </button>

                      <div className="text-xs sm:text-sm font-medium">
                        <span>{formatTime(currentTime)}</span>
                        <span className="mx-1">/</span>
                        <span>{formatTime(clip.endTime)}</span>
                      </div>
                    </div>

                    <button
                      onClick={openOriginalVideo}
                      className="text-white hover:text-primary transition"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Video Progress Bar */}
                  <div className="w-full h-1.5 bg-gray-600/50 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-100"
                      style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="max-w-2xl mx-auto">
          <Card className="p-6 backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-white/20 shadow-xl">
            <div className="space-y-6">
              {/* Loop Toggle */}
              <div className="flex items-center justify-center space-x-3">
                <Switch
                  id="loop-toggle"
                  checked={loopEnabled}
                  onCheckedChange={setLoopEnabled}
                />
                <Label htmlFor="loop-toggle" className="text-sm font-medium">
                  Loop clip
                </Label>
              </div>

              {/* Secondary Actions */}
              <div className="flex items-center justify-center gap-3">
                <Button
                  onClick={handleRestart}
                  variant="outline"
                  size="sm"
                  className="glass-button border-white/30 dark:border-white/20"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Restart
                </Button>

                <Button
                  onClick={openOriginalVideo}
                  variant="outline"
                  size="sm"
                  className="glass-button border-white/30 dark:border-white/20"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Watch on YouTube
                </Button>
              </div>

              {/* Clip Info */}
              <div className="grid grid-cols-3 gap-4 text-center pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="space-y-1">
                  <div className="flex items-center justify-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                    <Clock className="w-4 h-4" />
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
            </div>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Create your own clips at{" "}
            <a 
              href="/" 
              className="text-purple-600 dark:text-purple-400 hover:underline font-medium"
            >
              Vibbly
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, X } from "lucide-react";
import { formatTime } from "@/lib/utils";

interface ClipPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoId: string;
  startTime: number;
  endTime: number;
  clipTitle: string;
  loopClip: boolean;
}

// Use the existing YouTube types from the hook
interface YouTubePlayer {
  playVideo: () => void;
  pauseVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead?: boolean) => void;
  getCurrentTime: () => number;
  destroy: () => void;
}

export default function ClipPreviewModal({
  isOpen,
  onClose,
  videoId,
  startTime,
  endTime,
  clipTitle,
  loopClip,
}: ClipPreviewModalProps) {
  const playerRef = useRef<any>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(startTime);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize YouTube player when modal opens
  useEffect(() => {
    if (!isOpen || !window.YT || !videoId) return;

    const initPlayer = () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }

      playerRef.current = new window.YT.Player('preview-player', {
        videoId,
        playerVars: {
          autoplay: 0,
          controls: 0,
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
          iv_load_policy: 3,
          cc_load_policy: 0,
        } as any,
        events: {
          onReady: (event: any) => {
            event.target.seekTo(startTime, true);
            setCurrentTime(startTime);
          },
          onStateChange: (event: any) => {
            if (event.data === window.YT.PlayerState.PLAYING) {
              setIsPlaying(true);
              startTimeTracking();
            } else {
              setIsPlaying(false);
              stopTimeTracking();
            }
          },
        },
      });
    };

    // Small delay to ensure DOM is ready
    setTimeout(initPlayer, 100);

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
      stopTimeTracking();
    };
  }, [isOpen, videoId, startTime, endTime]);

  // Time tracking and loop functionality
  const startTimeTracking = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    
    intervalRef.current = setInterval(() => {
      if (playerRef.current) {
        const current = playerRef.current.getCurrentTime();
        setCurrentTime(current);
        
        // Handle loop and end time
        if (current >= endTime) {
          if (loopClip) {
            playerRef.current.seekTo(startTime, true);
            setCurrentTime(startTime);
          } else {
            playerRef.current.pauseVideo();
            setIsPlaying(false);
          }
        }
      }
    }, 100);
  };

  const stopTimeTracking = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const handlePlayPause = () => {
    if (!playerRef.current) return;
    
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      // Ensure we're in the clip range
      if (currentTime < startTime || currentTime >= endTime) {
        playerRef.current.seekTo(startTime, true);
        setCurrentTime(startTime);
      }
      playerRef.current.playVideo();
    }
  };

  const handleReset = () => {
    if (!playerRef.current) return;
    
    playerRef.current.seekTo(startTime, true);
    setCurrentTime(startTime);
    if (isPlaying) {
      playerRef.current.playVideo();
    }
  };

  const handleClose = () => {
    if (playerRef.current) {
      playerRef.current.pauseVideo();
    }
    setIsPlaying(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl w-full p-0 bg-black border-0">
        <div className="relative">
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Video player */}
          <div className="aspect-video w-full bg-black">
            <div id="preview-player" className="w-full h-full" />
          </div>

          {/* Controls overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handlePlayPause}
                  className="text-white hover:text-white hover:bg-white/20 rounded-full p-2"
                >
                  {isPlaying ? (
                    <Pause className="h-5 w-5" />
                  ) : (
                    <Play className="h-5 w-5" />
                  )}
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleReset}
                  className="text-white hover:text-white hover:bg-white/20 rounded-full p-2"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>

                <div className="text-sm">
                  {formatTime(currentTime)} / {formatTime(endTime - startTime)}
                </div>
              </div>

              <div className="text-sm opacity-80">
                {clipTitle || "Video Clip Preview"}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
import { useEffect, useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX, Expand, Clock } from "lucide-react";
import useYouTubePlayer from "@/hooks/useYouTubePlayer";
import { formatTime } from "@/lib/utils";

interface VideoPlayerProps {
  videoId: string;
  startTime: number;
  endTime: number;
  loopClip: boolean;
  onVideoTitleChange: (title: string) => void;
  onVideoDurationChange: (duration: number) => void;
}

export default function VideoPlayer({
  videoId,
  startTime,
  endTime,
  loopClip,
  onVideoTitleChange,
  onVideoDurationChange,
}: VideoPlayerProps) {
  const playerRef = useRef<HTMLDivElement>(null);
  const [playerReady, setPlayerReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [progress, setProgress] = useState(0);

  const { 
    player,
    loadVideo,
    play,
    pause,
    seekTo,
    mute,
    unMute,
    getDuration,
    getCurrentTime,
    getVideoData,
  } = useYouTubePlayer(playerRef);

  useEffect(() => {
    if (player && playerReady) {
      // Get video title and duration
      const videoData = getVideoData();
      if (videoData?.title) {
        onVideoTitleChange(videoData.title);
      }
      
      const duration = getDuration();
      if (duration) {
        onVideoDurationChange(duration);
      }

      // Set up interval to update current time and progress
      const interval = setInterval(() => {
        const time = getCurrentTime();
        setCurrentTime(time);
        setProgress((time / getDuration()) * 100);

        // Handle clip looping
        if (endTime > 0 && time >= endTime) {
          if (loopClip) {
            seekTo(startTime);
          } else {
            pause();
            setIsPlaying(false);
          }
        }
      }, 200);

      return () => clearInterval(interval);
    }
  }, [player, playerReady, endTime, startTime, loopClip]);

  // Load video when videoId changes
  useEffect(() => {
    if (videoId) {
      loadVideo(videoId, () => {
        setPlayerReady(true);
      });
    }
  }, [videoId, loadVideo]);

  const handleTogglePlay = () => {
    if (isPlaying) {
      pause();
      setIsPlaying(false);
    } else {
      play();
      setIsPlaying(true);
    }
  };

  const handleToggleMute = () => {
    if (isMuted) {
      unMute();
      setIsMuted(false);
    } else {
      mute();
      setIsMuted(true);
    }
  };

  const handleToggleFullscreen = () => {
    if (playerRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        playerRef.current.requestFullscreen();
      }
    }
  };

  const totalDuration = getDuration();

  return (
    <div className="mb-8">
      <div className="bg-dark-bg rounded-lg overflow-hidden shadow-lg relative aspect-video" ref={playerRef}>
        <div id="youtube-player" className="w-full h-full bg-black"></div>
        
        {/* Custom Video Controls Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-3">
              <button 
                onClick={handleTogglePlay} 
                className="text-white hover:text-blue-400"
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </button>
              
              <button 
                onClick={handleToggleMute} 
                className="text-white hover:text-blue-400"
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </button>
              
              <div className="text-sm font-medium">
                <span>{formatTime(currentTime)}</span>
                <span> / </span>
                <span>{formatTime(totalDuration)}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button 
                onClick={handleToggleFullscreen} 
                className="text-white hover:text-blue-400"
              >
                <Expand className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          {/* Video Progress Bar */}
          <div className="w-full h-1 bg-gray-600 rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full bg-blue-500" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}

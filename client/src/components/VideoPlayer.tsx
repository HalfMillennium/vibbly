import { useEffect, useRef, useState } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Expand,
  Clock,
  Scissors,
} from "lucide-react";
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
    <div className="mb-8 video-container-wrapper">
      <div className="video-container" ref={playerRef}>
        {/* This is the container for the YouTube iframe */}
        <div
          id="youtube-player"
          className="w-full h-full bg-black"
          key="youtube-player-container"
        ></div>

        {/* Clip Indicator Overlay */}
        {playerReady && startTime > 0 && endTime > 0 && (
          <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1.5 rounded-full text-xs flex items-center">
            <Scissors className="h-3 w-3 mr-1.5" />
            <span className="font-medium">
              {formatTime(endTime - startTime)}
            </span>
          </div>
        )}

        {/* Custom Video Controls Overlay - Only show when player is ready */}
        {playerReady && (
          <div className="video-controls">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleTogglePlay}
                  className="text-white hover:text-primary transition"
                >
                  {isPlaying ? (
                    <Pause className="h-5 w-5 sm:h-6 sm:w-6" />
                  ) : (
                    <Play className="h-5 w-5 sm:h-6 sm:w-6" />
                  )}
                </button>

                <button
                  onClick={handleToggleMute}
                  className="text-white hover:text-primary transition hidden sm:block"
                >
                  {isMuted ? (
                    <VolumeX className="h-5 w-5" />
                  ) : (
                    <Volume2 className="h-5 w-5" />
                  )}
                </button>

                <div className="text-xs sm:text-sm font-medium">
                  <span>{formatTime(currentTime)}</span>
                  <span className="mx-1">/</span>
                  <span>{formatTime(totalDuration)}</span>
                </div>
              </div>

              <button
                onClick={handleToggleFullscreen}
                className="text-white hover:text-primary transition"
              >
                <Expand className="h-5 w-5" />
              </button>
            </div>

            {/* Video Progress Bar */}
            <div
              className="w-full h-1.5 bg-gray-600/50 rounded-full overflow-hidden cursor-pointer"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const position = (e.clientX - rect.left) / rect.width;
                const newTime = position * getDuration();
                seekTo(newTime);
              }}
            >
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

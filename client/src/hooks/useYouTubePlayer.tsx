import { useCallback, useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    YT: {
      Player: new (
        elementId: string,
        options: {
          videoId: string;
          playerVars?: {
            autoplay?: number;
            controls?: number;
            rel?: number;
            showinfo?: number;
            mute?: number;
            modestbranding?: number;
            cc_load_policy?: number;
            iv_load_policy?: number;
            enablejsapi?: number;
          };
          events?: {
            onReady?: (event: any) => void;
            onStateChange?: (event: any) => void;
            onError?: (event: any) => void;
          };
        }
      ) => YouTubePlayer;
      PlayerState: {
        ENDED: number;
        PLAYING: number;
        PAUSED: number;
        BUFFERING: number;
        CUED: number;
      };
    };
    onYouTubeIframeAPIReady: () => void;
  }
}

interface YouTubePlayer {
  playVideo: () => void;
  pauseVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead?: boolean) => void;
  mute: () => void;
  unMute: () => void;
  getDuration: () => number;
  getCurrentTime: () => number;
  getVideoData: () => { title: string; video_id: string; author: string };
  destroy: () => void;
}

const useYouTubePlayer = (containerRef: React.RefObject<HTMLDivElement>) => {
  const [apiLoaded, setApiLoaded] = useState(false);
  const playerRef = useRef<YouTubePlayer | null>(null);

  // Load YouTube API
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
        setApiLoaded(true);
      };
    } else {
      setApiLoaded(true);
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, []);

  // Load video
  const loadVideo = useCallback((videoId: string, onReady?: () => void) => {
    if (!apiLoaded) return;

    // Destroy existing player if there is one
    if (playerRef.current) {
      playerRef.current.destroy();
      playerRef.current = null;
    }

    if (!containerRef.current) return;

    const playerDiv = document.createElement("div");
    playerDiv.id = "youtube-player";
    playerDiv.style.width = "100%";
    playerDiv.style.height = "100%";

    // Clear the container and add the new player div
    while (containerRef.current.firstChild) {
      containerRef.current.removeChild(containerRef.current.firstChild);
    }
    containerRef.current.appendChild(playerDiv);

    playerRef.current = new window.YT.Player("youtube-player", {
      videoId,
      playerVars: {
        autoplay: 0,
        controls: 0, // Hide default controls
        rel: 0,
        showinfo: 0,
        mute: 0,
        modestbranding: 1,
        cc_load_policy: 0, // Hide closed captions
        iv_load_policy: 3, // Hide annotations
        enablejsapi: 1, // Enable API
      },
      events: {
        onReady: () => {
          if (onReady) onReady();
        },
        onError: (event) => {
          console.error("YouTube Player Error:", event);
        },
      },
    });
  }, [apiLoaded, containerRef]);

  const play = useCallback(() => {
    if (playerRef.current) {
      playerRef.current.playVideo();
    }
  }, []);

  const pause = useCallback(() => {
    if (playerRef.current) {
      playerRef.current.pauseVideo();
    }
  }, []);

  const seekTo = useCallback((seconds: number, allowSeekAhead = true) => {
    if (playerRef.current) {
      playerRef.current.seekTo(seconds, allowSeekAhead);
    }
  }, []);

  const mute = useCallback(() => {
    if (playerRef.current) {
      playerRef.current.mute();
    }
  }, []);

  const unMute = useCallback(() => {
    if (playerRef.current) {
      playerRef.current.unMute();
    }
  }, []);

  const getDuration = useCallback(() => {
    if (playerRef.current) {
      return playerRef.current.getDuration() || 0;
    }
    return 0;
  }, []);

  const getCurrentTime = useCallback(() => {
    if (playerRef.current) {
      return playerRef.current.getCurrentTime() || 0;
    }
    return 0;
  }, []);

  const getVideoData = useCallback(() => {
    if (playerRef.current) {
      try {
        return playerRef.current.getVideoData();
      } catch (error) {
        console.error("Error getting video data:", error);
        return { title: "", video_id: "", author: "" };
      }
    }
    return { title: "", video_id: "", author: "" };
  }, []);

  return {
    player: playerRef.current,
    loadVideo,
    play,
    pause,
    seekTo,
    mute,
    unMute,
    getDuration,
    getCurrentTime,
    getVideoData,
  };
};

export default useYouTubePlayer;

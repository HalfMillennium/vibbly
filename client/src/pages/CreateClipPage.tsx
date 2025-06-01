import { useState, useRef } from "react";
import { useLocation } from "wouter";
import CreatePageLayout from "@/components/layouts/CreatePage";
import VideoInputForm from "@/components/VideoInputForm";
import VideoPlayer from "@/components/VideoPlayer";
import ClipControls from "@/components/ClipControls";
import ClipInfo from "@/components/ClipInfo";
import ClipPreviewModal from "@/components/ClipPreviewModal";
import { useToast } from "@/hooks/use-toast";
import useYouTubePlayer from "@/hooks/useYouTubePlayer";

export default function CreateClipPage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [videoId, setVideoId] = useState<string | null>(null);
  const [videoTitle, setVideoTitle] = useState<string>("");
  const [videoDuration, setVideoDuration] = useState<number>(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [endTime, setEndTime] = useState<number>(0);
  const [clipTitle, setClipTitle] = useState<string>("");
  const [includeSubtitles, setIncludeSubtitles] = useState<boolean>(false);
  const [loopClip, setLoopClip] = useState<boolean>(false);
  const [clipCreated, setClipCreated] = useState<boolean>(false);
  const [clipId, setClipId] = useState<string | null>(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState<boolean>(false);
  const [isCreating, setIsCreating] = useState<boolean>(false);

  // Reference to video player container
  const videoPlayerRef = useRef<HTMLDivElement>(null);

  // YouTube player functions
  const { seekTo, play } = useYouTubePlayer(videoPlayerRef);

  const handleUrlSubmit = (url: string) => {
    // Extract video ID from YouTube URL
    const regExp =
      /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    const id = match && match[7].length === 11 ? match[7] : null;

    if (id) {
      setVideoUrl(url);
      setVideoId(id);
      setStartTime(0);
      // Reset end time to avoid issues with new video
      setEndTime(0);
      setClipCreated(false);
      setClipId(null);
    } else {
      toast({
        title: "Invalid YouTube URL",
        description: "Please enter a valid YouTube video URL",
        variant: "destructive",
      });
    }
  };

  const handleCreateClip = async () => {
    if (!videoId || startTime >= endTime) {
      toast({
        title: "Invalid clip selection",
        description: "Please select a valid start and end time",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);

    try {
      const response = await fetch("/api/clips", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          videoId,
          videoTitle,
          startTime,
          endTime,
          clipTitle: clipTitle || videoTitle,
          includeSubtitles,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Redirect to confirmation page with clip ID
        setLocation(`/clip-created?id=${data.id}`);
      } else {
        throw new Error("Failed to create clip");
      }
    } catch (error) {
      toast({
        title: "Error creating clip",
        description:
          "There was a problem creating your clip. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleCopyLink = () => {
    if (clipId) {
      const clipUrl = `${window.location.origin}?clip=${clipId}`;
      navigator.clipboard.writeText(clipUrl);
      toast({
        title: "Link copied!",
        description: "Clip URL has been copied to clipboard",
      });
    }
  };

  // Function to preview the clip
  const handlePreviewClip = () => {
    if (startTime >= 0 && endTime > startTime && videoId) {
      setIsPreviewModalOpen(true);
    } else {
      toast({
        title: "Invalid clip selection",
        description: "Please select a valid start and end time",
        variant: "destructive",
      });
    }
  };

  return (
    <CreatePageLayout>
        <VideoInputForm onSubmit={handleUrlSubmit} />

        {videoId && (
          <div className="space-y-6 sm:space-y-8">
            <div ref={videoPlayerRef}>
              <VideoPlayer
                videoId={videoId}
                startTime={startTime}
                endTime={endTime}
                loopClip={loopClip}
                onVideoTitleChange={setVideoTitle}
                onVideoDurationChange={setVideoDuration}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              <div className="md:col-span-2 order-2 md:order-1">
                <ClipControls
                  videoDuration={videoDuration}
                  startTime={startTime}
                  endTime={endTime}
                  onStartTimeChange={setStartTime}
                  onEndTimeChange={setEndTime}
                  clipTitle={clipTitle}
                  onClipTitleChange={setClipTitle}
                  includeSubtitles={includeSubtitles}
                  onIncludeSubtitlesChange={setIncludeSubtitles}
                  loopClip={loopClip}
                  onLoopClipChange={setLoopClip}
                  onPreviewClip={handlePreviewClip}
                />
              </div>

              <div className="order-1 md:order-2">
                <ClipInfo
                  videoTitle={videoTitle}
                  startTime={startTime}
                  endTime={endTime}
                  onCreateClip={handleCreateClip}
                  clipCreated={clipCreated}
                  isCreating={isCreating}
                  onCopyLink={handleCopyLink}
                />
              </div>
            </div>
          </div>
        )}

        {/* Clip Preview Modal */}
        {videoId && (
          <ClipPreviewModal
            isOpen={isPreviewModalOpen}
            onClose={() => setIsPreviewModalOpen(false)}
            videoId={videoId}
            startTime={startTime}
            endTime={endTime}
            clipTitle={clipTitle || videoTitle}
            loopClip={loopClip}
          />
        )}
    </CreatePageLayout>
  );
}

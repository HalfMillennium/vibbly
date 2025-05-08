import { useState } from "react";
import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";
import VideoInputForm from "@/components/VideoInputForm";
import VideoPlayer from "@/components/VideoPlayer";
import ClipControls from "@/components/ClipControls";
import ClipInfo from "@/components/ClipInfo";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const { toast } = useToast();
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

  const handleUrlSubmit = (url: string) => {
    // Extract video ID from YouTube URL
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    const id = (match && match[7].length === 11) ? match[7] : null;
    
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
        variant: "destructive"
      });
    }
  };

  const handleCreateClip = async () => {
    if (!videoId || startTime >= endTime) {
      toast({
        title: "Invalid clip selection",
        description: "Please select a valid start and end time",
        variant: "destructive"
      });
      return;
    }

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
        setClipId(data.id);
        setClipCreated(true);
        toast({
          title: "Success!",
          description: "Your clip was created successfully.",
        });
      } else {
        throw new Error("Failed to create clip");
      }
    } catch (error) {
      toast({
        title: "Error creating clip",
        description: "There was a problem creating your clip. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleCopyLink = () => {
    if (clipId) {
      const clipUrl = `${window.location.origin}?clip=${clipId}`;
      navigator.clipboard.writeText(clipUrl);
      toast({
        title: "Link copied!",
        description: "Clip URL has been copied to clipboard"
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
      <AppHeader />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        <VideoInputForm onSubmit={handleUrlSubmit} />
        
        {videoId && (
          <>
            <VideoPlayer 
              videoId={videoId} 
              startTime={startTime}
              endTime={endTime}
              loopClip={loopClip}
              onVideoTitleChange={setVideoTitle}
              onVideoDurationChange={setVideoDuration}
            />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
              <div className="lg:col-span-2">
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
                />
              </div>
              
              <ClipInfo 
                videoTitle={videoTitle}
                startTime={startTime}
                endTime={endTime}
                onCreateClip={handleCreateClip}
                clipCreated={clipCreated}
                onCopyLink={handleCopyLink}
              />
            </div>
          </>
        )}
      </main>
      
      <AppFooter />
    </div>
  );
}

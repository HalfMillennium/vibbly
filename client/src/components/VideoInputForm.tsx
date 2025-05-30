import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Scissors } from "lucide-react";

interface VideoInputFormProps {
  onSubmit: (url: string) => void;
}

export default function VideoInputForm({ onSubmit }: VideoInputFormProps) {
  const [videoUrl, setVideoUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(videoUrl);
  };

  return (
    <div className="mb-8">
      <div className="text-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold gradient-text">Create video clip</h1>
      </div>
      
      <div className="glass-card p-6 md:p-8 mb-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="video-url" className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-3">
              YouTube Video URL
            </Label>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-0">
              <Input
                id="video-url"
                type="text"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="flex-1 glass-input sm:rounded-r-none focus-visible:ring-primary border-white/30 dark:border-white/20"
                placeholder="https://www.youtube.com/watch?v=..."
              />
              <Button 
                type="submit" 
                className="sm:rounded-l-none rounded-2xl bg-primary hover:bg-primary/90 px-6 py-3 soft-shadow"
              >
                <Scissors className="h-4 w-4 mr-2" />
                <span>Create Clip</span>
              </Button>
            </div>
            <p className="mt-3 text-xs text-gray-600 dark:text-gray-300">
              Paste a valid YouTube URL to load the video
            </p>
          </div>
        </form>
      </div>
      
      {/* Info alert with glassmorphism */}
      <div className="glass-card p-6 flex items-start gap-4">
        <div className="shrink-0 bg-gradient-to-br from-amber-200 to-amber-300 rounded-2xl p-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-amber-700">
            <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="text-sm text-gray-700 dark:text-gray-200 font-medium">
          <p>Create clips from any YouTube video. The clips remain private until you share them.</p>
        </div>
      </div>
    </div>
  );
}

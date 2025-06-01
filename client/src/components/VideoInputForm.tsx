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
    <div className="flex flex-col gap-6">
      <div className="text-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold gradient-text">
          Create video clip
        </h1>
      </div>
      {/* Info alert */}
      <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex items-start gap-3">
        <div className="shrink-0 mt-0.5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-4 h-4 text-gray-500 dark:text-gray-400"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-300">
          <p>
            Create clips from any YouTube video. The clips remain private until
            you share them.
          </p>
        </div>
      </div>
      <div className="glass-card p-6 md:p-8 mb-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label
              htmlFor="video-url"
              className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-3"
            >
              YouTube Video URL
            </Label>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-0 sm:focus-within:ring-2 sm:focus-within:ring-ring sm:focus-within:ring-offset-2 sm:rounded-2xl">
              <Input
                id="video-url"
                type="text"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="flex-1 glass-input sm:rounded-r-none focus-visible:ring-0 focus-visible:ring-offset-0 sm:focus-visible:ring-0 border-white/30 dark:border-white/20"
                placeholder="https://www.youtube.com/watch?v=..."
              />
              <Button
                type="submit"
                className="sm:rounded-l-none rounded-2xl px-6 py-3 soft-shadow focus-visible:ring-0 focus-visible:ring-offset-0 sm:focus-visible:ring-0"
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
    </div>
  );
}

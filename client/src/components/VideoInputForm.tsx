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
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Create video clip</h1>
      </div>
      
      <Card className="bg-white rounded-lg shadow-sm border border-gray-100 mb-6">
        <CardContent className="p-4 md:p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="video-url" className="block text-sm font-medium text-gray-700 mb-2">
                YouTube Video URL
              </Label>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-0">
                <Input
                  id="video-url"
                  type="text"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="flex-1 sm:rounded-r-none focus-visible:ring-primary"
                  placeholder="https://www.youtube.com/watch?v=..."
                />
                <Button 
                  type="submit" 
                  className="sm:rounded-l-none bg-primary hover:bg-primary/90"
                >
                  <Scissors className="h-4 w-4 mr-2" />
                  <span>Create Clip</span>
                </Button>
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Paste a valid YouTube URL to load the video
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
      
      {/* Info alert - similar to the one in the reference design */}
      <div className="bg-gray-50 border border-gray-100 rounded-lg p-4 mb-6 flex items-start gap-3">
        <div className="shrink-0 bg-amber-100 rounded-full p-1">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-amber-600">
            <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="text-sm text-gray-600">
          <p>Create clips from any YouTube video. The clips remain private until you share them.</p>
        </div>
      </div>
    </div>
  );
}

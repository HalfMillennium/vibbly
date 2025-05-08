import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight } from "lucide-react";

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
    <Card className="bg-white rounded-lg shadow-sm p-6 mb-8">
      <CardContent className="p-0">
        <h2 className="text-lg font-semibold mb-4">Create a New Clip</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="video-url" className="block text-sm font-medium text-gray-700 mb-1">
              YouTube Video URL
            </Label>
            <div className="flex">
              <Input
                id="video-url"
                type="text"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="flex-1 rounded-r-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://www.youtube.com/watch?v=..."
              />
              <Button 
                type="submit" 
                className="rounded-l-none bg-blue-600 hover:bg-blue-700"
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Paste a valid YouTube URL to load the video
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

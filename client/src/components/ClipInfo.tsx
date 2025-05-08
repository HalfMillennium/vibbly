import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatTime } from "@/lib/utils";
import { Scissors, Link, Download, Twitter, Facebook, Mail } from "lucide-react";

interface ClipInfoProps {
  videoTitle: string;
  startTime: number;
  endTime: number;
  clipCreated: boolean;
  onCreateClip: () => void;
  onCopyLink: () => void;
}

export default function ClipInfo({
  videoTitle,
  startTime,
  endTime,
  clipCreated,
  onCreateClip,
  onCopyLink,
}: ClipInfoProps) {
  // Calculate clip duration
  const clipDuration = endTime - startTime;
  
  return (
    <div>
      <Card className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <CardContent className="p-0">
          <h3 className="text-lg font-semibold mb-4">Clip Information</h3>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Original Video</p>
              <p className="font-medium line-clamp-2">{videoTitle || "No video selected"}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500 mb-1">Clip Duration</p>
              <p className="font-medium">{formatTime(clipDuration)}</p>
            </div>
            
            <div className="pt-2">
              <div className="flex items-center justify-center px-4 py-3 bg-gray-50 border border-gray-200 rounded-md text-sm">
                <div className="flex items-center">
                  <i className="fas fa-info-circle text-blue-500 mr-2"></i>
                  <p className="text-gray-600">Clips remain private until shared</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-white rounded-lg shadow-sm p-6">
        <CardContent className="p-0">
          <h3 className="text-lg font-semibold mb-4">Create & Share</h3>
          
          <div className="space-y-4">
            <Button 
              onClick={onCreateClip}
              className="w-full justify-center items-center px-6 py-6 bg-blue-600 hover:bg-blue-700"
              disabled={startTime >= endTime || endTime === 0}
            >
              <Scissors className="mr-2 h-4 w-4" />
              Create Clip
            </Button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-2 bg-white text-sm text-gray-500">Share Options</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline"
                onClick={onCopyLink}
                disabled={!clipCreated}
                className="justify-center items-center"
              >
                <Link className="mr-2 h-4 w-4" />
                Copy Link
              </Button>
              
              <Button 
                variant="outline"
                disabled={!clipCreated}
                className="justify-center items-center"
              >
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              <Button 
                variant="outline"
                disabled={!clipCreated}
                className="p-2 justify-center"
              >
                <Twitter className="h-4 w-4" />
              </Button>
              
              <Button 
                variant="outline"
                disabled={!clipCreated}
                className="p-2 justify-center"
              >
                <Facebook className="h-4 w-4" />
              </Button>
              
              <Button 
                variant="outline"
                disabled={!clipCreated}
                className="p-2 justify-center"
              >
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

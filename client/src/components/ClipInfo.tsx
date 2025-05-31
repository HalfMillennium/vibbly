import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatTime } from "@/lib/utils";
import { Scissors, Link, Download, Share2, PlayCircle } from "lucide-react";

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
      <Card className="glass-card p-4 md:p-6 mb-4">
        <CardContent className="p-0">
          <h3 className="text-base font-medium text-foreground mb-4">Video details</h3>
          
          <div className="space-y-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Source</p>
              <p className="font-medium text-sm text-foreground line-clamp-2">{videoTitle || "No video selected"}</p>
            </div>
            
            <div className="flex flex-row gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Start</p>
                <p className="font-medium text-sm text-foreground">{formatTime(startTime)}</p>
              </div>
              
              <div>
                <p className="text-xs text-muted-foreground mb-1">End</p>
                <p className="font-medium text-sm text-foreground">{formatTime(endTime)}</p>
              </div>
              
              <div>
                <p className="text-xs text-muted-foreground mb-1">Duration</p>
                <p className="font-medium text-sm text-foreground">{formatTime(clipDuration)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="glass-card p-4 md:p-6">
        <CardContent className="p-0">
          <h3 className="text-base font-medium text-foreground mb-4">Share your clip</h3>
          
          <div className="space-y-4">
            <Button 
              onClick={onCreateClip}
              className="w-full justify-center items-center py-5 rounded-md"
              disabled={startTime >= endTime || endTime === 0}
            >
              <Scissors className="mr-2 h-4 w-4" />
              Create & Share Clip
            </Button>
            
            {clipCreated ? (
              <div className="space-y-4">
                <div className="bg-muted/50 border border-border rounded-md p-3 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <PlayCircle className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium text-foreground">Clip ready to share</span>
                  </div>
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={onCopyLink}
                    className="text-xs h-8"
                  >
                    <Link className="mr-1.5 h-3.5 w-3.5" />
                    Copy Link
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    variant="outline"
                    onClick={onCopyLink}
                    className="justify-center items-center text-sm py-5"
                  >
                    <Link className="mr-2 h-4 w-4" />
                    Copy Link
                  </Button>
                  
                  <Button 
                    variant="outline"
                    className="justify-center items-center text-sm py-5"
                  >
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                </div>
              </div>
            ) : (
              <div className="bg-muted/50 border border-border rounded-md p-3 flex items-start gap-3">
                <div className="shrink-0 bg-primary/10 rounded-full p-1">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-primary">
                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>Create a clip to generate a shareable link. Clips remain private until shared.</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

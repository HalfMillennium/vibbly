import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { formatTime, parseTimeInput } from "@/lib/utils";
import { StepBack, StepForward, Play, Clock } from "lucide-react";

interface ClipControlsProps {
  videoDuration: number;
  startTime: number;
  endTime: number;
  onStartTimeChange: (time: number) => void;
  onEndTimeChange: (time: number) => void;
  clipTitle: string;
  onClipTitleChange: (title: string) => void;
  includeSubtitles: boolean;
  onIncludeSubtitlesChange: (include: boolean) => void;
  loopClip: boolean;
  onLoopClipChange: (loop: boolean) => void;
}

export default function ClipControls({
  videoDuration,
  startTime,
  endTime,
  onStartTimeChange,
  onEndTimeChange,
  clipTitle,
  onClipTitleChange,
  includeSubtitles,
  onIncludeSubtitlesChange,
  loopClip,
  onLoopClipChange,
}: ClipControlsProps) {
  const [startTimeDisplay, setStartTimeDisplay] = useState(formatTime(startTime));
  const [endTimeDisplay, setEndTimeDisplay] = useState(formatTime(endTime || videoDuration));
  const [isDraggingStart, setIsDraggingStart] = useState(false);
  const [isDraggingEnd, setIsDraggingEnd] = useState(false);
  const [advancedOptionsOpen, setAdvancedOptionsOpen] = useState(true);

  // Update display times when props change
  useEffect(() => {
    setStartTimeDisplay(formatTime(startTime));
  }, [startTime]);

  useEffect(() => {
    setEndTimeDisplay(formatTime(endTime || videoDuration));
  }, [endTime, videoDuration]);

  // Set default end time when video duration changes
  useEffect(() => {
    if (videoDuration > 0 && endTime === 0) {
      onEndTimeChange(Math.min(startTime + 30, videoDuration));
    }
  }, [videoDuration, startTime, endTime, onEndTimeChange]);

  const handleStartTimeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartTimeDisplay(e.target.value);
  };

  const handleEndTimeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndTimeDisplay(e.target.value);
  };

  const handleStartTimeInputBlur = () => {
    const parsedTime = parseTimeInput(startTimeDisplay);
    if (parsedTime !== null && parsedTime >= 0 && parsedTime < videoDuration) {
      onStartTimeChange(Math.min(parsedTime, endTime || videoDuration));
    } else {
      setStartTimeDisplay(formatTime(startTime));
    }
  };

  const handleEndTimeInputBlur = () => {
    const parsedTime = parseTimeInput(endTimeDisplay);
    if (parsedTime !== null && parsedTime > startTime && parsedTime <= videoDuration) {
      onEndTimeChange(parsedTime);
    } else {
      setEndTimeDisplay(formatTime(endTime || videoDuration));
    }
  };

  // Calculate position of markers on timeline
  const startPosition = videoDuration ? (startTime / videoDuration) * 100 : 0;
  const endPosition = videoDuration ? ((endTime || videoDuration) / videoDuration) * 100 : 100;
  
  // Generate time indicators for the timeline
  const timeIndicators = [];
  if (videoDuration) {
    const step = Math.ceil(videoDuration / 5);
    for (let i = 0; i <= videoDuration; i += step) {
      if (i <= videoDuration) {
        timeIndicators.push(
          <span key={i} className="text-xs text-gray-500">
            {formatTime(i)}
          </span>
        );
      }
    }
  }

  return (
    <>
      <Card className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <CardContent className="p-0">
          <h3 className="text-lg font-semibold mb-4">Clip Selection</h3>
          
          {/* Timeline with visual markers */}
          <div className="mb-6">
            <div className="relative pt-6 pb-2">
              {/* Timeline Track */}
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                {/* Selected Area */}
                <div 
                  className="absolute h-2 bg-blue-500 rounded-full" 
                  style={{ 
                    left: `${startPosition}%`, 
                    right: `${100 - endPosition}%` 
                  }}
                ></div>
                
                {/* Start Marker */}
                <div 
                  className="absolute w-4 h-4 bg-blue-600 rounded-full -mt-1 border-2 border-white shadow cursor-grab active:cursor-grabbing"
                  style={{ 
                    left: `${startPosition}%`, 
                    transform: 'translateX(-50%)' 
                  }}
                  onMouseDown={() => setIsDraggingStart(true)}
                  onMouseUp={() => setIsDraggingStart(false)}
                  onMouseLeave={() => setIsDraggingStart(false)}
                  onMouseMove={(e) => {
                    if (isDraggingStart && videoDuration) {
                      const container = e.currentTarget.parentElement;
                      if (container) {
                        const rect = container.getBoundingClientRect();
                        const position = (e.clientX - rect.left) / rect.width;
                        const newTime = Math.max(0, Math.min(position * videoDuration, endTime - 1));
                        onStartTimeChange(newTime);
                      }
                    }
                  }}
                ></div>
                
                {/* End Marker */}
                <div 
                  className="absolute w-4 h-4 bg-blue-600 rounded-full -mt-1 border-2 border-white shadow cursor-grab active:cursor-grabbing"
                  style={{ 
                    left: `${endPosition}%`, 
                    transform: 'translateX(-50%)' 
                  }}
                  onMouseDown={() => setIsDraggingEnd(true)}
                  onMouseUp={() => setIsDraggingEnd(false)}
                  onMouseLeave={() => setIsDraggingEnd(false)}
                  onMouseMove={(e) => {
                    if (isDraggingEnd && videoDuration) {
                      const container = e.currentTarget.parentElement;
                      if (container) {
                        const rect = container.getBoundingClientRect();
                        const position = (e.clientX - rect.left) / rect.width;
                        const newTime = Math.min(videoDuration, Math.max(startTime + 1, position * videoDuration));
                        onEndTimeChange(newTime);
                      }
                    }
                  }}
                ></div>
              </div>
              
              {/* Time Indicators */}
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                {timeIndicators}
              </div>
            </div>
          </div>
          
          {/* Precise Time Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <Label htmlFor="start-time" className="block text-sm font-medium text-gray-700 mb-1">
                Start Time
              </Label>
              <div className="flex rounded-md shadow-sm">
                <Input 
                  id="start-time" 
                  value={startTimeDisplay}
                  onChange={handleStartTimeInputChange}
                  onBlur={handleStartTimeInputBlur}
                  className="flex-1 rounded-r-none"
                  placeholder="0:00"
                />
                <Button 
                  type="button"
                  variant="outline"
                  className="rounded-l-none border-l-0"
                  onClick={() => onStartTimeChange(0)}
                >
                  <Clock className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div>
              <Label htmlFor="end-time" className="block text-sm font-medium text-gray-700 mb-1">
                End Time
              </Label>
              <div className="flex rounded-md shadow-sm">
                <Input 
                  id="end-time" 
                  value={endTimeDisplay}
                  onChange={handleEndTimeInputChange}
                  onBlur={handleEndTimeInputBlur}
                  className="flex-1 rounded-r-none"
                  placeholder="0:00"
                />
                <Button 
                  type="button"
                  variant="outline"
                  className="rounded-l-none border-l-0"
                  onClick={() => onEndTimeChange(videoDuration)}
                >
                  <Clock className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          {/* Clip Navigation */}
          <div className="flex justify-between items-center">
            <div className="flex space-x-2">
              <Button 
                variant="outline"
                size="sm"
                onClick={() => onStartTimeChange(startTime)}
                className="inline-flex items-center text-gray-700"
              >
                <StepBack className="h-4 w-4 mr-1" />
                Jump to Start
              </Button>
              <Button 
                variant="outline"
                size="sm"
                onClick={() => {
                  // This would typically use the player instance to play the clip
                  // Implementation handled by the parent component
                }}
                className="inline-flex items-center text-gray-700"
              >
                <Play className="h-4 w-4 mr-1" />
                Play Clip
              </Button>
            </div>
            
            <Button 
              variant="outline"
              size="sm"
              onClick={() => onEndTimeChange(endTime)}
              className="inline-flex items-center text-gray-700"
            >
              Jump to End
              <StepForward className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Advanced Options */}
      <Card className="bg-white rounded-lg shadow-sm p-6">
        <CardContent className="p-0">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Advanced Options</h3>
            <button 
              onClick={() => setAdvancedOptionsOpen(!advancedOptionsOpen)}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              <i className={`fas fa-angle-${advancedOptionsOpen ? 'up' : 'down'}`}></i>
            </button>
          </div>
          
          {advancedOptionsOpen && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="clip-title" className="block text-sm font-medium text-gray-700 mb-1">
                  Clip Title
                </Label>
                <Input 
                  id="clip-title" 
                  value={clipTitle}
                  onChange={(e) => onClipTitleChange(e.target.value)}
                  className="w-full"
                  placeholder="My awesome clip"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="include-subtitles" 
                  checked={includeSubtitles}
                  onCheckedChange={(checked) => onIncludeSubtitlesChange(checked as boolean)}
                />
                <Label htmlFor="include-subtitles" className="text-sm text-gray-700">
                  Include subtitles (if available)
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="loop-clip" 
                  checked={loopClip}
                  onCheckedChange={(checked) => onLoopClipChange(checked as boolean)}
                />
                <Label htmlFor="loop-clip" className="text-sm text-gray-700">
                  Loop clip in preview
                </Label>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}

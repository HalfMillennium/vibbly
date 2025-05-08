import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { formatTime, parseTimeInput } from "@/lib/utils";
import { StepBack, StepForward, Play, ChevronDown, ChevronUp, Scissors } from "lucide-react";

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
  const [advancedOptionsOpen, setAdvancedOptionsOpen] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchElement, setTouchElement] = useState<'start' | 'end' | null>(null);

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
    const numIndicators = window.innerWidth < 640 ? 3 : 5;
    const step = Math.ceil(videoDuration / (numIndicators - 1));
    for (let i = 0; i <= videoDuration; i += step) {
      if (i <= videoDuration) {
        timeIndicators.push(
          <span key={i} className="text-xs text-gray-500 whitespace-nowrap">
            {formatTime(i)}
          </span>
        );
      }
    }
  }

  // Used for both mouse and touch events
  const handleDragStart = (element: 'start' | 'end', e: React.MouseEvent | React.TouchEvent) => {
    if ('touches' in e) {
      setTouchStartX(e.touches[0].clientX);
    }
    
    if (element === 'start') {
      setIsDraggingStart(true);
    } else {
      setIsDraggingEnd(true);
    }
    setTouchElement(element);
    
    // Add global event listeners for better dragging experience
    document.addEventListener('mousemove', handleGlobalDragMove);
    document.addEventListener('touchmove', handleGlobalDragMove);
    document.addEventListener('mouseup', handleGlobalDragEnd);
    document.addEventListener('touchend', handleGlobalDragEnd);
  };

  // Global handlers for smoother dragging experience
  const handleGlobalDragMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!videoDuration) return;
    if (!isDraggingStart && !isDraggingEnd) return;
    
    const trackElement = document.querySelector('.timeline-track');
    if (!trackElement) return;
    
    const rect = trackElement.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    let position = (clientX - rect.left) / rect.width;
    position = Math.max(0, Math.min(1, position)); // Clamp between 0 and 1
    
    if (isDraggingStart) {
      const newTime = Math.max(0, Math.min(position * videoDuration, endTime - 1));
      onStartTimeChange(newTime);
    } else if (isDraggingEnd) {
      const newTime = Math.min(videoDuration, Math.max(startTime + 1, position * videoDuration));
      onEndTimeChange(newTime);
    }
  }, [isDraggingStart, isDraggingEnd, videoDuration, endTime, startTime, onStartTimeChange, onEndTimeChange]);
  
  const handleGlobalDragEnd = useCallback(() => {
    setIsDraggingStart(false);
    setIsDraggingEnd(false);
    setTouchStartX(null);
    setTouchElement(null);
    
    // Remove the global event listeners
    document.removeEventListener('mousemove', handleGlobalDragMove);
    document.removeEventListener('touchmove', handleGlobalDragMove);
    document.removeEventListener('mouseup', handleGlobalDragEnd);
    document.removeEventListener('touchend', handleGlobalDragEnd);
  }, [handleGlobalDragMove]);
  
  // Clean up event listeners when component unmounts
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleGlobalDragMove);
      document.removeEventListener('touchmove', handleGlobalDragMove);
      document.removeEventListener('mouseup', handleGlobalDragEnd);
      document.removeEventListener('touchend', handleGlobalDragEnd);
    };
  }, [handleGlobalDragMove, handleGlobalDragEnd]);

  return (
    <div className="space-y-4">
      <Card className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <CardContent className="p-4 md:p-6">
          <h3 className="text-base font-medium text-gray-800 mb-4">Adjust clip timing</h3>
          
          {/* Timeline with visual markers */}
          <div className="timeline-container mb-6">
            <div className="timeline-track">
              {/* Selected Area */}
              <div 
                className="absolute h-2 bg-primary rounded-full" 
                style={{ 
                  left: `${startPosition}%`, 
                  right: `${100 - endPosition}%` 
                }}
              ></div>
              
              {/* Start Marker */}
              <div 
                className="timeline-marker"
                style={{ left: `${startPosition}%` }}
                onMouseDown={(e) => handleDragStart('start', e)}
                onTouchStart={(e) => handleDragStart('start', e)}
              >
                {/* Small tooltip showing time */}
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-primary text-white text-xs rounded px-1.5 py-0.5 whitespace-nowrap">
                  {formatTime(startTime)}
                </div>
              </div>
              
              {/* End Marker */}
              <div 
                className="timeline-marker"
                style={{ left: `${endPosition}%` }}
                onMouseDown={(e) => handleDragStart('end', e)}
                onTouchStart={(e) => handleDragStart('end', e)}
              >
                {/* Small tooltip showing time */}
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-primary text-white text-xs rounded px-1.5 py-0.5 whitespace-nowrap">
                  {formatTime(endTime)}
                </div>
              </div>
            </div>
            
            {/* Time Indicators */}
            <div className="absolute bottom-1 left-2 right-2 flex justify-between text-xs text-gray-500">
              {timeIndicators}
            </div>
          </div>
          
          {/* Precise Time Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <Label htmlFor="start-time" className="block text-sm font-medium text-gray-700 mb-1.5 control-label">
                Start Time
              </Label>
              <div className="flex rounded-md shadow-sm">
                <Input 
                  id="start-time" 
                  value={startTimeDisplay}
                  onChange={handleStartTimeInputChange}
                  onBlur={handleStartTimeInputBlur}
                  className="flex-1 rounded-r-none border-r-0"
                  placeholder="0:00"
                />
                <Button 
                  type="button"
                  variant="outline"
                  className="rounded-l-none"
                  onClick={() => onStartTimeChange(0)}
                >
                  <Scissors className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
            
            <div>
              <Label htmlFor="end-time" className="block text-sm font-medium text-gray-700 mb-1.5 control-label">
                End Time
              </Label>
              <div className="flex rounded-md shadow-sm">
                <Input 
                  id="end-time" 
                  value={endTimeDisplay}
                  onChange={handleEndTimeInputChange}
                  onBlur={handleEndTimeInputBlur}
                  className="flex-1 rounded-r-none border-r-0"
                  placeholder="0:00"
                />
                <Button 
                  type="button"
                  variant="outline"
                  className="rounded-l-none"
                  onClick={() => onEndTimeChange(videoDuration)}
                >
                  <Scissors className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>
          
          {/* Clip Preview Controls */}
          <div className="flex flex-wrap justify-center sm:justify-between items-center gap-2">
            <Button 
              variant="outline"
              size="sm"
              onClick={() => {
                // This would typically use the player instance to play the clip
                // Implementation handled by the parent component
              }}
              className="flex items-center text-gray-700 px-4"
            >
              <Play className="h-3.5 w-3.5 mr-1.5" />
              <span className="text-sm">Preview Clip</span>
            </Button>
            
            <div className="text-sm text-gray-600 font-medium">
              Duration: <span className="text-gray-900">{formatTime(endTime - startTime)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Advanced Options */}
      <Card className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <CardContent className="p-4 md:p-6">
          <button 
            onClick={() => setAdvancedOptionsOpen(!advancedOptionsOpen)}
            className="w-full flex items-center justify-between text-left"
          >
            <h3 className="text-base font-medium text-gray-800">Additional Options</h3>
            <span className="text-gray-500">
              {advancedOptionsOpen ? 
                <ChevronUp className="h-5 w-5" /> : 
                <ChevronDown className="h-5 w-5" />
              }
            </span>
          </button>
          
          {advancedOptionsOpen && (
            <div className="space-y-4 mt-4 pt-4 border-t border-gray-100">
              <div>
                <Label htmlFor="clip-title" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Clip Title
                </Label>
                <Input 
                  id="clip-title" 
                  value={clipTitle}
                  onChange={(e) => onClipTitleChange(e.target.value)}
                  className="w-full"
                  placeholder="Add a title to your clip"
                />
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6">
                <div className="flex items-center space-x-2 mb-2 sm:mb-0">
                  <Checkbox 
                    id="loop-clip" 
                    checked={loopClip}
                    onCheckedChange={(checked) => onLoopClipChange(checked as boolean)}
                  />
                  <Label htmlFor="loop-clip" className="text-sm text-gray-700">
                    Loop clip in preview
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="include-subtitles" 
                    checked={includeSubtitles}
                    onCheckedChange={(checked) => onIncludeSubtitlesChange(checked as boolean)}
                  />
                  <Label htmlFor="include-subtitles" className="text-sm text-gray-700">
                    Include subtitles
                  </Label>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

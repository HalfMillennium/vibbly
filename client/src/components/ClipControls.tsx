import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { formatTime, parseTimeInput } from "@/lib/utils";
import {
  View,
  Play,
  ChevronDown,
  ChevronUp,
  SkipBack,
  SkipForward,
} from "lucide-react";

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
  onPreviewClip: () => void;
  onPlayClip: () => void;
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
  onPreviewClip,
  onPlayClip,
}: ClipControlsProps) {
  const [startTimeDisplay, setStartTimeDisplay] = useState(
    formatTime(startTime),
  );
  const [endTimeDisplay, setEndTimeDisplay] = useState(
    formatTime(endTime || videoDuration),
  );
  const [advancedOptionsOpen, setAdvancedOptionsOpen] = useState(false);

  // References for the DOM elements and tracking drag state
  const trackRef = useRef<HTMLDivElement>(null);
  const startMarkerRef = useRef<HTMLDivElement>(null);
  const endMarkerRef = useRef<HTMLDivElement>(null);
  const isDraggingStartRef = useRef(false);
  const isDraggingEndRef = useRef(false);

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

  const handleStartTimeInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
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
    if (
      parsedTime !== null &&
      parsedTime > startTime &&
      parsedTime <= videoDuration
    ) {
      onEndTimeChange(parsedTime);
    } else {
      setEndTimeDisplay(formatTime(endTime || videoDuration));
    }
  };

  // Calculate position of markers on timeline
  const startPosition = videoDuration ? (startTime / videoDuration) * 100 : 0;
  const endPosition = videoDuration
    ? ((endTime || videoDuration) / videoDuration) * 100
    : 100;

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
          </span>,
        );
      }
    }
  }

  // Setup drag handlers
  useEffect(() => {
    // Handler for mouse/touch movement
    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!trackRef.current || !videoDuration) return;
      if (!isDraggingStartRef.current && !isDraggingEndRef.current) return;

      // Prevent default behavior to avoid text selection
      e.preventDefault();

      // Calculate position
      const rect = trackRef.current.getBoundingClientRect();
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const position = (clientX - rect.left) / rect.width;
      const clampedPosition = Math.max(0, Math.min(1, position));

      // Update times based on which marker is being dragged
      if (isDraggingStartRef.current) {
        const newTime = Math.round(
          Math.max(0, Math.min(clampedPosition * videoDuration, endTime - 1)),
        );
        onStartTimeChange(newTime);
      } else if (isDraggingEndRef.current) {
        const newTime = Math.round(
          Math.min(
            videoDuration,
            Math.max(startTime + 1, clampedPosition * videoDuration),
          ),
        );
        onEndTimeChange(newTime);
      }
    };

    // Handler for ending the drag operation
    const handleEnd = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      isDraggingStartRef.current = false;
      isDraggingEndRef.current = false;

      // Re-enable text selection
      document.body.style.userSelect = "";
    };

    // Start drag operations
    const startStartDrag = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      isDraggingStartRef.current = true;
      isDraggingEndRef.current = false;
      // Disable text selection during drag
      document.body.style.userSelect = "none";
    };

    const startEndDrag = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      isDraggingStartRef.current = false;
      isDraggingEndRef.current = true;
      // Disable text selection during drag
      document.body.style.userSelect = "none";
    };

    // Add event listeners to the markers
    const startMarker = startMarkerRef.current;
    const endMarker = endMarkerRef.current;

    if (startMarker) {
      startMarker.addEventListener("mousedown", startStartDrag);
      startMarker.addEventListener("touchstart", startStartDrag);
    }

    if (endMarker) {
      endMarker.addEventListener("mousedown", startEndDrag);
      endMarker.addEventListener("touchstart", startEndDrag);
    }

    // Add global event listeners for drag operations
    document.addEventListener("mousemove", handleMove);
    document.addEventListener("touchmove", handleMove);
    document.addEventListener("mouseup", handleEnd);
    document.addEventListener("touchend", handleEnd);

    // Cleanup
    return () => {
      if (startMarker) {
        startMarker.removeEventListener("mousedown", startStartDrag);
        startMarker.removeEventListener("touchstart", startStartDrag);
      }

      if (endMarker) {
        endMarker.removeEventListener("mousedown", startEndDrag);
        endMarker.removeEventListener("touchstart", startEndDrag);
      }

      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("touchmove", handleMove);
      document.removeEventListener("mouseup", handleEnd);
      document.removeEventListener("touchend", handleEnd);
    };
  }, [videoDuration, startTime, endTime, onStartTimeChange, onEndTimeChange]);

  return (
    <div className="space-y-6">
      <div className="glass-card p-6 md:p-8">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-6">
          Adjust clip timing
        </h3>

        {/* Timeline with visual markers */}
        <div className="timeline-container mb-6">
          <div className="timeline-track" ref={trackRef}>
            {/* Selected Area */}
            <div
              className="absolute h-2 bg-primary rounded-full"
              style={{
                left: `${startPosition}%`,
                right: `${100 - endPosition}%`,
              }}
            ></div>

            {/* Start Marker */}
            <div
              ref={startMarkerRef}
              className="timeline-marker"
              style={{ left: `${startPosition}%` }}
            >
              {/* Small tooltip showing time */}
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-primary text-white text-xs rounded px-1.5 py-0.5 whitespace-nowrap">
                {formatTime(startTime)}
              </div>
            </div>

            {/* End Marker */}
            <div
              ref={endMarkerRef}
              className="timeline-marker"
              style={{ left: `${endPosition}%` }}
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
            <Label
              htmlFor="start-time"
              className="block text-sm font-medium text-gray-700 mb-1.5 control-label"
            >
              Start Time
            </Label>
            <div className="flex rounded-md shadow-sm focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
              <Input
                id="start-time"
                value={startTimeDisplay}
                onChange={handleStartTimeInputChange}
                onBlur={handleStartTimeInputBlur}
                className="flex-1 rounded-r-none border-r-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                placeholder="0:00"
              />
              <Button
                type="button"
                variant="outline"
                className="rounded-l-none focus-visible:ring-0 focus-visible:ring-offset-0"
                onClick={() => onStartTimeChange(0)}
                title="Reset to beginning"
              >
                <SkipBack className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          <div>
            <Label
              htmlFor="end-time"
              className="block text-sm font-medium text-gray-700 mb-1.5 control-label"
            >
              End Time
            </Label>
            <div className="flex rounded-md shadow-sm focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
              <Input
                id="end-time"
                value={endTimeDisplay}
                onChange={handleEndTimeInputChange}
                onBlur={handleEndTimeInputBlur}
                className="flex-1 rounded-r-none border-r-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                placeholder="0:00"
              />
              <Button
                type="button"
                variant="outline"
                className="rounded-l-none focus-visible:ring-0 focus-visible:ring-offset-0"
                onClick={() => onEndTimeChange(Math.round(videoDuration))}
                title="Reset to end"
              >
                <SkipForward className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Clip Preview Controls */}
        <div className="flex flex-wrap justify-center sm:justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={onPreviewClip}
              className="flex items-center text-gray-700 px-4"
            >
              <View className="h-3.5 w-3.5" />
              <span className="text-sm">Preview Clip</span>
            </Button>

            <div className="flex items-center space-x-2">
              <Switch
                id="loop-preview"
                checked={loopClip}
                onCheckedChange={onLoopClipChange}
              />
              <Label
                htmlFor="loop-preview"
                className="text-sm text-gray-700 dark:text-gray-200"
              >
                Loop
              </Label>
            </div>
          </div>

          <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">
            Duration:{" "}
            <span className="text-gray-900 dark:text-gray-100">
              {formatTime(endTime - startTime)}
            </span>
          </div>
        </div>
      </div>

      {/* Advanced Options */}
      <div className="glass-card p-6 md:p-8">
        <button
          onClick={() => setAdvancedOptionsOpen(!advancedOptionsOpen)}
          className="w-full flex items-center justify-between text-left"
        >
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">
            Additional Options
          </h3>
          <span className="text-gray-500 dark:text-gray-400">
            {advancedOptionsOpen ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </span>
        </button>

        {advancedOptionsOpen && (
          <div className="space-y-6 mt-6 pt-6 border-t border-white/20 dark:border-gray-700/50">
            <div>
              <Label
                htmlFor="clip-title"
                className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-3"
              >
                Clip Title
              </Label>
              <Input
                id="clip-title"
                value={clipTitle}
                onChange={(e) => onClipTitleChange(e.target.value)}
                className="w-full glass-input rounded-2xl"
                placeholder="Add a title to your clip"
              />
            </div>

            <div className="flex items-center space-x-3">
              <Checkbox
                id="include-subtitles"
                checked={includeSubtitles}
                onCheckedChange={(checked) =>
                  onIncludeSubtitlesChange(checked as boolean)
                }
              />
              <Label
                htmlFor="include-subtitles"
                className="text-sm text-gray-700 dark:text-gray-200"
              >
                Include subtitles
              </Label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

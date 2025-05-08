import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format seconds into a human-readable time string (MM:SS)
 */
export function formatTime(seconds: number): string {
  if (!seconds || isNaN(seconds)) return "0:00";
  
  seconds = Math.floor(seconds);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

/**
 * Parse time input (MM:SS) into seconds
 */
export function parseTimeInput(timeString: string): number | null {
  // Match format MM:SS or M:SS
  const match = timeString.match(/^(\d+):([0-5]?\d)$/);
  if (match) {
    const minutes = parseInt(match[1], 10);
    const seconds = parseInt(match[2], 10);
    return minutes * 60 + seconds;
  }
  
  // Try to parse as just seconds
  const secondsOnly = parseFloat(timeString);
  if (!isNaN(secondsOnly)) {
    return secondsOnly;
  }
  
  return null;
}

/**
 * Generate a random ID string
 */
export function generateId(length = 8): string {
  return Math.random().toString(36).substring(2, 2 + length);
}

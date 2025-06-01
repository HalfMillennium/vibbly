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
 * Format a date with basic options
 */
export function formatDate(date: Date | string | number, options?: {
  format?: 'short' | 'medium' | 'long' | 'relative';
  includeTime?: boolean;
  timeFormat?: '12h' | '24h';
}): string {
  if (!date) return "";
  
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return "Invalid Date";
  
  const { format = 'medium', includeTime = false, timeFormat = '12h' } = options || {};
  
  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  // Relative format
  if (format === 'relative') {
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`;
    return `${Math.floor(diffDays / 365)}y ago`;
  }
  
  // Date formatting
  const formatOptions: Intl.DateTimeFormatOptions = {};
  
  switch (format) {
    case 'short':
      formatOptions.month = 'numeric';
      formatOptions.day = 'numeric';
      formatOptions.year = '2-digit';
      break;
    case 'medium':
      formatOptions.month = 'short';
      formatOptions.day = 'numeric';
      formatOptions.year = 'numeric';
      break;
    case 'long':
      formatOptions.month = 'long';
      formatOptions.day = 'numeric';
      formatOptions.year = 'numeric';
      formatOptions.weekday = 'long';
      break;
  }
  
  // Time formatting
  if (includeTime) {
    formatOptions.hour = 'numeric';
    formatOptions.minute = '2-digit';
    formatOptions.hour12 = timeFormat === '12h';
  }
  
  return dateObj.toLocaleDateString('en-US', formatOptions);
}

/**
 * Generate a random ID string
 */
export function generateId(length = 8): string {
  return Math.random().toString(36).substring(2, 2 + length);
}

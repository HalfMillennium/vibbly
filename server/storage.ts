import { clips, type Clip, type InsertClip } from "@shared/schema";

export interface IStorage {
  getClip(id: number): Promise<Clip | undefined>;
  getClipByShareId(shareId: string): Promise<Clip | undefined>;
  getAllClips(): Promise<Clip[]>;
  createClip(clip: InsertClip & { shareId: string }): Promise<Clip>;
}

export class MemStorage implements IStorage {
  private clips: Map<number, Clip>;
  private shareIdIndex: Map<string, number>;
  private currentId: number;

  constructor() {
    this.clips = new Map();
    this.shareIdIndex = new Map();
    this.currentId = 1;
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Add some example clips for demonstration
    const sampleClips = [
      {
        videoId: "dQw4w9WgXcQ",
        videoTitle: "Rick Astley - Never Gonna Give You Up (Official Video)",
        clipTitle: "The Classic Rick Roll",
        startTime: 43,
        endTime: 76,
        includeSubtitles: false,
        shareId: "rickroll123"
      },
      {
        videoId: "9bZkp7q19f0",
        videoTitle: "PSY - GANGNAM STYLE(강남스타일) M/V",
        clipTitle: "Gangnam Style Hook",
        startTime: 30,
        endTime: 65,
        includeSubtitles: true,
        shareId: "gangnam456"
      },
      {
        videoId: "kJQP7kiw5Fk",
        videoTitle: "Luis Fonsi - Despacito ft. Daddy Yankee",
        clipTitle: "Despacito Chorus",
        startTime: 60,
        endTime: 95,
        includeSubtitles: false,
        shareId: "despacito789"
      },
      {
        videoId: "fJ9rUzIMcZQ",
        videoTitle: "Queen – Bohemian Rhapsody (Official Video Remastered)",
        clipTitle: "Bohemian Rhapsody Opera Section",
        startTime: 180,
        endTime: 240,
        includeSubtitles: true,
        shareId: "queen101112"
      }
    ];

    sampleClips.forEach(clipData => {
      const id = this.currentId++;
      const now = new Date();
      
      const clip: Clip = {
        id,
        videoId: clipData.videoId,
        videoTitle: clipData.videoTitle,
        clipTitle: clipData.clipTitle,
        startTime: clipData.startTime,
        endTime: clipData.endTime,
        includeSubtitles: clipData.includeSubtitles,
        shareId: clipData.shareId,
        createdAt: now
      };
      
      this.clips.set(id, clip);
      this.shareIdIndex.set(clipData.shareId, id);
    });
  }

  async getClip(id: number): Promise<Clip | undefined> {
    return this.clips.get(id);
  }

  async getClipByShareId(shareId: string): Promise<Clip | undefined> {
    const clipId = this.shareIdIndex.get(shareId);
    if (clipId === undefined) return undefined;
    return this.getClip(clipId);
  }

  async getAllClips(): Promise<Clip[]> {
    return Array.from(this.clips.values());
  }

  async createClip(insertClip: InsertClip & { shareId: string }): Promise<Clip> {
    const id = this.currentId++;
    const now = new Date();
    
    const clip: Clip = {
      id,
      videoId: insertClip.videoId,
      videoTitle: insertClip.videoTitle,
      clipTitle: insertClip.clipTitle,
      startTime: insertClip.startTime,
      endTime: insertClip.endTime,
      includeSubtitles: insertClip.includeSubtitles ?? false,
      shareId: insertClip.shareId,
      createdAt: now
    };
    
    this.clips.set(id, clip);
    this.shareIdIndex.set(insertClip.shareId, id);
    
    return clip;
  }
}

export const storage = new MemStorage();

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

import { clips, type Clip, type InsertClip } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getClip(id: number): Promise<Clip | undefined>;
  getClipByShareId(shareId: string): Promise<Clip | undefined>;
  getClipsByUserId(userId: string): Promise<Clip[]>;
  createClip(clip: InsertClip & { shareId: string; createdByUserId: string }): Promise<Clip>;
}

export class DatabaseStorage implements IStorage {
  async getClip(id: number): Promise<Clip | undefined> {
    const [clip] = await db.select().from(clips).where(eq(clips.id, id));
    return clip || undefined;
  }

  async getClipByShareId(shareId: string): Promise<Clip | undefined> {
    const [clip] = await db.select().from(clips).where(eq(clips.shareId, shareId));
    return clip || undefined;
  }

  async getClipsByUserId(userId: string): Promise<Clip[]> {
    const userClips = await db.select().from(clips).where(eq(clips.createdByUserId, userId));
    return userClips;
  }

  async createClip(insertClip: InsertClip & { shareId: string; createdByUserId: string }): Promise<Clip> {
    const [clip] = await db
      .insert(clips)
      .values(insertClip)
      .returning();
    return clip;
  }
}

export const storage = new DatabaseStorage();

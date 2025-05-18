import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { users, clips, type User, type Clip } from "@shared/schema";
import { eq } from "drizzle-orm";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required");
}

// Create a connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10
});

// Create drizzle database instance
const db = drizzle(pool);

export const storage = {
  async getUserByEmail(email: string): Promise<User | undefined> {
    const results = await db.select().from(users).where(eq(users.email, email));
    return results[0];
  },

  async getUserById(id: number): Promise<User | undefined> {
    const results = await db.select().from(users).where(eq(users.id, id));
    return results[0];
  },

  async createUser(data: Partial<User>): Promise<User> {
    const results = await db.insert(users).values(data).returning();
    return results[0];
  },

  async updateUser(id: number, data: Partial<User>): Promise<User | undefined> {
    const results = await db
      .update(users)
      .set(data)
      .where(eq(users.id, id))
      .returning();
    return results[0];
  },

  async getClipsByUserId(userId: number): Promise<Clip[]> {
    return await db.select().from(clips).where(eq(clips.userId, userId));
  },

  async createClip(data: Partial<Clip>): Promise<Clip> {
    const results = await db.insert(clips).values(data).returning();
    return results[0];
  },

  async getClipByShareId(shareId: string): Promise<Clip | undefined> {
    const results = await db.select().from(clips).where(eq(clips.shareId, shareId));
    return results[0];
  }
};
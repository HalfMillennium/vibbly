import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { users, clips, userMessages, type User, type Clip, type UserMessage, type InsertUserMessage } from "@shared/schema";
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
  
  async getUserByClerkId(clerkId: string): Promise<User | undefined> {
    const results = await db.select().from(users).where(eq(users.clerkId, clerkId));
    return results[0];
  },
  
  async getUserByStripeCustomerId(stripeCustomerId: string): Promise<User | undefined> {
    const results = await db.select().from(users).where(eq(users.stripeCustomerId, stripeCustomerId));
    return results[0];
  },

  async createUser(data: Partial<User>): Promise<User> {
    // Type assertion to ensure required fields
    const insertData = data as {
      email: string;
      username: string;
      clerkId: string;
    };
    const results = await db.insert(users).values(insertData).returning();
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
  
  async updateUserSubscription(userId: number, subscriptionDetails: {
    stripeSubscriptionId?: string;
    subscriptionStatus?: string;
  }): Promise<User | undefined> {
    return this.updateUser(userId, subscriptionDetails);
  },
  
  async updateStripeCustomerId(userId: number, stripeCustomerId: string): Promise<User | undefined> {
    return this.updateUser(userId, { stripeCustomerId });
  },
  
  async updateStripeCustomerIdByClerkId(clerkId: string, stripeCustomerId: string): Promise<User | undefined> {
    const user = await this.getUserByClerkId(clerkId);
    if (!user) return undefined;
    return this.updateUser(user.id, { stripeCustomerId });
  },

  async getClipsByUserId(userId: number): Promise<Clip[]> {
    return await db.select().from(clips).where(eq(clips.userId, userId));
  },

  async getAllClips(): Promise<Clip[]> {
    return await db.select().from(clips);
  },
  
  async getClip(id: number): Promise<Clip | undefined> {
    const results = await db.select().from(clips).where(eq(clips.id, id));
    return results[0];
  },

  async createClip(data: {
    videoId: string;
    videoTitle: string;
    clipTitle: string;
    startTime: number;
    endTime: number;
    includeSubtitles?: boolean;
    shareId: string;
    userId?: number;
  }): Promise<Clip> {
    const results = await db.insert(clips).values(data).returning();
    return results[0];
  },

  async getClipByShareId(shareId: string): Promise<Clip | undefined> {
    const results = await db.select().from(clips).where(eq(clips.shareId, shareId));
    return results[0];
  },

  // User message methods
  async createUserMessage(data: InsertUserMessage & { userId?: number }): Promise<UserMessage> {
    const results = await db.insert(userMessages).values(data).returning();
    return results[0];
  },

  async getUserMessages(): Promise<UserMessage[]> {
    return await db.select().from(userMessages);
  },

  async getUserMessageById(id: number): Promise<UserMessage | undefined> {
    const results = await db.select().from(userMessages).where(eq(userMessages.id, id));
    return results[0];
  },

  async getUserMessagesByUserId(userId: number): Promise<UserMessage[]> {
    return await db.select().from(userMessages).where(eq(userMessages.userId, userId));
  }
};
import { clips, users, type Clip, type InsertClip, type User, type InsertUser } from "@shared/schema";

export interface IStorage {
  // Clip methods
  getClip(id: number): Promise<Clip | undefined>;
  getClipByShareId(shareId: string): Promise<Clip | undefined>;
  getAllClips(): Promise<Clip[]>;
  getUserClips(userId: number): Promise<Clip[]>;
  createClip(clip: InsertClip & { shareId: string; userId?: number }): Promise<Clip>;
  
  // User methods
  getUserById(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByStripeCustomerId(stripeCustomerId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserSubscription(userId: number, subscriptionDetails: {
    stripeSubscriptionId?: string;
    subscriptionStatus?: string;
  }): Promise<User | undefined>;
  updateStripeCustomerId(userId: number, stripeCustomerId: string): Promise<User | undefined>;
}

export class MemStorage implements IStorage {
  private clips: Map<number, Clip>;
  private users: Map<number, User>;
  private shareIdIndex: Map<string, number>;
  private emailIndex: Map<string, number>;
  private stripeCustomerIdIndex: Map<string, number>;
  private clipCurrentId: number;
  private userCurrentId: number;

  constructor() {
    this.clips = new Map();
    this.users = new Map();
    this.shareIdIndex = new Map();
    this.emailIndex = new Map();
    this.stripeCustomerIdIndex = new Map();
    this.clipCurrentId = 1;
    this.userCurrentId = 1;
  }

  // Clip methods
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
  
  async getUserClips(userId: number): Promise<Clip[]> {
    return Array.from(this.clips.values()).filter(clip => clip.userId === userId);
  }

  async createClip(insertClip: InsertClip & { shareId: string; userId?: number }): Promise<Clip> {
    const id = this.clipCurrentId++;
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
      userId: insertClip.userId || null,
      createdAt: now
    };
    
    this.clips.set(id, clip);
    this.shareIdIndex.set(insertClip.shareId, id);
    
    return clip;
  }
  
  // User methods
  async getUserById(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    const userId = this.emailIndex.get(email.toLowerCase());
    if (userId === undefined) return undefined;
    return this.getUserById(userId);
  }
  
  async getUserByStripeCustomerId(stripeCustomerId: string): Promise<User | undefined> {
    const userId = this.stripeCustomerIdIndex.get(stripeCustomerId);
    if (userId === undefined) return undefined;
    return this.getUserById(userId);
  }
  
  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const now = new Date();
    
    const email = insertUser.email.toLowerCase();
    
    const user: User = {
      id,
      email,
      username: insertUser.username,
      password: insertUser.password,
      stripeCustomerId: insertUser.stripeCustomerId || null,
      stripeSubscriptionId: insertUser.stripeSubscriptionId || null,
      subscriptionStatus: insertUser.subscriptionStatus || 'inactive',
      createdAt: now,
      updatedAt: now
    };
    
    this.users.set(id, user);
    this.emailIndex.set(email, id);
    
    if (insertUser.stripeCustomerId) {
      this.stripeCustomerIdIndex.set(insertUser.stripeCustomerId, id);
    }
    
    return user;
  }
  
  async updateUserSubscription(userId: number, subscriptionDetails: {
    stripeSubscriptionId?: string;
    subscriptionStatus?: string;
  }): Promise<User | undefined> {
    const user = await this.getUserById(userId);
    if (!user) return undefined;
    
    const updatedUser: User = {
      ...user,
      stripeSubscriptionId: subscriptionDetails.stripeSubscriptionId ?? user.stripeSubscriptionId,
      subscriptionStatus: subscriptionDetails.subscriptionStatus ?? user.subscriptionStatus,
      updatedAt: new Date()
    };
    
    this.users.set(userId, updatedUser);
    return updatedUser;
  }
  
  async updateStripeCustomerId(userId: number, stripeCustomerId: string): Promise<User | undefined> {
    const user = await this.getUserById(userId);
    if (!user) return undefined;
    
    // Remove old index if exists
    if (user.stripeCustomerId) {
      this.stripeCustomerIdIndex.delete(user.stripeCustomerId);
    }
    
    const updatedUser: User = {
      ...user,
      stripeCustomerId,
      updatedAt: new Date()
    };
    
    this.users.set(userId, updatedUser);
    this.stripeCustomerIdIndex.set(stripeCustomerId, userId);
    
    return updatedUser;
  }
}

export const storage = new MemStorage();

import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertClipSchema, insertUserSchema } from "@shared/schema";
import { generateId } from "../client/src/lib/utils";
import { isAuthenticated, hasActiveSubscription } from "./middleware/auth";
import * as stripeService from "./services/stripe";
import Stripe from "stripe";

// Create Stripe webhook instance with secret
const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';
let stripe: Stripe | null = null;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/register", async (req, res) => {
    try {
      const validationResult = insertUserSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid user data",
          errors: validationResult.error.format() 
        });
      }
      
      const userData = validationResult.data;
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(409).json({ message: "User already exists" });
      }
      
      // Create new user
      const user = await storage.createUser(userData);
      
      // Set user in session
      if (req.session) {
        req.session.userId = user.id;
        req.session.userEmail = user.email;
      }
      
      res.status(201).json({ 
        id: user.id,
        email: user.email,
        username: user.username
      });
    } catch (error) {
      console.error("Error registering user:", error);
      res.status(500).json({ message: "Failed to register user" });
    }
  });
  
  app.post("/api/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }
      
      // Find user by email
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // In a real app, we would compare hashed passwords here
      // For simplicity, we're doing a direct comparison
      if (user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Set user in session
      if (req.session) {
        req.session.userId = user.id;
        req.session.userEmail = user.email;
      }
      
      res.json({ 
        id: user.id,
        email: user.email,
        username: user.username,
        subscriptionStatus: user.subscriptionStatus
      });
    } catch (error) {
      console.error("Error logging in:", error);
      res.status(500).json({ message: "Failed to log in" });
    }
  });
  
  app.post("/api/logout", (req, res) => {
    req.session?.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
        return res.status(500).json({ message: "Failed to log out" });
      }
      
      res.clearCookie("connect.sid");
      res.json({ message: "Logged out successfully" });
    });
  });
  
  // Subscription routes
  app.post("/api/subscription/checkout", isAuthenticated, async (req, res) => {
    try {
      const userId = req.session?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      const user = await storage.getUserById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const session = await stripeService.createCheckoutSession(user);
      
      // Update user with Stripe customer ID if this is their first checkout
      if (!user.stripeCustomerId && session.customer) {
        await storage.updateStripeCustomerId(user.id, session.customer as string);
      }
      
      res.json({ url: session.url });
    } catch (error) {
      console.error("Error creating checkout session:", error);
      res.status(500).json({ message: "Failed to create checkout session" });
    }
  });
  
  app.post("/api/subscription/portal", isAuthenticated, async (req, res) => {
    try {
      const userId = req.session?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      const user = await storage.getUserById(userId);
      if (!user || !user.stripeCustomerId) {
        return res.status(404).json({ message: "User not found or no subscription" });
      }
      
      const session = await stripeService.createCustomerPortalSession(user.stripeCustomerId);
      
      res.json({ url: session.url });
    } catch (error) {
      console.error("Error creating customer portal session:", error);
      res.status(500).json({ message: "Failed to create customer portal session" });
    }
  });
  
  // Stripe webhook handler
  app.post("/api/webhook", async (req, res) => {
    const signature = req.headers['stripe-signature'] as string;
    
    if (!stripe || !stripeWebhookSecret) {
      return res.status(500).json({ message: "Stripe not configured" });
    }
    
    try {
      const event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        stripeWebhookSecret
      );
      
      const result = await stripeService.handleWebhookEvent(event);
      
      if (result) {
        if (result.type === 'subscription.created') {
          // Find user by Stripe customer ID
          const user = await storage.getUserByStripeCustomerId(result.customerId);
          
          if (user) {
            // Update user subscription status
            await storage.updateUserSubscription(user.id, {
              stripeSubscriptionId: result.subscriptionId,
              subscriptionStatus: 'active',
            });
          }
        } else if (result.type === 'subscription.updated') {
          // Find user by Stripe customer ID
          const user = await storage.getUserByStripeCustomerId(result.customerId);
          
          if (user) {
            // Update user subscription status
            await storage.updateUserSubscription(user.id, {
              subscriptionStatus: result.status,
            });
          }
        }
      }
      
      res.json({ received: true });
    } catch (error) {
      console.error("Error handling webhook:", error);
      res.status(400).json({ message: "Webhook error" });
    }
  });
  
  // Protected clip routes
  app.get("/api/clips", async (req, res) => {
    try {
      const clips = await storage.getAllClips();
      res.json(clips);
    } catch (error) {
      console.error("Error fetching clips:", error);
      res.status(500).json({ message: "Failed to fetch clips" });
    }
  });

  app.get("/api/clips/:id", async (req, res) => {
    try {
      const clip = await storage.getClip(parseInt(req.params.id));
      if (!clip) {
        return res.status(404).json({ message: "Clip not found" });
      }
      res.json(clip);
    } catch (error) {
      console.error("Error fetching clip:", error);
      res.status(500).json({ message: "Failed to fetch clip" });
    }
  });

  app.get("/api/clips/share/:shareId", async (req, res) => {
    try {
      const clip = await storage.getClipByShareId(req.params.shareId);
      if (!clip) {
        return res.status(404).json({ message: "Clip not found" });
      }
      res.json(clip);
    } catch (error) {
      console.error("Error fetching clip by share ID:", error);
      res.status(500).json({ message: "Failed to fetch clip" });
    }
  });

  app.post("/api/clips", isAuthenticated, hasActiveSubscription, async (req, res) => {
    try {
      const validationResult = insertClipSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid clip data",
          errors: validationResult.error.format() 
        });
      }
      
      const clipData = validationResult.data;
      const userId = req.session?.userId;
      
      // Generate a unique share ID
      const shareId = generateId(12);
      
      const clip = await storage.createClip({
        ...clipData,
        shareId,
        userId: userId as number
      });
      
      res.status(201).json(clip);
    } catch (error) {
      console.error("Error creating clip:", error);
      res.status(500).json({ message: "Failed to create clip" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}

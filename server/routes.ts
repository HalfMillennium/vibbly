import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertClipSchema, insertUserMessageSchema } from "@shared/schema";
import { generateId } from "../client/src/lib/utils";
import { requireStripeSubscription } from "./middleware/clerk-routes";
import * as stripeService from "./services/stripe";
import Stripe from "stripe";
import { clerkClient } from "@clerk/clerk-sdk-node";

// Create Stripe webhook instance with secret
const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";
let stripe: Stripe | null = null;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes using Clerk
  app.get("/api/auth/me", async (req, res) => {
    try {
      // Return null if not authenticated instead of 401 error
      if (!req.auth || !req.auth.userId) {
        return res.status(200).json({ user: null, authenticated: false });
      }

      // Get user from our database
      const user = await storage.getUserByClerkId(req.auth.userId);

      if (!user) {
        // User exists in Clerk but not in our DB yet, create them
        try {
          const clerkUser = await clerkClient.users.getUser(req.auth.userId);

          // Find primary email
          const primaryEmail = clerkUser.emailAddresses.find(
            (email) => email.id === clerkUser.primaryEmailAddressId,
          )?.emailAddress;

          if (!primaryEmail) {
            return res.status(400).json({ message: "User email not found" });
          }

          // Create user in our database
          const newUser = await storage.createUser({
            clerkId: req.auth.userId,
            email: primaryEmail,
            username:
              clerkUser.username || `user-${clerkUser.id.substring(0, 8)}`,
          });

          return res.json({
            id: newUser.id,
            email: newUser.email,
            username: newUser.username,
            isSubscribed: !!newUser.stripeCustomerId,
            stripeCustomerId: newUser.stripeCustomerId,
            subscriptionStatus: newUser.subscriptionStatus,
          });
        } catch (error) {
          console.error("Error creating user from Clerk:", error);
          return res.status(500).json({ message: "Failed to create user" });
        }
      }

      // Return user info
      res.json({
        id: user.id,
        email: user.email,
        username: user.username,
        isSubscribed: !!user.stripeCustomerId,
        stripeCustomerId: user.stripeCustomerId,
        subscriptionStatus: user.subscriptionStatus,
      });
    } catch (error) {
      console.error("Error getting user:", error);
      res.status(500).json({ message: "Failed to get user information" });
    }
  });

  // Subscription routes
  app.post("/api/subscription/checkout", async (req, res) => {
    try {
      // Check authentication with Clerk
      if (!req.auth.userId) {
        return res.status(401).json({ message: "Authentication required" });
      }

      // Get user from our database
      const user = await storage.getUserByClerkId(req.auth.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const session = await stripeService.createCheckoutSession(user);

      // Update user with Stripe customer ID if this is their first checkout
      if (!user.stripeCustomerId && session.customer) {
        await storage.updateStripeCustomerId(
          user.id,
          session.customer as string,
        );
      }

      res.json({ url: session.url });
    } catch (error) {
      console.error("Error creating checkout session:", error);
      res.status(500).json({ message: "Failed to create checkout session" });
    }
  });

  app.post("/api/subscription/portal", async (req, res) => {
    try {
      // Check authentication with Clerk
      if (!req.auth.userId) {
        return res.status(401).json({ message: "Authentication required" });
      }

      // Get user from our database
      const user = await storage.getUserByClerkId(req.auth.userId);
      if (!user || !user.stripeCustomerId) {
        return res
          .status(404)
          .json({ message: "User not found or no subscription" });
      }

      const session = await stripeService.createCustomerPortalSession(
        user.stripeCustomerId,
      );

      res.json({ url: session.url });
    } catch (error) {
      console.error("Error creating customer portal session:", error);
      res
        .status(500)
        .json({ message: "Failed to create customer portal session" });
    }
  });

  // Stripe webhook handler
  app.post("/api/webhook", async (req, res) => {
    const signature = req.headers["stripe-signature"] as string;

    if (!stripe || !stripeWebhookSecret) {
      return res.status(500).json({ message: "Stripe not configured" });
    }

    try {
      const event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        stripeWebhookSecret,
      );

      const result = await stripeService.handleWebhookEvent(event);

      if (result) {
        if (result.type === "subscription.created") {
          // Find user by Stripe customer ID
          const user = await storage.getUserByStripeCustomerId(
            result.customerId,
          );

          if (user) {
            // Update user subscription status
            await storage.updateUserSubscription(user.id, {
              stripeSubscriptionId: result.subscriptionId,
              subscriptionStatus: "active",
            });
          }
        } else if (result.type === "subscription.updated") {
          // Find user by Stripe customer ID
          const user = await storage.getUserByStripeCustomerId(
            result.customerId,
          );

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

  app.post("/api/clips", requireStripeSubscription, async (req, res) => {
    try {
      const validationResult = insertClipSchema.safeParse(req.body);

      if (!validationResult.success) {
        return res.status(400).json({
          message: "Invalid clip data",
          errors: validationResult.error.format(),
        });
      }

      const clipData = validationResult.data;

      // Get user from our database
      if (!req.auth.userId) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const user = await storage.getUserByClerkId(req.auth.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Generate a unique share ID
      const shareId = generateId(12);

      // Create clip data with correct types
      const clipToCreate = {
        videoId: clipData.videoId,
        videoTitle: clipData.videoTitle,
        clipTitle: clipData.clipTitle,
        startTime: clipData.startTime,
        endTime: clipData.endTime,
        includeSubtitles: clipData.includeSubtitles || false,
        shareId,
        userId: user.id,
      };

      const clip = await storage.createClip(clipToCreate);

      res.status(201).json(clip);
    } catch (error) {
      console.error("Error creating clip:", error);
      res.status(500).json({ message: "Failed to create clip" });
    }
  });

  // User message route
  app.post("/api/messages", async (req, res) => {
    try {
      const validationResult = insertUserMessageSchema.safeParse(req.body);

      if (!validationResult.success) {
        return res.status(400).json({
          message: "Invalid message data",
          errors: validationResult.error.format(),
        });
      }

      const messageData = validationResult.data;
      
      // If user is authenticated, link message to user account
      let userId: number | undefined = undefined;
      
      if (req.auth.userId) {
        const user = await storage.getUserByClerkId(req.auth.userId);
        if (user) {
          userId = user.id;
        }
      }

      const message = await storage.createUserMessage({
        ...messageData,
        userId
      });

      res.status(201).json({ success: true, messageId: message.id });
    } catch (error) {
      console.error("Error creating message:", error);
      res.status(500).json({ message: "Failed to submit message" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}

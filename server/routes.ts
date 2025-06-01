import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertClipSchema } from "@shared/schema";
import { generateId } from "../client/src/lib/utils";
import { getAuth } from "@clerk/express";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes
  app.get("/api/clips", async (req, res) => {
    try {
      const { userId } = getAuth(req);
      
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const clips = await storage.getClipsByUserId(userId);
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

  app.post("/api/clips", async (req, res) => {
    try {
      const { userId } = getAuth(req);
      
      console.log("Authentication result:", { userId, type: typeof userId });
      
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const validationResult = insertClipSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid clip data",
          errors: validationResult.error.format() 
        });
      }
      
      const clipData = validationResult.data;
      
      // Generate a unique share ID
      const shareId = generateId(12);
      
      console.log("About to create clip with:", { 
        clipData, 
        shareId, 
        createdByUserId: userId,
        userIdType: typeof userId 
      });
      
      const clip = await storage.createClip({
        ...clipData,
        shareId,
        createdByUserId: userId
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

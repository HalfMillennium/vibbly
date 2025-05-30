import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertClipSchema } from "@shared/schema";
import { generateId } from "../client/src/lib/utils";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes
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

  app.post("/api/clips", async (req, res) => {
    try {
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
      
      const clip = await storage.createClip({
        ...clipData,
        shareId
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

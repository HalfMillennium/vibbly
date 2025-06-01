import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const clips = pgTable("clips", {
  id: serial("id").primaryKey(),
  videoId: text("video_id").notNull(),
  videoTitle: text("video_title").notNull(),
  clipTitle: text("clip_title").notNull(),
  startTime: integer("start_time").notNull(),
  endTime: integer("end_time").notNull(),
  includeSubtitles: boolean("include_subtitles").default(false),
  shareId: text("share_id").notNull().unique(),
  createdByUserId: text("created_by_user_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertClipSchema = createInsertSchema(clips).omit({
  id: true,
  createdAt: true,
  shareId: true,
  createdByUserId: true,
});

export type InsertClip = z.infer<typeof insertClipSchema>;
export type Clip = typeof clips.$inferSelect;

import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const tours = pgTable("tours", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  status: text("status").notNull().default("uploading"), // uploading, processing, completed, failed
  totalPhotos: integer("total_photos").default(0),
  processedPhotos: integer("processed_photos").default(0),
  processingStep: text("processing_step").default("upload"), // upload, analysis, depth, assembly
  createdAt: timestamp("created_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const rooms = pgTable("rooms", {
  id: serial("id").primaryKey(),
  tourId: integer("tour_id").notNull().references(() => tours.id),
  name: text("name").notNull(),
  type: text("type").notNull(), // living_room, kitchen, bedroom, bathroom, etc.
  confidence: integer("confidence").default(0), // 0-100
  photoCount: integer("photo_count").default(0),
  thumbnailUrl: text("thumbnail_url"),
});

export const photos = pgTable("photos", {
  id: serial("id").primaryKey(),
  tourId: integer("tour_id").notNull().references(() => tours.id),
  roomId: integer("room_id").references(() => rooms.id),
  filename: text("filename").notNull(),
  originalName: text("original_name").notNull(),
  url: text("url").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  width: integer("width"),
  height: integer("height"),
  processed: boolean("processed").default(false),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
});

export const insertTourSchema = createInsertSchema(tours).omit({
  id: true,
  createdAt: true,
  completedAt: true,
});

export const insertRoomSchema = createInsertSchema(rooms).omit({
  id: true,
});

export const insertPhotoSchema = createInsertSchema(photos).omit({
  id: true,
  uploadedAt: true,
});

export type InsertTour = z.infer<typeof insertTourSchema>;
export type InsertRoom = z.infer<typeof insertRoomSchema>;
export type InsertPhoto = z.infer<typeof insertPhotoSchema>;
export type Tour = typeof tours.$inferSelect;
export type Room = typeof rooms.$inferSelect;
export type Photo = typeof photos.$inferSelect;

import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTourSchema, insertPhotoSchema } from "@shared/schema";
import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";

// Configure multer for file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
      cb(null, uniqueName);
    }
  }),
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG and PNG files are allowed'));
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 50 // Maximum 50 files
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Create a new tour
  app.post("/api/tours", async (req, res) => {
    try {
      const validatedData = insertTourSchema.parse(req.body);
      const tour = await storage.createTour(validatedData);
      res.json(tour);
    } catch (error) {
      res.status(400).json({ error: "Invalid tour data" });
    }
  });

  // Get tour by ID
  app.get("/api/tours/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const tour = await storage.getTour(id);
      if (!tour) {
        return res.status(404).json({ error: "Tour not found" });
      }
      res.json(tour);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch tour" });
    }
  });

  // Upload photos for a tour
  app.post("/api/tours/:id/photos", upload.array('photos', 50), async (req, res) => {
    try {
      const tourId = parseInt(req.params.id);
      const tour = await storage.getTour(tourId);
      
      if (!tour) {
        return res.status(404).json({ error: "Tour not found" });
      }

      const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0) {
        return res.status(400).json({ error: "No files uploaded" });
      }

      const photos = [];
      for (const file of files) {
        const photo = await storage.createPhoto({
          tourId,
          filename: file.filename,
          originalName: file.originalname,
          url: `/uploads/${file.filename}`,
          thumbnailUrl: `/uploads/thumbnails/${file.filename}`,
          width: null,
          height: null,
          processed: false,
          roomId: null
        });
        photos.push(photo);
      }

      // Update tour with photo count
      await storage.updateTour(tourId, {
        totalPhotos: (tour.totalPhotos || 0) + files.length,
        status: "processing",
        processingStep: "analysis"
      });

      // Simulate AI processing in the background
      setTimeout(() => processPhotosWithAI(tourId), 1000);

      res.json({ photos, message: `${files.length} photos uploaded successfully` });
    } catch (error) {
      res.status(500).json({ error: "Failed to upload photos" });
    }
  });

  // Get tour photos
  app.get("/api/tours/:id/photos", async (req, res) => {
    try {
      const tourId = parseInt(req.params.id);
      const photos = await storage.getPhotosByTourId(tourId);
      res.json(photos);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch photos" });
    }
  });

  // Get tour rooms
  app.get("/api/tours/:id/rooms", async (req, res) => {
    try {
      const tourId = parseInt(req.params.id);
      const rooms = await storage.getRoomsByTourId(tourId);
      res.json(rooms);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch rooms" });
    }
  });

  // Update tour processing status
  app.patch("/api/tours/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const tour = await storage.updateTour(id, req.body);
      if (!tour) {
        return res.status(404).json({ error: "Tour not found" });
      }
      res.json(tour);
    } catch (error) {
      res.status(500).json({ error: "Failed to update tour" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Simulate AI processing workflow
async function processPhotosWithAI(tourId: number) {
  try {
    // Step 1: Room Analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    await storage.updateTour(tourId, {
      processingStep: "analysis",
      processedPhotos: 8
    });

    // Create some detected rooms
    const roomTypes = [
      { name: "Living Room", type: "living_room", confidence: 96 },
      { name: "Kitchen", type: "kitchen", confidence: 94 },
      { name: "Master Bedroom", type: "bedroom", confidence: 97 },
      { name: "Bathroom", type: "bathroom", confidence: 91 }
    ];

    for (const roomData of roomTypes) {
      await storage.createRoom({
        tourId,
        name: roomData.name,
        type: roomData.type,
        confidence: roomData.confidence,
        photoCount: Math.floor(Math.random() * 6) + 3,
        thumbnailUrl: null
      });
    }

    // Step 2: Depth Estimation
    await new Promise(resolve => setTimeout(resolve, 3000));
    await storage.updateTour(tourId, {
      processingStep: "depth",
      processedPhotos: 16
    });

    // Step 3: Tour Assembly
    await new Promise(resolve => setTimeout(resolve, 2000));
    await storage.updateTour(tourId, {
      processingStep: "assembly",
      processedPhotos: 24
    });

    // Step 4: Complete
    await new Promise(resolve => setTimeout(resolve, 1000));
    await storage.updateTour(tourId, {
      status: "completed",
      processingStep: "completed",
      processedPhotos: 24,
      completedAt: new Date()
    });

  } catch (error) {
    await storage.updateTour(tourId, {
      status: "failed",
      processingStep: "failed"
    });
  }
}

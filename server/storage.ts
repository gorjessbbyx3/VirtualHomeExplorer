import { tours, rooms, photos, type Tour, type Room, type Photo, type InsertTour, type InsertRoom, type InsertPhoto } from "@shared/schema";

export interface IStorage {
  // Tours
  createTour(tour: InsertTour): Promise<Tour>;
  getTour(id: number): Promise<Tour | undefined>;
  updateTour(id: number, updates: Partial<Tour>): Promise<Tour | undefined>;
  
  // Rooms
  createRoom(room: InsertRoom): Promise<Room>;
  getRoomsByTourId(tourId: number): Promise<Room[]>;
  updateRoom(id: number, updates: Partial<Room>): Promise<Room | undefined>;
  
  // Photos
  createPhoto(photo: InsertPhoto): Promise<Photo>;
  getPhotosByTourId(tourId: number): Promise<Photo[]>;
  getPhotosByRoomId(roomId: number): Promise<Photo[]>;
  updatePhoto(id: number, updates: Partial<Photo>): Promise<Photo | undefined>;
}

export class MemStorage implements IStorage {
  private tours: Map<number, Tour>;
  private rooms: Map<number, Room>;
  private photos: Map<number, Photo>;
  private currentTourId: number;
  private currentRoomId: number;
  private currentPhotoId: number;

  constructor() {
    this.tours = new Map();
    this.rooms = new Map();
    this.photos = new Map();
    this.currentTourId = 1;
    this.currentRoomId = 1;
    this.currentPhotoId = 1;
  }

  async createTour(insertTour: InsertTour): Promise<Tour> {
    const id = this.currentTourId++;
    const tour: Tour = { 
      ...insertTour, 
      id, 
      createdAt: new Date(),
      completedAt: null 
    };
    this.tours.set(id, tour);
    return tour;
  }

  async getTour(id: number): Promise<Tour | undefined> {
    return this.tours.get(id);
  }

  async updateTour(id: number, updates: Partial<Tour>): Promise<Tour | undefined> {
    const tour = this.tours.get(id);
    if (!tour) return undefined;
    
    const updatedTour = { ...tour, ...updates };
    this.tours.set(id, updatedTour);
    return updatedTour;
  }

  async createRoom(insertRoom: InsertRoom): Promise<Room> {
    const id = this.currentRoomId++;
    const room: Room = { ...insertRoom, id };
    this.rooms.set(id, room);
    return room;
  }

  async getRoomsByTourId(tourId: number): Promise<Room[]> {
    return Array.from(this.rooms.values()).filter(room => room.tourId === tourId);
  }

  async updateRoom(id: number, updates: Partial<Room>): Promise<Room | undefined> {
    const room = this.rooms.get(id);
    if (!room) return undefined;
    
    const updatedRoom = { ...room, ...updates };
    this.rooms.set(id, updatedRoom);
    return updatedRoom;
  }

  async createPhoto(insertPhoto: InsertPhoto): Promise<Photo> {
    const id = this.currentPhotoId++;
    const photo: Photo = { 
      ...insertPhoto, 
      id, 
      uploadedAt: new Date() 
    };
    this.photos.set(id, photo);
    return photo;
  }

  async getPhotosByTourId(tourId: number): Promise<Photo[]> {
    return Array.from(this.photos.values()).filter(photo => photo.tourId === tourId);
  }

  async getPhotosByRoomId(roomId: number): Promise<Photo[]> {
    return Array.from(this.photos.values()).filter(photo => photo.roomId === roomId);
  }

  async updatePhoto(id: number, updates: Partial<Photo>): Promise<Photo | undefined> {
    const photo = this.photos.get(id);
    if (!photo) return undefined;
    
    const updatedPhoto = { ...photo, ...updates };
    this.photos.set(id, updatedPhoto);
    return updatedPhoto;
  }
}

export const storage = new MemStorage();

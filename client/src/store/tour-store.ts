import { create } from 'zustand';
import { Tour, Room, Photo } from '@shared/schema';

export type AppSection = 'home' | 'upload' | 'broadcast' | 'processing' | 'viewer';

interface TourStore {
  // Current state
  currentSection: AppSection;
  currentTour: Tour | null;
  rooms: Room[];
  photos: Photo[];
  currentRoomIndex: number;
  
  // File upload state
  uploadedFiles: File[];
  isUploading: boolean;
  uploadProgress: number;
  
  // Processing state
  isProcessing: boolean;
  processingStep: string;
  
  // Actions
  setCurrentSection: (section: AppSection) => void;
  setCurrentTour: (tour: Tour | null) => void;
  setRooms: (rooms: Room[]) => void;
  setPhotos: (photos: Photo[]) => void;
  setCurrentRoomIndex: (index: number) => void;
  
  // File upload actions
  addUploadedFiles: (files: File[]) => void;
  removeUploadedFile: (index: number) => void;
  clearUploadedFiles: () => void;
  setIsUploading: (uploading: boolean) => void;
  setUploadProgress: (progress: number) => void;
  
  // Processing actions
  setIsProcessing: (processing: boolean) => void;
  setProcessingStep: (step: string) => void;
  
  // Navigation
  nextRoom: () => void;
  previousRoom: () => void;
  goToRoom: (index: number) => void;
}

export const useTourStore = create<TourStore>((set, get) => ({
  // Initial state
  currentSection: 'home',
  currentTour: null,
  rooms: [],
  photos: [],
  currentRoomIndex: 0,
  
  uploadedFiles: [],
  isUploading: false,
  uploadProgress: 0,
  
  isProcessing: false,
  processingStep: '',
  
  // Actions
  setCurrentSection: (section) => set({ currentSection: section }),
  setCurrentTour: (tour) => set({ currentTour: tour }),
  setRooms: (rooms) => set({ rooms }),
  setPhotos: (photos) => set({ photos }),
  setCurrentRoomIndex: (index) => set({ currentRoomIndex: index }),
  
  // File upload actions
  addUploadedFiles: (files) => set((state) => ({
    uploadedFiles: [...state.uploadedFiles, ...files]
  })),
  removeUploadedFile: (index) => set((state) => ({
    uploadedFiles: state.uploadedFiles.filter((_, i) => i !== index)
  })),
  clearUploadedFiles: () => set({ uploadedFiles: [] }),
  setIsUploading: (uploading) => set({ isUploading: uploading }),
  setUploadProgress: (progress) => set({ uploadProgress: progress }),
  
  // Processing actions
  setIsProcessing: (processing) => set({ isProcessing: processing }),
  setProcessingStep: (step) => set({ processingStep: step }),
  
  // Navigation
  nextRoom: () => set((state) => {
    const nextIndex = (state.currentRoomIndex + 1) % state.rooms.length;
    return { currentRoomIndex: nextIndex };
  }),
  previousRoom: () => set((state) => {
    const prevIndex = state.currentRoomIndex === 0 
      ? state.rooms.length - 1 
      : state.currentRoomIndex - 1;
    return { currentRoomIndex: prevIndex };
  }),
  goToRoom: (index) => set({ currentRoomIndex: index }),
}));

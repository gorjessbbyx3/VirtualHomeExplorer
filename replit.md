# VirtualTour AI - Replit Project Guide

## Overview

VirtualTour AI is a full-stack web application that transforms regular property photos into immersive 3D virtual tours using AI technology. The application uses computer vision and machine learning to automatically detect rooms, estimate depth, and create navigable virtual experiences from standard 2D photographs.

## User Preferences

Preferred communication style: Simple, everyday language.
No mock, fake, or demo components - use only real data and functionality.

## System Architecture

The application follows a modern monorepo structure with separate client and server directories, utilizing a shared schema for type safety across the full stack.

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: Zustand for global state management
- **UI Components**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS custom properties for theming
- **3D Rendering**: Three.js for virtual tour visualization
- **Build Tool**: Vite with custom configuration for monorepo setup

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **File Upload**: Multer middleware for handling photo uploads
- **Development**: Hot reload with Vite integration in development mode

## Key Components

### Database Schema
The application uses a normalized database structure with three main entities:
- **Tours**: Main container for virtual tour projects with processing status tracking
- **Rooms**: Individual rooms within a tour with AI-detected room types and confidence scores
- **Photos**: Individual uploaded images with metadata and processing status

### AI Processing Pipeline
The system is designed to support a multi-stage AI processing workflow:
1. **Upload Phase**: Photo validation and storage
2. **Analysis Phase**: Room detection and classification using computer vision
3. **Depth Estimation**: Creating depth maps for 3D reconstruction
4. **Assembly Phase**: Stitching rooms together and creating navigation

### File Management
- Multer configuration for handling multiple file uploads (up to 50 photos, 10MB each)
- UUID-based file naming for uniqueness
- Support for JPEG and PNG formats with validation

### State Management
Centralized state management using Zustand with the following key states:
- Current application section (home, upload, processing, viewer)
- Tour data and processing status
- Room and photo collections
- Upload progress and file management
- 3D viewer navigation state

## Data Flow

1. **Photo Upload**: Users drag and drop photos which are validated and stored
2. **Tour Creation**: A new tour record is created in the database
3. **AI Processing**: Photos are processed through computer vision pipeline to detect rooms and estimate depth
4. **3D Assembly**: Processed data is used to create navigable 3D scenes
5. **Viewer Rendering**: Three.js renders the virtual tour with navigation controls

## External Dependencies

### Core Dependencies
- **Database**: Neon Database (Postgres-compatible serverless database)
- **UI Framework**: Radix UI primitives for accessible components
- **3D Graphics**: Three.js for WebGL rendering
- **State Management**: Zustand for client state
- **HTTP Client**: TanStack Query for server state management
- **Validation**: Zod for runtime type validation
- **File Processing**: Multer for multipart form handling

### Development Tools
- **Database Migrations**: Drizzle Kit for schema management
- **Build System**: Vite with React plugin
- **Type Checking**: TypeScript with strict configuration
- **Styling**: PostCSS with Tailwind CSS and Autoprefixer

## Deployment Strategy

### Build Process
- Frontend builds to `dist/public` directory using Vite
- Backend transpiles to `dist` directory using esbuild
- Shared schema types are available to both client and server

### Environment Configuration
- Database connection via `DATABASE_URL` environment variable
- Development mode uses Vite dev server with Express API
- Production serves static assets from Express with API routes

### Development Workflow
- `npm run dev`: Starts development server with hot reload
- `npm run build`: Creates production build
- `npm run start`: Runs production server
- `npm run db:push`: Applies database schema changes

The application is designed to scale from prototype to production with a clear separation of concerns and modular architecture that supports the complex AI processing pipeline while maintaining a smooth user experience.

## Recent Changes (January 2025)

- ✓ Removed all mock/demo components and placeholder data
- ✓ Fixed TypeScript errors in storage and routes
- ✓ Enhanced Three.js viewer to use real room data
- ✓ Added static file serving for uploaded images
- ✓ Made processing section show actual detected rooms
- ✓ Updated tour information to display real data from backend
- ✓ Implemented dynamic floor plan based on actual rooms
- ✓ Connected room switching functionality with store state
- ✓ Removed pricing references since service is free
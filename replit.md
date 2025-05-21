# Inferno AI - PTSD and Anxiety Support Application

## Overview

Inferno AI is a trauma-informed application designed to help users manage PTSD and anxiety through guided exercises, daily check-ins, and educational resources. The application features voice interaction capabilities, grounding techniques, breathing exercises, and mindfulness practices tailored to support mental well-being.

## User Preferences

```
Preferred communication style: Simple, everyday language.
```

## System Architecture

Inferno AI follows a modern full-stack architecture:

1. **Frontend**: React application with TypeScript, using Tailwind CSS for styling and shadcn/ui component library
2. **Backend**: Express.js API server in TypeScript
3. **Database**: PostgreSQL with Drizzle ORM for data management
4. **API Pattern**: RESTful API design with structured endpoints
5. **State Management**: React Context API for global state, React Query for server state
6. **Voice Interaction**: Web Speech API (SpeechRecognition and SpeechSynthesis)

The application uses a monorepo structure with shared types between the client and server, ensuring type safety across the entire application.

## Key Components

### Frontend

1. **Pages**: 
   - Homepage - User dashboard with check-in functionality
   - Therapeutic Exercises - Grounding, breathing, and mindfulness activities
   - Resources - Educational content and support resources

2. **Contexts**:
   - UserContext - Handles authentication and user data
   - VoiceContext - Manages speech recognition and synthesis

3. **Components**:
   - UI Components - Based on shadcn/ui library with Tailwind styling
   - Navigation - Bottom navigation bar for mobile-first experience 
   - Header - App header with voice mode toggle
   - Exercise-specific components for guided therapeutic activities

### Backend

1. **API Routes**:
   - Authentication routes (/api/auth/*)
   - User management routes (/api/users/*)
   - Check-in routes (/api/check-ins/*)
   - Exercise tracking routes (/api/exercises/*)
   - Resource routes (/api/resources/*)

2. **Data Storage**:
   - Uses Drizzle ORM with PostgreSQL
   - Schema defined in shared/schema.ts

3. **Server Structure**:
   - Express.js server with middleware for logging and error handling
   - Route registration system
   - Vite integration for development

### Database Schema

The database design includes the following models:

1. **Users**: Account information, preferences, authentication
2. **Check-ins**: Daily mood reports and notes
3. **Exercises**: Tracking of completed therapeutic exercises
4. **Resources**: Educational content and support materials

## Data Flow

1. **User Authentication**:
   - User registers or logs in via the API
   - Authentication data is stored in localStorage for persistence
   - User preferences are loaded, including voice mode settings

2. **Daily Check-ins**:
   - Users report current mood state and optional notes
   - Data is sent to the API and stored in the database
   - Streak information is calculated and returned to encourage consistency

3. **Therapeutic Exercises**:
   - Users select and complete guided exercises
   - Exercise data is tracked and sent to the API
   - Progress is stored for future reference

4. **Voice Interaction**:
   - Voice mode allows for hands-free operation
   - SpeechRecognition API captures user input
   - SpeechSynthesis API provides vocal guidance

## External Dependencies

### Frontend
- React and React DOM for UI rendering
- Wouter for lightweight client-side routing
- TanStack Query (React Query) for data fetching
- Radix UI for accessible component primitives
- shadcn/ui for pre-built UI components
- Tailwind CSS for styling
- Web Speech API for voice functionality

### Backend
- Express.js for API server
- Drizzle ORM for database operations
- Zod for validation
- Vite for development and build process

## Deployment Strategy

The application is deployed as a full-stack application with:

1. **Build Process**:
   - Client: Vite builds the React application to static assets
   - Server: esbuild bundles the server code

2. **Runtime Configuration**:
   - Environment variables for database connection
   - NODE_ENV for determining environment mode

3. **Production Setup**:
   - Static assets served by Express
   - API routes handled by the same Express server
   - Database connection via connection string

This design allows for deployment to various platforms while maintaining a simple architecture with minimal dependencies.
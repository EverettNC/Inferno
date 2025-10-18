# Inferno AI - Clinical-Grade Trauma-Informed AI Platform

## Overview

Inferno AI is a **clinical-grade, trauma-informed AI platform** with masters-level expertise in PTSD and trauma treatment. The platform combines evidence-based therapeutic exercises with real-time AI support, drawing from peer-reviewed research and clinical protocols to provide comprehensive trauma care.

### Core Differentiators

**Clinical Expertise:**
- Masters-level knowledge of evidence-based trauma therapies (CPT, PE, EMDR, DBT)
- Continuous learning from PubMed and medical journals
- DSM-5 compliant PTSD symptom recognition
- Clinical-grade crisis assessment and intervention
- Evidence-based protocols integrated into every response

**Advanced AI Capabilities:**
- Clinical trauma knowledge base with latest research
- Real-time emotional analysis and crisis detection
- Evidence-based therapeutic recommendations
- Personalized intervention suggestions
- Trauma-informed conversation design

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

## Clinical Knowledge Infrastructure

### Evidence-Based Protocols
The platform integrates comprehensive clinical knowledge:
- **Cognitive Processing Therapy (CPT)** - Resick, Monson, Chard protocols
- **Prolonged Exposure (PE)** - Foa, Hembree, Rothbaum methodology
- **EMDR** - Shapiro's 8-phase approach with bilateral stimulation
- **DBT Skills** - Linehan's mindfulness, distress tolerance, emotion regulation, interpersonal effectiveness
- **Safety Planning** - Stanley & Brown (2012) evidence-based crisis intervention
- **Grounding Techniques** - Najavits (Seeking Safety) and Van der Kolk (Body Keeps the Score)

### Research Integration
- **PubMed API** - Fetches latest trauma/PTSD research from medical journals (✅ 5 articles synced)
- **Knowledge Base** - PostgreSQL table storing clinical protocols and research papers (✅ 7 protocols initialized)
- **Continuous Learning** - Automated daily syncing of new trauma research (✅ Active)
- **Evidence Levels** - Categorizes by meta-analysis, RCT, clinical guidelines, expert consensus
- **Automatic Ingestion** - Seed data for core clinical protocols, de-duplication by source ID
- **Scheduled Sync** - Daily PubMed updates for latest trauma treatment research

### Crisis Assessment System
- Clinical risk factor analysis (previous attempts, mental health dx, access to means, social isolation)
- Protective factor identification (social support, treatment engagement, reasons for living)
- Warning sign detection (DSM-5 compliant)
- Evidence-based safety planning protocols
- 24/7 crisis resource recommendations

## External Dependencies

### Frontend
- React and React DOM for UI rendering
- Wouter for lightweight client-side routing
- TanStack Query (React Query) for data fetching
- Radix UI for accessible component primitives
- shadcn/ui for pre-built UI components
- Tailwind CSS for styling
- Web Speech API for voice functionality
- Lucide React for modern icon library

### Backend
- Express.js for API server
- OpenAI GPT-4o for clinical-grade AI responses
- PubMed API (NCBI E-utilities) for medical research
- Drizzle ORM for database operations
- Zod for validation
- Vite for development and build process

### Voice & Real-Time Features
**Cost-Effective Voice Architecture** (AWS Sponsored):
- **Browser Web Speech API** - Speech recognition (FREE, browser built-in)
- **OpenAI GPT-4 Text API** - AI responses (~$0.01 per response, much cheaper than Realtime)
- **AWS Polly Integration** - High-quality voice synthesis (✅ AWS sponsored, implemented)
  - Neural voices for natural, empathetic speech
  - Trauma-informed SSML prosody control
  - Recommended voices: Joanna (warm female), Matthew (calm male)
  - API endpoints: POST `/api/voice/synthesize`, GET `/api/voice/status`
  - Credentials: AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION configured

**Voice Mode Page** (`/voice`):
- Push-to-talk microphone interface
- Real-time transcription display
- Clinical AI responses with natural voice
- Trauma-informed conversation flow
- Processing and speaking indicators

**Alternative (Not Implemented):**
- OpenAI Realtime API - Speech-to-speech ($0.06/min input + $0.24/min output = expensive)
  - WebSocket infrastructure available at `/api/realtime-voice` if needed
  - Clinical trauma-informed instructions ready

### Planned Integrations
- Vector database for semantic search (embeddings)
- Clinical reporting and analytics dashboard

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
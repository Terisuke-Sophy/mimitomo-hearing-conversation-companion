# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Mimitomo is a hearing and conversation companion application designed to assist elderly users with real-time transcription and provide an AI conversation partner to combat loneliness and stimulate memories.

## Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Setup

Before running the application, set the `GEMINI_API_KEY` in `.env.local`:
```
GEMINI_API_KEY=your_api_key_here
```

## Architecture

### Core Structure
- **React + TypeScript** application built with Vite
- **Single Page Application** with view-based navigation (no routing library)
- **Component-based architecture** with functional components using hooks

### Key Directories
- `/components/` - UI components for each view (HearingAid, Conversation, Memories, Reminders, Profile)
- `/services/` - External service integrations:
  - `geminiService.ts` - Google Gemini AI integration for conversation and reminder extraction
  - `supabaseClient.ts` - Supabase database client (currently minimal implementation)

### Main Application Flow
1. `App.tsx` manages the current view state and renders the appropriate component
2. `BottomNav.tsx` provides navigation between five main views
3. Each view component is self-contained with its own state management

### View Components
- **HearingAid**: Real-time transcription interface with microphone access
- **Conversation**: AI chat interface using Gemini API
- **Memories**: Memory storage and retrieval system
- **Reminders**: Task and reminder management
- **Profile**: User profile and settings

### State Management
- Local component state with useState/useReducer
- No global state management library currently implemented
- Data persistence planned through Supabase integration

### Type System
All TypeScript interfaces and enums are defined in `types.ts`:
- `AppView` enum for navigation states
- Interfaces for `ChatMessage`, `Memory`, `Reminder`, `User`, `ProfileInfoItem`

### API Integration
The app uses Google Gemini API for:
- Generating conversational responses
- Extracting reminders from text
- API key is loaded via environment variable and passed through Vite's define config
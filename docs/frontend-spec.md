# iSense Scorecard Frontend Specification

This document provides the integration context for the Frontend application built over the iSense Scorecard ecosystem.

## 1. Technology Stack
- **Framework**: React 18 + Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Data Fetching & Caching**: TanStack Query (React Query) v5
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **HTTP Client**: Axios (configured in `frontend/src/api/client.ts`)

## 2. Core Routing
*   `/management`: Displays the list of configured Scorecards and Topic Mappings.
*   `/importer`: Displays the Smart AI Importer where business procedures are converted to structured criteria.
*   `/edit/:id`: Scorecard Editor screen. Uses `id="new"` for creating a fresh scorecard, otherwise loads data from API.

## 3. Scorecard Editor UI Behaviors (`ScorecardEditor.tsx`)
The editor is the most complex component, implementing several specific UX patterns:

### 3.1. Layered Structure
- **Layer 1: General (Nền tảng)** -> `options_type: "Yes/No/NA"`
- **Layer 2: Business (Nghiệp vụ)** -> `options_type: "Yes/No/NA"`
- **Layer 3: Audio Rules (Giám sát Âm thanh)** -> Complex component structure with nested active state settings.

### 3.2. Criteria Auto-Sizing
All criteria strings (`c.name`) use `<textarea rows={1}>` components that actively hook into `onInput` and `onFocus` to dynamically resize their height (`scrollHeight`), eliminating scrolling or text truncation.

### 3.3. Audio Rule Toggling and Auto-Save
The `audio_rules_data` model holds independent toggles for four primary audio criteria (`is_hold_time_enabled`, `is_speaker_ratio_enabled`, `is_interruptions_enabled`, `is_silence_enabled`).
- For existing Scorecards (`id !== 'new'`), toggling any boolean state will immediately trigger an API `updateScorecard` background mutation to auto-save and preserve editor dashboard continuity without the user having to press the root "LƯU SCORECARD" button.

## 4. Smart AI Importer Integration (`SmartImporter.tsx`)
- Users input business procedural text.
- Pushes to the isolated backend endpoint `POST /ai/generate-scorecard`.
- The frontend `generateMutation.mutate()` consumes the dynamic list combining global `SC-FALLBACK` standard criteria with generated dynamic business contexts.
- Forwards exactly reconstructed arrays directly into the React Router state to preconfigure `/edit/new`.

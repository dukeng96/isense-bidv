# iSense Scorecard Backend API Specification

This document serves as the integration context for the Frontend team to consume the iSense Scorecard API. The backend is built on **FastAPI** with **Pydantic** providing strict typing and validation.

**Base URL**: `http://localhost:8000` 
*(Start local dev server using: `cd backend && source venv/bin/activate && uvicorn main:app --reload`)*

---

## 1. Schema Definitions

### `Criterion`
```json
{
  "code": "GEN_01",
  "name": "Chào hỏi đúng kịch bản",
  "layer": "general", // "general" | "business" | "audio_rules"
  "options_type": "Yes/No/NA", // "Yes/No/NA" | "Yes/No"
  "yes_score": 10,
  "no_score": 0,
  "na_score": 10,
  "max_score": 10,
  // Only present if layer == "audio_rules"
  "audio_rules_data": {
    "max_hold_time_s": 30,
    "consultant_speaking_time_ratio_min_percent": 40,
    "consultant_speaking_time_ratio_max_percent": 70,
    "max_interruptions": 3,
    "max_silence_duration_s": 10,
    "overlapping_threshold_percent": 20,
    "is_hold_time_enabled": true,
    "is_speaker_ratio_enabled": true,
    "is_interruptions_enabled": true,
    "is_silence_enabled": true
  }
}
```

### `Scorecard`
```json
{
  "id": "SC-A1B2C3D4",
  "name": "Tiêu chuẩn CSKH 2024",
  "description": "Bộ tiêu chí chung",
  "status": "Đang hoạt động",
  "threshold": 85,
  "is_global_fallback": false,
  "criteria": [ /* Array of Criterion */ ]
}
```

---

## 2. AI Smart Importer Services

### `POST /ai/generate-scorecard`
Mock endpoint that processes natural language business procedures and returns generated breakdown of criteria across 3 UI layers.

**Request Body:**
```json
{
  "goal": "Optional procedure goal",
  "raw_text": "B1: Chào hỏi khách hàng... (min length 10 chars)"
}
```

**Response (200 OK):** `List[Criterion]` corresponding exactly to the pre-filled structure from the UI screenshot, mixed dynamically with the Global Fallback's General and Audio rules.

---

## 3. Scorecard CRUD Services

### `GET /scorecards`
Get all created scorecards.
- **Response**: `List[Scorecard]`

### `POST /scorecards`
Created a new scorecard draft/final version.
- **Request Body**: `Scorecard` (without `id` field)
- **Response**: `Scorecard` (returns mutated object with generated `id`)

### `GET /scorecards/{sc_id}`
Get detail by ID.

### `PUT /scorecards/{sc_id}`
Update an existing scorecard by completely replacing data.
- **Request Body**: `Scorecard`

### `DELETE /scorecards/{sc_id}`
Deletes a scorecard. Returns `204 No Content`.

---

## 4. Topic Mapping Services

*Topics have unique IDs (e.g., `T-102`) and names.*

### `GET /mappings`
Get current scorecard <-> topic assignments.

### `POST /mappings`
Assign a scorecard to a specific topic.
**Request Body:**
```json
{
  "topic_id": "T-102",
  "topic_name": "Khóa SmartKids",
  "scorecard_id": "SC-A1B2C3D4"
}
```
*(Throws 400 if `scorecard_id` does not exist)*

### `DELETE /mappings/{topic_id}`
Remove a topic mapping. Returns `204`.

### `PUT /mappings/global-fallback`
Sets which scorecard will be used as the ultimate fallback when topics aren't explicitly mapped.
**Request Body:**
```json
{"scorecard_id": "SC-A1B2C3D4"}
```

---

## 5. Core Scoring Logic Resolver

This is the main endpoint the Call Analysis Engine will hit when a call finishes to determine *how* to grade it based on detected topic.

### `GET /scoring/scorecard?topic_name={name}`
Resolves mapping using standard fallback logic:
1. Lookup mapping by `topic_name` case-insensitively. If matched, returns mapped `Scorecard`.
2. Map not found? Read current **Global Fallback** scorecard, and return it.
3. If no mappings AND no fallbacks exist, returns `404 Not Found`.

**Response (200 OK):** `Scorecard`

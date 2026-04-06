# Transcriptor Frontend

Vue 3 interface for audio transcription, history browsing, and structured summaries.

## Stack

- Vue 3
- Vite
- Plain CSS with light/dark themes

## Features

- Audio upload with drag and drop
- Left sidebar for private history
- Center panel for the full transcript
- Right panel for a structured summary
- Theme toggle
- API integration ready for Vercel -> Render deployment

## Environment

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Set the backend API base URL:

- Local: `http://localhost:8080/api`
- Production: your Render API URL

## Run locally

```bash
npm install
npm run dev
```

The app runs on `http://localhost:5173`.

## Auth model for MVP

Google OAuth is intentionally deferred. For now, the browser creates a stable local guest id and sends it in `x-user-id`. This keeps the data contract aligned with future real authentication without blocking UI and API work now.

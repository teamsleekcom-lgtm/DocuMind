# DocuMind Agent API

This document provides technical instructions for AI agents working on the DocuMind codebase.

## Project Structure

- `/`: Root directory (Java/Spring Boot backend).
- `/frontend`: React application.
- `/frontend/src-tauri`: Tauri (Rust) shell and bridge.
- `/landing`: Static marketing landing page.

## Core Commands

### Backend (Java)
- Build: `./gradlew clean build`
- Run: `./gradlew bootRun`

### Frontend (React)
- Dev: `cd frontend && npm run dev` (proxies to `localhost:8080`)
- Install: `cd frontend && npm install`

### Desktop (Tauri)
- Dev: `cd frontend && npm run tauri-dev`
- Build: `cd frontend && npm run tauri-build`

## Key Integration Points

### 1. Sidecar Management
The Rust backend (`frontend/src-tauri/src/commands/backend.rs`) manages the Java JAR as a sidecar. It handles:
- Finding a bundled JRE.
- Finding the `stirling-pdf.jar` in the `libs` resource directory.
- Spawning the process with specific system properties (e.g., `-DDOCUMIND_TAURI_MODE=true`).
- Monitoring the "running on port: PORT" log line to dynamically find the web server port.

### 2. Branding Overrides
DocuMind uses a "stub/shadow" component pattern for branding.
- Core logic is in `@app/*` (e.g., `frontend/src/core`).
- Desktop-specific overrides are in `frontend/src/desktop`.
- Always import from `@app/*` to allow the build system to resolve the correct implementation.

### 3. Update System
Updates are handled by `UpdateContext.tsx` using the `tauri-plugin-updater`.
- Checks for updates on startup.
- Downloads in the background.
- Notifies the user via `UpdateToast.tsx` once ready to install.

## Maintenance Guidelines

- **Translations:** Always update `en-GB` in `frontend/public/locales/en-GB/translation.toml`.
- **Dependencies:** New tools should be registered in `frontend/src/data/toolRegistry.ts`.
- **Backend Port:** Always use `get_backend_port` tauri command to get the current local backend URI.

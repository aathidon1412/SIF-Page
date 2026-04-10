# SIF-Page

A robust, TypeScript-based booking and scheduling management system. This project features advanced conflict detection, automated revocation handling, and a strictly typed validation architecture.

## 🚀 Overview

The SIF-Page project is split into a **frontend** and **backend** structure. It is designed to handle complex scheduling scenarios, ensuring data integrity through rigorous backend validation and conflict checking logic.

**Languages:** TypeScript (79%), JavaScript (20%)

## ✨ Key Features & Architecture

This repository implements several critical subsystems. Detailed documentation for each is available in the root directory:

### 1. Booking & Conflict Management
*   **Conflict Detection:** An automated system to prevent overlapping schedules.
*   **Time Constraints:** Enforces logic for booking duration and allowable times.

### 2. Validation & Security
*   **Backend Validation:** A centralized architecture to validate all incoming requests.
*   **Test Scenarios:** Comprehensive scenarios covering date/time edge cases.

### 3. Reliability & Maintenance
*   **Revocation System:** Handles the logic for revoking bookings and notifying users, including recent fixes for notifications.
*   **Backup & Restore:** Integrated procedures for data safety.
*   **Error Handling:** Standardized testing and error reporting protocols.

## Local Setup (Single Command)

Install dependencies for both frontend and backend:

```powershell
npm run install:all
```

Run frontend and backend together in development:

```powershell
npm run dev
```

Build and run using root scripts:

```powershell
npm run build
npm run start
```

## Render Deployment (Single Web Service)

This repository is configured so one Render Web Service can host both API and frontend.

How it works:
1. Root build command runs the frontend build.
2. Backend serves API routes under `/api/*`.
3. Backend also serves `frontend/dist` as static files for the web app.

Use either `render.yaml` (Blueprint deploy) or manual Web Service settings:

Manual settings:
1. Environment: Node
2. Build Command: `npm run build`
3. Start Command: `npm run start`
4. Root Directory: leave as repository root

Required environment variables on Render:
1. `MONGODB_URI`
2. `ADMIN_USER`
3. `ADMIN_PASS`
4. `JWT_SECRET`
5. `SMTP_HOST`
6. `SMTP_PORT`
7. `SMTP_USER`
8. `SMTP_PASS`
9. `FRONTEND_URL` (set to your Render URL, for example `https://your-service.onrender.com`)

Reference sample env file:
1. `backend/.env.example`

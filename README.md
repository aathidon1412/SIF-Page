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

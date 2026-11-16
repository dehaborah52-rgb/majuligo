# MajuliGo 🛵

> **MajuliGo** is a complete, production-grade bike-taxi platform built for the island district of Majuli, Assam, and designed for nationwide expansion across India.

![MajuliGo Brand Logo](docs/brand/majuligo-logo.svg)

---

## 1. Project Overview

MajuliGo connects riders needing quick, affordable transportation with verified local motorcycle captains. It is built as a unified monorepo ecosystem containing:

1. **Rider Mobile App** (`apps/rider`): Clean, low-bandwidth optimized mobile application for booking bike rides, tracking captain arrival in real-time, and paying via cash or UPI.
2. **Captain Mobile App** (`apps/captain`): Dedicated driver application with an online/offline toggle, ride radar, turn-by-turn routing, document submission, and earnings tracking.
3. **Admin Web Portal** (`apps/admin`): Next.js 15 operational dashboard for KYC document approval, live island fleet monitoring, dynamic geo-fenced fare rules, and dispute resolution.
4. **Backend & Realtime API** (`apps/backend`): High-throughput Fastify server integrated with Socket.io for sub-second GPS location streaming, geospatial matching, and atomic ride state transitions.
5. **PostGIS Database** (`packages/database`): Relational PostgreSQL 16 schema with PostGIS spatial indexing (`ST_DWithin`) for location-aware matching within Majuli.
6. **Shared Domain Library** (`packages/shared`): Single source of truth for TypeScript interfaces, state machine enums, constants, and Zod validation schemas.

---

## 2. Technology Stack & Decision Rationale

| Layer | Technology | Decision Rationale |
| :--- | :--- | :--- |
| **Mobile Apps** | React Native (Expo SDK 52) | Single TypeScript codebase for Android (primary) and iOS (future), instant device testing via Expo Go, and free EAS cloud builds. |
| **Backend API** | Node.js + Fastify 5 | High performance, ultra-low memory footprint on budget servers, built-in schema validation, and smooth Socket.io WebSocket integration. |
| **Database & GIS** | PostgreSQL 16 + PostGIS (Supabase) | Native geospatial geometry types, sub-second spatial queries (`GIST` indexing), Row-Level Security (RLS), and zero upfront cost on free tiers. |
| **Admin Portal** | Next.js 15 (React 19, Tailwind CSS) | Fast server-side rendering, responsive table views, and unified TypeScript domain schemas. |
| **Maps & Routing** | MapLibre GL + OpenStreetMap / OSRM | 100% free open-source map tiles and road routing engine, eliminating expensive Google Maps per-request API fees. |
| **Payments** | Cash + Native UPI Intent + Razorpay | Tailored to Indian rural/suburban mobility with zero gateway fees for direct UPI apps (GPay, PhonePe, Paytm). |

---

## 3. Monorepo Repository Structure

```text
majuligo/
├── apps/
│   ├── admin/             # Next.js 15 Web Administration Portal
│   ├── backend/           # Fastify + Socket.io Real-Time API Engine
│   ├── captain/           # React Native / Expo Captain/Driver Mobile App
│   └── rider/             # React Native / Expo Rider Mobile App
├── packages/
│   ├── database/          # PostgreSQL + PostGIS SQL Schemas & Migrations
│   └── shared/            # Shared Domain Enums, Types, Constants & Zod Schemas
├── docs/
│   ├── brand/             # Vector Brand Assets (Logo, Icons)
│   └── PHASE_1_REPORT.md  # Detailed Phase 1 Audit & Execution Report
├── ARCHITECTURE.md        # Comprehensive Architecture & Communication Flows
├── DATABASE.md            # Relational Schema Design & Spatial Indexing
├── SECURITY.md            # Security Model, Privacy & Audit Controls
├── PROGRESS.md            # 10-Phase Roadmap & Current Development State
├── package.json           # Workspace scripts & Root configuration
└── pnpm-workspace.yaml    # pnpm workspace definition
```

---

## 4. Development Setup & Installation

### Prerequisites
* **Node.js**: v20+ (Verified on v26)
* **pnpm**: v11+ (`npm install -g pnpm`)
* **Git**: Installed
* **Android Device or Emulator**: For testing mobile apps

### Step-by-Step Local Setup

1. **Clone & Install Workspace Dependencies**:
   ```bash
   git clone <repo-url> majuligo
   cd majuligo
   pnpm install
   ```

2. **Configure Environment Variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your local settings if needed
   ```

3. **Build Shared Library**:
   ```bash
   cd packages/shared
   pnpm run build
   pnpm run test
   ```

4. **Run the Backend API**:
   ```bash
   cd apps/backend
   pnpm run dev
   # Server runs at http://localhost:4000
   # Health check: http://localhost:4000/health
   ```

5. **Run the Admin Web Portal**:
   ```bash
   cd apps/admin
   pnpm run dev
   # Admin portal runs at http://localhost:3000
   ```

6. **Run Mobile Applications (Expo)**:
   ```bash
   # In terminal 1 (Rider App):
   cd apps/rider
   pnpm run start

   # In terminal 2 (Captain App):
   cd apps/captain
   pnpm run start
   ```

---

## 5. Development Roadmap & Phase Progress

| Phase | Description | Status |
| :---: | :--- | :---: |
| **Phase 1** | Project Setup and Architecture | **COMPLETE** |
| **Phase 2** | UI/UX Design and Application Foundation | Queued |
| **Phase 3** | Backend and Database Development | Queued |
| **Phase 4** | Captain Application Development | Queued |
| **Phase 5** | Rider Application Development | Queued |
| **Phase 6** | Admin Panel Development | Queued |
| **Phase 7** | Complete System Testing | Queued |
| **Phase 8** | Google Play Store Preparation | Queued |
| **Phase 9** | Closed Testing | Queued |
| **Phase 10** | Production Release | Queued |

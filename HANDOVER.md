# Project Lumen - Handover Document

## Project Overview
**Lumen** is a Tourist Safety Monitoring System designed to track location data from mobile users, visualize it on a central dashboard, and perform analysis (AI). It is built as a Monorepo using Turborepo.

## Architecture

```mermaid
graph TD
    User[Mobile User] -->|Location Updates| MobileApp[Mobile App (Expo)]
    MobileApp -->|Socket.io (update_location)| API[API Gateway (Express)]
    API -->|Socket.io (location_update)| Dashboard[Web Dashboard (Next.js)]
    API -->|HTTP| AIService[AI Engine (Python)]
    Services -->|Simulated Data| API
```

## Repository Structure
The project follows a standard Turborepo structure:

| Directory | Type | Stack | Description |
|-----------|------|-------|-------------|
| `apps/mobile` | Mobile App | React Native (Expo) | Tracks user location and sends updates to API. |
| `apps/dashboard` | Web App | Next.js, React Leaflet | Visualization dashboard for monitoring tourists. |
| `services/api` | Backend | Express, Socket.io | Central hub. Handles Auth, Geo-routes, and real-time socket communication. |
| `services/ai` | Service | Python, FastAPI | Placeholder for AI logic (e.g., anomaly detection). |

## Current Status

### 1. Monorepo Setup (✅ Done)
- Turborepo configured for workspace management.
- Shared configs might be present in `packages/` (standard setup).

### 2. Backend API (`services/api`) (🚧 In Progress)
- **Implemented**: 
    - Basic Express server setup.
    - Socket.io integration for real-time communication.
    - `authRoutes` and `geoRoutes` (Placeholders/Basic).
    - **Simulation**: A simulation script moves 3 fake tourists continuously.
- **Data Layer**: 
    - **PostgreSQL + PostGIS**: Configured in `docker-compose.yml` (Port 5433). Likely used with Prisma for relational/geo data.
    - **MongoDB**: Configured in `docker-compose.yml`. Likely used with Mongoose for logs/unstructured data.

### 3. Mobile App (`apps/mobile`) (🚧 In Progress)
- **Implemented**:
    - Location tracking using `expo-location`.
    - Socket connection to API.
    - Emits `update_location` event with user coordinates.
- **Note**: Hardcoded to `http://10.0.2.2:3001` (Android) or `localhost` (iOS).

### 4. Web Dashboard (`apps/dashboard`) (🚧 In Progress)
- **Implemented**:
    - Interactive Map using `react-leaflet`.
    - Listens to `location_update` events.
    - Displays markers for tourists.

### 5. AI Service (`services/ai`) (❌ Pending)
- **Status**: Skeleton "Hello World" FastAPI app.
- **To Do**: Implement actual logical processing.

## Workflows Implemented
1. **Simulation Mode**: API runs a simulation (3 tourists) -> Broadcasts to Dashboard -> Dashboard updates map.
2. **Real Tracking**: Mobile App tracks location -> Sends to API -> API Broadcasts -> Dashboard updates map.
   > **Note**: Currently, both Simulation and Mobile app emit to the same socket channel (`location_update`). This might cause data flickering if both run simultaneously.

## Next Steps for Development

1. **Database Implementation**: 
   - Initialize Prisma with the PostGIS schema (for User/Location storage).
   - Ensure MongoDB connection is robust (for Audit/Event logs).

2. **Integration Refinement**:
   - Differentiate between "Simulated" and "Real" data in the Dashboard.
   - Maybe add a toggle in Dashboard to view "Live" vs "Simulation".

3. **AI Logic**:
   - Connect API to AI Service (via HTTP calls).
   - Implement data processing (e.g., "Is user entering a danger zone?").

4. **Authentication**:
   - Validated Auth flows on Mobile and Dashboard (JWT tokens are present in dependencies).

5. **Deployment**:
   - Dockerize services (docker-compose.yml exists in root).

## How to Run (Development)

1. **Start Backend**:
   ```bash
   turbo dev --filter=api
   # Starts Express on port 3001 (simulation starts auto)
   ```

2. **Start Dashboard**:
   ```bash
   turbo dev --filter=dashboard
   # Open http://localhost:3000
   ```

3. **Start Mobile**:
   ```bash
   cd apps/mobile
   npx expo start
   # Press 'a' for Android, 'i' for iOS
   ```

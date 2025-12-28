# Incident Tracking Client

Frontend React application for real-time incident tracking.

## Tech Stack

- React 18
- Redux Toolkit
- Socket.IO Client
- Leaflet Maps
- Tailwind CSS
- React Router

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file (optional, defaults work for local development):
```env
VITE_API_URL=http://localhost:5000/api/incidents
VITE_SOCKET_URL=http://localhost:5000
```

3. Start the development server:
```bash
npm run dev
```

The client will start on `http://localhost:5173`

## Pages

- `/feed` - Incident feed dashboard with live map
- `/report` - Report a new incident
- `/incidents/:id` - View incident details
- `/verify` - Admin verification dashboard

## Features

- Real-time updates via Socket.IO
- Interactive map with incident markers
- Filter incidents by category, status, and severity
- Location-based nearby incident queries
- Media upload support
- Status verification workflow


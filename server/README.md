# Incident Tracking Server

Backend server for real-time incident tracking application.

## Tech Stack

- Node.js + Express
- MongoDB (Mongoose)
- Socket.IO for real-time updates

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/incident-tracking
CLIENT_URL=http://localhost:5173
```

3. Make sure MongoDB is running locally, or update `MONGODB_URI` to your MongoDB connection string.

4. Start the server:
```bash
npm run dev
```

The server will start on `http://localhost:5000`

## API Endpoints

- `GET /api/incidents` - Get all incidents (with optional filters)
- `GET /api/incidents/:id` - Get single incident
- `POST /api/incidents` - Create new incident
- `PATCH /api/incidents/:id/status` - Update incident status
- `DELETE /api/incidents/:id` - Delete incident
- `GET /api/incidents/nearby?lng=&lat=&radius=` - Get nearby incidents

## Socket.IO Events

- `incident:new` - Emitted when a new incident is created
- `incident:update` - Emitted when an incident is updated
- `incident:delete` - Emitted when an incident is deleted
- `join:incident` - Join a specific incident room
- `leave:incident` - Leave a specific incident room


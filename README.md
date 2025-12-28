# Real-Time Incident Tracking Web Application

A full-stack real-time incident tracking system built with React, Redux Toolkit, Node.js, Express, MongoDB, and Socket.IO.

## 🚀 Features

- **Citizen Incident Reporting**: Report incidents with location, category, severity, and media
- **Live Incident Feed**: Real-time dashboard with interactive map and incident list
- **Incident Details**: Detailed view with timeline, media, and nearby incidents
- **Verification Dashboard**: Admin panel to verify and manage incident status
- **Real-Time Updates**: Socket.IO integration for instant updates across all clients
- **Geo Features**: Location-based queries, nearby incidents, and map clustering
- **Advanced Filtering**: Filter by category, status, and severity

## 🛠 Tech Stack

### Frontend
- React 18
- Redux Toolkit
- Socket.IO Client
- Leaflet Maps (react-leaflet)
- Tailwind CSS
- React Router

### Backend
- Node.js + Express
- MongoDB (Mongoose)
- Socket.IO
- Geo-spatial queries with 2d sphere indexing

## 📁 Project Structure

```
├── server/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── models/
│   │   │   └── Incident.model.js
│   │   ├── controllers/
│   │   │   └── incident.controller.js
│   │   ├── routes/
│   │   │   └── incident.routes.js
│   │   ├── middlewares/
│   │   │   └── error.middleware.js
│   │   ├── sockets/
│   │   │   └── incident.socket.js
│   │   ├── utils/
│   │   │   └── geo.utils.js
│   │   ├── app.js
│   │   └── server.js
│   └── package.json
│
├── client/
│   ├── src/
│   │   ├── app/
│   │   │   └── store.js
│   │   ├── features/
│   │   │   └── incidents/
│   │   │       ├── incidentSlice.js
│   │   │       ├── incidentAPI.js
│   │   │       └── incidentSelectors.js
│   │   ├── pages/
│   │   │   ├── ReportIncident.jsx
│   │   │   ├── IncidentFeedDashboard.jsx
│   │   │   ├── IncidentDetails.jsx
│   │   │   └── IncidentVerification.jsx
│   │   ├── components/
│   │   │   ├── MapView.jsx
│   │   │   ├── IncidentCard.jsx
│   │   │   ├── Filters.jsx
│   │   │   └── StatusBadge.jsx
│   │   ├── sockets/
│   │   │   └── socket.js
│   │   ├── services/
│   │   │   └── map.service.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
└── README.md
```

## 🚦 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (running locally or MongoDB Atlas connection string)
- npm or yarn

### Installation

1. **Clone the repository** (or navigate to the project directory)

2. **Set up the server:**
   ```bash
   cd server
   npm install
   ```
   
   Create a `.env` file:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/incident-tracking
   CLIENT_URL=http://localhost:5173
   ```

3. **Set up the client:**
   ```bash
   cd ../client
   npm install
   ```
   
   Create a `.env` file (optional):
   ```env
   VITE_API_URL=http://localhost:5000/api/incidents
   VITE_SOCKET_URL=http://localhost:5000
   ```

4. **Start MongoDB** (if running locally):
   ```bash
   mongod
   ```

5. **Start the server:**
   ```bash
   cd server
   npm run dev
   ```

6. **Start the client:**
   ```bash
   cd client
   npm run dev
   ```

7. **Open your browser:**
   Navigate to `http://localhost:5173`

## 📄 API Endpoints

### Incidents
- `GET /api/incidents` - Get all incidents (with query filters)
- `GET /api/incidents/:id` - Get single incident
- `POST /api/incidents` - Create new incident
- `PATCH /api/incidents/:id/status` - Update incident status
- `DELETE /api/incidents/:id` - Delete incident
- `GET /api/incidents/nearby?lng=&lat=&radius=` - Get nearby incidents

### Query Parameters
- `category`: Filter by category (Fire, Accident, Crime, Disaster)
- `status`: Filter by status (pending, verified, resolved)
- `severity`: Filter by severity (1-5)
- `minSeverity`: Minimum severity
- `maxSeverity`: Maximum severity

## 🔌 Socket.IO Events

### Client → Server
- `join:incident` - Join a specific incident room
- `leave:incident` - Leave a specific incident room

### Server → Client
- `incident:new` - New incident created
- `incident:update` - Incident updated
- `incident:delete` - Incident deleted

## 🗄️ Database Schema

```javascript
{
  title: String,
  description: String,
  category: String, // Fire, Accident, Crime, Disaster
  severity: Number, // 1-5
  status: String, // pending, verified, resolved
  location: {
    type: "Point",
    coordinates: [lng, lat]
  },
  media: [String],
  createdAt: Date,
  updatedAt: Date
}
```

## 🎯 Pages

1. **Report Incident** (`/report`)
   - Form to submit new incidents
   - Interactive map for location selection
   - Media upload support
   - Category and severity selection

2. **Incident Feed** (`/feed`)
   - Live map with incident markers
   - Sidebar with incident list
   - Real-time updates
   - Filtering capabilities

3. **Incident Details** (`/incidents/:id`)
   - Full incident information
   - Media gallery
   - Location map
   - Timeline updates
   - Nearby incidents

4. **Verification Dashboard** (`/verify`)
   - Admin panel for pending incidents
   - Status update actions
   - Verification workflow

## 🔐 Authentication

**Note:** Authentication is intentionally NOT implemented. The user specified they will use Clerk separately.

## 📝 Notes

- The application uses normalized Redux state for optimal performance
- Geo queries use MongoDB's 2dsphere index for efficient location-based searches
- Socket.IO provides real-time updates across all connected clients
- Media uploads are stored as file paths/names (implement actual storage service for production)
- Tailwind CSS provides responsive, modern UI styling

## 🚀 Production Deployment

For production deployment:

1. Update environment variables with production URLs
2. Configure proper media storage (AWS S3, Cloudinary, etc.)
3. Add authentication middleware
4. Enable HTTPS
5. Set up proper CORS policies
6. Configure MongoDB indexes for performance
7. Add rate limiting and security middleware
8. Set up monitoring and logging

## 📄 License

This project is provided as-is for educational and development purposes.


import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getSeverityColor, getCategoryIcon } from '../services/map.service';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const DEFAULT_CENTER = [40.7128, -74.0060];
const DEFAULT_ZOOM = 13;

// Component to handle map updates when incidents change
const MapUpdater = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, zoom || map.getZoom());
    }
  }, [center, zoom, map]);
  return null;
};

// Component to handle map click events
const MapClickHandler = ({ clickable, onMapClick }) => {
  useMapEvents({
    click: (e) => {
      if (clickable && onMapClick) {
        const { lat, lng } = e.latlng;
        onMapClick([lat, lng]);
      }
    },
  });
  return null;
};

const MapView = ({
  incidents = [],
  selectedIncident = null,
  onMarkerClick,
  clickable = false,
  onMapClick,
  selectedLocation = null, // New prop for location picker
  center = DEFAULT_CENTER,
  zoom = DEFAULT_ZOOM,
}) => {
  const mapRef = useRef(null);

  const createCustomIcon = (incident) => {
    const color = getSeverityColor(incident.severity);
    const iconHtml = `
      <div style="
        background-color: ${color};
        width: 30px;
        height: 30px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 2px solid white;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      ">
        <span style="
          transform: rotate(45deg);
          color: white;
          font-size: 14px;
          font-weight: bold;
        ">${incident.severity}</span>
      </div>
    `;

    return L.divIcon({
      html: iconHtml,
      className: 'custom-marker',
      iconSize: [30, 30],
      iconAnchor: [15, 30],
    });
  };

  return (
    <div className="w-full h-full relative">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        whenCreated={(map) => {
          mapRef.current = map;
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapClickHandler clickable={clickable} onMapClick={onMapClick} />

        {/* Show selected location marker when in clickable mode */}
        {clickable && selectedLocation && (
          <Marker
            position={selectedLocation}
            icon={L.divIcon({
              className: 'selected-location-marker',
              html: `
                <div style="
                  background-color: #3b82f6;
                  width: 24px;
                  height: 24px;
                  border-radius: 50%;
                  border: 3px solid white;
                  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                "></div>
              `,
              iconSize: [24, 24],
              iconAnchor: [12, 12],
            })}
          />
        )}

        {incidents.map((incident) => {
          if (!incident.location?.coordinates || incident.location.coordinates.length !== 2) {
            return null;
          }

          const [lng, lat] = incident.location.coordinates;
          const isSelected = selectedIncident?._id === incident._id;

          return (
            <Marker
              key={incident._id}
              position={[lat, lng]}
              icon={createCustomIcon(incident)}
              eventHandlers={{
                click: () => {
                  if (onMarkerClick) {
                    onMarkerClick(incident);
                  }
                },
              }}
            >
              <Popup>
                <div className="p-2">
                  <h4 className="font-semibold text-sm mb-1">{incident.title}</h4>
                  <p className="text-xs text-gray-600 mb-1">{incident.category}</p>
                  <p className="text-xs text-gray-500">Severity: {incident.severity}/5</p>
                  <p className="text-xs text-gray-500">Status: {incident.status}</p>
                </div>
              </Popup>
            </Marker>
          );
        })}

        <MapUpdater
          center={
            selectedIncident
              ? [
                  selectedIncident.location.coordinates[1],
                  selectedIncident.location.coordinates[0],
                ]
              : center
          }
          zoom={selectedIncident ? 15 : zoom}
        />
      </MapContainer>

      {clickable && (
        <div className="absolute top-4 left-4 z-[1000] bg-blue-600 text-white px-4 py-2 rounded-md shadow-lg">
          Click on map to set location
        </div>
      )}
    </div>
  );
};

export default MapView;


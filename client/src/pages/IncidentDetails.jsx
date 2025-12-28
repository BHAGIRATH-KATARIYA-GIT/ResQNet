import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchIncidentById, fetchNearbyIncidents } from '../features/incidents/incidentSlice';
import {
  selectCurrentIncident,
  selectNearbyIncidents,
  selectLoading,
} from '../features/incidents/incidentSelectors';
import MapView from '../components/MapView';
import StatusBadge from '../components/StatusBadge';
import IncidentCard from '../components/IncidentCard';
import { getCategoryIcon, getSeverityColor } from '../services/map.service';
import { joinIncidentRoom, leaveIncidentRoom } from '../sockets/socket';

const IncidentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const incident = useSelector(selectCurrentIncident);
  const nearbyIncidents = useSelector(selectNearbyIncidents);
  const loading = useSelector(selectLoading);

  useEffect(() => {
    if (id) {
      dispatch(fetchIncidentById(id));
      joinIncidentRoom(id);
    }

    return () => {
      if (id) {
        leaveIncidentRoom(id);
      }
    };
  }, [id, dispatch]);

  useEffect(() => {
    // Fetch nearby incidents when incident loads
    if (incident?.location?.coordinates) {
      const [lng, lat] = incident.location.coordinates;
      dispatch(fetchNearbyIncidents({ lng, lat, radius: 5 }));
    }
  }, [incident, dispatch]);

  if (loading && !incident) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading incident details...</p>
        </div>
      </div>
    );
  }

  if (!incident) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Incident not found</h2>
          <button
            onClick={() => navigate('/feed')}
            className="text-blue-600 hover:text-blue-800"
          >
            Back to Feed
          </button>
        </div>
      </div>
    );
  }

  const severityColor = getSeverityColor(incident.severity);
  const categoryIcon = getCategoryIcon(incident.category);
  const [lng, lat] = incident.location?.coordinates || [0, 0];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/feed')}
            className="text-blue-600 hover:text-blue-800 mb-4 flex items-center gap-2"
          >
            ← Back to Feed
          </button>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-4xl">{categoryIcon}</span>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{incident.title}</h1>
                <p className="text-gray-600 mt-1">
                  Reported {new Date(incident.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
            <StatusBadge status={incident.status} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Incident Details */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Details</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Description</h3>
                  <p className="text-gray-900">{incident.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Category</h3>
                    <p className="text-gray-900">{incident.category}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Severity</h3>
                    <p
                      className={`font-bold ${
                        severityColor === 'red'
                          ? 'text-red-600'
                          : severityColor === 'orange'
                          ? 'text-orange-600'
                          : severityColor === 'yellow'
                          ? 'text-yellow-600'
                          : severityColor === 'blue'
                          ? 'text-blue-600'
                          : 'text-green-600'
                      }`}
                    >
                      {incident.severity}/5
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Location</h3>
                  <p className="text-gray-900">
                    {lat.toFixed(6)}, {lng.toFixed(6)}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Status</h3>
                  <StatusBadge status={incident.status} />
                  {incident.status === 'verified' && (
                    <div className="mt-2 flex items-center gap-2 text-green-600">
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-sm font-medium">Verified</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Media */}
            {incident.media && incident.media.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Media</h2>
                <div className="grid grid-cols-2 gap-4">
                  {incident.media.map((mediaUrl, index) => (
                    <div key={index} className="relative">
                      <img
                        src={mediaUrl}
                        alt={`Media ${index + 1}`}
                        className="w-full h-64 object-cover rounded-lg border border-gray-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Location Map */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Location</h2>
              <div className="h-96 rounded-lg overflow-hidden border border-gray-300">
                <MapView
                  incidents={[incident]}
                  selectedIncident={incident}
                  center={[lat, lng]}
                  zoom={15}
                />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Timeline */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Timeline</h2>
              <div className="space-y-4">
                <div className="border-l-2 border-blue-500 pl-4">
                  <p className="text-sm font-medium text-gray-900">Incident Created</p>
                  <p className="text-xs text-gray-500">
                    {new Date(incident.createdAt).toLocaleString()}
                  </p>
                </div>
                {incident.status === 'verified' && (
                  <div className="border-l-2 border-green-500 pl-4">
                    <p className="text-sm font-medium text-gray-900">Incident Verified</p>
                    <p className="text-xs text-gray-500">
                      {new Date(incident.updatedAt).toLocaleString()}
                    </p>
                  </div>
                )}
                {incident.status === 'resolved' && (
                  <div className="border-l-2 border-purple-500 pl-4">
                    <p className="text-sm font-medium text-gray-900">Incident Resolved</p>
                    <p className="text-xs text-gray-500">
                      {new Date(incident.updatedAt).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Nearby Incidents */}
            {nearbyIncidents && nearbyIncidents.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Nearby Incidents ({nearbyIncidents.length})
                </h2>
                <div className="space-y-3">
                  {nearbyIncidents
                    .filter((item) => item._id !== incident._id)
                    .slice(0, 3)
                    .map((nearbyIncident) => (
                      <IncidentCard key={nearbyIncident._id} incident={nearbyIncident} />
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


export default IncidentDetails;


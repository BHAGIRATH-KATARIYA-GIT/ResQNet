import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchIncidents } from '../features/incidents/incidentSlice';
import { selectFilteredIncidents, selectLoading } from '../features/incidents/incidentSelectors';
import { selectIsAdminAuthenticated } from '../features/admin/adminSelectors';
import MapView from '../components/MapView';
import IncidentCard from '../components/IncidentCard';
import Filters from '../components/Filters';
import { DEFAULT_CENTER } from '../services/map.service';

const IncidentFeedDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const incidents = useSelector(selectFilteredIncidents);
  const loading = useSelector(selectLoading);
  const isAdminAuthenticated = useSelector(selectIsAdminAuthenticated);

  const [selectedIncident, setSelectedIncident] = useState(null);
  const [mapCenter, setMapCenter] = useState(DEFAULT_CENTER);

  useEffect(() => {
    dispatch(fetchIncidents());
  }, [dispatch]);

  useEffect(() => {
    // Update map center when incidents change
    if (incidents.length > 0 && !selectedIncident) {
      const firstIncident = incidents[0];
      if (firstIncident.location?.coordinates) {
        const [lng, lat] = firstIncident.location.coordinates;
        setMapCenter([lat, lng]);
      }
    }
  }, [incidents, selectedIncident]);

  const handleMarkerClick = (incident) => {
    setSelectedIncident(incident);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Incident Feed</h1>
            <div className="flex gap-3">
              {isAdminAuthenticated ? (
                <button
                  onClick={() => navigate('/verify')}
                  className="px-4 py-2 border border-gray-300 rounded-md font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Verification
                </button>
              ) : (
                <button
                  onClick={() => navigate('/admin-login')}
                  className="px-4 py-2 border border-blue-300 rounded-md font-medium text-blue-700 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Admin Sign In
                </button>
              )}
              <button
                onClick={() => navigate('/report')}
                className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                + Report Incident
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar */}
        <div className="w-96 bg-white border-r border-gray-200 flex flex-col">
          {/* Filters */}
          <div className="p-4 border-b border-gray-200">
            <Filters />
          </div>

          {/* Incident Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {loading && incidents.length === 0 ? (
              <div className="text-center py-8 text-gray-500">Loading incidents...</div>
            ) : incidents.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No incidents found</div>
            ) : (
              incidents.map((incident) => (
                <IncidentCard key={incident._id} incident={incident} />
              ))
            )}
          </div>

          {/* Stats */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="text-sm text-gray-600">
              <span className="font-medium">{incidents.length}</span> incident
              {incidents.length !== 1 ? 's' : ''} shown
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="flex-1 relative">
          <MapView
            incidents={incidents}
            selectedIncident={selectedIncident}
            onMarkerClick={handleMarkerClick}
            center={selectedIncident
              ? [
                  selectedIncident.location.coordinates[1],
                  selectedIncident.location.coordinates[0],
                ]
              : mapCenter}
            zoom={selectedIncident ? 15 : 13}
          />
        </div>
      </div>
    </div>
  );
};

export default IncidentFeedDashboard;


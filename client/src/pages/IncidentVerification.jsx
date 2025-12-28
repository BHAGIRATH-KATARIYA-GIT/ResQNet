import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchIncidents, updateIncidentStatus } from '../features/incidents/incidentSlice';
import {
  selectAllIncidents,
  selectPendingIncidents,
  selectLoading,
} from '../features/incidents/incidentSelectors';
import { logout } from '../features/admin/adminSlice';
import { selectAdmin as selectAdminState } from '../features/admin/adminSelectors';
import IncidentCard from '../components/IncidentCard';
import StatusBadge from '../components/StatusBadge';

const IncidentVerification = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const allIncidents = useSelector(selectAllIncidents);
  const pendingIncidents = useSelector(selectPendingIncidents);
  const loading = useSelector(selectLoading);
  const admin = useSelector(selectAdminState);

  useEffect(() => {
    dispatch(fetchIncidents());
  }, [dispatch]);

  const handleStatusUpdate = async (incidentId, status) => {
    try {
      await dispatch(updateIncidentStatus({ id: incidentId, status })).unwrap();
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update incident status');
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/feed');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Incident Verification Dashboard</h1>
              <p className="text-gray-600">
                Review and verify pending incidents. Update status as needed.
              </p>
              {admin && (
                <p className="text-sm text-gray-500 mt-1">Logged in as: {admin.username}</p>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/feed')}
                className="px-4 py-2 border border-gray-300 rounded-md font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Back to Feed
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-md font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {allIncidents.filter((i) => i.status === 'pending').length}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <svg
                  className="w-6 h-6 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Verified</p>
                <p className="text-2xl font-bold text-gray-900">
                  {allIncidents.filter((i) => i.status === 'verified').length}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Resolved</p>
                <p className="text-2xl font-bold text-gray-900">
                  {allIncidents.filter((i) => i.status === 'resolved').length}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Incidents List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Pending Incidents</h2>

          {loading && pendingIncidents.length === 0 ? (
            <div className="text-center py-8 text-gray-500">Loading incidents...</div>
          ) : pendingIncidents.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No pending incidents</div>
          ) : (
            <div className="space-y-4">
              {pendingIncidents
                .filter((incident) => incident.status === 'pending')
                .map((incident) => (
                  <div
                    key={incident._id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {incident.title}
                          </h3>
                          <StatusBadge status={incident.status} />
                        </div>
                        <p className="text-gray-600 mb-2">{incident.description}</p>
                        <div className="flex gap-4 text-sm text-gray-500">
                          <span>
                            <span className="font-medium">Category:</span> {incident.category}
                          </span>
                          <span>
                            <span className="font-medium">Severity:</span> {incident.severity}/5
                          </span>
                          <span>
                            <span className="font-medium">Reported:</span>{' '}
                            {new Date(incident.createdAt).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => handleStatusUpdate(incident._id, 'verified')}
                        className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                      >
                        ✓ Verify
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(incident._id, 'resolved')}
                        className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
                      >
                        ✓ Mark Resolved
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(incident._id, 'pending')}
                        className="px-4 py-2 border border-gray-300 rounded-md font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
                      >
                        Keep Pending
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IncidentVerification;


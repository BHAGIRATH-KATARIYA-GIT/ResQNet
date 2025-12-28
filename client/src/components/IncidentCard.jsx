import React from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import { getCategoryIcon, getSeverityColor } from '../services/map.service';

const IncidentCard = ({ incident }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/incidents/${incident._id}`);
  };

  const severityColor = getSeverityColor(incident.severity);
  const categoryIcon = getCategoryIcon(incident.category);

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-gray-200 p-4"
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{categoryIcon}</span>
          <h3 className="text-lg font-semibold text-gray-900 truncate">{incident.title}</h3>
        </div>
        <StatusBadge status={incident.status} />
      </div>

      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{incident.description}</p>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-4">
          <span className="text-gray-500">
            <span className="font-medium">Category:</span> {incident.category}
          </span>
          <span className="text-gray-500">
            <span className="font-medium">Severity:</span>
            <span
              className={`ml-1 font-bold ${
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
            </span>
          </span>
        </div>
        <span className="text-gray-400 text-xs">
          {new Date(incident.createdAt).toLocaleDateString()}
        </span>
      </div>

      {incident.media && incident.media.length > 0 && (
        <div className="mt-3 flex gap-2">
          {incident.media.slice(0, 3).map((mediaUrl, index) => (
            <img
              key={index}
              src={mediaUrl}
              alt={`Media ${index + 1}`}
              className="w-16 h-16 object-cover rounded"
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default IncidentCard;


import React from 'react';

const StatusBadge = ({ status }) => {
  const statusStyles = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    verified: 'bg-blue-100 text-blue-800 border-blue-300',
    resolved: 'bg-green-100 text-green-800 border-green-300',
  };

  const statusLabels = {
    pending: 'Pending',
    verified: 'Verified',
    resolved: 'Resolved',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusStyles[status] || 'bg-gray-100 text-gray-800 border-gray-300'}`}
    >
      {statusLabels[status] || status}
    </span>
  );
};

export default StatusBadge;


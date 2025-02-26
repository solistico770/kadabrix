
// frontend/src/components/AgentActivityScreen.jsx
import React, { useState, useEffect } from 'react';
import kdb from '../../../kadabrix/kadabrix';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Component to handle map bounds
const MapBounds = ({ positions }) => {
  const map = useMap();

  useEffect(() => {
    if (positions.length === 0) return;

    // Calculate min/max lat/lng (most radical points)
    const lats = positions.map(p => p[0]);
    const lngs = positions.map(p => p[1]);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);

    // Calculate 20% padding
    const latRange = maxLat - minLat || 0.01; // Avoid zero range
    const lngRange = maxLng - minLng || 0.01;
    const latPadding = latRange * 0.2;
    const lngPadding = lngRange * 0.2;

    // Define bounds with padding
    const bounds = [
      [minLat - latPadding, minLng - lngPadding], // Southwest
      [maxLat + latPadding, maxLng + lngPadding], // Northeast
    ];

    // Update map view
    map.fitBounds(bounds);
  }, [positions, map]);

  return null;
};

const AgentActivityScreen = () => {
  // State
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState('yuval'); // Default to yuval
  const [selectedDate, setSelectedDate] = useState(() => {
    const date = new Date('2025-02-20'); // Default to Feb 20, 2025
    date.setHours(0, 0, 0, 0);
    return Math.floor(date.getTime() / 1000); // Unix timestamp
  });
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Loading state

  // Fetch agents on mount
  useEffect(() => {
    const fetchAgents = async () => {
      setIsLoading(true);
      try {
        const data = await kdb.run({
          module: 'userTrace',
          name: 'getAgents',
          data: {},
        });
        setAgents(data.agents);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAgents();
  }, []);

  // Fetch activities when agent or date changes
  useEffect(() => {
    if (!selectedAgent) return;
    const fetchActivities = async () => {
      setIsLoading(true);
      try {
        const data = await kdb.run({
          module: 'userTrace',
          name: 'getActivity',
          data: { date: selectedDate, user: selectedAgent },
        });
        setActivities(data.rows);
      } finally {
        setIsLoading(false);
      }
    };
    fetchActivities();
  }, [selectedAgent, selectedDate]);

  // Date navigation
  const moveDay = (days) => {
    setSelectedDate(prev => prev + days * 86400); // Add/subtract 1 day in seconds
  };

  // Format date for display
  const formatDate = (unix) => new Date(unix * 1000).toLocaleDateString();

  // Map positions for route (lat/lng pairs)
  const routePositions = activities.map(activity => [activity.lat, activity.lng]);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left: Map */}
      <div className="w-2/3 p-4 relative">
        <div className="bg-white rounded-lg shadow-lg h-full relative">
          <MapContainer
            center={[32.1062364, 34.9364876]} // Initial center (Tel Aviv fallback)
            zoom={12}
            className="h-full w-full rounded-lg"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
            {routePositions.length > 0 && (
              <>
                <Polyline positions={routePositions} color="blue" />
                {activities.map((activity, idx) => (
                  <Marker key={activity.id} position={[activity.lat, activity.lng]}>
                    <Popup>
                      <strong>{activity.eventname}</strong><br />
                      {activity.details.custName} - {activity.details.partName}<br />
                      {new Date(activity.unixtime * 1000).toLocaleTimeString()}
                    </Popup>
                  </Marker>
                ))}
                <MapBounds positions={routePositions} />
              </>
            )}
          </MapContainer>
          {/* Spinner Overlay */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-200 bg-opacity-50 rounded-lg">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>
      </div>

      {/* Right: Controls */}
      <div className="w-1/3 p-4 flex flex-col">
        <div className="bg-white rounded-lg shadow-lg p-6 flex-grow">
          <h2 className="text-xl font-bold mb-4">Agent Activity</h2>

          {/* Date Selector */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => moveDay(-1)}
                className="bg-gray-200 p-2 rounded hover:bg-gray-300"
              >
                ←
              </button>
              <span className="text-lg font-semibold">{formatDate(selectedDate)}</span>
              <button
                onClick={() => moveDay(1)}
                className="bg-gray-200 p-2 rounded hover:bg-gray-300"
              >
                →
              </button>
            </div>
          </div>

          {/* Agent Selector */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Agent</label>
            <select
              value={selectedAgent}
              onChange={(e) => setSelectedAgent(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {agents.map(agent => (
                <option key={agent} value={agent}>{agent}</option>
              ))}
            </select>
          </div>

          {/* Activity Summary */}
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Activities ({activities.length})</h3>
            <div className="max-h-96 overflow-y-auto">
              {activities.map(activity => (
                <div key={activity.id} className="border-b py-2 text-sm">
                  <p><strong>{activity.eventname}</strong> at {new Date(activity.unixtime * 1000).toLocaleTimeString()}</p>
                  <p>{activity.details.custName} - {activity.details.partName}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentActivityScreen;
import React, { useEffect, useState } from 'react';

// Calculate distance between two coordinates using Haversine formula
function haversineDistance(lat1, lon1, lat2, lon2) {
  const toRadians = (degree) => (degree * Math.PI) / 180;

  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in kilometers
}

// Sort centers by distance from user's location
function sortCentersByDistance(userCoords, centers) {
  return centers
    .map((center) => ({
      ...center,
      distance: haversineDistance(userCoords.lat, userCoords.lng, center.lat, center.lng),
    }))
    .sort((a, b) => a.distance - b.distance); // Sort centers by distance
}

function NearestCenters({ lat, lng, centers }) {
  const [sortedCenters, setSortedCenters] = useState([]);

  useEffect(() => {
    // Update sorted centers whenever lat, lng, or centers change
    const userLocation = { lat, lng };
    const sorted = sortCentersByDistance(userLocation, centers);
    setSortedCenters(sorted);
  }, [lat, lng, centers]); // Ensure this runs when lat, lng, or centers change

  return (
    <div>
  {/* E-Waste Center Cards */}
  <div className="center-cards-container row">
    {sortedCenters.map((center, index) => (
      <div key={index} className="col-md-4 mb-4"> {/* Adjust column size based on your layout */}
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">{center.name}</h5>
            <p className="card-text">{center.address}</p>
            <p className="card-text">
              <small className="text-muted">Distance: {center.distance.toFixed(2)} km</small>
            </p>
            <button 
              className="btn btn-primary" 
              onClick={() => handleBookAppointment(center)}
            >
              Book Appointment
            </button>
          </div>
        </div>
      </div>
    ))}
  </div>
</div>

  );
}

export default NearestCenters;

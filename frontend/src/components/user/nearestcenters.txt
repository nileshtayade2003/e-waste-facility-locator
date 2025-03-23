import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

// Haversine Formula for distance calculation
function haversineDistance(lat1, lon1, lat2, lon2) {
  const toRadians = (degree) => (degree * Math.PI) / 180;

  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

// Sort centers by distance
function sortCentersByDistance(userCoords, centers) {
  return centers
    .map((center) => ({
      ...center,
      distance: haversineDistance(
        userCoords.lat,
        userCoords.lng,
        center.lat,
        center.lng
      ),
    }))
    .sort((a, b) => a.distance - b.distance);
}

function NearestCenters({ lat, lng, centers }) {
  const [sortedCenters, setSortedCenters] = useState([]);

  useEffect(() => {
    if (lat && lng && centers.length) {
      const userLocation = { lat, lng };
      const sorted = sortCentersByDistance(userLocation, centers);
      setSortedCenters(sorted);
    }
  }, [lat, lng, centers]);

  return (
    <div className="container mt-4">
      <h3 className="text-center mb-4">Nearest E-Waste Collection Centers</h3>
      <div className="row">
        {sortedCenters.map((center, index) => (
          <div key={index} className="col-md-4 mb-4">
            <div className="card shadow-sm">
              <img
                src={`http://localhost:5000/uploads/${center.image}`}
                alt={center.name}
                className="card-img-top"
                style={{ height: "200px", objectFit: "cover" }}
              />
              <div className="card-body">
                <h5 className="card-title">{center.name}</h5>
                <p className="card-text">
                  <strong>📍 Address:</strong> {center.address}
                </p>
                <p className="card-text">
                  <strong>📧 Email:</strong> {center.email}
                </p>
                <p className="card-text">
                  <strong>📞 Phone:</strong> {center.phone}
                </p>
                <p className="card-text">
                  <strong>🕒 Opening Hours:</strong> 9:00 AM - 6:00 PM
                </p>
                <p className="card-text">
                  <strong>📏 Distance:</strong> {center.distance.toFixed(2)} km
                </p>
                <a
                  href={`/book-appointment/${center._id}`}
                  className="btn btn-success w-100"
                >
                  📅 Book Appointment
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NearestCenters;

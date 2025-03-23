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
  const [currentPage, setCurrentPage] = useState(1);
  const [centersPerPage] = useState(6);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDistance, setFilterDistance] = useState(0);

  useEffect(() => {
    if (lat && lng && centers.length) {
      const userLocation = { lat, lng };
      const sorted = sortCentersByDistance(userLocation, centers);
      setSortedCenters(sorted);
    }
  }, [lat, lng, centers]);

  // Filter centers based on search term and distance
  const filteredCenters = sortedCenters.filter(center => {
    const matchesSearch = center.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          center.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDistance = filterDistance === 0 || center.distance <= filterDistance;
    return matchesSearch && matchesDistance;
  });

  // Get current centers for pagination
  const indexOfLastCenter = currentPage * centersPerPage;
  const indexOfFirstCenter = indexOfLastCenter - centersPerPage;
  const currentCenters = filteredCenters.slice(indexOfFirstCenter, indexOfLastCenter);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Calculate total pages
  const totalPages = Math.ceil(filteredCenters.length / centersPerPage);

  return (
    <div className="container mt-4">
       <div className="container mt-4 mb-4">
      
      <div className="location-error-message">
        <h1 className="text-center">
          If Location Services Unavailable
        </h1>
      </div>
      
      {/* Instructions for using the map */}
      <div className="map-instructions text-center mb-3">
        <p className="lead mb-0">
          Search by place on the map above and click directly on the map to see nearby centers
        </p>
      </div>
    </div>
      
      {/* Search and Filter Section */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Search by name or address..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
            <button className="btn btn-outline-secondary" type="button">
              <i className="bi bi-search"></i> Search
            </button>
          </div>
        </div>
        <div className="col-md-6">
          <select 
            className="form-select"
            value={filterDistance}
            onChange={(e) => {
              setFilterDistance(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            <option value="0">All Distances</option>
            <option value="5">Within 5 km</option>
            <option value="10">Within 10 km</option>
            <option value="20">Within 20 km</option>
            <option value="50">Within 50 km</option>
          </select>
        </div>
      </div>
      
      {/* Centers Display */}
      <div className="row">
        {currentCenters.length > 0 ? (
          currentCenters.map((center, index) => (
            <div key={index} className="col-md-4 mb-4">
              <div className="card shadow-sm h-100">
                <div className="badge bg-success position-absolute m-2">
                  {center.distance.toFixed(2)} km
                </div>
                <img
                  src={`http://localhost:5000/uploads/${center.image}`}
                  alt={center.name}
                  className="card-img-top"
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{center.name}</h5>
                  <p className="card-text">
                    <i className="bi bi-geo-alt-fill text-danger"></i> {center.address}
                  </p>
                  <p className="card-text">
                    <i className="bi bi-envelope-fill text-primary"></i> {center.email}
                  </p>
                  <p className="card-text">
                    <i className="bi bi-telephone-fill text-success"></i> {center.phone}
                  </p>
                  <p className="card-text">
                    <i className="bi bi-clock-fill text-warning"></i> 9:00 AM - 6:00 PM
                  </p>
                  <a
                    href={`/book-appointment/${center._id}`}
                    className="btn btn-success mt-auto w-100"
                  >
                    <i className="bi bi-calendar-check"></i> Book Appointment
                  </a>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12 text-center">
            <div className="alert alert-info">
              No centers found matching your criteria. Try adjusting your search or filters.
            </div>
          </div>
        )}
      </div>
      
      {/* Pagination */}
      {filteredCenters.length > 0 && (
        <nav aria-label="Page navigation" className="mt-4">
          <ul className="pagination justify-content-center">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button 
                className="page-link" 
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
            </li>
            
            {/* Show first page */}
            {totalPages > 5 && currentPage > 3 && (
              <>
                <li className="page-item">
                  <button className="page-link" onClick={() => paginate(1)}>1</button>
                </li>
                {currentPage > 4 && <li className="page-item disabled"><span className="page-link">...</span></li>}
              </>
            )}
            
            {/* Show page numbers */}
            {[...Array(totalPages)].map((_, i) => {
              const pageNum = i + 1;
              
              // Show 5 pages around current page
              if (
                totalPages <= 5 || 
                (pageNum >= currentPage - 2 && pageNum <= currentPage + 2)
              ) {
                return (
                  <li key={i} className={`page-item ${pageNum === currentPage ? 'active' : ''}`}>
                    <button 
                      className="page-link" 
                      onClick={() => paginate(pageNum)}
                    >
                      {pageNum}
                    </button>
                  </li>
                );
              }
              return null;
            })}
            
            {/* Show last page */}
            {totalPages > 5 && currentPage < totalPages - 2 && (
              <>
                {currentPage < totalPages - 3 && <li className="page-item disabled"><span className="page-link">...</span></li>}
                <li className="page-item">
                  <button className="page-link" onClick={() => paginate(totalPages)}>{totalPages}</button>
                </li>
              </>
            )}
            
            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button 
                className="page-link" 
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      )}
      
      {/* Results summary */}
      <div className="text-center mt-2 mb-4">
        <small className="text-muted">
          Showing {indexOfFirstCenter + 1} to {Math.min(indexOfLastCenter, filteredCenters.length)} of {filteredCenters.length} centers
        </small>
      </div>
    </div>
  );
}

export default NearestCenters;
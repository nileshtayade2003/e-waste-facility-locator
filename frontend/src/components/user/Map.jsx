import React, { useRef, useEffect, useState,useContext } from 'react'; 
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import NearestCenters from './NearestCenters';
import { Search, Crosshair, Loader2, Filter, Star, Navigation } from 'lucide-react';
import { UserContext } from "../../context/UserContext"; // Import User Context

export default function Map() {
  const { user} = useContext(UserContext); // Get user state and logout function
  const mapContainer = useRef(null);
  const map = useRef(null);
  const userMarkerRef = useRef(null); // Reference to store user marker
  const [lng, setLng] = useState(72.8777); // Mumbai longitude
  const [lat, setLat] = useState(19.0760); // Mumbai latitude
  const [zoom, setZoom] = useState(11);
  const [NearestFind, setNearestFind] = useState({ lat: null, lng: null });
  const API_KEY = import.meta.env.VITE_MAPTILER_API_KEY;
  const [centers, setCenters] = useState([]); // Initialize with empty array
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null); // Add error state
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [filters, setFilters] = useState({
    minRating: 0,
    acceptedItems: []
  });
  const [showFilters, setShowFilters] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Add custom styles once when component mounts
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .user-location-marker {
        width: 24px;
        height: 24px;
        background-color: red;
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 0 8px rgba(0, 0, 0, 0.5);
        cursor: pointer;
      }
      
      .user-location-pulse {
        width: 70px;
        height: 70px;
        border-radius: 50%;
        background: rgba(255, 0, 0, 0.2);
        border: 2px solid rgba(255, 0, 0, 0.5);
        position: absolute;
        left: -35px;
        top: -35px;
        z-index: -1;
        animation: pulse-animation 2s infinite;
      }
      
      @keyframes pulse-animation {
        0% {
          transform: scale(0.3);
          opacity: 1;
        }
        100% {
          transform: scale(1);
          opacity: 0;
        }
      }
      
      /* Make search results appear above map */
      .search-results-dropdown {
        position: absolute;
        z-index: 1000;
        width: 100%;
        max-height: 300px;
        overflow-y: auto;
      }

      /* Improve search bar and buttons styling */
      .search-container {
        display: flex;
        gap: 8px;
        margin-bottom: 16px;
        flex-wrap: wrap;
      }

      .search-input-group {
        flex: 1;
        min-width: 200px;
      }

      .action-buttons {
        display: flex;
        gap: 8px;
      }

      .action-button {
        min-width: 120px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      @media (max-width: 768px) {
        .search-container {
          flex-direction: column;
        }
        
        .action-buttons {
          width: 100%;
        }
        
        .action-button {
          flex: 1;
        }
      }
    `;
    document.head.appendChild(style);
    
    // Clean up on unmount
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Fetch centers from API
  useEffect(() => {
    const fetchCenters = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:5000/api/user/get-centers');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setCenters(data);
      } catch (err) {
        console.error("Error fetching centers:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCenters();
  }, []);

  // Calculate distance between two coordinates
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return (R * c).toFixed(1);
  };

  // Handle search functionality
  const handleSearch = async () => {
    if (!searchQuery.trim() || !map.current) return;

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://api.maptiler.com/geocoding/${encodeURIComponent(searchQuery)}.json?key=${API_KEY}`
      );
      const data = await response.json();

      if (data.features && data.features.length > 0) {
        setSearchResults(data.features.slice(0, 5));
      } else {
        setSearchResults([]);
        alert('Location not found');
      }
    } catch (error) {
      console.error('Search error:', error);
      alert('Error searching for location');
    } finally {
      setIsSearching(false);
    }
  };

  // Handle search result selection
  const handleSearchResultClick = (feature) => {
    const [lng, lat] = feature.center;
    map.current?.flyTo({
      center: [lng, lat],
      zoom: 14
    });
    setSearchResults([]);
    setSearchQuery(feature.place_name);
  };

  // Filter centers based on criteria
  const filteredCenters = centers.filter(center => {
    if (filters.minRating > 0 && (!center.rating || center.rating < filters.minRating)) return false;
    if (filters.acceptedItems.length > 0 && center.acceptedItems) {
      return filters.acceptedItems.some(item => 
        center.acceptedItems.some(centerItem => 
          centerItem.toLowerCase().includes(item.toLowerCase())
        )
      );
    }
    return true;
  });

  // Initialize map 
  useEffect(() => {
    if (map.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${API_KEY}`,
      center: [lng, lat],
      zoom: zoom
    });

    // Only add navigation control, remove geocoding control
    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

    map.current.on('click', () => {
      const center = map.current.getCenter();
      setNearestFind({ lat: center.lat, lng: center.lng });
    });

    // Make sure the map is fully loaded before adding markers
    map.current.on('load', () => {
      console.log('Map loaded successfully');
      setMapLoaded(true);
      
      // Add user marker if we already have a location
      if (userLocation) {
        addUserLocationMarker(userLocation.lng, userLocation.lat);
      }
    });
  }, [API_KEY, lng, lat, zoom]);

  // Function to add user location marker
  const addUserLocationMarker = (userLng, userLat) => {
    // Remove existing user marker if there is one
    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
      userMarkerRef.current = null;
    }

    // Create a container div for the marker
    const markerContainer = document.createElement('div');
    markerContainer.className = 'user-location-marker';
    
    // Create a pulsing effect div
    const pulseDiv = document.createElement('div');
    pulseDiv.className = 'user-location-pulse';
    markerContainer.appendChild(pulseDiv);
    
    // Create and add the marker to the map
    try {
      userMarkerRef.current = new maplibregl.Marker({
        element: markerContainer,
        anchor: 'center'
      })
        .setLngLat([userLng, userLat])
        .addTo(map.current);
        
      // Create a popup for the user location
      const popup = new maplibregl.Popup({ offset: 25 })
        .setHTML('<div style="text-align: center;"><strong>Your Location</strong></div>');
        
      userMarkerRef.current.setPopup(popup);
      
      console.log('User marker added successfully at:', userLng, userLat);
    } catch (error) {
      console.error('Error adding user marker:', error);
      alert('Error showing your location on the map');
    }
  };

  // Get user location with improved marker creation
  const handleLocationClick = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLng = position.coords.longitude;
          const userLat = position.coords.latitude;
          
          // Update state with user's coordinates
          setLng(userLng);
          setLat(userLat);
          setUserLocation({ lat: userLat, lng: userLng });
          
          // Fly to user's location
          if (map.current) {
            map.current.flyTo({
              center: [userLng, userLat],
              zoom: 14,
              essential: true // This ensures the animation is always played
            });
            
            // Add the user location marker if map is loaded
            if (mapLoaded) {
              addUserLocationMarker(userLng, userLat);
            }
          } else {
            console.error('Map is not initialized yet');
          }
          
          setIsLocating(false);
        },
        (error) => {
          console.error('Error fetching the current location:', error);
          setIsLocating(false);
          alert(`Unable to get your location: ${error.message}. Please check your browser permissions.`);
        },
        { 
          enableHighAccuracy: true, 
          timeout: 10000, 
          maximumAge: 0 
        }
      );
    } else {
      console.log('Geolocation is not supported by this browser.');
      setIsLocating(false);
      alert('Geolocation is not supported by your browser.');
    }
  };

  // Update user marker when userLocation changes
  useEffect(() => {
    if (map.current && mapLoaded && userLocation) {
      addUserLocationMarker(userLocation.lng, userLocation.lat);
    }
  }, [userLocation, mapLoaded]);

  // Display centers on the map
  useEffect(() => {
    if (!map.current || !mapLoaded || centers.length === 0) return;

    // Clear existing center markers only, not user marker
    const markers = document.getElementsByClassName('center-marker');
    while (markers.length > 0) {
      markers[0].remove();
    }

    filteredCenters.forEach(center => {
      const popup = new maplibregl.Popup({ offset: 25 }).setHTML(`
        <div style="max-width: 300px; text-align: center;">
          <img src="http://localhost:5000/uploads/${center.image}" alt="${center.name}" style="width:100%; height:150px; border-radius:8px;" onerror="this.src='https://via.placeholder.com/300x150?text=No+Image'" />
          <h6 class="mt-2">${center.name}</h6>
          <p><strong>📍 Address:</strong> ${center.address}</p>
          <p><strong>📞 Phone:</strong> ${center.phone}</p>
          <p><strong>📧 Email:</strong> ${center.email}</p>
          <p><strong>🕒 Hours:</strong> ${center.operatingHours || '9:00 AM - 6:00 PM'}</p>
          ${center.rating ? `<p><strong>⭐ Rating:</strong> ${center.rating} (${center.reviews || 0} reviews)</p>` : ''}
          <a class="btn btn-success btn-sm" href='/book-appointment/${center._id}'>Book Appointment</a>
        </div>
      `);

      const marker = new maplibregl.Marker({ color: 'blue' })
        .setLngLat([center.lng, center.lat])
        .setPopup(popup)
        .addTo(map.current);

      // Add a class to identify center markers
      marker.getElement().classList.add('center-marker');

      marker.getElement().addEventListener('click', () => {
        setSelectedCenter(center);
      });
    });
  }, [centers, filteredCenters, mapLoaded]);

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">
        Find E-Waste Collection Centers Near You
      </h2>

      <div className="row">
        <div className="col-md-8">
          <div className="position-relative mb-3">
            <div className="search-container">
              <div className="search-input-group input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                />
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={handleSearch}
                  disabled={isSearching}
                >
                  {isSearching ? (
                    <div className="d-flex align-items-center">
                      <Loader2 className="animate-spin me-1" size={16} />
                      <span>Searching</span>
                    </div>
                  ) : (
                    <div className="d-flex align-items-center">
                      <Search size={16} className="me-1" />
                      <span>Search</span>
                    </div>
                  )}
                </button>
              </div>
              <div className="action-buttons">
                <button
                  className="btn btn-danger action-button"
                  type="button"
                  onClick={handleLocationClick}
                  disabled={isLocating}
                >
                  {isLocating ? (
                    <div className="d-flex align-items-center">
                      <Loader2 className="animate-spin me-1" size={16} />
                      <span>Locating</span>
                    </div>
                  ) : (
                    <div className="d-flex align-items-center">
                      <Navigation size={16} className="me-1" />
                      <span>My Location</span>
                    </div>
                  )}
                </button>
                <button
                  className={`btn action-button ${
                    showFilters ? "btn-primary" : "btn-outline-secondary"
                  }`}
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <div className="d-flex align-items-center">
                    <Filter size={16} className="me-1" />
                    <span>Filters</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Search results with proper z-index */}
            {searchResults.length > 0 && (
              <div className="search-results-dropdown bg-white rounded shadow-sm w-100 mt-1">
                {searchResults.map((result, index) => (
                  <button
                    key={index}
                    className="list-group-item list-group-item-action text-start w-100"
                    onClick={() => handleSearchResultClick(result)}
                  >
                    {result.place_name}
                  </button>
                ))}
              </div>
            )}

            {showFilters && (
              <div className="card mb-3">
                <div className="card-body">
                  <h5 className="card-title">Filters</h5>
                  <div className="mb-3">
                    <label className="form-label">Minimum Rating</label>
                    <input
                      type="range"
                      className="form-range"
                      min="0"
                      max="5"
                      step="0.5"
                      value={filters.minRating}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          minRating: parseFloat(e.target.value),
                        }))
                      }
                    />
                    <div className="text-muted small">
                      {filters.minRating} stars
                    </div>
                  </div>
                  <div>
                    <label className="form-label">Accepted Items</label>
                    <div className="d-flex flex-wrap gap-2">
                      {[
                        "Computers",
                        "Phones",
                        "Batteries",
                        "TVs",
                        "Appliances",
                      ].map((item) => (
                        <button
                          key={item}
                          className={`btn btn-sm ${
                            filters.acceptedItems.includes(item)
                              ? "btn-success"
                              : "btn-outline-secondary"
                          }`}
                          onClick={() =>
                            setFilters((prev) => ({
                              ...prev,
                              acceptedItems: prev.acceptedItems.includes(item)
                                ? prev.acceptedItems.filter((i) => i !== item)
                                : [...prev.acceptedItems, item],
                            }))
                          }
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Map container */}
            <div
              ref={mapContainer}
              className="map"
              style={{
                height: "500px",
                width: "100%",
                borderRadius: "8px",
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                border: "1px solid #ddd",
                position: "relative",
                zIndex: 1, // Ensure proper stacking context
              }}
            />
          </div>
        </div>

        <div className="col-md-4">
          <div className="card mb-4">
            <div className="card-header bg-primary text-white">
              <h5 className="card-title mb-0">Collection Centers</h5>
            </div>
            <div
              className="card-body"
              style={{ maxHeight: "300px", overflowY: "auto" }}
            >
              {loading ? (
                <div className="text-center p-3">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-2">Loading centers...</p>
                </div>
              ) : error ? (
                <div className="alert alert-danger">
                  <p>Error loading centers: {error}</p>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => window.location.reload()}
                  >
                    Retry
                  </button>
                </div>
              ) : filteredCenters.length === 0 ? (
                <p className="text-muted">No centers match your filters</p>
              ) : (
                filteredCenters.map((center) => (
                  <div
                    key={center._id}
                    className={`card mb-2 ${
                      selectedCenter?._id === center._id ? "border-primary" : ""
                    }`}
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setSelectedCenter(center);
                      map.current?.flyTo({
                        center: [center.lng, center.lat],
                        zoom: 15,
                      });
                    }}
                  >
                    <div className="card-body p-2">
                      <div className="d-flex">
                        <img
                          src={`http://localhost:5000/uploads/${center.image}`}
                          alt={center.name}
                          className="rounded me-2"
                          style={{
                            width: "60px",
                            height: "60px",
                            objectFit: "cover",
                          }}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "https://via.placeholder.com/60x60?text=No+Image";
                          }}
                        />
                        <div>
                          <h6 className="mb-0">{center.name}</h6>
                          <p className="text-muted small mb-1">
                            {center.address}
                          </p>
                          {center.rating && (
                            <div className="d-flex align-items-center">
                              <span className="text-warning">★</span>
                              <span className="small ms-1">
                                {center.rating}
                              </span>
                              <span className="text-muted small ms-1">
                                ({center.reviews || 0})
                              </span>
                            </div>
                          )}
                          {userLocation && (
                            <small className="text-muted">
                              {calculateDistance(
                                userLocation.lat,
                                userLocation.lng,
                                center.lat,
                                center.lng
                              )}{" "}
                              km away
                            </small>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {selectedCenter && (
            <div className="card">
              <img
                src={`http://localhost:5000/uploads/${selectedCenter.image}`}
                className="card-img-top"
                alt={selectedCenter.name}
                style={{ height: "180px", objectFit: "cover" }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://via.placeholder.com/300x180?text=No+Image";
                }}
              />
              <div className="card-body">
                <h5 className="card-title">{selectedCenter.name}</h5>
                <p className="card-text">
                  <strong>📍 Address:</strong> {selectedCenter.address}
                </p>
                <p className="card-text">
                  <strong>📞 Phone:</strong> {selectedCenter.phone}
                </p>
                <p className="card-text">
                  <strong>📧 Email:</strong> {selectedCenter.email}
                </p>
                <p className="card-text">
                  <strong>🕒 Hours:</strong>{" "}
                  {selectedCenter.operatingHours || "9:00 AM - 6:00 PM"}
                </p>
                {selectedCenter.rating && (
                  <p className="card-text">
                    <strong>⭐ Rating:</strong> {selectedCenter.rating} (
                    {selectedCenter.reviews || 0} reviews)
                  </p>
                )}
                {userLocation && (
                  <p className="card-text">
                    <strong>📍 Distance:</strong>{" "}
                    {calculateDistance(
                      userLocation.lat,
                      userLocation.lng,
                      selectedCenter.lat,
                      selectedCenter.lng
                    )}{" "}
                    km away
                  </p>
                )}
                {selectedCenter.acceptedItems &&
                  selectedCenter.acceptedItems.length > 0 && (
                    <div className="mb-3">
                      <h6>Accepted Items</h6>
                      <div className="d-flex flex-wrap gap-1">
                        {selectedCenter.acceptedItems.map((item, index) => (
                          <span key={index} className="badge bg-success">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                {user ? (
                  <>
                    <a
                      href={`/book-appointment/${selectedCenter._id}`}
                      className="btn btn-primary w-100"
                    >
                      Book Appointment
                    </a>
                  </>
                ) : (
                  <>
                    <a
                      href={`/login`}
                      className="btn btn-primary w-100"
                    >
                      Book Appointment
                    </a>
                  </>
                )}
                {/* <a
                  onClick={() => handleBookAppointment(selectedCenter._id)}
                  className="btn btn-primary w-100"
                >
                  Book Appointment
                </a>
                ; */}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4">
        <NearestCenters
          lat={NearestFind.lat}
          lng={NearestFind.lng}
          centers={centers}
        />
      </div>
    </div>
  );
}
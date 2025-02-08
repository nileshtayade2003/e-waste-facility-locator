import React, { useState, useRef, useEffect } from "react";
import "admin-lte/dist/css/adminlte.min.css"; // AdminLTE styles
import axios from "axios"; // Assuming you'll use axios for making API requests
import MapLibreGL from 'maplibre-gl';
import { GeocodingControl } from '@maptiler/geocoding-control/maplibregl';
import 'maplibre-gl/dist/maplibre-gl.css';

const AddCenter = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    latitude: null,
    longitude: null,
    image: null,
  });
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapContainer = useRef(null);
  const apiKey = import.meta.env.VITE_MAPTILER_API_KEY;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0],
    });
  };

  const handleMapClick = (lngLat) => {
    setFormData({
      ...formData,
      latitude: lngLat.lat,
      longitude: lngLat.lng,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Get token
    const token = localStorage.getItem("adminToken"); // Get token from local storage
  
    if (!token) {
      console.error("No token found. Please log in.");
      return;
    }
  
    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("password", formData.password);
    data.append("phone", formData.phone);
    data.append("address", formData.address);
    data.append("lat", formData.latitude);  
    data.append("lng", formData.longitude);
  
    // Only append the image if it's selected
    if (formData.image) {
      data.append("image", formData.image);
    }
  
    
  
    try {
      const response = await axios.post("http://localhost:5000/api/admin/add-center", data, {
        headers: {
          "Authorization": `Bearer ${token}`, // Send token with Bearer
          "Content-Type": "multipart/form-data", // Ensure the correct content type
        },
      });
      alert(response.data.message || "Center added successfully!"); 
    } catch (error) {
      if (error.response) {
        // Show error message from the server
        alert(error.response.data.message || "Something went wrong!");
      } else {
        alert("Network error. Please try again.");
      }
    }
  };
  

  useEffect(() => {
    if (!mapLoaded) {
      const map = new MapLibreGL.Map({
        container: mapContainer.current,
        style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${apiKey}`,
        center: [formData.longitude || 0, formData.latitude || 0],
        zoom: 12,
      });

      const geocodingControl = new GeocodingControl({ apiKey, MapLibreGL });
      map.addControl(geocodingControl, 'top-left');

      const marker = new MapLibreGL.Marker()
        .setLngLat([formData.longitude || 0, formData.latitude || 0])
        .addTo(map);

      map.on('click', (e) => {
        const { lngLat } = e;
        handleMapClick(lngLat);
        marker.setLngLat(lngLat);
      });

      setMapLoaded(true);
    }
  }, [mapLoaded]);

  return (
    <div className="row">
      <div className="col-md-12">
        <h2 className="mb-3">Add Center</h2>

        <div className="card card-primary">
          <div className="card-header">
            <h3 className="card-title">Center Information</h3>
          </div>

          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="card-body">
              <div className="row">
                <div className="col-md-6 form-group">
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    placeholder="Enter center name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6 form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    placeholder="Enter email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6 form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="text"
                    className="form-control"
                    id="phone"
                    name="phone"
                    placeholder="Enter phone number"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="row">
                <div className="form-group">
                  <label htmlFor="address">Address</label>
                  <input
                    type="text"
                    className="form-control"
                    id="address"
                    name="address"
                    placeholder="Enter address"
                    value={formData.address}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Select Center Location</label>
                  <div
                    ref={mapContainer}
                    style={{ height: "400px", width: "100%" }}
                  ></div>
                </div>
              </div>

              {/* Latitude and Longitude read-only fields */}
              <div className="row">
                <div className="col-md-6 form-group">
                  <label>Latitude</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.latitude || ""}
                    readOnly
                  />
                </div>
                <div className="col-md-6 form-group">
                  <label>Longitude</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.longitude || ""}
                    readOnly
                  />
                </div>
              </div>

              {/* Image upload */}
              <div className="form-group">
                <label htmlFor="image">Image</label>
                <input
                  type="file"
                  className="form-control"
                  id="image"
                  name="image"
                  onChange={handleImageChange}
                />
              </div>
            </div>

            <div className="card-footer">
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCenter;

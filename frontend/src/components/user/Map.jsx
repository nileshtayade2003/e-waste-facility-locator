import React, { useRef, useEffect, useState } from 'react'; 
import maplibregl from 'maplibre-gl';
import { GeocodingControl } from "@maptiler/geocoding-control/react";
import { createMapLibreGlMapController } from "@maptiler/geocoding-control/maplibregl-controller";
import "@maptiler/geocoding-control/style.css";
import 'maplibre-gl/dist/maplibre-gl.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import NearestCenters from './NearestCenters';

export default function Map() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(75.5626);
  const [lat, setLat] = useState(21.0077);
  const [zoom, setZoom] = useState(14);
  const [NearestFind, setNearestFind] = useState({ lat: null, lng: null });
  const API_KEY = import.meta.env.VITE_MAPTILER_API_KEY;
  const [mapController, setMapController] = useState();
  const [centers, setCenters] = useState([]); // Store centers from API

  // Fetch centers from backend API
  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/user/get-centers");
        const data = await response.json();
        setCenters(data); // Update state with centers
      } catch (error) {
        console.error("Error fetching centers:", error);
      }
    };

    fetchCenters();
  }, []);

  useEffect(() => {
    if (map.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${API_KEY}`,
      center: [lng, lat],
      zoom: zoom
    });

    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');
    setMapController(createMapLibreGlMapController(map.current, maplibregl));

    map.current.on('click', () => {
      const { lng, lat } = map.current.getCenter();
      setNearestFind({ lat, lng });
    });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLng = position.coords.longitude;
          const userLat = position.coords.latitude;
          setLng(userLng);
          setLat(userLat);
          map.current.setCenter([userLng, userLat]);

          new maplibregl.Marker({ color: 'red' })
            .setLngLat([userLng, userLat])
            .addTo(map.current);
        },
        () => {
          console.log('Error fetching the current location');
        }
      );
    } else {
      console.log('Geolocation is not supported by this browser.');
    }
  }, [API_KEY, lng, lat, zoom]);

  // Display centers on the map
  useEffect(() => {
    if (!map.current || centers.length === 0) return;

    centers.forEach(center => {
      new maplibregl.Marker({ color: 'blue' })
        .setLngLat([center.lng, center.lat])
        .setPopup(
          new maplibregl.Popup({ offset: 25 }).setHTML(`
            <div style="max-width: 300px; text-align: center;">
              <img src="http://localhost:5000/uploads/${center.image}" alt="${center.name}" style="width:100%; height:150px; border-radius:8px;" />
              <h6 class="mt-2">${center.name}</h6>
              <p><strong>📍 Address:</strong> ${center.address}</p>
              <p><strong>📞 Phone:</strong> ${center.phone}</p>
              <p><strong>📧 Email:</strong> ${center.email}</p>
              <p><strong>🕒 Opening Hours:</strong> 9:00 AM - 6:00 PM</p>
              <a class="btn btn-success btn-sm" href='/book-appointment/${center._id}'>Book Appointment</a>
            </div>
          `)
        )
        .addTo(map.current);
    });
  }, [centers]);

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">Find E-Waste Collection Centers Near You</h2>
      <div className="row justify-content-center">
        <div className="col-md-12">
          <div className="geocoding mb-3">
            <GeocodingControl apiKey={API_KEY} mapController={mapController} />
          </div>
          <div ref={mapContainer} className="map" style={{ height: '500px', width: '100%' }} />
        </div>
      </div>
      <div className='mt-4'>
        <NearestCenters lat={NearestFind.lat} lng={NearestFind.lng} centers={centers} />
      </div>
    </div>
  );
}

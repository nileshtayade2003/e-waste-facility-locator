import React, { useState, useRef, useEffect } from 'react';
import MapLibreGL from 'maplibre-gl';
import { GeocodingControl } from '@maptiler/geocoding-control/maplibregl';
// import '@maptiler/geocoding-control/dist/style.css'; //gives problem why?
import 'maplibre-gl/dist/maplibre-gl.css';

const SetMapLocation = () => {
  const [longitude, setLongitude] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const mapContainer = useRef(null);
  const apiKey = import.meta.env.VITE_MAPTILER_API_KEY; 

  useEffect(() => {
    const handleSuccess = (position) => {
      const { latitude, longitude } = position.coords;
      setLatitude(latitude);
      setLongitude(longitude);
    };

    const handleError = () => {
      console.error('Error getting location');
      // Set default coordinates or handle error
      setLatitude(0);
      setLongitude(0);
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(handleSuccess, handleError);
    } else {
      handleError();
    }
  }, []);

  useEffect(() => {
    const map = new MapLibreGL.Map({
      container: mapContainer.current,
      style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${apiKey}`,
      center: [longitude || 0, latitude || 0],
      zoom: 12,
    });

    
    const geocodingControl = new GeocodingControl({ apiKey, MapLibreGL });
    map.addControl(geocodingControl,'top-left');

    const marker = new MapLibreGL.Marker().setLngLat([longitude, latitude]).addTo(map);


    map.on('click', (e) => {
      const { lngLat } = e;
      setLongitude(lngLat.lng);
      setLatitude(lngLat.lat);
      marker.setLngLat(lngLat);
    });

    // map.on('moveend', () => {
    //   const { lng, lat } = map.getCenter();
    //   setLongitude(lng);
    //   setLatitude(lat);
    // });

    return () => map.remove();
  }, [longitude, latitude]);


  return (
    <div >
      
      
      <div>
        <label>Latitude: </label>
        <input
          type="text"
          value={latitude || ''}
          onChange={(e) => setLatitude(e.target.value)}
        />
        <label>Longitude: </label>
        <input
          type="text"
          value={longitude || ''}
          onChange={(e) => setLongitude(e.target.value)}
        />
      </div>
      <div
        ref={mapContainer}
        style={{ width: '100%', height: '500px' }}
      />
    </div>
  );
};

export default SetMapLocation;

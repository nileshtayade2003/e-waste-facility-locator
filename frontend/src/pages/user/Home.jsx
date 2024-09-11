import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import './style.css';
import { Link } from 'react-router-dom';

const Home = () => {

  const mapContainerStyle = {
    width: '100%',
    height: '400px',
  };

  const center = {
    lat: 37.7749, // Example latitude for San Francisco
    lng: -122.4194, // Example longitude for San Francisco
  };

  return (
    <div>
    

      {/* Main Content */}
      <main className="main-content" style={{ marginTop: '70px' }}>
        {/* Hero Section */}
        <section className="hero-section d-flex align-items-center justify-content-center text-center" style={{ height: '70vh', backgroundImage: 'url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJxv1hbPu9HFLWvQ2qIWyMtJYSvWfqc2-BZw&s)', backgroundSize: 'cover', backgroundPosition: 'center', color: 'white' }}>
          <div className="overlay"></div>
          <div className="content">
            <h1>Save the Planet by Managing E-Waste Properly</h1>
            <p>Recycle and dispose of your electronic waste responsibly.</p>
          </div>
        </section>

        {/* Google Map Section */}
        <section id="google-map" className="map-section py-5">
          <Container>
            <h2 className="text-center mb-4">Find E-Waste Collection Centers Near You</h2>
            <div className="search-bar mb-3">
              <input type="text" className="form-control" placeholder="Search for location..." />
            </div>

            <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={center}
                zoom={10}
              >
                <Marker position={center} />
              </GoogleMap>
            </LoadScript>
          </Container>
        </section>
      </main>
    
    </div>
  )
}

export default Home





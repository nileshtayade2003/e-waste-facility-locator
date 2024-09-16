import React from 'react'
import { Navbar, Nav, Container } from 'react-bootstrap';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const Map = () => {
  const mapContainerStyle = {
    width: '100%',
    height: '400px',
  };

  const center = {
    //shiv colony
    lat:  21.0077, 
    lng:  75.5626, 
  };

  return (
    <div>
      {/* Google Map Section */}
      <section id="google-map" className="map-section py-5">
          <Container>
            <h2 className="text-center mb-4">Find E-Waste Collection Centers Near You</h2>
            <div className="search-bar mb-3">
              <input type="text" className="form-control" placeholder="Search for location..." />
            </div>

            <LoadScript googleMapsApiKey="AIzaSyDm-cJfF0xckRO-JgLCBbLIX1Y8gIjxXwY">
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={center}
                zoom={15}
              >
                <Marker position={center} />
              </GoogleMap>
            </LoadScript>
          </Container>
        </section>
    </div>
  )
}

export default Map

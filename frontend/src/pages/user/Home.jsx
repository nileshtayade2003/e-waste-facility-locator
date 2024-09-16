import React from 'react';
import './style.css';
import Map from '../../components/user/Map';

const Home = () => {

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

        <Map/>
        
      </main>
    
    </div>
  )
}

export default Home





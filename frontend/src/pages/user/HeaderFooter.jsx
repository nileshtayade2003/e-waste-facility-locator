import React from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import './style.css'

const HeaderFooter = () => {
  return (
    <div>
         
      {/* Navbar */}
    
  <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
      <div className="container">
        <Link className="navbar-brand" to="/">
          E-Waste Management
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <NavLink className="nav-link" to="/">
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/book-appointment">
                Book Appointment
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/articles">
                Articles
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <Outlet/>

    {/* footer */}
    <footer className="bg-dark text-white py-4 mt-5">
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <h5>E-Waste Management</h5>
            <p>Recycle your electronic waste responsibly to help protect the environment.</p>
          </div>
          <div className="col-md-4">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li>
                <Link className="text-white" to="/">
                  Home
                </Link>
              </li>
              <li>
                <Link className="text-white" to="/book-appointment">
                  Book Appointment
                </Link>
              </li>
              <li>
                <Link className="text-white" to="/articles">
                  Articles
                </Link>
              </li>
            </ul>
          </div>
          <div className="col-md-4">
            <h5>Contact Us</h5>
            <ul className="list-unstyled">
              <li>Email: info@ewastemanagement.com</li>
              <li>Phone: +1 123-456-7890</li>
              <li>Address: 123 E-Waste St, Green City</li>
            </ul>
          </div>
        </div>
        <div className="text-center mt-4">
          <p>&copy; 2024 E-Waste Management. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
    </div>
  )
}

export default HeaderFooter

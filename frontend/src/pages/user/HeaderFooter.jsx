import React, { useContext, useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext"; // Import User Context
import { Modal, Button } from "react-bootstrap"; // Import Bootstrap Modal
import "./style.css";

const HeaderFooter = () => {
  const { user, logout } = useContext(UserContext); // Get user state and logout function
  const [showChatbot, setShowChatbot] = useState(false); // State to toggle chatbot modal
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login"); // Redirect to login after logout
  };

  // Inline styles
  const chatbotButtonStyle = {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "50px",
    padding: "12px 20px",
    fontSize: "18px",
    cursor: "pointer",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    transition: "background 0.3s ease",
  };

  // const chatbotModalStyle = {
  //   position: "fixed",
  //   bottom: "80px",
  //   right: "20px",
  //   width: "350px",
  //   height: "500px",
  //   backgroundColor: "white",
  //   borderRadius: "10px",
  //   boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
  //   display: showChatbot ? "block" : "none",
  //   zIndex: 1000,
  //   overflow: "hidden",
  // };

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
                <NavLink className="nav-link" to="/articles">
                  Articles
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/products">
                  Products
                </NavLink>
              </li>


              {/* Show Logout if user is logged in, else show Login/Register */}
              {user ? (
                <>
                  <li className="nav-item">
                    <NavLink className="nav-link btn btn-link" to='/my-purchases'>
                      My Purchases
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link btn btn-link" href='/my-appointments'>
                      My Appointments
                    </a>
                  </li>
                  <li className="nav-item">
                    <button className="nav-link btn btn-link" onClick={handleLogout}>
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/register">
                      Register
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/login">
                      Login
                    </NavLink>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>

      <Outlet />


     


       {/* Floating Chatbot Button */}
       <button
        style={chatbotButtonStyle}
        onMouseOver={(e) => (e.target.style.backgroundColor = "#0056b3")}
        onMouseOut={(e) => (e.target.style.backgroundColor = "#007bff")}
        onClick={() => setShowChatbot(true)}
      >
        💬 Chat
      </button>

      {/* Chatbot Modal */}
      <Modal show={showChatbot} onHide={() => setShowChatbot(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Chatbot</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <iframe
            src="https://cdn.botpress.cloud/webchat/v2.2/shareable.html?configUrl=https://files.bpcontent.cloud/2025/03/25/10/20250325102219-FAUK5Q8H.json"
            width="100%"
            height="400px"
            style={{ border: "none" }}
            title="Chatbot"
          ></iframe>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowChatbot(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>


      {/* Footer */}
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
  );
};

export default HeaderFooter;

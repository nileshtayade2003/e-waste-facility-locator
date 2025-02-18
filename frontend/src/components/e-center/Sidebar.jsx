import React from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation(); // Get the current location (path)

  return (
    <aside
      className="main-sidebar sidebar-dark-primary elevation-4"
      style={{ height: "100vh", position: "fixed" }}
    >
      {/* Brand Logo */}
      <a href="/center" className="brand-link">
        <span className="brand-text font-weight-light">Center Panel</span>
      </a>

      {/* Sidebar */}
      <div className="sidebar">
        {/* Sidebar user panel */}
        <div className="user-panel mt-3 pb-3 mb-3 d-flex">
          <div className="image">
            <img
              src="/images/profile.png"
              className="img-circle elevation-2"
              alt="User"
            />
          </div>
          <div className="info">
            <a href="#" className="d-block">
              Center Admin
            </a>
          </div>
        </div>

        {/* Sidebar Menu */}
        <nav className="mt-2">
          <ul className="nav nav-pills nav-sidebar flex-column" role="menu" data-accordion="false">
            <li className="nav-item">
              <Link
                to="/center"
                className={`nav-link ${location.pathname === "/center" ? "active" : ""}`}
              >
                <i className="nav-icon fas fa-tachometer-alt" />
                <p>Dashboard</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/center/appointments"
                className={`nav-link ${location.pathname === "/center/appointments" ? "active" : ""}`}
              >
                <i className="nav-icon fas fa-calendar-check" />
                <p>Appointments</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/customers"
                className={`nav-link ${location.pathname === "/customers" ? "active" : ""}`}
              >
                <i className="nav-icon fas fa-users" />
                <p>Customers</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/reports"
                className={`nav-link ${location.pathname === "/reports" ? "active" : ""}`}
              >
                <i className="nav-icon fas fa-chart-bar" />
                <p>Reports</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/profile"
                className={`nav-link ${location.pathname === "/profile" ? "active" : ""}`}
              >
                <i className="nav-icon fas fa-user-cog" />
                <p>Profile Settings</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/logout"
                className={`nav-link ${location.pathname === "/logout" ? "active" : ""}`}
              >
                <i className="nav-icon fas fa-sign-out-alt" />
                <p>Logout</p>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;

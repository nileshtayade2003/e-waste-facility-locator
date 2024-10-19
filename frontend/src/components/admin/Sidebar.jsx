import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
    const location = useLocation(); // Get the current location (path)

    return (
        <aside className="main-sidebar sidebar-dark-primary elevation-4" style={{ height: "100vh", position: 'fixed' }}>
            {/* Brand Logo */}
            <a href="/" className="brand-link">
                <span className="brand-text font-weight-light">AdminPanel</span>
            </a>

            {/* Sidebar */}
            <div className="sidebar">
                {/* Sidebar user panel */}
                <div className="user-panel mt-3 pb-3 mb-3 d-flex">
                    <div className="image">
                        <img src="/images/profile.png" className="img-circle elevation-2" alt="User" />
                    </div>
                    <div className="info">
                        <a href="#" className="d-block">Admin</a>
                    </div>
                </div>

                {/* Sidebar Menu */}
                <nav className="mt-2">
                    <ul className="nav nav-pills nav-sidebar flex-column" role="menu" data-accordion="false">
                        {/* Dashboard */}
                        <li className="nav-item">
                            <Link to="/admin" className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`}>
                                <i className="nav-icon fas fa-tachometer-alt" />
                                <p>Dashboard</p>
                            </Link>
                        </li>

                        {/* Add Center */}
                        <li className="nav-item">
                            <Link to="/admin/add-center" className={`nav-link ${location.pathname === '/admin/add-center' ? 'active' : ''}`}>
                                <i className="nav-icon fas fa-plus-circle" />
                                <p>Add Center</p>
                            </Link>
                        </li>

                        {/* All Centers */}
                        <li className="nav-item">
                            <Link to="/admin/all-centers" className={`nav-link ${location.pathname === '/admin/all-centers' ? 'active' : ''}`}>
                                <i className="nav-icon fas fa-building" />
                                <p>All Centers</p>
                            </Link>
                        </li>

                        {/* Add more options here if needed */}
                    </ul>
                </nav>
            </div>
        </aside>
    );
};

export default Sidebar;

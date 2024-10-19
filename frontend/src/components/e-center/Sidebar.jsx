// src/Sidebar.js
import React from 'react';

const Sidebar = () => {
    return (
        <aside className="main-sidebar sidebar-dark-primary elevation-4">
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
                        <li className="nav-item">
                            <a href="#" className="nav-link active">
                                <i className="nav-icon fas fa-tachometer-alt" />
                                <p>Dashboard</p>
                            </a>
                        </li>
                        <li className="nav-item">
                            <a href="#" className="nav-link">
                                <i className="nav-icon fas fa-th" />
                                <p>
                                    Widgets
                                    <span className="right badge badge-danger">New</span>
                                </p>
                            </a>
                        </li>
                        <li className="nav-item">
                            <a href="#" className="nav-link">
                                <i className="nav-icon fas fa-folder" />
                                <p>Pages</p>
                            </a>
                        </li>
                        <li className="nav-item">
                            <a href="#" className="nav-link">
                                <i className="nav-icon fas fa-chart-pie" />
                                <p>
                                    Charts
                                </p>
                            </a>
                        </li>
                        {/* Add more menu items here */}
                    </ul>
                </nav>
            </div>
        </aside>
    );
};

export default Sidebar;

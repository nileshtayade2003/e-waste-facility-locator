import React from 'react';

const Dashboard = () => {
    return (
        <>
            {/* Content Header (Page header) */}
            <section className="content-header">
                <div className="container-fluid">
                    <div className="row mb-2">
                        <div className="col-sm-6">
                            <h1>Admin Dashboard</h1>
                        </div>
                        <div className="col-sm-6">
                            <ol className="breadcrumb float-sm-right">
                                <li className="breadcrumb-item"><a href="#">Home</a></li>
                                <li className="breadcrumb-item active">Dashboard</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main content */}
            <section className="content">
                <div className="container-fluid">
                    {/* Small boxes (Stat box) */}
                    <div className="row">
                        <div className="col-lg-3 col-6">
                            {/* small box */}
                            <div className="small-box bg-info">
                                <div className="inner">
                                    <h3>150</h3>
                                    <p>Total Centers</p>
                                </div>
                                <div className="icon">
                                    <i className="fas fa-building"></i>
                                </div>
                                <a href="/admin/all-centers" className="small-box-footer">
                                    More info <i className="fas fa-arrow-circle-right"></i>
                                </a>
                            </div>
                        </div>

                        <div className="col-lg-3 col-6">
                            {/* small box */}
                            <div className="small-box bg-success">
                                <div className="inner">
                                    <h3>500</h3>
                                    <p>E-Waste Collected (kg)</p>
                                </div>
                                <div className="icon">
                                    <i className="fas fa-recycle"></i>
                                </div>
                                <a href="#" className="small-box-footer">
                                    More info <i className="fas fa-arrow-circle-right"></i>
                                </a>
                            </div>
                        </div>

                        <div className="col-lg-3 col-6">
                            {/* small box */}
                            <div className="small-box bg-warning">
                                <div className="inner">
                                    <h3>45</h3>
                                    <p>Total Appointments</p>
                                </div>
                                <div className="icon">
                                    <i className="fas fa-calendar-alt"></i>
                                </div>
                                <a href="#" className="small-box-footer">
                                    More info <i className="fas fa-arrow-circle-right"></i>
                                </a>
                            </div>
                        </div>

                        <div className="col-lg-3 col-6">
                            {/* small box */}
                            <div className="small-box bg-danger">
                                <div className="inner">
                                    <h3>75</h3>
                                    <p>Pending Collections</p>
                                </div>
                                <div className="icon">
                                    <i className="fas fa-exclamation-triangle"></i>
                                </div>
                                <a href="#" className="small-box-footer">
                                    More info <i className="fas fa-arrow-circle-right"></i>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Table of recent appointments */}
                    <div className="row">
                        <div className="col-md-12">
                            <div className="card">
                                <div className="card-header border-transparent">
                                    <h3 className="card-title">Recent Appointments</h3>

                                    <div className="card-tools">
                                        <button type="button" className="btn btn-tool" data-card-widget="collapse">
                                            <i className="fas fa-minus"></i>
                                        </button>
                                    </div>
                                </div>
                                {/* /.card-header */}
                                <div className="card-body p-0">
                                    <div className="table-responsive">
                                        <table className="table m-0">
                                            <thead>
                                                <tr>
                                                    <th>Appointment ID</th>
                                                    <th>User Name</th>
                                                    <th>Date</th>
                                                    <th>Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td><a href="#">AP123</a></td>
                                                    <td>John Doe</td>
                                                    <td>2024-10-05</td>
                                                    <td><span className="badge badge-success">Completed</span></td>
                                                </tr>
                                                <tr>
                                                    <td><a href="#">AP124</a></td>
                                                    <td>Jane Smith</td>
                                                    <td>2024-10-04</td>
                                                    <td><span className="badge badge-warning">Pending</span></td>
                                                </tr>
                                                {/* More rows as needed */}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                {/* /.card-body */}
                                <div className="card-footer clearfix">
                                    <a href="/admin/all-appointments" className="btn btn-sm btn-info float-left">View All Appointments</a>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </section>
        </>
    );
};

export default Dashboard;

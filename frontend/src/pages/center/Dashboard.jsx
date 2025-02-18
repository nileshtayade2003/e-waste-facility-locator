// src/Dashboard.js
import React from 'react';

const Dashboard = () => {
  return (
    <div className="">
      {/* Page Header */}
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>Dashboard</h1>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="content">
        <div className="container-fluid">
          <div className="row">
            {/* Total Appointments */}
            <div className="col-lg-3 col-6">
              <div className="small-box bg-info">
                <div className="inner">
                  <h3>120</h3>
                  <p>Total Appointments</p>
                </div>
                <div className="icon">
                  <i className="fas fa-calendar-check"></i>
                </div>
              </div>
            </div>

            {/* Pending Appointments */}
            <div className="col-lg-3 col-6">
              <div className="small-box bg-warning">
                <div className="inner">
                  <h3>15</h3>
                  <p>Pending Appointments</p>
                </div>
                <div className="icon">
                  <i className="fas fa-clock"></i>
                </div>
              </div>
            </div>

            {/* Completed Appointments */}
            <div className="col-lg-3 col-6">
              <div className="small-box bg-success">
                <div className="inner">
                  <h3>100</h3>
                  <p>Completed Appointments</p>
                </div>
                <div className="icon">
                  <i className="fas fa-check-circle"></i>
                </div>
              </div>
            </div>

            {/* Total Customers */}
            <div className="col-lg-3 col-6">
              <div className="small-box bg-danger">
                <div className="inner">
                  <h3>75</h3>
                  <p>Total Customers</p>
                </div>
                <div className="icon">
                  <i className="fas fa-users"></i>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Appointments Table */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Recent Appointments</h3>
            </div>
            <div className="card-body">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Customer Name</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>John Doe</td>
                    <td>2024-07-10</td>
                    <td><span className="badge badge-success">Completed</span></td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td>Jane Smith</td>
                    <td>2024-07-11</td>
                    <td><span className="badge badge-warning">Pending</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Analytics Chart */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Appointment Trends</h3>
            </div>
            <div className="card-body">
              <div className="chart">
                <canvas id="appointmentsChart" style={{ minHeight: '250px', height: '250px', maxHeight: '250px', maxWidth: '100%' }}></canvas>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default Dashboard;

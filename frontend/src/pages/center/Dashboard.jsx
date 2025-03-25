// src/Dashboard.js
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);



const Dashboard = () => {
  const centerId = localStorage.getItem("centerId"); // Get Center ID from localStorage

  const [aStats, setAStats] = useState({
    monthlyStats: [],
    statusCount: [],
  });

  const [stats, setStats] = useState({
    totalAppointments: 0,
    pendingAppointments: 0,
    completedAppointments: 0,
    rejectedAppointments: 0,
    totalCustomers: 0,
    recentAppointments: [],
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/center/dashboard/${centerId}`);
        setStats(response.data);
        console.log(response.data)
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    const fetchAnalytics = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/center/dashboard/analytics/${centerId}`);
        setAStats(response.data);
        console.log(response.data)
      } catch (error) {
        console.error("Error fetching analytics:", error);
      }
    };

    fetchDashboardData();
    fetchAnalytics();
  }, [centerId]);


   // Bar Chart Data - Monthly Appointments
   const barChartData = {
    labels: aStats.monthlyStats.map((data) => `Month ${data._id}`),
    datasets: [
      {
        label: "Total Appointments",
        data: aStats.monthlyStats.map((data) => data.total),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
      {
        label: "Pending",
        data: aStats.monthlyStats.map((data) => data.pending),
        backgroundColor: "rgba(255, 206, 86, 0.6)",
      },
      {
        label: "Completed",
        data: aStats.monthlyStats.map((data) => data.completed),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
      {
        label: "Rejected",
        data: aStats.monthlyStats.map((data) => data.rejected),
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
    ],
  };

  // Pie Chart Data - Appointments by Status
  const pieChartData = {
    labels: aStats.statusCount.map((data) => data._id),
    datasets: [
      {
        data: aStats.statusCount.map((data) => data.count),
        backgroundColor: ["#36A2EB", "#FFCE56", "#4BC0C0", "#FF6384"],
      },
    ],
  };

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
                  <h3>{stats.totalAppointments}</h3>
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
                  <h3>{stats.pendingAppointments}</h3>
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
                  <h3>{stats.completedAppointments}</h3>
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
                  <h3>{stats.totalCustomers}</h3>
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
                  {stats.recentAppointments.length > 0 ? (
                    stats.recentAppointments.map((appointment, index) => (
                      <tr key={appointment._id}>
                        <td>{index + 1}</td>
                        <td>{appointment.user?.name || "Unknown"}</td>
                        <td>{new Date(appointment.appointmentDate).toLocaleDateString()}</td>
                        <td>
                          <span className={`badge badge-${appointment.status === "completed" ? "success" : appointment.status === "pending" ? "warning" : "danger"}`}>
                            {appointment.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center">No recent appointments</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Analytics Chart */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Appointment Trends</h3>
            </div>
            <div className="row">
               {/* Monthly Appointments Bar Chart */}
                <div className="col-lg-6">
                  <div className="card">
                    <div className="card-header">
                      <h3 className="card-title">Monthly Appointments</h3>
                    </div>
                    <div className="card-body">
                      <Bar data={barChartData} />
                    </div>
                  </div>
                </div>
                {/* Appointment Status Pie Chart */}
                <div className="col-lg-6">
                  <div className="card">
                    <div className="card-header">
                      <h3 className="card-title">Appointment Status Breakdown</h3>
                    </div>
                    <div className="card-body">
                      <Pie data={pieChartData} />
                    </div>
                  </div>
                </div>
            </div>
            {/* <div className="card-body">
              <div className="chart">
                
                <canvas id="appointmentsChart" style={{ minHeight: '250px', height: '250px', maxHeight: '250px', maxWidth: '100%' }}>
                </canvas>
              </div>
            </div> */}
          </div>

        </div>
      </section>
    </div>
  );
};

export default Dashboard;

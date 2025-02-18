import React, { useEffect, useState } from "react";
import "admin-lte/dist/css/adminlte.min.css"; // AdminLTE styles
import "datatables.net-bs4/css/dataTables.bootstrap4.min.css"; // DataTables styles
import $ from "jquery";
import "datatables.net-bs4"; // DataTables Bootstrap 4 integration

const ManageAppointments = () => {
  const [appointments, setAppointments] = useState([]);

  // Function to get center ID from localStorage
  const getCenterId = () => localStorage.getItem("centerId");

  useEffect(() => {
    const fetchAppointments = async () => {
      const centerId = getCenterId();
      if (!centerId) return console.error("Center ID not found");

      try {
        const response = await fetch(
          `http://localhost:5000/api/center/${centerId}/appointments`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("centerToken")}`,
            },
          }
        );
        const data = await response.json();

        if (data.success) {
          setAppointments(data.appointments);
        } else {
          console.error("Failed to fetch appointments:", data);
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, []);

  useEffect(() => {
    if (appointments.length > 0) {
      if ($.fn.DataTable.isDataTable("#appointmentsTable")) {
        $("#appointmentsTable").DataTable().destroy();
      }
      $("#appointmentsTable").DataTable();
    }
  }, [appointments]); // Run only when appointments change

  return (
    <div className="card mt-5">
      <div className="card-header">
        <h3 className="card-title">Appointments</h3>
      </div>
      <div className="card-body">
        <div className="table-responsive">
          <table id="appointmentsTable" className="table table-bordered table-hover">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Product</th>
                <th>Appointment Date</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.length > 0 ? (
                appointments.map((appointment, index) => (
                  <tr key={appointment._id}>
                    <td>{index + 1}</td>
                    <td>{appointment.name}</td>
                    <td>{appointment.email}</td>
                    <td>{appointment.mobileNumber}</td>
                    <td>{appointment.productName}</td>
                    <td>{new Date(appointment.appointmentDate).toLocaleDateString()}</td>
                    <td>{appointment.appointmentTime}</td>
                    <td>
                      <span
                        className={`badge ${
                          appointment.status === "pending"
                            ? "badge-warning"
                            : "badge-success"
                        }`}
                      >
                        {appointment.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center">
                    No appointments found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageAppointments;

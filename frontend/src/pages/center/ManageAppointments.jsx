import React, { useEffect, useState } from "react";
import "admin-lte/dist/css/adminlte.min.css";
import "datatables.net-bs4/css/dataTables.bootstrap4.min.css";
import $ from "jquery";
import "datatables.net-bs4";

const ManageAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

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
  }, [appointments]);

  const handleStatusChange = async (id, status) => {
    try {
      const response = await fetch(`http://localhost:5000/api/appointments/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("centerToken")}`,
        },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();
      if (data.success) {
        setAppointments((prev) =>
          prev.map((appt) => (appt._id === id ? { ...appt, status } : appt))
        );
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

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
                <th>Actions</th>
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
                            : appointment.status === "approved"
                            ? "badge-primary"
                            : "badge-success"
                        }`}
                      >
                        {appointment.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-info btn-sm"
                        onClick={() => setSelectedAppointment(appointment)}
                        data-toggle="modal"
                        data-target="#appointmentModal"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center">
                    No appointments found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Viewing Appointment Details */}
      {selectedAppointment && (
        <div className="modal fade" id="appointmentModal">
          <div className="modal-dialog modal-lg modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Appointment Details</h5>
                <button className="close" data-dismiss="modal">&times;</button>
              </div>
              <div className="modal-body">
                <p><strong>Name:</strong> {selectedAppointment.name}</p>
                <p><strong>Email:</strong> {selectedAppointment.email}</p>
                <p><strong>Mobile:</strong> {selectedAppointment.mobileNumber}</p>
                <p><strong>Product:</strong> {selectedAppointment.productName}</p>
                <p><strong>Appointment Date:</strong> {new Date(selectedAppointment.appointmentDate).toLocaleDateString()}</p>
                <p><strong>Time:</strong> {selectedAppointment.appointmentTime}</p>
                <p><strong>Status:</strong> {selectedAppointment.status}</p>
                <img src={`http://localhost:5000/${selectedAppointment.productPhoto}`} alt="Product" className="img-fluid" />
              </div>
              <div className="modal-footer">
                <button className="btn btn-success" onClick={() => handleStatusChange(selectedAppointment._id, "approved")}>Approve</button>
                <button className="btn btn-danger" onClick={() => handleStatusChange(selectedAppointment._id, "rejected")}>Reject</button>
                <button className="btn btn-primary" onClick={() => handleStatusChange(selectedAppointment._id, "completed")}>Mark as Completed</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageAppointments;

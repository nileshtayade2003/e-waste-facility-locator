import React, { useEffect, useState } from "react";
import "admin-lte/dist/css/adminlte.min.css";
import "datatables.net-bs4/css/dataTables.bootstrap4.min.css";
import $ from "jquery";
import "datatables.net-bs4";
import axios from "axios";
import { useNavigate } from "react-router-dom";



const ManageAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [amountPaid, setAmountPaid] = useState("");
  const navigate = useNavigate()


  const getCenterId = () => localStorage.getItem("centerId");

  useEffect(() => {
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

  const fetchAppointments = async () => {
    const centerId = getCenterId();
    if (!centerId) return console.error("Center ID not found");

    try {
      const response = await axios.get(
        `http://localhost:5000/api/center/${centerId}/appointments`
      );

      if (response.data.success) {
        setAppointments(response.data.appointments);
      } else {
        console.error("Failed to fetch appointments:", response.data);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  const updateAppointmentStatus = (id, status, extraData = {}) => {
    setAppointments((prev) =>
      prev.map((appt) =>
        appt._id === id ? { ...appt, status, ...extraData } : appt
      )
    );
  };

  const approveAppointment = async (id) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/center/appointments/${id}/approve`
      );

      if (response.data.success) {
        updateAppointmentStatus(id, "approved");
        alert("Appointment approved successfully!");
        // Close the modal
        setSelectedAppointment(null); 

        // ✅ Remove Bootstrap modal backdrop manually
        document.body.classList.remove("modal-open"); // Removes the class that prevents clicking
        document.querySelectorAll(".modal-backdrop").forEach((backdrop) => backdrop.remove());
      }
      else{
        alert(response.data.message)
      }
    } catch (error) {
      console.error("Error approving appointment:", error);
    }
  };

  const rejectAppointment = async (id) => {
    if (!rejectReason) {
      alert("Please enter a reason for rejection.");
      return;
    }


    try {
      const response = await axios.put(
        `http://localhost:5000/api/center/reject/${id}`,
        { rejectionReason: rejectReason }
      );

      if (response.data.success) {
        updateAppointmentStatus(id, "rejected", { rejectionReason });
        alert("Appointment rejected successfully!");
      }
    } catch (error) {
      console.error("Error rejecting appointment:", error);
    }
  };

  const completeAppointment = async (id) => {
    if (!amountPaid) {
      alert("Please enter an amount paid.");
      return;
    }
    console.log(id)

    try {
      const response = await axios.put(
        `http://localhost:5000/api/center/complete/${id}`,
        { amountPaid: amountPaid }
      );

      if (response.data.success) {
        updateAppointmentStatus(id, "completed", { amountPaid });
        alert("Appointment marked as completed!");
      }
    } catch (error) {
      console.error("Error completing appointment:", error);
    }
  };

  return (
    <div className="card mt-5">
      <div className="card-header">
        <h3 className="card-title">Appointments</h3>
      </div>
      <div className="card-body">
        <div className="table-responsive">
          <table
            id="appointmentsTable"
            className="table table-bordered table-hover"
          >
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
                    <td>
                      {new Date(
                        appointment.appointmentDate
                      ).toLocaleDateString()}
                    </td>
                    <td>{appointment.appointmentTime}</td>
                    <td>
                      <span
                        className={`badge badge-${
                          appointment.status === "pending"
                            ? "warning"
                            : appointment.status === "approved"
                            ? "primary"
                            : appointment.status === "completed"
                            ? "success"
                            : "danger"
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

      {selectedAppointment && (
        <div
          className="modal fade show"
          id="appointmentModal"
          style={{ display: "block" }}
        >
          <div className="modal-dialog modal-lg modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Appointment Details</h5>
                <button
                  className="close"
                  data-dismiss="modal"
                  onClick={() => setSelectedAppointment(null)}
                >
                  &times;
                </button>
              </div>
              <div className="modal-body">
                <p>
                  <strong>Name:</strong> {selectedAppointment.name}
                </p>
                <p>
                  <strong>Email:</strong> {selectedAppointment.email}
                </p>
                <p>
                  <strong>Mobile:</strong> {selectedAppointment.mobileNumber}
                </p>
                <p>
                  <strong>Product:</strong> {selectedAppointment.productName}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(
                    selectedAppointment.appointmentDate
                  ).toLocaleDateString()}
                </p>
                <p>
                  <strong>Time:</strong> {selectedAppointment.appointmentTime}
                </p>
                <p>
                  <strong>Status:</strong> {selectedAppointment.status}
                </p>
                <img
                  src={`http://localhost:5000/${selectedAppointment.productPhoto}`}
                  alt="Product"
                  className="img-fluid"
                />
              </div>
              {/* <div className="modal-footer">
                <button className="btn btn-success" onClick={() => approveAppointment(selectedAppointment._id)}>Approve</button>
                <button className="btn btn-danger" data-toggle="modal" data-target="#rejectModal">Reject</button>
                <button className="btn btn-primary" data-toggle="modal" data-target="#completeModal">Complete</button>
              </div> */}
              {selectedAppointment?.status === "approved" && (
                <button
                  className="btn btn-primary"
                  data-toggle="modal"
                  data-target="#completeModal"
                >
                  Complete
                </button>
              )}

              {selectedAppointment?.status === "rejected" && (
                <button className="btn btn-danger" disabled>
                  Rejected
                </button>
              )}

              {selectedAppointment?.status === "completed" && (
                <button className="btn btn-success" disabled>
                  Completed
                </button>
              )}

              {selectedAppointment?.status === "pending" && (
                <>
                  <button
                    className="btn btn-success"
                    onClick={() => approveAppointment(selectedAppointment._id)}
                  >
                    Approve
                  </button>
                  <button
                    className="btn btn-danger"
                    data-toggle="modal"
                    data-target="#rejectModal"
                  >
                    Reject
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      <div className="modal fade" id="rejectModal">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-body">
              <textarea
                className="form-control"
                placeholder="Rejection reason"
                onChange={(e) => setRejectReason(e.target.value)}
              ></textarea>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-danger"
                onClick={() => rejectAppointment(selectedAppointment._id)}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Complete Modal */}
      <div className="modal fade" id="completeModal">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-body">
              <label>Amount Paid</label>
              <input
                type="number"
                className="form-control"
                onChange={(e) => setAmountPaid(e.target.value)}
              />
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-primary"
                onClick={() => completeAppointment(selectedAppointment._id)}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageAppointments;

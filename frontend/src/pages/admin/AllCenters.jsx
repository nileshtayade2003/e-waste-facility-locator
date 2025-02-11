import React, { useEffect, useState } from "react";
import axios from "axios";
import $ from "jquery"; // jQuery for DataTables
import "datatables.net-dt";
import "datatables.net-bs4"; // DataTables Bootstrap 4 integration
import "admin-lte/dist/css/adminlte.min.css"; // AdminLTE styles
import "datatables.net-bs4/css/dataTables.bootstrap4.min.css"; // DataTables styles
import "bootstrap/dist/css/bootstrap.min.css"; // Bootstrap for modal
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // Bootstrap JS
import { Modal } from "bootstrap"; // Import Bootstrap modal

const AllCenters = () => {
  const [centers, setCenters] = useState([]);
  const [selectedCenter, setSelectedCenter] = useState(null); // Store selected center for view modal
  const [modalInstance, setModalInstance] = useState(null); // Store view modal instance

  const [editCenter, setEditCenter] = useState(null); // Store the center being edited
  const [editFormData, setEditFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    lat: "",
    lng: "",
    image: null,
  });
  const [editModalInstance, setEditModalInstance] = useState(null); // Store edit modal instance

  // Fetch centers from the backend
  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const token = localStorage.getItem("adminToken"); // Get token from storage

        if (!token) {
          console.error("No token found!");
          return;
        }

        const response = await axios.get("http://localhost:5000/api/admin/get-centers", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setCenters(response.data);

        // Initialize DataTable after data is loaded
        setTimeout(() => {
          $("#centersTable").DataTable();
        }, 500);
      } catch (err) {
        console.error("Error fetching centers:", err.response?.data || err.message);
      }
    };

    fetchCenters();

    // Initialize Bootstrap Modal instances
    const viewModalElement = document.getElementById("viewModal");
    const editModalElement = document.getElementById("editModal");
    if (viewModalElement) setModalInstance(new Modal(viewModalElement));
    if (editModalElement) setEditModalInstance(new Modal(editModalElement));
  }, []);

  // Handle View Button Click (Open View Modal)
  const handleView = (center) => {
    setSelectedCenter(center);
    if (modalInstance) modalInstance.show(); // Use Bootstrap's JavaScript API
  };

  // Handle Edit Button Click (Open Edit Modal)
  const handleEdit = (center) => {
    setEditCenter(center); // Set the center being edited
    setEditFormData({
      name: center.name,
      email: center.email,
      password: "", // Password is not pre-filled for security
      phone: center.phone,
      address: center.address,
      lat: center.lat,
      lng: center.lng,
      image: null, // Image is not pre-filled to allow new uploads
    });
    if (editModalInstance) editModalInstance.show(); // Open the edit modal
  };

  // Handle Delete Button Click
 const handleDelete = async (id) => {
  if (!window.confirm("Are you sure you want to delete this center?")) return;

  try {
    const token = localStorage.getItem("adminToken");
    await axios.delete(`http://localhost:5000/api/admin/delete-center/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Remove the deleted center from state
    setCenters((prevCenters) => prevCenters.filter((center) => center._id !== id));


    // Reinitialize DataTables after deleting a center
    setTimeout(() => {
      $("#centersTable").DataTable().destroy(); // Destroy existing DataTable instance
      $("#centersTable").DataTable(); // Reinitialize DataTable
    }, 100);

    

    console.log("Center deleted successfully");

  
  } catch (error) {
    console.error("Error deleting center:", error.response?.data || error.message);
  }
};

  // Handle Edit Form Input Changes
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value,
    });
  };

  // Handle Edit Form Image Change
  const handleEditImageChange = (e) => {
    setEditFormData({
      ...editFormData,
      image: e.target.files[0],
    });
  };

  // Handle Edit Form Submission
  const handleEditSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("adminToken");
      const data = new FormData();
      data.append("name", editFormData.name);
      data.append("email", editFormData.email);
      data.append("password", editFormData.password);
      data.append("phone", editFormData.phone);
      data.append("address", editFormData.address);
      data.append("lat", editFormData.lat);
      data.append("lng", editFormData.lng);
      if (editFormData.image) data.append("image", editFormData.image);

      const response = await axios.patch(
        `http://localhost:5000/api/admin/update-center/${editCenter._id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Center updated successfully:", response.data);

      // Update the centers list in state
      setCenters(
        centers.map((center) =>
          center._id === editCenter._id ? response.data.center : center
        )
      );

      // Close the modal
      if (editModalInstance) editModalInstance.hide();
    } catch (error) {
      console.error("Error updating center:", error.response?.data || error.message);
    }
  };

  return (
    <div className=" mt-5">
      <h2 className="mb-4">All E-Waste Centers</h2>
      <div className="table-responsive">
        <table id="centersTable" className="table table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {centers.map((center) => (
              <tr key={center._id}>
                <td>{center.name}</td>
                <td>{center.email}</td>
                <td>{center.phone}</td>
                <td>{center.address}</td>
                <td>
                  {center.image ? (
                    <img src={`http://localhost:5000/uploads/${center.image}`} alt="Center" width="50" />
                  ) : (
                    "No Image"
                  )}
                </td>
                <td>
                  <button className="btn btn-info btn-sm me-2" onClick={() => handleView(center)}>
                    View
                  </button>
                  <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(center)}>
                    Edit
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(center._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View Modal */}
      <div className="modal fade" id="viewModal" tabIndex="-1" aria-labelledby="viewModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="viewModalLabel">Center Details</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              {selectedCenter ? (
                <div>
                  <p><strong>Name:</strong> {selectedCenter.name}</p>
                  <p><strong>Email:</strong> {selectedCenter.email}</p>
                  <p><strong>Phone:</strong> {selectedCenter.phone}</p>
                  <p><strong>Address:</strong> {selectedCenter.address}</p>
                  {selectedCenter.image && (
                    <div className="text-center">
                      <img
                        src={`http://localhost:5000/uploads/${selectedCenter.image}`}
                        alt="Center"
                        className="img-fluid rounded"
                        width="200"
                      />
                    </div>
                  )}
                </div>
              ) : (
                <p>No details available</p>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <div className="modal fade" id="editModal" tabIndex="-1" aria-labelledby="editModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="editModalLabel">Edit Center</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleEditSubmit} encType="multipart/form-data">
                <div className="mb-3">
                  <label htmlFor="editName" className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="editName"
                    name="name"
                    value={editFormData.name}
                    onChange={handleEditFormChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="editEmail" className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="editEmail"
                    name="email"
                    value={editFormData.email}
                    onChange={handleEditFormChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="editPassword" className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="editPassword"
                    name="password"
                    placeholder="Leave blank to keep current password"
                    value={editFormData.password}
                    onChange={handleEditFormChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="editPhone" className="form-label">Phone</label>
                  <input
                    type="text"
                    className="form-control"
                    id="editPhone"
                    name="phone"
                    value={editFormData.phone}
                    onChange={handleEditFormChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="editAddress" className="form-label">Address</label>
                  <input
                    type="text"
                    className="form-control"
                    id="editAddress"
                    name="address"
                    value={editFormData.address}
                    onChange={handleEditFormChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="editLat" className="form-label">Latitude</label>
                  <input
                    type="text"
                    className="form-control"
                    id="editLat"
                    name="lat"
                    value={editFormData.lat}
                    onChange={handleEditFormChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="editLng" className="form-label">Longitude</label>
                  <input
                    type="text"
                    className="form-control"
                    id="editLng"
                    name="lng"
                    value={editFormData.lng}
                    onChange={handleEditFormChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="editImage" className="form-label">Image</label>
                  <input
                    type="file"
                    className="form-control"
                    id="editImage"
                    name="image"
                    onChange={handleEditImageChange}
                  />
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                    Close
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllCenters;
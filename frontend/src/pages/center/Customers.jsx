import React, { useEffect, useState } from "react";
import "admin-lte/dist/css/adminlte.min.css";
import "datatables.net-bs4/css/dataTables.bootstrap4.min.css";
import $ from "jquery";
import "datatables.net-bs4";
import axios from "axios";

const ManageCustomers = () => {
  const [customers, setCustomers] = useState([]);

  const getCenterId = () => localStorage.getItem("centerId");

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    if (customers.length > 0) {
      if ($.fn.DataTable.isDataTable("#customersTable")) {
        $("#customersTable").DataTable().destroy();
      }
      $("#customersTable").DataTable();
    }
  }, [customers]);

  const fetchCustomers = async () => {
    const centerId = getCenterId();
    if (!centerId) return console.error("Center ID not found");

    try {
      const response = await axios.get(
        `http://localhost:5000/api/center/customers/${centerId}`
      );

      if (response.data.success) {
        setCustomers(response.data.customers);
      } else {
        console.error("Failed to fetch customers:", response.data);
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  return (
    <div className="card mt-5 mb-5">
      <div className="card-header">
        <h3 className="card-title">Customers</h3>
      </div>
      <div className="card-body">
        <div className="table-responsive">
          <table id="customersTable" className="table table-bordered table-hover">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile</th>
              </tr>
            </thead>
            <tbody>
              {customers.length > 0 ? (
                customers.map((customer, index) => (
                  <tr key={customer._id}>
                    <td>{index + 1}</td>
                    <td>{customer.name}</td>
                    <td>{customer.email}</td>
                    <td>{customer.mobile}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">No customers found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageCustomers;

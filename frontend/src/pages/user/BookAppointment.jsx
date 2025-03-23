import React, { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../../context/UserContext';

const BookAppointment = () => {
  const { user } = useContext(UserContext); // Get user details from context
  const { centerId } = useParams(); // Get centerId from URL

  const [formData, setFormData] = useState({
    name: user?.name || '', // Pre-fill name
    email: user?.email || '', // Pre-fill email
    mobileNumber: user?.mobile || '', // Pre-fill mobile
    address: '',
    productName: '',
    appointmentDate: '',
    appointmentTime: '',
    productPhoto: null,
  });

  // Update form data when user context changes
  useEffect(() => {
    if (user) {
      setFormData((prevData) => ({
        ...prevData,
        name: user.name,
        email: user.email,
        mobileNumber: user.mobile,
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, productPhoto: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append('centerId', centerId); // Add centerId
    formDataToSend.append('userId', user._id); // Add userId to identify the user
    formDataToSend.append('name', formData.name);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('mobileNumber', formData.mobileNumber);
    formDataToSend.append('address', formData.address);
    formDataToSend.append('productName', formData.productName);
    formDataToSend.append('appointmentDate', formData.appointmentDate);
    formDataToSend.append('appointmentTime', formData.appointmentTime);
    if (formData.productPhoto) {
      formDataToSend.append('productPhoto', formData.productPhoto);
    }

    try {
      const response = await axios.post('http://localhost:5000/api/user/book-appointment', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      alert('Appointment booked successfully!');
      console.log(response.data);
    } catch (error) {
      console.error(error);
      alert('Failed to book appointment.');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-lg-8 col-md-10 col-sm-12">
          <h2 className="mb-4 text-center mt-3">Book Appointment</h2>
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="name" className="form-label">Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  readOnly // Make field read-only
                />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  readOnly // Make field read-only
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="mobileNumber" className="form-label">Mobile Number</label>
                <input
                  type="tel"
                  className="form-control"
                  id="mobileNumber"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  required
                  readOnly // Make field read-only
                />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="address" className="form-label">Address</label>
                <input
                  type="text"
                  className="form-control"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="productName" className="form-label">Product Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="productName"
                  name="productName"
                  value={formData.productName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="appointmentDate" className="form-label">Appointment Date</label>
                <input
                  type="date"
                  className="form-control"
                  id="appointmentDate"
                  name="appointmentDate"
                  value={formData.appointmentDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="appointmentTime" className="form-label">Appointment Time</label>
                <input
                  type="time"
                  className="form-control"
                  id="appointmentTime"
                  name="appointmentTime"
                  value={formData.appointmentTime}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="productPhoto" className="form-label">Upload Photo of Product</label>
                <input
                  type="file"
                  className="form-control"
                  id="productPhoto"
                  name="productPhoto"
                  onChange={handleFileChange}
                  required
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary w-100">Book Appointment</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;
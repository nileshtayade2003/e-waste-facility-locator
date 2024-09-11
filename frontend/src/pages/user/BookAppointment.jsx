import React, { useState } from 'react'

const BookAppointment = () => {
 
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      mobile: '',
      address: '',
      productName: '',
      eWasteCenter: '',
      appointmentDate: '',
      appointmentTime: '',
      photo: null
    });
  
    const eWasteCenters = [
      'Green Recyclers',
      'Eco Waste Collection',
      'Safe Waste Disposal',
      'Urban Waste Solutions'
    ];
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({
        ...formData,
        [name]: value
      });
    };
  
    const handleFileChange = (e) => {
      setFormData({
        ...formData,
        photo: e.target.files[0]
      });
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      // Handle form submission (you can send the data to your backend here)
      console.log(formData);
    };
  
    return (
      <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-lg-6 col-md-8 col-sm-12">
          <h2 className="mb-4 text-center mt-3">Book Appointment</h2>
          <form onSubmit={handleSubmit}>
            {/* Name */}
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Email */}
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Mobile */}
            <div className="mb-3">
              <label htmlFor="mobile" className="form-label">Mobile Number</label>
              <input
                type="tel"
                className="form-control"
                id="mobile"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                required
              />
            </div>

            {/* Address */}
            <div className="mb-3">
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

            {/* Product Name */}
            <div className="mb-3">
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

            {/* E-Waste Collection Center Dropdown */}
            <div className="mb-3">
              <label htmlFor="eWasteCenter" className="form-label">Select E-Waste Collection Center</label>
              <select
                className="form-select"
                id="eWasteCenter"
                name="eWasteCenter"
                value={formData.eWasteCenter}
                onChange={handleChange}
                required
              >
                <option value="">Choose...</option>
                {eWasteCenters.map((center, index) => (
                  <option key={index} value={center}>{center}</option>
                ))}
              </select>
            </div>

            {/* Appointment Date */}
            <div className="mb-3">
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

            {/* Appointment Time */}
            <div className="mb-3">
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

            {/* Photo Upload */}
            <div className="mb-3">
              <label htmlFor="photo" className="form-label">Upload Photo of Product</label>
              <input
                type="file"
                className="form-control"
                id="photo"
                name="photo"
                onChange={handleFileChange}
                required
              />
            </div>

            {/* Submit Button */}
            <button type="submit" className="btn btn-primary w-100">Book Appointment</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default BookAppointment

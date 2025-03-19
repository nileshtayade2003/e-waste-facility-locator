import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "admin-lte/dist/css/adminlte.min.css";
import "bootstrap/dist/css/bootstrap.min.css";

const Register = () => {
  const navigate = useNavigate(); // For redirection

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
  });

  const [message, setMessage] = useState(""); // For success/error messages

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post("http://localhost:5000/api/user/register", formData);
      setMessage(response.data.message);
      alert("Registration Successful!");
      navigate("/login"); // Redirect to login page
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div className="hold-transition register-page" style={{ minHeight: "100vh" }}>
      <div className="register-box">
        <div className="card card-outline card-primary">
          <div className="card-header text-center">
            <h1><b>User</b> Registration</h1>
          </div>
          <div className="card-body">
            {message && <div className="alert alert-info">{message}</div>}
            <form onSubmit={handleSubmit}>
              <div className="input-group mb-3">
                <input type="text" name="name" className="form-control" placeholder="Full Name" onChange={handleChange} required />
                <div className="input-group-append">
                  <div className="input-group-text"><span className="fas fa-user"></span></div>
                </div>
              </div>
              <div className="input-group mb-3">
                <input type="email" name="email" className="form-control" placeholder="Email" onChange={handleChange} required />
                <div className="input-group-append">
                  <div className="input-group-text"><span className="fas fa-envelope"></span></div>
                </div>
              </div>
              <div className="input-group mb-3">
                <input type="tel" name="mobile" className="form-control" placeholder="Mobile Number" onChange={handleChange} required />
                <div className="input-group-append">
                  <div className="input-group-text"><span className="fas fa-phone"></span></div>
                </div>
              </div>
              <div className="input-group mb-3">
                <input type="password" name="password" className="form-control" placeholder="Password" onChange={handleChange} required />
                <div className="input-group-append">
                  <div className="input-group-text"><span className="fas fa-lock"></span></div>
                </div>
              </div>
              <div className="row">
                <div className="col-12">
                  <button type="submit" className="btn btn-primary btn-block">Register</button>
                </div>
              </div>
            </form>
            <p className="mt-3 text-center">
              <Link to="/login">Already have an account? Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

import React, { useContext, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext"; // Import UserContext

const UserLogin = () => {
  const { setUser } = useContext(UserContext); // Use context for authentication
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://localhost:5000/api/user/login", {
        email,
        password,
      });

      const { token, user } = response.data;

      // Store token in localStorage
      localStorage.setItem("userToken", token);

      // Set user in context
      setUser(user);

      // Redirect to home page
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="hold-transition login-page">
      <div className="login-box">
        <div className="login-logo">
          <a href="/"><b>User</b> LOGIN</a>
        </div>

        <div className="card">
          <div className="card-body login-card-body">
            <p className="login-box-msg">Sign in to start your session</p>

            {error && <p className="text-danger">{error}</p>}

            <form onSubmit={handleSubmit}>
              <div className="input-group mb-3">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <span className="fas fa-envelope"></span>
                  </div>
                </div>
              </div>

              <div className="input-group mb-3">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <span className="fas fa-lock"></span>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-8">
                  <div className="icheck-primary">
                    <input type="checkbox" id="remember" />
                    <label htmlFor="remember">Remember Me</label>
                  </div>
                </div>

                <div className="col-4">
                  <button type="submit" className="btn btn-primary btn-block">
                    Sign In
                  </button>
                </div>
              </div>
            </form>

            <p className="mb-1">
              <a href="#">Forgot password?</a>
            </p>
            <p className="mb-0">
              <Link to="/register" className="text-center">
                Register a new account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;

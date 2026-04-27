import React, { useState } from "react";
import "./Signup.css";
import { useNavigate } from "react-router-dom";
import { authService } from "./services/api";

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const fullName = `${formData.firstName} ${formData.lastName}`;
      await authService.register(fullName, formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || "Failed to register");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-main">
      <form className="signup-container" onSubmit={handleSignup}>
        <h1>Create Account</h1>
        <p className="sub-text">Start building your AI Resume</p>
        {error && <p style={{ color: '#ff5f56', marginBottom: '15px', fontWeight: 'bold' }}>{error}</p>}
        <div className="name-row">
          <div className="signup-input">
            <input 
                type="text" 
                name="firstName"
                placeholder="First Name" 
                value={formData.firstName}
                onChange={handleChange}
                required
            />
          </div>
          <div className="signup-input">
            <input 
                type="text" 
                name="lastName"
                placeholder="Last Name" 
                value={formData.lastName}
                onChange={handleChange}
                required
            />
          </div>
        </div>
        <div className="signup-input">
          <input 
            type="email" 
            name="email"
            placeholder="Email Address" 
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="signup-input">
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button className="signup-btn" type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Create Account →"}
        </button>
        <p className="login-link">
          Already have an account? <span onClick={() => navigate("/login")}>Login</span>
        </p>
      </form>
    </div>
  );
}


export default Signup;
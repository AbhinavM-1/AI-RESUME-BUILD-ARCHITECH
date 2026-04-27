import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaEnvelope, FaCheckCircle } from "react-icons/fa";
import "./Login.css"; // Reuse login styles for consistency

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitted(true);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="main">
      <div className="container" style={{ height: 'auto', padding: '60px' }}>
        <div className="right" style={{ width: '100%', maxWidth: '500px', margin: '0 auto' }}>
          {!isSubmitted ? (
            <form className="card" onSubmit={handleSubmit}>
              <button 
                type="button" 
                className="back-link" 
                onClick={() => navigate("/login")}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', fontWeight: '600' }}
              >
                <FaArrowLeft /> Back to Login
              </button>
              <h2>Reset Password</h2>
              <p className="sub">Enter your email and we'll send you a link to reset your password.</p>
              
              <div className="input">
                <input 
                  type="email" 
                  placeholder="name@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <FaEnvelope className="eye" style={{ cursor: 'default' }} />
              </div>

              <button className="btn" type="submit" disabled={loading}>
                {loading ? "Sending..." : "Send Reset Link →"}
              </button>
            </form>
          ) : (
            <div className="card" style={{ textAlign: 'center' }}>
              <FaCheckCircle size={60} color="#10b981" style={{ marginBottom: '20px' }} />
              <h2>Check your email</h2>
              <p className="sub">We've sent a password reset link to <strong>{email}</strong></p>
              <button className="btn" onClick={() => navigate("/login")}>
                Return to Login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;

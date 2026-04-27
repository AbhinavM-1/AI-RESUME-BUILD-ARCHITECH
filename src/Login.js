import React, { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaApple, FaMicrosoft } from "react-icons/fa";
import logo from "./assets/logo.png";
import { authService } from "./services/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await authService.login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || "Failed to login");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    setLoading(true);
    const width = 500, height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
    const popup = window.open('about:blank', `${provider} Login`, `width=${width},height=${height},left=${left},top=${top}`);
    
    const providerColors = {
        Google: '#4285f4',
        Apple: '#000000',
        Microsoft: '#00a4ef'
    };

    if (popup) {
        popup.document.write(`<html><head><title>Sign in with ${provider}</title><style>body{font-family:sans-serif;display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;margin:0;background:#f8fafc;} .card{background:white;padding:40px;border-radius:8px;box-shadow:0 4px 6px rgba(0,0,0,0.1);text-align:center;} h1{font-size:24px;margin-bottom:8px;} p{color:#64748b;margin-bottom:24px;} .btn{background:${providerColors[provider]};color:white;border:none;padding:12px 24px;border-radius:4px;font-weight:600;cursor:pointer;}</style></head><body><div class="card"><h1>Sign in</h1><p>to continue to AI Resume Pro</p><div style="border:1px solid #e2e8f0;padding:12px;border-radius:4px;margin-bottom:24px;display:flex;align-items:center;gap:12px;"><div style="width:32px;height:32px;background:#64748b;border-radius:50%;color:white;display:flex;align-items:center;justify-content:center;font-weight:bold;">U</div><div style="text-align:left;"><strong>Secure User</strong><br/><span style="font-size:12px;color:#64748b;">user@example.com</span></div></div><button class="btn" onclick="window.opener.postMessage('social-success', '*'); window.close();">Continue as User</button></div></body></html>`);
    }

    const handleMessage = (event) => {
        if (event.data === 'social-success') {
            localStorage.setItem('token', `mock-${provider.toLowerCase()}-token`);
            localStorage.setItem('user', JSON.stringify({ name: 'Secure User', email: 'user@example.com', id: `${provider.toLowerCase()}-123` }));
            navigate('/dashboard');
        }
    };

    window.addEventListener('message', handleMessage, { once: true });
  };

  return (
    <div className="main">
      <div className="container">
        <div className="logo">
          <div className="logo-box">
            <img src={logo} alt="AI Resume Builder Logo" />
          </div>
        </div>
        <div className="left">
          <div className="left-content">
            <h1>Welcome <br /><span>Back</span></h1>
            <p>Great to see you again! Log in to continue your journey.</p>
          </div>
        </div>
        <div className="right">
          <form className="card" onSubmit={handleLogin}>
            <h2>Login</h2>
            <p className="sub">Sign in to access your account</p>
            {error && <p style={{ color: '#ff5f56', marginBottom: '15px', fontWeight: 'bold' }}>{error}</p>}
            <div className="input">
              <input 
                type="email" 
                placeholder="name@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="input">
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="forgot" onClick={() => navigate("/forgot-password")}>Forgot password?</div>
            <button className="btn" type="submit" disabled={loading}>
                {loading ? "Signing in..." : "Login →"}
            </button>
            <div className="divider">or continue with</div>
            <div className="social-column">
              <button type="button" className="social-btn google" onClick={() => handleSocialLogin('Google')}>
                <FcGoogle size={22} /> <span>Sign in with Google</span>
              </button>
              <button type="button" className="social-btn apple" onClick={() => handleSocialLogin('Apple')}>
                <FaApple size={20} /> <span>Sign in with Apple</span>
              </button>
              <button type="button" className="social-btn microsoft" onClick={() => handleSocialLogin('Microsoft')}>
                <FaMicrosoft size={20} /> <span>Sign in with Microsoft</span>
              </button>
            </div>
            <p className="signup">
              Don’t have an account? <span onClick={() => navigate("/signup")}>Sign up</span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
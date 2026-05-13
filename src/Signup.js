import React, { useState } from "react";
import "./Signup.css";
import { useNavigate } from "react-router-dom";
import { authService } from "./services/api";
import { FcGoogle } from "react-icons/fc";
import { FaApple, FaGithub } from "react-icons/fa";

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

  const [showPassword, setShowPassword] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const fullName = `${formData.firstName} ${formData.lastName}`;
      await authService.register(fullName, formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || "Email already in use or invalid data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    setLoading(true);
    const width = 500, height = 650;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
    const popup = window.open('about:blank', `${provider} Login`, `width=${width},height=${height},left=${left},top=${top}`);
    
    const providerColors = {
        Google: '#4285f4',
        Apple: '#000000',
        GitHub: '#333'
    };

    if (popup) {
        popup.document.write(`
            <html>
            <head>
                <title>Sign up with ${provider}</title>
                <style>
                    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #f1f5f9; color: #1e293b; }
                    .card { background: white; padding: 32px; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); text-align: center; width: 350px; border: 1px solid #e2e8f0; position: relative; overflow: hidden; }
                    .logo { font-size: 24px; font-weight: 800; margin-bottom: 8px; color: ${providerColors[provider]}; }
                    h1 { font-size: 20px; margin: 0 0 8px; color: #0f172a; }
                    p { color: #64748b; font-size: 14px; margin-bottom: 24px; }
                    .account-list { text-align: left; margin-bottom: 24px; }
                    .account-item { display: flex; align-items: center; gap: 12px; padding: 12px; border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 8px; cursor: pointer; transition: 0.2s; }
                    .account-item:hover { background: #f8fafc; border-color: ${providerColors[provider]}; }
                    .avatar { width: 36px; height: 36px; background: #cbd5e1; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; }
                    .info { display: flex; flex-direction: column; }
                    .name { font-weight: 600; font-size: 14px; }
                    .email { font-size: 12px; color: #64748b; }
                    .footer { font-size: 12px; color: #94a3b8; margin-top: 24px; line-height: 1.5; }
                    .other { color: ${providerColors[provider]}; font-weight: 600; text-decoration: none; font-size: 13px; cursor: pointer; display: block; margin-top: 12px; }
                    .form-screen { display: none; text-align: left; }
                    .input-group { margin-bottom: 16px; }
                    .input-group label { display: block; font-size: 12px; font-weight: 600; margin-bottom: 4px; color: #64748b; }
                    .input-group input { width: 100%; padding: 10px; border: 1px solid #e2e8f0; border-radius: 6px; box-sizing: border-box; }
                    .btn-submit { width: 100%; background: ${providerColors[provider]}; color: white; border: none; padding: 12px; border-radius: 6px; font-weight: 600; cursor: pointer; margin-top: 8px; }
                    .back-btn { font-size: 12px; color: #64748b; cursor: pointer; margin-bottom: 16px; display: inline-block; }
                </style>
                <script>
                    function showAccountScreen() {
                        document.getElementById('account-screen').style.display = 'block';
                        document.getElementById('form-screen').style.display = 'none';
                    }
                    function showFormScreen() {
                        document.getElementById('account-screen').style.display = 'none';
                        document.getElementById('form-screen').style.display = 'block';
                    }
                    function handleManualSignup(e) {
                        e.preventDefault();
                        const email = document.getElementById('manual-email').value;
                        window.opener.postMessage({type: 'social-success', user: {name: email.split('@')[0], email: email}}, '*');
                        window.close();
                    }
                </script>
            </head>
            <body>
                <div class="card">
                    <div id="account-screen">
                        <div class="logo">${provider}</div>
                        <h1>Sign up</h1>
                        <p>to continue to <strong>AI Resume Pro</strong></p>
                        <div class="account-list">
                            <div class="account-item" onclick="window.opener.postMessage({type: 'social-success', user: {name: 'New User', email: 'user@example.com'}}, '*'); window.close();">
                                <div class="avatar" style="background: ${providerColors[provider]}">U</div>
                                <div class="info">
                                    <span class="name">New User</span>
                                    <span class="email">user@example.com</span>
                                </div>
                            </div>
                            <span class="other" onclick="showFormScreen()">Use another account</span>
                        </div>
                        <div class="footer">
                            To continue, ${provider} will share your name, email address, language preference, and profile picture with AI Resume Pro.
                        </div>
                    </div>
                    <div id="form-screen" class="form-screen">
                        <span class="back-btn" onclick="showAccountScreen()">← Back</span>
                        <div class="logo">${provider}</div>
                        <h1>Sign up</h1>
                        <p>Use your ${provider} account</p>
                        <form onsubmit="handleManualSignup(event)">
                            <div class="input-group">
                                <label>Email or phone</label>
                                <input type="email" id="manual-email" required placeholder="Enter your email">
                            </div>
                            <div class="input-group">
                                <label>Password</label>
                                <input type="password" required placeholder="Create a password">
                            </div>
                            <button type="submit" class="btn-submit">Next</button>
                        </form>
                        <div class="footer" style="text-align: center;">
                            Not your computer? Use Guest mode to sign in privately. <br/> <a href="#" style="color: ${providerColors[provider]}; text-decoration: none; font-weight: 600;">Learn more</a>
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `);
    }

    const handleMessage = (event) => {
        if (event.data && event.data.type === 'social-success') {
            localStorage.setItem('token', `mock-${provider.toLowerCase()}-token`);
            localStorage.setItem('user', JSON.stringify({ ...event.data.user, id: `${provider.toLowerCase()}-123` }));
            navigate('/dashboard');
        }
    };

    window.addEventListener('message', handleMessage, { once: true });
  };


  return (
    <div className="signup-main">
      <form className="signup-container" onSubmit={handleSignup}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 className="brand-text" onClick={() => navigate('/')}>CareerForge-Pro</h2>
        </div>
        <h1>Create Account</h1>
        <p className="sub-text">Start building your AI Resume</p>
        {error && <div className="error-box" style={{ background: 'rgba(255, 95, 86, 0.1)', color: '#ff5f56', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.9rem', fontWeight: '600', border: '1px solid rgba(255, 95, 86, 0.2)', textAlign: 'center' }}>{error}</div>}
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
        <div className="signup-input" style={{ position: 'relative' }}>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <span 
            className="eye-icon" 
            onClick={() => setShowPassword(!showPassword)}
            style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#94a3b8' }}
          >
            {showPassword ? "🙈" : "👁️"}
          </span>
        </div>
        <button className="signup-btn" type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Create Account →"}
        </button>
        
        <div className="divider">or continue with</div>
        <div className="social-column">
          <button type="button" className="social-btn google" onClick={() => handleSocialLogin('Google')}>
            <FcGoogle size={22} /> <span>Sign up with Google</span>
          </button>
          <button type="button" className="social-btn github" onClick={() => handleSocialLogin('GitHub')}>
            <FaGithub size={20} /> <span>Sign up with GitHub</span>
          </button>
          <button type="button" className="social-btn apple" onClick={() => handleSocialLogin('Apple')}>
            <FaApple size={20} /> <span>Sign up with Apple</span>
          </button>
        </div>

        <p className="login-link">
          Already have an account? <span onClick={() => navigate("/login")}>Login</span>
        </p>
      </form>
    </div>
  );
}

export default Signup;

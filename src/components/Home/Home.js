import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaMagic, FaRocket, FaShieldAlt, FaArrowRight } from 'react-icons/fa';

import './Home.css';

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="home-container">
            <nav className="home-nav glass">
                <div className="nav-container">
                    <h2 className="brand-text" onClick={() => navigate('/')}>CareerForge-Pro</h2>
                    <div className="nav-links">
                        <button onClick={() => navigate('/templates')}>Templates</button>
                        <button onClick={() => navigate('/ats-checker')}>ATS Audit</button>
                        <button onClick={() => navigate('/login')}>Sign In</button>
                        <button className="cta-premium" onClick={() => navigate('/signup')}>Start for Free</button>
                    </div>
                </div>
            </nav>

            <header className="home-hero">
                <div className="hero-content">
                    <h1 className="hero-title">
                        Elevate Your Career with <br />
                        <span className="gradient-text">Executive-Grade</span> Resumes
                    </h1>
                    <p className="hero-subtitle">
                        Stop getting ignored by recruiters. Our AI-driven platform crafts high-impact, 
                        ATS-optimized resumes that showcase your true professional potential.
                    </p>
                    <div className="hero-actions">
                        <button className="primary-cta" onClick={() => navigate('/signup')}>
                            Build My Resume <FaArrowRight />
                        </button>
                        <button className="secondary-cta" onClick={() => navigate('/templates')}>Explore Templates</button>
                    </div>
                </div>

                <div className="trust-logos">
                    <p>Professionals from these companies use our builder:</p>
                    <div className="logo-grid">
                        <span>Google</span>
                        <span>Microsoft</span>
                        <span>Amazon</span>
                        <span>Meta</span>
                        <span>Netflix</span>
                    </div>
                </div>
            </header>

            <section className="how-it-works">
                <div className="section-header">
                    <h2>Your Path to a Dream Job</h2>
                    <p>Three simple steps to a professional transformation</p>
                </div>
                <div className="steps-grid">
                    <div className="step-card" onClick={() => navigate('/templates')} style={{ cursor: 'pointer' }}>
                        <div className="step-num">01</div>
                        <h3>Select a Template</h3>
                        <p>Choose from our library of 20+ recruiter-verified, industry-specific designs.</p>
                    </div>
                    <div className="step-card" onClick={() => navigate('/signup')} style={{ cursor: 'pointer' }}>
                        <div className="step-num">02</div>
                        <h3>AI Optimization</h3>
                        <p>Let our AI rewrite your experience into high-impact, result-oriented statements.</p>
                    </div>
                    <div className="step-card" onClick={() => navigate('/signup')} style={{ cursor: 'pointer' }}>
                        <div className="step-num">03</div>
                        <h3>Get Hired</h3>
                        <p>Download your ATS-proof resume and land your next interview 3x faster.</p>
                    </div>
                </div>
            </section>

            <section className="features-refined">
                <div className="feature-grid">
                    <div className="feature-item" onClick={() => navigate('/templates')} style={{ cursor: 'pointer' }}>
                        <div className="icon-box"><FaMagic /></div>
                        <h3>AI Content Engine</h3>
                        <p>Generate professional summaries and work bullets that speak the recruiter's language.</p>
                    </div>
                    <div className="feature-item" onClick={() => navigate('/ats-checker')} style={{ cursor: 'pointer' }}>
                        <div className="icon-box"><FaRocket /></div>
                        <h3>ATS Audit System</h3>
                        <p>Our real-time audit ensures your resume is perfectly readable by automated ranking systems.</p>
                    </div>
                    <div className="feature-item" onClick={() => navigate('/signup')} style={{ cursor: 'pointer' }}>
                        <div className="icon-box"><FaShieldAlt /></div>
                        <h3>Privacy First</h3>
                        <p>Your professional data is encrypted and protected with industry-leading security standards.</p>
                    </div>
                </div>
            </section>

            <footer className="home-footer-pro">
                <div className="footer-content">
                   <h3 className="footer-brand">CareerForge-Pro</h3>
                    <p>© 2026 AI Resume Pro. Empowering the next generation of global leaders.</p>
                </div>
            </footer>
        </div>
    );
};

export default Home;

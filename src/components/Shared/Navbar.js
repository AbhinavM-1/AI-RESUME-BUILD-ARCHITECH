import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();

    return (
        <nav className="main-nav glass">
            <div className="nav-logo" onClick={() => navigate('/')}>
                <h2 className="brand-text">CareerForge-Pro</h2>
            </div>

            <div className="nav-links">
                <button onClick={() => navigate('/templates')}>Templates</button>
                <button onClick={() => navigate('/dashboard')}>Dashboard</button>
                <button className="cta-btn" onClick={() => navigate('/editor/new')}>Build Now</button>
            </div>
        </nav>
    );
};

export default Navbar;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FaPlus, FaFileAlt, FaMagic, FaSignOutAlt, FaSearch,
    FaChartLine, FaRegClock, FaEllipsisV, FaShieldAlt
} from 'react-icons/fa';
import './Dashboard.css';
import apiRequest, { resumeService, authService } from '../../services/api';
import Pricing from './Pricing';


const Dashboard = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [resumes, setResumes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [showPricing, setShowPricing] = useState(false);


    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        setUser(storedUser);
        fetchResumes();
    }, []);

    const fetchResumes = async () => {
        try {
            const data = await resumeService.getAll();
            setResumes(data);
        } catch (err) {
            // Fallback: load from localStorage when backend is unavailable
            if (err.message === 'Failed to fetch' || err.message.includes('NetworkError')) {
                const savedResumes = JSON.parse(localStorage.getItem('resumes') || '{}');
                setResumes(Object.values(savedResumes));
            } else {
                console.error('Error fetching resumes:', err);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        authService.logout();
        navigate('/');
    };

    const handleUpgrade = () => {
        setShowPricing(true);
    };


    const handleDuplicate = async (e, resume) => {
        if (!user?.isPro && isTrialExpired()) {
            alert("Your 7-day free trial has expired! Please upgrade to Pro to continue using AI Resume Builder.");
            setShowPricing(true);
            return;
        }
        e.stopPropagation();
        try {
            await resumeService.duplicate(resume);
            fetchResumes();
            alert('Resume duplicated successfully!');
        } catch (err) {
            console.error('Failed to duplicate resume', err);
            alert('Could not duplicate resume.');
        }
    };

    const isTrialExpired = () => {
        if (!user || user.isPro) return false;
        if (!user.createdAt) return false; // Safety check
        const createdDate = new Date(user.createdAt);
        const now = new Date();
        const diffTime = Math.abs(now - createdDate);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        return diffDays >= 7;
    };

    const filteredResumes = (resumes || []).filter(r =>
        (r.title || 'Untitled Resume').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="dashboard-container">
            <aside className="dashboard-sidebar glass">
                <div className="brand">
                    <h2 className="brand-text">CareerForge-Pro</h2>
                </div>
                <nav>
                    <h4>Management</h4>
                    <button className={`nav-resumes ${window.location.pathname === '/dashboard' ? 'active' : ''}`} onClick={() => navigate('/dashboard')}><FaFileAlt /> My Resumes</button>
                    <button className={`nav-templates ${window.location.pathname === '/templates' ? 'active' : ''}`} onClick={() => navigate('/templates')}><FaMagic /> Templates</button>
                    <button className={`nav-ats ${window.location.pathname === '/ats-checker' ? 'active' : ''}`} onClick={() => navigate('/ats-checker')}><FaShieldAlt /> ATS Checker</button>
                    <button className={`nav-analytics ${window.location.pathname === '/analytics' ? 'active' : ''}`} onClick={() => navigate('/analytics')}><FaChartLine /> Analytics</button>
                    <button className={`nav-cover-letter ${window.location.pathname === '/cover-letter' ? 'active' : ''}`} onClick={() => navigate('/cover-letter')}><FaFileAlt /> Cover Letter</button>


                    <h4>Account</h4>
                    <button><FaRegClock /> History</button>
                    <button className="logout-btn" onClick={handleLogout}><FaSignOutAlt /> Sign Out</button>
                </nav>
                <div className="pro-badge glass">
                    {user?.isPro ? (
                        <>
                            <p>Pro Member</p>
                            <span>Enjoy unlimited features</span>
                        </>
                    ) : (
                        <>
                            <p onClick={handleUpgrade} style={{ cursor: 'pointer', color: 'var(--primary)' }}>Upgrade to Pro</p>
                            <span>Get 10x more interviews</span>
                        </>
                    )}
                </div>
            </aside>
            <main className="dashboard-main">
                <header>
                    <div className="search-bar glass">
                        <FaSearch color="#94a3b8" />
                        <input
                            type="text"
                            placeholder="Search your resumes..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="header-actions">
                        {user && <span className="welcome-text">Welcome, <strong>{user.name}</strong> {user.isPro && <span style={{ color: 'gold' }}>★ Pro</span>}</span>}
                        <button className="create-btn" onClick={() => {
                            if (!user?.isPro && isTrialExpired()) {
                                alert("Your 7-day free trial has expired! Upgrade to Pro to unlock unlimited access.");
                                setShowPricing(true);
                                return;
                            }
                            if (!user?.isPro && resumes.length >= 1) {
                                alert("Free plan limit reached! You can only create 1 resume on the free plan. Upgrade to Pro for unlimited resumes.");
                                return;
                            }
                            navigate('/templates');
                        }}><FaPlus /> Create New</button>

                    </div>
                </header>
                <section className="stats-strip">
                    <div className="stat-card">
                        <span>Total Resumes</span>
                        <h3>{resumes.length}</h3>
                    </div>
                    <div className="stat-card">
                        <span>Active Drafts</span>
                        <h3>{resumes.length}</h3>
                    </div>
                    <div className="stat-card">
                        <span>Interview Calls</span>
                        <h3>8</h3>
                    </div>
                </section>
                <div className="resume-grid">
                    <div className="resume-card add-card" onClick={() => {
                        if (!user?.isPro && isTrialExpired()) {
                            alert("Your 7-day free trial has expired! Upgrade to Pro to create more resumes.");
                            setShowPricing(true);
                            return;
                        }
                        if (!user?.isPro && resumes.length >= 1) {
                            alert("Free plan limit reached! Upgrade to Pro to create more resumes.");
                            return;
                        }
                        navigate('/templates');
                    }}>
                        <div className="plus-circle"><FaPlus /></div>
                        <p>Create New Resume</p>
                        <span>{user?.isPro ? 'Select a template' : (isTrialExpired() ? 'Trial Expired' : '1/1 Resumes Used')}</span>
                    </div>

                    {loading ? (
                        <p>Loading resumes...</p>
                    ) : filteredResumes.map(resume => (
                        <div key={resume._id} className="resume-card" onClick={() => navigate(`/editor/${resume._id}`)}>
                            <div className="resume-preview-mini">
                                <div className="mini-paper">
                                    <div className="mini-line title"></div>
                                    <div className="mini-line"></div>
                                    <div className="mini-line"></div>
                                </div>
                                <div className="card-actions" onClick={(e) => handleDuplicate(e, resume)} title="Duplicate Resume">
                                    <FaPlus size={12} />
                                </div>
                            </div>
                            <div className="resume-info">
                                <div className="info-top">
                                    <h3>{resume.title}</h3>
                                    <span className="match-tag">{resume.templateId}</span>
                                </div>
                                <p>Edited {resume.updatedAt ? new Date(resume.updatedAt).toLocaleDateString() : 'Just now'}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
            {showPricing && <Pricing user={user} onClose={() => setShowPricing(false)} />}
        </div>

    );
};

export default Dashboard;

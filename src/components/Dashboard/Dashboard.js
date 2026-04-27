import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    FaPlus, FaFileAlt, FaMagic, FaSignOutAlt, FaSearch, 
    FaChartLine, FaRegClock, FaEllipsisV, FaShieldAlt 
} from 'react-icons/fa';
import './Dashboard.css';
import { resumeService, authService } from '../../services/api';

const Dashboard = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [resumes, setResumes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

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
            console.error('Error fetching resumes:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        authService.logout();
        navigate('/');
    };

    const filteredResumes = resumes.filter(r => 
        r.title.toLowerCase().includes(searchTerm.toLowerCase())
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


                    <h4>Account</h4>
                    <button><FaRegClock /> History</button>
                    <button className="logout-btn" onClick={handleLogout}><FaSignOutAlt /> Sign Out</button>
                </nav>
                <div className="pro-badge glass">
                    <p>Upgrade to Pro</p>
                    <span>Get 10x more interviews</span>
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
                        {user && <span className="welcome-text">Welcome, <strong>{user.name}</strong></span>}
                        <button className="create-btn" onClick={() => navigate('/templates')}><FaPlus /> Create New</button>
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
                    <div className="resume-card add-card" onClick={() => navigate('/templates')}>
                        <div className="plus-circle"><FaPlus /></div>
                        <p>Create New Resume</p>
                        <span>Select a template to start</span>
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
                                <div className="card-actions">
                                    <FaEllipsisV />
                                </div>
                            </div>
                            <div className="resume-info">
                                <div className="info-top">
                                    <h3>{resume.title}</h3>
                                    <span className="match-tag">{resume.templateId}</span>
                                </div>
                                <p>Edited {new Date(resume.updatedAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;

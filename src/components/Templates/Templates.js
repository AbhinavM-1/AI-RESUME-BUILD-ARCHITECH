import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import Navbar from '../Shared/Navbar';
import './Templates.css';

const templates = [
    { id: 'modern', name: 'Modern Professional', description: 'Clean, one-column layout for modern roles.', tag: 'Popular' },
    { id: 'classic', name: 'Executive Classic', description: 'Two-column layout for senior management.', tag: 'Elegant' },
    { id: 'minimal', name: 'Minimalist', description: 'Distraction-free layout focusing on text.', tag: 'Clean' },
    { id: 'creative', name: 'Creative Portfolio', description: 'Bold and unique layout for creative industries.', tag: 'New' },
    { id: 'executive', name: 'Elite Executive', description: 'Gold-standard layout for board-level roles.', tag: 'Elite' },
    { id: 'professional', name: 'Corporate Standard', description: 'The gold standard for corporate applications.', tag: 'Official' },
    { id: 'tech', name: 'Developer Pro', description: 'High-density layout optimized for technical skills.', tag: 'Trending' },
    { id: 'academic', name: 'Academic CV', description: 'Multi-page optimized layout for research and teaching.', tag: 'Detailed' },
    { id: 'sales', name: 'Sales Closer', description: 'Results-oriented layout focusing on targets and KPIs.', tag: 'Impact' },
    { id: 'marketing', name: 'Brand Story', description: 'Visual-first layout for marketing professionals.', tag: 'Visual' },
    { id: 'design', name: 'Designer Showcase', description: 'Grid-based layout for showcasing project portfolios.', tag: 'Portfolio' },
    { id: 'graduate', name: 'New Graduate', description: 'Education-focused layout for entry-level candidates.', tag: 'Starter' },
    { id: 'startup', name: 'Startup Hustle', description: 'Dynamic layout for fast-paced tech startups.', tag: 'Modern' },
    { id: 'legal', name: 'Legal Counsel', description: 'Formal and structured layout for law professionals.', tag: 'Formal' },
    { id: 'medical', name: 'Healthcare Pro', description: 'Clear and organized layout for medical practitioners.', tag: 'Medical' },
    { id: 'retail', name: 'Service Expert', description: 'Friendly and accessible layout for retail roles.', tag: 'Service' },
    { id: 'freelance', name: 'Freelance Flex', description: 'Versatile layout for independent contractors.', tag: 'Flexible' },
    { id: 'manager', name: 'Project Lead', description: 'Action-oriented layout for project management.', tag: 'Leadership' },
    { id: 'consultant', name: 'Strategy Advisor', description: 'Clean and analytical layout for consultants.', tag: 'Analytical' },
    { id: 'engineer', name: 'Structural Lead', description: 'Technical and precise layout for engineering.', tag: 'Technical' },
    { id: 'hr', name: 'People Partner', description: 'Empathetic and clear layout for HR roles.', tag: 'HR' },
    { id: 'finance', name: 'Financial Analyst', description: 'Structured and data-focused layout for finance.', tag: 'Finance' }
];

const Templates = () => {
    const navigate = useNavigate();

    return (
        <div className="templates-page">
            <Navbar />
            <div className="templates-content">
                <header className="templates-header">
                    <h1 className="gradient-text">Choose Your Template</h1>
                    <p>Select a professionally designed template to start building your dream resume.</p>
                </header>

                <div className="templates-grid">
                    {templates.map(t => (
                        <div key={t.id} className="template-card glass">
                            <div className="template-card-preview">
                                <div className={`professional-mockup ${t.id}`}>
                                    <div className="mockup-header-strip"></div>
                                    <div className="mockup-body-strip">
                                        <div className="mockup-sidebar-strip"></div>
                                        <div className="mockup-content-strip">
                                            <div className="m-line l1"></div>
                                            <div className="m-line l2"></div>
                                            <div className="m-line l3"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="preview-overlay">
                                    <button className="primary-btn" onClick={() => navigate('/editor/new', { state: { templateId: t.id } })}>
                                        Use Template <FaArrowRight />
                                    </button>
                                </div>
                            </div>
                            <div className="template-card-info">
                                <div className="info-header">
                                    <h3>{t.name}</h3>
                                    <span className="template-tag">{t.tag}</span>
                                </div>
                                <p>{t.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Templates;

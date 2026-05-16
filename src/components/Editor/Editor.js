import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
    FaChevronLeft,
    FaMagic,
    FaDownload,
    FaUser,
    FaBriefcase,
    FaGraduationCap,
    FaTools,
    FaQuoteLeft,
    FaLayerGroup
} from 'react-icons/fa';
import ResumePreview from '../ResumePreview/ResumePreview';
import AIAssistant from './AIAssistant';
import TemplateSelector from './TemplateSelector';
import apiRequest, { resumeService, API_URL } from '../../services/api';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import './Editor.css';

const Editor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [activeSection, setActiveSection] = useState('personal');
    const [isGenerating, setIsGenerating] = useState(false);
    const [keywords, setKeywords] = useState([]); // Lifted from AIAssistant

    const [resumeData, setResumeData] = useState({
        title: '',
        templateId: location.state?.templateId || 'modern',
        personalInfo: {
            fullName: '',
            jobTitle: '',
            email: '',
            phone: '',
            location: '',
            photo: ''
        },
        summary: '',
        experience: [],
        education: [],
        skills: []
    });

    useEffect(() => {
        if (id && id !== 'new') {
            const fetchResume = async () => {
                try {
                    const data = await resumeService.getById(id);
                    setResumeData(data);
                } catch (err) {
                    console.error('Failed to fetch resume:', err);
                }
            };
            fetchResume();
        }
    }, [id]);

    const handlePersonalInfoChange = (e) => {
        setResumeData({
            ...resumeData,
            personalInfo: {
                ...resumeData.personalInfo,
                [e.target.name]: e.target.value
            }
        });
    };

    const handleTemplateSelect = (tid) => {
        setResumeData({ ...resumeData, templateId: tid });
    };

    const generateAISummary = async () => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (!user.isPro) {
            alert("AI Summary generation is a Pro feature! Please upgrade to unlock the power of AI.");
            return;
        }

        setIsGenerating(true);
        try {
            const data = await apiRequest('/ai/generate-summary', {
                method: 'POST',
                body: JSON.stringify({
                    jobTitle: resumeData.personalInfo?.jobTitle || '',
                    skills: resumeData.skills || [],
                    experience: resumeData.experience || []
                })
            });

            setResumeData({
                ...resumeData,
                summary: data.summary
            });
        } catch (err) {
            // Fallback: generate a mock AI summary locally
            if (err.message === 'Failed to fetch' || err.message.includes('NetworkError')) {
                const title = resumeData.personalInfo.jobTitle || 'professional';
                const skillList = resumeData.skills.length > 0 ? resumeData.skills.join(', ') : 'various technologies';
                const expCount = resumeData.experience.length;
                const mockSummary = `Results-driven ${title} with ${expCount > 0 ? expCount + '+ years of' : 'extensive'} professional experience. Proficient in ${skillList}, with a proven track record of delivering high-quality solutions that drive business growth. Adept at collaborating with cross-functional teams to define, design, and ship innovative products. Passionate about leveraging cutting-edge technologies to solve complex problems and create exceptional user experiences.`;
                setResumeData({
                    ...resumeData,
                    summary: mockSummary
                });
            } else {
                console.error('AI Error:', err);
                alert('Failed to generate AI summary.');
            }
        } finally {
            setIsGenerating(false);
        }
    };

    const handleOptimizeBullets = async (expIndex) => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (!user.isPro) {
            alert("Bullet Optimization is a Pro feature! Please upgrade to unlock the power of AI.");
            return;
        }

        const bullets = resumeData.experience[expIndex].bullets;
        if (!bullets || bullets.length === 0) {
            alert("Add some bullet points first to optimize them!");
            return;
        }

        setIsGenerating(true);
        try {
            const data = await apiRequest('/ai/optimize-bullets', {
                method: 'POST',
                body: JSON.stringify({ 
                    bullets,
                    keywords // Use keywords if available
                })
            });
            const updated = [...resumeData.experience];
            updated[expIndex].bullets = data.optimizedBullets;
            setResumeData({ ...resumeData, experience: updated });
            alert("Bullets optimized for maximum impact!");
        } catch (err) {
            console.error('Optimization Error:', err);
            alert('Failed to optimize bullets.');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSave = async () => {
        try {
            if (id === 'new') {
                const newResume = await resumeService.create(resumeData);
                navigate(`/editor/${newResume._id}`, { replace: true });
            } else {
                await resumeService.update(id, resumeData);
            }
            alert('Resume saved successfully!');
        } catch (err) {
            // Fallback: save to localStorage when backend is unavailable
            if (err.message === 'Failed to fetch' || err.message.includes('NetworkError')) {
                const localId = id === 'new' ? 'local-' + Date.now() : id;
                const savedResumes = JSON.parse(localStorage.getItem('resumes') || '{}');
                savedResumes[localId] = { ...resumeData, _id: localId, updatedAt: new Date().toISOString() };
                localStorage.setItem('resumes', JSON.stringify(savedResumes));
                if (id === 'new') {
                    navigate(`/editor/${localId}`, { replace: true });
                }
                alert('Resume saved locally!');
            } else {
                console.error('Save error:', err);
                alert('Failed to save resume.');
            }
        }
    };

    const handleDownload = async () => {
        const element = document.querySelector('.resume-paper');
        if (!element) return;

        setIsGenerating(true);
        try {
            // First try high-fidelity backend export
            const token = localStorage.getItem('token');
            const htmlContent = `
                <html>
                    <head>
                        <style>
                            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
                            body { font-family: 'Inter', sans-serif; margin: 0; padding: 0; background: white; }
                            ${Array.from(document.styleSheets)
                                .map(styleSheet => {
                                    try {
                                        return Array.from(styleSheet.cssRules)
                                            .map(rule => rule.cssText).join('');
                                    } catch (e) { return ''; }
                                }).join('\n')}
                        </style>
                    </head>
                    <body>
                        <div class="resume-paper" style="width: 100%; height: 100%; border: none; box-shadow: none;">
                            ${element.innerHTML}
                        </div>
                    </body>
                </html>
            `;

            try {
                const response = await fetch(`${API_URL}/pdf/generate`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                    },
                    body: JSON.stringify({ htmlContent })
                });

                if (response.ok) {
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${resumeData.personalInfo.fullName || 'resume'}.pdf`;
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                    window.URL.revokeObjectURL(url);
                    return;
                }
            } catch (backendErr) {
                console.warn('Backend PDF generation failed, falling back to local export:', backendErr);
            }

            // Fallback: Local PDF generation using html2canvas and jspdf
            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff'
            });
            
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`${resumeData.personalInfo.fullName || 'resume'}.pdf`);
            
        } catch (err) {
            console.error('Detailed PDF Error:', err);
            alert(`PDF Export Failed: ${err.message || 'Unknown error'}. Try using a different browser or checking your internet connection.`);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleShare = () => {
        if (!id) {
            alert('Please save your resume first before sharing!');
            return;
        }

        const shareUrl = `${window.location.origin}/view/${id}`;
        navigator.clipboard.writeText(shareUrl);
        alert('Share link copied!');
    };

    return (
        <div className="editor-container">
            <header className="editor-header glass">
                <div className="header-left">
                    <button onClick={() => navigate('/dashboard')}>
                        <FaChevronLeft /> Back
                    </button>

                    <div className="vertical-divider"></div>

                    <h2 className="brand-text" onClick={() => navigate('/')} style={{ fontSize: '1.6rem' }}>CareerForge-Pro</h2>

                    <input
                        type="text"
                        placeholder="Resume Title (e.g. Software Engineer Resume)"
                        value={resumeData.title}
                        onChange={(e) =>
                            setResumeData({ ...resumeData, title: e.target.value })
                        }
                    />
                </div>

                <div className="header-right">
                    <div className="strength-meter">
                        <span className="meter-label">Strength</span>
                        <div className="meter-bar">
                            <div className="meter-fill"></div>
                        </div>
                        <span className="meter-value">75%</span>
                    </div>

                    <div className="topbar-actions">
                        <button className="secondary-cta" onClick={handleSave}>
                            Save Changes
                        </button>

                        <button className="primary-btn" onClick={handleShare}>
                            Share Link
                        </button>

                        <button className="primary-btn" onClick={handleDownload}>
                            <FaDownload /> Export PDF
                        </button>
                    </div>
                </div>
            </header>

            <div className="editor-main">
                <aside className="editor-sidebar glass">
                    <h4>Design</h4>
                    <button
                        className={activeSection === 'templates' ? 'active' : ''}
                        onClick={() => setActiveSection('templates')}
                    >
                        <FaLayerGroup size={14} /> Templates
                    </button>

                    <h4>Content</h4>
                    <button
                        className={activeSection === 'personal' ? 'active' : ''}
                        onClick={() => setActiveSection('personal')}
                    >
                        <FaUser size={14} /> Personal Info
                    </button>

                    <button
                        className={activeSection === 'summary' ? 'active' : ''}
                        onClick={() => setActiveSection('summary')}
                    >
                        <FaQuoteLeft size={14} /> Summary
                    </button>

                    <button
                        className={activeSection === 'experience' ? 'active' : ''}
                        onClick={() => setActiveSection('experience')}
                    >
                        <FaBriefcase size={14} /> Experience
                    </button>

                    <button
                        className={activeSection === 'education' ? 'active' : ''}
                        onClick={() => setActiveSection('education')}
                    >
                        <FaGraduationCap size={14} /> Education
                    </button>

                    <button
                        className={activeSection === 'skills' ? 'active' : ''}
                        onClick={() => setActiveSection('skills')}
                    >
                        <FaTools size={14} /> Skills
                    </button>
                </aside>

                <div className="editor-form-container glass">
                    {activeSection === 'templates' && (
                        <TemplateSelector
                            current={resumeData.templateId}
                            onSelect={handleTemplateSelect}
                        />
                    )}

                    {activeSection === 'personal' && (
                        <section className="form-section">
                            <div className="form-section-header">
                                <h2>Personal Details</h2>
                                <p>Essential information for recruiters to reach you.</p>
                            </div>

                            <div className="input-grid">
                                <div className="input-field">
                                    <label>Full Name</label>
                                    <input name="fullName" value={resumeData.personalInfo.fullName} onChange={handlePersonalInfoChange} />
                                </div>

                                <div className="input-field">
                                    <label>Professional Title</label>
                                    <input name="jobTitle" value={resumeData.personalInfo.jobTitle} onChange={handlePersonalInfoChange} />
                                </div>

                                <div className="input-field">
                                    <label>Email Address</label>
                                    <input name="email" value={resumeData.personalInfo.email} onChange={handlePersonalInfoChange} />
                                </div>

                                <div className="input-field">
                                    <label>Phone Number</label>
                                    <input name="phone" value={resumeData.personalInfo.phone} onChange={handlePersonalInfoChange} />
                                </div>

                                <div className="input-field" style={{ gridColumn: 'span 2' }}>
                                    <label>Profile Photo URL</label>
                                    <input name="photo" value={resumeData.personalInfo.photo} onChange={handlePersonalInfoChange} />
                                </div>

                                <div className="input-field" style={{ gridColumn: 'span 2' }}>
                                    <label>Location</label>
                                    <input name="location" value={resumeData.personalInfo.location} onChange={handlePersonalInfoChange} />
                                </div>
                            </div>
                        </section>
                    )}

                    {activeSection === 'summary' && (
                        <section className="form-section">
                            <div className="form-section-header">
                                <h2>Professional Summary</h2>
                                <p>Highlight your top achievements and skills.</p>
                            </div>

                            <div className="input-field">
                                <div className="label-with-ai">
                                    <label>Career Summary</label>
                                    <button className={`ai-btn ${!JSON.parse(localStorage.getItem('user') || '{}').isPro ? 'pro-locked' : ''}`} onClick={generateAISummary} disabled={isGenerating}>
                                        {isGenerating ? 'Enhancing...' : <><FaMagic /> {JSON.parse(localStorage.getItem('user') || '{}').isPro ? 'AI Rewrite' : 'Unlock AI'}</>}
                                    </button>
                                </div>

                                <textarea
                                    rows="10"
                                    value={resumeData.summary}
                                    onChange={(e) => setResumeData({ ...resumeData, summary: e.target.value })}
                                />
                            </div>
                        </section>
                    )}

                    {activeSection === 'experience' && (
                        <section className="form-section">
                            <div className="form-section-header">
                                <h2>Work Experience</h2>
                                <p>Detail your professional journey.</p>
                                <button
                                    className="add-btn"
                                    onClick={() =>
                                        setResumeData({
                                            ...resumeData,
                                            experience: [
                                                ...resumeData.experience,
                                                {
                                                    id: Date.now(),
                                                    company: '',
                                                    position: '',
                                                    startDate: '',
                                                    endDate: '',
                                                    description: '',
                                                    bullets: []
                                                }
                                            ]
                                        })
                                    }
                                >
                                    + Add Experience
                                </button>
                            </div>

                            {resumeData.experience.map((exp, index) => (
                                <div key={exp.id} className="experience-item">
                                    <div className="input-grid">
                                        <div className="input-field">
                                            <label>Company</label>
                                            <input
                                                value={exp.company}
                                                onChange={(e) => {
                                                    const updated = [...resumeData.experience];
                                                    updated[index].company = e.target.value;
                                                    setResumeData({ ...resumeData, experience: updated });
                                                }}
                                                placeholder="e.g. Google"
                                            />
                                        </div>

                                        <div className="input-field">
                                            <label>Position</label>
                                            <input
                                                value={exp.position}
                                                onChange={(e) => {
                                                    const updated = [...resumeData.experience];
                                                    updated[index].position = e.target.value;
                                                    setResumeData({ ...resumeData, experience: updated });
                                                }}
                                                placeholder="e.g. Senior Software Engineer"
                                            />
                                        </div>

                                        <div className="input-field">
                                            <label>Start Date</label>
                                            <input
                                                type="month"
                                                value={exp.startDate}
                                                onChange={(e) => {
                                                    const updated = [...resumeData.experience];
                                                    updated[index].startDate = e.target.value;
                                                    setResumeData({ ...resumeData, experience: updated });
                                                }}
                                            />
                                        </div>

                                        <div className="input-field">
                                            <label>End Date</label>
                                            <input
                                                type="month"
                                                value={exp.endDate}
                                                onChange={(e) => {
                                                    const updated = [...resumeData.experience];
                                                    updated[index].endDate = e.target.value;
                                                    setResumeData({ ...resumeData, experience: updated });
                                                }}
                                            />
                                        </div>

                                        <div className="input-field" style={{ gridColumn: 'span 2' }}>
                                            <label>Description (Overview)</label>
                                            <textarea
                                                rows="2"
                                                value={exp.description}
                                                onChange={(e) => {
                                                    const updated = [...resumeData.experience];
                                                    updated[index].description = e.target.value;
                                                    setResumeData({ ...resumeData, experience: updated });
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div className="bullets-section">
                                        <div className="label-with-ai">
                                            <label>Key Achievements (Bullets)</label>
                                            <button 
                                                className={`ai-btn ${!JSON.parse(localStorage.getItem('user') || '{}').isPro ? 'pro-locked' : ''}`}
                                                onClick={() => handleOptimizeBullets(index)}
                                            >
                                                <FaMagic /> Optimize with AI
                                            </button>
                                        </div>
                                        {exp.bullets?.map((bullet, bIndex) => (
                                            <div key={bIndex} className="bullet-input">
                                                <input
                                                    value={bullet}
                                                    onChange={(e) => {
                                                        const updated = [...resumeData.experience];
                                                        updated[index].bullets[bIndex] = e.target.value;
                                                        setResumeData({ ...resumeData, experience: updated });
                                                    }}
                                                    placeholder="Add achievement..."
                                                />
                                                <button 
                                                    className="delete-small"
                                                    onClick={() => {
                                                        const updated = [...resumeData.experience];
                                                        updated[index].bullets = updated[index].bullets.filter((_, i) => i !== bIndex);
                                                        setResumeData({ ...resumeData, experience: updated });
                                                    }}
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                        <button 
                                            className="add-bullet-btn"
                                            onClick={() => {
                                                const updated = [...resumeData.experience];
                                                updated[index].bullets = [...(updated[index].bullets || []), ''];
                                                setResumeData({ ...resumeData, experience: updated });
                                            }}
                                        >
                                            + Add Achievement
                                        </button>
                                    </div>

                                    <button
                                        className="delete-btn"
                                        onClick={() =>
                                            setResumeData({
                                                ...resumeData,
                                                experience: resumeData.experience.filter((_, i) => i !== index)
                                            })
                                        }
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </section>
                    )}

                    {activeSection === 'education' && (
                        <section className="form-section">
                            <div className="form-section-header">
                                <h2>Education</h2>
                                <p>Your academic background.</p>
                                <button
                                    className="add-btn"
                                    onClick={() =>
                                        setResumeData({
                                            ...resumeData,
                                            education: [
                                                ...resumeData.education,
                                                { id: Date.now(), school: '', degree: '', year: '' }
                                            ]
                                        })
                                    }
                                >
                                    + Add Education
                                </button>
                            </div>

                            {resumeData.education.map((edu, index) => (
                                <div key={edu.id} className="education-item">
                                    <div className="input-grid">
                                        <div className="input-field" style={{ gridColumn: 'span 2' }}>
                                            <label>School / University</label>
                                            <input
                                                value={edu.school}
                                                onChange={(e) => {
                                                    const updated = [...resumeData.education];
                                                    updated[index].school = e.target.value;
                                                    setResumeData({ ...resumeData, education: updated });
                                                }}
                                            />
                                        </div>

                                        <div className="input-field">
                                            <label>Degree</label>
                                            <input
                                                value={edu.degree}
                                                onChange={(e) => {
                                                    const updated = [...resumeData.education];
                                                    updated[index].degree = e.target.value;
                                                    setResumeData({ ...resumeData, education: updated });
                                                }}
                                            />
                                        </div>

                                        <div className="input-field">
                                            <label>Completion Year</label>
                                            <input
                                                type="month"
                                                value={edu.year}
                                                onChange={(e) => {
                                                    const updated = [...resumeData.education];
                                                    updated[index].year = e.target.value;
                                                    setResumeData({ ...resumeData, education: updated });
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <button
                                        className="delete-btn"
                                        onClick={() =>
                                            setResumeData({
                                                ...resumeData,
                                                education: resumeData.education.filter((_, i) => i !== index)
                                            })
                                        }
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </section>
                    )}

                    {activeSection === 'skills' && (
                        <section className="form-section">
                            <div className="form-section-header">
                                <h2>Skills</h2>
                                <p>Highlight your technical expertise.</p>
                            </div>

                            <div className="skills-input-container">
                                <input
                                    className="skills-main-input"
                                    placeholder="e.g. React, Node.js, Python (Press Enter to add)"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && e.target.value.trim()) {
                                            e.preventDefault();
                                            setResumeData({
                                                ...resumeData,
                                                skills: [...resumeData.skills, e.target.value.trim()]
                                            });
                                            e.target.value = '';
                                        }
                                    }}
                                />

                                <div className="skills-tags">
                                    {resumeData.skills.map((skill, index) => (
                                        <span key={index} className="skill-tag">
                                            {skill}
                                            <button
                                                onClick={() =>
                                                    setResumeData({
                                                        ...resumeData,
                                                        skills: resumeData.skills.filter((_, i) => i !== index)
                                                    })
                                                }
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </section>
                    )}
                </div>

                <div className="editor-preview-panel">
                    <ResumePreview data={resumeData} />
                </div>
                
                <AIAssistant 
                    data={resumeData} 
                    onUpdate={setResumeData} 
                    keywords={keywords} 
                    setKeywords={setKeywords} 
                />
            </div>
        </div>
    );
};

export default Editor;
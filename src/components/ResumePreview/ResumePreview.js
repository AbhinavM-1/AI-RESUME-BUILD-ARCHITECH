import React from 'react';
import './ResumePreview.css';

const ResumePreview = ({ data }) => {
    const templateId = data.templateId || 'modern';

    const getColor = (tid) => {
        const colors = {
            modern: '#6366f1', tech: '#10b981', creative: '#ec4899', startup: '#f97316',
            legal: '#1e293b', medical: '#06b6d4', design: '#8b5cf6', finance: '#0f172a',
            academic: '#334155', sales: '#ef4444', hr: '#a855f7', marketing: '#f43f5e',
            engineer: '#475569', consultant: '#0284c7', freelance: '#10b981'
        };
        return colors[tid] || '#2563eb';
    };

    const primaryColor = getColor(templateId);

    const renderSummary = (titleClass = "section-title") => (
        <section className="resume-section">
            <h2 className={titleClass} style={{ color: primaryColor }}>Summary</h2>
            <p className="summary-text">{data.summary}</p>
        </section>
    );

    const renderExperience = (titleClass = "section-title") => (
        <section className="resume-section">
            <h2 className={titleClass} style={{ color: primaryColor }}>Experience</h2>
            {data.experience.map(exp => (
                <div key={exp.id} className="experience-item">
                    <div className="exp-header">
                        <h3 className="position">{exp.position}</h3>
                        <span className="company">at {exp.company}</span>
                        <span className="date">{exp.startDate} - {exp.endDate}</span>
                    </div>
                    <p className="description">{exp.description}</p>
                    <ul className="bullets">
                        {exp.bullets?.map((b, i) => <li key={i}>{b}</li>)}
                    </ul>
                </div>
            ))}
        </section>
    );

    const renderSkills = (titleClass = "section-title") => (
        <section className="resume-section">
            <h2 className={titleClass} style={{ color: primaryColor }}>Skills</h2>
            <div className="skills-grid">
                {data.skills.map((s, i) => <span key={i} className="skill-item" style={{ borderColor: primaryColor }}>{s}</span>)}
            </div>
        </section>
    );

    const renderEducation = (titleClass = "section-title") => (
        <section className="resume-section">
            <h2 className={titleClass} style={{ color: primaryColor }}>Education</h2>
            {data.education.map(edu => (
                <div key={edu.id} className="edu-item">
                    <p><strong>{edu.school}</strong></p>
                    <p>{edu.degree} · {edu.year}</p>
                </div>
            ))}
        </section>
    );

    const renderPhoto = (shape = "circle") => {
        const photoTemplates = ['modern', 'creative', 'startup', 'tech', 'design', 'medical', 'sales', 'marketing', 'graduate'];
        const showPhoto = photoTemplates.includes(templateId);
        if (showPhoto && data.personalInfo.photo) {
            return (
                <div className={`photo-box ${shape}`}>
                    <img src={data.personalInfo.photo} alt="Profile" />
                </div>
            );
        }
        return null;
    };

    if (['classic', 'tech', 'design', 'academic', 'medical'].includes(templateId)) {
        return (
            <div className={`resume-paper style-sidebar-left`}>
                <aside className="sidebar" style={{ background: `${primaryColor}08`, borderRight: `2px solid ${primaryColor}22` }}>
                    {renderPhoto("square")}
                    <div className="sidebar-contact">
                        <h1 style={{ color: primaryColor }}>{data.personalInfo.fullName}</h1>
                        <p className="job-title">{data.personalInfo.jobTitle}</p>
                        <div className="contact-info">
                            <p>{data.personalInfo.email}</p>
                            <p>{data.personalInfo.phone}</p>
                            <p>{data.personalInfo.location}</p>
                        </div>
                    </div>
                    {renderSkills("sidebar-title")}
                    {renderEducation("sidebar-title")}
                </aside>
                <main className="content">
                    {renderSummary()}
                    {renderExperience()}
                </main>
            </div>
        );
    }

    if (['finance', 'hr', 'engineer', 'legal'].includes(templateId)) {
        return (
            <div className={`resume-paper style-sidebar-right`}>
                <main className="content">
                    <header className="header">
                        <h1 style={{ color: primaryColor }}>{data.personalInfo.fullName}</h1>
                        <p className="job-title">{data.personalInfo.jobTitle}</p>
                    </header>
                    {renderSummary()}
                    {renderExperience()}
                </main>
                <aside className="sidebar" style={{ background: `${primaryColor}05`, borderLeft: `4px solid ${primaryColor}` }}>
                    {renderPhoto("circle")}
                    <div className="contact-info">
                        <p><strong>Email:</strong> {data.personalInfo.email}</p>
                        <p><strong>Phone:</strong> {data.personalInfo.phone}</p>
                        <p><strong>Location:</strong> {data.personalInfo.location}</p>
                    </div>
                    {renderSkills("sidebar-title")}
                    {renderEducation("sidebar-title")}
                </aside>
            </div>
        );
    }

    if (['sales', 'marketing', 'consultant', 'freelance'].includes(templateId)) {
        return (
            <div className={`resume-paper style-grid-boxes`}>
                <header className="header-box" style={{ background: primaryColor }}>
                    {renderPhoto("circle")}
                    <div className="header-text">
                        <h1>{data.personalInfo.fullName}</h1>
                        <p>{data.personalInfo.jobTitle}</p>
                        <div className="contact-row">
                            {data.personalInfo.email} | {data.personalInfo.phone}
                        </div>
                    </div>
                </header>
                <div className="grid-body">
                    <div className="full-width">{renderSummary("box-title")}</div>
                    <div className="main-col">{renderExperience("box-title")}</div>
                    <div className="side-col">
                        <div className="box" style={{ borderColor: primaryColor }}>{renderSkills("box-title")}</div>
                        <div className="box" style={{ borderColor: primaryColor }}>{renderEducation("box-title")}</div>
                    </div>
                </div>
            </div>
        );
    }

    if (['modern', 'creative', 'startup', 'graduate'].includes(templateId)) {
        return (
            <div className={`resume-paper style-modern-centered`}>
                <header className="hero-header" style={{ background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}dd)` }}>
                    {renderPhoto("circle")}
                    <h1>{data.personalInfo.fullName}</h1>
                    <p className="job-title-hero">{data.personalInfo.jobTitle}</p>
                    <div className="contact-pills">
                        <span>{data.personalInfo.email}</span>
                        <span>{data.personalInfo.phone}</span>
                        <span>{data.personalInfo.location}</span>
                    </div>
                </header>
                <div className="centered-body">
                    {renderSummary()}
                    {renderExperience()}
                    <div className="two-col">
                        {renderSkills()}
                        {renderEducation()}
                    </div>
                </div>
            </div>
        );
    }

    if (['professional', 'executive', 'finance', 'legal', 'consultant'].includes(templateId)) {
        return (
            <div className={`resume-paper style-professional-corporate`}>
                <header className="corp-header">
                    <h1>{data.personalInfo.fullName}</h1>
                    <p className="corp-contact">
                        {data.personalInfo.email} • {data.personalInfo.phone} • {data.personalInfo.location}
                    </p>
                    <p className="corp-job-title">{data.personalInfo.jobTitle}</p>
                </header>
                <div className="corp-body">
                    {renderSummary("corp-section-title")}
                    {renderExperience("corp-section-title")}
                    <div className="corp-two-col">
                        {renderSkills("corp-section-title")}
                        {renderEducation("corp-section-title")}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`resume-paper style-standard`}>
            <header className="classic-header" style={{ borderLeft: `8px solid ${primaryColor}` }}>
                <div className="header-left">
                    <h1>{data.personalInfo.fullName}</h1>
                    <p className="job-title">{data.personalInfo.jobTitle}</p>
                    <p className="contact-line">{data.personalInfo.email} · {data.personalInfo.phone} · {data.personalInfo.location}</p>
                </div>
                {renderPhoto("circle")}
            </header>
            <div className="classic-body">
                {renderSummary("classic-title")}
                {renderExperience("classic-title")}
                <div className="classic-footer">
                    {renderSkills("classic-title")}
                    {renderEducation("classic-title")}
                </div>
            </div>
        </div>
    );
};

export default ResumePreview;

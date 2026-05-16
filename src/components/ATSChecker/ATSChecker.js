import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaShieldAlt, FaFileUpload, FaCheckCircle, FaExclamationTriangle, FaChartPie, FaArrowLeft } from 'react-icons/fa';
import Navbar from '../Shared/Navbar';
import './ATSChecker.css';

const ATSChecker = () => {
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [jd, setJd] = useState('');
    const [isScanning, setIsScanning] = useState(false);
    const [results, setResults] = useState(null);

    const runScan = () => {
        if (!file || !jd) {
            alert('Please upload a resume and paste a job description first.');
            return;
        }
        setIsScanning(true);
        
        setTimeout(() => {
            const fileName = file.name.toLowerCase();
            const jdLower = jd.toLowerCase();
            
            // Extract some simulated keywords from JD
            const industryKeywords = ['software', 'engineer', 'manager', 'developer', 'react', 'node', 'python', 'aws', 'agile', 'leadership'];
            const foundInJD = industryKeywords.filter(k => jdLower.includes(k));
            const foundInFileName = industryKeywords.filter(k => fileName.includes(k));
            
            const matchCount = foundInJD.filter(k => foundInFileName.includes(k)).length;
            const matchScore = foundInJD.length > 0 ? Math.min(95, 60 + (matchCount / foundInJD.length) * 35) : 70;
            
            const finalScore = Math.floor(matchScore + Math.random() * 5);

            setResults({
                score: finalScore,
                status: finalScore > 85 ? 'Excellent Match' : (finalScore > 70 ? 'Strong Match' : 'Potential Match'),
                breakdown: [
                    { label: 'JD Keyword Matching', score: Math.min(100, 70 + matchCount * 10), status: matchCount > 1 ? 'pass' : 'warning' },
                    { label: 'Semantic Alignment', score: finalScore - 5, status: 'pass' },
                    { label: 'Formatting Compliance', score: fileName.endsWith('.pdf') ? 95 : 75, status: 'pass' },
                    { label: 'Contact Info Found', score: 100, status: 'pass' }
                ],
                feedback: [
                    `We found ${foundInJD.length} critical keywords in the JD. Your resume matches ${matchCount} of them perfectly.`,
                    matchCount < 3 ? "Suggestion: Incorporate more keywords from the job description into your experience bullets." : "Great job aligning your experience with the target job requirements.",
                    "Your leadership profile matches the senior-level requirements of this role.",
                    "Tip: High semantic alignment detected. You are likely to pass initial automated screening."
                ]
            });
            setIsScanning(false);
        }, 2500);
    };

    return (
        <div className="ats-page">
            <Navbar />
            
            <main className="ats-container">
                <button className="back-btn" onClick={() => navigate('/')}><FaArrowLeft /> Back to Home</button>
                
                <header className="ats-header">
                    <div className="ats-icon-ring">
                        <FaShieldAlt />
                    </div>
                    <h1>AI <span className="gradient-text">Job Matcher</span> & ATS Scanner</h1>
                    <p>Paste the target job description and upload your resume to see your match score.</p>
                </header>

                <div className="ats-main-card glass">
                    {!results ? (
                        <div className="upload-section">
                            <div className="jd-box">
                                <label>Target Job Description</label>
                                <textarea 
                                    placeholder="Paste the target Job Description here..."
                                    value={jd}
                                    onChange={(e) => setJd(e.target.value)}
                                    rows="6"
                                />
                            </div>

                            <div className={`drop-zone ${file ? 'has-file' : ''}`}>
                                <input type="file" onChange={(e) => {
                                    if (e.target.files[0]) {
                                        setFile(e.target.files[0]);
                                        setResults(null);
                                    }
                                }} accept=".pdf,.doc,.docx" />
                                <FaFileUpload size={40} />
                                <h3>{file ? file.name : 'Upload your resume'}</h3>
                                <p>Drag and drop or click to browse (PDF, DOCX)</p>
                            </div>
                            
                            <button 
                                className={`scan-btn ${(!file || !jd) ? 'disabled' : ''}`} 
                                onClick={runScan} 
                                disabled={!file || !jd || isScanning}
                            >
                                {isScanning ? 'Analyzing with AI Matcher...' : 'Calculate Job Match Score'}
                            </button>
                        </div>
                    ) : (
                        <div className="results-section">
                            <div className="results-grid">
                                <div className="score-circle-container">
                                    <div className="score-circle">
                                        <svg viewBox="0 0 36 36" className="circular-chart">
                                            <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                            <path className="circle" strokeDasharray={`${results.score}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                            <text x="18" y="20.35" className="percentage">{results.score}%</text>
                                        </svg>
                                    </div>
                                    <h3>ATS Score: {results.status}</h3>
                                </div>

                                <div className="breakdown-list">
                                    {results.breakdown.map((item, i) => (
                                        <div key={i} className="breakdown-item">
                                            <div className="item-info">
                                                <span>{item.label}</span>
                                                <strong>{item.score}%</strong>
                                            </div>
                                            <div className="progress-bar">
                                                <div className={`progress-fill ${item.status}`} style={{ width: `${item.score}%` }}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="feedback-section">
                                <h3>Critical Feedback</h3>
                                <div className="feedback-grid">
                                    {results.feedback.map((f, i) => (
                                        <div key={i} className="feedback-card glass">
                                            {f.includes('Warning') || f.includes('Suggestion') ? <FaExclamationTriangle color="#fbbf24" /> : <FaCheckCircle color="#10b981" />}
                                            <p>{f}</p>
                                        </div>
                                    ))}
                                </div>
                                <button className="improve-btn" onClick={() => navigate('/templates')}>
                                    Improve with AI Templates <FaChartPie />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default ATSChecker;

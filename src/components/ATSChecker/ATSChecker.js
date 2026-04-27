import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaShieldAlt, FaFileUpload, FaCheckCircle, FaExclamationTriangle, FaChartPie, FaArrowLeft } from 'react-icons/fa';
import Navbar from '../Shared/Navbar';
import './ATSChecker.css';

const ATSChecker = () => {
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [isScanning, setIsScanning] = useState(false);
    const [results, setResults] = useState(null);

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setFile(e.target.files[0]);
            setResults(null);
        }
    };

    const runScan = () => {
        if (!file) return;
        setIsScanning(true);
        
        // Simulate ATS Scan
        setTimeout(() => {
            setResults({
                score: 84,
                status: 'Good',
                breakdown: [
                    { label: 'Keyword Optimization', score: 92, status: 'pass' },
                    { label: 'Formatting & Layout', score: 78, status: 'warning' },
                    { label: 'Impact & Metrics', score: 85, status: 'pass' },
                    { label: 'Contact Information', score: 100, status: 'pass' }
                ],
                feedback: [
                    "Great use of industry keywords throughout the experience section.",
                    "Your 'Summary' is highly impactful and ATS-friendly.",
                    "Warning: Avoid using tables or complex graphics which might confuse older ATS systems.",
                    "Suggestion: Add more quantifiable metrics (e.g., %, $) to your recent roles."
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
                    <h1>AI-Powered <span className="gradient-text">ATS Scanner</span></h1>
                    <p>Check if your resume survives the automated screening systems used by 99% of Fortune 500 companies.</p>
                </header>

                <div className="ats-main-card glass">
                    {!results ? (
                        <div className="upload-section">
                            <div className={`drop-zone ${file ? 'has-file' : ''}`}>
                                <input type="file" onChange={handleFileChange} accept=".pdf,.doc,.docx" />
                                <FaFileUpload size={40} />
                                <h3>{file ? file.name : 'Upload your resume'}</h3>
                                <p>Drag and drop or click to browse (PDF, DOCX)</p>
                            </div>
                            
                            <button 
                                className={`scan-btn ${!file ? 'disabled' : ''}`} 
                                onClick={runScan} 
                                disabled={!file || isScanning}
                            >
                                {isScanning ? 'Analyzing with AI...' : 'Run ATS Audit'}
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

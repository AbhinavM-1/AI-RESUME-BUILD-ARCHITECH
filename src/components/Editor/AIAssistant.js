import React, { useState } from 'react';
import { FaRobot, FaMagic, FaTimes, FaLightbulb } from 'react-icons/fa';
import apiRequest from '../../services/api';
import './AIAssistant.css';

const AIAssistant = ({ data, onUpdate, keywords, setKeywords }) => {

    const [isOpen, setIsOpen] = useState(false);
    const [isOptimizing, setIsOptimizing] = useState(false);
    const [jdText, setJdText] = useState('');

    const suggestions = [
        "Include more technical keywords from the JD Analysis.",
        "Your resume summary should focus on results and impact.",
        "Ensure your contact information is professional."
    ];
    
    const handleAnalyzeJD = async () => {
        if (!jdText) return;
        setIsOptimizing(true);
        try {
            const res = await apiRequest('/ai/analyze-jd', {
                method: 'POST',
                body: JSON.stringify({ jd: jdText })
            });
            setKeywords(res.keywords || []);
        } catch (err) {
            console.error('JD Analysis Error:', err);
            setKeywords(['Python', 'Cloud Architecture', 'Agile', 'Team Leadership']); // Fallback
        } finally {
            setIsOptimizing(false);
        }
    };

    const handleOptimize = async () => {
        setIsOptimizing(true);
        try {
            const summaryRes = await apiRequest('/ai/generate-summary', {
                method: 'POST',
                body: JSON.stringify({
                    jobTitle: data.personalInfo.jobTitle,
                    skills: data.skills,
                    experience: data.experience,
                    keywords: keywords // Use keywords from JD analysis
                })
            });

            onUpdate(prev => ({
                ...prev,
                summary: summaryRes.summary
            }));

            alert('AI has optimized your resume based on the target Job Description!');
        } catch (err) {
            // Fallback
            alert('Failed to optimize. Please try again.');
        } finally {
            setIsOptimizing(false);
        }
    };

    return (
        <div className={`ai-assistant-wrapper ${isOpen ? 'open' : ''}`}>
            <button className="ai-trigger glass" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? <FaTimes /> : <FaRobot />}
                <span className="pulse"></span>
            </button>

            {isOpen && (
                <div className="ai-panel glass">
                    <div className="ai-header">
                        <FaMagic />
                        <span>JD Analysis Agent</span>
                    </div>
                    <div className="ai-content">
                        <div className="jd-input-section">
                            <label>Target Job Description</label>
                            <textarea 
                                placeholder="Paste the job description here to extract keywords..."
                                value={jdText}
                                onChange={(e) => setJdText(e.target.value)}
                                rows="5"
                            />
                            <button className="analyze-btn" onClick={handleAnalyzeJD} disabled={isOptimizing}>
                                {isOptimizing ? 'Analyzing JD...' : 'Extract Key Skills'}
                            </button>
                        </div>

                        {keywords.length > 0 && (
                            <div className="keywords-section">
                                <h4>Extracted Keywords</h4>
                                <div className="keyword-tags">
                                    {keywords.map((k, i) => <span key={i} className="keyword-tag">{k}</span>)}
                                </div>
                            </div>
                        )}
                        
                        <div className="ai-status-divider"></div>

                        <div className="suggestions-list">
                            {suggestions.map((s, i) => (
                                <div key={i} className="suggestion-item">
                                    <FaLightbulb color="#fbbf24" />
                                    <p>{s}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="ai-footer">
                        <button className="auto-btn" onClick={handleOptimize} disabled={isOptimizing || keywords.length === 0}>
                            {isOptimizing ? 'Optimizing...' : 'Sync Resume with JD'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};


export default AIAssistant;

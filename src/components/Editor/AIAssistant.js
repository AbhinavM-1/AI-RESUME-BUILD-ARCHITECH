import React, { useState } from 'react';
import { FaRobot, FaMagic, FaTimes, FaLightbulb } from 'react-icons/fa';
import apiRequest from '../../services/api';
import './AIAssistant.css';

const AIAssistant = ({ data, onUpdate }) => {

    const [isOpen, setIsOpen] = useState(false);
    const [isOptimizing, setIsOptimizing] = useState(false);
    
    const suggestions = [
        "Your summary looks a bit short. Try adding some metrics.",
        "Include more technical keywords like 'Cloud' or 'Architecture'.",
        "Make sure your contact info is up to date."
    ];

    const handleOptimize = async () => {
        setIsOptimizing(true);
        try {
            // Optimize Summary
            const summaryRes = await apiRequest('/ai/generate-summary', {
                method: 'POST',
                body: JSON.stringify({
                    jobTitle: data.personalInfo.jobTitle,
                    skills: data.skills,
                    experience: data.experience
                })
            });

            onUpdate(prev => ({
                ...prev,
                summary: summaryRes.summary
            }));

            alert('AI has optimized your resume summary!');
        } catch (err) {
            console.error('AI Assistant Error:', err);
            alert('Failed to optimize. Please check your API key.');
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
                        <span>AI Writing Assistant</span>
                    </div>
                    <div className="ai-content">
                        <p className="ai-status">Current Status: <strong>{isOptimizing ? 'Analyzing...' : 'Ready'}</strong></p>
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
                        <button className="auto-btn" onClick={handleOptimize} disabled={isOptimizing}>
                            {isOptimizing ? 'Optimizing...' : 'Auto-Optimize All'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};


export default AIAssistant;

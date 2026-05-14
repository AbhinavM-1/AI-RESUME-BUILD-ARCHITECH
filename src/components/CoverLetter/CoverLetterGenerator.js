import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaMagic, FaCopy, FaSave } from 'react-icons/fa';
import apiRequest, { resumeService } from '../../services/api';
import './CoverLetterGenerator.css';

const CoverLetterGenerator = () => {
    const navigate = useNavigate();
    const [resumes, setResumes] = useState([]);
    const [selectedResumeId, setSelectedResumeId] = useState('');
    const [targetJob, setTargetJob] = useState('');
    const [targetCompany, setTargetCompany] = useState('');
    const [generatedLetter, setGeneratedLetter] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchResumes = async () => {
            try {
                const data = await resumeService.getAll();
                setResumes(data);
                if (data.length > 0) setSelectedResumeId(data[0]._id);
            } catch (err) {
                console.error("Failed to fetch resumes", err);
                const savedResumes = JSON.parse(localStorage.getItem('resumes') || '{}');
                const localData = Object.values(savedResumes);
                setResumes(localData);
                if (localData.length > 0) setSelectedResumeId(localData[0]._id);
            }
        };
        fetchResumes();
    }, []);

    const handleGenerate = async () => {
        if (!selectedResumeId || !targetJob || !targetCompany) {
            setError("Please fill in all fields to generate the cover letter.");
            return;
        }

        setError(null);
        setLoading(true);

        try {
            const selectedResume = resumes.find(r => r._id === selectedResumeId);
            const response = await apiRequest('/ai/generate-cover-letter', {
                method: 'POST',
                body: JSON.stringify({
                    jobTitle: targetJob,
                    company: targetCompany,
                    resumeData: selectedResume
                })
            });

            if (response.coverLetter) {
                setGeneratedLetter(response.coverLetter);
            } else {
                throw new Error("Failed to generate cover letter");
            }
        } catch (err) {
            setError(err.message || "An error occurred during generation.");
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generatedLetter);
        alert("Copied to clipboard!");
    };

    return (
        <div className="cover-letter-container">
            <header className="cl-header">
                <button className="back-btn" onClick={() => navigate('/dashboard')}><FaArrowLeft /> Back to Dashboard</button>
                <h2>AI Cover Letter Generator</h2>
            </header>

            <div className="cl-content">
                <div className="cl-form glass">
                    <h3>Letter Details</h3>
                    <div className="form-group">
                        <label>Select Base Resume</label>
                        {resumes.length === 0 ? (
                            <p className="error-msg">You have no saved resumes. Please create a resume first to use the Cover Letter Generator.</p>
                        ) : (
                            <select value={selectedResumeId} onChange={(e) => setSelectedResumeId(e.target.value)}>
                                <option value="" disabled>Select a resume...</option>
                                {resumes.map(r => (
                                    <option key={r._id} value={r._id}>{r.title || 'Untitled Resume'}</option>
                                ))}
                            </select>
                        )}
                    </div>

                    <div className="form-group">
                        <label>Target Job Title</label>
                        <input type="text" placeholder="e.g. Senior Software Engineer" value={targetJob} onChange={(e) => setTargetJob(e.target.value)} />
                    </div>

                    <div className="form-group">
                        <label>Target Company</label>
                        <input type="text" placeholder="e.g. Google" value={targetCompany} onChange={(e) => setTargetCompany(e.target.value)} />
                    </div>

                    {error && <p className="error-msg">{error}</p>}

                    <button className="generate-btn" onClick={handleGenerate} disabled={loading}>
                        {loading ? 'Writing...' : <><FaMagic /> Generate Cover Letter</>}
                    </button>
                </div>

                <div className="cl-preview glass">
                    <div className="preview-header">
                        <h3>Your Cover Letter</h3>
                        {generatedLetter && (
                            <button className="icon-btn" onClick={copyToClipboard} title="Copy to clipboard"><FaCopy /></button>
                        )}
                    </div>
                    <textarea 
                        className="letter-textarea" 
                        value={generatedLetter} 
                        onChange={(e) => setGeneratedLetter(e.target.value)}
                        placeholder="Your AI-generated cover letter will appear here..."
                    />
                </div>
            </div>
        </div>
    );
};

export default CoverLetterGenerator;

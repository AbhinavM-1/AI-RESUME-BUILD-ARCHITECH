import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ResumePreview from '../ResumePreview/ResumePreview';
import apiRequest from '../../services/api';
import './ViewResume.css';

const ViewResume = () => {
    const { id } = useParams();
    const [resumeData, setResumeData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPublicResume = async () => {
            try {
                // Using the new public endpoint
                const response = await fetch(`http://localhost:5000/api/resumes/public/${id}`);
                if (!response.ok) throw new Error('Resume not found or link expired');
                const data = await response.json();
                setResumeData(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPublicResume();
    }, [id]);

    if (loading) return <div className="view-loading">Loading career profile...</div>;
    if (error) return <div className="view-error">{error}</div>;

    return (
        <div className="view-container">
            <header className="view-header">
                <p>Shared Professional Resume</p>
                <button onClick={() => window.print()} className="print-btn">Download PDF</button>
            </header>
            <div className="view-content">
                <ResumePreview data={resumeData} />
            </div>
        </div>
    );
};

export default ViewResume;

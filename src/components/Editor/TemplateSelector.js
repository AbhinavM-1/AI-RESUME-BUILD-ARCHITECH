import React from 'react';
import { FaCheck } from 'react-icons/fa';
import './TemplateSelector.css';

const templates = [
    { id: 'modern', name: 'Modern Professional', description: 'Clean, one-column layout for modern roles.' },
    { id: 'classic', name: 'Executive Classic', description: 'Two-column layout for senior management.' },
    { id: 'minimal', name: 'Minimalist', description: 'Distraction-free layout focusing on text.' },
    { id: 'creative', name: 'Creative Portfolio', description: 'Bold and unique layout for creative industries.' },
    { id: 'executive', name: 'Elite Executive', description: 'Gold-standard layout for board-level roles.' },
    { id: 'professional', name: 'Corporate Standard', description: 'The gold standard for corporate applications.' },
    { id: 'tech', name: 'Developer Pro', description: 'High-density layout optimized for technical skills.' },
    { id: 'academic', name: 'Academic CV', description: 'Multi-page optimized layout for research and teaching.' },
    { id: 'sales', name: 'Sales Closer', description: 'Results-oriented layout focusing on targets and KPIs.' },
    { id: 'marketing', name: 'Brand Story', description: 'Visual-first layout for marketing professionals.' },
    { id: 'design', name: 'Designer Showcase', description: 'Grid-based layout for showcasing project portfolios.' },
    { id: 'graduate', name: 'New Graduate', description: 'Education-focused layout for entry-level candidates.' },
    { id: 'startup', name: 'Startup Hustle', description: 'Dynamic layout for tech startups.' },
    { id: 'legal', name: 'Legal Counsel', description: 'Formal and structured layout for law professionals.' },
    { id: 'medical', name: 'Healthcare Pro', description: 'Clear and organized layout for medical practitioners.' },
    { id: 'retail', name: 'Service Expert', description: 'Friendly and accessible layout for retail roles.' },
    { id: 'freelance', name: 'Freelance Flex', description: 'Versatile layout for independent contractors.' },
    { id: 'manager', name: 'Project Lead', description: 'Action-oriented layout for project management.' },
    { id: 'consultant', name: 'Strategy Advisor', description: 'Clean and analytical layout for consultants.' },
    { id: 'engineer', name: 'Structural Lead', description: 'Technical and precise layout for engineering.' },
    { id: 'hr', name: 'People Partner', description: 'Empathetic and clear layout for HR roles.' },
    { id: 'finance', name: 'Financial Analyst', description: 'Structured and data-focused layout for finance.' }
];


const TemplateSelector = ({ current, onSelect }) => {
    return (
        <div className="template-selector">
            <h3>Choose a Template</h3>
            <div className="template-list">
                {templates.map(t => (
                    <div 
                        key={t.id} 
                        className={`template-option glass ${current === t.id ? 'active' : ''}`}
                        onClick={() => onSelect(t.id)}
                    >
                        <div className={`template-preview-thumb ${t.id}`}></div>
                        <div className="template-info">
                            <h4>{t.name}</h4>
                            <p>{t.description}</p>
                            {current === t.id && <span className="active-badge"><FaCheck /> Selected</span>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TemplateSelector;

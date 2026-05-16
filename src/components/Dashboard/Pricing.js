import React, { useState } from 'react';
import { FaCheck, FaTimes, FaRocket, FaStar, FaGem, FaCreditCard, FaUniversity, FaMobileAlt, FaLock } from 'react-icons/fa';

import apiRequest from '../../services/api';
import './Pricing.css';
import StripeMock from './StripeMock';


const Pricing = ({ onClose, user }) => {
    const [isYearly, setIsYearly] = useState(true);
    const [loading, setLoading] = useState(null);
    const [selectedPlan, setSelectedPlan] = useState(null);

    const handleSelectPlan = (planType) => {
        if (planType === 'free') {

            onClose();
            return;
        }

        const planDetails = {
            name: planType === 'elite' ? 'Elite Lifetime' : `Pro ${isYearly ? 'Yearly' : 'Monthly'}`,
            price: planType === 'elite' ? '5,000' : (isYearly ? '1,000' : '199'),
            period: planType === 'elite' ? 'life' : (isYearly ? 'year' : 'month')
        };

        setSelectedPlan(planDetails);
    };

    const handleSuccess = () => {
        const updatedUser = { ...user, isPro: true };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        window.location.reload();
    };


    return (
        <div className="pricing-overlay" onClick={onClose}>
            <div className="pricing-modal glass" onClick={e => e.stopPropagation()}>
                <button className="close-btn" onClick={onClose}><FaTimes /></button>
                
                <div className="pricing-header">
                    <h2>Choose Your Plan</h2>
                    <p>Unlock the full power of AI to land your dream job faster.</p>
                    
                    <div className="toggle-container">
                        <span className={!isYearly ? 'active' : ''}>Monthly</span>
                        <div className={`toggle-switch ${isYearly ? 'yearly' : ''}`} onClick={() => setIsYearly(!isYearly)}>
                            <div className="toggle-knob"></div>
                        </div>
                        <span className={isYearly ? 'active' : ''}>Yearly <span className="save-tag">Save 56%</span></span>
                    </div>
                </div>

                <div className="pricing-grid">
                    {/* Free Plan */}
                    <div className="pricing-card">
                        <div className="card-icon"><FaRocket /></div>
                        <h3>Starter</h3>
                        <div className="price">₹0<span>/7 days</span></div>


                        <ul className="features">
                            <li><FaCheck className="check" /> 1 Resume Draft</li>
                            <li><FaCheck className="check" /> Basic Templates</li>
                            <li><FaCheck className="check" /> Limited AI Credits</li>
                            <li className="disabled"><FaTimes className="cross" /> ATS Optimization</li>
                            <li className="disabled"><FaTimes className="cross" /> Multi-format Export</li>
                        </ul>
                        <button className="plan-btn" onClick={() => handleSelectPlan('free')}>Current Plan</button>
                    </div>

                    {/* Pro Plan */}
                    <div className={`pricing-card popular ${isYearly ? 'yearly-active' : ''}`}>
                        <div className="popular-badge">Most Popular</div>
                        <div className="card-icon"><FaStar /></div>
                        <h3>Pro {isYearly ? 'Yearly' : 'Monthly'}</h3>
                        <div className="price">
                            {isYearly ? '₹1,000' : '₹199'}
                            <span>/{isYearly ? 'year' : 'month'}</span>
                        </div>
                        {isYearly && <p className="billing-info">Billed annually (₹83.33/mo)</p>}



                        <ul className="features">
                            <li><FaCheck className="check" /> Unlimited Resumes</li>
                            <li><FaCheck className="check" /> All Premium Templates</li>
                            <li><FaCheck className="check" /> Unlimited AI Assistant</li>
                            <li><FaCheck className="check" /> Advanced ATS Scanner</li>
                            <li><FaCheck className="check" /> Priority Support</li>
                        </ul>
                        <button 
                            className="plan-btn primary" 
                            disabled={loading !== null}
                            onClick={() => handleSelectPlan(isYearly ? 'yearly' : 'monthly')}
                        >
                            {loading === (isYearly ? 'yearly' : 'monthly') ? 'Processing...' : 'Get Pro Now'}
                        </button>
                    </div>

                    {/* Elite / Lifetime Plan */}
                    <div className="pricing-card">
                        <div className="card-icon"><FaGem /></div>
                        <h3>Elite</h3>
                        <div className="price">₹5,000<span>/lifetime</span></div>



                        <ul className="features">
                            <li><FaCheck className="check" /> Everything in Pro</li>
                            <li><FaCheck className="check" /> Cover Letter Generator</li>
                            <li><FaCheck className="check" /> Interview Prep Bot</li>
                            <li><FaCheck className="check" /> Personal Branding Kit</li>
                            <li><FaCheck className="check" /> Lifetime Updates</li>
                        </ul>
                        <button className="plan-btn" onClick={() => handleSelectPlan('elite')}>Go Elite</button>
                    </div>
                </div>
                
                <div className="payment-methods">
                    <div className="method-item"><FaCreditCard /> <span>Cards</span></div>
                    <div className="method-item"><FaMobileAlt /> <span>UPI</span></div>
                    <div className="method-item"><FaUniversity /> <span>Netbanking</span></div>
                    <div className="method-item secure"><FaLock /> <span>Secure SSL</span></div>
                </div>
                
                <p className="pricing-footer">Powered by Stripe. All major Indian payment methods supported.</p>
            </div>
            {selectedPlan && (
                <StripeMock 
                    plan={selectedPlan} 
                    onCancel={() => setSelectedPlan(null)} 
                    onSuccess={handleSuccess} 
                />
            )}
        </div>

    );
};

export default Pricing;

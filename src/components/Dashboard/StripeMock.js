import React, { useState, useEffect } from 'react';
import { 
    FaCreditCard, FaLock, FaArrowLeft, FaCheckCircle, 
    FaUniversity, FaMobileAlt, FaShieldAlt 
} from 'react-icons/fa';
import './StripeMock.css';

const StripeMock = ({ plan, onCancel, onSuccess }) => {
    const [method, setMethod] = useState('card');
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handlePay = (e) => {
        e.preventDefault();
        setIsProcessing(true);
        
        // Simulate real payment processing time
        setTimeout(() => {
            setIsProcessing(false);
            setIsSuccess(true);
            
            // Wait on success screen before returning
            setTimeout(() => {
                onSuccess();
            }, 2000);
        }, 2500);
    };

    if (isSuccess) {
        return (
            <div className="stripe-success-screen">
                <div className="success-content">
                    <FaCheckCircle className="success-icon" />
                    <h2>Payment Successful</h2>
                    <p>Redirecting you back to CareerForge-Pro...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="stripe-mock-overlay">
            <div className="stripe-mock-container">
                <header className="stripe-mock-header">
                    <button className="back-btn" onClick={onCancel}><FaArrowLeft /> Back to CareerForge</button>
                    <div className="stripe-logo-container">
                        <span className="stripe-logo">stripe</span>
                        <span className="badge">Test Mode</span>
                    </div>
                </header>

                <div className="stripe-mock-body">
                    <aside className="order-summary">
                        <div className="product-info">
                            <span className="app-name">CareerForge-Pro</span>
                            <h1>{plan.name}</h1>
                            <div className="price-display">
                                <span className="currency">₹</span>
                                <span className="amount">{plan.price}</span>
                                <span className="period">/{plan.period}</span>
                            </div>
                        </div>
                        <div className="trust-footer">
                            <p><FaLock /> Powered by Stripe</p>
                            <p><FaShieldAlt /> Secure payments</p>
                        </div>
                    </aside>

                    <main className="payment-form-section">
                        <form onSubmit={handlePay}>
                            <h3>Pay with</h3>
                            <div className="method-selector">
                                <button type="button" className={method === 'card' ? 'active' : ''} onClick={() => setMethod('card')}>
                                    <FaCreditCard /> Card
                                </button>
                                <button type="button" className={method === 'upi' ? 'active' : ''} onClick={() => setMethod('upi')}>
                                    <FaMobileAlt /> UPI
                                </button>
                                <button type="button" className={method === 'netbanking' ? 'active' : ''} onClick={() => setMethod('netbanking')}>
                                    <FaUniversity /> Netbanking
                                </button>
                            </div>

                            <div className="form-fields">
                                {method === 'card' && (
                                    <>
                                        <div className="input-group">
                                            <label>Email</label>
                                            <input type="email" placeholder="test@example.com" defaultValue="abhinavkumar21at@gmail.com" required />
                                        </div>
                                        <div className="input-group">
                                            <label>Card information</label>
                                            <div className="card-input-wrapper">
                                                <input type="text" placeholder="1234 5678 1234 5678" maxLength="19" required />
                                                <div className="sub-fields">
                                                    <input type="text" placeholder="MM / YY" maxLength="5" required />
                                                    <input type="text" placeholder="CVC" maxLength="3" required />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="input-group">
                                            <label>Name on card</label>
                                            <input type="text" placeholder="Abhinav Mandal" required />
                                        </div>
                                    </>
                                )}

                                {method === 'upi' && (
                                    <div className="input-group">
                                        <label>UPI ID</label>
                                        <input type="text" placeholder="username@okaxis" required />
                                        <p className="helper-text">A payment request will be sent to your UPI app.</p>
                                    </div>
                                )}

                                {method === 'netbanking' && (
                                    <div className="input-group">
                                        <label>Select your bank</label>
                                        <select required>
                                            <option value="">Choose a bank...</option>
                                            <option value="hdfc">HDFC Bank</option>
                                            <option value="icici">ICICI Bank</option>
                                            <option value="sbi">State Bank of India</option>
                                            <option value="axis">Axis Bank</option>
                                        </select>
                                    </div>
                                )}
                            </div>

                            <button type="submit" className={`pay-btn ${isProcessing ? 'loading' : ''}`} disabled={isProcessing}>
                                {isProcessing ? (
                                    <div className="spinner"></div>
                                ) : (
                                    `Pay ₹${plan.price}`
                                )}
                            </button>

                            <p className="terms-text">
                                By confirming your payment, you allow CareerForge-Pro to charge your {method} for this {plan.period}ly subscription.
                            </p>
                        </form>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default StripeMock;

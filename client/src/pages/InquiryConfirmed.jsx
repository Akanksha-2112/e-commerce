import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaFileDownload, FaArrowRight } from 'react-icons/fa';
import '../styles/InquiryConfirmed.css';

const InquiryConfirmed = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Get user name from location state or default to generic
    // Only use the first name for the polite address
    const fullName = location.state?.name || "Guest";
    const lastName = fullName.split(' ').pop();
    const honorificName = `Mr. ${lastName}`; // Assuming Mr. based on user prompt, ideally would be dynamic

    useEffect(() => {
        // Haptic feedback on mount
        if (navigator.vibrate) {
            navigator.vibrate([50, 30, 50]); // "Transmission Complete" pattern
        }

        // Optional: Play sound effect here
    }, []);

    const handleEnterArchive = () => {
        if (navigator.vibrate) navigator.vibrate(40);
        navigate('/profile');
    };

    return (
        <div className="inquiry-confirmed-container">
            {/* Background elements if needed */}

            <div className="success-content">
                {/* Hero 3D Logo */}
                <div className="hero-logo-container">
                    <img
                        src={require('../assets/images/logo.png')}
                        alt="AWIK SPECTRUM"
                        className="hero-logo-img"
                    />
                </div>

                {/* Header */}
                <div className="transmission-header">
                    TRANSMISSION COMPLETE
                </div>

                {/* Acknowledgment */}
                <p className="acknowledgment-text">
                    {honorificName}, your credentials have been received and encrypted within our Mumbai studio.
                </p>

                {/* Next Steps */}
                <p className="liaison-text">
                    A Private Liaison has been assigned to your profile. Expect a formal introduction via your preferred channel to discuss your artisanal requirements.
                    <br /><br />
                    While our team reviews your inquiry, you may explore the Sovereign Archive in limited-view mode.
                </p>

                {/* Actions */}
                <div className="action-container">
                    <button onClick={handleEnterArchive} className="archive-link-btn" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                        <span className="archive-link">ENTER ARCHIVE <FaArrowRight style={{ marginLeft: '8px', fontSize: '0.8em' }} /></span>
                    </button>

                    <button className="receipt-btn">
                        <FaFileDownload style={{ marginRight: '8px' }} /> Download Security Receipt
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InquiryConfirmed;

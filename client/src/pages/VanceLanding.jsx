import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/VanceLanding.css';
import woolImg from '../assets/vance_wool.png';
import modelImg from '../assets/vance_model.png';

const VanceLanding = () => {
    const navigate = useNavigate();

    const handleDiscover = () => {
        navigate('/sarees');
    };

    return (
        <div className="vance-container">
            <div className="vance-split vance-left">
                <img src={woolImg} alt="Woven Wool Texture" className="vance-img" />
                <div className="vance-overlay"></div>
            </div>

            <div className="vance-split vance-right">
                <img src={modelImg} alt="Dignified Model" className="vance-img" />
                <div className="vance-overlay"></div>
            </div>

            <div className="vance-content-wrapper">
                <h1 className="vance-brand">VANCE & CO.</h1>
                <p className="vance-tagline">"For the few who know the difference."</p>
                <button className="vance-btn" onClick={handleDiscover}>Discover</button>
            </div>
        </div>
    );
};

export default VanceLanding;

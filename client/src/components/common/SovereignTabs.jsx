import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../../styles/BoutiqueLanding.css'; // Inheriting styles

const SovereignTabs = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Check if we are in the Vault (Profile) or Boutique (Landing)
    const isVault = location.pathname.includes('/profile');

    const handleNavigation = (tab) => {
        if (tab === 'vault') {
            navigate('/profile');
        } else {
            // "Collection", "Men", "Women" all lead to Boutique for now
            navigate('/');
        }
    };

    return (
        <div className="sovereign-tabs-container">
            <nav className="sovereign-tabs">
                <button
                    className={`sovereign-tab ${!isVault ? 'active' : ''}`}
                    onClick={() => handleNavigation('collection')}
                >
                    The Collection
                </button>
                <button
                    className="sovereign-tab"
                    onClick={() => handleNavigation('men')}
                    title="Filter: Men (Coming Soon)"
                >
                    Men
                </button>
                <button
                    className="sovereign-tab"
                    onClick={() => handleNavigation('women')}
                    title="Filter: Women (Coming Soon)"
                >
                    Women
                </button>
                <button
                    className={`sovereign-tab ${isVault ? 'active' : ''}`}
                    onClick={() => handleNavigation('vault')}
                >
                    The Vault
                </button>
            </nav>
        </div>
    );
};

export default SovereignTabs;

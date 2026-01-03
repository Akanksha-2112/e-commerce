import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiHexagon } from 'react-icons/fi'; // Represents Origin/Blockchain
import '../../styles/PrivateArchive.css';

const ArchiveCard = ({ product, span }) => {
    const navigate = useNavigate();

    // Determine grid span class
    const spanClass = span === 'wide' ? 'wide' : span === 'tall' ? 'tall' : '';

    return (
        <div className={`archive-cell ${spanClass}`} onClick={() => navigate(`/product/${product.id}`)}>
            <div className="archive-card">
                {/* Curtain Reveal Overlay */}
                <div className="curtain-reveal">
                    <div className="curtain-line"></div>
                </div>

                {/* Provenance Icon */}
                <div className="origin-ledger-icon" title="View Provenance Ledger">
                    <FiHexagon />
                </div>

                {/* Image Area */}
                <div className="card-image-wrapper">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="card-image"
                        loading="lazy"
                    />
                </div>

                {/* Info Panel (Hover Reveal) */}
                <div className="card-info-panel">
                    <span className="artisanal-origin">
                        {product.origin || "Hand-Loomed in Banaras"}
                    </span>
                    <h3 className="product-name">{product.name}</h3>
                    <div className="price-tag">
                        ₹ {product.price.toLocaleString('en-IN')}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArchiveCard;

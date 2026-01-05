import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import sareeImg from '../assets/products/saree1.jpg'; // Mock image
import '../styles/ProductCommand.css';

const ProductCommandPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Mock Data - In real app, fetch based on 'id'
    const product = {
        name: 'Crimson Gold Katan',
        price: 450000,
        description: "A testament to the weavers of Banaras, this piece takes 340 hours of meticulous hand-looming. The crimson silk is interlocked with real gold Zari, creating a fabric that feels like liquid armor.",
        origin: 'Varanasi, India',
        weaverCode: 'WV-9021',
        manHours: '340 Hours',
        material: 'Pure Katan Silk & Gold Zari',
        image: sareeImg
    };

    return (
        <div className="product-command-container">

            {/* Visual Panel (Left) */}
            <div className="command-visual-panel">
                <img src={product.image} alt={product.name} className="command-hero-image" />

                {/* Back Button Overlay */}
                <button
                    onClick={() => navigate(-1)}
                    style={{
                        position: 'absolute',
                        top: '2rem',
                        left: '2rem',
                        background: 'none',
                        border: 'none',
                        color: 'white',
                        fontSize: '1.5rem',
                        cursor: 'pointer',
                        zIndex: 10
                    }}
                >
                    <FaArrowLeft />
                </button>
            </div>

            {/* Data Panel (Right) */}
            <div className="command-data-panel">
                <div className="command-breadcrumbs">
                    Archive / Sarees / {id}
                </div>

                <h1 className="command-title">{product.name}</h1>
                <span className="command-price">INR {product.price.toLocaleString('en-IN')}</span>

                <p className="command-story">
                    "{product.description}"
                </p>

                {/* Provenance Ledger */}
                <div className="provenance-ledger">
                    <div className="ledger-item">
                        <span className="ledger-label">Origin</span>
                        <span className="ledger-value">{product.origin}</span>
                    </div>
                    <div className="ledger-item">
                        <span className="ledger-label">Artisan Code</span>
                        <span className="ledger-value">{product.weaverCode}</span>
                    </div>
                    <div className="ledger-item">
                        <span className="ledger-label">Construction Time</span>
                        <span className="ledger-value">{product.manHours}</span>
                    </div>
                    <div className="ledger-item">
                        <span className="ledger-label">Material Composition</span>
                        <span className="ledger-value">{product.material}</span>
                    </div>
                </div>

                {/* Action */}
                <div className="command-actions">
                    <button className="reserve-btn">
                        Reserve for Liaison
                    </button>
                    <span className="reserve-hint">
                        Initiates Secure Protocol via Concierge
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ProductCommandPage;

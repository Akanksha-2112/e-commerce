import React, { useRef, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGlobal } from '../../context/GlobalContext';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import SovereignTabs from '../common/SovereignTabs';
import './LandingPage.css';
import '../../styles/BoutiqueLanding.css';

const LandingPage = () => {
    const navigate = useNavigate();
    const { toggleSidebar, addToCart } = useGlobal();
    const { user } = useContext(AuthContext);

    // --- Guest State Logic ---
    const [showIntro, setShowIntro] = useState(false);

    useEffect(() => {
        if (!user) {
            const hasSeenIntro = sessionStorage.getItem('hasSeenIntro');
            if (!hasSeenIntro) {
                setShowIntro(true);
                sessionStorage.setItem('hasSeenIntro', 'true');
            }
        }
    }, [user]);

    // --- Member State Logic ---
    const [products, setProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [firstName, setFirstName] = useState('');

    useEffect(() => {
        if (user) {
            const name = user.firstName || user.name?.split(' ')[0] || 'Member';
            setFirstName(name);
            fetchMemberCollection();
        }
    }, [user]);

    const fetchMemberCollection = async () => {
        setLoadingProducts(true);
        try {
            const url = 'http://localhost:5000/api/products';
            const response = await axios.get(url);
            if (response.data && response.data.products) {
                setProducts(response.data.products.slice(0, 9));
            }
        } catch (error) {
            console.error("Error fetching boutique collection", error);
        }
        setLoadingProducts(false);
    };

    const handleAddToBag = (e, product) => {
        e.stopPropagation();
        addToCart({
            id: product._id,
            name: product.name,
            price: product.price,
            image: product.images?.[0]?.url,
            size: product.sizes?.[0] || 'M',
            color: product.colors?.[0] || 'Standard'
        });
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(price);
    };

    // 1. MEMBER VIEW (Boutique)
    if (user) {
        return (
            <div className="boutique-container">
                <header className="vertical-header">
                    <img
                        src={require('../../assets/images/logo.png')}
                        alt="Logo"
                        className="header-logo"
                        onClick={() => navigate('/')}
                    />

                    <button className="menu-trigger" onClick={() => toggleSidebar(true)}>
                        <span className="menu-line"></span>
                        <span className="menu-line"></span>
                        <span className="menu-line"></span>
                    </button>
                </header>

                <SovereignTabs />

                <div className="greeting-container">
                    <span style={{ cursor: 'default' }}>
                        Hello, {firstName}
                    </span>
                </div>

                <div className="boutique-header">
                    <div className="boutique-pre-title">The Private Collection</div>
                    <div className="boutique-divider"></div>
                    <h1 className="boutique-headline">
                        Welcome to the Maison, {firstName}.<br />
                        Explore your curated selection.
                    </h1>
                </div>

                <div className="boutique-content">
                    {loadingProducts ? (
                        <div style={{ textAlign: 'center', marginTop: '4rem', color: '#999' }}>
                            Retrieving sovereign archives...
                        </div>
                    ) : (
                        <div className="collection-grid">
                            {products.length === 0 ? (
                                <p style={{ textAlign: 'center', width: '100%', gridColumn: '1/-1' }}>
                                    Your curator is currently updating the collection. Please check back shortly.
                                </p>
                            ) : (
                                products.map((product) => (
                                    <div
                                        key={product._id}
                                        className="collection-card"
                                        onClick={() => navigate(`/product/${product._id}`)}
                                    >
                                        <div className="card-image-box">
                                            <img
                                                src={product.images?.[0]?.url}
                                                alt={product.name}
                                                className="card-img"
                                            />
                                        </div>
                                        <div className="card-info">
                                            <div className="card-brand">AWIK MAISON</div>
                                            <div className="card-name">{product.name}</div>
                                            <div className="card-price">{formatPrice(product.price)}</div>
                                            <button
                                                className="add-to-bag-btn"
                                                onClick={(e) => handleAddToBag(e, product)}
                                            >
                                                Add to Bag
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // 2. GUEST VIEW (Monolith / Existing)
    return (
        <div className="monolith-container">
            {showIntro && (
                <div className="intro-overlay">
                    <div className="intro-content">
                        <img src={require('../../assets/images/logo.png')} alt="AWIK SPECTRUM" className="intro-logo-img" />
                        <div className="intro-tagline" style={{ color: '#D4AF37' }}>Authentic Luxury Sarees</div>
                    </div>
                </div>
            )}

            <div className="monolith-background"></div>

            <header className="vertical-header">
                <img
                    src={require('../../assets/images/logo.png')}
                    alt="Logo"
                    className="header-logo"
                    onClick={() => navigate('/')}
                />

                <button className="menu-trigger" onClick={() => toggleSidebar(true)}>
                    <span className="menu-line"></span>
                    <span className="menu-line"></span>
                    <span className="menu-line"></span>
                </button>
            </header>

            <div className="greeting-container">
                <span onClick={() => navigate('/login')} style={{ cursor: 'pointer' }}>
                    Sign In
                </span>
            </div>

            <div className="monolith-content">
                <div className="obsidian-glass-panel">
                    <div className="monolith-technical-header">EST. 2026 • INDIA</div>

                    <h1 className="monolith-headline">
                        The Sovereign<br />Collection
                    </h1>

                    <MagneticButton onClick={() => navigate('/register')} />
                </div>
            </div>
        </div>
    );
};

const MagneticButton = ({ onClick }) => {
    const btnRef = useRef(null);

    const handleMouseMove = (e) => {
        const btn = btnRef.current;
        if (!btn) return;
        const rect = btn.getBoundingClientRect();
        const btnX = rect.left + rect.width / 2;
        const btnY = rect.top + rect.height / 2;
        const distX = e.clientX - btnX;
        const distY = e.clientY - btnY;
        const pullStrength = 0.4;
        btn.style.transform = `translate(${distX * pullStrength}px, ${distY * pullStrength}px)`;
    };

    const handleMouseLeave = () => {
        const btn = btnRef.current;
        if (btn) btn.style.transform = `translate(0px, 0px)`;
    };

    return (
        <button
            ref={btnRef}
            className="monolith-cta magnetic-btn"
            onClick={() => {
                if (navigator.vibrate) navigator.vibrate(60);
                onClick();
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            Request Invitation
        </button>
    );
};

export default LandingPage;

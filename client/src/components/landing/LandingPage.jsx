import React, { useState, useEffect, useContext } from 'react';
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

    const [products, setProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [scrolled, setScrolled] = useState(false);

    const categories = ['All', 'Women', 'Men', 'Kids'];

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 60);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (user) {
            const name = user.firstName || user.name?.split(' ')[0] || 'Member';
            setFirstName(name);
        }
        fetchCollection();
    }, [user]);

    const fetchCollection = async () => {
        setLoadingProducts(true);
        try {
            const url = `${process.env.REACT_APP_API_URL || 'https://e-commerce-2e5z.onrender.com/api'}/products`;
            const response = await axios.get(url);
            if (response.data && response.data.products) {
                setProducts(response.data.products.slice(0, 9));
            } else if (Array.isArray(response.data)) {
                setProducts(response.data.slice(0, 9));
            }
        } catch (error) {
            console.error("Error fetching collection", error);
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

    const formatPrice = (price) => new Intl.NumberFormat('en-IN', {
        style: 'currency', currency: 'INR', maximumFractionDigits: 0
    }).format(price);

    const fallbackImages = [
        'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80',
        'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600&q=80',
        'https://images.unsplash.com/photo-1614179689702-355944cd0918?w=600&q=80',
        'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=600&q=80',
        'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=600&q=80',
        'https://images.unsplash.com/photo-1603400521630-9f2de124b33b?w=600&q=80',
    ];

    const getProductImage = (product, index) => {
        const img = product.images?.[0]?.url;
        if (img && !img.includes('placeholder')) return img;
        return fallbackImages[index % fallbackImages.length];
    };

    // --- GUEST VIEW ---
    if (!user) {
        return (
            <div className="luxury-landing">
                {/* Full-screen Hero */}
                <section className="hero-full">
                    <div className="hero-bg-overlay" />
                    <img src="/hero-bg.png" alt="" className="hero-bg-img"
                        onError={(e) => { e.target.style.display = 'none'; }} />

                    <nav className={`luxury-nav ${scrolled ? 'luxury-nav--scrolled' : ''}`}>
                        <button className="luxury-nav__menu" onClick={() => toggleSidebar(true)}>
                            <span /><span /><span />
                        </button>
                        <div className="luxury-nav__logo">
                            <img src={require('../../assets/images/logo.png')} alt="AWIK SPECTRUM" />
                        </div>
                        <button className="luxury-nav__signin" onClick={() => navigate('/login')}>
                            Sign In
                        </button>
                    </nav>

                    <div className="hero-content">
                        <p className="hero-eyebrow">Est. 2026 &nbsp;·&nbsp; India</p>
                        <h1 className="hero-title">
                            The Sovereign<br />
                            <em>Collection</em>
                        </h1>
                        <p className="hero-subtitle">
                            Couture rooted in tradition, crafted for the extraordinary.
                        </p>
                        <div className="hero-actions">
                            <button className="btn-primary" onClick={() => navigate('/register')}>
                                Enter the Maison
                            </button>
                            <button className="btn-ghost" onClick={() => navigate('/women')}>
                                Explore Collections
                            </button>
                        </div>
                    </div>

                    <div className="hero-scroll-indicator">
                        <div className="scroll-line" />
                        <span>Scroll</span>
                    </div>
                </section>

                {/* Category Showcase */}
                <section className="category-showcase">
                    <div className="section-header">
                        <p className="section-eyebrow">Shop by Category</p>
                        <h2 className="section-title">Every Story, Every Style</h2>
                    </div>
                    <div className="category-grid">
                        {[
                            { name: 'Women', img: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80', link: '/women' },
                            { name: 'Men',   img: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&q=80', link: '/men' },
                            { name: 'Kids',  img: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=800&q=80', link: '/kids' },
                        ].map(cat => (
                            <div key={cat.name} className="category-card" onClick={() => navigate(cat.link)}>
                                <img src={cat.img} alt={cat.name} className="category-card__img" />
                                <div className="category-card__overlay">
                                    <h3 className="category-card__name">{cat.name}</h3>
                                    <span className="category-card__cta">Shop Now →</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Brand Story */}
                <section className="brand-story">
                    <div className="brand-story__text">
                        <p className="section-eyebrow">Our Philosophy</p>
                        <h2 className="section-title">Where Heritage<br />Meets Haute Couture</h2>
                        <p className="brand-story__body">
                            AWIK SPECTRUM was born from a singular vision — to celebrate India's rich textile legacy with a modern, global eye. Each piece is a conversation between centuries-old craft and contemporary design.
                        </p>
                        <button className="btn-outline" onClick={() => navigate('/maison')}>
                            Discover Our Story
                        </button>
                    </div>
                    <div className="brand-story__visual">
                        <img src="https://images.unsplash.com/photo-1614179689702-355944cd0918?w=700&q=80" alt="Craftsmanship" />
                    </div>
                </section>

                {/* CTA Banner */}
                <section className="cta-banner">
                    <div className="cta-banner__inner">
                        <h2>Become a Member of the Maison</h2>
                        <p>Unlock exclusive access to our private collection, early drops, and curated events.</p>
                        <button className="btn-gold" onClick={() => navigate('/register')}>
                            Request Invitation
                        </button>
                    </div>
                </section>
            </div>
        );
    }

    // --- MEMBER VIEW ---
    return (
        <div className="member-landing">
            <nav className={`luxury-nav luxury-nav--light ${scrolled ? 'luxury-nav--scrolled-light' : ''}`}>
                <button className="luxury-nav__menu luxury-nav__menu--dark" onClick={() => toggleSidebar(true)}>
                    <span /><span /><span />
                </button>
                <div className="luxury-nav__logo">
                    <img src={require('../../assets/images/logo.png')} alt="AWIK SPECTRUM" style={{ filter: 'brightness(0)' }} />
                </div>
                <button className="luxury-nav__signin luxury-nav__signin--dark" onClick={() => navigate('/profile')}>
                    Hello, {firstName}
                </button>
            </nav>

            <SovereignTabs />

            {/* Member Hero */}
            <section className="member-hero">
                <div className="member-hero__content">
                    <p className="section-eyebrow" style={{ color: '#C9A84C' }}>The Private Collection</p>
                    <h1 className="member-hero__title">
                        Welcome back,<br /><em>{firstName}.</em>
                    </h1>
                    <p className="member-hero__subtitle">Your curated selection awaits.</p>
                </div>
            </section>

            {/* Category Filter */}
            <div className="member-filters">
                {categories.map(cat => (
                    <button
                        key={cat}
                        className={`filter-pill ${activeCategory === cat ? 'filter-pill--active' : ''}`}
                        onClick={() => setActiveCategory(cat)}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Product Grid */}
            <section className="member-collection">
                {loadingProducts ? (
                    <div className="loading-state">
                        <div className="loading-spinner" />
                        <p>Curating your collection...</p>
                    </div>
                ) : products.length === 0 ? (
                    <div className="empty-state">
                        <p>Your curator is updating the collection. Check back shortly.</p>
                        <button className="btn-outline" onClick={fetchCollection}>Refresh</button>
                    </div>
                ) : (
                    <div className="product-grid-luxury">
                        {products.map((product, index) => (
                            <div
                                key={product._id}
                                className="product-card-luxury"
                                onClick={() => navigate(`/product/${product._id}`)}
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className="product-card-luxury__image">
                                    <img
                                        src={getProductImage(product, index)}
                                        alt={product.name}
                                        onError={(e) => { e.target.src = fallbackImages[index % fallbackImages.length]; }}
                                    />
                                    <div className="product-card-luxury__badge">
                                        {product.subcategory || 'New Arrival'}
                                    </div>
                                    <button
                                        className="product-card-luxury__bag-btn"
                                        onClick={(e) => handleAddToBag(e, product)}
                                    >
                                        + Add to Bag
                                    </button>
                                </div>
                                <div className="product-card-luxury__info">
                                    <span className="product-card-luxury__brand">AWIK MAISON</span>
                                    <h3 className="product-card-luxury__name">{product.name}</h3>
                                    <div className="product-card-luxury__footer">
                                        <span className="product-card-luxury__price">{formatPrice(product.price)}</span>
                                        <div className="product-card-luxury__colors">
                                            {product.colors?.slice(0, 3).map(c => (
                                                <span key={c} className="color-dot" title={c} />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default LandingPage;

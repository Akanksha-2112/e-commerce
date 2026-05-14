import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGlobal } from '../../context/GlobalContext';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import '../../styles/BoutiqueLanding.css';

/* ── Hero slides ─────────────────────────── */
const HERO_SLIDES = [
    {
        label: 'WOMEN',
        title: 'THE NEW\nSEASON',
        subtitle: 'EXQUISITE ETHNIC WEAR CRAFTED FOR THE EXTRAORDINARY WOMAN. HERITAGE MEETS HAUTE COUTURE.',
        img: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1600&q=90',
        cta: '/women',
    },
    {
        label: 'MEN',
        title: 'SOVEREIGN\nSTYLE',
        subtitle: 'PRECISION TAILORING AND PREMIUM FABRICS. DESIGNED FOR THE MODERN MAN WITH A CLASSIC SOUL.',
        img: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=1600&q=90',
        cta: '/men',
    },
    {
        label: 'KIDS',
        title: 'LITTLE\nROYALS',
        subtitle: 'CELEBRATE EVERY OCCASION WITH VIBRANT, COMFORTABLE ETHNIC WEAR FOR YOUR LITTLE ONES.',
        img: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=1600&q=90',
        cta: '/kids',
    },
];

const MARQUEE_TEXT = 'WOMEN · MEN · KIDS · SAREES · LEHENGAS · KURTAS · SHERWANIS · NEW ARRIVALS · BEST SELLERS · ';

const LandingPage = () => {
    const navigate = useNavigate();
    const { toggleCart } = useGlobal();
    const { user } = useContext(AuthContext);

    const { toggleCart, toggleSidebar } = useGlobal();
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % HERO_SLIDES.length);
        }, 6000);
        return () => clearInterval(timer);
    }, []);

    const renderHeader = () => (
        <>
            <div className="axm-announce">
                Complimentary Shipping on all orders above ₹5,000 • 14-Day Returns • Concierge Styling Available
            </div>
            <nav className="axm-nav">
                <div className="axm-nav__logo" onClick={() => navigate('/')}>
                    AWIK <span>SPECTRUM</span>
                </div>
                <div className="axm-nav__links">
                    <button onClick={() => navigate('/women')}>Women</button>
                    <button onClick={() => navigate('/men')}>Men</button>
                    <button onClick={() => navigate('/kids')}>Kids</button>
                    <button onClick={() => navigate('/maison')}>The Maison</button>
                </div>
                <div className="axm-nav__icons">
                    <button className="axm-icon-btn" onClick={() => navigate('/profile')}><FaUser size={16} /></button>
                    <button className="axm-icon-btn axm-cart-btn" onClick={() => toggleCart(true)}>
                        <FaShoppingBag size={16} />
                        <span className="axm-cart-dot" />
                    </button>
                    <button className="axm-icon-btn" onClick={() => navigate('/wishlist')}>
                        <FaHeart size={16} />
                    </button>
                    <button className="axm-icon-btn" style={{ marginLeft: '0.5rem' }} onClick={() => toggleSidebar(true)}>
                        <FaBars size={18} />
                    </button>
                </div>
            </nav>
        </>
    );

    const renderHero = () => (
        <div className="axm-hero">
            {HERO_SLIDES.map((slide, idx) => (
                <div key={idx} className={`axm-hero__slide ${currentSlide === idx ? 'active' : ''}`}>
                    <img src={slide.image} alt={slide.title} />
                    <div className="axm-hero__overlay" />
                    {currentSlide === idx && (
                        <motion.div 
                            className="axm-hero__content"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <span className="axm-hero__label">AWIK Studio</span>
                            <h1 className="axm-hero__title" dangerouslySetInnerHTML={{ __html: slide.title }} />
                            <p className="axm-hero__sub">{slide.sub}</p>
                            <button className="axm-btn-morphism" onClick={() => navigate('/women')}>
                                <span>Discover Collection</span>
                                <FaArrowRight size={14} style={{ position: 'relative', zIndex: 1 }} />
                            </button>
                        </motion.div>
                    )}
                </div>
            ))}
            <div className="axm-hero__dots">
                {HERO_SLIDES.map((_, idx) => (
                    <button 
                        key={idx} 
                        className={`axm-dot ${currentSlide === idx ? 'active' : ''}`}
                        onClick={() => setCurrentSlide(idx)}
                    />
                ))}
            </div>
        </div>
    );

    return (
        <div className="axm-root">
            {renderHeader()}
            {renderHero()}

            <div className="axm-marquee-wrap">
                <div className="axm-marquee">
                    <span>AWIK SPECTRUM</span>
                    <span className="star">★</span>
                    <span>CRAFT</span>
                    <span className="star">★</span>
                    <span>HERITAGE</span>
                    <span className="star">★</span>
                    <span>INTENTION</span>
                    <span className="star">★</span>
                    <span>AWIK SPECTRUM</span>
                    <span className="star">★</span>
                    <span>CRAFT</span>
                    <span className="star">★</span>
                    <span>HERITAGE</span>
                    <span className="star">★</span>
                    <span>INTENTION</span>
                </div>
            </div>

            <section className="axm-section">
                <div className="axm-section-header">
                    <span className="axm-hero__label">Curated Selection</span>
                    <h2 className="axm-section-title">FEATURED<br/><span>PRODUCTS</span></h2>
                </div>
                
                <div className="axm-bento">
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Best Sellers Bento (reversed) ────── */}
            <section className="axm-section">
                <div className="axm-bento axm-bento--reversed">
                    <div className="axm-bento__grid">
                        {(products.length > 2 ? products.slice(2, 6) : Array(4).fill(null)).map((product, i) => (
                            <div key={i} className="axm-product-card"
                                onClick={() => product && navigate(`/product/${product._id}`)}>
                                <div className="axm-product-card__img-wrap">
                                    <img
                                        src={product?.images?.[0]?.url && !product.images[0].url.includes('placeholder')
                                            ? product.images[0].url : FALLBACK[(i + 2) % FALLBACK.length]}
                                        alt={product?.name || 'Product'}
                                        onError={e => { e.target.src = FALLBACK[(i + 2) % FALLBACK.length]; }}
                                    />
                                    {i === 0 && <span className="axm-new-badge axm-sale-badge">SALE</span>}
                                    <span className="axm-new-badge" style={{ left: 'auto', right: '0.75rem' }}>BEST SELLER</span>
                                </div>
                                <div className="axm-product-card__info">
                                    {product?.subcategory && <span className="axm-card-cat">{product.subcategory.toUpperCase()}</span>}
                                    <div className="axm-card-bottom">
                                        <span className="axm-card-name">{product?.name || 'Coming Soon'}</span>
                                        <span className="axm-card-arrow">↗</span>
                                    </div>
                                    {product && <span className="axm-card-price">{formatPrice(product.price)}</span>}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="axm-bento__feature" onClick={() => navigate('/women')}>
                        <img src="https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=900&q=85"
                            alt="Best Sellers" onError={e => { e.target.src = FALLBACK[1]; }} />
                        <div className="axm-bento__feature-text">
                            <span className="axm-label">SHOP NOW ↗</span>
                            <h2 className="axm-bento__big-title">BEST<br />SELLERS</h2>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Category Strip ───────────────────── */}
            <section className="axm-cat-strip">
                <div className="axm-marquee-wrap axm-marquee-wrap--large">
                    <div className="axm-marquee axm-marquee--big">
                        <span>WOMEN &nbsp; SAREES &nbsp; LEHENGAS &nbsp; MEN &nbsp; SHERWANIS &nbsp; KIDS &nbsp; ETHNIC &nbsp; ACCESSORIES &nbsp; </span>
                        <span>WOMEN &nbsp; SAREES &nbsp; LEHENGAS &nbsp; MEN &nbsp; SHERWANIS &nbsp; KIDS &nbsp; ETHNIC &nbsp; ACCESSORIES &nbsp; </span>
                    </div>
                </div>
                <div className="axm-cat-grid">
                    {[
                        { name: 'WOMEN', sub: 'SHOP NOW ↗', img: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80', link: '/women' },
                        { name: 'MEN',   sub: 'SHOP NOW ↗', img: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=600&q=80', link: '/men' },
                        { name: 'KIDS',  sub: 'SHOP NOW ↗', img: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=600&q=80', link: '/kids' },
                        { name: 'NEW',   sub: 'SHOP NOW ↗', img: 'https://images.unsplash.com/photo-1603400521630-9f2de124b33b?w=600&q=80', link: '/search' },
                    ].map(cat => (
                        <div key={cat.name} className="axm-cat-item" onClick={() => navigate(cat.link)}>
                            <img src={cat.img} alt={cat.name} onError={e => { e.target.src = FALLBACK[0]; }} />
                            <div className="axm-cat-item__footer">
                                <span className="axm-cat-item__name">{cat.name}</span>
                                <span className="axm-cat-item__cta">{cat.sub}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Footer CTA ───────────────────────── */}
            <section className="axm-footer-cta">
                <p className="axm-footer-cta__eyebrow">AWIK SPECTRUM</p>
                <h2 className="axm-footer-cta__title">JOIN THE MAISON</h2>
                <p className="axm-footer-cta__sub">
                    Exclusive access. Early drops. Members-only pricing.
                </p>
                <button className="axm-btn-white" onClick={() => navigate(user ? '/profile' : '/register')}>
                    {user ? `WELCOME, ${firstName.toUpperCase()}` : 'BECOME A MEMBER'}
                </button>
            </section>
        </div>
    );
};

export default LandingPage;

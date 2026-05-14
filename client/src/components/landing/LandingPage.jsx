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

    const [products, setProducts] = useState([]);
    const [heroIndex, setHeroIndex] = useState(0);
    const [firstName, setFirstName] = useState('');

    useEffect(() => {
        if (user) {
            setFirstName(user.firstName || user.name?.split(' ')[0] || 'Member');
        }
        fetchProducts();
    }, [user]);

    /* Auto-advance hero */
    useEffect(() => {
        const t = setInterval(() => setHeroIndex(i => (i + 1) % HERO_SLIDES.length), 5000);
        return () => clearInterval(t);
    }, []);

    const fetchProducts = async () => {
        try {
            const url = `${process.env.REACT_APP_API_URL || 'https://e-commerce-2e5z.onrender.com/api'}/products`;
            const { data } = await axios.get(url);
            const list = data.products || (Array.isArray(data) ? data : []);
            setProducts(list.slice(0, 6));
        } catch (e) {
            console.error(e);
        }
    };

    const formatPrice = p => new Intl.NumberFormat('en-IN', {
        style: 'currency', currency: 'INR', maximumFractionDigits: 0,
    }).format(p);

    const FALLBACK = [
        'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80',
        'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600&q=80',
        'https://images.unsplash.com/photo-1614179689702-355944cd0918?w=600&q=80',
        'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=600&q=80',
        'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=600&q=80',
        'https://images.unsplash.com/photo-1603400521630-9f2de124b33b?w=600&q=80',
    ];

    const slide = HERO_SLIDES[heroIndex];

    return (
        <div className="axm-root">

            {/* ── Announcement Bar ─────────────────── */}
            <div className="axm-announce">
                <span>FREE SHIPPING ON ORDERS ABOVE ₹2,000 &nbsp;|&nbsp; NEW COLLECTION JUST DROPPED &nbsp;|&nbsp; FREE RETURNS WITHIN 30 DAYS</span>
            </div>

            {/* ── Navbar ───────────────────────────── */}
            <header className="axm-nav">
                <div className="axm-nav__logo" onClick={() => navigate('/')}>AWIK</div>
                <nav className="axm-nav__links">
                    <button onClick={() => navigate('/women')}>SHOP</button>
                    <button onClick={() => navigate('/men')}>MEN</button>
                    <button onClick={() => navigate('/kids')}>KIDS</button>
                    <button onClick={() => navigate('/search')}>NEW ARRIVALS</button>
                </nav>
                <div className="axm-nav__icons">
                    <button className="axm-icon-btn" title="Search" onClick={() => navigate('/search')}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    </button>
                    <button className="axm-icon-btn" title="Account" onClick={() => navigate(user ? '/profile' : '/login')}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    </button>
                    <button className="axm-icon-btn axm-cart-btn" title="Cart" onClick={() => { if (typeof toggleCart === 'function') toggleCart(true); }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                        <span className="axm-cart-dot" />
                    </button>
                </div>
            </header>

            {/* ── Hero ─────────────────────────────── */}
            <section className="axm-hero">
                {HERO_SLIDES.map((s, i) => (
                    <div key={i} className={`axm-hero__slide ${i === heroIndex ? 'active' : ''}`}>
                        <img src={s.img} alt={s.label} onError={e => { e.target.src = FALLBACK[i]; }} />
                        <div className="axm-hero__overlay" />
                    </div>
                ))}

                <div className="axm-hero__content">
                    <span className="axm-hero__label">{slide.label}</span>
                    <h1 className="axm-hero__title">{slide.title}</h1>
                    <p className="axm-hero__sub">{slide.subtitle}</p>
                    <button className="axm-btn-outline-white" onClick={() => navigate(slide.cta)}>
                        SHOP NOW
                    </button>
                </div>

                {/* Slide dots */}
                <div className="axm-hero__dots">
                    {HERO_SLIDES.map((_, i) => (
                        <button key={i} className={`axm-dot ${i === heroIndex ? 'active' : ''}`}
                            onClick={() => setHeroIndex(i)} />
                    ))}
                </div>

                {/* Thumbnail previews */}
                <div className="axm-hero__thumbs">
                    {HERO_SLIDES.map((s, i) => (
                        <div key={i} className={`axm-thumb ${i === heroIndex ? 'active' : ''}`}
                            onClick={() => setHeroIndex(i)}>
                            <img src={s.img} alt={s.label} onError={e => { e.target.src = FALLBACK[i]; }} />
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Marquee ──────────────────────────── */}
            <div className="axm-marquee-wrap">
                <div className="axm-marquee">
                    <span>{MARQUEE_TEXT}{MARQUEE_TEXT}</span>
                </div>
            </div>

            {/* ── New Arrivals Bento ───────────────── */}
            <section className="axm-section">
                <div className="axm-bento">
                    <div className="axm-bento__feature" onClick={() => navigate('/women')}>
                        <img src="https://images.unsplash.com/photo-1614179689702-355944cd0918?w=900&q=85"
                            alt="New Arrivals" onError={e => { e.target.src = FALLBACK[2]; }} />
                        <div className="axm-bento__feature-text">
                            <span className="axm-label">SHOP NOW ↗</span>
                            <h2 className="axm-bento__big-title">NEW<br />ARRIVALS</h2>
                        </div>
                    </div>

                    <div className="axm-bento__grid">
                        {(products.length > 0 ? products.slice(0, 4) : Array(4).fill(null)).map((product, i) => (
                            <div key={i} className="axm-product-card"
                                onClick={() => product && navigate(`/product/${product._id}`)}>
                                <div className="axm-product-card__img-wrap">
                                    <img
                                        src={product?.images?.[0]?.url && !product.images[0].url.includes('placeholder')
                                            ? product.images[0].url : FALLBACK[i % FALLBACK.length]}
                                        alt={product?.name || 'Product'}
                                        onError={e => { e.target.src = FALLBACK[i % FALLBACK.length]; }}
                                    />
                                    {product && <span className="axm-new-badge">NEW</span>}
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

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useGlobal } from '../context/GlobalContext';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { API_BASE } from '../config';

const FALLBACK_IMAGES = {
    'Sarees':    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80',
    'Lehengas':  'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800&q=80',
    'Dresses':   'https://images.unsplash.com/photo-1614179689702-355944cd0918?w=800&q=80',
    'Tops':      'https://images.unsplash.com/photo-1603400521630-9f2de124b33b?w=800&q=80',
    'Kurtis':    'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=800&q=80',
    'Shirts':    'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&q=80',
    'Pants':     'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&q=80',
    'Sherwanis': 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&q=80',
    'default':   'https://images.unsplash.com/photo-1550614000-4b9519e0037a?w=800&q=80',
};

const getFallback = (subcategory, index) => {
    const keys = Object.keys(FALLBACK_IMAGES).filter(k => k !== 'default');
    return FALLBACK_IMAGES[subcategory] || FALLBACK_IMAGES[keys[index % keys.length]] || FALLBACK_IMAGES.default;
};

const generateMockProducts = (category, subcategory) => {
    return Array.from({ length: 8 }).map((_, i) => ({
        _id: `mock-${category}-${subcategory}-${i}`,
        name: `${subcategory} Collection ${i + 1}`,
        brand: 'AWIK MAISON',
        price: 4500 + (i * 800),
        images: [{ url: getFallback(subcategory, i) }]
    }));
};

/* ---- skeleton card ---- */
const SkeletonCard = () => (
    <div style={{ background: '#111', position: 'relative', overflow: 'hidden' }}>
        <div style={{ aspectRatio: '3/4', background: 'linear-gradient(90deg,#1a1a1a 25%,#222 50%,#1a1a1a 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite' }} />
        <div style={{ padding: '0.9rem 1rem' }}>
            <div style={{ height: 8, width: '40%', background: '#1a1a1a', borderRadius: 4, marginBottom: 8, animation: 'shimmer 1.4s infinite' }} />
            <div style={{ height: 12, width: '70%', background: '#1a1a1a', borderRadius: 4, animation: 'shimmer 1.4s infinite' }} />
        </div>
    </div>
);

const MARQUEE_ITEMS = ['NEW ARRIVALS', '★', 'EXCLUSIVE DROPS', '★', 'FREE SHIPPING ABOVE ₹5,000', '★', 'AWIK MAISON', '★'];

const CategoryLandingPage = ({ category, initialSubcategories }) => {
    const { addToCart, addToWishlist } = useGlobal();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeSubcategory, setActiveSubcategory] = useState(initialSubcategories[0]);
    const [hoveredProduct, setHoveredProduct] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const { data } = await axios.get(`${API_BASE}/api/products?category=${category}&subcategory=${activeSubcategory}`);
                if (data.products && data.products.length > 0) {
                    setProducts(data.products);
                } else {
                    setProducts(generateMockProducts(category, activeSubcategory));
                }
            } catch (err) {
                setProducts(generateMockProducts(category, activeSubcategory));
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [category, activeSubcategory]);

    const formatPrice = (price) =>
        new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);

    const handleAddToCart = (e, product) => {
        e.stopPropagation();
        addToCart({ id: product._id, name: product.name, price: product.price, image: product.images[0]?.url, quantity: 1 });
    };

    const handleWishlist = (e, product) => {
        e.stopPropagation();
        addToWishlist({ id: product._id, name: product.name, price: product.price, image: product.images[0]?.url });
    };

    return (
        <div className="clp-root">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;500;600&family=Space+Grotesk:wght@500;600&display=swap');

                .clp-root {
                    min-height: 100vh;
                    background: #0C0C0E;
                    color: #F8F4EE;
                    font-family: 'Outfit', sans-serif;
                    overflow-x: hidden;
                }

                /* grain overlay */
                .clp-root::before {
                    content: '';
                    position: fixed; inset: 0;
                    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
                    pointer-events: none; opacity: 0.05; z-index: 9999;
                }

                /* ── marquee ── */
                .clp-marquee-wrap {
                    overflow: hidden;
                    border-top: 1px solid rgba(255,255,255,0.08);
                    border-bottom: 1px solid rgba(255,255,255,0.08);
                    background: rgba(240,90,40,0.06);
                    padding: 0.7rem 0;
                    margin-top: 64px; /* navbar height */
                }
                .clp-marquee {
                    display: flex; white-space: nowrap;
                    animation: clpMarquee 22s linear infinite;
                }
                .clp-marquee span {
                    font-family: 'Space Grotesk', sans-serif;
                    font-size: 0.7rem; font-weight: 600;
                    letter-spacing: 0.15em; text-transform: uppercase;
                    color: rgba(248,244,238,0.5);
                    padding-right: 2rem;
                }
                .clp-marquee span.star { color: #F05A28; }

                @keyframes clpMarquee {
                    from { transform: translateX(0); }
                    to   { transform: translateX(-50%); }
                }

                /* ── header ── */
                .clp-header {
                    text-align: center;
                    padding: 5rem 2rem 3rem;
                    position: relative;
                }
                .clp-header::before {
                    content: '';
                    position: absolute; inset: 0;
                    background: radial-gradient(ellipse at 50% 0%, rgba(240,90,40,0.08) 0%, transparent 70%);
                    pointer-events: none;
                }
                .clp-kicker {
                    font-family: 'Space Grotesk', sans-serif;
                    font-size: 0.7rem; letter-spacing: 0.22em;
                    text-transform: uppercase; color: #F05A28;
                    display: inline-flex; align-items: center; gap: 0.5rem;
                    margin-bottom: 1.2rem;
                }
                .clp-kicker::before { content: ''; width: 1.5rem; height: 1px; background: #F05A28; }

                .clp-title {
                    font-family: 'Bebas Neue', sans-serif;
                    font-size: clamp(3.5rem, 9vw, 8rem);
                    line-height: 0.88;
                    letter-spacing: 0.03em;
                    color: #F8F4EE;
                    margin-bottom: 2.5rem;
                }
                .clp-title span { color: #F05A28; }

                /* ── subcategory pills ── */
                .clp-pills {
                    display: flex;
                    justify-content: center;
                    gap: 0.5rem;
                    flex-wrap: wrap;
                }
                .clp-pill {
                    background: transparent;
                    border: 1px solid rgba(255,255,255,0.12);
                    border-radius: 2rem;
                    font-family: 'Space Grotesk', sans-serif;
                    font-size: 0.72rem; font-weight: 600;
                    letter-spacing: 0.12em; text-transform: uppercase;
                    color: rgba(248,244,238,0.5);
                    cursor: pointer;
                    padding: 0.55rem 1.4rem;
                    transition: all 0.25s ease;
                    position: relative;
                    overflow: hidden;
                }
                .clp-pill.active {
                    background: #F05A28;
                    border-color: #F05A28;
                    color: #fff;
                    box-shadow: 0 4px 20px rgba(240,90,40,0.35);
                }
                .clp-pill:not(.active):hover {
                    border-color: rgba(255,255,255,0.35);
                    color: #F8F4EE;
                }

                /* ── divider rule ── */
                .clp-divider {
                    height: 1px;
                    background: rgba(255,255,255,0.06);
                    margin: 0 2rem;
                }

                /* ── result meta ── */
                .clp-meta {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1.2rem 2rem;
                    max-width: 1600px;
                    margin: 0 auto;
                }
                .clp-meta-count {
                    font-family: 'Space Grotesk', sans-serif;
                    font-size: 0.72rem; color: rgba(248,244,238,0.4);
                    letter-spacing: 0.1em; text-transform: uppercase;
                }
                .clp-meta-active {
                    font-family: 'Space Grotesk', sans-serif;
                    font-size: 0.72rem; color: #F05A28;
                    letter-spacing: 0.1em; text-transform: uppercase;
                }

                /* ── grid ── */
                .clp-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                    gap: 1px;
                    background: rgba(255,255,255,0.05);
                    max-width: 1600px;
                    margin: 0 auto;
                }

                /* ── product card ── */
                .clp-card {
                    background: #0C0C0E;
                    cursor: pointer;
                    position: relative;
                    overflow: hidden;
                    transition: background 0.3s;
                }
                .clp-card:hover { background: #111; }

                .clp-card-img-wrap {
                    position: relative;
                    aspect-ratio: 3/4;
                    overflow: hidden;
                }
                .clp-card-img {
                    width: 100%; height: 100%;
                    object-fit: cover;
                    transition: transform 0.7s cubic-bezier(0.22,1,0.36,1);
                    filter: brightness(0.88);
                }
                .clp-card:hover .clp-card-img {
                    transform: scale(1.07);
                    filter: brightness(0.95);
                }

                .clp-badge-new {
                    position: absolute; top: 0.75rem; left: 0.75rem;
                    background: #F05A28; color: #fff;
                    font-family: 'Space Grotesk', sans-serif;
                    font-size: 0.55rem; font-weight: 700;
                    letter-spacing: 0.14em; padding: 0.25rem 0.6rem;
                    text-transform: uppercase; border-radius: 2px;
                }

                /* gradient fade bottom of image */
                .clp-card-img-wrap::after {
                    content: '';
                    position: absolute; inset: 0;
                    background: linear-gradient(to top, rgba(12,12,14,0.85) 0%, transparent 50%);
                    opacity: 0;
                    transition: opacity 0.35s;
                    pointer-events: none;
                }
                .clp-card:hover .clp-card-img-wrap::after { opacity: 1; }

                /* slide-up CTA */
                .clp-card-cta {
                    position: absolute; bottom: 0; left: 0; right: 0;
                    padding: 0.85rem 1rem;
                    background: rgba(12,12,14,0.95);
                    display: flex; gap: 0.6rem;
                    transform: translateY(101%);
                    transition: transform 0.35s cubic-bezier(0.22,1,0.36,1);
                    backdrop-filter: blur(6px);
                }
                .clp-card:hover .clp-card-cta { transform: translateY(0); }

                .clp-btn-bag {
                    flex: 1; background: #F05A28; color: #fff; border: none;
                    padding: 0.65rem; font-family: 'Space Grotesk', sans-serif;
                    font-size: 0.68rem; font-weight: 600;
                    letter-spacing: 0.12em; text-transform: uppercase;
                    cursor: pointer; border-radius: 2px;
                    transition: background 0.2s;
                }
                .clp-btn-bag:hover { background: #ff6836; }

                .clp-btn-wish {
                    background: transparent; color: #F8F4EE;
                    border: 1px solid rgba(255,255,255,0.2);
                    padding: 0.65rem 0.9rem; font-size: 1rem;
                    cursor: pointer; border-radius: 2px;
                    transition: all 0.2s;
                }
                .clp-btn-wish:hover { border-color: #F05A28; color: #F05A28; }

                /* product info */
                .clp-card-info {
                    padding: 0.9rem 1rem;
                    border-top: 1px solid rgba(255,255,255,0.05);
                    display: flex; flex-direction: column; gap: 0.25rem;
                }
                .clp-card-brand {
                    font-family: 'Space Grotesk', sans-serif;
                    font-size: 0.58rem; color: #F05A28;
                    letter-spacing: 0.14em; text-transform: uppercase;
                }
                .clp-card-row {
                    display: flex; justify-content: space-between; align-items: center;
                }
                .clp-card-name {
                    font-family: 'Outfit', sans-serif;
                    font-size: 0.88rem; font-weight: 500;
                    color: rgba(248,244,238,0.85); margin: 0;
                    transition: color 0.2s;
                }
                .clp-card:hover .clp-card-name { color: #F8F4EE; }

                .clp-card-arrow {
                    font-size: 0.9rem;
                    color: rgba(248,244,238,0.25);
                    transition: color 0.2s, transform 0.2s;
                }
                .clp-card:hover .clp-card-arrow {
                    color: #F05A28;
                    transform: translate(2px, -2px);
                }
                .clp-card-price {
                    font-family: 'Bebas Neue', sans-serif;
                    font-size: 1.15rem; color: rgba(248,244,238,0.5);
                    letter-spacing: 0.04em;
                    transition: color 0.2s;
                }
                .clp-card:hover .clp-card-price { color: #F05A28; }

                /* shimmer */
                @keyframes shimmer {
                    0%   { background-position: -200% 0; }
                    100% { background-position:  200% 0; }
                }

                /* empty state */
                .clp-empty {
                    text-align: center;
                    padding: 8rem 2rem;
                    color: rgba(248,244,238,0.25);
                    font-family: 'Space Grotesk', sans-serif;
                    font-size: 0.8rem; letter-spacing: 0.2em;
                    text-transform: uppercase;
                }

                /* responsive */
                @media (max-width: 768px) {
                    .clp-grid { grid-template-columns: repeat(2, 1fr); }
                    .clp-title { font-size: clamp(2.5rem, 12vw, 5rem); }
                }
                @media (max-width: 480px) {
                    .clp-grid { grid-template-columns: 1fr; }
                }
            `}</style>

            <Navbar />

            {/* Marquee */}
            <div className="clp-marquee-wrap">
                <div className="clp-marquee">
                    {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
                        <span key={i} className={item === '★' ? 'star' : ''}>{item}</span>
                    ))}
                </div>
            </div>

            {/* Header */}
            <div className="clp-header">
                <p className="clp-kicker">AWIK SPECTRUM</p>
                <motion.h1
                    className="clp-title"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                >
                    {category.toUpperCase()} <span>COLLECTION</span>
                </motion.h1>

                {/* Subcategory Pills */}
                <div className="clp-pills">
                    {initialSubcategories.map((sub, i) => (
                        <motion.button
                            key={sub}
                            className={`clp-pill ${activeSubcategory === sub ? 'active' : ''}`}
                            onClick={() => setActiveSubcategory(sub)}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.06 + 0.3, duration: 0.4 }}
                        >
                            {sub}
                        </motion.button>
                    ))}
                </div>
            </div>

            <div className="clp-divider" />

            {/* Meta bar */}
            <div className="clp-meta">
                <span className="clp-meta-count">
                    {loading ? 'Loading...' : `${products.length} items`}
                </span>
                <span className="clp-meta-active">{activeSubcategory}</span>
            </div>

            {/* Product Grid */}
            <AnimatePresence mode="wait">
                {loading ? (
                    <motion.div
                        key="skeleton"
                        className="clp-grid"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
                    </motion.div>
                ) : products.length === 0 ? (
                    <div className="clp-empty">No products found in this collection.</div>
                ) : (
                    <motion.div
                        key={activeSubcategory}
                        className="clp-grid"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {products.map((product, index) => (
                            <motion.div
                                key={product._id}
                                className="clp-card"
                                initial={{ opacity: 0, y: 24 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.05, ease: 'easeOut' }}
                                onMouseEnter={() => setHoveredProduct(product._id)}
                                onMouseLeave={() => setHoveredProduct(null)}
                                onClick={() => navigate(`/product/${product._id}`)}
                            >
                                <div className="clp-card-img-wrap">
                                    <img
                                        className="clp-card-img"
                                        src={product.images[0]?.url || getFallback(activeSubcategory, index)}
                                        alt={product.name}
                                        onError={e => { e.target.onerror = null; e.target.src = getFallback(activeSubcategory, index); }}
                                    />
                                    <span className="clp-badge-new">New</span>

                                    {/* Slide-up CTA */}
                                    <div className="clp-card-cta">
                                        <button className="clp-btn-bag" onClick={(e) => handleAddToCart(e, product)}>
                                            Add to Bag
                                        </button>
                                        <button className="clp-btn-wish" onClick={(e) => handleWishlist(e, product)}>
                                            ♡
                                        </button>
                                    </div>
                                </div>

                                <div className="clp-card-info">
                                    <span className="clp-card-brand">AWIK MAISON</span>
                                    <div className="clp-card-row">
                                        <h3 className="clp-card-name">{product.name}</h3>
                                        <span className="clp-card-arrow">↗</span>
                                    </div>
                                    <p className="clp-card-price">{formatPrice(product.price)}</p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CategoryLandingPage;

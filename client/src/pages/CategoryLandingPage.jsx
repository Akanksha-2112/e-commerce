import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useGlobal } from '../context/GlobalContext';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';

import { API_BASE } from '../config';

// Curated fallback images per subcategory
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

// Mock Data Generator for Fallback
const generateMockProducts = (category, subcategory) => {
    return Array.from({ length: 8 }).map((_, i) => ({
        _id: `mock-${category}-${subcategory}-${i}`,
        name: `${subcategory} Collection ${i + 1}`,
        brand: 'AWIK MAISON',
        price: 4500 + (i * 800),
        images: [{ url: getFallback(subcategory, i) }]
    }));
};

const CategoryLandingPage = ({ category, initialSubcategories }) => {
    const { addToCart, addToWishlist } = useGlobal();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeSubcategory, setActiveSubcategory] = useState(initialSubcategories[0]);
    const [hoveredProduct, setHoveredProduct] = useState(null);

    // Fetch Products when Active Subcategory changes
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                // Fetch products for category and active subcategory
                const { data } = await axios.get(`${API_BASE}/api/products?category=${category}&subcategory=${activeSubcategory}`);

                if (data.products && data.products.length > 0) {
                    setProducts(data.products);
                } else {
                    console.log("Database empty for this route, using Mock Data");
                    setProducts(generateMockProducts(category, activeSubcategory));
                }
                setLoading(false);
            } catch (err) {
                console.error("Error fetching products:", err);
                setProducts(generateMockProducts(category, activeSubcategory));
                setLoading(false);
            }
        };

        fetchProducts();
    }, [category, activeSubcategory]);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(price);
    };

    const handleAddToCart = (e, product) => {
        e.stopPropagation();
        addToCart({
            id: product._id,
            name: product.name,
            price: product.price,
            image: product.images[0]?.url,
            quantity: 1
        });
    };

    const handleWishlist = (e, product) => {
        e.stopPropagation();
        addToWishlist({
            id: product._id,
            name: product.name,
            price: product.price,
            image: product.images[0]?.url
        });
    };

    return (
        <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', fontFamily: "'Inter', sans-serif" }}>
            <Navbar />
            {/* Header Area */}
            <div style={{ paddingTop: '120px', textAlign: 'center', marginBottom: '3rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '2rem' }}>
                <p style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '0.8rem' }}>AWIK SPECTRUM</p>
                <h1 style={{
                    fontFamily: "'Anton', 'Impact', sans-serif",
                    fontSize: 'clamp(3rem, 7vw, 6rem)',
                    color: '#fff',
                    lineHeight: 0.9,
                    letterSpacing: '0.02em',
                    marginBottom: '2rem'
                }}>
                    {category.toUpperCase()} COLLECTION
                </h1>

                {/* Subcategory Bar */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '0',
                    width: 'fit-content',
                    margin: '0 auto',
                    flexWrap: 'wrap',
                    border: '1px solid rgba(255,255,255,0.12)'
                }}>
                    {initialSubcategories.map((sub) => (
                        <button
                            key={sub}
                            onClick={() => setActiveSubcategory(sub)}
                            style={{
                                background: activeSubcategory === sub ? '#fff' : 'transparent',
                                border: 'none',
                                borderRight: '1px solid rgba(255,255,255,0.12)',
                                fontFamily: "'Inter', sans-serif",
                                fontSize: '0.72rem',
                                fontWeight: 500,
                                letterSpacing: '0.14em',
                                textTransform: 'uppercase',
                                color: activeSubcategory === sub ? '#0a0a0a' : 'rgba(255,255,255,0.55)',
                                cursor: 'pointer',
                                padding: '0.6rem 1.4rem',
                                transition: 'all 0.25s ease'
                            }}
                        >
                            {sub}
                        </button>
                    ))}
                </div>
            </div>

            {/* Product Grid */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '100px', color: '#666', fontSize: '0.8rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Loading Collection...</div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: '1px',
                    background: 'rgba(255,255,255,0.06)',
                    padding: '0',
                    maxWidth: '1600px',
                    margin: '0 auto 0'
                }}>
                    {products.map((product, index) => (
                        <motion.div
                            key={product._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.06, ease: 'easeOut' }}
                            style={{ cursor: 'pointer', background: '#0a0a0a', position: 'relative', overflow: 'hidden' }}
                            onMouseEnter={() => setHoveredProduct(product._id)}
                            onMouseLeave={() => setHoveredProduct(null)}
                        >
                            {/* Image Container */}
                            <div style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden' }}>
                                <img
                                    src={product.images[0]?.url || getFallback(activeSubcategory, index)}
                                    alt={product.name}
                                    onError={e => { e.target.onerror = null; e.target.src = getFallback(activeSubcategory, index); }}
                                    style={{
                                        width: '100%', height: '100%', objectFit: 'cover',
                                        transition: 'transform 0.7s ease',
                                        transform: hoveredProduct === product._id ? 'scale(1.06)' : 'scale(1)',
                                        filter: 'brightness(0.85)'
                                    }}
                                />
                                {/* NEW badge */}
                                <span style={{
                                    position: 'absolute', top: '0.75rem', left: '0.75rem',
                                    background: '#fff', color: '#0a0a0a',
                                    fontSize: '0.58rem', fontWeight: 700,
                                    letterSpacing: '0.12em', padding: '0.2rem 0.5rem',
                                    textTransform: 'uppercase'
                                }}>NEW</span>

                                {/* Add to Bag slide-up */}
                                <div style={{
                                    position: 'absolute', bottom: 0, left: 0, right: 0,
                                    padding: '0.8rem 1rem',
                                    background: 'rgba(10,10,10,0.92)',
                                    display: 'flex', gap: '0.75rem',
                                    transform: hoveredProduct === product._id ? 'translateY(0)' : 'translateY(100%)',
                                    transition: 'transform 0.3s ease'
                                }}>
                                    <button onClick={(e) => handleAddToCart(e, product)} style={{
                                        flex: 1, background: '#fff', color: '#0a0a0a', border: 'none',
                                        padding: '0.65rem', fontSize: '0.7rem', fontWeight: 600,
                                        letterSpacing: '0.14em', textTransform: 'uppercase', cursor: 'pointer',
                                        transition: 'background 0.2s'
                                    }}>Add to Bag</button>
                                    <button onClick={(e) => handleWishlist(e, product)} style={{
                                        background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.3)',
                                        padding: '0.65rem 0.9rem', fontSize: '1rem', cursor: 'pointer'
                                    }}>♡</button>
                                </div>
                            </div>

                            {/* Product Info */}
                            <div style={{ padding: '0.9rem 1rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                                <span style={{ fontSize: '0.6rem', color: '#555', letterSpacing: '0.14em', textTransform: 'uppercase', display: 'block', marginBottom: '0.3rem' }}>AWIK MAISON</span>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.85rem', fontWeight: 500, color: '#e8e8e8', margin: 0 }}>
                                        {product.name}
                                    </h3>
                                    <span style={{ color: '#555', fontSize: '0.9rem' }}>↗</span>
                                </div>
                                <p style={{ fontSize: '0.82rem', color: '#666', marginTop: '0.25rem' }}>
                                    {formatPrice(product.price)}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CategoryLandingPage;

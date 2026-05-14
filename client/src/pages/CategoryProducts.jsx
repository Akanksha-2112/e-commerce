import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useGlobal } from '../context/GlobalContext';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import { API_BASE } from '../config';

// Subcategory-specific fallback images
const SUBCATEGORY_FALLBACKS = {
    // Women
    'Sarees':          'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=700&q=80',
    'Lehengas':        'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=700&q=80',
    'Dresses':         'https://images.unsplash.com/photo-1614179689702-355944cd0918?w=700&q=80',
    'Tops':            'https://images.unsplash.com/photo-1603400521630-9f2de124b33b?w=700&q=80',
    'Kurtis':          'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=700&q=80',
    // Men
    'Shirts':          'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=700&q=80',
    'Pants':           'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=700&q=80',
    'Jackets':         'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=700&q=80',
    'Suits':           'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=700&q=80',
    // Kids — colorful children's ethnic/festive wear
    'Girls Lehengas':  'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=700&q=80',
    'Girls Shararas':  'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=700&q=80',
    'Girls Gowns':     'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=700&q=80',
    'Boys Kurtas':     'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=700&q=80',
    'Boys Sherwanis':  'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=700&q=80',
    'Boys Suits':      'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=700&q=80',
    // default
    'default':         'https://images.unsplash.com/photo-1550614000-4b9519e0037a?w=700&q=80',
};

const getFallback = (sub, index) => {
    const key = sub || 'default';
    const url = SUBCATEGORY_FALLBACKS[key] || SUBCATEGORY_FALLBACKS['default'];
    return url;
};

const generateMockProducts = (category, subcategory) =>
    Array.from({ length: 8 }).map((_, i) => ({
        _id: `mock-${i}`,
        name: `${subcategory} Edition ${i + 1}`,
        brand: 'AWIK MAISON',
        price: 4500 + i * 900,
        images: [{ url: getFallback(subcategory, i) }],
    }));


const CategoryProducts = ({ category }) => {
    const { subcategory } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useGlobal();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hoveredProduct, setHoveredProduct] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const { data } = await axios.get(`${API_BASE}/api/products?category=${category}&subcategory=${subcategory}`);
                if (data.products?.length > 0) {
                    setProducts(data.products);
                } else {
                    setProducts(generateMockProducts(category, subcategory));
                }
            } catch {
                setProducts(generateMockProducts(category, subcategory));
            }
            setLoading(false);
        };
        fetchProducts();
    }, [category, subcategory]);

    const formatPrice = p => new Intl.NumberFormat('en-IN', {
        style: 'currency', currency: 'INR', maximumFractionDigits: 0,
    }).format(p);

    const getImg = (product, index) => {
        const url = product.images?.[0]?.url;
        if (url && !url.includes('placeholder') && !url.includes('placehold')) return url;
        return getFallback(subcategory, index);
    };


    return (
        <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', fontFamily: "'Inter', sans-serif" }}>
            <Navbar />

            {/* Header */}
            <div style={{ paddingTop: '120px', textAlign: 'center', marginBottom: '3rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '2rem' }}>
                <p style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '0.6rem' }}>
                    {category}
                </p>
                <h1 style={{
                    fontFamily: "'Anton', 'Impact', sans-serif",
                    fontSize: 'clamp(3rem, 8vw, 7rem)',
                    color: '#fff', lineHeight: 0.9, letterSpacing: '0.02em',
                }}>
                    {subcategory?.toUpperCase()}
                </h1>
                <button onClick={() => navigate(`/${category.toLowerCase()}`)}
                    style={{ marginTop: '1.5rem', background: 'none', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.5)', padding: '0.5rem 1.4rem', cursor: 'pointer', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', transition: 'all 0.2s' }}>
                    ← Back to {category}
                </button>
            </div>

            {/* Grid */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '100px', color: '#555', fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                    Loading Collection...
                </div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '1px', background: 'rgba(255,255,255,0.06)',
                    maxWidth: '1600px', margin: '0 auto',
                }}>
                    {products.map((product, index) => (
                        <motion.div
                            key={product._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.05 }}
                            style={{ cursor: 'pointer', background: '#0a0a0a', overflow: 'hidden' }}
                            onMouseEnter={() => setHoveredProduct(product._id)}
                            onMouseLeave={() => setHoveredProduct(null)}
                            onClick={() => navigate(`/product/${product._id}`)}
                        >
                            {/* Image */}
                            <div style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden' }}>
                                <img
                                    src={getImg(product, index)}
                                    alt={product.name}
                                    onError={e => { e.target.onerror = null; e.target.src = getFallback(subcategory, index); }}
                                    style={{
                                        width: '100%', height: '100%', objectFit: 'cover',
                                        transition: 'transform 0.7s ease', filter: 'brightness(0.85)',
                                        transform: hoveredProduct === product._id ? 'scale(1.06)' : 'scale(1)',
                                    }}
                                />
                                <span style={{
                                    position: 'absolute', top: '0.75rem', left: '0.75rem',
                                    background: '#fff', color: '#0a0a0a',
                                    fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.12em',
                                    padding: '0.2rem 0.5rem', textTransform: 'uppercase',
                                }}>NEW</span>

                                {/* Hover CTA */}
                                <div style={{
                                    position: 'absolute', bottom: 0, left: 0, right: 0,
                                    padding: '0.8rem 1rem', background: 'rgba(10,10,10,0.92)',
                                    display: 'flex', gap: '0.5rem',
                                    transform: hoveredProduct === product._id ? 'translateY(0)' : 'translateY(100%)',
                                    transition: 'transform 0.3s ease',
                                }}>
                                    <button
                                        onClick={e => { e.stopPropagation(); addToCart({ id: product._id, name: product.name, price: product.price, image: getImg(product, index), quantity: 1 }); }}
                                        style={{ flex: 1, background: '#fff', color: '#0a0a0a', border: 'none', padding: '0.65rem', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', cursor: 'pointer' }}
                                    >Add to Bag</button>
                                </div>
                            </div>

                            {/* Info */}
                            <div style={{ padding: '0.9rem 1rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                                <span style={{ fontSize: '0.6rem', color: '#555', letterSpacing: '0.14em', textTransform: 'uppercase', display: 'block', marginBottom: '0.3rem' }}>AWIK MAISON</span>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#e8e8e8' }}>{product.name}</span>
                                    <span style={{ color: '#555' }}>↗</span>
                                </div>
                                <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.25rem' }}>{formatPrice(product.price)}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            <div style={{ height: '4rem' }} />
        </div>
    );
};

export default CategoryProducts;

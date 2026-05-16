import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowRight, FaHeart, FaShoppingBag, FaTimes } from 'react-icons/fa';
import { useGlobal } from '../context/GlobalContext';
import Navbar from '../components/Navbar';
import { API_BASE } from '../config';
import '../styles/CollectionShowcase.css';

const FALLBACK_IMAGES = {
    Sarees: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80',
    Lehengas: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800&q=80',
    Dresses: 'https://images.unsplash.com/photo-1614179689702-355944cd0918?w=800&q=80',
    Tops: 'https://images.unsplash.com/photo-1603400521630-9f2de124b33b?w=800&q=80',
    Kurtis: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=800&q=80',
    Shirts: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&q=80',
    Pants: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&q=80',
    Jackets: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&q=80',
    Suits: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&q=80',
    'Boys Kurtas': 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800&q=80',
    'Boys Sherwanis': 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800&q=80',
    'Boys Suits': 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800&q=80',
    'Girls Lehengas': 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&q=80',
    'Girls Shararas': 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&q=80',
    'Girls Gowns': 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&q=80',
    default: 'https://images.unsplash.com/photo-1550614000-4b9519e0037a?w=800&q=80',
};

const getFallback = (subcategory, index) => {
    const keys = Object.keys(FALLBACK_IMAGES).filter(k => k !== 'default');
    return FALLBACK_IMAGES[subcategory] || FALLBACK_IMAGES[keys[index % keys.length]] || FALLBACK_IMAGES.default;
};

const generateMockProducts = (category, subcategory) => (
    Array.from({ length: 8 }).map((_, i) => ({
        _id: `mock-${category}-${subcategory}-${i}`,
        name: `${subcategory} Collection ${i + 1}`,
        brand: 'AWIK MAISON',
        price: 4500 + (i * 800),
        stock: i === 2 ? 2 : i === 5 ? 0 : 20,
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        images: [{ url: getFallback(subcategory, i) }]
    }))
);

const formatPrice = (price) => (
    new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(price)
);

// Derive a dynamic badge from product data
const getBadge = (product, index) => {
    if (product.stock === 0) return { label: 'Sold Out', color: '#555' };
    if (product.stock > 0 && product.stock <= 3) return { label: 'Low Stock', color: '#b45309' };
    if (product.isOnSale || product.comparePrice > product.price) return { label: 'Sale', color: '#991b1b' };
    if (product.isBestseller || product.soldCount > 50) return { label: 'Bestseller', color: '#1e3a5f' };
    // Treat the first few as "New"
    if (index < 3) return { label: 'New', color: '#1a3a2a' };
    return null;
};

const CategoryLandingPage = ({ category, initialSubcategories }) => {
    const navigate = useNavigate();
    const { addToCart, addToWishlist, wishlist } = useGlobal();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeSubcategory, setActiveSubcategory] = useState(initialSubcategories[0]);

    // Size picker mini-modal state
    const [sizePicker, setSizePicker] = useState(null); // { product, index } | null

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const { data } = await axios.get(`${API_BASE}/api/products?category=${category}&subcategory=${activeSubcategory}`);
                setProducts(data.products?.length ? data.products : generateMockProducts(category, activeSubcategory));
            } catch {
                setProducts(generateMockProducts(category, activeSubcategory));
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [category, activeSubcategory]);

    const handleQuickAdd = (e, product, index) => {
        e.stopPropagation();
        const hasSizes = product.sizes?.length > 0;
        if (hasSizes) {
            setSizePicker({ product, index });
        } else {
            confirmAddToCart(product, index, '');
        }
    };

    const confirmAddToCart = (product, index, size) => {
        addToCart({
            id: product._id,
            name: product.name,
            price: product.price,
            image: product.images?.[0]?.url || getFallback(activeSubcategory, index),
            size,
            quantity: 1,
        });
        setSizePicker(null);
    };

    const handleWishlist = (e, product, index) => {
        e.stopPropagation();
        addToWishlist({
            id: product._id,
            name: product.name,
            price: product.price,
            image: product.images?.[0]?.url || getFallback(activeSubcategory, index)
        });
    };

    return (
        <div className="collection-page">
            <Navbar />

            <header className="collection-hero">
                <div className="collection-kicker">AWIK SPECTRUM</div>
                <h1>{category} Collection</h1>
                <p>
                    A refined edit of ceremonial, everyday, and statement pieces selected for modern wardrobes.
                </p>

                <div className="collection-tabs" role="tablist" aria-label={`${category} subcategories`}>
                    {initialSubcategories.map((sub) => (
                        <button
                            key={sub}
                            type="button"
                            className={`collection-tab ${activeSubcategory === sub ? 'is-active' : ''}`}
                            onClick={() => setActiveSubcategory(sub)}
                            role="tab"
                            aria-selected={activeSubcategory === sub}
                        >
                            {sub}
                        </button>
                    ))}
                </div>
            </header>

            {loading ? (
                <div className="collection-loading">Loading collection</div>
            ) : (
                <section className="collection-grid" aria-label={`${activeSubcategory} products`}>
                    {products.map((product, index) => {
                        const badge = getBadge(product, index);
                        const isWishlisted = !!wishlist[product._id];
                        const outOfStock = product.stock === 0;
                        return (
                            <motion.article
                                key={product._id}
                                className="collection-card"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.45, delay: index * 0.045, ease: 'easeOut' }}
                                onClick={() => navigate(`/product/${product._id}`)}
                            >
                                <div className="collection-card-media">
                                    <img
                                        src={product.images?.[0]?.url || getFallback(activeSubcategory, index)}
                                        alt={product.name}
                                        onError={e => { e.target.onerror = null; e.target.src = getFallback(activeSubcategory, index); }}
                                        style={{ filter: outOfStock ? 'grayscale(60%) brightness(0.7)' : 'none' }}
                                    />
                                    {badge && (
                                        <span className="collection-card-badge" style={{ background: badge.color }}>
                                            {badge.label}
                                        </span>
                                    )}
                                    <div className="collection-card-actions">
                                        <button
                                            type="button"
                                            onClick={(e) => handleQuickAdd(e, product, index)}
                                            aria-label={`Add ${product.name} to bag`}
                                            disabled={outOfStock}
                                            style={{ opacity: outOfStock ? 0.4 : 1 }}
                                        >
                                            <FaShoppingBag />
                                            <span>{outOfStock ? 'Sold Out' : 'Add'}</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={(e) => handleWishlist(e, product, index)}
                                            aria-label={`Save ${product.name}`}
                                            style={{ color: isWishlisted ? '#C9A84C' : 'inherit' }}
                                        >
                                            <FaHeart />
                                        </button>
                                    </div>
                                </div>

                                <div className="collection-card-body">
                                    <span>{product.brand || 'AWIK MAISON'}</span>
                                    <h2>{product.name}</h2>
                                    <div className="collection-card-footer">
                                        <p>{formatPrice(product.price)}</p>
                                        <FaArrowRight aria-hidden="true" />
                                    </div>
                                </div>
                            </motion.article>
                        );
                    })}
                </section>
            )}

            {/* Size Picker Mini-Modal */}
            <AnimatePresence>
                {sizePicker && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSizePicker(null)}
                            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 1000 }}
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 20, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.97 }}
                            transition={{ duration: 0.25 }}
                            style={{
                                position: 'fixed', bottom: 0, left: 0, right: 0,
                                background: '#fff', zIndex: 1001, padding: '2rem',
                                borderRadius: '16px 16px 0 0', maxWidth: 480, margin: '0 auto',
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <div>
                                    <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.7rem', letterSpacing: '0.15em', color: '#999', textTransform: 'uppercase', marginBottom: 4 }}>Select Size</p>
                                    <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem', color: '#1a1a1a' }}>{sizePicker.product.name}</p>
                                </div>
                                <button onClick={() => setSizePicker(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999' }}>
                                    <FaTimes size={18} />
                                </button>
                            </div>
                            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                                {(sizePicker.product.sizes || ['XS', 'S', 'M', 'L', 'XL']).map(size => (
                                    <button
                                        key={size}
                                        onClick={() => confirmAddToCart(sizePicker.product, sizePicker.index, size)}
                                        style={{
                                            padding: '10px 20px', border: '1px solid #e0e0e0', background: 'transparent',
                                            fontFamily: 'var(--font-sans)', fontSize: '0.8rem', letterSpacing: '0.1em',
                                            cursor: 'pointer', transition: 'all 0.2s',
                                        }}
                                        onMouseOver={e => { e.target.style.background = '#1a1a1a'; e.target.style.color = '#fff'; }}
                                        onMouseOut={e => { e.target.style.background = 'transparent'; e.target.style.color = '#1a1a1a'; }}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.72rem', color: '#999', textAlign: 'center', letterSpacing: '0.05em' }}>
                                Or <button onClick={() => navigate(`/product/${sizePicker.product._id}`)} style={{ background: 'none', border: 'none', color: '#1a1a1a', cursor: 'pointer', textDecoration: 'underline', fontFamily: 'inherit', fontSize: 'inherit' }}>view full details</button> for more options
                            </p>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CategoryLandingPage;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useGlobal } from '../context/GlobalContext';
import { motion, AnimatePresence } from 'framer-motion';

import { API_BASE } from '../config';

const subcategories = ['Shirts', 'Pants', 'T-Shirts', 'Sweaters', 'Jackets'];

const MenTailoringPage = () => {
    const { addToCart, addToWishlist } = useGlobal();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeSubcategory, setActiveSubcategory] = useState('Shirts');
    const [hoveredProduct, setHoveredProduct] = useState(null);

    // Fetch Products when Active Subcategory changes
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                // Fetch products for category 'Men' and active subcategory
                // Using URL query params which our backend now supports
                const { data } = await axios.get(`${API_BASE}/api/products?category=Men&subcategory=${activeSubcategory}`);
                setProducts(data.products || []);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching products:", err);
                setProducts([]); // Fallback to empty
                setLoading(false);
            }
        };

        fetchProducts();
    }, [activeSubcategory]);

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
        // Feedback logic can be added here (toast/notification)
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
        <div style={{ paddingTop: '100px', paddingBottom: '100px', minHeight: '100vh', background: '#fff' }}>
            {/* Header Area */}
            <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                <h1 style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: '3.5rem',
                    color: '#1A1A1A',
                    marginBottom: '40px'
                }}>
                    Men's Collection
                </h1>

                {/* Subcategory Bar */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '40px',
                    borderBottom: '1px solid #f0f0f0',
                    paddingBottom: '20px',
                    width: 'fit-content',
                    margin: '0 auto'
                }}>
                    {subcategories.map((sub) => (
                        <button
                            key={sub}
                            onClick={() => setActiveSubcategory(sub)}
                            style={{
                                background: 'none',
                                border: 'none',
                                fontFamily: "'Playfair Display', serif",
                                fontSize: '1.1rem',
                                color: '#1A1A1A',
                                cursor: 'pointer',
                                paddingBottom: '5px',
                                borderBottom: activeSubcategory === sub ? '1px solid #000' : '1px solid transparent',
                                opacity: activeSubcategory === sub ? 1 : 0.6,
                                transition: 'all 0.3s ease'
                            }}
                        >
                            {sub}
                        </button>
                    ))}
                </div>
            </div>

            {/* Product Grid */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '100px', fontFamily: "'Inter', sans-serif" }}>Loading Collection...</div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', // Spacious grid
                    gap: '60px',
                    padding: '0 80px',
                    maxWidth: '1800px',
                    margin: '0 auto'
                }}>
                    {products.length === 0 ? (
                        <div style={{ gridColumn: '1/-1', textAlign: 'center', fontFamily: "'Inter', sans-serif" }}>
                            No items found in this category.
                        </div>
                    ) : (
                        products.map((product) => (
                            <motion.div
                                key={product._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                style={{ cursor: 'pointer' }}
                                onMouseEnter={() => setHoveredProduct(product._id)}
                                onMouseLeave={() => setHoveredProduct(null)}
                            >
                                {/* Image Container */}
                                <div style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden', marginBottom: '20px' }}>
                                    {/* Primary Image */}
                                    <img
                                        src={product.images[0]?.url}
                                        alt={product.name}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            transition: 'opacity 0.6s ease',
                                            opacity: hoveredProduct === product._id && product.images[1] ? 0 : 1
                                        }}
                                    />
                                    {/* Secondary Image (Lifestyle) - optional check */}
                                    {product.images[1] && (
                                        <img
                                            src={product.images[1]?.url}
                                            alt={product.name}
                                            style={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                                transition: 'opacity 0.6s ease',
                                                opacity: hoveredProduct === product._id ? 1 : 0
                                            }}
                                        />
                                    )}

                                    {/* Action Buttons Overlay */}
                                    <div style={{
                                        position: 'absolute',
                                        bottom: '20px',
                                        left: 0,
                                        width: '100%',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        gap: '15px',
                                        opacity: hoveredProduct === product._id ? 1 : 0,
                                        transition: 'opacity 0.4s ease',
                                        transform: hoveredProduct === product._id ? 'translateY(0)' : 'translateY(10px)'
                                    }}>
                                        <button
                                            onClick={(e) => handleAddToCart(e, product)}
                                            style={{
                                                background: '#fff',
                                                color: '#1A1A1A',
                                                border: 'none',
                                                padding: '12px 25px',
                                                fontFamily: "'Inter', sans-serif",
                                                textTransform: 'uppercase',
                                                fontSize: '0.75rem',
                                                letterSpacing: '0.1em',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            Add to Bag
                                        </button>
                                        <button
                                            onClick={(e) => handleWishlist(e, product)}
                                            style={{
                                                background: '#fff',
                                                color: '#1A1A1A',
                                                border: 'none',
                                                padding: '12px',
                                                cursor: 'pointer',
                                                fontFamily: "'Inter', sans-serif"
                                            }}
                                        >
                                            ♡
                                        </button>
                                    </div>
                                </div>

                                {/* Product Info */}
                                <div style={{ textAlign: 'center' }}>
                                    <h4 style={{
                                        fontFamily: "'Inter', sans-serif",
                                        fontSize: '0.7rem',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.2em',
                                        color: '#666',
                                        marginBottom: '8px'
                                    }}>
                                        MAISON
                                    </h4>
                                    <h3 style={{
                                        fontFamily: "'Playfair Display', serif",
                                        fontSize: '1.1rem',
                                        color: '#1A1A1A',
                                        marginBottom: '8px'
                                    }}>
                                        {product.name}
                                    </h3>
                                    <p style={{
                                        fontFamily: "'Inter', sans-serif",
                                        fontSize: '0.9rem',
                                        color: '#333'
                                    }}>
                                        {formatPrice(product.price)}
                                    </p>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default MenTailoringPage;

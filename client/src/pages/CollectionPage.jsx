import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useGlobal } from '../context/GlobalContext';
import { motion, AnimatePresence } from 'framer-motion';

const CollectionPage = () => {
    const { categoryId } = useParams();
    const { addToCart } = useGlobal();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hoveredProduct, setHoveredProduct] = useState(null);
    const [addedStates, setAddedStates] = useState({}); // Track 'Added' state per product

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Fetch products by category ID
                const { data } = await axios.get(`http://localhost:5000/api/products?category=${categoryId}`);
                // Simple client-side limit to 10 as per requirement if API doesn't support limit param yet
                setProducts(data.products.slice(0, 10));
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchProducts();
    }, [categoryId]);

    const handleAddToCart = (product) => {
        addToCart({
            id: product._id,
            name: product.name,
            price: product.price,
            image: product.images[0]?.url,
            quantity: 1
        });

        // Show feedback
        setAddedStates(prev => ({ ...prev, [product._id]: true }));
        setTimeout(() => {
            setAddedStates(prev => ({ ...prev, [product._id]: false }));
        }, 2000);
    };

    if (loading) return <div style={{ padding: '100px', textAlign: 'center' }}>Loading Collection...</div>;

    const gridStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', // Responsive
        gap: '40px',
        padding: '60px 80px',
        maxWidth: '1600px',
        margin: '0 auto'
    };

    // Media query handling would ideally be done in CSS, but inline responsive logic:
    // We'll rely on grid-template-columns auto-fill for responsiveness (Desktop ~3 cols, Tablet ~2, Mobile ~1)

    return (
        <div style={{ paddingTop: '100px', background: '#fff', minHeight: '100vh' }}>
            <h1 style={{
                fontFamily: "'Playfair Display', serif",
                textAlign: 'center',
                fontSize: '3rem',
                marginBottom: '60px',
                color: '#1A1A1A'
            }}>
                The Collection
            </h1>

            <div style={gridStyle} className="luxury-grid">
                {products.map((product) => (
                    <div
                        key={product._id}
                        style={{ position: 'relative', cursor: 'pointer' }}
                        onMouseEnter={() => setHoveredProduct(product._id)}
                        onMouseLeave={() => setHoveredProduct(null)}
                    >
                        <div style={{ overflow: 'hidden', aspectRatio: '3/4', position: 'relative' }}>
                            <motion.img
                                src={product.images[0]?.url}
                                alt={product.name}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                animate={{ scale: hoveredProduct === product._id ? 1.05 : 1 }}
                                transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
                            />

                            {/* Quick View Button Overlay */}
                            <AnimatePresence>
                                {hoveredProduct === product._id && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        style={{
                                            position: 'absolute',
                                            bottom: '20px',
                                            left: '0',
                                            width: '100%',
                                            display: 'flex',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        <button
                                            style={{
                                                background: 'rgba(255,255,255,0.95)',
                                                border: 'none',
                                                padding: '12px 30px',
                                                fontFamily: "'Inter', sans-serif",
                                                textTransform: 'uppercase',
                                                fontSize: '0.8rem',
                                                letterSpacing: '0.1em',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            Quick View
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div style={{ marginTop: '20px', textAlign: 'center' }}>
                            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', marginBottom: '8px' }}>
                                {product.name}
                            </h3>
                            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.9rem', color: '#666' }}>
                                ${product.price}
                            </p>

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleAddToCart(product);
                                }}
                                style={{
                                    marginTop: '15px',
                                    background: addedStates[product._id] ? '#1A1A1A' : '#1A1A1A',
                                    color: '#fff',
                                    border: 'none',
                                    padding: '12px 0',
                                    width: '100%',
                                    fontFamily: "'Inter', sans-serif",
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.1em',
                                    fontSize: '0.8rem',
                                    cursor: 'pointer',
                                    opacity: 1
                                }}
                            >
                                {addedStates[product._id] ? 'Added' : 'Add to Bag'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CollectionPage;

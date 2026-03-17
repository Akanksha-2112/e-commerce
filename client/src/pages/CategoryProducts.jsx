import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useGlobal } from '../context/GlobalContext';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';

// Mock Data Generator for Fallback
const generateMockProducts = (category, subcategory) => {
    return Array.from({ length: 10 }).map((_, i) => ({
        _id: `mock-${i}`,
        name: `Tailored ${subcategory === 'Shirts' ? 'Cotton' : 'Luxury'} ${subcategory.slice(0, -1)} ${i + 1}`,
        brand: 'MAISON',
        price: 12500 + (i * 1500),
        images: [
            { url: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=800' }, // Placeholder 1
            { url: 'https://images.unsplash.com/photo-1620799140408-ed5341cdb4f3?auto=format&fit=crop&q=80&w=800' }  // Placeholder 2
        ]
    }));
};

const CategoryProducts = ({ category }) => {
    const { subcategory } = useParams();
    const { addToCart } = useGlobal();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hoveredProduct, setHoveredProduct] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                // Fetch from real API
                const { data } = await axios.get(`https://e-commerce-2e5z.onrender.com/api/products?category=${category}&subcategory=${subcategory}`);

                if (data.products && data.products.length > 0) {
                    setProducts(data.products);
                } else {
                    // Fallback to Mock Data
                    console.log("Database empty for this route, using Mock Data");
                    setProducts(generateMockProducts(category, subcategory));
                }
                setLoading(false);
            } catch (err) {
                console.error("Error fetching products, using mock:", err);
                setProducts(generateMockProducts(category, subcategory));
                setLoading(false);
            }
        };

        fetchProducts();
    }, [category, subcategory]);

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

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: [0.33, 1, 0.68, 1] }
        }
    };

    return (
        <div style={{ paddingTop: '120px', paddingBottom: '100px', minHeight: '100vh', background: '#fff' }}>
            <Navbar />
            <div style={{ textAlign: 'center', marginBottom: '80px' }}>
                <h4 style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '0.9rem',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: '#666',
                    marginBottom: '15px'
                }}>
                    {category}
                </h4>
                <h1 style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: '3rem',
                    color: '#1A1A1A'
                }}>
                    {subcategory}
                </h1>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', paddingTop: '50px' }}>Loading Collection...</div>
            ) : (
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', // Spacious luxury grid
                        gap: '60px',
                        padding: '0 80px',
                        maxWidth: '1800px',
                        margin: '0 auto'
                    }}
                >
                    {products.map((product) => (
                        <motion.div
                            key={product._id}
                            variants={itemVariants}
                            onMouseEnter={() => setHoveredProduct(product._id)}
                            onMouseLeave={() => setHoveredProduct(null)}
                            style={{ cursor: 'pointer' }}
                        >
                            <div style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden', marginBottom: '25px', background: '#f9f9f9' }}>
                                {/* Main Image (with Hover Swap) */}
                                <img
                                    src={
                                        hoveredProduct === product._id && product.images[1]?.url
                                            ? product.images[1].url
                                            : product.images[0]?.url
                                    }
                                    alt={product.name}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        transition: 'transform 0.8s ease, opacity 0.3s ease',
                                        transform: hoveredProduct === product._id ? 'scale(1.05)' : 'scale(1)'
                                    }}
                                />

                                {/* Add to Bag Button Overlay */}
                                <AnimatePresence>
                                    {hoveredProduct === product._id && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            transition={{ duration: 0.3 }}
                                            style={{
                                                position: 'absolute',
                                                bottom: '20px',
                                                left: 0,
                                                width: '100%',
                                                textAlign: 'center'
                                            }}
                                        >
                                            <button
                                                onClick={(e) => handleAddToCart(e, product)}
                                                style={{
                                                    background: '#1A1A1A',
                                                    color: '#fff',
                                                    border: 'none',
                                                    padding: '14px 40px',
                                                    fontFamily: "'Inter', sans-serif",
                                                    textTransform: 'uppercase',
                                                    fontSize: '0.8rem',
                                                    letterSpacing: '0.15em',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                Add to Bag
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <div style={{ textAlign: 'center' }}>
                                <div style={{
                                    fontFamily: "'Inter', sans-serif",
                                    fontSize: '0.75rem',
                                    letterSpacing: '0.1em',
                                    textTransform: 'uppercase',
                                    color: '#888',
                                    marginBottom: '8px'
                                }}>
                                    {product.brand || 'MAISON'}
                                </div>
                                <h3 style={{
                                    fontFamily: "'Playfair Display', serif",
                                    fontSize: '1.25rem',
                                    color: '#1A1A1A',
                                    marginBottom: '8px'
                                }}>
                                    {product.name}
                                </h3>
                                <div style={{
                                    fontFamily: "'Inter', sans-serif",
                                    fontSize: '0.95rem',
                                    color: '#333'
                                }}>
                                    {formatPrice(product.price)}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </div>
    );
};

export default CategoryProducts;

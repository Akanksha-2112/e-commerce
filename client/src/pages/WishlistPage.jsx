import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGlobal } from '../context/GlobalContext';
import Navbar from '../components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTrash, FaShoppingBag, FaArrowRight } from 'react-icons/fa';

const FALLBACK = [
    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80',
    'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600&q=80',
    'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=600&q=80',
    'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=600&q=80',
];

const WishlistPage = () => {
    const navigate = useNavigate();
    const { wishlist, toggleWishlist, addToCart, removeFromWishlist, toggleCart } = useGlobal();
    const wishlistItems = Object.values(wishlist);

    const formatPrice = p => new Intl.NumberFormat('en-IN', {
        style: 'currency', currency: 'INR', maximumFractionDigits: 0,
    }).format(p);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div style={{ minHeight: '100vh', background: '#0c0c0e', color: '#fff', fontFamily: "var(--awik-font-sans, 'Inter', sans-serif)" }}>
            <Navbar />

            {/* Header */}
            <header style={{ 
                paddingTop: '160px', 
                paddingBottom: '80px', 
                textAlign: 'center', 
                background: 'linear-gradient(to bottom, #111, #0c0c0e)',
                borderBottom: '1px solid rgba(255,255,255,0.05)'
            }}>
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <span style={{ 
                        display: 'block', 
                        fontSize: '0.75rem', 
                        letterSpacing: '0.3em', 
                        textTransform: 'uppercase', 
                        color: '#C9A84C', 
                        marginBottom: '1rem',
                        fontWeight: 600
                    }}>
                        PRIVATE SELECTION
                    </span>
                    <h1 style={{ 
                        fontFamily: "var(--awik-font-display, 'Bebas Neue', sans-serif)", 
                        fontSize: 'clamp(3rem, 10vw, 7rem)', 
                        color: '#fff', 
                        lineHeight: 0.85, 
                        margin: 0,
                        letterSpacing: '-0.02em'
                    }}>
                        YOUR WISHLIST
                    </h1>
                    <div style={{ 
                        width: '40px', 
                        height: '1px', 
                        background: '#C9A84C', 
                        margin: '2rem auto' 
                    }} />
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem', letterSpacing: '0.05em' }}>
                        {wishlistItems.length} {wishlistItems.length === 1 ? 'OBJECT' : 'OBJECTS'} RESERVED
                    </p>
                </motion.div>
            </header>

            <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 4vw' }}>
                {wishlistItems.length === 0 ? (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{ textAlign: 'center', padding: '100px 20px' }}
                    >
                        <div style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.2)', marginBottom: '2rem' }}>— NO SELECTION FOUND —</div>
                        <button
                            onClick={() => navigate('/men')}
                            style={{ 
                                background: 'transparent', 
                                color: '#C9A84C', 
                                border: '1px solid #C9A84C', 
                                padding: '1.2rem 3rem', 
                                cursor: 'pointer', 
                                fontSize: '0.7rem', 
                                fontWeight: 700, 
                                letterSpacing: '0.2em', 
                                textTransform: 'uppercase', 
                                transition: 'all 0.3s ease',
                                borderRadius: '0'
                            }}
                            onMouseOver={(e) => { e.target.style.background = '#C9A84C'; e.target.style.color = '#000'; }}
                            onMouseOut={(e) => { e.target.style.background = 'transparent'; e.target.style.color = '#C9A84C'; }}
                        >
                            DISCOVER COLLECTIONS
                        </button>
                    </motion.div>
                ) : (
                    <motion.div 
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                            gap: '40px',
                            padding: '60px 0'
                        }}
                    >
                        <AnimatePresence>
                            {wishlistItems.map((item, index) => (
                                <motion.div 
                                    key={item.id}
                                    variants={itemVariants}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    layout
                                    style={{ 
                                        position: 'relative',
                                        background: 'rgba(255,255,255,0.02)',
                                        border: '1px solid rgba(255,255,255,0.05)',
                                        overflow: 'hidden'
                                    }}
                                >
                                    {/* Product Image */}
                                    <div 
                                        style={{ position: 'relative', aspectRatio: '4/5', overflow: 'hidden', cursor: 'pointer' }}
                                        onClick={() => navigate(`/product/${item.id}`)}
                                    >
                                        <img
                                            src={item.image || FALLBACK[index % FALLBACK.length]}
                                            alt={item.name}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.8s cubic-bezier(0.2, 0, 0.2, 1)' }}
                                            onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                                            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                                        />
                                        
                                        {/* Remove Button */}
                                        <button
                                            onClick={(e) => { e.stopPropagation(); toggleWishlist(item); }}
                                            style={{
                                                position: 'absolute', top: '20px', right: '20px',
                                                background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)',
                                                color: '#fff', width: '40px', height: '40px',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                cursor: 'pointer', backdropFilter: 'blur(10px)',
                                                transition: 'all 0.3s ease',
                                                zIndex: 10
                                            }}
                                            onMouseOver={(e) => { e.target.style.background = '#EF4444'; e.target.style.borderColor = '#EF4444'; }}
                                            onMouseOut={(e) => { e.target.style.background = 'rgba(0,0,0,0.4)'; e.target.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                                            title="Remove from wishlist"
                                        >
                                            <FaTrash size={14} />
                                        </button>
                                    </div>

                                    {/* Content */}
                                    <div style={{ padding: '24px' }}>
                                        <div style={{ 
                                            fontSize: '0.65rem', 
                                            color: '#C9A84C', 
                                            letterSpacing: '0.2em', 
                                            textTransform: 'uppercase', 
                                            marginBottom: '8px',
                                            fontWeight: 700
                                        }}>
                                            {item.brand || 'AWIK SPECTRUM'}
                                        </div>
                                        <div style={{ 
                                            display: 'flex', 
                                            justifyContent: 'space-between', 
                                            alignItems: 'flex-start',
                                            marginBottom: '20px'
                                        }}>
                                            <h3 style={{ 
                                                fontSize: '1.1rem', 
                                                fontWeight: 500, 
                                                color: '#fff', 
                                                margin: 0,
                                                letterSpacing: '0.02em',
                                                fontFamily: "var(--awik-font-serif, 'Playfair Display', serif)"
                                            }}>
                                                {item.name}
                                            </h3>
                                            <span style={{ fontSize: '1rem', color: '#fff', fontWeight: 600 }}>
                                                {formatPrice(item.price)}
                                            </span>
                                        </div>

                                        <div style={{ display: 'flex', gap: '1px', background: 'rgba(255,255,255,0.1)' }}>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    addToCart({ ...item, quantity: 1 });
                                                    removeFromWishlist(item.id);
                                                    toggleCart(true);
                                                }}
                                                style={{
                                                    flex: 3,
                                                    background: '#fff', 
                                                    color: '#000', 
                                                    border: 'none', 
                                                    padding: '14px',
                                                    fontSize: '0.7rem', 
                                                    fontWeight: 700, 
                                                    letterSpacing: '0.15em', 
                                                    textTransform: 'uppercase',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '10px'
                                                }}
                                            >
                                                <FaShoppingBag size={12} />
                                                Move to Bag
                                            </button>
                                            <button
                                                onClick={() => navigate(`/product/${item.id}`)}
                                                style={{
                                                    flex: 1,
                                                    background: 'rgba(255,255,255,0.05)', 
                                                    color: '#fff', 
                                                    border: 'none', 
                                                    padding: '14px',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}
                                            >
                                                <FaArrowRight size={12} />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}
            </main>

            <footer style={{ padding: '80px 4vw', textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: '0.7rem', letterSpacing: '0.1em' }}>
                © {new Date().getFullYear()} AWIK SPECTRUM ATELIER · ALL RIGHTS RESERVED
            </footer>
        </div>
    );
};

export default WishlistPage;

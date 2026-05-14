import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGlobal } from '../context/GlobalContext';
import Navbar from '../components/Navbar';

const FALLBACK = [
    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80',
    'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600&q=80',
    'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=600&q=80',
    'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=600&q=80',
];

const WishlistPage = () => {
    const navigate = useNavigate();
    const { wishlist, toggleWishlist } = useGlobal();
    const wishlistItems = Object.values(wishlist);

    const formatPrice = p => new Intl.NumberFormat('en-IN', {
        style: 'currency', currency: 'INR', maximumFractionDigits: 0,
    }).format(p);

    return (
        <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', fontFamily: "'Inter', sans-serif" }}>
            <Navbar />

            {/* Header */}
            <div style={{ paddingTop: '120px', textAlign: 'center', marginBottom: '3rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '2rem' }}>
                <p style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '0.6rem' }}>AWIK SPECTRUM</p>
                <h1 style={{ fontFamily: "'Anton', 'Impact', sans-serif", fontSize: 'clamp(2.5rem, 6vw, 5rem)', color: '#fff', lineHeight: 0.9, letterSpacing: '0.02em' }}>
                    YOUR WISHLIST
                </h1>
                <p style={{ marginTop: '1rem', color: '#555', fontSize: '0.8rem', letterSpacing: '0.1em' }}>
                    {wishlistItems.length} {wishlistItems.length === 1 ? 'PIECE' : 'PIECES'} SAVED
                </p>
            </div>

            {wishlistItems.length === 0 ? (
                /* Empty State */
                <div style={{ textAlign: 'center', padding: '6rem 2rem' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1.5rem', opacity: 0.2 }}>♡</div>
                    <h2 style={{ fontFamily: "'Anton', 'Impact', sans-serif", fontSize: '2rem', color: '#fff', marginBottom: '1rem', letterSpacing: '0.05em' }}>
                        YOUR SELECTION IS EMPTY
                    </h2>
                    <p style={{ color: '#555', fontSize: '0.85rem', marginBottom: '2.5rem', lineHeight: 1.7 }}>
                        Explore our collections and save pieces you love.
                    </p>
                    <button
                        onClick={() => navigate('/women')}
                        style={{ background: '#fff', color: '#0a0a0a', border: 'none', padding: '0.9rem 2.5rem', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', transition: 'background 0.25s' }}
                    >
                        Explore Collections
                    </button>
                </div>
            ) : (
                /* Product Grid */
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '1px', background: 'rgba(255,255,255,0.06)',
                    maxWidth: '1400px', margin: '0 auto',
                }}>
                    {wishlistItems.map((item, index) => (
                        <div key={item.id}
                            style={{ background: '#0a0a0a', cursor: 'pointer', overflow: 'hidden', position: 'relative' }}
                            onClick={() => navigate(`/product/${item.id}`)}
                        >
                            {/* Image */}
                            <div style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden' }}>
                                <img
                                    src={item.image || FALLBACK[index % FALLBACK.length]}
                                    alt={item.name}
                                    onError={e => { e.target.onerror = null; e.target.src = FALLBACK[index % FALLBACK.length]; }}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.85)', transition: 'transform 0.6s ease' }}
                                />
                                {/* Remove from wishlist */}
                                <button
                                    onClick={e => { e.stopPropagation(); toggleWishlist(item); }}
                                    style={{
                                        position: 'absolute', top: '0.75rem', right: '0.75rem',
                                        background: 'rgba(10,10,10,0.7)', border: '1px solid rgba(255,255,255,0.2)',
                                        color: '#fff', width: '36px', height: '36px', borderRadius: '50%',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        cursor: 'pointer', fontSize: '1rem', backdropFilter: 'blur(8px)',
                                        transition: 'background 0.2s',
                                    }}
                                    title="Remove from wishlist"
                                >♥</button>
                            </div>

                            {/* Info */}
                            <div style={{ padding: '0.9rem 1rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                                <span style={{ fontSize: '0.6rem', color: '#555', letterSpacing: '0.14em', textTransform: 'uppercase', display: 'block', marginBottom: '0.3rem' }}>AWIK MAISON</span>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#e8e8e8' }}>{item.name}</span>
                                    <span style={{ color: '#555' }}>↗</span>
                                </div>
                                <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.25rem' }}>{formatPrice(item.price)}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div style={{ height: '4rem' }} />
        </div>
    );
};

export default WishlistPage;

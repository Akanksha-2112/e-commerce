import React, { useState } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useGlobal } from '../../context/GlobalContext';
import '../../styles/PremiumTheme.css';

const ProductCard = ({ product, isWishlistMode = false, currency = '$' }) => {
    const { wishlist, toggleWishlist, addToCart, removeFromWishlist, toggleCart } = useGlobal();
    const isWishlisted = !!wishlist[product.id];
    const [isAdded, setIsAdded] = useState(false);

    const handleHeartClick = (e) => {
        e.stopPropagation();
        toggleWishlist(product);
    };

    const handleAddToCart = (e) => {
        e.stopPropagation();
        addToCart(product);
        setIsAdded(true);
        toggleCart(true); // Open cart drawer
        setTimeout(() => setIsAdded(false), 2000);
    };

    const handleRemove = (e) => {
        e.stopPropagation();
        removeFromWishlist(product.id);
    };

    return (
        <div className="premium-card">
            <div className="premium-image-container">
                <img src={product.image} alt={product.name} className="premium-image" />

                {/* Heart Icon - Top Right */}
                <button
                    className={`premium-heart ${isWishlisted ? 'active' : ''}`}
                    onClick={handleHeartClick}
                >
                    {isWishlisted ? (
                        <FaHeart color="#0a0a0a" size={20} /> // Obsidian Black
                    ) : (
                        <FaRegHeart color="#fff" size={20} style={{ filter: 'drop-shadow(0 0 2px rgba(0,0,0,0.3))' }} />
                    )}
                </button>

                {/* Hover Reveal Overlay - Bottom 20% */}
                {!isWishlistMode && (
                    <div className="premium-card-overlay">
                        <div className="premium-overlay-actions">
                            <button
                                className="premium-action-btn"
                                onClick={handleAddToCart}
                            >
                                {isAdded ? 'ADDED' : 'ADD TO BAG'}
                            </button>
                            <div className="premium-action-divider"></div>
                            <button className="premium-action-btn">
                                BUY NOW
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div className="premium-info">
                <div className="premium-title">{product.name}</div>
                <div className="premium-price">{currency}{product.price.toLocaleString()}</div>
            </div>

            {isWishlistMode && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginTop: '10px' }}>
                    <button className="premium-btn" style={{ border: '1px solid #fff', padding: '10px 20px' }} onClick={handleAddToCart}>
                        MOVE TO BAG
                    </button>
                    <button className="premium-remove" onClick={handleRemove}>
                        Remove
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProductCard;

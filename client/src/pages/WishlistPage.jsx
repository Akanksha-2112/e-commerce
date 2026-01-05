import React from 'react';
import { useGlobal } from '../context/GlobalContext';
import ProductCard from '../components/common/ProductCard';
import '../styles/PremiumTheme.css';

const WishlistPage = () => {
    const { wishlist } = useGlobal();
    const wishlistItems = Object.values(wishlist);

    return (
        <div className="premium-page">
            <h1 className="premium-header">
                Your Curated Selection ({wishlistItems.length} Items)
            </h1>

            {wishlistItems.length === 0 ? (
                <div style={{ textAlign: 'center', marginTop: '50px', fontFamily: 'var(--font-sans)', color: '#666' }}>
                    Your selection is empty. Explore our collections to curate your style.
                </div>
            ) : (
                <div className="premium-grid-2">
                    {wishlistItems.map(item => (
                        <ProductCard key={item.id} product={item} isWishlistMode={true} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default WishlistPage;

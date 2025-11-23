import React, { useState } from 'react';
import sareeImg from '../assets/products/saree1.jpg'; // Use your image
import { FiHeart, FiShoppingBag } from 'react-icons/fi';
import '../styles/ProductGrid.css';

const products = [
  {
    id: 1,
    name: 'AWIK Festive Saree',
    image: sareeImg,
    desc: 'Elegant golden woven saree, perfect for festive occasions.',
    price: 2999,
  },
  // ...add more saree products if needed
];

const SareePage = () => {
  const [wishlist, setWishlist] = useState({});
  const [cart, setCart] = useState({});

  const toggleWishlist = id => setWishlist(prev => ({ ...prev, [id]: !prev[id] }));
  const addToCart = id => setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));

  return (
    <div className="product-grid-section">
      <h2>Saree Collection</h2>
      <div className="product-grid">
        {products.map(product => (
          <div className="product-card" key={product.id}>
            <img src={product.image} alt={product.name} className="product-image" />
            <h3 className="product-title">{product.name}</h3>
            <div className="product-desc">{product.desc}</div>
            <div className="product-meta">
              <span className="product-price">₹{product.price}</span>
              <button
                className={`wishlist-btn ${wishlist[product.id] ? 'wished' : ''}`}
                onClick={() => toggleWishlist(product.id)}
                aria-label="Toggle wishlist"
              >
                <FiHeart />
              </button>
            </div>
            <button className="cart-btn" onClick={() => addToCart(product.id)}>
              <FiShoppingBag style={{ marginRight: '8px' }} />
              {cart[product.id] ? 'In Cart' : 'Add to Cart'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SareePage;

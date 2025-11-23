import React, { useState } from 'react';
import { FiHeart, FiShoppingBag } from 'react-icons/fi';
import '../styles/ProductGrid.css';

const girlsImg = "https://via.placeholder.com/300x250?text=Kids+Girls";
const products = [
  {
    id: 1,
    name: "Girls' Festive Frock",
    image: girlsImg,
    desc: "Colorful traditional frock for girls, perfect for celebrations.",
    price: 1199,
  },
  {
    id: 2,
    name: "Casual T-Shirt & Skirt Set",
    image: girlsImg,
    desc: "Comfortable and stylish, for all-day play.",
    price: 799,
  }
];

const KidsGirlsPage = () => {
  const [wishlist, setWishlist] = useState({});
  const [cart, setCart] = useState({});

  const toggleWishlist = id => setWishlist(prev => ({ ...prev, [id]: !prev[id] }));
  const addToCart = id => setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));

  return (
    <div className="product-grid-section">
      <h2>Kids - Girls Collection</h2>
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

export default KidsGirlsPage;

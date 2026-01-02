import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import { ProductContext } from '../context/ProductContext';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import '../styles/ProductDetails.css';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');

  const { fetchProductById } = useContext(ProductContext);
  const { addToCart } = useContext(CartContext);
  const { addToRecentlyViewed } = useContext(AuthContext);

  useEffect(() => {
    const loadProduct = async () => {
      const data = await fetchProductById(id);
      setProduct(data);
      if (data?.sizes?.length > 0) setSelectedSize(data.sizes[0]);
      if (data?.colors?.length > 0) setSelectedColor(data.colors[0]);

      // Add to recently viewed
      if (data) {
        addToRecentlyViewed(id);
      }
    };
    loadProduct();
  }, [id, addToRecentlyViewed]);

  const handleAddToCart = async () => {
    if (!selectedSize || !selectedColor) {
      setMessage('Please select size and color');
      return;
    }

    const result = await addToCart(product._id, quantity, selectedSize, selectedColor);
    if (result.success) {
      setMessage('Added to cart successfully!');
      setTimeout(() => setMessage(''), 3000);
    } else {
      setMessage(result.message);
    }
  };

  if (!product) return <div>Loading...</div>;

  return (
    <div className="product-detail-page">
      <Navbar />

      <div className="product-detail-container">
        <div className="product-images">
          <img src={product.images[0]?.url || '/placeholder.jpg'} alt={product.name} />
        </div>

        <div className="product-details">
          <h1>{product.name}</h1>
          <p className="price">₹{product.price}</p>
          <p className="description">{product.description}</p>

          <div className="product-options">
            <div className="size-selector">
              <label>Size:</label>
              <div className="size-buttons">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    className={selectedSize === size ? 'active' : ''}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="color-selector">
              <label>Color:</label>
              <div className="color-buttons">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    className={selectedColor === color ? 'active' : ''}
                    onClick={() => setSelectedColor(color)}
                    style={{ backgroundColor: color.toLowerCase() }}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            <div className="quantity-selector">
              <label>Quantity:</label>
              <input
                type="number"
                min="1"
                max={product.stock}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              />
            </div>
          </div>

          <button className="add-to-cart-btn" onClick={handleAddToCart}>
            Add to Cart
          </button>

          {message && <div className="message">{message}</div>}

          <div className="product-meta">
            <p><strong>Stock:</strong> {product.stock} available</p>
            <p><strong>Category:</strong> {product.category}</p>
            <p><strong>Rating:</strong> {product.ratings} / 5</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;

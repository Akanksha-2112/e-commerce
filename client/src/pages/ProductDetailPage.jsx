import React, { useState, useEffect, useContext, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaChevronDown,
  FaMinus,
  FaPlus,
  FaTruck,
  FaUndo,
  FaShieldAlt,
  FaArrowLeft,
} from 'react-icons/fa';

import { AuthContext } from '../context/AuthContext';
import { useGlobal } from '../context/GlobalContext';
import { API_BASE } from '../config';
import '../styles/ProductDetailLuxury.css';

// Tiny helper – normalise colour names to a CSS swatch background.
const colorToCss = (name = '') => {
  const map = {
    crimson: '#a52a2a',
    navy: '#0e1a3d',
    black: '#000',
    ivory: '#f7f3e9',
    cream: '#efe7d3',
    gold: '#d4af37',
    red: '#b91c1c',
    burgundy: '#5b1f24',
    emerald: '#0e7c5f',
    royal: '#0a2472',
    teal: '#0d6e6e',
    silver: '#c0c0c0',
    standard: '#1a1a1a',
  };
  return map[name.toLowerCase()] || name.toLowerCase() || '#1a1a1a';
};

const formatPrice = (price) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price ?? 0);

// Fallback images by category so broken Cloudinary URLs never show a black box
const FALLBACKS = [
  'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=900&q=80',
  'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=900&q=80',
  'https://images.unsplash.com/photo-1614179689702-355944cd0918?w=900&q=80',
  'https://images.unsplash.com/photo-1603400521630-9f2de124b33b?w=900&q=80',
];
const getFallback = (idx = 0) => FALLBACKS[idx % FALLBACKS.length];

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { user, addToRecentlyViewed } = useContext(AuthContext);
  const { addToCart, toggleCart, toggleWishlist, wishlist, toggleSidebar } = useGlobal();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [openAcc, setOpenAcc] = useState('details');
  const [toast, setToast] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // ---------- Fetch product ----------
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await axios.get(`${API_BASE}/api/products/${id}`);
        if (cancelled) return;
        setProduct(data);
        setSelectedSize(data?.sizes?.[0] || '');
        setSelectedColor(data?.colors?.[0] || '');
        setActiveImage(0);
        setQuantity(1);

        // Track recently viewed (silently)
        if (user) addToRecentlyViewed(data._id);

        // Fetch related from the same category
        if (data?.category) {
          axios
            .get(`${API_BASE}/api/products`, {
              params: { category: data.category, limit: 8 },
            })
            .then((res) => {
              if (cancelled) return;
              const list = (res.data?.products || []).filter((p) => p._id !== data._id);
              setRelated(list.slice(0, 4));
            })
            .catch(() => {
              /* non-fatal */
            });
        }
      } catch (err) {
        if (cancelled) return;
        setError(err?.response?.data?.message || 'Product not found');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    window.scrollTo({ top: 0, behavior: 'instant' });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // ---------- Derived values ----------
  const images = useMemo(() => {
    if (!product?.images?.length) {
      return [{ url: 'https://placehold.co/800x1000/0a0a0a/d4af37?text=AWIK+SPECTRUM' }];
    }
    return product.images;
  }, [product]);

  const isWishlisted = !!(product && wishlist[product._id]);

  const stockState = useMemo(() => {
    if (!product) return null;
    if (product.stock <= 0) return { kind: 'out', label: 'Currently Unavailable' };
    if (product.stock <= 3)
      return { kind: 'low', label: `Only ${product.stock} remaining in the atelier` };
    return { kind: 'ok', label: 'Reserved in atelier · ships in 3 days' };
  }, [product]);

  const canAdd =
    product &&
    product.stock > 0 &&
    (!product.sizes?.length || selectedSize) &&
    (!product.colors?.length || selectedColor);

  // ---------- Actions ----------
  const handleAddToBag = async () => {
    if (!canAdd) return;
    await addToCart(
      {
        id: product._id,
        name: product.name,
        price: product.price,
        image: product.images?.[0]?.url,
        size: selectedSize,
        color: selectedColor,
      },
      quantity
    );
    setToast(`${quantity} × ${product.name.toUpperCase()} added to bag`);
    setTimeout(() => setToast(''), 3500);
    toggleCart(true);
  };

  const handleWishlist = () => {
    if (!product) return;
    toggleWishlist({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.images?.[0]?.url,
    });
  };

  // ---------- Loading / Error states ----------
  if (loading) {
    return (
      <div className="pdl-loading">
        <div>Retrieving sovereign archives</div>
        <div className="pdl-loading-bar" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="pdl-error">
        <h2>The piece you seek is unavailable.</h2>
        <p>{error || 'Please return to the collection.'}</p>
        <Link to="/">Return to Maison</Link>
      </div>
    );
  }

  // ---------- Render ----------
  return (
    <div className="pdl-page">
      {/* Reuse existing global header pattern */}
      <header className="vertical-header">
        <img
          src={require('../assets/logo.png')}
          alt="AWIK SPECTRUM"
          className="header-logo"
          onClick={() => navigate('/')}
        />
        <button className="menu-trigger" onClick={() => toggleSidebar(true)} aria-label="Open menu">
          <span className="menu-line" />
          <span className="menu-line" />
          <span className="menu-line" />
        </button>
      </header>

      {/* Utility row */}
      <div className="pdl-utility">
        <div className="pdl-breadcrumb">
          <button onClick={() => navigate('/')}>Maison</button>
          <span className="sep">·</span>
          <span>{product.subcategory || 'Collection'}</span>
          <span className="sep">·</span>
          <span style={{ color: '#f2e8c9' }}>{product.name}</span>
        </div>
        <button className="pdl-back" onClick={() => navigate(-1)} data-testid="pdl-back-btn">
          <FaArrowLeft size={10} style={{ marginRight: 10, verticalAlign: 'middle' }} />
          Return
        </button>
      </div>

      {/* HERO */}
      <motion.section
        className="pdl-hero"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Gallery - IWC Style Full Left Column */}
        <div className="pdl-gallery">

          <div className="pdl-main-image-wrap">
            <AnimatePresence mode="wait">
              <motion.img
                key={activeImage}
                src={images[activeImage]?.url || getFallback(activeImage)}
                alt={product.name}
                className="pdl-main-image"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                onError={e => { e.target.onerror = null; e.target.src = getFallback(activeImage); }}
                data-testid="pdl-main-image"
              />
            </AnimatePresence>
            <div className="pdl-zoom-label">Hover · Zoom</div>
          </div>
        </div>

        {/* INFO */}
        <div className="pdl-info">
          <div className="pdl-brand">AWIK SPECTRUM · {product.subcategory || 'Atelier'}</div>
          <h1 className="pdl-name" data-testid="pdl-product-name">
            {product.name}
          </h1>

          <div className="pdl-price-row">
            <div className="pdl-price" data-testid="pdl-product-price">
              {formatPrice(product.price)}
            </div>
            <div className="pdl-sku">Ref · {product.sku || product._id?.slice(-8)}</div>
          </div>

          <p className="pdl-description">{product.description}</p>

          {/* IWC Style Horizontal Thumbnails */}
          <div className="pdl-thumb-row">
            {images.map((img, i) => (
              <img
                key={i}
                src={img.url || getFallback(i)}
                alt={`${product.name} ${i + 1}`}
                className={`pdl-thumb-horiz ${i === activeImage ? 'is-active' : ''}`}
                onClick={() => setActiveImage(i)}
                onError={e => { e.target.onerror = null; e.target.src = getFallback(i); }}
              />
            ))}
          </div>

          {/* Size selector */}
          {product.sizes?.length > 0 && (
            <div className="pdl-selector">
              <div className="pdl-selector-head">
                <span className="pdl-label">Size</span>
                <span className="pdl-label-value">{selectedSize}</span>
              </div>
              <div className="pdl-size-grid">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    className={`pdl-size-btn ${selectedSize === s ? 'is-active' : ''}`}
                    onClick={() => setSelectedSize(s)}
                    data-testid={`pdl-size-${s}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color selector */}
          {product.colors?.length > 0 && (
            <div className="pdl-selector">
              <div className="pdl-selector-head">
                <span className="pdl-label">Colour</span>
                <span className="pdl-label-value">{selectedColor}</span>
              </div>
              <div className="pdl-colors">
                {product.colors.map((c) => (
                  <button
                    key={c}
                    title={c}
                    aria-label={c}
                    className={`pdl-color ${selectedColor === c ? 'is-active' : ''}`}
                    style={{ background: colorToCss(c) }}
                    onClick={() => setSelectedColor(c)}
                    data-testid={`pdl-color-${c}`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="pdl-selector">
            <div className="pdl-selector-head">
              <span className="pdl-label">Quantity</span>
            </div>
            <div className="pdl-quantity">
              <button
                className="pdl-qty-btn"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
                data-testid="pdl-qty-decrease"
              >
                <FaMinus size={10} />
              </button>
              <div className="pdl-qty-value" data-testid="pdl-qty-value">
                {quantity}
              </div>
              <button
                className="pdl-qty-btn"
                onClick={() => setQuantity((q) => Math.min(product.stock || 99, q + 1))}
                disabled={quantity >= (product.stock || 99)}
                aria-label="Increase quantity"
                data-testid="pdl-qty-increase"
              >
                <FaPlus size={10} />
              </button>
            </div>
          </div>

          {/* Actions - IWC Style Side-by-Side */}
          <div className="pdl-actions-row">
            <button
              className={`pdl-btn pdl-btn-secondary${isWishlisted ? ' pdl-btn-wishlisted' : ''}`}
              onClick={handleWishlist}
              data-testid="pdl-wishlist-btn"
              style={isWishlisted ? { borderColor: '#C9A84C', color: '#C9A84C' } : {}}
            >
              {isWishlisted ? '♥ Saved to Wishlist' : '♡ Add to Wishlist'}
            </button>
            <button
              className="pdl-btn pdl-btn-primary"
              onClick={handleAddToBag}
              disabled={!canAdd}
              data-testid="pdl-add-to-bag-btn"
            >
              {product.stock <= 0 ? 'Sold Out' : 'Enquire Now'}
            </button>
          </div>

          {/* Stock + shipping reassurance */}
          <div className="pdl-meta-row">
            <div className="pdl-meta">
              <span className="pdl-stock-indicator">
                <span className={`pdl-stock-dot is-${stockState.kind}`} />
                {stockState.label}
              </span>
            </div>
            <div className="pdl-meta">
              <FaTruck size={14} />
              Complimentary shipping on orders above ₹5,000
            </div>
            <div className="pdl-meta">
              <FaUndo size={14} />
              14-day private exchange · concierge assisted
            </div>
            <div className="pdl-meta">
              <FaShieldAlt size={14} />
              Authentic. Each piece carries the maison's signature.
            </div>
          </div>
        </div>
      </motion.section>

      {/* Accordion */}
      <section className="pdl-accordion">
        <div className="pdl-acc-title">The Particulars</div>

        {[
          {
            key: 'details',
            title: 'Details & Craftsmanship',
            body: (
              <ul>
                <li>{product.description}</li>
                {product.subcategory && <li>Silhouette · {product.subcategory}</li>}
                {product.sizes?.length > 0 && <li>Sizes · {product.sizes.join(' · ')}</li>}
                {product.colors?.length > 0 && <li>Available in · {product.colors.join(' · ')}</li>}
                <li>Crafted in India · hand-finished by master artisans.</li>
              </ul>
            ),
          },
          {
            key: 'fabric',
            title: 'Fabric & Care',
            body: (
              <ul>
                <li>Materials selected from heritage Indian weavers.</li>
                <li>Dry-clean only · entrust to specialist atelier.</li>
                <li>Store on padded hanger, away from direct light.</li>
                <li>Each piece is reviewed twice before despatch.</li>
              </ul>
            ),
          },
          {
            key: 'shipping',
            title: 'Shipping & Returns',
            body: (
              <ul>
                <li>Complimentary white-glove delivery on orders ₹5,000+.</li>
                <li>Standard despatch within 3 business days.</li>
                <li>14-day exchange window · custom orders excluded.</li>
                <li>Concierge assistance available on request.</li>
              </ul>
            ),
          },
        ].map((item) => {
          const isOpen = openAcc === item.key;
          return (
            <div className="pdl-acc-item" key={item.key}>
              <button
                className="pdl-acc-head"
                onClick={() => setOpenAcc(isOpen ? '' : item.key)}
                data-testid={`pdl-acc-${item.key}`}
              >
                {item.title}
                <FaChevronDown className={`pdl-acc-icon ${isOpen ? 'is-open' : ''}`} />
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div className="pdl-acc-body">{item.body}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="pdl-related">
          <div className="pdl-related-head">
            <div className="pdl-related-eyebrow">Pair With</div>
            <div className="pdl-related-title">The House Recommends</div>
          </div>
          <div className="pdl-related-grid">
            {related.map((p) => (
              <motion.div
                key={p._id}
                className="pdl-related-card"
                whileHover={{ y: -6 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                onClick={() => navigate(`/product/${p._id}`)}
                data-testid={`pdl-related-${p._id}`}
              >
                <div className="pdl-related-img-wrap">
                  <img
                    src={p.images?.[0]?.url || getFallback(related.indexOf(p))}
                    alt={p.name}
                    onError={e => { e.target.onerror = null; e.target.src = getFallback(related.indexOf(p)); }}
                  />
                </div>
                <div className="pdl-related-name">{p.name}</div>
                <div className="pdl-related-price">{formatPrice(p.price)}</div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            className="pdl-toast"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            data-testid="pdl-toast"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductDetailPage;

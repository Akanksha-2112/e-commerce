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
  FaShareAlt,
  FaStar,
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

  // ---------- Reviews State ----------
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

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

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setToast('Link copied to clipboard');
      setTimeout(() => setToast(''), 3000);
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      setError('Please sign in to write a review');
      return;
    }
    try {
      setSubmittingReview(true);
      await axios.post(
        `${API_BASE}/api/products/${product._id}/reviews`,
        { rating: reviewRating, comment: reviewComment },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setToast('Review submitted successfully');
      setShowReviewForm(false);
      setReviewRating(5);
      setReviewComment('');
      
      // Refresh product to show new review
      const { data } = await axios.get(`${API_BASE}/api/products/${product._id}`);
      setProduct(data);
    } catch (err) {
      setToast(err?.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
      setTimeout(() => setToast(''), 3500);
    }
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
              {isWishlisted ? '♥ Saved' : '♡ Add to Wishlist'}
            </button>
            <button
              className="pdl-btn pdl-btn-secondary"
              onClick={handleShare}
              title="Share this piece"
              style={{ padding: '0 1.2rem', minWidth: 'auto', flex: '0 0 auto' }}
            >
              <FaShareAlt size={16} />
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

      {/* Reviews & Ratings */}
      <section className="pdl-reviews" style={{ padding: '4rem 5vw', maxWidth: '1400px', margin: '0 auto', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: '#f8f4ee', margin: 0, fontWeight: 300 }}>Client Testimonials</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: '0.8rem' }}>
              <div style={{ display: 'flex', color: '#C9A84C', fontSize: '1.1rem' }}>
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} style={{ opacity: i < (product.ratings || 0) ? 1 : 0.3 }} />
                ))}
              </div>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', color: '#999', letterSpacing: '0.05em' }}>
                {product.ratings > 0 ? `${product.ratings.toFixed(1)} / 5 based on ${product.numReviews} review${product.numReviews !== 1 ? 's' : ''}` : 'No reviews yet'}
              </span>
            </div>
          </div>
          {user ? (
            <button 
              onClick={() => setShowReviewForm(!showReviewForm)}
              style={{ background: 'none', border: '1px solid rgba(255,255,255,0.2)', color: '#e8e8e8', padding: '0.6rem 1.2rem', fontFamily: 'var(--font-sans)', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', transition: 'border-color 0.2s' }}
            >
              {showReviewForm ? 'Cancel' : 'Write a Review'}
            </button>
          ) : (
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', color: '#999' }}>
              Please <Link to="/login" style={{ color: '#C9A84C', textDecoration: 'none' }}>sign in</Link> to write a review
            </div>
          )}
        </div>

        <AnimatePresence>
          {showReviewForm && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              style={{ overflow: 'hidden', marginBottom: '3rem' }}
            >
              <form onSubmit={submitReview} style={{ background: 'rgba(255,255,255,0.02)', padding: '2rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontFamily: 'var(--font-sans)', fontSize: '0.8rem', color: '#e8e8e8', letterSpacing: '0.05em', marginBottom: '0.8rem', textTransform: 'uppercase' }}>Rating</label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar 
                        key={star} 
                        size={24}
                        onClick={() => setReviewRating(star)}
                        style={{ cursor: 'pointer', color: '#C9A84C', opacity: star <= reviewRating ? 1 : 0.3, transition: 'opacity 0.2s' }} 
                      />
                    ))}
                  </div>
                </div>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontFamily: 'var(--font-sans)', fontSize: '0.8rem', color: '#e8e8e8', letterSpacing: '0.05em', marginBottom: '0.8rem', textTransform: 'uppercase' }}>Review</label>
                  <textarea 
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    required
                    rows="4"
                    placeholder="Share your experience with this piece..."
                    style={{ width: '100%', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '1rem', fontFamily: 'var(--font-sans)', fontSize: '0.9rem', outline: 'none', resize: 'vertical' }}
                  ></textarea>
                </div>
                <button 
                  type="submit" 
                  disabled={submittingReview}
                  style={{ background: '#e8e8e8', color: '#000', border: 'none', padding: '0.8rem 1.5rem', fontFamily: 'var(--font-sans)', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: submittingReview ? 'not-allowed' : 'pointer', opacity: submittingReview ? 0.7 : 1 }}
                >
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          {product.reviews && product.reviews.length > 0 ? (
            product.reviews.map((review, i) => (
              <div key={review._id || i} style={{ padding: '2rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', color: '#C9A84C', fontSize: '0.8rem', marginBottom: '1rem' }}>
                  {[...Array(5)].map((_, index) => (
                    <FaStar key={index} style={{ opacity: index < review.rating ? 1 : 0.3 }} />
                  ))}
                </div>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', color: '#aaa', lineHeight: 1.6, margin: '0 0 1.5rem' }}>{review.comment}</p>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.7rem', color: '#666', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  <span style={{ color: '#e8e8e8', fontWeight: 600 }}>{review.name}</span> — Verified Buyer <br/> {new Date(review.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
              </div>
            ))
          ) : (
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9rem', color: '#888', gridColumn: '1 / -1' }}>
              No reviews yet. Be the first to review this piece.
            </div>
          )}
        </div>
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

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGlobal } from '../../context/GlobalContext';
import { FaUser, FaShoppingBag, FaHeart, FaBars, FaArrowRight, FaEye } from 'react-icons/fa';
import '../../styles/BoutiqueLanding.css';

/* ─── Data ─────────────────────────────────── */
const HERO_SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1600&q=90',
    label: 'A/W Collection 2026',
    title: 'BEYOND<br/><span>VISUALS.</span><br/>BUILT WITH VISION.',
    sub: 'We curate high-fashion collections with intention, clarity, and uncompromising quality.',
    cta: '/women',
  },
  {
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&q=90',
    label: 'Exclusive Drops',
    title: 'REDEFINE<br/><span>YOUR</span><br/>AESTHETIC.',
    sub: 'Limited editions crafted from heritage textiles and avant-garde silhouettes.',
    cta: '/women',
  },
  {
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1600&q=90',
    label: 'Winter Capsule',
    title: 'THE ART<br/>OF<br/><span>ADORNMENT.</span>',
    sub: 'Discover the craftsmanship behind every seam in our new capsule collection.',
    cta: '/men',
  },
];

const BENTO_PRODUCTS = [
  { id: 'p1', cat: 'Women', name: 'Crimson Silk Saree', price: '₹18,500', img: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80', isNew: true },
  { id: 'p2', cat: 'Men', name: 'Tailored Linen Suit', price: '₹22,000', img: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=600&q=80', isNew: false },
  { id: 'p3', cat: 'Kids', name: 'Festive Lehenga Set', price: '₹8,500', img: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600&q=80', isNew: true },
  { id: 'p4', cat: 'Women', name: 'Velvet Evening Gown', price: '₹35,000', img: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80', isNew: false },
];

const CATEGORIES = [
  { name: 'WOMEN', img: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80', link: '/women' },
  { name: 'MEN',   img: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=600&q=80', link: '/men' },
  { name: 'KIDS',  img: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=600&q=80', link: '/kids' },
  { name: 'NEW',   img: 'https://images.unsplash.com/photo-1603400521630-9f2de124b33b?w=600&q=80', link: '/women' },
];

const TICKER = ['AWIK SPECTRUM', '★', 'CRAFT', '★', 'HERITAGE', '★', 'INTENTION', '★', 'AWIK SPECTRUM', '★', 'CRAFT', '★', 'HERITAGE', '★', 'INTENTION', '★'];

/* ─── Component ─────────────────────────────── */
const LandingPage = () => {
  const navigate = useNavigate();
  const { toggleCart, toggleSidebar, wishlist } = useGlobal();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="axm-root">

      {/* ── Announcement Bar ── */}
      <div className="axm-announce">
        Complimentary Shipping on orders above ₹5,000 &nbsp;·&nbsp; 14-Day Returns &nbsp;·&nbsp; Concierge Styling Available
      </div>

      {/* ── Navbar ── */}
      <nav className="axm-nav">
        <div className="axm-nav__logo" onClick={() => navigate('/')}>
          AWIK <span>SPECTRUM</span>
        </div>
        <div className="axm-nav__links">
          <button onClick={() => navigate('/women')}>Women</button>
          <button onClick={() => navigate('/men')}>Men</button>
          <button onClick={() => navigate('/kids')}>Kids</button>
          <button onClick={() => navigate('/maison')}>The Maison</button>
        </div>
        <div className="axm-nav__icons">
          <button className="axm-icon-btn" onClick={() => navigate('/profile')}><FaUser size={16} /></button>
          <button className="axm-icon-btn axm-cart-btn" onClick={() => toggleCart(true)}>
            <FaShoppingBag size={16} />
            <span className="axm-cart-dot" />
          </button>
          <button className="axm-icon-btn" onClick={() => navigate('/wishlist')}><FaHeart size={16} /></button>
          <button className="axm-icon-btn" onClick={() => toggleSidebar(true)}><FaBars size={18} /></button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <div className="axm-hero">
        {HERO_SLIDES.map((slide, idx) => (
          <div key={idx} className={`axm-hero__slide ${currentSlide === idx ? 'active' : ''}`}>
            <img src={slide.image} alt={`Hero ${idx}`} />
            <div className="axm-hero__overlay" />
            {currentSlide === idx && (
              <motion.div
                className="axm-hero__content"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
              >
                <span className="axm-hero__label">{slide.label}</span>
                <h1 className="axm-hero__title" dangerouslySetInnerHTML={{ __html: slide.title }} />
                <p className="axm-hero__sub">{slide.sub}</p>
                <button className="axm-btn-morphism" onClick={() => navigate(slide.cta)}>
                  <span>Discover Collection</span>
                  <FaArrowRight size={13} style={{ position: 'relative', zIndex: 1 }} />
                </button>
              </motion.div>
            )}
          </div>
        ))}

        {/* Slide dots */}
        <div className="axm-hero__dots">
          {HERO_SLIDES.map((_, idx) => (
            <button key={idx} className={`axm-dot ${currentSlide === idx ? 'active' : ''}`} onClick={() => setCurrentSlide(idx)} />
          ))}
        </div>
      </div>

      {/* ── Marquee Ticker ── */}
      <div className="axm-marquee-wrap">
        <div className="axm-marquee">
          {TICKER.map((item, i) => (
            <span key={i} className={item === '★' ? 'star' : ''}>{item}&nbsp;&nbsp;</span>
          ))}
        </div>
      </div>

      {/* ── Featured Products Bento ── */}
      <section className="axm-section">
        <div className="axm-section-header">
          <span className="axm-hero__label">Curated Selection</span>
          <h2 className="axm-section-title">FEATURED<br /><span>PRODUCTS</span></h2>
        </div>

        <div className="axm-bento">
          {/* Left: Feature Banner */}
          <div
            className="axm-glass-card axm-bento__feature"
            style={{ cursor: 'pointer', minHeight: '400px' }}
            onClick={() => navigate('/women')}
          >
            <span className="axm-label">(Limited Edition)</span>
            <h2 className="axm-bento__big-title">SUMMER<br /><span>CAPSULE</span></h2>
            <p style={{ color: 'var(--muted)', marginBottom: '1.5rem', fontWeight: 300, lineHeight: 1.6 }}>
              Exclusive editorial pieces designed for creative professionals.
            </p>
            <button
              className="axm-btn-morphism"
              style={{ fontSize: '0.7rem', padding: '0.7rem 1.5rem' }}
              onClick={e => { e.stopPropagation(); navigate('/women'); }}
            >
              <span>Explore Edit</span>
              <FaArrowRight size={12} style={{ position: 'relative', zIndex: 1 }} />
            </button>
            {/* Decorative glow orb */}
            <div style={{
              position: 'absolute', right: '-40px', top: '50%', transform: 'translateY(-50%)',
              width: '300px', height: '300px', borderRadius: '50%',
              background: 'radial-gradient(circle, var(--orange) 0%, transparent 70%)',
              opacity: 0.1, pointerEvents: 'none',
            }} />
          </div>

          {/* Right: Product Cards Grid */}
          <div className="axm-bento__grid">
            {BENTO_PRODUCTS.map(p => (
              <div key={p.id} className="axm-glass-card axm-product-card" onClick={() => navigate(`/product/${p.id}`)}>
                <div className="axm-product-card__img-wrap">
                  <img src={p.img} alt={p.name} />
                  {p.isNew && <div className="axm-badge accent">NEW</div>}
                  <div className="axm-card-actions">
                    <button className="axm-action-btn" onClick={e => { e.stopPropagation(); navigate('/wishlist'); }}><FaHeart size={14} /></button>
                    <button className="axm-action-btn" onClick={e => { e.stopPropagation(); navigate(`/product/${p.id}`); }}><FaEye size={14} /></button>
                  </div>
                </div>
                <div className="axm-product-card__info">
                  <span className="axm-card-cat">{p.cat}</span>
                  <h3 className="axm-card-name">{p.name}</h3>
                  <span className="axm-card-price">{p.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Category Grid ── */}
      <section style={{ borderTop: '1px solid var(--border)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
          {CATEGORIES.map(cat => (
            <div
              key={cat.name}
              onClick={() => navigate(cat.link)}
              style={{ position: 'relative', aspectRatio: '0.85', overflow: 'hidden', cursor: 'pointer', borderRight: '1px solid var(--border)' }}
            >
              <img
                src={cat.img} alt={cat.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.55)', transition: 'transform 0.7s ease' }}
                onMouseEnter={e => e.target.style.transform = 'scale(1.06)'}
                onMouseLeave={e => e.target.style.transform = 'scale(1)'}
              />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1.2rem 1rem', background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <span style={{ fontFamily: 'var(--display)', fontSize: '1.8rem', color: 'var(--white)', letterSpacing: '0.02em' }}>{cat.name}</span>
                <span style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.6)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>EXPLORE</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Second Bento (Reversed) ── */}
      <section className="axm-section">
        <div className="axm-bento axm-bento--reversed">
          <div className="axm-bento__grid">
            {[...BENTO_PRODUCTS].reverse().map(p => (
              <div key={`r-${p.id}`} className="axm-glass-card axm-product-card" onClick={() => navigate(`/product/${p.id}`)}>
                <div className="axm-product-card__img-wrap">
                  <img src={p.img} alt={p.name} />
                  <div className="axm-card-actions">
                    <button className="axm-action-btn" onClick={e => { e.stopPropagation(); navigate('/wishlist'); }}><FaHeart size={14} /></button>
                  </div>
                </div>
                <div className="axm-product-card__info">
                  <span className="axm-card-cat">{p.cat}</span>
                  <h3 className="axm-card-name">{p.name}</h3>
                  <span className="axm-card-price">{p.price}</span>
                </div>
              </div>
            ))}
          </div>

          <div
            className="axm-glass-card axm-bento__feature"
            style={{ cursor: 'pointer', minHeight: '400px' }}
            onClick={() => navigate('/men')}
          >
            <span className="axm-label">(Essentials)</span>
            <h2 className="axm-bento__big-title">MEN'S<br /><span>TAILORING</span></h2>
            <button
              className="axm-btn-morphism"
              style={{ fontSize: '0.7rem', padding: '0.7rem 1.5rem', marginTop: '1.5rem' }}
              onClick={e => { e.stopPropagation(); navigate('/men'); }}
            >
              <span>Shop Men</span>
              <FaArrowRight size={12} style={{ position: 'relative', zIndex: 1 }} />
            </button>
          </div>
        </div>
      </section>

      {/* ── Footer CTA ── */}
      <section className="axm-footer-cta">
        <span className="axm-hero__label" style={{ marginBottom: '1.5rem' }}>About Us</span>
        <h2 className="axm-footer-cta__title">THE LUXURY<br /><span>OF SILENCE</span></h2>
        <p className="axm-footer-cta__sub">
          Each piece is a dialogue between the past and the present,<br />
          crafted not to be consumed, but to be inherited.
        </p>
        <button className="axm-btn-ghost" onClick={() => navigate('/maison')}>
          <span>Discover The Maison</span>
          <FaArrowRight size={14} />
        </button>
      </section>

    </div>
  );
};

export default LandingPage;

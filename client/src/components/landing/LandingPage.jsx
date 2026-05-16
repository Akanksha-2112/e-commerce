import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGlobal } from '../../context/GlobalContext';
import { FaUser, FaShoppingBag, FaHeart, FaBars, FaArrowRight, FaEye } from 'react-icons/fa';
import '../../styles/BoutiqueLanding.css';

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
  { id: 'p1', cat: 'Women', name: 'Crimson Silk Saree', price: 'Rs 18,500', img: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80', isNew: true },
  { id: 'p2', cat: 'Men', name: 'Tailored Linen Suit', price: 'Rs 22,000', img: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=600&q=80', isNew: false },
  { id: 'p3', cat: 'Kids', name: 'Festive Lehenga Set', price: 'Rs 8,500', img: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600&q=80', isNew: true },
  { id: 'p4', cat: 'Women', name: 'Velvet Evening Gown', price: 'Rs 35,000', img: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80', isNew: false },
];

const CATEGORIES = [
  { name: 'WOMEN', img: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80', link: '/women' },
  { name: 'MEN', img: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=600&q=80', link: '/men' },
  { name: 'KIDS', img: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=600&q=80', link: '/kids' },
  { name: 'NEW', img: 'https://images.unsplash.com/photo-1603400521630-9f2de124b33b?w=600&q=80', link: '/women' },
];

const TICKER = ['AWIK SPECTRUM', '/', 'CRAFT', '/', 'HERITAGE', '/', 'INTENTION', '/', 'AWIK SPECTRUM', '/', 'CRAFT', '/', 'HERITAGE', '/', 'INTENTION', '/'];

const LandingPage = () => {
  const navigate = useNavigate();
  const { toggleCart, toggleSidebar } = useGlobal();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="axm-root">
      <div className="axm-announce">
        Complimentary shipping on orders above Rs 5,000 | 14-day returns | Concierge styling available
      </div>

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
          <button className="axm-icon-btn" onClick={() => navigate('/profile')} aria-label="Profile"><FaUser size={16} /></button>
          <button className="axm-icon-btn axm-cart-btn" onClick={() => toggleCart(true)} aria-label="Open bag">
            <FaShoppingBag size={16} />
            <span className="axm-cart-dot" />
          </button>
          <button className="axm-icon-btn" onClick={() => navigate('/wishlist')} aria-label="Wishlist"><FaHeart size={16} /></button>
          <button className="axm-icon-btn" onClick={() => toggleSidebar(true)} aria-label="Open menu"><FaBars size={18} /></button>
        </div>
      </nav>

      <div className="axm-hero">
        {HERO_SLIDES.map((slide, idx) => (
          <div key={slide.label} className={`axm-hero__slide ${currentSlide === idx ? 'active' : ''}`}>
            <img src={slide.image} alt={slide.label} />
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
                  <FaArrowRight size={13} />
                </button>
              </motion.div>
            )}
          </div>
        ))}

        <div className="axm-hero__dots">
          {HERO_SLIDES.map((slide, idx) => (
            <button key={slide.label} className={`axm-dot ${currentSlide === idx ? 'active' : ''}`} onClick={() => setCurrentSlide(idx)} aria-label={`Show ${slide.label}`} />
          ))}
        </div>
      </div>

      <div className="axm-marquee-wrap">
        <div className="axm-marquee">
          {TICKER.map((item, i) => (
            <span key={`${item}-${i}`} className={item === '/' ? 'star' : ''}>{item}&nbsp;&nbsp;</span>
          ))}
        </div>
      </div>

      <section className="axm-section">
        <div className="axm-section-header">
          <span className="axm-hero__label">Curated Selection</span>
          <h2 className="axm-section-title">FEATURED<br /><span>PRODUCTS</span></h2>
        </div>

        <div className="axm-bento">
          <div
            className="axm-glass-card axm-bento__feature"
            onClick={() => navigate('/women')}
          >
            <span className="axm-label">(Limited Edition)</span>
            <h2 className="axm-bento__big-title">SUMMER<br /><span>CAPSULE</span></h2>
            <p className="axm-bento__copy">
              Exclusive editorial pieces designed for creative professionals.
            </p>
            <button
              className="axm-btn-morphism axm-btn-compact"
              onClick={e => { e.stopPropagation(); navigate('/women'); }}
            >
              <span>Explore Edit</span>
              <FaArrowRight size={12} />
            </button>
          </div>

          <div className="axm-bento__grid">
            {BENTO_PRODUCTS.map(p => (
              <div key={p.id} className="axm-glass-card axm-product-card" onClick={() => navigate(`/product/${p.id}`)}>
                <div className="axm-product-card__img-wrap">
                  <img src={p.img} alt={p.name} />
                  {p.isNew && <div className="axm-badge accent">NEW</div>}
                  <div className="axm-card-actions">
                    <button className="axm-action-btn" onClick={e => { e.stopPropagation(); navigate('/wishlist'); }} aria-label={`Save ${p.name}`}><FaHeart size={14} /></button>
                    <button className="axm-action-btn" onClick={e => { e.stopPropagation(); navigate(`/product/${p.id}`); }} aria-label={`View ${p.name}`}><FaEye size={14} /></button>
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

      <section className="axm-category-section">
        <div className="axm-category-grid">
          {CATEGORIES.map(cat => (
            <div
              key={cat.name}
              onClick={() => navigate(cat.link)}
              className="axm-category-tile"
            >
              <img src={cat.img} alt={cat.name} className="axm-category-image" />
              <div className="axm-category-caption">
                <span className="axm-category-name">{cat.name}</span>
                <span className="axm-category-action">Explore</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="axm-section">
        <div className="axm-bento axm-bento--reversed">
          <div className="axm-bento__grid">
            {[...BENTO_PRODUCTS].reverse().map(p => (
              <div key={`r-${p.id}`} className="axm-glass-card axm-product-card" onClick={() => navigate(`/product/${p.id}`)}>
                <div className="axm-product-card__img-wrap">
                  <img src={p.img} alt={p.name} />
                  <div className="axm-card-actions">
                    <button className="axm-action-btn" onClick={e => { e.stopPropagation(); navigate('/wishlist'); }} aria-label={`Save ${p.name}`}><FaHeart size={14} /></button>
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
            onClick={() => navigate('/men')}
          >
            <span className="axm-label">(Essentials)</span>
            <h2 className="axm-bento__big-title">MEN'S<br /><span>TAILORING</span></h2>
            <button
              className="axm-btn-morphism axm-btn-compact axm-btn-spaced"
              onClick={e => { e.stopPropagation(); navigate('/men'); }}
            >
              <span>Shop Men</span>
              <FaArrowRight size={12} />
            </button>
          </div>
        </div>
      </section>

      <section className="axm-footer-cta">
        <span className="axm-hero__label">About Us</span>
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

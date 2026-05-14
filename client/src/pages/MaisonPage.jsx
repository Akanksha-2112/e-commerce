import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import Navbar from '../components/Navbar';

const MaisonPage = () => {
    const containerRef = useRef(null);
    const navigate = useNavigate();
    const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] });
    const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);

    const pillars = [
        { num: '01', title: 'CRAFT', body: 'Each garment is hand-finished by master artisans trained in centuries-old Indian textile traditions. No shortcuts. No compromises.' },
        { num: '02', title: 'HERITAGE', body: 'We source exclusively from heritage Indian weavers — Banarasi silk from Varanasi, Kanjeevaram from Tamil Nadu, Chanderi from Madhya Pradesh.' },
        { num: '03', title: 'INTENTION', body: 'Every piece is designed to be worn, loved, and eventually inherited. We create for lifetimes, not seasons.' },
    ];

    return (
        <div ref={containerRef} style={{ background: '#0a0a0a', color: '#fff', fontFamily: "'Inter', sans-serif", overflowX: 'hidden' }}>
            <Navbar />

            {/* Hero */}
            <section style={{ position: 'relative', height: '100vh', overflow: 'hidden', display: 'flex', alignItems: 'flex-end' }}>
                <motion.div style={{ y: heroY, position: 'absolute', inset: 0 }}>
                    <img
                        src="https://images.unsplash.com/photo-1614179689702-355944cd0918?w=1600&q=90"
                        alt="Artisan"
                        style={{ width: '100%', height: '120%', objectFit: 'cover', filter: 'brightness(0.4)' }}
                    />
                </motion.div>
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,10,10,0.9) 0%, transparent 50%)' }} />
                <div style={{ position: 'relative', padding: '0 2.5rem 4rem', zIndex: 2 }}>
                    <p style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '1rem' }}>Est. 2026 · India</p>
                    <h1 style={{ fontFamily: "'Anton', 'Impact', sans-serif", fontSize: 'clamp(4rem, 10vw, 10rem)', lineHeight: 0.88, color: '#fff', marginBottom: '2rem' }}>
                        THE<br />MAISON
                    </h1>
                    <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', maxWidth: '500px', lineHeight: 1.8, letterSpacing: '0.03em' }}>
                        True luxury is not about excess, but about the absence of noise. It is the quiet confidence of a perfect stitch and the patience of hands that have known their craft for generations.
                    </p>
                </div>
            </section>

            {/* Marquee divider */}
            <div style={{ overflow: 'hidden', borderTop: '1px solid rgba(255,255,255,0.08)', borderBottom: '1px solid rgba(255,255,255,0.08)', background: '#111', padding: '0.9rem 0' }}>
                <div style={{ display: 'flex', whiteSpace: 'nowrap', animation: 'marqueeScroll 18s linear infinite' }}>
                    <span style={{ fontSize: '0.65rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#555' }}>
                        {'CRAFT · HERITAGE · INTENTION · AUTHENTICITY · INDIA · AWIK SPECTRUM · CRAFT · HERITAGE · INTENTION · AUTHENTICITY · INDIA · AWIK SPECTRUM · '.repeat(2)}
                    </span>
                </div>
            </div>

            {/* Philosophy */}
            <section style={{ padding: '7rem 2.5rem', maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6rem', alignItems: 'center' }}>
                <div>
                    <p style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '1.5rem' }}>Our Philosophy</p>
                    <h2 style={{ fontFamily: "'Anton', 'Impact', sans-serif", fontSize: 'clamp(2.5rem, 5vw, 5rem)', color: '#fff', lineHeight: 0.9, marginBottom: '2rem' }}>
                        WHERE HERITAGE<br />MEETS NOW
                    </h2>
                    <p style={{ color: '#666', lineHeight: 1.9, marginBottom: '1.5rem', fontSize: '0.95rem' }}>
                        AWIK SPECTRUM was born from a singular obsession — to honour India's extraordinary textile legacy while speaking a contemporary, global visual language.
                    </p>
                    <p style={{ color: '#666', lineHeight: 1.9, fontSize: '0.95rem' }}>
                        We create for the few who understand that a garment is not purchased. It is chosen. It is lived in. It is eventually passed on.
                    </p>
                </div>
                <div style={{ position: 'relative' }}>
                    <img
                        src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=700&q=85"
                        alt="Collection"
                        style={{ width: '100%', aspectRatio: '0.8', objectFit: 'cover', filter: 'brightness(0.8)' }}
                    />
                    <div style={{ position: 'absolute', top: '-1rem', left: '-1rem', right: '1rem', bottom: '1rem', border: '1px solid rgba(201,168,76,0.3)', pointerEvents: 'none', zIndex: -1 }} />
                </div>
            </section>

            {/* Pillars */}
            <section style={{ padding: '0 2.5rem 7rem', maxWidth: '1200px', margin: '0 auto' }}>
                <p style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '3rem' }}>The Pillars</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                    {pillars.map((p, i) => (
                        <div key={p.num} style={{ padding: '2.5rem 2rem 2.5rem 0', borderRight: i < 2 ? '1px solid rgba(255,255,255,0.08)' : 'none', paddingLeft: i > 0 ? '2rem' : 0 }}>
                            <span style={{ fontFamily: "'Anton', sans-serif", fontSize: '3rem', color: 'rgba(255,255,255,0.08)', display: 'block', marginBottom: '1rem' }}>{p.num}</span>
                            <h3 style={{ fontFamily: "'Anton', 'Impact', sans-serif", fontSize: '1.8rem', color: '#fff', marginBottom: '1rem', letterSpacing: '0.05em' }}>{p.title}</h3>
                            <p style={{ color: '#555', lineHeight: 1.8, fontSize: '0.88rem' }}>{p.body}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section style={{ background: '#fff', padding: '6rem 2rem', textAlign: 'center' }}>
                <p style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#888', marginBottom: '1.5rem' }}>AWIK SPECTRUM</p>
                <h2 style={{ fontFamily: "'Anton', 'Impact', sans-serif", fontSize: 'clamp(3rem, 8vw, 7rem)', color: '#0a0a0a', lineHeight: 0.9, marginBottom: '2rem' }}>
                    ENTER THE<br />COLLECTION
                </h2>
                <button onClick={() => navigate('/women')} style={{ background: '#0a0a0a', color: '#fff', border: 'none', padding: '1rem 2.8rem', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', transition: 'background 0.2s' }}>
                    Shop Now
                </button>
            </section>

            <style>{`@keyframes marqueeScroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
        </div>
    );
};

export default MaisonPage;

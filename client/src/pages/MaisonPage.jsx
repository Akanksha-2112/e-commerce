import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import FixedNavigation from '../components/common/FixedNavigation';
import '../styles/PremiumTheme.css';

const MaisonPage = () => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]);

    return (
        <div className="maison-page" ref={containerRef}>
            <FixedNavigation />

            <div className="maison-container">
                {/* Hero Section with Parallax */}
                <div className="maison-hero">
                    <motion.div style={{ y: heroY, height: '120%', width: '100%' }}>
                        <img src="/artisan_hands.png" alt="Artisan Hands" className="maison-hero-img" />
                    </motion.div>
                    <div className="maison-hero-overlay">
                        <motion.h1
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                        >
                            THE LUXURY OF SILENCE
                        </motion.h1>
                    </div>
                </div>

                {/* Middle Section - Asymmetrical Editorial Layout */}
                <div className="maison-content-split">
                    <div className="maison-image-block">
                        <img src="/raw_materials.png" alt="Raw Materials" className="maison-detail-img" />
                    </div>

                    <motion.div className="maison-text-block" style={{ y: textY }}>
                        <p className="maison-philosophy">
                            True luxury is not about excess, but about the absence of noise.
                            It is the quiet confidence of a perfect stitch, the tactile memory of
                            raw cashmere, and the patience of hands that have known their craft for generations.
                        </p>
                        <p className="maison-philosophy">
                            We create for the few who understand the language of time.
                            Each piece is a dialogue between the past and the present,
                            crafted not to be consumed, but to be inherited.
                        </p>
                        <div className="maison-signature">
                            The Maison
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default MaisonPage;

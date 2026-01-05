import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import '../../styles/PremiumTheme.css';

const CustomCursor = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [cursorVariant, setCursorVariant] = useState('default');
    const [cursorText, setCursorText] = useState('');

    useEffect(() => {
        const mouseMove = (e) => {
            setMousePosition({
                x: e.clientX,
                y: e.clientY
            });

            // Check target for hover state
            const target = e.target;

            // Check for buttons or links
            const isClickable = target.tagName === 'BUTTON' || target.tagName === 'A' || target.closest('button') || target.closest('a') || target.classList.contains('premium-card');

            // Check for images
            const isImage = target.tagName === 'IMG' || target.classList.contains('premium-image');

            if (isImage) {
                setCursorVariant('image');
                setCursorText('DISCOVER');
            } else if (isClickable) {
                setCursorVariant('hover');
                setCursorText('');
            } else {
                setCursorVariant('default');
                setCursorText('');
            }
        };

        window.addEventListener('mousemove', mouseMove);

        return () => {
            window.removeEventListener('mousemove', mouseMove);
        };
    }, []);

    const variants = {
        default: {
            x: mousePosition.x - 4,
            y: mousePosition.y - 4,
            height: 8,
            width: 8,
            backgroundColor: '#000',
            border: 'none',
            mixBlendMode: 'normal'
        },
        hover: {
            x: mousePosition.x - 20,
            y: mousePosition.y - 20,
            height: 40,
            width: 40,
            backgroundColor: 'transparent',
            border: '1px solid #000',
            mixBlendMode: 'difference'
        },
        image: {
            x: mousePosition.x - 40,
            y: mousePosition.y - 40,
            height: 80,
            width: 80,
            backgroundColor: '#fff',
            color: '#000',
            mixBlendMode: 'normal',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }
    };

    // Disable on touch devices or if reduced motion is preferred
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isTouchDevice || prefersReducedMotion) return null;

    return (
        <motion.div
            className="custom-cursor"
            variants={variants}
            animate={cursorVariant}
            transition={{
                type: 'spring',
                stiffness: 500,
                damping: 28,
                mass: 0.5
            }}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                borderRadius: '50%',
                pointerEvents: 'none',
                zIndex: 9999,
                fontSize: '10px',
                fontFamily: 'Didot, serif',
                letterSpacing: '1px',
                fontWeight: 'bold',
                textTransform: 'uppercase'
            }}
        >
            {cursorVariant === 'image' && cursorText}
        </motion.div>
    );
};

export default CustomCursor;

import React, { useEffect, useRef, useState } from 'react';
import '../../styles/PremiumTheme.css';

const FountainPenCursor = () => {
    const canvasRef = useRef(null);
    const requestRef = useRef(null);
    const pathsRef = useRef([]); // Store points for the ink trail
    const mouseRef = useRef({ x: 0, y: 0, lastX: 0, lastY: 0, velocity: 0 });
    const [nibPosition, setNibPosition] = useState({ x: -100, y: -100 });

    // Configuration
    const INK_COLOR = '#000000'; // Obsidian Black
    const MAX_WIDTH = 4;
    const MIN_WIDTH = 1;
    const FADE_DURATION = 1500; // ms

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Resize canvas to full screen
        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', handleResize);
        handleResize();

        const handleMouseMove = (e) => {
            const { clientX, clientY } = e;

            // Calculate velocity
            const dx = clientX - mouseRef.current.lastX;
            const dy = clientY - mouseRef.current.lastY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const velocity = Math.min(distance, 15); // Cap velocity

            mouseRef.current = {
                x: clientX,
                y: clientY,
                lastX: clientX,
                lastY: clientY,
                velocity
            };

            setNibPosition({ x: clientX, y: clientY });

            // Add point to path
            pathsRef.current.push({
                x: clientX,
                y: clientY,
                time: Date.now(),
                width: Math.max(MIN_WIDTH, MAX_WIDTH - (velocity / 3)) // Faster = Thinner
            });
        };

        window.addEventListener('mousemove', handleMouseMove);

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const now = Date.now();
            const points = pathsRef.current;

            // Remove old points
            while (points.length > 0 && now - points[0].time > FADE_DURATION) {
                points.shift();
            }

            if (points.length > 1) {
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';

                for (let i = 1; i < points.length; i++) {
                    const p1 = points[i - 1];
                    const p2 = points[i];

                    // Calculate opacity based on age
                    const age = now - p2.time;
                    const opacity = 1 - (age / FADE_DURATION);

                    if (opacity <= 0) continue;

                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    // Use quadratic curve for smoother lines if we had control points, 
                    // but for variable width segments, simple lines work best visually for "ink"
                    ctx.lineTo(p2.x, p2.y);

                    ctx.strokeStyle = `rgba(0, 0, 0, ${opacity})`;
                    ctx.lineWidth = p2.width;
                    ctx.stroke();
                }
            }

            requestRef.current = requestAnimationFrame(animate);
        };

        requestRef.current = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(requestRef.current);
        };
    }, []);

    // Disable on touch devices or reduced motion
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isTouchDevice || prefersReducedMotion) return null;

    return (
        <>
            <canvas
                ref={canvasRef}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    pointerEvents: 'none',
                    zIndex: 9998 // Behind the nib
                }}
            />
            {/* Fountain Pen Nib SVG */}
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    transform: `translate(${nibPosition.x}px, ${nibPosition.y}px) rotate(-45deg)`,
                    pointerEvents: 'none',
                    zIndex: 9999,
                    transition: 'transform 0.05s linear' // Slight lag for weight
                }}
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L2 22L12 18L22 22L12 2Z" fill="#D4AF37" /> {/* Gold Nib */}
                    <path d="M12 2V18" stroke="#000" strokeWidth="1" /> {/* Ink Channel */}
                </svg>
            </div>
        </>
    );
};

export default FountainPenCursor;

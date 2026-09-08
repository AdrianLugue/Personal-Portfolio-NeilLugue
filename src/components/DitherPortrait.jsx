import React, { useRef, useState, useEffect, Component } from 'react';
import { Dithering, ImageDithering } from '@paper-design/shaders-react';

// Error boundary for shaders
class ShaderBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) return this.props.fallback ?? null;
    return this.props.children;
  }
}

/**
 * Frameless Atmospheric Dither Portrait
 * Combination 1 & 2:
 * 1. Frameless silhouette that dissolves softly into the background with cursor dither reveal
 * 2. Atmospheric luminous gold dither aura radiating organically behind shoulders
 */
export default function DitherPortrait({ className = '', style = {} }) {
  const containerRef = useRef(null);
  const [isInView, setIsInView] = useState(true);
  const [cursor, setCursor] = useState({ x: 50, y: 40 });
  const [hovering, setHovering] = useState(false);
  const [radius, setRadius] = useState(0);
  const rafRef = useRef(null);
  const targetRadius = useRef(0);
  const currentRadius = useRef(0);

  // IntersectionObserver to pause when off-screen
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { rootMargin: '100px 0px 100px 0px', threshold: 0 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Smooth radius animation (only when in view)
  useEffect(() => {
    if (!isInView) return;
    const animate = () => {
      const diff = targetRadius.current - currentRadius.current;
      currentRadius.current += diff * 0.14;
      setRadius(Math.round(currentRadius.current));
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isInView]);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setCursor({ x, y });
    targetRadius.current = 140;
  };

  const handleMouseEnter = () => {
    setHovering(true);
    targetRadius.current = 140;
  };

  const handleMouseLeave = () => {
    setHovering(false);
    targetRadius.current = 0;
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative group flex justify-center items-center select-none cursor-crosshair ${className}`}
      style={{
        width: '100%',
        aspectRatio: '499/750',
        ...style,
      }}
    >
      {/* ─────────────────────────────────────────────
          LAYER 1: Atmospheric Golden Dither Aura (Behind Silhouette)
      ───────────────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-700"
        style={{
          maskImage: 'radial-gradient(ellipse 65% 55% at 50% 38%, black 15%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse 65% 55% at 50% 38%, black 15%, transparent 75%)',
          opacity: hovering ? 0.75 : 0.4,
        }}
      >
        <ShaderBoundary fallback={<div className="w-full h-full bg-[#FFD136]/15 blur-2xl" />}>
          {isInView ? (
            <Dithering
              speed={0.6}
              shape="simplex"
              type="4x4"
              size={2.2}
              scale={0.7}
              colorBack="#00000000"
              colorFront="#FFD54F"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-[#FFD136]/10 blur-xl" />
          )}
        </ShaderBoundary>
      </div>

      {/* Extra ambient soft glow behind the head/torso */}
      <div
        className="absolute w-[80%] h-[75%] top-[8%] rounded-full bg-gradient-to-b from-[#FFD136]/20 via-[#7F7255]/10 to-transparent blur-3xl pointer-events-none transition-opacity duration-700"
        style={{ opacity: hovering ? 0.9 : 0.5 }}
      />

      {/* ─────────────────────────────────────────────
          LAYER 2 & 3: Silhouette Cutout + Interactive Dither (Soft Bottom Fade)
      ───────────────────────────────────────────── */}
      <div
        className="relative w-full h-full pointer-events-none"
        style={{
          maskImage: 'linear-gradient(to bottom, black 0%, black 88%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 88%, transparent 100%)',
        }}
      >
        {/* Base crisp cutout portrait */}
        <img
          src="/assets/portrait_cutout.png"
          alt="Neil Lugue"
          className="w-full h-full object-contain object-center pointer-events-none select-none drop-shadow-[0_10px_25px_rgba(0,0,0,0.8)]"
          loading="eager"
          draggable={false}
        />

        {/* Dynamic interactive dither wave revealed on hover */}
        <div
          className="absolute inset-0 pointer-events-none transition-all duration-75"
          style={{
            clipPath: `circle(${radius}px at ${cursor.x}% ${cursor.y}%)`,
            willChange: 'clip-path',
          }}
        >
          <ShaderBoundary fallback={null}>
            <ImageDithering
              image="/assets/portrait_cutout.png"
              originalColors={false}
              inverted={false}
              type="8x8"
              size={1.5}
              colorSteps={1}
              scale={1.0}
              fit="contain"
              colorBack="#00000000"
              colorFront="#FFD54F"
              colorHighlight="#FFFFFF"
              className="w-full h-full object-contain object-center"
            />
          </ShaderBoundary>
        </div>
      </div>
    </div>
  );
}

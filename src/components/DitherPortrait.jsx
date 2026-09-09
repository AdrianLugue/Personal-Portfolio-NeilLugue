import React, { useRef, useState, useEffect, useCallback, Component } from 'react';
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
 * High-Performance Frameless Atmospheric Dither Portrait
 * Features:
 * - Desktop: Smooth cursor-following spotlight dither reveal
 * - Mobile Touch: Interactive finger torchlight dragging
 * - Zero React re-renders on interaction (direct DOM/GPU clipPath updates)
 * - Pure idle state when not interacted with (zero ambient sweep)
 */
export default function DitherPortrait({ className = '', style = {} }) {
  const containerRef = useRef(null);
  const spotlightRef = useRef(null);
  const auraRef = useRef(null);
  const glowRef = useRef(null);

  const [isInView, setIsInView] = useState(true);

  // Animation values stored in refs for 120 FPS performance
  const isLoopRunning = useRef(false);
  const targetX = useRef(50);
  const targetY = useRef(40);
  const currentX = useRef(50);
  const currentY = useRef(40);
  const targetRadius = useRef(0);
  const currentRadius = useRef(0);
  const rafId = useRef(null);

  // IntersectionObserver to pause rendering when off-screen
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

  // Animation tick: smoothly lerps cursor & radius, updates DOM directly, stops when settled
  const tick = useCallback(() => {
    const radiusDiff = targetRadius.current - currentRadius.current;
    const xDiff = targetX.current - currentX.current;
    const yDiff = targetY.current - currentY.current;

    currentRadius.current += radiusDiff * 0.16;
    currentX.current += xDiff * 0.2;
    currentY.current += yDiff * 0.2;

    if (spotlightRef.current) {
      const r = Math.max(0, currentRadius.current).toFixed(1);
      const x = currentX.current.toFixed(2);
      const y = currentY.current.toFixed(2);
      spotlightRef.current.style.clipPath = `circle(${r}px at ${x}% ${y}%)`;
    }

    // Check if settled (within sub-pixel margin)
    const isSettled =
      Math.abs(radiusDiff) < 0.15 &&
      Math.abs(xDiff) < 0.1 &&
      Math.abs(yDiff) < 0.1;

    if (isSettled) {
      currentRadius.current = targetRadius.current;
      currentX.current = targetX.current;
      currentY.current = targetY.current;
      if (spotlightRef.current) {
        spotlightRef.current.style.clipPath = `circle(${currentRadius.current}px at ${currentX.current}% ${currentY.current}%)`;
      }
      isLoopRunning.current = false;
    } else {
      rafId.current = requestAnimationFrame(tick);
    }
  }, []);

  const startAnimation = useCallback(() => {
    if (!isLoopRunning.current) {
      isLoopRunning.current = true;
      rafId.current = requestAnimationFrame(tick);
    }
  }, [tick]);

  useEffect(() => {
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  const updateCoordinates = (clientX, clientY) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;

    targetX.current = Math.max(0, Math.min(100, x));
    targetY.current = Math.max(0, Math.min(100, y));

    // Dynamic responsive radius: smaller on mobile devices & compact containers
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const maxRadius = isMobile ? 80 : 145;
    targetRadius.current = Math.min(maxRadius, Math.max(50, rect.width * 0.32));
  };

  /* Mouse Event Handlers */
  const handleMouseMove = (e) => {
    updateCoordinates(e.clientX, e.clientY);
    startAnimation();
  };

  const handleMouseEnter = (e) => {
    updateCoordinates(e.clientX, e.clientY);
    if (auraRef.current) auraRef.current.style.opacity = '0.75';
    if (glowRef.current) glowRef.current.style.opacity = '0.9';
    startAnimation();
  };

  const handleMouseLeave = () => {
    targetRadius.current = 0;
    if (auraRef.current) auraRef.current.style.opacity = '0.4';
    if (glowRef.current) glowRef.current.style.opacity = '0.5';
    startAnimation();
  };

  /* Mobile Touch Event Handlers */
  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    updateCoordinates(touch.clientX, touch.clientY);
    if (auraRef.current) auraRef.current.style.opacity = '0.75';
    if (glowRef.current) glowRef.current.style.opacity = '0.9';
    startAnimation();
  };

  const handleTouchMove = (e) => {
    const touch = e.touches[0];
    updateCoordinates(touch.clientX, touch.clientY);
    startAnimation();
  };

  const handleTouchEnd = () => {
    targetRadius.current = 0;
    if (auraRef.current) auraRef.current.style.opacity = '0.4';
    if (glowRef.current) glowRef.current.style.opacity = '0.5';
    startAnimation();
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={`relative group flex justify-center items-center select-none cursor-crosshair touch-pan-y ${className}`}
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
        ref={auraRef}
        className="absolute inset-0 pointer-events-none transition-opacity duration-700"
        style={{
          maskImage: 'radial-gradient(ellipse 65% 55% at 50% 38%, black 15%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse 65% 55% at 50% 38%, black 15%, transparent 75%)',
          opacity: 0.4,
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
        ref={glowRef}
        className="absolute w-[80%] h-[75%] top-[8%] rounded-full bg-gradient-to-b from-[#FFD136]/20 via-[#7F7255]/10 to-transparent blur-3xl pointer-events-none transition-opacity duration-700"
        style={{ opacity: 0.5 }}
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

        {/* Dynamic interactive dither wave revealed on hover / touch */}
        <div
          ref={spotlightRef}
          className="absolute inset-0 pointer-events-none"
          style={{
            clipPath: 'circle(0px at 50% 40%)',
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

import React, { useState, useRef, useEffect, Component } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dithering } from '@paper-design/shaders-react';
import {
  ChevronLeft,
  ChevronRight,
  GitBranch,
  Smartphone,
  Terminal,
  Image as ImageIcon,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  FolderGit2,
} from 'lucide-react';
import { PROJECTS_DATA } from '../data/projectsData';
import Button from './Button';
import useInView from '../hooks/useInView';
import { useTheme } from '../context/ThemeContext';

class ShaderErrorBoundary extends Component {
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

export default function Projects() {
  const [projectsRef, isRevealed] = useInView({ threshold: 0.15, once: false });
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const totalProjects = PROJECTS_DATA.length;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? totalProjects - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === totalProjects - 1 ? 0 : prev + 1));
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Touch Swipe handlers for carousel
  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };
  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };
  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 50) handleNext();
    if (touchStartX.current - touchEndX.current < -50) handlePrev();
  };

  return (
    <div
      ref={projectsRef}
      className={`section-lazy-render relative z-10 w-full flex-1 flex flex-col justify-start px-0 py-1 sm:py-2 overflow-visible select-none ${isRevealed ? 'is-revealed' : ''
        }`}
    >
      {/* Section Header */}
      <div className="flex flex-col items-center text-center mb-2 sm:mb-3.5 px-4 sm:px-6 shrink-0">
        <div className="reveal-mask">
          <h2 className="reveal-title font-montserrat font-extrabold text-2xl sm:text-4xl lg:text-5xl tracking-[0.03em]" style={{ color: 'var(--text-primary)' }}>
            Featured <span className="text-gold-gradient">Projects</span>
          </h2>
        </div>
        <div className="reveal-line w-16 h-1 bg-[#7F7255] mx-auto mt-1.5 sm:mt-2 mb-2 sm:mb-2.5 rounded-full" />

        {/* View All Projects Button positioned at bottom of Section Header */}
        <div className="reveal-child reveal-delay-1 flex justify-center">
          <Button
            to="/projects"
            size="sm"
            iconLeft={<FolderGit2 size={13} />}
            iconRight={<ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />}
          >
            View All Projects
          </Button>
        </div>
      </div>

      <div className="reveal-child reveal-delay-2 w-full flex-1 flex flex-col justify-center">
        {/* ─────────────────────────────────────────────
            ULTRA-WIDE 3D STACKED CARD CAROUSEL
        ───────────────────────────────────────────── */}
        <div
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="relative w-full max-w-[1720px] mx-auto flex items-center justify-center h-[280px] sm:h-[330px] md:h-[380px] lg:h-[420px] xl:h-[470px] 2xl:h-[520px] overflow-visible"
          style={{ perspective: '1400px' }}
        >
          {PROJECTS_DATA.map((project, idx) => {
            let offset = idx - currentIndex;
            if (offset < -1) offset += totalProjects;
            if (offset > 1) offset -= totalProjects;

            const isActive = offset === 0;
            const isPrev = offset === -1 || offset === totalProjects - 1;
            const isNext = offset === 1 || offset === -(totalProjects - 1);

            let transformStyle = '';
            let opacityStyle = 0;
            let zIndexStyle = 10;
            let pointerEvents = 'none';

            if (isActive) {
              transformStyle = 'translateX(0%) translateZ(0px) rotateY(0deg) scale(1)';
              opacityStyle = 1;
              zIndexStyle = 30;
              pointerEvents = 'auto';
            } else if (isPrev) {
              transformStyle = 'translateX(-50%) translateZ(-160px) rotateY(14deg) scale(0.88)';
              opacityStyle = 0.5;
              zIndexStyle = 20;
              pointerEvents = 'auto';
            } else if (isNext) {
              transformStyle = 'translateX(50%) translateZ(-160px) rotateY(-14deg) scale(0.88)';
              opacityStyle = 0.5;
              zIndexStyle = 20;
              pointerEvents = 'auto';
            } else {
              transformStyle = 'translateX(0%) translateZ(-300px) scale(0.7)';
              opacityStyle = 0;
              zIndexStyle = 5;
            }

            return (
              <div
                key={project.id}
                onClick={() => {
                  if (isPrev) handlePrev();
                  else if (isNext) handleNext();
                  else if (isActive) navigate(`/projects/${project.id}`);
                }}
                className={`absolute w-[92%] sm:w-[86%] lg:w-[80%] xl:w-[78%] max-w-[1320px] rounded-[20px] sm:rounded-[24px] border p-3 sm:p-4 lg:p-5 transition-all duration-500 ease-out cursor-pointer group ${isActive
                  ? isDark
                    ? 'border-[#FFD54F]/40 hover:border-[#FFD54F]/70'
                    : 'border-[#805D15]/50 hover:border-[#805D15]'
                  : isDark ? 'border-white/10 hover:border-white/20' : 'border-black/10 hover:border-black/20'
                  }`}
                style={{
                  transform: transformStyle,
                  opacity: opacityStyle,
                  zIndex: zIndexStyle,
                  pointerEvents: pointerEvents,
                  willChange: 'transform, opacity',
                  backgroundColor: 'var(--bg-card)',
                  boxShadow: isActive ? (isDark ? '0 24px 70px rgba(0,0,0,0.65)' : '0 16px 45px rgba(80,65,40,0.12)') : 'none',
                }}
              >
                {/* Wide Mockup Canvas with Live Paper Dither Shader */}
                <div
                  className="relative w-full h-[160px] sm:h-[200px] md:h-[235px] lg:h-[265px] xl:h-[305px] 2xl:h-[340px] rounded-[14px] sm:rounded-[18px] overflow-hidden border flex items-center justify-center transition-colors"
                  style={{
                    backgroundColor: isDark ? '#0A0908' : 'var(--bg-panel)',
                    borderColor: 'var(--border-card)',
                  }}
                >
                  {/* Live Shader (Mounted only for active card to save GPU resources) */}
                  <div
                    className="absolute inset-0 pointer-events-none transition-opacity duration-700"
                    style={{ opacity: isActive ? (isDark ? 0.85 : 0.45) : (isDark ? 0.25 : 0.15) }}
                  >
                    {isActive && (
                      <ShaderErrorBoundary fallback={null}>
                        <Dithering
                          speed={0.8}
                          shape="simplex"
                          type="4x4"
                          size={2.2}
                          scale={0.5}
                          colorBack="#00000000"
                          colorFront={project.accentColor || (isDark ? '#FFD54F' : '#9E8A60')}
                          className="w-full h-full object-cover"
                        />
                      </ShaderErrorBoundary>
                    )}
                  </div>

                  {/* Dark Vignette Overlay */}
                  <div
                    className="absolute inset-0 pointer-events-none transition-all duration-300"
                    style={{
                      background: isDark
                        ? 'radial-gradient(ellipse at 50% 50%, rgba(10,9,8,0.1) 0%, rgba(10,9,8,0.85) 85%, #000000 100%)'
                        : 'radial-gradient(ellipse at 50% 50%, rgba(250,248,244,0.05) 0%, rgba(230,224,211,0.45) 85%, rgba(215,205,188,0.75) 100%)',
                    }}
                  />

                  {/* Status Badges */}
                  {isActive && (
                    <div className="absolute top-3 right-3 z-20 hidden sm:flex items-center gap-1.5">
                      {project.isTurnedOver ? (
                        <div
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border backdrop-blur-md text-[10px] font-mono shadow-md"
                          style={{
                            backgroundColor: 'var(--mobile-menu-bg)',
                            borderColor: 'var(--border-pill)',
                            color: 'var(--gold)',
                          }}
                        >
                          <ShieldCheck size={12} className="text-[#805D15] dark:text-[#FFD54F]" />
                          <span>Institutional Capstone</span>
                        </div>
                      ) : project.liveUrl ? (
                        <div
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-emerald-500/30 backdrop-blur-md text-[10px] font-mono text-emerald-600 dark:text-emerald-400 shadow-md"
                          style={{
                            backgroundColor: 'var(--mobile-menu-bg)',
                          }}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span>Live Platform</span>
                        </div>
                      ) : null}
                    </div>
                  )}

                  {/* Mockup Image Slot or Placeholder */}
                  {project.mockupImage ? (
                    <img
                      src={project.mockupImage}
                      alt={`${project.title} Mockup`}
                      className="relative z-10 max-h-[92%] max-w-[94%] object-contain rounded-xl transition-transform duration-500 group-hover:scale-[1.02]"
                      style={{ filter: 'drop-shadow(0 14px 28px var(--shadow-mockup))' }}
                    />
                  ) : (
                    <div className="relative z-10 flex flex-col items-center justify-center text-center p-3 space-y-2">
                      <div
                        className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border flex items-center justify-center text-[#805D15] dark:text-[#FFD54F] shadow-lg backdrop-blur-md group-hover:border-[#805D15]/40 dark:group-hover:border-[#FFD54F]/40 group-hover:scale-105 transition-all"
                        style={{
                          backgroundColor: 'var(--bg-pill)',
                          borderColor: 'var(--border-pill)',
                        }}
                      >
                        {project.deviceType === 'mobile' ? (
                          <Smartphone size={28} />
                        ) : (
                          <Terminal size={28} />
                        )}
                      </div>

                      <div className="space-y-0.5">
                        <p className="font-montserrat font-bold text-base sm:text-lg tracking-wide" style={{ color: 'var(--text-primary)' }}>
                          {project.title}
                        </p>
                        <p className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>
                          {project.category}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Footer: Title + Tech Pills + Action */}
                <div
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2.5 border-t mt-2"
                  style={{ borderColor: 'var(--border-card)' }}
                >
                  {/* Title */}
                  <div className="flex items-center gap-2.5">
                    <h3
                      className="font-montserrat font-extrabold text-lg sm:text-xl tracking-tight group-hover:text-[#805D15] dark:group-hover:text-[#FFD54F] transition-colors"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {project.title}
                    </h3>
                  </div>

                  {/* Tech Pills & Actions */}
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    {project.techStack.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="text-[10px] sm:text-[10.5px] font-mono px-2.5 py-0.5 rounded-md border"
                        style={{
                          color: 'var(--text-muted)',
                          backgroundColor: 'var(--bg-pill)',
                          borderColor: 'var(--border-pill)',
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── CAROUSEL BOTTOM CONTROLS & "VIEW ALL PROJECTS" ACTION ── */}
        <div className="w-full max-w-md mx-auto flex flex-col items-center gap-2.5 mt-2.5 sm:mt-3 px-4">

          {/* Carousel Navigation Controller: Left Arrow + Dots + Right Arrow */}
          <div className="flex items-center gap-3.5">
            <button
              onClick={handlePrev}
              aria-label="Previous project"
              className="w-8 h-8 rounded-full border flex items-center justify-center hover:text-[#805D15] dark:hover:text-[#FFD54F] hover:border-[#805D15]/40 dark:hover:border-[#FFD54F]/40 transition-all duration-200 cursor-pointer shadow-md active:scale-95"
              style={{
                backgroundColor: 'var(--bg-pill)',
                borderColor: 'var(--border-pill)',
                color: 'var(--text-primary)',
              }}
            >
              <ChevronLeft size={16} />
            </button>

            {/* Indicator Dots */}
            <div className="flex items-center gap-1.5">
              {PROJECTS_DATA.map((p, idx) => {
                const isActive = idx === currentIndex;
                return (
                  <button
                    key={p.id}
                    onClick={() => setCurrentIndex(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                    className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${isActive
                      ? isDark
                        ? 'w-7 bg-gradient-to-r from-[#FFD54F] to-[#C6B99B] shadow-[0_0_10px_rgba(255,213,79,0.5)]'
                        : 'w-7 bg-gradient-to-r from-[#805D15] to-[#A07B2D] shadow-[0_0_10px_rgba(122,85,16,0.4)]'
                      : isDark ? 'w-2 bg-white/20 hover:bg-white/40' : 'w-2 bg-black/20 hover:bg-black/40'
                      }`}
                  />
                );
              })}
            </div>

            {/* Right Arrow */}
            <button
              onClick={handleNext}
              aria-label="Next project"
              className="w-8 h-8 rounded-full border flex items-center justify-center hover:text-[#805D15] dark:hover:text-[#FFD54F] hover:border-[#805D15]/40 dark:hover:border-[#FFD54F]/40 transition-all duration-200 cursor-pointer shadow-md active:scale-95"
              style={{
                backgroundColor: 'var(--bg-pill)',
                borderColor: 'var(--border-pill)',
                color: 'var(--text-primary)',
              }}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

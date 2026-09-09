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
          <h2 className="reveal-title font-montserrat font-extrabold text-2xl sm:text-4xl lg:text-5xl text-white tracking-[0.03em]">
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
                className={`absolute w-[92%] sm:w-[86%] lg:w-[80%] xl:w-[78%] max-w-[1320px] rounded-[20px] sm:rounded-[24px] bg-[#0E0C0A] border p-3 sm:p-4 lg:p-5 shadow-[0_24px_70px_rgba(0,0,0,0.95)] transition-all duration-500 ease-out cursor-pointer group ${isActive
                  ? 'border-[#FFD54F]/30 hover:border-[#FFD54F]/60 hover:shadow-[0_24px_80px_rgba(255,213,79,0.15)]'
                  : 'border-white/15 hover:border-white/30'
                  }`}
                style={{
                  transform: transformStyle,
                  opacity: opacityStyle,
                  zIndex: zIndexStyle,
                  pointerEvents: pointerEvents,
                  willChange: 'transform, opacity',
                }}
              >
                {/* Wide Mockup Canvas with Live Paper Dither Shader */}
                <div className="relative w-full h-[160px] sm:h-[200px] md:h-[235px] lg:h-[265px] xl:h-[305px] 2xl:h-[340px] rounded-[14px] sm:rounded-[18px] overflow-hidden bg-[#0A0908] border border-white/10 flex items-center justify-center">
                  {/* Live Shader (Mounted only for active card to save GPU resources) */}
                  <div
                    className="absolute inset-0 pointer-events-none transition-opacity duration-700"
                    style={{ opacity: isActive ? 0.85 : 0.25 }}
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
                          colorFront={project.accentColor || '#FFD54F'}
                          className="w-full h-full object-cover"
                        />
                      </ShaderErrorBoundary>
                    )}
                  </div>

                  {/* Dark Vignette Overlay */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        'radial-gradient(ellipse at 50% 50%, rgba(10,9,8,0.1) 0%, rgba(10,9,8,0.85) 85%, #000000 100%)',
                    }}
                  />

                  {/* Status Badges */}
                  {isActive && (
                    <div className="absolute top-3 right-3 z-20 hidden sm:flex items-center gap-1.5">
                      {project.isTurnedOver ? (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/80 border border-[#C6B99B]/30 backdrop-blur-md text-[10px] font-mono text-[#C6B99B] shadow-lg">
                          <ShieldCheck size={12} className="text-[#FFD54F]" />
                          <span>Institutional Capstone</span>
                        </div>
                      ) : project.liveUrl ? (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/80 border border-emerald-500/30 backdrop-blur-md text-[10px] font-mono text-emerald-400 shadow-lg">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
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
                      className="relative z-10 max-h-[92%] max-w-[94%] object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.9)] rounded-xl transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                  ) : (
                    <div className="relative z-10 flex flex-col items-center justify-center text-center p-3 space-y-2">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/[0.04] border border-white/15 flex items-center justify-center text-[#FFD54F] shadow-2xl backdrop-blur-md group-hover:border-[#FFD54F]/40 group-hover:scale-105 transition-all">
                        {project.deviceType === 'mobile' ? (
                          <Smartphone size={28} />
                        ) : (
                          <Terminal size={28} />
                        )}
                      </div>

                      <div className="space-y-0.5">
                        <p className="font-montserrat font-bold text-base sm:text-lg text-white tracking-wide">
                          {project.title}
                        </p>
                        <p className="text-[10px] font-mono text-neutral-400">
                          {project.category}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Footer: Title + Tech Pills + Action */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2.5 border-t border-white/5 mt-2">
                  {/* Title */}
                  <div className="flex items-center gap-2.5">
                    <h3 className="font-montserrat font-extrabold text-lg sm:text-xl text-white tracking-tight group-hover:text-[#FFD54F] transition-colors">
                      {project.title}
                    </h3>
                  </div>

                  {/* Tech Pills & Actions */}
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    {project.techStack.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="text-[10px] sm:text-[10.5px] font-mono text-neutral-300 bg-white/[0.04] px-2.5 py-0.5 rounded-md border border-white/10"
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
              className="w-8 h-8 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center text-white hover:text-[#FFD54F] hover:border-[#FFD54F]/40 hover:bg-white/[0.08] transition-all duration-200 cursor-pointer shadow-lg active:scale-95"
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
                      ? 'w-7 bg-gradient-to-r from-[#FFD54F] to-[#C6B99B] shadow-[0_0_10px_rgba(255,213,79,0.5)]'
                      : 'w-2 bg-white/20 hover:bg-white/40'
                      }`}
                  />
                );
              })}
            </div>

            {/* Right Arrow */}
            <button
              onClick={handleNext}
              aria-label="Next project"
              className="w-8 h-8 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center text-white hover:text-[#FFD54F] hover:border-[#FFD54F]/40 hover:bg-white/[0.08] transition-all duration-200 cursor-pointer shadow-lg active:scale-95"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect, useRef, Component } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Dithering } from '@paper-design/shaders-react';
import { Menu, X, Download } from 'lucide-react';
import DitherCascadeText from './DitherCascadeText';
import { useSmoothScroll } from '../context/SmoothScrollContext';
import resumePdf from '../assets/Resume.pdf';

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

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { scrollTo } = useSmoothScroll();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [hoveredNav, setHoveredNav] = useState(null);

  const isProjectsRoute = location.pathname.startsWith('/projects');

  const navLinks = [
    { name: 'Tech Stack', href: '#tech-stack', sectionId: 'tech-stack' },
    { name: 'About Me', href: '#about', sectionId: 'about' },
    { name: 'Certifications', href: '#certifications', sectionId: 'certifications' },
    { name: 'Projects', href: '#projects', sectionId: 'projects' },
    { name: 'Contact', href: '#contact', sectionId: 'contact' },
  ];

  // RAF-throttled scroll listener for sticky compacting & active section tracking
  useEffect(() => {
    let ticking = false;

    const updateActiveSection = () => {
      setScrolled(window.scrollY > 20);

      if (isProjectsRoute) {
        setActiveSection('projects');
        return;
      }

      // Top of page is always Hero
      if (window.scrollY < 80) {
        setActiveSection('hero');
        return;
      }

      // Near bottom of page is always Contact
      const scrollBottom = window.innerHeight + window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      if (scrollBottom >= docHeight - 80) {
        setActiveSection('contact');
        return;
      }

      // Ordered list of sections to test against viewport focus line (45% viewport height)
      const sections = [
        { id: 'contact', el: document.getElementById('contact') },
        { id: 'projects', el: document.getElementById('projects') },
        { id: 'certifications', el: document.getElementById('certifications') },
        { id: 'about', el: document.getElementById('about') },
        { id: 'tech-stack', el: document.getElementById('tech-stack') },
        { id: 'hero', el: document.getElementById('hero') },
      ];

      const focusY = window.innerHeight * 0.45;
      for (const { id, el } of sections) {
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= focusY && rect.bottom >= focusY) {
            setActiveSection(id);
            return;
          }
        }
      }
    };

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateActiveSection();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    updateActiveSection();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [isProjectsRoute]);

  const handleLinkClick = (e, link) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (location.pathname !== '/') {
      navigate(`/#${link.sectionId}`);
      setTimeout(() => {
        scrollTo(`#${link.sectionId}`, { offset: 0 });
      }, 100);
    } else {
      scrollTo(`#${link.sectionId}`, { offset: 0 });
    }
  };

  const handleBrandClick = (e) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      navigate('/');
    } else {
      scrollTo(0);
    }
  };

  return (
    <header className="fixed inset-x-0 top-2.5 sm:top-3.5 z-50 w-full px-3 sm:px-6 lg:px-10 max-w-[1720px] mx-auto pointer-events-none transition-all duration-300">
      <div
        className={`pointer-events-auto w-full rounded-2xl sm:rounded-full transition-all duration-300 flex items-center justify-between border ${
          scrolled
            ? 'bg-black/85 backdrop-blur-xl border-[#C6B99B]/35 shadow-[0_12px_36px_rgba(0,0,0,0.9)] py-2 sm:py-2.5 px-4 sm:px-6'
            : 'bg-black/70 backdrop-blur-lg border-white/10 shadow-[0_8px_25px_rgba(0,0,0,0.6)] py-2.5 sm:py-3 px-4 sm:px-7'
        }`}
      >
        {/* ── LEFT: Brand with Dither Glyph Cascade ── */}
        <div className="flex items-center gap-3 sm:gap-4 lg:gap-6">
          <a
            href="/"
            onClick={handleBrandClick}
            className="flex items-center gap-2 group cursor-pointer"
            title="Return to Home"
          >
            <span className="font-montserrat font-black text-lg sm:text-xl tracking-[0.03em] uppercase select-none text-gold-gradient">
              <DitherCascadeText
                text="Neil Lugue"
                staggerMs={25}
                stepDurationMs={35}
              />
            </span>
          </a>
        </div>

        {/* ── CENTER: Interactive Nav Links with Dither Shimmer Aura ── */}
        <nav className="hidden md:flex items-center gap-1.5 p-1 rounded-full bg-white/[0.02] border border-white/5 backdrop-blur-md">
          {navLinks.map((link) => {
            const isActive = isProjectsRoute
              ? link.sectionId === 'projects'
              : activeSection === link.sectionId;
            const isHovered = hoveredNav === link.sectionId;

            return (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link)}
                onMouseEnter={() => setHoveredNav(link.sectionId)}
                onMouseLeave={() => setHoveredNav(null)}
                className={`relative px-4 py-1.5 rounded-full font-montserrat font-semibold text-xs tracking-wider uppercase transition-all duration-200 cursor-pointer select-none flex items-center gap-1.5 overflow-hidden group ${
                  isActive
                    ? 'text-[#FFD54F]'
                    : 'text-neutral-300 hover:text-white'
                }`}
              >
                {/* Dynamic WebGL Paper Dithering Shimmer on Hover/Active */}
                {(isActive || isHovered) && (
                  <div className="absolute inset-0 pointer-events-none rounded-full overflow-hidden opacity-30 group-hover:opacity-60 transition-opacity duration-300">
                    <ShaderBoundary fallback={<div className="w-full h-full bg-[#FFD54F]/10" />}>
                      <Dithering
                        speed={0.8}
                        shape="simplex"
                        type="4x4"
                        size={1.8}
                        scale={0.5}
                        colorBack="#00000000"
                        colorFront={isActive ? '#FFD54F' : '#C6B99B'}
                        className="w-full h-full object-cover"
                      />
                    </ShaderBoundary>
                  </div>
                )}

                {/* Background Pill Glow */}
                <div
                  className={`absolute inset-0 rounded-full transition-all duration-200 ${
                    isActive
                      ? 'bg-white/[0.08] border border-[#FFD54F]/40 shadow-[0_0_15px_rgba(255,213,79,0.2)]'
                      : isHovered
                      ? 'bg-white/[0.04] border border-white/10'
                      : 'border border-transparent'
                  }`}
                />

                <span className="relative z-10">{link.name}</span>
              </a>
            );
          })}
        </nav>

        {/* ── RIGHT: Resume / CV Download Button ── */}
        <div className="hidden md:flex items-center min-w-[110px] justify-end">
          <a
            href={resumePdf}
            download="Neil_Adrian_Lugue_Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative px-3.5 py-1.5 rounded-full bg-white/[0.04] hover:bg-[#FFD54F] border border-white/10 hover:border-[#FFD54F] text-neutral-300 hover:text-black font-montserrat font-semibold text-xs tracking-wider uppercase transition-all duration-200 shadow-sm flex items-center gap-1.5 cursor-pointer"
            title="Download Resume"
          >
            <Download size={13} className="text-[#FFD54F] group-hover:text-black transition-colors" />
            <span>Resume</span>
          </a>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-white p-1.5 rounded-xl bg-white/[0.05] border border-white/10 focus:outline-none hover:text-[#FFD54F] transition-colors"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* ── MOBILE EXPANDED DRAWER ── */}
      {mobileMenuOpen && (
        <div className="pointer-events-auto md:hidden mt-2 rounded-2xl bg-black/95 backdrop-blur-2xl border border-white/10 p-5 shadow-2xl transition-all duration-300 animate-fadeIn">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link)}
                className="flex items-center justify-between py-2 px-3 rounded-xl bg-white/[0.02] border border-white/5 text-white hover:text-[#FFD54F] hover:bg-white/[0.06] font-montserrat font-semibold text-sm tracking-wider uppercase transition-all"
              >
                <span>{link.name}</span>
              </a>
            ))}

            {/* Mobile Resume Download Button */}
            <a
              href={resumePdf}
              download="Neil_Adrian_Lugue_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between py-2.5 px-3 rounded-xl bg-[#FFD54F]/10 border border-[#FFD54F]/30 text-[#FFD54F] font-montserrat font-bold text-xs tracking-wider uppercase transition-all mt-1"
            >
              <div className="flex items-center gap-2">
                <Download size={15} />
                <span>Download Resume</span>
              </div>
              <span className="text-[10px] font-mono opacity-75">PDF</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

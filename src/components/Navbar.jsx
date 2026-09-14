import React, { useState, useEffect, useRef, Component } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Dithering } from '@paper-design/shaders-react';
import { Menu, X, Download, Sun, Moon } from 'lucide-react';
import DitherCascadeText from './DitherCascadeText';
import { useSmoothScroll } from '../context/SmoothScrollContext';
import { useTheme } from '../context/ThemeContext';
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
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
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
            ? 'backdrop-blur-xl shadow-[0_12px_36px_rgba(0,0,0,0.4)] py-2 sm:py-2.5 px-4 sm:px-6'
            : 'backdrop-blur-lg shadow-[0_8px_25px_rgba(0,0,0,0.2)] py-2.5 sm:py-3 px-4 sm:px-7'
        }`}
        style={{
          backgroundColor: scrolled ? (isDark ? 'rgba(0,0,0,0.85)' : 'rgba(244,241,235,0.92)') : (isDark ? 'rgba(0,0,0,0.70)' : 'rgba(244,241,235,0.80)'),
          borderColor: scrolled ? (isDark ? 'rgba(198,185,155,0.35)' : 'rgba(138,115,85,0.35)') : (isDark ? 'rgba(255,255,255,0.10)' : 'rgba(138,115,85,0.15)'),
        }}
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
        <nav className={`hidden md:flex items-center gap-1.5 p-1 rounded-full border backdrop-blur-md ${isDark ? 'bg-white/[0.03] border-white/10' : 'bg-[#E5DFD2] border-[rgba(100,75,35,0.25)]'}`}>
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
                className={`relative px-4 py-1.5 rounded-full font-montserrat font-bold text-xs tracking-wider uppercase transition-all duration-200 cursor-pointer select-none flex items-center gap-1.5 overflow-hidden group ${
                  isActive
                    ? isDark ? 'text-[#FFD54F]' : 'text-[#805D15]'
                    : isDark ? 'text-neutral-200 hover:text-white' : 'text-[#24201A] hover:text-[#805D15]'
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
                        colorFront={isActive ? (isDark ? '#FFD54F' : '#9E6E00') : (isDark ? '#C6B99B' : '#805D15')}
                        className="w-full h-full object-cover"
                      />
                    </ShaderBoundary>
                  </div>
                )}

                {/* Background Pill Glow */}
                <div
                  className={`absolute inset-0 rounded-full transition-all duration-200 ${
                    isActive
                      ? isDark
                        ? 'bg-white/[0.08] border border-[#FFD54F]/40 shadow-[0_0_15px_rgba(255,213,79,0.2)]'
                        : 'bg-[#FAF8F4] border border-[rgba(128,93,21,0.40)] shadow-sm'
                      : isHovered
                      ? isDark
                        ? 'bg-white/[0.04] border border-white/10'
                        : 'bg-black/[0.05] border border-[rgba(100,75,35,0.15)]'
                      : 'border border-transparent'
                  }`}
                />

                <span className="relative z-10">{link.name}</span>
              </a>
            );
          })}
        </nav>

        {/* ── RIGHT: Theme Toggle + Resume / CV Download Button ── */}
        <div className="hidden md:flex items-center gap-2 min-w-[150px] justify-end">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className={`group relative p-2 rounded-full border transition-all duration-200 cursor-pointer shadow-sm ${
              isDark
                ? 'bg-white/[0.06] hover:bg-white/[0.12] border-white/15 hover:border-[#FFD54F]/60 text-[#FFD54F]'
                : 'bg-[#FAF8F4] hover:bg-[#E5DFD2] border-[rgba(100,75,35,0.35)] hover:border-[#805D15] text-[#805D15]'
            }`}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? <Sun size={15} className="text-[#FFD54F]" /> : <Moon size={15} className="text-[#805D15]" />}
          </button>
          <a
            href={resumePdf}
            download="Neil_Adrian_Lugue_Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className={`group relative px-3.5 py-1.5 rounded-full border font-montserrat font-bold text-xs tracking-wider uppercase transition-all duration-200 shadow-sm flex items-center gap-1.5 cursor-pointer ${
              isDark
                ? 'bg-white/[0.06] hover:bg-[#FFD54F] border-white/15 hover:border-[#FFD54F] text-white hover:text-black'
                : 'bg-[#FAF8F4] hover:bg-[#805D15] border-[rgba(100,75,35,0.35)] hover:border-[#805D15] text-[#0A0907] hover:text-white'
            }`}
            title="Download Resume"
          >
            <Download size={13} className={`transition-colors ${isDark ? 'text-[#FFD54F] group-hover:text-black' : 'text-[#805D15] group-hover:text-white'}`} />
            <span>Resume</span>
          </a>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={`md:hidden p-1.5 rounded-xl border focus:outline-none transition-colors shadow-sm ${
            isDark
              ? 'text-white bg-white/[0.06] border-white/15 hover:text-[#FFD54F]'
              : 'text-[#0A0907] bg-[#FAF8F4] border-[rgba(100,75,35,0.3)] hover:text-[#805D15]'
          }`}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* ── MOBILE EXPANDED DRAWER ── */}
      {mobileMenuOpen && (
        <div
          className="pointer-events-auto md:hidden mt-2 rounded-2xl backdrop-blur-2xl border p-5 shadow-2xl transition-all duration-300 animate-fadeIn"
          style={{
            backgroundColor: isDark ? 'rgba(0,0,0,0.95)' : 'rgba(244,241,235,0.97)',
            borderColor: isDark ? 'rgba(255,255,255,0.10)' : 'rgba(138,115,85,0.20)',
          }}
        >
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link)}
                className={`flex items-center justify-between py-2 px-3 rounded-xl border font-montserrat font-semibold text-sm tracking-wider uppercase transition-all ${
                  isDark
                    ? 'bg-white/[0.02] border-white/5 text-white hover:text-[#FFD54F] hover:bg-white/[0.06]'
                    : 'bg-black/[0.02] border-black/5 text-neutral-800 hover:text-[#C8930A] hover:bg-black/[0.05]'
                }`}
              >
                <span>{link.name}</span>
              </a>
            ))}

            {/* Mobile Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`flex items-center gap-2 py-2.5 px-3 rounded-xl border font-montserrat font-bold text-xs tracking-wider uppercase transition-all ${
                isDark
                  ? 'bg-white/[0.03] border-white/10 text-neutral-300 hover:text-[#FFD54F]'
                  : 'bg-black/[0.03] border-black/10 text-neutral-600 hover:text-[#C8930A]'
              }`}
            >
              {isDark ? <Sun size={15} /> : <Moon size={15} />}
              <span>{isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}</span>
            </button>

            {/* Mobile Resume Download Button */}
            <a
              href={resumePdf}
              download="Neil_Adrian_Lugue_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center justify-between py-2.5 px-3 rounded-xl border font-montserrat font-bold text-xs tracking-wider uppercase transition-all mt-1 ${
                isDark
                  ? 'bg-[#FFD54F]/10 border-[#FFD54F]/30 text-[#FFD54F]'
                  : 'bg-[#C8930A]/10 border-[#C8930A]/30 text-[#C8930A]'
              }`}
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

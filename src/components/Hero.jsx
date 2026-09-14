import React, { Component, useState, useEffect, useRef, useCallback } from 'react';
import { HalftoneDots } from '@paper-design/shaders-react';
import Button from './Button';
import DitherPortrait from './DitherPortrait';
import { ArrowUpRight, Mail, Download } from 'lucide-react';
import useInView from '../hooks/useInView';
import resumePdf from '../assets/Resume.pdf';

class ShaderIconErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

/* ─────────────────────────────────────────────
   Dither Glyph Cascade Component
   Progressive wave: Letter -> █ -> ▓ -> ▒ -> ░ -> Letter
   Strictly mutates character glyphs with 0 background bleed
───────────────────────────────────────────── */
const DITHER_STEPS = ['█', '▓', '▒', '░'];

export function DitherCascadeText({
  text,
  className = '',
  charClassName = '',
  staggerMs = 35,
  stepDurationMs = 45,
}) {
  const [chars, setChars] = useState(() =>
    text.split('').map((c) => ({ char: c, state: 0 }))
  );
  const [isAnimating, setIsAnimating] = useState(false);
  const timeoutsRef = useRef([]);

  const clearAllTimeouts = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  };

  const triggerCascade = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    clearAllTimeouts();

    const charArray = text.split('');

    charArray.forEach((originalChar, charIndex) => {
      if (originalChar === ' ') return;

      const charStartDelay = charIndex * staggerMs;

      // Step 1: █ (100% density)
      const t1 = setTimeout(() => {
        setChars((prev) => {
          const next = [...prev];
          next[charIndex] = { char: DITHER_STEPS[0], state: 1 };
          return next;
        });
      }, charStartDelay);

      // Step 2: ▓ (75% density)
      const t2 = setTimeout(() => {
        setChars((prev) => {
          const next = [...prev];
          next[charIndex] = { char: DITHER_STEPS[1], state: 2 };
          return next;
        });
      }, charStartDelay + stepDurationMs);

      // Step 3: ▒ (50% density)
      const t3 = setTimeout(() => {
        setChars((prev) => {
          const next = [...prev];
          next[charIndex] = { char: DITHER_STEPS[2], state: 3 };
          return next;
        });
      }, charStartDelay + stepDurationMs * 2);

      // Step 4: ░ (25% density)
      const t4 = setTimeout(() => {
        setChars((prev) => {
          const next = [...prev];
          next[charIndex] = { char: DITHER_STEPS[3], state: 4 };
          return next;
        });
      }, charStartDelay + stepDurationMs * 3);

      // Step 5: Settle back to original character
      const t5 = setTimeout(() => {
        setChars((prev) => {
          const next = [...prev];
          next[charIndex] = { char: originalChar, state: 0 };
          return next;
        });

        // Reset animation state after the last character settles
        if (
          charIndex === charArray.length - 1 ||
          (charIndex === charArray.length - 2 &&
            charArray[charArray.length - 1] === ' ')
        ) {
          setIsAnimating(false);
        }
      }, charStartDelay + stepDurationMs * 4);

      timeoutsRef.current.push(t1, t2, t3, t4, t5);
    });
  }, [text, isAnimating, staggerMs, stepDurationMs]);

  useEffect(() => {
    setChars(text.split('').map((c) => ({ char: c, state: 0 })));
    return clearAllTimeouts;
  }, [text]);

  return (
    <span
      onMouseEnter={triggerCascade}
      onClick={triggerCascade}
      onTouchStart={triggerCascade}
      className={`inline-block cursor-pointer select-none whitespace-pre ${className}`}
    >
      {chars.map((item, idx) => {
        const isDither = item.state > 0;
        const isSpace = item.char === ' ';
        return (
          <span
            key={idx}
            className={`inline-block transition-transform duration-75 ${isDither ? 'text-[#FFD54F] scale-105' : ''
              } ${charClassName}`}
            style={{
              textShadow: isDither
                ? '0 0 12px rgba(255, 213, 79, 0.8), 0 0 24px rgba(255, 213, 79, 0.4)'
                : 'inherit',
            }}
          >
            {isSpace ? '\u00A0' : item.char}
          </span>
        );
      })}
    </span>
  );
}

/* ─────────────────────────────────────────────
   Hero Component
───────────────────────────────────────────── */
export default function Hero() {
  const [heroRef, isRevealed] = useInView({ threshold: 0.15, once: false });

  return (
    <div
      ref={heroRef}
      className={`w-full max-w-[1680px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 lg:gap-8 xl:gap-14 items-center my-auto py-2 sm:py-4 lg:py-6 xl:py-8 ${isRevealed ? 'is-revealed' : ''
        }`}
    >
      {/* LEFT COLUMN: Clean Typography with Dither Glyph Cascade (50% split) */}
      <div className="lg:col-span-6 flex flex-col items-start justify-center space-y-2.5 sm:space-y-3.5 lg:space-y-4 xl:space-y-5">

        {/* Heading & Dither Cascade Headline */}
        <div className="space-y-1 sm:space-y-1.5 w-full">

          {/* Large Name with Dither Glyph Cascade */}
          <div className="relative group inline-block reveal-child reveal-delay-0">
            <h1 className="relative font-montserrat font-black text-[32px] xs:text-4xl sm:text-6xl md:text-7xl lg:text-[72px] xl:text-[88px] 2xl:text-[100px] leading-[1.05] tracking-[0.02em] uppercase select-none text-gold-gradient">
              <DitherCascadeText
                text="Neil Lugue"
                staggerMs={40}
                stepDurationMs={50}
              />
            </h1>
          </div>

          {/* Subtitle with Dither Glyph Cascade */}
          <div className="pt-0.5 sm:pt-1 reveal-child reveal-delay-1">
            <p className="font-montserrat font-bold text-base sm:text-xl lg:text-[22px] xl:text-[26px] tracking-[0.03em]" style={{ color: 'var(--text-primary)' }}>
              <DitherCascadeText
                text="Full-Stack Developer · AI & Web Apps"
                className="hover:text-[#FFD54F] transition-colors"
                staggerMs={20}
                stepDurationMs={35}
              />
            </p>
          </div>
        </div>

        {/* Editorial Narrative Sub-tagline */}
        <p className="font-normal text-[14px] sm:text-[15px] lg:text-[16px] xl:text-[17px] leading-[1.7] lg:leading-[1.8] max-w-xl reveal-child reveal-delay-2" style={{ color: 'var(--text-muted)' }}>
          I build full-stack apps and mobile experiences, from AI-assisted tools to scalable backend systems. Comfortable across{' '}
          <span className="font-semibold text-[#805D15] dark:text-[#FFD54F]">React Native</span>,{' '}
          <span className="font-semibold text-[#805D15] dark:text-[#FFD54F]">Python</span>,{' '}
          <span className="font-semibold text-[#805D15] dark:text-[#FFD54F]">React</span>, and{' '}
          <span className="font-semibold text-[#805D15] dark:text-[#FFD54F]">PostgreSQL</span>.
        </p>

        {/* Action Buttons & Socials */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-3.5 pt-1.5 reveal-child reveal-delay-3">
          <Button
            href="#projects"
            className="w-full sm:w-auto sm:min-w-[190px]"
            iconRight={<ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-[#805D15] dark:text-[#FFD54F]" />}
          >
            View Projects
          </Button>
          <Button
            href={resumePdf}
            download="Neil_Adrian_Lugue_Resume.pdf"
            target="_blank"
            className="w-full sm:w-auto sm:min-w-[190px]"
            iconLeft={<Download size={15} className="text-[#805D15] dark:text-[#FFD54F]" />}
          >
            Download Resume
          </Button>
        </div>

        {/* Social Icons matching Paper styling */}
        <div className="flex items-center gap-4 pt-1 reveal-child reveal-delay-4">
          {/* LinkedIn */}
          <a
            href="https://www.linkedin.com/in/neil-adrian-j-lugue-6b63b4375/"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block transition-transform hover:scale-110 active:scale-95 duration-200"
            title="Neil Lugue on LinkedIn"
            aria-label="LinkedIn Profile"
          >
            <div className="w-[42px] h-[42px] rounded-[10px] bg-[#F2F1E8] overflow-hidden flex items-center justify-center shadow-lg group-hover:ring-2 group-hover:ring-[#C6B99B] transition-all">
              <img
                src="/assets/linkedin.png"
                alt="LinkedIn"
                className="w-6 h-6 object-contain filter contrast-125 group-hover:scale-105 transition-transform"
                loading="eager"
              />
            </div>
          </a>

          {/* GitHub */}
          <a
            href="https://github.com/AdrianLugue"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block transition-transform hover:scale-110 active:scale-95 duration-200"
            title="Neil Lugue on GitHub"
            aria-label="GitHub Profile"
          >
            <div className="w-[42px] h-[42px] rounded-full bg-[#D3D2CE] overflow-hidden flex items-center justify-center shadow-lg group-hover:ring-2 group-hover:ring-[#C6B99B] transition-all">
              <img
                src="/assets/github.png"
                alt="GitHub"
                className="w-6 h-6 object-contain filter contrast-125 group-hover:scale-105 transition-transform"
                loading="eager"
              />
            </div>
          </a>
        </div>
      </div>

      {/* RIGHT COLUMN: Frameless Atmospheric Dithered Portrait (50% split - Half Page) */}
      <div className="lg:col-span-6 flex justify-center items-center select-none reveal-child reveal-delay-1 w-full pt-6 sm:pt-8 lg:pt-0">
        <DitherPortrait
          className="w-full max-w-[340px] xs:max-w-[390px] sm:max-w-[460px] md:max-w-[520px] lg:max-w-[560px] xl:max-w-[680px] 2xl:max-w-[780px] h-[390px] xs:h-[450px] sm:h-[520px] md:h-[580px] lg:h-[min(700px,82vh)] xl:h-[min(780px,85vh)] 2xl:h-[min(840px,88vh)]"
        />
      </div>

    </div>
  );
}

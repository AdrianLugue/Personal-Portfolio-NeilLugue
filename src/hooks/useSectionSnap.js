import { useEffect, useRef, useState, useCallback } from 'react';
import { useSmoothScroll } from '../context/SmoothScrollContext';

const SECTION_IDS = ['hero', 'tech-stack', 'about', 'projects'];

export function useSectionSnap() {
  const { scrollTo } = useSmoothScroll();
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const isAnimatingRef = useRef(false);
  const currentIdxRef = useRef(0);
  const touchStartYRef = useRef(0);

  // Sync ref with state
  const goToSection = useCallback((index) => {
    const clampedIndex = Math.max(0, Math.min(SECTION_IDS.length - 1, index));
    currentIdxRef.current = clampedIndex;
    setCurrentSectionIndex(clampedIndex);
    isAnimatingRef.current = true;

    const targetId = SECTION_IDS[clampedIndex];
    scrollTo(`#${targetId}`, {
      duration: 1.05,
      offset: 0,
      onComplete: () => {
        setTimeout(() => {
          isAnimatingRef.current = false;
        }, 150);
      },
    });

    // Fallback timer to unlock in case onComplete isn't called
    setTimeout(() => {
      isAnimatingRef.current = false;
    }, 1100);
  }, [scrollTo]);

  useEffect(() => {
    let lastScrollTime = 0;
    const WHEEL_THRESHOLD = 30;
    const COOLDOWN_MS = 900;

    const handleWheel = (e) => {
      // Don't intercept if modifier keys pressed (e.g. pinch zoom)
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      const now = Date.now();
      if (Math.abs(e.deltaY) < WHEEL_THRESHOLD) return;

      e.preventDefault();

      if (isAnimatingRef.current || now - lastScrollTime < COOLDOWN_MS) {
        return;
      }

      lastScrollTime = now;
      if (e.deltaY > 0) {
        // Scroll Down
        if (currentIdxRef.current < SECTION_IDS.length - 1) {
          goToSection(currentIdxRef.current + 1);
        }
      } else if (e.deltaY < 0) {
        // Scroll Up
        if (currentIdxRef.current > 0) {
          goToSection(currentIdxRef.current - 1);
        }
      }
    };

    const handleKeyDown = (e) => {
      if (['ArrowDown', 'PageDown', ' '].includes(e.key)) {
        if (currentIdxRef.current < SECTION_IDS.length - 1) {
          e.preventDefault();
          goToSection(currentIdxRef.current + 1);
        }
      } else if (['ArrowUp', 'PageUp'].includes(e.key)) {
        if (currentIdxRef.current > 0) {
          e.preventDefault();
          goToSection(currentIdxRef.current - 1);
        }
      } else if (e.key === 'Home') {
        e.preventDefault();
        goToSection(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        goToSection(SECTION_IDS.length - 1);
      }
    };

    const handleTouchStart = (e) => {
      touchStartYRef.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e) => {
      if (isAnimatingRef.current) return;
      const touchEndY = e.changedTouches[0].clientY;
      const deltaY = touchStartYRef.current - touchEndY;

      if (Math.abs(deltaY) > 50) {
        if (deltaY > 0 && currentIdxRef.current < SECTION_IDS.length - 1) {
          goToSection(currentIdxRef.current + 1);
        } else if (deltaY < 0 && currentIdxRef.current > 0) {
          goToSection(currentIdxRef.current - 1);
        }
      }
    };

    // Keep active section index in sync with scroll position
    const handleScroll = () => {
      if (isAnimatingRef.current) return;
      const scrollPos = window.scrollY + window.innerHeight * 0.4;
      SECTION_IDS.forEach((id, idx) => {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            currentIdxRef.current = idx;
            setCurrentSectionIndex(idx);
          }
        }
      });
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [goToSection]);

  return { currentSectionIndex, goToSection };
}

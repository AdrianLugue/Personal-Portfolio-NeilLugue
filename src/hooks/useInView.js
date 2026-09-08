import { useState, useEffect, useRef } from 'react';

/**
 * useInView Hook
 * Ultra-resilient viewport detector optimized for 100dvh sections and smooth-scroll engines (Edge, Chrome, Safari, Firefox).
 */
export function useInView(options = {}) {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);
  const once = options.once ?? false;
  const threshold = options.threshold ?? 0.1;

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Check visibility via exact bounding rectangle
    const checkVisibility = () => {
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      
      // An element is active in view if its top is above 85% of screen and bottom is below 15% of screen
      const visible = rect.top < windowHeight * 0.85 && rect.bottom > windowHeight * 0.15;

      if (visible) {
        setIsInView(true);
      } else if (!once) {
        setIsInView(false);
      }
    };

    // Immediate initial check
    checkVisibility();

    // Primary: IntersectionObserver with multi-threshold
    let observer;
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsInView(true);
              if (once && observer) observer.unobserve(element);
            } else if (!once) {
              setIsInView(false);
            }
          });
        },
        {
          threshold: [0, 0.1, 0.25],
          rootMargin: '0px',
        }
      );
      observer.observe(element);
    }

    // Secondary: RAF-throttled scroll listener for 100% guarantee in Microsoft Edge & Windows
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          checkVisibility();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      if (observer) observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [threshold, once]);

  return [ref, isInView];
}

export default useInView;

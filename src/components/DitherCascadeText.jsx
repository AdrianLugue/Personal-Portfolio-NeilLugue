import React, { useState, useEffect, useRef, useCallback } from 'react';

const DITHER_STEPS = ['█', '▓', '▒', '░'];

/**
 * DitherCascadeText
 * Progressive text wave: Original -> █ -> ▓ -> ▒ -> ░ -> Original
 * Mutates character glyphs with 0 background bleed
 */
export default function DitherCascadeText({
  text,
  className = '',
  charClassName = '',
  staggerMs = 30,
  stepDurationMs = 40,
  triggerOnMount = false,
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
    if (triggerOnMount) {
      const timer = setTimeout(triggerCascade, 200);
      return () => {
        clearTimeout(timer);
        clearAllTimeouts();
      };
    }
    return clearAllTimeouts;
  }, [text, triggerOnMount, triggerCascade]);

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
            className={`inline-block transition-transform duration-75 ${
              isDither ? 'text-[#FFD54F] scale-105' : ''
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

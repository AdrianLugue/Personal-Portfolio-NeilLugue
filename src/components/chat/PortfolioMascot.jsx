import React, { useEffect, useRef, useState, useCallback } from 'react';

const DIRECTIONS = [
  'up-left',
  'up',
  'up-right',
  'left',
  'center',
  'right',
  'down-left',
  'down',
  'down-right',
];

const REACTIONS = [
  'blink',
  'heart',
  'sparkle',
  'surprised',
  'wink',
  'bashful',
  'sleepy',
  'dizzy',
  'delighted',
];

const CLOCKWISE = [
  'right',
  'down-right',
  'down',
  'down-left',
  'left',
  'up-left',
  'up',
  'up-right',
];

const SECTOR = (Math.PI * 2) / CLOCKWISE.length;
const HYSTERESIS = 0.12;
const DEAD_ZONE = 90;
const PAYOFFS = ['heart', 'sparkle', 'wink', 'delighted'];
const BOOP_END = 950;
const SQUASH_MS = 420;
const DIZZY_AFTER = 4;
const DIZZY_WINDOW = 1600;
const DIZZY_END = 1200;

const SQUASH = [
  { transform: 'scale(1, 1)', easing: 'ease-in' },
  { transform: 'scale(1.10, 0.86)', offset: 0.18, easing: 'ease-out' },
  { transform: 'scale(0.95, 1.08)', offset: 0.45, easing: 'ease-in-out' },
  { transform: 'scale(1.03, 0.97)', offset: 0.72, easing: 'ease-in-out' },
  { transform: 'scale(1, 1)' },
];

function cell(index) {
  return { backgroundPosition: `${(index % 3) * 50}% ${Math.floor(index / 3) * 50}%` };
}

function wrap(angle) {
  return Math.atan2(Math.sin(angle), Math.cos(angle));
}

const layer = {
  position: 'absolute',
  inset: 0,
  backgroundSize: '300% 300%',
  backgroundRepeat: 'no-repeat',
};

export default function PortfolioMascot({
  directions = '/mascots/neil-directions.webp',
  reactions = '/mascots/neil-reactions.webp',
  size = 105,
  className = '',
  label = "Neil's Mascot",
  onPoke,
  autoWelcome = true,
}) {
  const buttonRef = useRef(null);
  const squashRef = useRef(null);
  const timersRef = useRef([]);
  const boopsRef = useRef({ count: 0, at: 0 });
  const [direction, setDirection] = useState('center');
  const [reaction, setReaction] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const isTrackingLocked = useRef(true);

  // ── First-Load Smooth Entrance: Rise Up Looking Forward ──
  useEffect(() => {
    // 1. Initial state: Looking directly forward
    setDirection('center');
    setReaction(null);

    // 2. Trigger smooth slide-up from bottom
    const popTimer = setTimeout(() => {
      setIsReady(true);
    }, 150);

    // 3. Unlock cursor tracking after entrance completes
    const unlockTimer = setTimeout(() => {
      isTrackingLocked.current = false;
    }, 1000);

    return () => {
      clearTimeout(popTimer);
      clearTimeout(unlockTimer);
    };
  }, [autoWelcome]);

  // ── Cursor Tracking ──
  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      return;
    }

    let sector = -1;
    let pointer = null;

    const aim = () => {
      if (isTrackingLocked.current) {
        return;
      }
      const button = buttonRef.current;
      if (!button || !pointer) {
        return;
      }
      const box = button.getBoundingClientRect();
      const dx = pointer.x - (box.left + box.width / 2);
      const dy = pointer.y - (box.top + box.height / 2);

      if (Math.hypot(dx, dy) < DEAD_ZONE) {
        sector = -1;
        setDirection('center');
        return;
      }

      const angle = Math.atan2(dy, dx);
      if (sector !== -1 && Math.abs(wrap(angle - sector * SECTOR)) < SECTOR / 2 + HYSTERESIS) {
        return;
      }

      sector = (Math.round(angle / SECTOR) + CLOCKWISE.length) % CLOCKWISE.length;
      setDirection(CLOCKWISE[sector]);
    };

    const onPointerMove = (event) => {
      pointer = { x: event.clientX, y: event.clientY };
      aim();
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('scroll', aim, { passive: true });

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('scroll', aim);
    };
  }, []);

  useEffect(() => {
    return () => {
      timersRef.current.forEach(window.clearTimeout);
    };
  }, []);

  const boop = useCallback((e) => {
    timersRef.current.forEach(window.clearTimeout);
    timersRef.current = [];

    // Immediately face directly forward and lock tracking during reaction
    setDirection('center');
    isTrackingLocked.current = true;

    const now = Date.now();
    const boops = boopsRef.current;
    boops.count = now - boops.at < DIZZY_WINDOW ? boops.count + 1 : 1;
    boops.at = now;

    if (boops.count >= DIZZY_AFTER) {
      boops.count = 0;
      setReaction('dizzy');
      const timer = window.setTimeout(() => {
        setReaction(null);
        isTrackingLocked.current = false;
      }, DIZZY_END);
      timersRef.current.push(timer);
    } else {
      // Play reaction directly without pre-blink delay
      const nextReaction = PAYOFFS[(boops.count - 1) % PAYOFFS.length];
      setReaction(nextReaction);
      const timer = window.setTimeout(() => {
        setReaction(null);
        isTrackingLocked.current = false;
      }, BOOP_END);
      timersRef.current.push(timer);
    }

    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      squashRef.current?.animate(SQUASH, { duration: SQUASH_MS, easing: 'linear' });
    }

    onPoke?.(e);
  }, [onPoke]);

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={boop}
      aria-label={`Boop the ${label}`}
      className={className}
      style={{
        position: 'relative',
        display: 'block',
        flexShrink: 0,
        width: size,
        height: size,
        padding: 0,
        border: 0,
        background: 'transparent',
        appearance: 'none',
        cursor: 'pointer',
        userSelect: 'none',
        transform: autoWelcome ? (isReady ? 'translateY(0)' : 'translateY(55px)') : 'translateY(0)',
        opacity: autoWelcome ? (isReady ? 1 : 0) : 1,
        transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s ease-out',
      }}
    >
      <span
        ref={squashRef}
        style={{
          position: 'relative',
          display: 'block',
          width: '100%',
          height: '100%',
          transformOrigin: '50% 78%',
        }}
      >
        {/* Direction Sprite Layer */}
        <span
          style={{
            ...layer,
            backgroundImage: `url(${directions})`,
            ...cell(DIRECTIONS.indexOf(direction)),
            opacity: reaction ? 0 : 1,
            transition: 'opacity 0.15s ease-out',
          }}
        />

        {/* Reaction Sprite Layer */}
        <span
          style={{
            ...layer,
            backgroundImage: `url(${reactions})`,
            ...cell(REACTIONS.indexOf(reaction ?? 'blink')),
            opacity: reaction ? 1 : 0,
            transition: 'opacity 0.15s ease-out',
          }}
        />
      </span>
    </button>
  );
}

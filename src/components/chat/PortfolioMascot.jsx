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
  const isTrackingLocked = useRef(true);

  // ── First-Load Initialization: Look Forward ──
  useEffect(() => {
    setDirection('center');
    setReaction(null);

    const unlockTimer = setTimeout(() => {
      isTrackingLocked.current = false;
    }, 600);

    return () => clearTimeout(unlockTimer);
  }, [autoWelcome]);

  // ── Desktop Cursor & Mobile Touch / Gyroscope Tracking ──
  useEffect(() => {
    let sector = -1;
    let pointer = null;

    const aim = () => {
      if (isTrackingLocked.current) return;
      const button = buttonRef.current;
      if (!button || !pointer) return;

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
      if (event.pointerType === 'mouse' || event.pointerType === 'pen') {
        pointer = { x: event.clientX, y: event.clientY };
        aim();
      }
    };

    const onTouchMove = (event) => {
      if (event.touches && event.touches[0]) {
        pointer = { x: event.touches[0].clientX, y: event.touches[0].clientY };
        aim();
      }
    };

    const onTouchEnd = () => {
      setTimeout(() => {
        if (!isTrackingLocked.current) {
          sector = -1;
          setDirection('center');
        }
      }, 700);
    };

    // ── Gyroscope / Device Tilt Tracking for Mobile ──
    const handleOrientation = (e) => {
      if (isTrackingLocked.current) return;
      if (e.gamma === null || e.beta === null) return;

      const gamma = e.gamma; // Left (-90) to Right (+90)
      const beta = e.beta;   // Pitch (0 to 180) - normal holding is ~45deg

      const TILT_X_THRESH = 8;
      const TILT_Y_THRESH = 11;
      const BASE_BETA = 45;

      let dirX = '';
      if (gamma < -TILT_X_THRESH) dirX = 'left';
      else if (gamma > TILT_X_THRESH) dirX = 'right';

      let dirY = '';
      if (beta < BASE_BETA - TILT_Y_THRESH) dirY = 'up';
      else if (beta > BASE_BETA + TILT_Y_THRESH) dirY = 'down';

      if (dirY && dirX) {
        setDirection(`${dirY}-${dirX}`);
      } else if (dirY) {
        setDirection(dirY);
      } else if (dirX) {
        setDirection(dirX);
      } else {
        setDirection('center');
      }
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('scroll', aim, { passive: true });
    window.addEventListener('deviceorientation', handleOrientation, { passive: true });

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('scroll', aim);
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  useEffect(() => {
    return () => {
      timersRef.current.forEach(window.clearTimeout);
    };
  }, []);

  const boop = useCallback((e) => {
    // Request device orientation permission for iOS devices if available
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
      DeviceOrientationEvent.requestPermission().catch(() => {});
    }

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

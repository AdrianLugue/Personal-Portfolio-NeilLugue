import React, { useRef, useEffect, useState } from 'react';
import { Sparkles, RefreshCw, Terminal, Binary, Flame } from 'lucide-react';

const CHAR_SETS = {
  dither: [' ', '·', '░', '▒', '▓', '█'],
  code: [' ', '.', ':', '-', '=', '+', '*', '#', '%', '@'],
  binary: [' ', '0', '1'],
};

export default function AsciiPortraitCanvas() {
  const canvasRef = useRef(null);
  const [activeSet, setActiveSet] = useState('dither');
  const [isExploding, setIsExploding] = useState(false);
  const particlesRef = useRef([]);
  const mouseRef = useRef({ x: -1000, y: -1000, active: false });
  const animFrameId = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const img = new Image();
    img.src = '/assets/portrait_cutout.png';
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      // Offscreen sample canvas to get luminance grid
      const sampleCols = 46;
      const sampleRows = 60;
      const offscreen = document.createElement('canvas');
      offscreen.width = sampleCols;
      offscreen.height = sampleRows;
      const offCtx = offscreen.getContext('2d');
      offCtx.drawImage(img, 0, 0, sampleCols, sampleRows);
      const imgData = offCtx.getImageData(0, 0, sampleCols, sampleRows).data;

      // Set canvas display resolution
      const width = 360;
      const height = 470;
      canvas.width = width * 2;
      canvas.height = height * 2;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(2, 2);

      const cellW = width / sampleCols;
      const cellH = height / sampleRows;

      const particles = [];

      for (let r = 0; r < sampleRows; r++) {
        for (let c = 0; c < sampleCols; c++) {
          const idx = (r * sampleCols + c) * 4;
          const a = imgData[idx + 3];
          if (a < 35) continue; // transparent background

          const red = imgData[idx];
          const green = imgData[idx + 1];
          const blue = imgData[idx + 2];
          const lum = (0.299 * red + 0.587 * green + 0.114 * blue) / 255;

          const baseX = c * cellW + cellW / 2;
          const baseY = r * cellH + cellH / 2;

          particles.push({
            x: baseX,
            y: baseY,
            baseX,
            baseY,
            vx: 0,
            vy: 0,
            lum,
          });
        }
      }

      particlesRef.current = particles;
    };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000, active: false };
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const particles = particlesRef.current;
      const mouse = mouseRef.current;
      const currentChars = CHAR_SETS[activeSet] || CHAR_SETS.dither;

      ctx.font = '11px "Montserrat", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const repelRadius = 55;
      const spring = 0.08;
      const friction = 0.88;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Cursor magnetic repel force
        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.hypot(dx, dy);

          if (dist < repelRadius && dist > 0) {
            const force = (1 - dist / repelRadius) * 14;
            const angle = Math.atan2(dy, dx);
            p.vx += Math.cos(angle) * force;
            p.vy += Math.sin(angle) * force;
          }
        }

        // Return to home position via spring
        p.vx += (p.baseX - p.x) * spring;
        p.vy += (p.baseY - p.y) * spring;
        p.vx *= friction;
        p.vy *= friction;

        p.x += p.vx;
        p.y += p.vy;

        // Color & character mapping based on luminance & proximity to cursor
        const charIdx = Math.floor(p.lum * (currentChars.length - 1));
        const char = currentChars[charIdx] || '·';

        // Proximity glow to cursor
        const distToMouse = mouse.active ? Math.hypot(p.x - mouse.x, p.y - mouse.y) : 999;
        const isHovered = distToMouse < repelRadius;

        if (isHovered) {
          ctx.fillStyle = '#FFFFFF';
          ctx.shadowColor = '#FFE082';
          ctx.shadowBlur = 8;
        } else if (p.lum > 0.65) {
          ctx.fillStyle = '#FFD54F'; // bright gold
          ctx.shadowColor = '#FFD54F';
          ctx.shadowBlur = 4;
        } else if (p.lum > 0.35) {
          ctx.fillStyle = '#C6B99B'; // subtle gold
          ctx.shadowBlur = 0;
        } else {
          ctx.fillStyle = '#59533C'; // dark bronze
          ctx.shadowBlur = 0;
        }

        ctx.fillText(char, p.x, p.y);
      }

      animFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [activeSet]);

  // Click burst / de-rezz effect
  const triggerBurst = () => {
    if (isExploding) return;
    setIsExploding(true);
    const particles = particlesRef.current;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      const angle = Math.random() * Math.PI * 2;
      const speed = 4 + Math.random() * 18;
      p.vx = Math.cos(angle) * speed;
      p.vy = Math.sin(angle) * speed;
    }

    setTimeout(() => {
      setIsExploding(false);
    }, 1200);
  };

  return (
    <div className="flex flex-col items-center">
      {/* Canvas Frame */}
      <div className="relative group">
        {/* Ambient Gold Halo */}
        <div className="absolute -inset-2 rounded-[28px] bg-gradient-to-b from-[#FFD136]/25 via-[#7F7255]/15 to-transparent blur-xl opacity-60 group-hover:opacity-100 transition duration-500 pointer-events-none" />

        {/* Canvas container */}
        <div
          onClick={triggerBurst}
          className="relative rounded-[24px] overflow-hidden border border-white/20 bg-black/90 shadow-[0_10px_35px_rgba(0,0,0,0.9)] p-2 cursor-pointer transition-transform duration-300 group-hover:border-[#C6B99B]"
          title="Click to de-rezz & reassemble ASCII portrait!"
        >
          <canvas
            ref={canvasRef}
            className="block rounded-[20px] bg-[#0A0A0A]"
          />

          {/* Top Badge Overlay */}
          <div className="absolute top-4 left-4 pointer-events-none flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/70 border border-white/10 backdrop-blur-sm text-[10px] font-mono text-[#C6B99B]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            ASCII DITHER MATRIX
          </div>
        </div>
      </div>

      {/* Mode Switcher Buttons */}
      <div className="flex items-center gap-1.5 mt-4 p-1 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-sm">
        <button
          onClick={() => setActiveSet('dither')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-montserrat font-medium transition-all ${
            activeSet === 'dither'
              ? 'bg-[#7F7255] text-white shadow-md'
              : 'text-[#A3A3A3] hover:text-white'
          }`}
        >
          <Flame size={12} /> Dither ░▒▓
        </button>
        <button
          onClick={() => setActiveSet('code')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-montserrat font-medium transition-all ${
            activeSet === 'code'
              ? 'bg-[#7F7255] text-white shadow-md'
              : 'text-[#A3A3A3] hover:text-white'
          }`}
        >
          <Terminal size={12} /> Code &lt;/&gt;
        </button>
        <button
          onClick={() => setActiveSet('binary')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-montserrat font-medium transition-all ${
            activeSet === 'binary'
              ? 'bg-[#7F7255] text-white shadow-md'
              : 'text-[#A3A3A3] hover:text-white'
          }`}
        >
          <Binary size={12} /> Binary 01
        </button>
        <button
          onClick={triggerBurst}
          className="p-1.5 rounded-full text-[#A3A3A3] hover:text-white hover:bg-white/10 transition-colors"
          title="Burst & Reassemble"
        >
          <RefreshCw size={13} className={isExploding ? 'animate-spin' : ''} />
        </button>
      </div>
    </div>
  );
}

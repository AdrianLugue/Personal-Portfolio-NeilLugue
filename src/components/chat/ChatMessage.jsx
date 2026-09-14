/**
 * ChatMessage — Renders a single chat bubble with typewriter streaming
 * and embedded interactive action buttons (scroll, download, email, URL).
 * Also embeds vertical QuickChips on greeting message.
 */

import React, { useState, useEffect, useRef } from 'react';
import { ExternalLink, Download, Mail, ArrowUpRight, Bot } from 'lucide-react';
import { useSmoothScroll } from '../../context/SmoothScrollContext';
import QuickChips from './QuickChips';

// ── Markdown-lite renderer (bold **text**, newlines, bullet lines) ──────────
function renderMarkdown(text) {
  return text.split('\n').map((line, i) => {
    // Bold **text**
    const parts = line.split(/\*\*(.*?)\*\*/g).map((part, j) =>
      j % 2 === 1 ? <strong key={j} className="text-[#805D15] dark:text-[#FFD54F] font-bold">{part}</strong> : part
    );
    // Bullet lines starting with •
    const isBullet = line.trimStart().startsWith('•');
    return (
      <span key={i} className={`block ${isBullet ? 'pl-2 text-[#24201A] dark:text-neutral-200' : ''} ${i > 0 ? 'mt-1.5' : ''}`}>
        {parts}
      </span>
    );
  });
}

// ── Action Button ────────────────────────────────────────────────────────────
function ActionButton({ action, onClose }) {
  const { scrollTo } = useSmoothScroll();

  const handleClick = () => {
    if (action.type === 'scroll') {
      scrollTo('#' + action.sectionId, { offset: -80 });
      onClose?.();
    } else if (action.type === 'download') {
      const a = document.createElement('a');
      a.href = action.url;
      a.download = action.filename || 'resume.pdf';
      a.target = '_blank';
      a.click();
    } else if (action.type === 'email') {
      window.open(`mailto:${action.email}`, '_blank');
    } else if (action.type === 'url') {
      window.open(action.url, '_blank', 'noopener,noreferrer');
    }
  };

  const icons = {
    scroll: <ArrowUpRight size={11} />,
    download: <Download size={11} />,
    email: <Mail size={11} />,
    url: <ExternalLink size={11} />,
  };

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EDE9DF] dark:bg-[#18140E] hover:bg-[#E2DBD0] dark:hover:bg-[#251E12] border border-[rgba(100,75,35,0.25)] dark:border-[#C6B99B]/30 hover:border-[#805D15] dark:hover:border-[#FFD54F]/60 text-[#0A0907] dark:text-neutral-200 hover:text-[#805D15] dark:hover:text-[#FFD54F] font-montserrat font-semibold text-[10.5px] tracking-wide uppercase transition-all duration-200 cursor-pointer shadow-sm hover:shadow-[0_0_12px_rgba(122,85,16,0.15)] dark:hover:shadow-[0_0_12px_rgba(255,213,79,0.2)]"
    >
      {icons[action.type] || <ExternalLink size={11} />}
      {action.label}
    </button>
  );
}

// ── Typewriter Hook ───────────────────────────────────────────────────────────
function useTypewriter(text, speed = 8) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  const iRef = useRef(0);

  useEffect(() => {
    setDisplayed('');
    setDone(false);
    iRef.current = 0;

    if (!text) { setDone(true); return; }

    // Adaptive step size so messages stream quickly (fluid AI stream feel)
    const step = Math.max(3, Math.ceil(text.length / 70));

    const tick = () => {
      if (iRef.current >= text.length) {
        setDisplayed(text);
        setDone(true);
        return;
      }
      iRef.current = Math.min(text.length, iRef.current + step);
      setDisplayed(text.slice(0, iRef.current));
      setTimeout(tick, speed);
    };
    const t = setTimeout(tick, speed);
    return () => clearTimeout(t);
  }, [text, speed]);

  return { displayed, done };
}

// ── Message Component ────────────────────────────────────────────────────────
export default function ChatMessage({ message, onClose, onChipClick, usedChips }) {
  const isBot = message.role === 'bot';
  const isLoading = message.loading === true;
  const isGreeting = message.id === 'greeting';

  // Do not run typewriter on greeting message so chips are immediately interactive
  const { displayed, done } = useTypewriter(isBot && !isLoading && !isGreeting ? message.text : '', 6);
  const textToShow = isGreeting ? message.text : (isBot ? displayed : message.text);
  const isFinished = isGreeting ? true : done;

  if (!isBot) {
    // User message
    return (
      <div className="flex justify-end">
        <div className="max-w-[82%] px-3.5 py-2.5 rounded-2xl rounded-br-sm bg-gradient-to-br from-[#E2DBD0] to-[#D5CBB9] dark:from-[#2F2618] dark:to-[#1F180E] border border-[rgba(100,75,35,0.3)] dark:border-[#FFD54F]/35 shadow-md text-[#0A0907] dark:text-white font-montserrat text-xs leading-relaxed">
          {message.text}
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-2.5 items-start">
      {/* Bot Avatar matching portfolio badges */}
      <div className="shrink-0 w-7 h-7 rounded-full bg-[#E5DFD2] dark:bg-gradient-to-br dark:from-[#2A2418] dark:to-[#14100B] border border-[#805D15]/30 dark:border-[#FFD54F]/40 flex items-center justify-center text-[#805D15] dark:text-[#FFD54F] select-none mt-0.5 shadow-sm">
        <Bot size={14} />
      </div>

      <div className="flex-1 min-w-0">
        {/* Bubble */}
        <div className="px-3.5 py-3 rounded-2xl rounded-tl-sm bg-[#FAF8F4] dark:bg-[#14120E] border border-[rgba(100,75,35,0.22)] dark:border-[#C6B99B]/20 text-[#0A0907] dark:text-neutral-200 font-montserrat text-xs leading-[1.65] break-words shadow-sm dark:shadow-[0_4px_16px_rgba(0,0,0,0.6)]">
          {isLoading ? (
            <span className="flex items-center gap-1.5 text-[#24201A] dark:text-neutral-400 font-mono text-[11px]">
              <span className="inline-flex gap-1">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-[#805D15] dark:bg-[#FFD54F] animate-bounce"
                    style={{ animationDelay: `${i * 150}ms` }}
                  />
                ))}
              </span>
              Thinking...
            </span>
          ) : (
            <>
              {renderMarkdown(textToShow)}
              {/* Cursor blink while typing */}
              {!isFinished && (
                <span className="inline-block w-0.5 h-3 bg-[#805D15] dark:bg-[#FFD54F] ml-0.5 align-middle animate-pulse" />
              )}

              {/* Vertical Quick Chips in greeting bubble */}
              {isGreeting && onChipClick && (
                <QuickChips onChipClick={onChipClick} usedChips={usedChips} />
              )}
            </>
          )}
        </div>

        {/* Action Buttons — appear after text finishes */}
        {isFinished && message.actions?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {message.actions.map((action, i) => (
              <ActionButton key={i} action={action} onClose={onClose} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

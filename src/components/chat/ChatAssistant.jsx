/**
 * ChatAssistant — Floating AI Assistant widget for Neil Lugue's Portfolio.
 * Uses Lucide Bot icon across all assistant representations.
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Bot, X, Minimize2, Send } from 'lucide-react';
import ChatMessage from './ChatMessage';
import { getChatResponse, getChipResponse } from '../../services/geminiService';
import { useTheme } from '../../context/ThemeContext';

// ── Initial Greeting ────────────────────────────────────────────────────────
const GREETING = {
  id: 'greeting',
  role: 'bot',
  text: "Hello! I'm Neil's AI Portfolio Assistant. Ask me anything about his projects, skills, background, or how to get in touch.",
  actions: [],
};

function genId() {
  return Math.random().toString(36).slice(2, 9);
}

export default function ChatAssistant() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([GREETING]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [usedChips, setUsedChips] = useState([]);
  const [hasOpened, setHasOpened] = useState(false);
  const [showNudge, setShowNudge] = useState(false);

  const bottomRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const inputRef = useRef(null);
  const nudgeTimerRef = useRef(null);

  // ── Auto-scroll to bottom on new message ──
  const scrollToBottom = useCallback((smooth = true) => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: smooth ? 'smooth' : 'auto',
      });
    }
  }, []);

  useEffect(() => {
    scrollToBottom(true);
  }, [messages, scrollToBottom]);

  // ── Show nudge tooltip after 8s on first visit ──
  useEffect(() => {
    nudgeTimerRef.current = setTimeout(() => {
      if (!hasOpened) setShowNudge(true);
    }, 8000);
    return () => clearTimeout(nudgeTimerRef.current);
  }, [hasOpened]);

  const openChat = () => {
    setIsOpen(true);
    setIsMinimized(false);
    setHasOpened(true);
    setShowNudge(false);
    setTimeout(() => {
      inputRef.current?.focus();
      scrollToBottom(false);
    }, 250);
  };

  const closeChat = () => setIsOpen(false);
  const toggleMinimize = () => setIsMinimized((m) => !m);

  // ── Build conversation history for Gemini context ──
  const buildHistory = useCallback((msgs) => {
    const pairs = [];
    for (let i = 1; i < msgs.length - 1; i++) {
      if (msgs[i].role === 'user' && msgs[i + 1]?.role === 'bot') {
        pairs.push({ userText: msgs[i].text, botText: msgs[i + 1].text });
        i++; // skip the bot turn we consumed
      }
    }
    return pairs.slice(-4); // Last 4 turns
  }, []);

  const appendBotResponse = useCallback((response, loadingId) => {
    setMessages((prev) => {
      const without = prev.filter((m) => m.id !== loadingId);
      return [
        ...without,
        {
          id: genId(),
          role: 'bot',
          text: response.text,
          actions: response.actions || [],
        },
      ];
    });
    setIsLoading(false);
  }, []);

  // ── Send a message ────────────────────────────────────────────────────────
  const sendMessage = useCallback(
    async (text, isChip = false, chipId = null) => {
      if (!text.trim() || isLoading) return;

      const userMsg = { id: genId(), role: 'user', text: text.trim() };
      const loadingId = genId();
      const loadingMsg = { id: loadingId, role: 'bot', loading: true };

      setMessages((prev) => [...prev, userMsg, loadingMsg]);
      setInput('');
      setIsLoading(true);

      if (isChip && chipId) {
        setUsedChips((prev) => [...prev, chipId]);
        // Instant local response for chips
        const response = getChipResponse(chipId);
        setTimeout(() => appendBotResponse(response, loadingId), 350);
      } else {
        // Hybrid engine
        try {
          const history = buildHistory([...messages, userMsg]);
          const response = await getChatResponse(text.trim(), history);
          appendBotResponse(response, loadingId);
        } catch (_err) {
          appendBotResponse(
            {
              text: "Sorry, I hit a snag! Try asking again or use one of the quick questions above.",
              actions: [],
            },
            loadingId
          );
        }
      }
    },
    [isLoading, messages, appendBotResponse, buildHistory]
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleChip = (chip) => {
    sendMessage(chip.query, true, chip.id);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const hasNewMessages = messages.length > 1;

  return (
    <>
      {/* ── Floating Trigger Button ─────────────────────────────────────── */}
      <div className="fixed bottom-6 right-5 sm:right-6 z-[9999] flex flex-col items-end gap-2 pointer-events-auto">
        {/* Nudge Tooltip */}
        {showNudge && !isOpen && (
          <div
            className="relative mb-1 px-3.5 py-2 rounded-xl border shadow-2xl font-montserrat text-[11px] leading-snug max-w-[185px] text-center animate-fadeIn select-none"
            style={{
              backgroundColor: isDark ? 'rgba(18,16,14,0.96)' : 'rgba(250,248,244,0.98)',
              borderColor: 'var(--border-card)',
              color: 'var(--text-primary)',
            }}
          >
            <span className="font-bold flex items-center justify-center gap-1.5" style={{ color: isDark ? '#FFD54F' : '#7A5510' }}>
              <Bot size={14} className="text-[#805D15] dark:text-[#FFD54F] shrink-0" /> Ask Neil's AI anything!
            </span>
            <button
              onClick={() => setShowNudge(false)}
              className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#FAF8F4] dark:bg-[#1A1610] hover:bg-[#E5DFD2] dark:hover:bg-[#2A2315] border text-[var(--text-primary)] text-[9px] flex items-center justify-center cursor-pointer font-bold shadow-sm"
              style={{ borderColor: 'var(--border-card)' }}
            >
              ×
            </button>
            <div
              className="absolute -bottom-1.5 right-5 w-3 h-3 border-r border-b rotate-45"
              style={{
                backgroundColor: isDark ? '#12100E' : '#FAF8F4',
                borderColor: 'var(--border-card)',
              }}
            />
          </div>
        )}

        <button
          onClick={isOpen ? closeChat : openChat}
          aria-label={isOpen ? 'Close chat assistant' : 'Open chat assistant'}
          className={`relative w-13 h-13 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer group select-none hover:scale-105 active:scale-95
            ${isOpen
              ? isDark
                ? 'bg-[#181512] border border-white/25 hover:border-white/50 text-white shadow-[0_12px_36px_rgba(0,0,0,0.85)]'
                : 'bg-[#FAF8F4] border-[1.5px] border-[#805D15] hover:bg-[#E5DFD2] text-[#0A0907] shadow-lg'
              : isDark
                ? 'bg-gradient-to-br from-[#2A2418] to-[#14100B] border border-[#FFD54F]/40 hover:border-[#FFD54F] text-[#FFD54F] shadow-[0_0_24px_rgba(255,213,79,0.15)]'
                : 'bg-[#FAF8F4] border-[1.5px] border-[#805D15] hover:border-[#946300] hover:bg-[#E2DBD0] text-[#805D15] shadow-[0_4px_20px_rgba(122,85,16,0.2)]'
            }
          `}
          style={{ width: '52px', height: '52px' }}
        >
          {/* Gold glow pulse ring */}
          {!isOpen && (
            <span className={`absolute inset-0 rounded-full ring-1 transition-all duration-300 animate-pulse ${
              isDark ? 'ring-[#FFD54F]/30 group-hover:ring-[#FFD54F]/60' : 'ring-[#805D15]/30 group-hover:ring-[#805D15]/60'
            }`} />
          )}

          {isOpen ? (
            <X size={20} className={isDark ? 'text-white/80' : 'text-[#0A0907]'} />
          ) : (
            <Bot size={22} className="text-[#805D15] dark:text-[#FFD54F]" />
          )}

          {/* Unread dot */}
          {!isOpen && hasNewMessages && (
            <span className={`absolute top-0 right-0 w-2.5 h-2.5 rounded-full ${
              isDark ? 'bg-[#FFD54F] border-2 border-black' : 'bg-[#805D15] border-2 border-[#FAF8F4]'
            }`} />
          )}
        </button>
      </div>

      {/* ── Chat Modal Panel (Halftone Card Surface) ────────────────────── */}
      <div
        data-lenis-prevent="true"
        className={`fixed bottom-[78px] right-5 sm:right-6 z-[9998] w-[min(380px,calc(100vw-28px))] transition-all duration-300 origin-bottom-right
          ${isOpen ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}
        `}
      >
        <div
          data-lenis-prevent="true"
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
          className="flex flex-col rounded-[20px] overflow-hidden shadow-[0_24px_70px_rgba(0,0,0,0.5),0_0_35px_rgba(255,213,79,0.06)]"
          style={{
            backgroundColor: isDark ? '#0E0C0A' : '#FAF8F4',
            backgroundImage: `
              radial-gradient(circle at 1px 1px, var(--halftone-dot) 1px, transparent 0),
              radial-gradient(circle at 4px 4px, var(--halftone-dot2) 1px, transparent 0)
            `,
            backgroundSize: '8px 8px, 16px 16px',
            border: `1px solid var(--border-card)`,
            height: isMinimized ? '58px' : '540px',
            maxHeight: 'calc(100vh - 100px)',
            transition: 'height 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {/* ── Header ── */}
          <div className="shrink-0 flex items-center justify-between px-4 py-3 border-b select-none" style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-card)' }}>
            <div className="flex items-center gap-2.5 min-w-0">
              {/* Bot Icon */}
              <div className="w-7 h-7 rounded-full bg-[#E5DFD2] dark:bg-gradient-to-br dark:from-[#2A2418] dark:to-[#14100B] border border-[#805D15]/30 dark:border-[#FFD54F]/40 flex items-center justify-center text-[#805D15] dark:text-[#FFD54F] shrink-0 shadow-sm">
                <Bot size={15} />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-montserrat font-bold text-xs tracking-wide truncate" style={{ color: 'var(--text-primary)' }}>
                  Portfolio Assistant
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={toggleMinimize}
                aria-label={isMinimized ? 'Expand chat' : 'Minimize chat'}
                className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors cursor-pointer hover:bg-black/5 dark:hover:bg-white/[0.08]"
                style={{ color: 'var(--text-muted)' }}
              >
                <Minimize2 size={13} />
              </button>
              <button
                onClick={closeChat}
                aria-label="Close chat"
                className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors cursor-pointer hover:bg-black/5 dark:hover:bg-white/[0.08]"
                style={{ color: 'var(--text-muted)' }}
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {/* ── Body: Messages Feed & Input ── */}
          {!isMinimized && (
            <>
              {/* Messages Container with Native & Lenis-Safe Scrolling */}
              <div
                ref={messagesContainerRef}
                data-lenis-prevent="true"
                onWheel={(e) => e.stopPropagation()}
                onTouchMove={(e) => e.stopPropagation()}
                className="flex-1 min-h-0 overflow-y-auto overscroll-contain chat-scrollbar px-3.5 py-4 space-y-4"
              >
                {messages.map((msg) => (
                  <ChatMessage
                    key={msg.id}
                    message={msg}
                    onClose={closeChat}
                    onChipClick={handleChip}
                    usedChips={usedChips}
                  />
                ))}
                <div ref={bottomRef} className="h-1" />
              </div>

              {/* ── Input Bar ── */}
              <form
                onSubmit={handleSubmit}
                className="shrink-0 flex items-center gap-2 p-2.5 sm:p-3 border-t"
                style={{ backgroundColor: 'var(--bg-pill)', borderColor: 'var(--border-card)' }}
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about Neil's work, skills..."
                  maxLength={300}
                  disabled={isLoading}
                  className="flex-1 min-w-0 rounded-xl px-3.5 py-2 text-xs font-montserrat focus:outline-none transition-all disabled:opacity-50"
                  style={{
                    backgroundColor: 'var(--bg-panel)',
                    border: `1px solid var(--border-card)`,
                    color: 'var(--text-primary)',
                  }}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  aria-label="Send message"
                  className={`shrink-0 w-8 h-8 rounded-xl flex items-center justify-center font-bold transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer ${
                    isDark
                      ? 'bg-[#FFD54F] hover:bg-[#FFE082] border border-[#FFD54F] text-black shadow-[0_0_12px_rgba(255,213,79,0.25)] hover:shadow-[0_0_18px_rgba(255,213,79,0.4)]'
                      : 'bg-[#805D15] hover:bg-[#946300] border border-[#805D15] text-white shadow-md'
                  }`}
                >
                  <Send size={13} />
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </>
  );
}

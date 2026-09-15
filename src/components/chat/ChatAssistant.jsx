/**
 * ChatAssistant — Floating AI Assistant widget for Neil Lugue's Portfolio.
 * Uses Lucide Bot icon across all assistant representations.
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Bot, X, Minimize2, Send, MessageSquareCode, Sparkles } from 'lucide-react';
import PortfolioMascot from './PortfolioMascot';
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
  const [showBubble, setShowBubble] = useState(false);
  const [isWelcomeExpanded, setIsWelcomeExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const bottomRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const inputRef = useRef(null);

  // ── First-load Welcome Animation Sequence ──
  useEffect(() => {
    // 1. Wait for mascot to smoothly rise from the bottom, then pop in welcome bubble
    const bubbleTimer = setTimeout(() => {
      setShowBubble(true);
      setIsWelcomeExpanded(true);
    }, 850);

    // 2. Gently collapse speech bubble into minimized badge after 6.5 seconds
    const fadeTimer = setTimeout(() => {
      setIsWelcomeExpanded(false);
    }, 7000);

    return () => {
      clearTimeout(bubbleTimer);
      clearTimeout(fadeTimer);
    };
  }, []);

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

  const openChat = () => {
    setIsOpen(true);
    setIsMinimized(false);
    setHasOpened(true);
    setIsWelcomeExpanded(false);
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
      {/* ── Floating Seamless Mascot (Sticky at Bottom Edge) ─────────────────── */}
      <div
        className="fixed bottom-0 right-3 sm:right-6 z-[9999] flex flex-col items-end pointer-events-auto select-none"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Speech Bubble / Minimized AI Status Badge */}
        {!isOpen && showBubble && (
          <div className="transition-all duration-500 ease-out">
            {isWelcomeExpanded || isHovered ? (
              /* Expanded Welcome Speech Bubble */
              <div
                onClick={openChat}
                className="relative mb-1 mr-1 sm:mr-3 px-3.5 py-2 rounded-2xl border shadow-2xl font-montserrat text-left animate-fadeIn cursor-pointer transition-all duration-300 hover:scale-[1.03] group backdrop-blur-md max-w-[215px] sm:max-w-[235px]"
                style={{
                  backgroundColor: isDark ? 'rgba(18,16,14,0.96)' : 'rgba(250,248,244,0.98)',
                  borderColor: isDark ? 'rgba(255,213,79,0.35)' : 'rgba(128,93,21,0.3)',
                  color: 'var(--text-primary)',
                }}
              >
                {/* Top row: Live online indicator + AI Companion tag */}
                <div className="flex items-center justify-between gap-1.5 mb-1 select-none">
                  <div className="flex items-center gap-1.5">
                    <span className="relative flex h-2 w-2 shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                    <span
                      className="font-mono font-bold text-[9px] uppercase tracking-wider flex items-center gap-1"
                      style={{ color: isDark ? '#FFD54F' : '#805D15' }}
                    >
                      AI Portfolio Assistant
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsWelcomeExpanded(false);
                    }}
                    aria-label="Minimize welcome bubble"
                    className="w-4 h-4 rounded-full border text-[9px] flex items-center justify-center cursor-pointer font-bold transition-colors opacity-70 hover:opacity-100"
                    style={{
                      backgroundColor: 'var(--bg-pill)',
                      borderColor: 'var(--border-pill)',
                      color: 'var(--text-muted)',
                    }}
                  >
                    ×
                  </button>
                </div>

                {/* Welcome Message */}
                <p className="text-[11px] font-medium leading-tight select-none" style={{ color: 'var(--text-primary)' }}>
                  Hi! I'm Neil's AI companion. Poke me to ask anything!
                </p>

                {/* Bottom arrow tail pointing to mascot */}
                <div
                  className="absolute -bottom-1.5 right-9 w-3 h-3 border-r border-b rotate-45"
                  style={{
                    backgroundColor: isDark ? '#12100E' : '#FAF8F4',
                    borderColor: isDark ? 'rgba(255,213,79,0.35)' : 'rgba(128,93,21,0.3)',
                  }}
                />
              </div>
            ) : (
              /* Minimized Status Badge (Unobtrusive after 6s) */
              <div
                onClick={openChat}
                className="relative mb-0.5 mr-2 sm:mr-3 px-2.5 py-1 rounded-full border shadow-lg backdrop-blur-md flex items-center gap-1.5 cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 animate-fadeIn"
                style={{
                  backgroundColor: isDark ? 'rgba(18,16,14,0.92)' : 'rgba(250,248,244,0.95)',
                  borderColor: isDark ? 'rgba(255,213,79,0.35)' : 'rgba(128,93,21,0.3)',
                }}
              >
                <span className="relative flex h-1.5 w-1.5 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                </span>
                <span
                  className="font-mono font-bold text-[9px] uppercase tracking-wider flex items-center gap-1"
                  style={{ color: isDark ? '#FFD54F' : '#805D15' }}
                >
                  AI Portfolio Assistant
                </span>
              </div>
            )}
          </div>
        )}

        {/* Seamless Interactive Mascot */}
        <div
          className="relative transition-transform duration-200 hover:scale-105 active:scale-95 cursor-pointer filter drop-shadow-[0_8px_20px_rgba(0,0,0,0.45)]"
        >
          {/* Unread dot badge */}
          {!isOpen && hasNewMessages && (
            <span className={`absolute top-2 right-2 w-3 h-3 rounded-full z-20 ${isDark ? 'bg-[#FFD54F] border-2 border-black shadow-md' : 'bg-[#805D15] border-2 border-[#FAF8F4] shadow-md'
              }`} />
          )}

          {/* Chat active indicator pill */}
          {isOpen && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                closeChat();
              }}
              aria-label="Close chat"
              className="absolute -top-1 right-2 z-20 w-6 h-6 rounded-full flex items-center justify-center border shadow-lg transition-transform hover:scale-110 active:scale-90 cursor-pointer"
              style={{
                backgroundColor: isDark ? '#1C1915' : '#FAF8F4',
                borderColor: 'var(--border-card)',
                color: 'var(--text-primary)',
              }}
            >
              <X size={13} />
            </button>
          )}

          {/* Interactive Mascot (Always rendered & pokable) */}
          <PortfolioMascot
            directions="/mascots/neil-directions.webp"
            reactions="/mascots/neil-reactions.webp"
            size={105}
            label="Neil Mascot"
            autoWelcome={true}
            onPoke={() => {
              if (!isOpen) openChat();
            }}
          />
        </div>
      </div>

      {/* ── Chat Modal Panel (Halftone Card Surface) ────────────────────── */}
      <div
        data-lenis-prevent="true"
        className={`fixed bottom-[115px] sm:bottom-[120px] right-3 sm:right-6 z-[9998] w-[min(380px,calc(100vw-24px))] transition-all duration-300 origin-bottom-right
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
              {/* Mascot Avatar in Header */}
              <div className="w-7 h-7 rounded-full overflow-hidden bg-[#E5DFD2] dark:bg-gradient-to-br dark:from-[#2A2418] dark:to-[#14100B] border border-[#805D15]/30 dark:border-[#FFD54F]/40 flex items-center justify-center shrink-0 shadow-sm">
                <PortfolioMascot
                  directions="/mascots/neil-directions.webp"
                  reactions="/mascots/neil-reactions.webp"
                  size={28}
                  label="Neil Mascot Avatar"
                  autoWelcome={false}
                />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-montserrat font-bold text-xs tracking-wide truncate" style={{ color: 'var(--text-primary)' }}>
                  AI Portfolio Assistant
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
                  className={`shrink-0 w-8 h-8 rounded-xl flex items-center justify-center font-bold transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer ${isDark
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

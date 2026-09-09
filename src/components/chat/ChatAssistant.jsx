/**
 * ChatAssistant — Floating AI Assistant widget for Neil Lugue's Portfolio.
 * Uses Lucide Bot icon across all assistant representations.
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Bot, X, Minimize2, Send } from 'lucide-react';
import ChatMessage from './ChatMessage';
import { getChatResponse, getChipResponse } from '../../services/geminiService';

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
          <div className="relative mb-1 px-3.5 py-2 rounded-xl bg-[#12100E]/95 border border-[#C6B99B]/30 shadow-2xl text-white font-montserrat text-[11px] leading-snug max-w-[180px] text-center animate-fadeIn">
            <span className="text-[#FFD54F] font-semibold flex items-center justify-center gap-1.5">
              <Bot size={13} /> Ask Neil's AI anything!
            </span>
            <button
              onClick={() => setShowNudge(false)}
              className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#1A1610] hover:bg-[#2A2315] border border-white/20 text-neutral-300 text-[9px] flex items-center justify-center cursor-pointer"
            >
              ×
            </button>
            <div className="absolute -bottom-1.5 right-5 w-3 h-3 bg-[#12100E] border-r border-b border-[#C6B99B]/30 rotate-45" />
          </div>
        )}

        <button
          onClick={isOpen ? closeChat : openChat}
          aria-label={isOpen ? 'Close chat assistant' : 'Open chat assistant'}
          className={`relative w-13 h-13 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shadow-[0_12px_36px_rgba(0,0,0,0.85)] transition-all duration-300 cursor-pointer group select-none hover:scale-105 active:scale-95
            ${isOpen
              ? 'bg-[#181512] border border-white/25 hover:border-white/50 text-white'
              : 'bg-gradient-to-br from-[#2A2418] to-[#14100B] border border-[#FFD54F]/40 hover:border-[#FFD54F] text-[#FFD54F] shadow-[0_0_24px_rgba(255,213,79,0.15)]'
            }
          `}
          style={{ width: '52px', height: '52px' }}
        >
          {/* Gold glow pulse ring */}
          {!isOpen && (
            <span className="absolute inset-0 rounded-full ring-1 ring-[#FFD54F]/30 group-hover:ring-[#FFD54F]/60 transition-all duration-300 animate-pulse" />
          )}

          {isOpen ? (
            <X size={20} className="text-white/80" />
          ) : (
            <Bot size={22} className="text-[#FFD54F]" />
          )}

          {/* Unread dot */}
          {!isOpen && hasNewMessages && (
            <span className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full bg-[#FFD54F] border-2 border-black" />
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
          className="flex flex-col rounded-[20px] overflow-hidden border border-[#C6B99B]/25 shadow-[0_24px_70px_rgba(0,0,0,0.95),0_0_35px_rgba(255,213,79,0.06)]"
          style={{
            backgroundColor: '#0E0C0A',
            backgroundImage: `
              radial-gradient(circle at 1px 1px, rgba(255, 213, 79, 0.07) 1px, transparent 0),
              radial-gradient(circle at 4px 4px, rgba(198, 185, 155, 0.04) 1px, transparent 0)
            `,
            backgroundSize: '8px 8px, 16px 16px',
            height: isMinimized ? '58px' : '540px',
            maxHeight: 'calc(100vh - 100px)',
            transition: 'height 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {/* ── Header ── */}
          <div className="shrink-0 flex items-center justify-between px-4 py-3 bg-[#14120E] border-b border-[#C6B99B]/15 select-none">
            <div className="flex items-center gap-2.5 min-w-0">
              {/* Bot Icon */}
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#2A2418] to-[#14100B] border border-[#FFD54F]/40 flex items-center justify-center text-[#FFD54F] shrink-0 shadow-sm">
                <Bot size={15} />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-montserrat font-bold text-white text-xs tracking-wide truncate">
                  Portfolio Assistant
                </span>

              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={toggleMinimize}
                aria-label={isMinimized ? 'Expand chat' : 'Minimize chat'}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-neutral-400 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer"
              >
                <Minimize2 size={13} />
              </button>
              <button
                onClick={closeChat}
                aria-label="Close chat"
                className="w-7 h-7 rounded-lg flex items-center justify-center text-neutral-400 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer"
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
                className="shrink-0 flex items-center gap-2 p-2.5 sm:p-3 bg-[#12100E] border-t border-[#C6B99B]/15"
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
                  className="flex-1 min-w-0 bg-[#0A0908] border border-[#C6B99B]/25 rounded-xl px-3.5 py-2 text-white text-xs font-montserrat placeholder-neutral-500 focus:outline-none focus:border-[#FFD54F]/70 focus:ring-1 focus:ring-[#FFD54F]/25 transition-all disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  aria-label="Send message"
                  className="shrink-0 w-8 h-8 rounded-xl bg-[#FFD54F] hover:bg-[#FFE082] border border-[#FFD54F] flex items-center justify-center text-black font-bold transition-all duration-200 shadow-[0_0_12px_rgba(255,213,79,0.25)] hover:shadow-[0_0_18px_rgba(255,213,79,0.4)] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
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

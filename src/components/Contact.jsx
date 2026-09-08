import React, { useState } from 'react';
import { Mail, Phone, ExternalLink, Copy, Check, MapPin, ArrowUpRight } from 'lucide-react';
import { FaLinkedin, FaGithub } from 'react-icons/fa';
import useInView from '../hooks/useInView';

export default function Contact() {
  const [contactRef, isRevealed] = useInView({ threshold: 0.15, once: false });
  const [copiedKey, setCopiedKey] = useState(null);

  const handleCopy = (e, key, text) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const contactMethods = [
    {
      key: 'email',
      title: 'Email',
      value: 'neillugue20@gmail.com',
      subtitle: 'Fastest response time',
      copyValue: 'neillugue20@gmail.com',
      icon: <Mail size={22} className="text-[#FFD54F]" />,
      isExternal: false,
    },
    {
      key: 'phone',
      title: 'Phone / Mobile',
      value: '+63 949 501 5275',
      subtitle: 'Direct SMS',
      copyValue: '+639495015275',
      icon: <Phone size={22} className="text-[#FFD54F]" />,
      isExternal: false,
    },
    {
      key: 'linkedin',
      title: 'LinkedIn',
      value: 'neil-adrian-j-lugue-6b63b4375',
      subtitle: 'Professional network',
      href: 'https://www.linkedin.com/in/neil-adrian-j-lugue-6b63b4375/',
      copyValue: 'https://www.linkedin.com/in/neil-adrian-j-lugue-6b63b4375/',
      icon: <FaLinkedin size={22} className="text-[#0A66C2]" />,
      isExternal: true,
    },
    {
      key: 'github',
      title: 'GitHub',
      value: 'github.com/AdrianLugue',
      subtitle: 'Code repositories',
      href: 'https://github.com/AdrianLugue',
      copyValue: 'https://github.com/AdrianLugue',
      icon: <FaGithub size={22} className="text-white" />,
      isExternal: true,
    },
  ];

  const handleCardClick = (method) => {
    if (method.isExternal && method.href) {
      window.open(method.href, '_blank', 'noopener,noreferrer');
    } else {
      // For email & phone: simply copy to clipboard without opening any app
      navigator.clipboard.writeText(method.copyValue);
      setCopiedKey(method.key);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  return (
    <div
      ref={contactRef}
      className={`section-lazy-render relative z-10 w-full flex-1 flex flex-col justify-start px-0 py-1 sm:py-2 select-none ${
        isRevealed ? 'is-revealed' : ''
      }`}
    >
      {/* Section Header matching Tech Stack, About, Projects */}
      <div className="flex flex-col items-center text-center mb-3 sm:mb-4 lg:mb-5 px-4 sm:px-6 shrink-0">
        <div className="reveal-mask">
          <h2 className="reveal-title font-montserrat font-extrabold text-2xl sm:text-4xl lg:text-5xl text-white tracking-[0.03em]">
            Contact <span className="text-gold-gradient">Me</span>
          </h2>
        </div>
        <div className="reveal-line w-16 h-1 bg-[#7F7255] mx-auto mt-1.5 sm:mt-2.5 rounded-full" />
      </div>

      {/* Main Content Area */}
      <div className="w-full flex-1 flex flex-col justify-between max-w-6xl mx-auto px-4 sm:px-6 space-y-4 sm:space-y-6">

        {/* Top Editorial Callout */}
        <div className="reveal-child reveal-delay-1 text-center max-w-2xl mx-auto space-y-1.5 sm:space-y-2">
          <p className="font-montserrat font-bold text-base sm:text-xl lg:text-2xl text-white tracking-tight">
            Let's build something <span className="text-gold-gradient">meaningful</span> together.
          </p>
          <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
            Available for full-time Information Technology roles.
          </p>
        </div>

        {/* 4 Contact Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 w-full">
          {contactMethods.map((method, idx) => {
            const isCopied = copiedKey === method.key;
            const staggerClass = `reveal-delay-${idx + 1}`;

            return (
              <div
                key={method.key}
                onClick={() => handleCardClick(method)}
                title={method.isExternal ? `Open ${method.title}` : `Click to copy ${method.title}`}
                className={`reveal-child ${staggerClass} relative rounded-2xl p-4 sm:p-5 flex flex-col justify-between halftone-card border-white/10 hover:border-[#FFD54F]/50 hover:-translate-y-1 hover:shadow-[0_12px_36px_rgba(255,213,79,0.12)] transition-all duration-300 cursor-pointer group text-left`}
              >
                {/* Header Icon + Copy Button & External Indicator */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="w-11 h-11 rounded-xl bg-black/70 border border-white/10 flex items-center justify-center shrink-0 group-hover:border-[#FFD54F]/40 group-hover:scale-110 transition-all duration-200">
                    {method.icon}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={(e) => handleCopy(e, method.key, method.copyValue)}
                      title={`Copy ${method.title}`}
                      className="p-1.5 rounded-lg halftone-pill text-neutral-400 hover:text-white hover:border-[#FFD54F]/50 transition-all cursor-pointer flex items-center gap-1 text-[10px] font-mono"
                    >
                      {isCopied ? (
                        <>
                          <Check size={12} className="text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy size={12} />
                          <span>Copy</span>
                        </>
                      )}
                    </button>

                    {method.isExternal && (
                      <div className="p-1.5 rounded-lg text-neutral-500 group-hover:text-[#FFD54F] transition-colors">
                        <ExternalLink size={13} className="opacity-70 group-hover:opacity-100 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Content Body */}
                <div className="space-y-0.5 text-left pt-1">
                  <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider block">
                    {method.subtitle}
                  </span>
                  <h3 className="font-montserrat font-bold text-sm sm:text-base text-white tracking-tight group-hover:text-[#FFD54F] transition-colors flex items-center gap-1.5">
                    {method.title}
                  </h3>
                  <p className="text-[11.5px] sm:text-xs font-mono text-[#C6B99B] truncate pt-0.5">
                    {method.value}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Location & Status Pill Banner */}
        <div className="reveal-child reveal-delay-5 flex flex-wrap items-center justify-between gap-3 pt-2 sm:pt-3 border-t border-white/10 text-[11px] font-mono text-neutral-400">
          <div className="flex items-center gap-2">
            <MapPin size={13} className="text-[#FFD54F]" />
            <span>Calumpit, Bulacan, Philippines · GMT+8 (Open to Remote Worldwide)</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span className="text-emerald-400 font-medium">Available for immediate hiring</span>
          </div>
        </div>

      </div>
    </div>
  );
}

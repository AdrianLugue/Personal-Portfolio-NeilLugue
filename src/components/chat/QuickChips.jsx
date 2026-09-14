/**
 * QuickChips — Vertically listed quick questions matching the portfolio card design.
 * Shows the actual questions directly under the greeting bubble with clean Bot styling.
 */

import React from 'react';
import { Bot, ArrowRight, Code, Briefcase, GraduationCap, FileText, Mail, FolderGit2 } from 'lucide-react';
import { QUICK_CHIPS } from '../../data/chatbotKnowledge';

const ICONS = {
  projects: <FolderGit2 size={13} className="text-[#805D15] dark:text-[#FFD54F] shrink-0" />,
  techstack: <Code size={13} className="text-[#805D15] dark:text-[#FFD54F] shrink-0" />,
  background: <GraduationCap size={13} className="text-[#805D15] dark:text-[#FFD54F] shrink-0" />,
  availability: <Briefcase size={13} className="text-[#805D15] dark:text-[#FFD54F] shrink-0" />,
  resume: <FileText size={13} className="text-[#805D15] dark:text-[#FFD54F] shrink-0" />,
  contact: <Mail size={13} className="text-[#805D15] dark:text-[#FFD54F] shrink-0" />,
};

export default function QuickChips({ onChipClick, usedChips = [] }) {
  return (
    <div className="w-full flex flex-col gap-1.5 mt-3 pt-2.5 border-t border-[rgba(100,75,35,0.2)] dark:border-[#C6B99B]/15">
      <div className="flex items-center gap-1.5 px-0.5 mb-1">
        <Bot size={12} className="text-[#805D15] dark:text-[#FFD54F]" />
        <span className="text-[10px] font-mono uppercase tracking-wider text-[#805D15] dark:text-[#C6B99B] font-bold">
          Quick Questions to Ask
        </span>
      </div>

      <div className="flex flex-col gap-1.5 w-full">
        {QUICK_CHIPS.map((chip) => {
          const isUsed = usedChips.includes(chip.id);
          return (
            <button
              key={chip.id}
              onClick={() => !isUsed && onChipClick(chip)}
              disabled={isUsed}
              aria-label={`Ask: ${chip.query}`}
              className={`w-full text-left px-3 py-2.5 rounded-xl border transition-all duration-200 flex items-center justify-between group select-none ${
                isUsed
                  ? 'bg-black/[0.03] dark:bg-white/[0.02] border-black/5 dark:border-white/5 text-neutral-400 dark:text-neutral-500 opacity-50 cursor-not-allowed'
                  : 'bg-[#EDE9DF] dark:bg-[#14120E]/90 hover:bg-[#E2DBD0] dark:hover:bg-[#221C14] border-[rgba(100,75,35,0.25)] dark:border-[#C6B99B]/20 hover:border-[#805D15] dark:hover:border-[#FFD54F]/60 text-[#0A0907] dark:text-neutral-300 hover:text-[#805D15] dark:hover:text-white shadow-sm hover:shadow-[0_2px_14px_rgba(122,85,16,0.12)] dark:hover:shadow-[0_2px_14px_rgba(255,213,79,0.12)] cursor-pointer'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0 pr-2">
                {ICONS[chip.id] || <Bot size={13} className="text-[#805D15] dark:text-[#FFD54F] shrink-0" />}
                <span className="font-montserrat text-xs text-[#0A0907] dark:text-neutral-200 group-hover:text-[#805D15] dark:group-hover:text-[#FFD54F] font-medium transition-colors leading-snug">
                  {chip.query}
                </span>
              </div>
              <ArrowRight
                size={12}
                className={`text-[#805D15] dark:text-[#FFD54F] opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all shrink-0 ${
                  isUsed ? 'hidden' : ''
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}

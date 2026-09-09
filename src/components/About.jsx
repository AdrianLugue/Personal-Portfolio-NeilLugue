import React, { useRef, useState, useEffect, useCallback } from 'react';
import DitherPortrait from './DitherPortrait';
import Button from './Button';
import { GitBranch, GraduationCap, ArrowRight, ExternalLink, Mail, Award } from 'lucide-react';
import useInView from '../hooks/useInView';
import pythonCertPdf from '../assets/Python_Certificate.pdf';

/* ─────────────────────────────────────────────
   MagneticWord — spring physics repellent text
   (Used ONLY for decorative reading text words,
   NEVER for clickable links or buttons)
───────────────────────────────────────────── */
function MagneticWord({ children, className = '', style = {} }) {
  return (
    <span
      className={`inline-block transition-transform duration-200 hover:-translate-y-0.5 hover:text-[#FFD54F] ${className}`}
      style={style}
    >
      {children}
    </span>
  );
}

/* Wrap a string into per-word spans */
function MagneticParagraph({ text, className = '', wordClassName = '' }) {
  return (
    <span className={className}>
      {text.split(' ').map((word, i, arr) => (
        <React.Fragment key={i}>
          <MagneticWord className={wordClassName}>
            {word}
          </MagneticWord>
          {i < arr.length - 1 && ' '}
        </React.Fragment>
      ))}
    </span>
  );
}

/* ─────────────────────────────────────────────
   GitHub Activity & Status Component
   (Streak badge removed, clean full width layout)
───────────────────────────────────────────── */
const HEAT_COLORS = [
  '#171410', // level 0 (empty cell)
  '#3E2F16', // level 1
  '#7C5B20', // level 2
  '#C8962B', // level 3
  '#FFD54F', // level 4 (peak gold)
];

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAY_LABELS = ['', 'M', '', 'W', '', 'F', ''];

function GitHubStatusWidget({ username }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hoveredCell, setHoveredCell] = useState(null);

  useEffect(() => {
    let isMounted = true;
    fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`)
      .then((r) => r.json())
      .then((json) => {
        if (!isMounted) return;
        const contribs = json.contributions ?? [];
        const yr = new Date().getFullYear().toString();
        const total = json.total?.[yr] ?? contribs.reduce((s, d) => s + d.count, 0);

        const map = {};
        contribs.forEach((d) => { map[d.date] = d; });

        // 28 weeks for expansive full-width grid
        const numWeeks = 28;
        const today = new Date();
        const start = new Date(today);
        start.setDate(start.getDate() - (numWeeks - 1) * 7 - today.getDay());

        const builtWeeks = [];
        const monthHeaders = [];
        let lastMonth = -1;

        for (let w = 0; w < numWeeks; w++) {
          const week = [];
          let weekMonth = -1;
          for (let d = 0; d < 7; d++) {
            const day = new Date(start);
            day.setDate(start.getDate() + w * 7 + d);
            const ds = day.toISOString().split('T')[0];
            const isFuture = day > today;
            const cData = map[ds] || { count: 0, level: 0 };

            if (d === 0) weekMonth = day.getMonth();

            week.push({
              date: ds,
              displayDate: day.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
              count: isFuture ? 0 : cData.count,
              level: isFuture ? -1 : cData.level,
            });
          }

          if (weekMonth !== lastMonth && weekMonth !== -1) {
            monthHeaders.push({ weekIndex: w, name: MONTH_NAMES[weekMonth] });
            lastMonth = weekMonth;
          }

          builtWeeks.push(week);
        }

        setData({
          total,
          weeks: builtWeeks,
          monthHeaders,
        });
        setLoading(false);
      })
      .catch(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [username]);

  return (
    <div className="w-full flex flex-col gap-1.5 relative">
      {/* Header row with stats */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFD54F] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FFD54F]" />
          </span>
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#C6B99B] flex items-center gap-1.5">
            <GitBranch size={13} />
            GitHub Commit History
          </span>
          <a
            href={`https://github.com/${username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-mono text-neutral-400 hover:text-[#FFD54F] transition-colors flex items-center gap-1"
          >
            @{username}
            <ExternalLink size={10} className="opacity-70" />
          </a>
        </div>

        {/* Total contribution counter */}
        {data && (
          <div className="flex items-center gap-1.5 text-[10.5px] font-mono text-neutral-400">
            <span className="text-[#FFD54F] font-semibold">{data.total.toLocaleString()}</span> contributions this year
          </div>
        )}
      </div>

      {/* Heatmap Grid & Month Labels */}
      <div className="relative overflow-x-auto select-none py-1 custom-scrollbar">
        <div className="min-w-[520px] sm:min-w-0">
          {/* Month Headers */}
          <div className="flex gap-[3px] text-[9px] font-mono text-neutral-500 pl-4 mb-1">
            {data?.monthHeaders?.map((m, idx) => (
              <span
                key={idx}
                className="truncate"
                style={{
                  width: idx < data.monthHeaders.length - 1
                    ? `${(data.monthHeaders[idx + 1].weekIndex - m.weekIndex) * 16}px`
                    : '34px',
                }}
              >
                {m.name}
              </span>
            ))}
          </div>

          {/* Main Grid with Day Labels */}
          <div className="flex items-center gap-1.5">
            {/* Day of Week labels (M, W, F) */}
            <div className="flex flex-col gap-[2px] sm:gap-[3px] text-[8px] font-mono text-neutral-600 h-[48px] sm:h-[56px] lg:h-[60px] justify-between pb-0.5">
              {DAY_LABELS.map((d, i) => (
                <span key={i} className="h-[6px] sm:h-[7px] flex items-center justify-center w-2.5">{d}</span>
              ))}
            </div>

            {/* Grid Columns */}
            <div className="flex gap-[2px] sm:gap-[3px] flex-1 h-[48px] sm:h-[56px] lg:h-[60px]">
              {loading ? (
                Array.from({ length: 28 }).map((_, w) => (
                  <div key={w} className="flex flex-col gap-[2px] sm:gap-[3px] flex-1">
                    {Array.from({ length: 7 }).map((_, d) => (
                      <div key={d} className="flex-1 rounded-[2px] bg-white/[0.04] animate-pulse" />
                    ))}
                  </div>
                ))
              ) : data?.weeks ? (
                data.weeks.map((week, wi) => (
                  <div key={wi} className="flex flex-col gap-[2px] sm:gap-[3px] flex-1">
                    {week.map((day, di) => {
                      const isHovered = hoveredCell?.date === day.date;
                      return (
                        <div
                          key={di}
                          onMouseEnter={() => day.level >= 0 && setHoveredCell(day)}
                          onMouseLeave={() => setHoveredCell(null)}
                          onClick={() => day.level >= 0 && setHoveredCell((prev) => (prev?.date === day.date ? null : day))}
                          className={`flex-1 rounded-[2px] transition-all duration-150 relative ${day.level >= 0 ? 'hover:scale-125 active:scale-125 hover:z-20 cursor-pointer' : 'pointer-events-none'
                            }`}
                          style={{
                            backgroundColor: day.level < 0 ? 'transparent' : HEAT_COLORS[day.level],
                            boxShadow: day.level >= 3
                              ? '0 0 6px rgba(255, 213, 79, 0.45)'
                              : isHovered
                                ? '0 0 8px rgba(255, 255, 255, 0.6)'
                                : 'none',
                            border: day.level === 0 ? '1px solid rgba(255, 255, 255, 0.03)' : 'none',
                          }}
                        />
                      );
                    })}
                  </div>
                ))
              ) : null}
            </div>
          </div>
        </div>

        {/* Floating Tooltip */}
        {hoveredCell && (
          <div className="absolute bottom-[-24px] left-1/2 -translate-x-1/2 z-30 pointer-events-none px-2.5 py-1 rounded-md bg-[#181512] border border-[#7F7255]/60 shadow-2xl text-[10px] font-mono text-neutral-200 whitespace-nowrap">
            <span className="text-[#FFD54F] font-semibold">{hoveredCell.count} contribution{hoveredCell.count === 1 ? '' : 's'}</span> on {hoveredCell.displayDate}
          </div>
        )}
      </div>

      {/* Legend & Summary Row */}
      <div className="flex items-center justify-between text-[9.5px] font-mono text-neutral-500 pt-0.5">
        <span className="hidden sm:inline">Public repository contributions</span>
        <div className="flex items-center gap-1.5 ml-auto">
          <span>Less</span>
          {HEAT_COLORS.map((c, i) => (
            <div key={i} className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-[2px]" style={{ backgroundColor: c }} />
          ))}
          <span>More</span>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   About Component — Editorial Prose + Real Info
───────────────────────────────────────────── */
export default function About() {
  const [aboutRef, isRevealed] = useInView({ threshold: 0.15, once: false });

  return (
    <div
      ref={aboutRef}
      className={`section-lazy-render relative z-10 w-full flex-1 flex flex-col justify-start px-0 py-1 sm:py-2 ${isRevealed ? 'is-revealed' : ''
        }`}
    >
      {/* Section Header matching Tech Stack */}
      <div className="flex flex-col items-center text-center mb-3 sm:mb-4 lg:mb-5 px-4 sm:px-6 shrink-0">
        <div className="reveal-mask">
          <h2 className="reveal-title font-montserrat font-extrabold text-2xl sm:text-4xl lg:text-5xl text-white tracking-[0.03em]">
            About <span className="text-gold-gradient">Me</span>
          </h2>
        </div>
        <div className="reveal-line w-16 h-1 bg-[#7F7255] mx-auto mt-1.5 sm:mt-2.5 rounded-full" />
      </div>

      {/* Full-Width 2-Column Content Grid */}
      <div className="w-full flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8 xl:gap-12 items-center">

        {/* LEFT COLUMN — Frameless Portrait + Print Figure Metadata */}
        <div className="reveal-child reveal-delay-1 lg:col-span-4 xl:col-span-4 flex flex-col items-center lg:items-start text-center lg:text-left space-y-3">
          <div className="w-full flex justify-center lg:justify-start">
            <DitherPortrait className="max-w-[150px] sm:max-w-[180px] md:max-w-[200px] lg:max-w-[220px] xl:max-w-[260px] 2xl:max-w-[290px]" />
          </div>

          {/* Editorial Figure Caption & Academic Metadata (No Boxes/Cards) */}
          <div className="space-y-1.5 w-full flex flex-col items-center lg:items-start pt-1 border-t border-white/10 lg:border-t-0">
            <div className="flex items-center gap-2">
              <span className="font-montserrat font-bold text-xs sm:text-sm text-white tracking-wide">
                Neil Adrian Lugue
              </span>
            </div>

            <p className="text-[10.5px] sm:text-[11px] font-mono text-neutral-300 leading-snug">
              Bulacan State University · BSIT
            </p>
            <p className="text-[10px] sm:text-[10.5px] font-mono text-[#C6B99B] leading-snug">
              Magna Cum Laude · GPA 1.25 (President's List)
            </p>

            <div className="flex items-center gap-2 pt-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <span className="text-[9.5px] sm:text-[10px] font-mono text-emerald-400 font-medium tracking-wide">
                Available for Full-Time Roles
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN — Editorial 2-Column Broadsheet Story + Seamless Telemetry */}
        <div className="lg:col-span-8 xl:col-span-8 flex flex-col justify-center space-y-3 sm:space-y-3.5 lg:space-y-4">

          {/* Headline */}
          <div className="reveal-child reveal-delay-1">
            <h3 className="font-montserrat font-extrabold text-base sm:text-lg lg:text-[20px] xl:text-[24px] 2xl:text-[27px] leading-[1.25] tracking-tight text-white">
              {['Building', 'things', 'that'].map((w, i) => (
                <React.Fragment key={i}>
                  <MagneticWord>{w}</MagneticWord>{' '}
                </React.Fragment>
              ))}
              <MagneticWord className="italic font-light text-neutral-400">feel</MagneticWord>{' '}
              {['as', 'good', 'as', 'they'].map((w, i) => (
                <React.Fragment key={i}>
                  <MagneticWord>{w}</MagneticWord>{' '}
                </React.Fragment>
              ))}
              <MagneticWord className="text-gold-gradient">work.</MagneticWord>
            </h3>
          </div>

          {/* 2-Column Magazine Article Body */}
          <div className="reveal-child reveal-delay-2 grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-5 lg:gap-6 pt-0.5">
            <div className="space-y-2 text-left">
              <p className="text-[11.5px] sm:text-[12px] xl:text-[13px] text-neutral-200 font-light leading-[1.7] text-justify">
                Good software is more than a nice-looking interface, but the interface is still where people actually meet your work. I care about that and how an app feels to use, how fast it responds, how little friction there is between what someone wants to do and doing it.              </p>
            </div>
            <div className="space-y-2 text-left">
              <p className="text-[11.5px] sm:text-[12px] xl:text-[13px] text-neutral-300 font-light leading-[1.7] text-justify">
                I graduated Magna Cum Laude in IT from Bulacan State University, and since then I've focused on building apps that solve real, everyday problems instead of just checking boxes. I've shipped offline-first apps in React Native, built interfaces in React, and played around with WebGL for the visual side and always aiming for something that's solid under the hood and easy to actually use.              </p>
            </div>
          </div>

          {/* Hairline Editorial Divider */}
          <div className="reveal-line border-t border-white/10 w-full" />

          {/* Raw Floating GitHub Telemetry (Cardless) */}
          <div className="reveal-child reveal-delay-3 pt-0.5">
            <GitHubStatusWidget username="AdrianLugue" />
          </div>

          {/* Action CTAs */}
          <div className="reveal-child reveal-delay-4 flex flex-wrap items-center gap-3 pt-1">
            <Button
              href="https://github.com/AdrianLugue"
              target="_blank"
              rel="noopener noreferrer"
              size="sm"
              className="w-full sm:w-auto sm:min-w-[210px]"
              iconLeft={<GitBranch size={12} />}
              iconRight={<ExternalLink size={11} className="opacity-80 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />}
            >
              Explore GitHub Repos
            </Button>
            <Button
              href="#certifications"
              size="sm"
              variant="outline"
              className="w-full sm:w-auto sm:min-w-[210px]"
              iconLeft={<Award size={12} className="text-[#FFD54F]" />}
              iconRight={<ArrowRight size={11} className="opacity-80 transition-transform group-hover:translate-x-0.5" />}
            >
              View Certifications
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
}

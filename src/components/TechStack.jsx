import React, { useState } from 'react';
import {
  SiPhp,
  SiPython,
  SiJavascript,
  SiCplusplus,
  SiReact,
  SiHtml5,
  SiCss,
  SiTailwindcss,
  SiGoogle,
  SiNodedotjs,
  SiFirebase,
  SiMysql,
  SiPostgresql,
  SiGit,
  SiGithub,
  SiAndroidstudio,
  SiFigma,
  SiZoho,
  SiDocker,
} from 'react-icons/si';
import { FaJava } from 'react-icons/fa';
import { TbBrandCSharp, TbBrandReactNative, TbApi } from 'react-icons/tb';
import { VscVscode } from 'react-icons/vsc';
import { Repeat, LayoutGrid } from 'lucide-react';
import useInView from '../hooks/useInView';

export default function TechStack() {
  const [techRef, isRevealed] = useInView({ threshold: 0.15, once: false });
  const [viewMode, setViewMode] = useState('marquee'); // 'marquee' | 'rows'

  // Row 1 for Marquee: 12 Technologies (sliding left)
  const marqueeRow1 = [
    { name: 'JavaScript', category: 'Language', icon: <SiJavascript className="text-[#F7DF1E]" size={28} /> },
    { name: 'React', category: 'Frontend', icon: <SiReact className="text-[#61DAFB]" size={28} /> },
    { name: 'Node.js', category: 'Backend', icon: <SiNodedotjs className="text-[#339933]" size={28} /> },
    { name: 'Python', category: 'Language', icon: <SiPython className="text-[#3776AB]" size={28} /> },
    { name: 'PostgreSQL', category: 'Database', icon: <SiPostgresql className="text-[#4169E1]" size={28} /> },
    { name: 'Docker', category: 'DevOps', icon: <SiDocker className="text-[#2496ED]" size={28} /> },
    { name: 'Tailwind CSS', category: 'Frontend', icon: <SiTailwindcss className="text-[#38BDF8]" size={28} /> },
    { name: 'Java', category: 'Language', icon: <FaJava className="text-[#EA2D2E]" size={28} /> },
    { name: 'REST APIs', category: 'Backend', icon: <TbApi className="text-[#C6B99B]" size={28} /> },
    { name: 'Git', category: 'Tooling', icon: <SiGit className="text-[#F05032]" size={28} /> },
    { name: 'Android Studio', category: 'Mobile IDE', icon: <SiAndroidstudio className="text-[#3DDC84]" size={28} /> },
    { name: 'PHP', category: 'Language', icon: <SiPhp className="text-[#777BB4]" size={28} /> },
  ];

  // Row 2 for Marquee: 12 Technologies (sliding right)
  const marqueeRow2 = [
    { name: 'React Native', category: 'Mobile', icon: <TbBrandReactNative className="text-[#61DAFB]" size={28} /> },
    { name: 'C++', category: 'Language', icon: <SiCplusplus className="text-[#00599C]" size={28} /> },
    { name: 'MySQL', category: 'Database', icon: <SiMysql className="text-[#4479A1]" size={28} /> },
    { name: 'C#', category: 'Language', icon: <TbBrandCSharp className="text-[#9B4F96]" size={28} /> },
    { name: 'GitHub', category: 'Collaboration', icon: <SiGithub className="text-white" size={28} /> },
    { name: 'HTML5', category: 'Frontend', icon: <SiHtml5 className="text-[#E34F26]" size={28} /> },
    { name: 'CSS3', category: 'Frontend', icon: <SiCss className="text-[#1572B6]" size={28} /> },
    { name: 'Firebase', category: 'Cloud BaaS', icon: <SiFirebase className="text-[#FFCA28]" size={28} /> },
    { name: 'VS Code', category: 'Editor', icon: <VscVscode className="text-[#007ACC]" size={28} /> },
    { name: 'Figma', category: 'UI/UX Design', icon: <SiFigma className="text-[#F24E1E]" size={28} /> },
    { name: 'Google App Scripts', category: 'Automation', icon: <SiGoogle className="text-[#4285F4]" size={28} /> },
    { name: 'Zoho Inventory', category: 'ERP & Ops', icon: <SiZoho className="text-[#D32F2F]" size={28} /> },
  ];

  const doubleRow1 = [...marqueeRow1, ...marqueeRow1];
  const doubleRow2 = [...marqueeRow2, ...marqueeRow2];

  // Categorized Data for Option 1 (Non-Scrolling Rows)
  const categorizedRows = [
    {
      title: 'Languages',
      skills: [
        { name: 'JavaScript', icon: <SiJavascript className="text-[#F7DF1E]" size={20} /> },
        { name: 'Python', icon: <SiPython className="text-[#3776AB]" size={20} /> },
        { name: 'Java', icon: <FaJava className="text-[#EA2D2E]" size={20} /> },
        { name: 'PHP', icon: <SiPhp className="text-[#777BB4]" size={20} /> },
        { name: 'C++', icon: <SiCplusplus className="text-[#00599C]" size={20} /> },
        { name: 'C#', icon: <TbBrandCSharp className="text-[#9B4F96]" size={20} /> },
      ],
    },
    {
      title: 'Frontend & Mobile',
      skills: [
        { name: 'React', icon: <SiReact className="text-[#61DAFB]" size={20} /> },
        { name: 'React Native', icon: <TbBrandReactNative className="text-[#61DAFB]" size={20} /> },
        { name: 'Tailwind CSS', icon: <SiTailwindcss className="text-[#38BDF8]" size={20} /> },
        { name: 'HTML5', icon: <SiHtml5 className="text-[#E34F26]" size={20} /> },
        { name: 'CSS3', icon: <SiCss className="text-[#1572B6]" size={20} /> },
      ],
    },
    {
      title: 'Backend & Databases',
      skills: [
        { name: 'Node.js', icon: <SiNodedotjs className="text-[#339933]" size={20} /> },
        { name: 'REST APIs', icon: <TbApi className="text-[#C6B99B]" size={20} /> },
        { name: 'PostgreSQL', icon: <SiPostgresql className="text-[#4169E1]" size={20} /> },
        { name: 'MySQL', icon: <SiMysql className="text-[#4479A1]" size={20} /> },
        { name: 'Firebase', icon: <SiFirebase className="text-[#FFCA28]" size={20} /> },
      ],
    },
    {
      title: 'Tools & Platforms',
      skills: [
        { name: 'Docker', icon: <SiDocker className="text-[#2496ED]" size={20} /> },
        { name: 'Git', icon: <SiGit className="text-[#F05032]" size={20} /> },
        { name: 'GitHub', icon: <SiGithub className="text-white" size={20} /> },
        { name: 'VS Code', icon: <VscVscode className="text-[#007ACC]" size={20} /> },
        { name: 'Android Studio', icon: <SiAndroidstudio className="text-[#3DDC84]" size={20} /> },
        { name: 'Figma', icon: <SiFigma className="text-[#F24E1E]" size={20} /> },
        { name: 'Google App Scripts', icon: <SiGoogle className="text-[#4285F4]" size={20} /> },
        { name: 'Zoho Inventory', icon: <SiZoho className="text-[#D32F2F]" size={20} /> },
      ],
    },
  ];

  return (
    <div
      ref={techRef}
      className={`section-lazy-render relative w-full flex-1 flex flex-col justify-start px-0 py-1 sm:py-2 z-10 overflow-hidden ${
        isRevealed ? 'is-revealed' : ''
      }`}
    >
      {/* Section Header with View Mode Toggle */}
      <div className="flex flex-col items-center text-center mb-3 sm:mb-4 lg:mb-5 px-4 sm:px-6 shrink-0">
        <div className="reveal-mask">
          <h2 className="reveal-title font-montserrat font-extrabold text-2xl sm:text-4xl lg:text-5xl text-white tracking-[0.03em]">
            Tech <span className="text-gold-gradient">Stack</span>
          </h2>
        </div>
        <div className="reveal-line w-16 h-1 bg-[#7F7255] mx-auto mt-1.5 sm:mt-2.5 mb-2.5 sm:mb-3.5 rounded-full" />

        {/* Toggle Switch: Marquee vs Rows */}
        <div className="reveal-child reveal-delay-1 inline-flex p-1 rounded-full halftone-panel shadow-lg">
          <button
            onClick={() => setViewMode('marquee')}
            className={`flex items-center justify-center min-w-[135px] sm:min-w-[155px] gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-montserrat font-medium transition-all duration-200 cursor-pointer ${viewMode === 'marquee'
              ? 'bg-[#7F7255] text-white shadow-lg shadow-[#7F7255]/40 ring-1 ring-white/60'
              : 'text-[#A3A3A3] hover:text-white hover:bg-white/5'
              }`}
          >
            <Repeat size={13} className={viewMode === 'marquee' ? 'animate-spin-slow' : ''} />
            Marquee View
          </button>
          <button
            onClick={() => setViewMode('rows')}
            className={`flex items-center justify-center min-w-[135px] sm:min-w-[155px] gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-montserrat font-medium transition-all duration-200 cursor-pointer ${viewMode === 'rows'
              ? 'bg-[#7F7255] text-white shadow-lg shadow-[#7F7255]/40 ring-1 ring-white/60'
              : 'text-[#A3A3A3] hover:text-white hover:bg-white/5'
              }`}
          >
            <LayoutGrid size={13} />
            Categorized Rows
          </button>
        </div>
      </div>

      <div className="reveal-child reveal-delay-2 w-full flex-1 flex flex-col justify-start pt-1 sm:pt-2">

        {/* VIEW 1: Dual-Row Animated Marquee with Halftone Dither Edge Dissolve */}
        {viewMode === 'marquee' && (
          <div
            className="relative w-full overflow-hidden py-2 space-y-3.5 sm:space-y-4 lg:space-y-5 animate-fadeIn"
            style={{
              maskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.5) 3%, black 8%, black 92%, rgba(0,0,0,0.5) 97%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.5) 3%, black 8%, black 92%, rgba(0,0,0,0.5) 97%, transparent 100%)',
            }}
          >
            {/* Halftone Dither Edge Accents (Alpha-only, preserves continuous WebGL shader background) */}
            <div
              className="pointer-events-none absolute inset-y-0 left-0 w-24 sm:w-40 z-20 opacity-80"
              style={{
                backgroundImage: 'radial-gradient(circle, rgba(255, 213, 79, 0.25) 1px, transparent 1px)',
                backgroundSize: '4px 4px',
                maskImage: 'linear-gradient(to right, black 0%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to right, black 0%, transparent 100%)',
              }}
            />
            <div
              className="pointer-events-none absolute inset-y-0 right-0 w-24 sm:w-40 z-20 opacity-80"
              style={{
                backgroundImage: 'radial-gradient(circle, rgba(255, 213, 79, 0.25) 1px, transparent 1px)',
                backgroundSize: '4px 4px',
                maskImage: 'linear-gradient(to left, black 0%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to left, black 0%, transparent 100%)',
              }}
            />

            {/* Row 1: Sliding Left */}
            <div className="animate-marquee gap-3.5 sm:gap-5 flex items-center">
              {doubleRow1.map((item, idx) => (
                <div
                  key={`r1-${idx}`}
                  className="px-4 py-2.5 sm:px-5 sm:py-3.5 rounded-2xl halftone-pill flex items-center gap-3 sm:gap-4 shrink-0 group/pill cursor-default"
                >
                  <div className="w-9 h-9 rounded-xl bg-black/60 border border-white/10 flex items-center justify-center shrink-0 group-hover/pill:border-[#FFD54F]/40 group-hover/pill:scale-110 transition-all duration-200">
                    {item.icon}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="font-montserrat font-semibold text-sm sm:text-base text-white group-hover/pill:text-[#FFD54F] transition-colors whitespace-nowrap">
                      {item.name}
                    </span>
                    <span className="text-[10px] text-[#A39B8B] font-mono uppercase tracking-wider">
                      {item.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Row 2: Sliding Right */}
            <div className="animate-marquee-reverse gap-5 flex items-center">
              {doubleRow2.map((item, idx) => (
                <div
                  key={`r2-${idx}`}
                  className="px-5 py-3.5 rounded-2xl halftone-pill flex items-center gap-4 shrink-0 group/pill cursor-default"
                >
                  <div className="w-9 h-9 rounded-xl bg-black/60 border border-white/10 flex items-center justify-center shrink-0 group-hover/pill:border-[#FFD54F]/40 group-hover/pill:scale-110 transition-all duration-200">
                    {item.icon}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="font-montserrat font-semibold text-sm sm:text-base text-white group-hover/pill:text-[#FFD54F] transition-colors whitespace-nowrap">
                      {item.name}
                    </span>
                    <span className="text-[10px] text-[#A39B8B] font-mono uppercase tracking-wider">
                      {item.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 2: Static Non-Scrolling Categorized Rows (Option 1) */}
        {viewMode === 'rows' && (
          <div className="space-y-3.5 max-w-5xl mx-auto w-full animate-fadeIn py-2 px-4 sm:px-6">
            {categorizedRows.map((cat, idx) => (
              <div
                key={idx}
                className="halftone-card rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center gap-3 sm:gap-6 group"
              >
                {/* Category Label on Left */}
                <div className="md:w-52 shrink-0 flex items-center gap-2.5 pb-2 md:pb-0 border-b md:border-b-0 md:border-r border-white/10">
                  <span className="font-montserrat font-bold text-sm sm:text-base text-white group-hover:text-[#FFD54F] transition-colors whitespace-nowrap">
                    {cat.title}
                  </span>
                </div>

                {/* Skills Flex Row on Right */}
                <div className="flex flex-wrap items-center gap-2.5 flex-1">
                  {cat.skills.map((skill, sIdx) => (
                    <div
                      key={sIdx}
                      className="px-3.5 py-2 rounded-xl halftone-pill hover:scale-105 transition-all duration-200 flex items-center gap-2.5 group/item cursor-default"
                    >
                      <div className="w-5 h-5 flex items-center justify-center shrink-0 group-hover/item:scale-110 transition-transform">
                        {skill.icon}
                      </div>
                      <span className="font-montserrat font-medium text-xs sm:text-[13px] text-neutral-200 group-hover/item:text-white transition-colors">
                        {skill.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

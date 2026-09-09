import React, { useState, useEffect, useRef, Component } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Dithering } from '@paper-design/shaders-react';
import {
  ChevronLeft,
  ChevronRight,
  GitBranch,
  Smartphone,
  Terminal,
  Image as ImageIcon,
  ExternalLink,
  Briefcase,
  Layers,
  Sparkles,
  CheckCircle2,
  Calendar,
  Play,
  Video,
  ShieldCheck,
  Film,
  Grid,
  FolderGit2,
  ArrowRight,
  ArrowLeft,
  ArrowUpRight,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { PROJECTS_DATA } from '../data/projectsData';
import Button from './Button';

class ShaderErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) return this.props.fallback ?? null;
    return this.props.children;
  }
}

export default function ProjectExplorer() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  // If URL has no :projectId, default to 'grid' view; otherwise 'detail'
  const [viewMode, setViewMode] = useState(projectId ? 'detail' : 'grid');
  const [selectedProjectId, setSelectedProjectId] = useState(projectId || '01');
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (projectId) {
      setSelectedProjectId(projectId);
      setViewMode('detail');
      setActiveMediaIndex(0);
    } else {
      setViewMode('grid');
    }
  }, [projectId]);

  const selectedProject =
    PROJECTS_DATA.find((p) => p.id === selectedProjectId) || PROJECTS_DATA[0];
  const currentIndex = PROJECTS_DATA.findIndex((p) => p.id === selectedProjectId);

  const handleSelectProject = (id) => {
    setSelectedProjectId(id);
    setActiveMediaIndex(0);
    setViewMode('detail');
    navigate(`/projects/${id}`);
  };

  const handlePrev = () => {
    const prevIdx = currentIndex === 0 ? PROJECTS_DATA.length - 1 : currentIndex - 1;
    handleSelectProject(PROJECTS_DATA[prevIdx].id);
  };

  const handleNext = () => {
    const nextIdx = currentIndex === PROJECTS_DATA.length - 1 ? 0 : currentIndex + 1;
    handleSelectProject(PROJECTS_DATA[nextIdx].id);
  };

  const touchStartX = useRef(0);

  const handleMediaTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleMediaTouchEnd = (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (selectedProject?.media && selectedProject.media.length > 1) {
      if (diff > 45) {
        // Swipe Left -> Next Media Slide
        setActiveMediaIndex((prev) =>
          prev === selectedProject.media.length - 1 ? 0 : prev + 1
        );
      } else if (diff < -45) {
        // Swipe Right -> Prev Media Slide
        setActiveMediaIndex((prev) =>
          prev === 0 ? selectedProject.media.length - 1 : prev - 1
        );
      }
    }
  };

  const activeMediaItem =
    selectedProject?.media && selectedProject.media[activeMediaIndex]
      ? selectedProject.media[activeMediaIndex]
      : selectedProject?.mockupImage
        ? { type: 'image', url: selectedProject.mockupImage, title: selectedProject.title }
        : null;

  return (
    <div className="flex-1 w-full min-h-0 flex flex-col lg:flex-row bg-[#050505] text-white overflow-hidden select-none">

      {/* ── MOBILE TOP STICKY CHIP BAR (Clean, fast horizontal switcher on mobile) ── */}
      <div className="flex lg:hidden w-full overflow-x-auto bg-[#0C0B09] border-b border-white/10 p-2 sm:p-2.5 gap-1.5 items-center custom-scrollbar shrink-0 z-30 sticky top-0">
        {/* All Projects Grid Toggle Pill */}
        <button
          onClick={() => {
            if (viewMode === 'grid') {
              setViewMode('detail');
              navigate(`/projects/${selectedProjectId}`);
            } else {
              setViewMode('grid');
              navigate('/projects');
            }
          }}
          className={`px-3 py-1.5 rounded-xl text-xs font-montserrat font-bold flex items-center gap-1.5 shrink-0 transition-all cursor-pointer ${
            viewMode === 'grid'
              ? 'bg-[#FFD54F] text-black shadow-[0_0_12px_rgba(255,213,79,0.3)]'
              : 'bg-white/[0.04] text-neutral-300 hover:text-white border border-white/10'
          }`}
        >
          <Grid size={13} />
          <span>All ({PROJECTS_DATA.length})</span>
        </button>

        {/* Project Selector Pills */}
        {PROJECTS_DATA.map((project) => {
          const isSelected = viewMode === 'detail' && selectedProjectId === project.id;
          return (
            <button
              key={project.id}
              onClick={() => handleSelectProject(project.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-montserrat font-medium flex items-center gap-1.5 shrink-0 transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#FFD54F] text-black font-bold shadow-[0_0_12px_rgba(255,213,79,0.3)]'
                  : 'bg-white/[0.03] text-neutral-400 hover:text-white hover:bg-white/[0.08] border border-white/5'
              }`}
            >
              <span className={`font-mono text-[10.5px] ${isSelected ? 'text-black/70' : 'text-[#C6B99B]'}`}>
                {project.id}
              </span>
              <span className="truncate max-w-[140px] sm:max-w-none">{project.title}</span>
            </button>
          );
        })}
      </div>

      {/* ── DESKTOP LEFT SIDEBAR: Collapsible Project Switcher ── */}
      <aside
        className={`hidden lg:flex flex-shrink-0 bg-[#090807] border-r border-white/10 flex-col h-full z-20 transition-all duration-300 ease-in-out ${isSidebarCollapsed
          ? 'w-[68px]'
          : 'w-[280px] xl:w-[300px]'
          }`}
      >
        {/* Sidebar Header: Collapse Toggle + Mode Buttons */}
        <div className="p-3 sm:p-3.5 border-b border-white/10 flex items-center justify-between bg-[#0C0B09]">
          {!isSidebarCollapsed && (
            <div className="flex items-center gap-2 text-white font-montserrat font-bold text-xs">
              <FolderGit2 size={14} className="text-[#FFD54F]" />
              <span>PROJECTS</span>
              <span className="text-[10px] font-mono text-[#C6B99B] bg-white/[0.05] px-1.5 py-0.5 rounded">
                {PROJECTS_DATA.length}
              </span>
            </div>
          )}

          <div className={`flex items-center gap-1.5 ${isSidebarCollapsed ? 'w-full justify-center' : ''}`}>
            {/* All Grid Toggle */}
            <button
              onClick={() => {
                if (viewMode === 'grid') {
                  setViewMode('detail');
                  navigate(`/projects/${selectedProjectId}`);
                } else {
                  setViewMode('grid');
                  navigate('/projects');
                }
              }}
              title={viewMode === 'grid' ? 'Return to Detail View' : 'View All Projects Grid'}
              className={`p-1.5 rounded-lg border transition-all cursor-pointer ${viewMode === 'grid'
                ? 'bg-[#FFD54F] text-black border-[#FFD54F]'
                : 'bg-white/[0.04] text-neutral-300 hover:text-white hover:bg-white/[0.08] border-white/10'
                }`}
            >
              <Grid size={13} />
            </button>

            {/* Sidebar Collapse/Expand Toggle (Desktop) */}
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              title={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
              className="hidden lg:flex p-1.5 rounded-lg bg-white/[0.04] text-neutral-400 hover:text-white hover:bg-white/[0.08] border border-white/10 transition-all cursor-pointer"
            >
              {isSidebarCollapsed ? <PanelLeftOpen size={13} /> : <PanelLeftClose size={13} />}
            </button>
          </div>
        </div>

        {/* Project List (Reduced Details) */}
        <div data-lenis-prevent className="flex-1 overflow-y-auto p-2 sm:p-2.5 space-y-1.5 custom-scrollbar">
          {PROJECTS_DATA.map((project) => {
            const isSelected = viewMode === 'detail' && selectedProjectId === project.id;

            if (isSidebarCollapsed) {
              /* Collapsed Compact Button */
              return (
                <button
                  key={project.id}
                  onClick={() => handleSelectProject(project.id)}
                  title={`${project.id} - ${project.title}`}
                  className={`w-full h-11 rounded-xl flex items-center justify-center font-mono text-xs font-bold transition-all cursor-pointer ${isSelected
                    ? 'bg-[#FFD54F] text-black shadow-[0_0_15px_rgba(255,213,79,0.3)]'
                    : 'bg-white/[0.03] text-neutral-400 hover:text-white hover:bg-white/[0.08] border border-white/5'
                    }`}
                >
                  {project.id}
                </button>
              );
            }

            /* Expanded Clean Minimal Card */
            return (
              <div
                key={project.id}
                onClick={() => handleSelectProject(project.id)}
                className={`relative px-3 py-2.5 rounded-xl border transition-all duration-200 cursor-pointer group text-left ${isSelected
                  ? 'bg-gradient-to-r from-white/[0.08] to-transparent border-[#FFD54F]/60 shadow-[0_0_15px_rgba(255,213,79,0.08)]'
                  : 'bg-white/[0.02] border-white/5 hover:border-white/20 hover:bg-white/[0.04]'
                  }`}
              >
                {/* Active Indicator Accent Line */}
                {isSelected && (
                  <div className="absolute left-0 top-2 bottom-2 w-1 bg-[#FFD54F] rounded-r-full shadow-[0_0_8px_#FFD54F]" />
                )}

                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <h4
                      className={`font-montserrat font-bold text-xs sm:text-[13px] tracking-wide truncate transition-colors ${isSelected
                        ? 'text-white'
                        : 'text-neutral-300 group-hover:text-white'
                        }`}
                    >
                      {project.title}
                    </h4>
                  </div>

                  <ArrowRight
                    size={12}
                    className={`shrink-0 transition-transform ${isSelected
                      ? 'text-[#FFD54F] translate-x-0.5'
                      : 'text-neutral-600 group-hover:text-neutral-400'
                      }`}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Sidebar Footer Info */}
        {!isSidebarCollapsed && (
          <div className="p-3 border-t border-white/10 bg-black/40 text-center shrink-0">
            <span className="text-[10.5px] font-mono text-neutral-500">
              Interactive System Architecture Vault
            </span>
          </div>
        )}
      </aside>

      {/* ── RIGHT MAIN STAGE: 100% Height (Detail vs All Grid) ── */}
      <main className="flex-1 h-full min-h-0 bg-[#060504] flex flex-col overflow-hidden">

        {/* ══════════════════════════════════════════
            MODE A: ALL PROJECTS SHOWCASE GRID
        ══════════════════════════════════════════ */}
        {viewMode === 'grid' ? (
          <div data-lenis-prevent className="flex-1 overflow-y-auto p-5 sm:p-8 lg:p-10 space-y-6 custom-scrollbar text-left">
            {/* Grid Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-5">
              <div>
                <div className="flex items-center gap-2">
                  <Grid size={20} className="text-[#FFD54F]" />
                  <h3 className="font-montserrat font-extrabold text-2xl sm:text-3xl text-white">
                    All Projects Showcase
                  </h3>
                </div>
              </div>

              <span className="text-xs font-mono text-[#C6B99B] bg-white/[0.04] px-3.5 py-1.5 rounded-xl border border-white/10 shrink-0">
                {PROJECTS_DATA.length} Projects Total
              </span>
            </div>

            {/* 3-Column Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pt-2 pb-8">
              {PROJECTS_DATA.map((project) => (
                <div
                  key={project.id}
                  onClick={() => handleSelectProject(project.id)}
                  className="group rounded-2xl bg-[#0E0C0A] border border-white/10 hover:border-[#FFD54F]/50 p-5 flex flex-col justify-between space-y-4 transition-all duration-300 hover:shadow-[0_15px_40px_rgba(255,213,79,0.1)] cursor-pointer"
                >
                  {/* Media Preview Box */}
                  <div className="relative w-full h-[200px] rounded-xl overflow-hidden bg-[#0A0908] border border-white/10 flex items-center justify-center">
                    <div className="absolute inset-0 opacity-40 group-hover:opacity-75 transition-opacity">
                      <ShaderErrorBoundary fallback={null}>
                        <Dithering
                          speed={0.4}
                          shape="simplex"
                          type="4x4"
                          size={2.2}
                          scale={0.5}
                          colorBack="#00000000"
                          colorFront={project.accentColor || '#FFD54F'}
                          className="w-full h-full object-cover"
                        />
                      </ShaderErrorBoundary>
                    </div>

                    {project.mockupImage ? (
                      <img
                        src={project.mockupImage}
                        alt={project.title}
                        loading="lazy"
                        decoding="async"
                        className="relative z-10 max-h-[85%] max-w-[88%] object-contain drop-shadow-xl group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="relative z-10 w-14 h-14 rounded-xl bg-white/[0.04] border border-white/15 flex items-center justify-center text-[#FFD54F]">
                        {project.deviceType === 'mobile' ? (
                          <Smartphone size={28} />
                        ) : (
                          <Terminal size={28} />
                        )}
                      </div>
                    )}
                  </div>

                  {/* Card Body */}
                  <div className="space-y-1.5">
                    <h4 className="font-montserrat font-bold text-lg text-white group-hover:text-[#FFD54F] transition-colors">
                      {project.title}
                    </h4>

                    <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                      {project.tagline}
                    </p>
                  </div>

                  {/* Tech Pills */}
                  <div className="pt-2 border-t border-white/5">
                    <div className="flex flex-wrap gap-1.5">
                      {project.techStack.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="text-[10.5px] font-mono text-neutral-300 bg-white/[0.03] px-2 py-0.5 rounded border border-white/5"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* ══════════════════════════════════════════
              MODE B: INDIVIDUAL PROJECT DEEP-DIVE
          ══════════════════════════════════════════ */
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">

            {/* Sub-header Bar: Breadcrumbs + Controls */}
            <div className="px-3 sm:px-8 py-2.5 sm:py-3 border-b border-white/10 bg-[#0C0B09] flex items-center justify-between shrink-0 gap-2">
              <div className="flex items-center gap-1.5 sm:gap-3 min-w-0">
                <button
                  onClick={() => {
                    setViewMode('grid');
                    navigate('/projects');
                  }}
                  className="inline-flex items-center gap-1 text-xs font-mono text-neutral-400 hover:text-white transition-colors cursor-pointer shrink-0"
                >
                  <ArrowLeft size={13} />
                  <span className="hidden xs:inline">All Projects</span>
                  <span className="xs:hidden">All</span>
                </button>
                <span className="text-neutral-600">/</span>
                <span className="text-[10.5px] sm:text-[11px] font-mono uppercase tracking-wider text-[#FFD54F] bg-[#FFD54F]/10 px-2 sm:px-2.5 py-0.5 rounded border border-[#FFD54F]/20 font-semibold truncate max-w-[130px] sm:max-w-none">
                  /{selectedProject.id} {selectedProject.title}
                </span>
                {selectedProject.isTurnedOver && (
                  <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-mono text-[#FFD54F] bg-white/[0.03] px-2.5 py-0.5 rounded-full border border-[#FFD54F]/20">
                    <ShieldCheck size={12} />
                    <span>BulSU Capstone Custody</span>
                  </span>
                )}
              </div>

              {/* Prev / Next controls */}
              <div className="flex items-center gap-1 bg-white/[0.04] p-0.5 rounded-xl border border-white/10 shrink-0">
                <button
                  onClick={handlePrev}
                  aria-label="Previous Project"
                  className="p-1 sm:p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/[0.08] transition-all cursor-pointer"
                >
                  <ChevronLeft size={15} />
                </button>
                <span className="text-[10.5px] sm:text-[11px] font-mono text-neutral-400 px-1 sm:px-1.5">
                  {currentIndex + 1} / {PROJECTS_DATA.length}
                </span>
                <button
                  onClick={handleNext}
                  aria-label="Next Project"
                  className="p-1 sm:p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/[0.08] transition-all cursor-pointer"
                >
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>

            {/* 2-Column Split: Media Showcase (58%) & Case Study Details (42%) */}
            <div data-lenis-prevent className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 overflow-y-auto lg:overflow-hidden">

              {/* ── LEFT COLUMN: Interactive Media Carousel Showcase (58%) ── */}
              <div className="lg:col-span-7 flex flex-col p-3 sm:p-5 lg:p-6 border-b lg:border-b-0 lg:border-r border-white/10 bg-[#060504] min-h-[260px] sm:min-h-[340px] lg:min-h-0 overflow-hidden">

                {/* Media Carousel Viewport */}
                <div
                  onTouchStart={handleMediaTouchStart}
                  onTouchEnd={handleMediaTouchEnd}
                  className="relative flex-1 w-full min-h-[240px] sm:min-h-[300px] rounded-[18px] sm:rounded-[22px] overflow-hidden bg-[#0A0908] border border-white/15 flex items-center justify-center shadow-inner group cursor-grab active:cursor-grabbing"
                >

                  {/* Paper Dither Background Aura */}
                  <div className="absolute inset-0 pointer-events-none opacity-50">
                    <ShaderErrorBoundary fallback={null}>
                      <Dithering
                        speed={0.5}
                        shape="simplex"
                        type="4x4"
                        size={2.2}
                        scale={0.5}
                        colorBack="#00000000"
                        colorFront={selectedProject.accentColor || '#FFD54F'}
                        className="w-full h-full object-cover"
                      />
                    </ShaderErrorBoundary>
                  </div>
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        'radial-gradient(ellipse at 50% 50%, rgba(10,9,8,0.15) 0%, rgba(10,9,8,0.9) 85%, #000000 100%)',
                    }}
                  />

                  {/* Top Slide Name & Badge */}
                  {selectedProject.media && selectedProject.media.length > 1 && (
                    <div className="absolute top-4 left-4 z-30 flex items-center gap-2">
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/80 border border-white/15 backdrop-blur-md text-[11px] font-mono text-white shadow-lg">
                        {activeMediaItem?.type === 'video' ? (
                          <Film size={12} className="text-[#FFD54F]" />
                        ) : (
                          <ImageIcon size={12} className="text-[#FFD54F]" />
                        )}
                        <span>{activeMediaItem?.title || `Slide ${activeMediaIndex + 1}`}</span>
                      </div>
                    </div>
                  )}

                  {/* Left Carousel Arrow Button */}
                  {selectedProject.media && selectedProject.media.length > 1 && (
                    <button
                      onClick={() =>
                        setActiveMediaIndex((prev) =>
                          prev === 0 ? selectedProject.media.length - 1 : prev - 1
                        )
                      }
                      aria-label="Previous Media Slide"
                      className="absolute left-3.5 sm:left-4 z-30 w-10 h-10 rounded-full bg-black/75 hover:bg-black/95 border border-white/20 hover:border-[#FFD54F]/70 text-white hover:text-[#FFD54F] flex items-center justify-center transition-all duration-200 cursor-pointer backdrop-blur-md shadow-xl active:scale-95"
                    >
                      <ChevronLeft size={20} />
                    </button>
                  )}

                  {/* Right Carousel Arrow Button */}
                  {selectedProject.media && selectedProject.media.length > 1 && (
                    <button
                      onClick={() =>
                        setActiveMediaIndex((prev) =>
                          prev === selectedProject.media.length - 1 ? 0 : prev + 1
                        )
                      }
                      aria-label="Next Media Slide"
                      className="absolute right-3.5 sm:right-4 z-30 w-10 h-10 rounded-full bg-black/75 hover:bg-black/95 border border-white/20 hover:border-[#FFD54F]/70 text-white hover:text-[#FFD54F] flex items-center justify-center transition-all duration-200 cursor-pointer backdrop-blur-md shadow-xl active:scale-95"
                    >
                      <ChevronRight size={20} />
                    </button>
                  )}

                  {/* Main Media Item Content */}
                  {activeMediaItem?.type === 'video' ? (
                    activeMediaItem.url ? (
                      <video
                        key={activeMediaItem.url}
                        src={activeMediaItem.url}
                        controls
                        playsInline
                        preload="none"
                        className="relative z-10 max-h-[94%] max-w-[96%] object-contain rounded-xl shadow-2xl"
                      />
                    ) : activeMediaItem.embedUrl ? (
                      <div className="relative z-10 w-full h-full max-h-[94%] max-w-[96%] aspect-video rounded-xl overflow-hidden shadow-2xl border border-white/10 bg-black">
                        <iframe
                          src={activeMediaItem.embedUrl}
                          title={activeMediaItem.title}
                          className="w-full h-full border-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        />
                      </div>
                    ) : (
                      <div className="relative z-10 flex flex-col items-center justify-center text-center p-6 space-y-3 max-w-md">
                        <div className="w-16 h-16 rounded-full bg-[#FFD54F]/10 border border-[#FFD54F]/40 flex items-center justify-center text-[#FFD54F] shadow-[0_0_25px_rgba(255,213,79,0.2)]">
                          <Video size={28} />
                        </div>
                        <div className="space-y-1">
                          <p className="font-montserrat font-bold text-base text-white">
                            {activeMediaItem.title}
                          </p>
                          <p className="text-xs text-neutral-300 leading-relaxed">
                            {activeMediaItem.caption}
                          </p>
                        </div>
                        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/80 border border-[#FFD54F]/30 backdrop-blur-md text-[10.5px] font-mono text-[#FFD54F]">
                          <Sparkles size={11} />
                          <span>Video slot ready: place demo file in assets/</span>
                        </div>
                      </div>
                    )
                  ) : activeMediaItem?.url ? (
                    <img
                      src={activeMediaItem.url}
                      alt={activeMediaItem.title || selectedProject.title}
                      loading="lazy"
                      decoding="async"
                      className="relative z-10 max-h-[92%] max-w-[94%] object-contain drop-shadow-[0_20px_45px_rgba(0,0,0,0.95)] rounded-xl transition-all duration-300"
                    />
                  ) : (
                    <div className="relative z-10 flex flex-col items-center justify-center text-center p-4 space-y-2">
                      <div className="w-14 h-14 rounded-xl bg-white/[0.04] border border-white/15 flex items-center justify-center text-[#FFD54F]">
                        {selectedProject.deviceType === 'mobile' ? (
                          <Smartphone size={28} />
                        ) : (
                          <Terminal size={28} />
                        )}
                      </div>
                      <p className="font-montserrat font-bold text-base text-white">
                        {selectedProject.title}
                      </p>
                    </div>
                  )}

                  {/* Bottom Carousel Indicator Dots */}
                  {selectedProject.media && selectedProject.media.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/80 border border-white/15 backdrop-blur-md shadow-lg">
                      {selectedProject.media.map((_, dotIdx) => (
                        <button
                          key={dotIdx}
                          onClick={() => setActiveMediaIndex(dotIdx)}
                          aria-label={`Go to slide ${dotIdx + 1}`}
                          className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${activeMediaIndex === dotIdx
                            ? 'w-6 bg-[#FFD54F] shadow-[0_0_8px_rgba(255,213,79,0.7)]'
                            : 'w-2 bg-white/30 hover:bg-white/60'
                            }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* ── RIGHT COLUMN: Case Study Details & Features (42%) ── */}
              <div data-lenis-prevent className="lg:col-span-5 flex flex-col h-auto lg:h-full lg:overflow-y-auto p-4 sm:p-5 lg:p-6 space-y-4 sm:space-y-5 custom-scrollbar text-left bg-[#0A0908]">

                {/* Title & Tagline */}
                <div className="space-y-1.5">
                  <h3 className="font-montserrat font-extrabold text-2xl sm:text-3xl text-white">
                    {selectedProject.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                    {selectedProject.tagline}
                  </p>
                </div>

                {/* Problem & Solution Overview */}
                {selectedProject.description && (
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-[#FFD54F] font-semibold">
                      // Problem & Solution
                    </span>
                    <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                      {selectedProject.description}
                    </p>
                  </div>
                )}

                {/* Key Features Checklist */}
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2">
                    <Layers size={15} className="text-[#FFD54F]" />
                    <h4 className="font-montserrat font-bold text-xs sm:text-sm text-white tracking-wide uppercase">
                      Key Features & Architecture
                    </h4>
                  </div>
                  <div className="space-y-2">
                    {selectedProject.highlights.map((highlight, hIdx) => (
                      <div
                        key={hIdx}
                        className="flex items-start gap-2.5 p-2.5 rounded-lg bg-white/[0.02] border border-white/5"
                      >
                        <CheckCircle2
                          size={15}
                          className="text-[#FFD54F] mt-0.5 shrink-0"
                        />
                        <p className="text-xs sm:text-[13px] text-neutral-200 leading-relaxed">
                          {highlight}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stat Metrics Cards */}
                {selectedProject.stats && selectedProject.stats.length > 0 && (
                  <div className="grid grid-cols-3 gap-2.5">
                    {selectedProject.stats.map((stat, sIdx) => (
                      <div
                        key={sIdx}
                        className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-gradient-to-b from-white/[0.03] to-transparent border border-white/10 text-center"
                      >
                        <span className="font-montserrat font-black text-sm sm:text-base text-[#FFD54F]">
                          {stat.value}
                        </span>
                        <span className="text-[9.5px] sm:text-[10px] font-mono text-neutral-400 mt-0.5">
                          {stat.label}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Full Tech Stack Pills */}
                <div className="space-y-2 pt-1">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#C6B99B] font-semibold">
                    // Technologies
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedProject.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="text-xs font-mono text-neutral-200 bg-white/[0.04] px-2.5 py-1 rounded-md border border-white/10"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Engineering Challenges & Solutions */}
                {selectedProject.challenges && selectedProject.challenges.length > 0 && (
                  <div className="space-y-2.5 pt-1">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-[#FFD54F] font-semibold">
                      // Engineering Challenges & Solutions
                    </span>
                    <div className="space-y-2.5">
                      {selectedProject.challenges.map((challenge, cIdx) => (
                        <div
                          key={cIdx}
                          className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-2 text-left"
                        >
                          <h5 className="font-montserrat font-bold text-xs sm:text-[13px] text-white flex items-center gap-1.5">
                            <span className="text-[#FFD54F] font-mono text-[11px]">0{cIdx + 1}.</span> {challenge.title}
                          </h5>
                          <div className="text-[11.5px] sm:text-xs text-neutral-300 space-y-1.5 pl-3 border-l-2 border-[#FFD54F]/30">
                            <p className="leading-relaxed">
                              <span className="text-neutral-400 font-mono uppercase tracking-wider text-[10px] block">Problem</span>
                              {challenge.problem}
                            </p>
                            <p className="leading-relaxed">
                              <span className="text-[#FFD54F] font-mono uppercase tracking-wider text-[10px] block">Engineered Solution</span>
                              {challenge.solution}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Institutional Turn-over / Live Platform / GitHub Actions */}
                <div className="pt-2 pb-4 flex flex-wrap items-center gap-3">
                  {selectedProject.isTurnedOver && (
                    <div className="w-full p-3.5 rounded-xl bg-[#FFD54F]/[0.05] border border-[#FFD54F]/25 flex items-center gap-3">
                      <ShieldCheck size={20} className="text-[#FFD54F] shrink-0" />
                      <p className="text-xs text-neutral-300 leading-relaxed">
                        <strong className="text-white">Institutional Custody:</strong> Official capstone project turned over to Bulacan State University.
                      </p>
                    </div>
                  )}

                  {selectedProject.liveUrl && (
                    <Button
                      href={selectedProject.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      size="sm"
                      iconRight={<ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />}
                    >
                      Launch Live Platform
                    </Button>
                  )}

                  {selectedProject.githubUrl && (
                    <Button
                      href={selectedProject.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      size="sm"
                      iconLeft={<GitBranch size={14} />}
                      iconRight={<ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />}
                    >
                      View Source Code
                    </Button>
                  )}
                </div>

                {/* Mobile Next/Prev Project Navigation Bar */}
                <div className="flex lg:hidden items-center justify-between pt-4 pb-8 border-t border-white/10 gap-2">
                  <button
                    onClick={handlePrev}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-montserrat text-neutral-300 hover:text-white cursor-pointer"
                  >
                    <ChevronLeft size={15} />
                    <span>Prev Project</span>
                  </button>

                  <span className="text-[11px] font-mono text-neutral-500">
                    {currentIndex + 1} of {PROJECTS_DATA.length}
                  </span>

                  <button
                    onClick={handleNext}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-montserrat text-[#FFD54F] hover:bg-[#FFD54F]/10 cursor-pointer"
                  >
                    <span>Next Project</span>
                    <ChevronRight size={15} />
                  </button>
                </div>

              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

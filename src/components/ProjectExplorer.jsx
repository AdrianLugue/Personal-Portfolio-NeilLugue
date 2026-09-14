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
  Gamepad2,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { PROJECTS_DATA } from '../data/projectsData';
import Button from './Button';
import { useTheme } from '../context/ThemeContext';

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
  const { isDark } = useTheme();

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
    <div
      className="flex-1 w-full min-h-0 flex flex-col lg:flex-row overflow-hidden select-none"
      style={{ backgroundColor: 'var(--bg-base)', color: 'var(--text-primary)' }}
    >

      {/* ── MOBILE TOP STICKY CHIP BAR (Clean, fast horizontal switcher on mobile) ── */}
      <div
        className="flex lg:hidden w-full overflow-x-auto border-b p-2 sm:p-2.5 gap-1.5 items-center custom-scrollbar shrink-0 z-30 sticky top-0"
        style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-card)' }}
      >
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
              ? isDark
                ? 'bg-[#FFD54F] text-black shadow-[0_0_12px_rgba(255,213,79,0.3)]'
                : 'bg-[#805D15] text-white shadow-md'
              : 'hover:text-[#805D15] dark:hover:text-[#FFD54F]'
          }`}
          style={viewMode !== 'grid' ? { backgroundColor: 'var(--bg-pill)', borderColor: 'var(--border-pill)', color: 'var(--text-muted)' } : {}}
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
                  ? isDark
                    ? 'bg-[#FFD54F] text-black font-bold shadow-[0_0_12px_rgba(255,213,79,0.3)]'
                    : 'bg-[#805D15] text-white font-bold shadow-md'
                  : 'hover:text-[#805D15] dark:hover:text-[#FFD54F]'
              }`}
              style={!isSelected ? { backgroundColor: 'var(--bg-pill)', borderColor: 'var(--border-pill)', color: 'var(--text-muted)' } : {}}
            >
              <span className={`font-mono text-[10.5px] ${isSelected ? (isDark ? 'text-black/70' : 'text-white/80') : 'text-[#805D15] dark:text-[#FFD54F]'}`}>
                {project.id}
              </span>
              <span className="truncate max-w-[140px] sm:max-w-none">{project.title}</span>
            </button>
          );
        })}
      </div>

      {/* ── DESKTOP LEFT SIDEBAR: Collapsible Project Switcher ── */}
      <aside
        className={`hidden lg:flex flex-shrink-0 border-r flex-col h-full z-20 transition-all duration-300 ease-in-out ${isSidebarCollapsed
          ? 'w-[68px]'
          : 'w-[280px] xl:w-[300px]'
          }`}
        style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-card)' }}
      >
        {/* Sidebar Header: Collapse Toggle + Mode Buttons */}
        <div
          className="p-3 sm:p-3.5 border-b flex items-center justify-between"
          style={{ borderColor: 'var(--border-card)' }}
        >
          {!isSidebarCollapsed && (
            <div className="flex items-center gap-2 font-montserrat font-bold text-xs" style={{ color: 'var(--text-primary)' }}>
              <FolderGit2 size={14} className="text-[#805D15] dark:text-[#FFD54F]" />
              <span>PROJECTS</span>
              <span
                className="text-[10px] font-mono px-1.5 py-0.5 rounded border"
                style={{ backgroundColor: 'var(--bg-pill)', borderColor: 'var(--border-pill)', color: 'var(--gold)' }}
              >
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
                ? isDark
                  ? 'bg-[#FFD54F] text-black border-[#FFD54F]'
                  : 'bg-[#805D15] text-white border-[#805D15]'
                : 'hover:text-[#805D15] dark:hover:text-[#FFD54F]'
                }`}
              style={viewMode !== 'grid' ? { backgroundColor: 'var(--bg-pill)', borderColor: 'var(--border-pill)', color: 'var(--text-muted)' } : {}}
            >
              <Grid size={13} />
            </button>

            {/* Sidebar Collapse/Expand Toggle (Desktop) */}
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              title={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
              className="hidden lg:flex p-1.5 rounded-lg border transition-all cursor-pointer hover:text-[#805D15] dark:hover:text-[#FFD54F]"
              style={{ backgroundColor: 'var(--bg-pill)', borderColor: 'var(--border-pill)', color: 'var(--text-muted)' }}
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
                  className={`w-full h-11 rounded-xl flex items-center justify-center font-mono text-xs font-bold transition-all cursor-pointer border ${isSelected
                    ? isDark
                      ? 'bg-[#FFD54F] text-black shadow-[0_0_15px_rgba(255,213,79,0.3)]'
                      : 'bg-[#805D15] text-white shadow-md'
                    : 'hover:text-[#805D15] dark:hover:text-[#FFD54F]'
                    }`}
                  style={!isSelected ? { backgroundColor: 'var(--bg-pill)', borderColor: 'var(--border-pill)', color: 'var(--text-muted)' } : {}}
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
                  ? isDark
                    ? 'border-[#FFD54F]/70 shadow-[0_0_15px_rgba(255,213,79,0.12)]'
                    : 'border-[#805D15]/70 shadow-md'
                  : 'hover:border-[#805D15]/40 dark:hover:border-[#FFD54F]/40'
                  }`}
                style={{
                  backgroundColor: isSelected ? 'var(--bg-card)' : 'var(--bg-pill)',
                  borderColor: isSelected ? 'var(--gold-bright)' : 'var(--border-pill)',
                }}
              >
                {/* Active Indicator Accent Line */}
                {isSelected && (
                  <div className="absolute left-0 top-2 bottom-2 w-1 bg-[#805D15] dark:bg-[#FFD54F] rounded-r-full shadow-[0_0_8px_rgba(122,85,16,0.5)] dark:shadow-[0_0_8px_#FFD54F]" />
                )}

                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <h4
                      className={`font-montserrat font-bold text-xs sm:text-[13px] tracking-wide truncate transition-colors ${isSelected
                        ? 'text-[#805D15] dark:text-[#FFD54F]'
                        : 'group-hover:text-[#805D15] dark:group-hover:text-[#FFD54F]'
                        }`}
                      style={!isSelected ? { color: 'var(--text-primary)' } : {}}
                    >
                      {project.title}
                    </h4>
                  </div>

                  <ArrowRight
                    size={12}
                    className={`shrink-0 transition-transform ${isSelected
                      ? 'text-[#805D15] dark:text-[#FFD54F] translate-x-0.5'
                      : 'text-neutral-500 group-hover:text-[#805D15] dark:group-hover:text-[#FFD54F]'
                      }`}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Sidebar Footer Info */}
        {!isSidebarCollapsed && (
          <div
            className="p-3 border-t text-center shrink-0"
            style={{ borderColor: 'var(--border-card)', backgroundColor: 'var(--bg-pill)' }}
          >
            <span className="text-[10.5px] font-mono" style={{ color: 'var(--text-subtle)' }}>
              Interactive System Architecture Vault
            </span>
          </div>
        )}
      </aside>

      {/* ── RIGHT MAIN STAGE: 100% Height (Detail vs All Grid) ── */}
      <main
        className="flex-1 h-full min-h-0 flex flex-col overflow-hidden"
        style={{ backgroundColor: 'var(--bg-base)' }}
      >

        {/* ══════════════════════════════════════════
            MODE A: ALL PROJECTS SHOWCASE GRID
        ══════════════════════════════════════════ */}
        {viewMode === 'grid' ? (
          <div data-lenis-prevent className="flex-1 overflow-y-auto p-5 sm:p-8 lg:p-10 space-y-6 custom-scrollbar text-left">
            {/* Grid Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-5" style={{ borderColor: 'var(--border-card)' }}>
              <div>
                <div className="flex items-center gap-2">
                  <Grid size={20} className="text-[#805D15] dark:text-[#FFD54F]" />
                  <h3 className="font-montserrat font-extrabold text-2xl sm:text-3xl" style={{ color: 'var(--text-primary)' }}>
                    All Projects Showcase
                  </h3>
                </div>
              </div>

              <span
                className="text-xs font-mono px-3.5 py-1.5 rounded-xl border shrink-0"
                style={{ backgroundColor: 'var(--bg-pill)', borderColor: 'var(--border-pill)', color: 'var(--gold)' }}
              >
                {PROJECTS_DATA.length} Projects Total
              </span>
            </div>

            {/* 3-Column Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pt-2 pb-8">
              {PROJECTS_DATA.map((project) => (
                <div
                  key={project.id}
                  onClick={() => handleSelectProject(project.id)}
                  className="group rounded-2xl border hover:border-[#805D15]/50 dark:hover:border-[#FFD54F]/50 p-5 flex flex-col justify-between space-y-4 transition-all duration-300 cursor-pointer"
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    borderColor: 'var(--border-card)',
                    boxShadow: isDark ? '0 15px 40px rgba(0,0,0,0.5)' : '0 10px 30px rgba(80,65,40,0.08)',
                  }}
                >
                  {/* Media Preview Box */}
                  <div
                    className="relative w-full h-[200px] rounded-xl overflow-hidden border flex items-center justify-center"
                    style={{ backgroundColor: isDark ? '#0A0908' : 'var(--bg-panel)', borderColor: 'var(--border-panel)' }}
                  >
                    <div className="absolute inset-0 opacity-60 group-hover:opacity-90 transition-opacity">
                      <ShaderErrorBoundary fallback={null}>
                        <Dithering
                          speed={0.4}
                          shape="simplex"
                          type="4x4"
                          size={2.2}
                          scale={0.5}
                          colorBack="#00000000"
                          colorFront={project.accentColor || (isDark ? '#FFD54F' : '#9E8A60')}
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
                        className="relative z-10 max-h-[85%] max-w-[88%] object-contain group-hover:scale-105 transition-transform duration-300"
                        style={{ filter: 'drop-shadow(0 10px 20px var(--shadow-mockup))' }}
                      />
                    ) : (
                      <div
                        className="relative z-10 w-14 h-14 rounded-xl border flex items-center justify-center text-[#805D15] dark:text-[#FFD54F]"
                        style={{ backgroundColor: 'var(--bg-pill)', borderColor: 'var(--border-pill)' }}
                      >
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
                    <h4
                      className="font-montserrat font-bold text-lg group-hover:text-[#805D15] dark:group-hover:text-[#FFD54F] transition-colors"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {project.title}
                    </h4>

                    <p className="text-xs line-clamp-2 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                      {project.tagline}
                    </p>
                  </div>

                  {/* Tech Pills */}
                  <div className="pt-2 border-t" style={{ borderColor: 'var(--border-card)' }}>
                    <div className="flex flex-wrap gap-1.5">
                      {project.techStack.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="text-[10.5px] font-mono px-2 py-0.5 rounded border"
                          style={{
                            color: 'var(--text-muted)',
                            backgroundColor: 'var(--bg-pill)',
                            borderColor: 'var(--border-pill)',
                          }}
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
            <div
              className="px-3 sm:px-8 py-2.5 sm:py-3 border-b flex items-center justify-between shrink-0 gap-2"
              style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-card)' }}
            >
              <div className="flex items-center gap-1.5 sm:gap-3 min-w-0">
                <button
                  onClick={() => {
                    setViewMode('grid');
                    navigate('/projects');
                  }}
                  className="inline-flex items-center gap-1 text-xs font-mono transition-colors cursor-pointer shrink-0 hover:text-[#805D15] dark:hover:text-[#FFD54F]"
                  style={{ color: 'var(--text-muted)' }}
                >
                  <ArrowLeft size={13} />
                  <span className="hidden xs:inline">All Projects</span>
                  <span className="xs:hidden">All</span>
                </button>
                <span className="text-neutral-500">/</span>
                <span
                  className="text-[10.5px] sm:text-[11px] font-mono uppercase tracking-wider px-2 sm:px-2.5 py-0.5 rounded border font-semibold truncate max-w-[130px] sm:max-w-none"
                  style={{ backgroundColor: 'var(--bg-pill)', borderColor: 'var(--border-pill)', color: 'var(--gold)' }}
                >
                  /{selectedProject.id} {selectedProject.title}
                </span>
                {selectedProject.isTurnedOver && (
                  <span
                    className="hidden md:inline-flex items-center gap-1 text-[11px] font-mono px-2.5 py-0.5 rounded-full border"
                    style={{ backgroundColor: 'var(--bg-pill)', borderColor: 'var(--border-pill)', color: 'var(--gold)' }}
                  >
                    <ShieldCheck size={12} className="text-[#805D15] dark:text-[#FFD54F]" />
                    <span>BulSU Capstone Custody</span>
                  </span>
                )}
              </div>

              {/* Prev / Next controls */}
              <div
                className="flex items-center gap-1 p-0.5 rounded-xl border shrink-0"
                style={{ backgroundColor: 'var(--bg-pill)', borderColor: 'var(--border-pill)' }}
              >
                <button
                  onClick={handlePrev}
                  aria-label="Previous Project"
                  className="p-1 sm:p-1.5 rounded-lg transition-all cursor-pointer hover:text-[#805D15] dark:hover:text-[#FFD54F]"
                  style={{ color: 'var(--text-muted)' }}
                >
                  <ChevronLeft size={15} />
                </button>
                <span className="text-[10.5px] sm:text-[11px] font-mono px-1 sm:px-1.5" style={{ color: 'var(--text-muted)' }}>
                  {currentIndex + 1} / {PROJECTS_DATA.length}
                </span>
                <button
                  onClick={handleNext}
                  aria-label="Next Project"
                  className="p-1 sm:p-1.5 rounded-lg transition-all cursor-pointer hover:text-[#805D15] dark:hover:text-[#FFD54F]"
                  style={{ color: 'var(--text-muted)' }}
                >
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>

            {/* 2-Column Split: Media Showcase (58%) & Case Study Details (42%) */}
            <div data-lenis-prevent className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 overflow-y-auto lg:overflow-hidden">

              {/* ── LEFT COLUMN: Interactive Media Carousel Showcase (58%) ── */}
              <div
                className="lg:col-span-7 flex flex-col p-3 sm:p-5 lg:p-6 border-b lg:border-b-0 lg:border-r min-h-[260px] sm:min-h-[340px] lg:min-h-0 overflow-hidden"
                style={{ backgroundColor: 'var(--bg-base)', borderColor: 'var(--border-card)' }}
              >

                {/* Media Carousel Viewport */}
                <div
                  onTouchStart={handleMediaTouchStart}
                  onTouchEnd={handleMediaTouchEnd}
                  className="relative flex-1 w-full min-h-[240px] sm:min-h-[300px] rounded-[18px] sm:rounded-[22px] overflow-hidden border flex items-center justify-center group cursor-grab active:cursor-grabbing transition-colors"
                  style={{ backgroundColor: isDark ? '#0A0908' : 'var(--bg-panel)', borderColor: 'var(--border-panel)' }}
                >

                  {/* Paper Dither Background Aura */}
                  <div
                    className="absolute inset-0 pointer-events-none transition-opacity duration-500"
                    style={{ opacity: isDark ? 0.85 : 0.45 }}
                  >
                    <ShaderErrorBoundary fallback={null}>
                      <Dithering
                        speed={0.5}
                        shape="simplex"
                        type="4x4"
                        size={2.2}
                        scale={0.5}
                        colorBack="#00000000"
                        colorFront={selectedProject.accentColor || (isDark ? '#FFD54F' : '#9E8A60')}
                        className="w-full h-full object-cover"
                      />
                    </ShaderErrorBoundary>
                  </div>
                  <div
                    className="absolute inset-0 pointer-events-none transition-all duration-300"
                    style={{
                      background: isDark
                        ? 'radial-gradient(ellipse at 50% 50%, rgba(10,9,8,0.1) 0%, rgba(10,9,8,0.85) 85%, #000000 100%)'
                        : 'radial-gradient(ellipse at 50% 50%, rgba(250,248,244,0.05) 0%, rgba(230,224,211,0.45) 85%, rgba(215,205,188,0.75) 100%)',
                    }}
                  />

                  {/* Top Slide Name & Badge */}
                  {selectedProject.media && selectedProject.media.length > 1 && (
                    <div className="absolute top-4 left-4 z-30 flex items-center gap-2">
                      <div
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border backdrop-blur-md text-[11px] font-mono shadow-md"
                        style={{ backgroundColor: 'var(--mobile-menu-bg)', borderColor: 'var(--border-pill)', color: 'var(--text-primary)' }}
                      >
                        {activeMediaItem?.type === 'video' ? (
                          <Film size={12} className="text-[#805D15] dark:text-[#FFD54F]" />
                        ) : (
                          <ImageIcon size={12} className="text-[#805D15] dark:text-[#FFD54F]" />
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
                      className="absolute left-3.5 sm:left-4 z-30 w-10 h-10 rounded-full border hover:border-[#805D15]/70 dark:hover:border-[#FFD54F]/70 hover:text-[#805D15] dark:hover:text-[#FFD54F] flex items-center justify-center transition-all duration-200 cursor-pointer backdrop-blur-md shadow-md active:scale-95"
                      style={{ backgroundColor: 'var(--mobile-menu-bg)', borderColor: 'var(--border-pill)', color: 'var(--text-primary)' }}
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
                      className="absolute right-3.5 sm:right-4 z-30 w-10 h-10 rounded-full border hover:border-[#805D15]/70 dark:hover:border-[#FFD54F]/70 hover:text-[#805D15] dark:hover:text-[#FFD54F] flex items-center justify-center transition-all duration-200 cursor-pointer backdrop-blur-md shadow-md active:scale-95"
                      style={{ backgroundColor: 'var(--mobile-menu-bg)', borderColor: 'var(--border-pill)', color: 'var(--text-primary)' }}
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
                      <div
                        className="relative z-10 w-full h-full max-h-[94%] max-w-[96%] aspect-video rounded-xl overflow-hidden shadow-2xl border"
                        style={{ backgroundColor: 'var(--bg-base)', borderColor: 'var(--border-panel)' }}
                      >
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
                        <div className="w-16 h-16 rounded-full bg-[#805D15]/10 dark:bg-[#FFD54F]/10 border border-[#805D15]/40 dark:border-[#FFD54F]/40 flex items-center justify-center text-[#805D15] dark:text-[#FFD54F] shadow-[0_0_25px_rgba(122,85,16,0.15)] dark:shadow-[0_0_25px_rgba(255,213,79,0.2)]">
                          <Video size={28} />
                        </div>
                        <div className="space-y-1">
                          <p className="font-montserrat font-bold text-base" style={{ color: 'var(--text-primary)' }}>
                            {activeMediaItem.title}
                          </p>
                          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                            {activeMediaItem.caption}
                          </p>
                        </div>
                        <div
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border backdrop-blur-md text-[10.5px] font-mono text-[#805D15] dark:text-[#FFD54F]"
                          style={{ backgroundColor: 'var(--mobile-menu-bg)', borderColor: 'var(--gold-dim)' }}
                        >
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
                      className="relative z-10 max-h-[92%] max-w-[94%] object-contain rounded-xl transition-all duration-300"
                      style={{ filter: 'drop-shadow(0 16px 32px var(--shadow-mockup))' }}
                    />
                  ) : (
                    <div className="relative z-10 flex flex-col items-center justify-center text-center p-4 space-y-2">
                      <div
                        className="w-14 h-14 rounded-xl border flex items-center justify-center text-[#805D15] dark:text-[#FFD54F]"
                        style={{ backgroundColor: 'var(--bg-pill)', borderColor: 'var(--border-pill)' }}
                      >
                        {selectedProject.deviceType === 'mobile' ? (
                          <Smartphone size={28} />
                        ) : (
                          <Terminal size={28} />
                        )}
                      </div>
                      <p className="font-montserrat font-bold text-base" style={{ color: 'var(--text-primary)' }}>
                        {selectedProject.title}
                      </p>
                    </div>
                  )}

                  {/* Bottom Carousel Indicator Dots */}
                  {selectedProject.media && selectedProject.media.length > 1 && (
                    <div
                      className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 px-3 py-1.5 rounded-full border backdrop-blur-md shadow-md"
                      style={{ backgroundColor: 'var(--mobile-menu-bg)', borderColor: 'var(--border-pill)' }}
                    >
                      {selectedProject.media.map((_, dotIdx) => (
                        <button
                          key={dotIdx}
                          onClick={() => setActiveMediaIndex(dotIdx)}
                          aria-label={`Go to slide ${dotIdx + 1}`}
                          className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${activeMediaIndex === dotIdx
                            ? isDark
                              ? 'w-6 bg-[#FFD54F] shadow-[0_0_8px_rgba(255,213,79,0.7)]'
                              : 'w-6 bg-[#805D15] shadow-[0_0_8px_rgba(122,85,16,0.5)]'
                            : isDark ? 'w-2 bg-white/30 hover:bg-white/60' : 'w-2 bg-black/20 hover:bg-black/50'
                            }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* ── RIGHT COLUMN: Case Study Details & Features (42%) ── */}
              <div
                data-lenis-prevent
                className="lg:col-span-5 flex flex-col h-auto lg:h-full lg:overflow-y-auto p-4 sm:p-5 lg:p-6 space-y-4 sm:space-y-5 custom-scrollbar text-left"
                style={{ backgroundColor: 'var(--bg-panel)' }}
              >

                {/* Title & Tagline */}
                <div className="space-y-1.5">
                  <h3 className="font-montserrat font-extrabold text-2xl sm:text-3xl" style={{ color: 'var(--text-primary)' }}>
                    {selectedProject.title}
                  </h3>
                  <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                    {selectedProject.tagline}
                  </p>
                </div>

                {/* Project Overview */}
                {selectedProject.description && (
                  <div
                    className="p-4 rounded-xl border space-y-1"
                    style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-card)' }}
                  >
                    <span className="text-[11px] font-mono uppercase tracking-wider text-[#805D15] dark:text-[#FFD54F] font-bold">
                      // Project Overview
                    </span>
                    <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                      {selectedProject.description}
                    </p>
                  </div>
                )}

                {/* Key Features Checklist */}
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2">
                    <Layers size={15} className="text-[#805D15] dark:text-[#FFD54F]" />
                    <h4 className="font-montserrat font-bold text-xs sm:text-sm tracking-wide uppercase" style={{ color: 'var(--text-primary)' }}>
                      Key Features & Architecture
                    </h4>
                  </div>
                  <div className="space-y-2">
                    {selectedProject.highlights.map((highlight, hIdx) => (
                      <div
                        key={hIdx}
                        className="flex items-start gap-2.5 p-2.5 rounded-lg border"
                        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-card)' }}
                      >
                        <CheckCircle2
                          size={15}
                          className="text-[#805D15] dark:text-[#FFD54F] mt-0.5 shrink-0"
                        />
                        <p className="text-xs sm:text-[13px] leading-relaxed" style={{ color: 'var(--text-primary)' }}>
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
                        className="flex flex-col items-center justify-center p-2.5 rounded-xl border text-center"
                        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-card)' }}
                      >
                        <span className="font-montserrat font-black text-sm sm:text-base text-[#805D15] dark:text-[#FFD54F]">
                          {stat.value}
                        </span>
                        <span className="text-[9.5px] sm:text-[10px] font-mono mt-0.5" style={{ color: 'var(--text-subtle)' }}>
                          {stat.label}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Full Tech Stack Pills */}
                <div className="space-y-2 pt-1">
                  <span className="text-[11px] font-mono uppercase tracking-wider font-semibold" style={{ color: 'var(--gold)' }}>
                    // Technologies
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedProject.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="text-xs font-mono px-2.5 py-1 rounded-md border"
                        style={{
                          color: 'var(--text-primary)',
                          backgroundColor: 'var(--bg-card)',
                          borderColor: 'var(--border-card)',
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Engineering Challenges & Solutions */}
                {selectedProject.challenges && selectedProject.challenges.length > 0 && (
                  <div className="space-y-2.5 pt-1">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-[#805D15] dark:text-[#FFD54F] font-bold">
                      // Engineering Challenges & Solutions
                    </span>
                    <div className="space-y-2.5">
                      {selectedProject.challenges.map((challenge, cIdx) => (
                        <div
                          key={cIdx}
                          className="p-3.5 rounded-xl border space-y-2 text-left"
                          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-card)' }}
                        >
                          <h5 className="font-montserrat font-bold text-xs sm:text-[13px] flex items-center gap-1.5" style={{ color: 'var(--text-primary)' }}>
                            <span className="text-[#805D15] dark:text-[#FFD54F] font-mono text-[11px]">0{cIdx + 1}.</span> {challenge.title}
                          </h5>
                          <div className="text-[11.5px] sm:text-xs space-y-1.5 pl-3 border-l-2 border-[#805D15]/30 dark:border-[#FFD54F]/30" style={{ color: 'var(--text-muted)' }}>
                            <p className="leading-relaxed">
                              <span className="font-mono uppercase tracking-wider text-[10px] block" style={{ color: 'var(--text-subtle)' }}>Problem</span>
                              {challenge.problem}
                            </p>
                            <p className="leading-relaxed">
                              <span className="text-[#805D15] dark:text-[#FFD54F] font-mono uppercase tracking-wider text-[10px] block font-bold">Engineered Solution</span>
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
                    <div
                      className="w-full p-3.5 rounded-xl border flex items-center gap-3"
                      style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--gold-dim)' }}
                    >
                      <ShieldCheck size={20} className="text-[#805D15] dark:text-[#FFD54F] shrink-0" />
                      <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                        <strong style={{ color: 'var(--text-primary)' }}>Institutional Custody:</strong> Official capstone project turned over to Bulacan State University.
                      </p>
                    </div>
                  )}

                  {selectedProject.liveUrl && (
                    <Button
                      href={selectedProject.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      size="sm"
                      className="w-full sm:w-auto sm:min-w-[200px]"
                      iconLeft={selectedProject.liveLabel?.toLowerCase().includes('play') ? <Gamepad2 size={14} className="text-[#805D15] dark:text-[#FFD54F]" /> : null}
                      iconRight={<ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />}
                    >
                      {selectedProject.liveLabel || 'Launch Live Platform'}
                    </Button>
                  )}

                  {selectedProject.githubUrl && (
                    <Button
                      href={selectedProject.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      size="sm"
                      className="w-full sm:w-auto sm:min-w-[200px]"
                      iconLeft={<GitBranch size={14} />}
                      iconRight={<ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />}
                    >
                      View Source Code
                    </Button>
                  )}
                </div>

                {/* Mobile Next/Prev Project Navigation Bar */}
                <div
                  className="flex lg:hidden items-center justify-between pt-4 pb-8 border-t gap-2"
                  style={{ borderColor: 'var(--border-card)' }}
                >
                  <button
                    onClick={handlePrev}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-montserrat cursor-pointer hover:text-[#805D15] dark:hover:text-[#FFD54F]"
                    style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-card)', color: 'var(--text-muted)' }}
                  >
                    <ChevronLeft size={15} />
                    <span>Prev Project</span>
                  </button>

                  <span className="text-[11px] font-mono" style={{ color: 'var(--text-subtle)' }}>
                    {currentIndex + 1} of {PROJECTS_DATA.length}
                  </span>

                  <button
                    onClick={handleNext}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-montserrat text-[#805D15] dark:text-[#FFD54F] cursor-pointer hover:bg-[#805D15]/10 dark:hover:bg-[#FFD54F]/10"
                    style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-card)' }}
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

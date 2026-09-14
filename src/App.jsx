import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ShaderBackground from './components/ShaderBackground';
import Hero from './components/Hero';
import About from './components/About';
import Certifications from './components/Certifications';
import TechStack from './components/TechStack';
import Projects from './components/Projects';
import Contact from './components/Contact';
import { SmoothScrollProvider } from './context/SmoothScrollContext';
import { ThemeProvider } from './context/ThemeContext';
import ChatAssistant from './components/chat/ChatAssistant';

const ProjectExplorer = lazy(() => import('./components/ProjectExplorer'));

class PageErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex-1 w-full h-full flex flex-col items-center justify-center p-6 space-y-4 text-center" style={{ backgroundColor: 'var(--bg-base)' }}>
          <h3 className="font-montserrat font-bold text-xl" style={{ color: 'var(--text-primary)' }}>Something went wrong loading this view</h3>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-xl bg-[#FFD54F] text-black font-bold text-xs font-mono uppercase cursor-pointer"
          >
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function PageLoader() {
  return (
    <div className="flex-1 w-full h-full flex flex-col items-center justify-center space-y-3" style={{ backgroundColor: 'var(--bg-base)', color: 'var(--text-muted)' }}>
      <div className="w-8 h-8 rounded-full border-2 border-[#FFD54F]/20 border-t-[#FFD54F] animate-spin" />
      <span className="font-mono text-xs text-neutral-500 uppercase tracking-widest">
        Loading Project Studio...
      </span>
    </div>
  );
}

function HomePage() {
  return (
    <div className="relative min-h-screen w-full font-montserrat selection:bg-[#7F7255] selection:text-white flex flex-col" style={{ backgroundColor: 'var(--bg-base)', color: 'var(--text-primary)' }}>
      {/* Shader background — constrained to Hero + TechStack height */}
      <div className="absolute inset-x-0 top-0 h-[200vh] overflow-hidden pointer-events-none z-0">
        <ShaderBackground />
        <div
          className="absolute bottom-0 inset-x-0 h-[30vh] pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, transparent, var(--bg-base))' }}
        />
      </div>

      {/* Default Navbar */}
      <Navbar />

      {/* Main Content with Smooth Section Glide */}
      <main className="relative z-10 flex-1">
        {/* Section 01: Hero Section */}
        <section id="hero" className="min-h-screen h-auto lg:h-[100dvh] flex items-center justify-center px-4 sm:px-8 lg:px-12 pt-[88px] sm:pt-[100px] lg:pt-0 pb-12 lg:pb-0 overflow-visible lg:overflow-hidden">
          <Hero />
        </section>

        {/* Section 02: Tech Stack Section */}
        <section id="tech-stack" className="min-h-screen h-auto lg:h-[100dvh] flex flex-col justify-start px-0 w-full pt-20 sm:pt-22 lg:pt-24 pb-12 sm:pb-16 lg:pb-6 overflow-visible lg:overflow-hidden">
          <TechStack />
        </section>

        {/* Section 03: About Me Section */}
        <section id="about" className="relative z-10 min-h-screen h-auto lg:h-[100dvh] flex flex-col justify-start px-3 sm:px-8 lg:px-12 pt-20 sm:pt-22 lg:pt-24 pb-12 sm:pb-16 lg:pb-6 overflow-visible lg:overflow-hidden" style={{ backgroundColor: 'var(--bg-base)' }}>
          <About />
        </section>

        {/* ── Seamless Lower Atmosphere: Certifications -> Projects -> Contact ── */}
        <div className="relative w-full overflow-hidden">
          {/* Bottom Shader Background spanning Certifications, Projects & Contact seamlessly */}
          <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
            <ShaderBackground />
            {/* Smooth gradient fade-in from About Me's bg */}
            <div
              className="absolute top-0 inset-x-0 h-[22vh] pointer-events-none"
              style={{ background: 'linear-gradient(to bottom, var(--bg-base) 0%, transparent 100%)' }}
            />
            {/* Bottom edge vignette */}
            <div
              className="absolute bottom-0 inset-x-0 h-[15vh] pointer-events-none"
              style={{ background: 'linear-gradient(to bottom, transparent 0%, var(--bg-base) 100%)' }}
            />
          </div>

          {/* Section 04: Certifications & Credentials Section */}
          <section id="certifications" className="relative z-10 min-h-screen h-auto lg:h-[100dvh] flex flex-col justify-start px-3 sm:px-8 lg:px-12 pt-20 sm:pt-22 lg:pt-24 pb-12 sm:pb-16 lg:pb-6 overflow-visible lg:overflow-hidden">
            <Certifications />
          </section>

          {/* Section 05: Projects Carousel Section */}
          <section id="projects" className="relative z-10 min-h-screen h-auto lg:h-[100dvh] flex flex-col justify-start px-2 sm:px-6 lg:px-10 pt-20 sm:pt-22 lg:pt-24 pb-12 sm:pb-16 lg:pb-6 overflow-visible lg:overflow-hidden">
            <Projects />
          </section>

          {/* Section 06: Contact Section */}
          <section id="contact" className="relative z-10 min-h-screen h-auto lg:h-[100dvh] flex flex-col justify-start px-3 sm:px-8 lg:px-12 pt-20 sm:pt-22 lg:pt-24 pb-16 sm:pb-20 lg:pb-6 overflow-visible lg:overflow-hidden">
            <Contact />
          </section>
        </div>
      </main>
    </div>
  );
}

function ProjectExplorerPage() {
  return (
    <div className="w-screen h-screen flex flex-col font-montserrat selection:bg-[#7F7255] selection:text-white overflow-hidden pt-[68px] sm:pt-[76px]" style={{ backgroundColor: 'var(--bg-base)', color: 'var(--text-primary)' }}>
      {/* Default Navbar */}
      <Navbar />

      {/* Full-Screen Explorer Content with Lazy Loading */}
      <PageErrorBoundary>
        <Suspense fallback={<PageLoader />}>
          <ProjectExplorer />
        </Suspense>
      </PageErrorBoundary>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <SmoothScrollProvider>
        <Routes>
          {/* Home Route */}
          <Route path="/" element={<HomePage />} />

          {/* Dedicated Full-Screen Projects Explorer Routes with Default Navbar */}
          <Route path="/projects" element={<ProjectExplorerPage />} />
          <Route path="/projects/:projectId" element={<ProjectExplorerPage />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* ── Global AI Portfolio Assistant (all routes) ── */}
        <ChatAssistant />
      </SmoothScrollProvider>
    </ThemeProvider>
  );
}

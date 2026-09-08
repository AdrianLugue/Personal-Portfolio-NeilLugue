import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ShaderBackground from './components/ShaderBackground';
import Hero from './components/Hero';
import About from './components/About';
import TechStack from './components/TechStack';
import Projects from './components/Projects';
import Contact from './components/Contact';
import { SmoothScrollProvider } from './context/SmoothScrollContext';

const ProjectExplorer = lazy(() => import('./components/ProjectExplorer'));

function PageLoader() {
  return (
    <div className="flex-1 w-full h-full flex flex-col items-center justify-center space-y-3 bg-[#060504] text-neutral-400">
      <div className="w-8 h-8 rounded-full border-2 border-[#FFD54F]/20 border-t-[#FFD54F] animate-spin" />
      <span className="font-mono text-xs text-neutral-500 uppercase tracking-widest">
        Loading Project Studio...
      </span>
    </div>
  );
}

function HomePage() {
  return (
    <div className="relative min-h-screen w-full bg-black text-white font-montserrat selection:bg-[#7F7255] selection:text-white flex flex-col">
      {/* Shader background — constrained to Hero + TechStack height */}
      <div className="absolute inset-x-0 top-0 h-[200vh] overflow-hidden pointer-events-none z-0">
        <ShaderBackground />
        <div
          className="absolute bottom-0 inset-x-0 h-[30vh] pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, transparent, #000000)' }}
        />
      </div>

      {/* Default Navbar */}
      <Navbar />

      {/* Main Content with Smooth Section Glide */}
      <main className="relative z-10 flex-1">
        {/* Section 01: Hero Section */}
        <section id="hero" className="min-h-screen h-[100dvh] flex items-center justify-center px-4 sm:px-8 lg:px-12 overflow-hidden">
          <Hero />
        </section>

        {/* Section 02: Tech Stack Section */}
        <section id="tech-stack" className="min-h-screen h-[100dvh] flex flex-col justify-start px-0 w-full pt-20 sm:pt-22 lg:pt-24 pb-4 sm:pb-6 overflow-hidden">
          <TechStack />
        </section>

        {/* Section 03: About Me Section */}
        <section id="about" className="min-h-screen h-[100dvh] flex flex-col justify-start bg-black px-3 sm:px-8 lg:px-12 pt-20 sm:pt-22 lg:pt-24 pb-4 sm:pb-6 overflow-hidden">
          <About />
        </section>

        {/* Section 04: Projects Carousel Section */}
        <section id="projects" className="min-h-screen h-[100dvh] flex flex-col justify-start bg-black px-2 sm:px-6 lg:px-10 pt-20 sm:pt-22 lg:pt-24 pb-4 sm:pb-6 overflow-hidden">
          <Projects />
        </section>

        {/* Section 05: Contact Section */}
        <section id="contact" className="min-h-screen h-[100dvh] flex flex-col justify-start bg-black px-3 sm:px-8 lg:px-12 pt-20 sm:pt-22 lg:pt-24 pb-4 sm:pb-6 overflow-hidden">
          <Contact />
        </section>
      </main>
    </div>
  );
}

function ProjectExplorerPage() {
  return (
    <div className="w-screen h-screen flex flex-col bg-black text-white font-montserrat selection:bg-[#7F7255] selection:text-white overflow-hidden pt-[68px] sm:pt-[76px]">
      {/* Default Navbar */}
      <Navbar />

      {/* Full-Screen Explorer Content with Lazy Loading */}
      <Suspense fallback={<PageLoader />}>
        <ProjectExplorer />
      </Suspense>
    </div>
  );
}

export default function App() {
  return (
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
    </SmoothScrollProvider>
  );
}

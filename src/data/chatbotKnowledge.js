/**
 * Neil Adrian Lugue — Portfolio AI Assistant Knowledge Base
 * Provides instant, zero-latency responses for common visitor questions.
 * Used as primary engine (no API key needed) and fallback when Gemini is unavailable.
 */

export const KNOWLEDGE_BASE = {
  bio: {
    name: 'Neil Adrian Lugue',
    shortName: 'Neil',
    title: 'Full-Stack Developer · AI & Web Apps',
    education: 'Bachelor of Science in Information Technology at Bulacan State University (BulSU)',
    location: 'Philippines',
    email: 'neillugue20@gmail.com',
    linkedin: 'https://www.linkedin.com/in/neil-adrian-j-lugue-6b63b4375/',
    github: 'https://github.com/AdrianLugue',
    summary:
      'Neil is a full-stack developer and AI engineer who builds production-grade mobile apps, web platforms, and AI-powered tools. He is comfortable across React Native, Python, React, Node.js, Django, and PostgreSQL. His capstone project — SakloLaw — is an institutional AI legal aid assistant turned over to Bulacan State University.',
    availability:
      'Neil is currently open to full-time opportunities, part-time roles, and freelance project collaborations in the Philippines or remote.',
  },

  skills: {
    frontend: ['React', 'React Native', 'Next.js', 'Vite', 'TypeScript', 'JavaScript (ES6+)', 'Tailwind CSS', 'WebGL / GLSL Shaders'],
    backend: ['Python', 'Django', 'Node.js', 'REST APIs'],
    databases: ['PostgreSQL', 'SQLite', 'Supabase', 'Neon', 'FAISS Vector DB', 'Drizzle ORM'],
    ai: ['OpenAI GPT-4', 'Groq SDK', 'DeepSeek R1', 'BGE-M3 Embeddings', 'RAG Pipelines', 'LLM Integration'],
    tools: ['GitHub', 'Figma', 'Vercel', 'Vite', 'React Router', 'Selenium'],
  },

  projects: [
    {
      id: 'saklolaw',
      title: 'SakloLaw: AI Legal Aid Assistant',
      year: '2025',
      category: 'Mobile Application · Capstone Project',
      role: 'Lead Full-Stack & AI Developer',
      tags: ['saklolaw', 'legal', 'rag', 'capstone', 'mobile', 'react native', 'django', 'ai', 'filipino'],
      summary:
        'An AI-powered bilingual mobile legal assistant (English & Filipino) built with React Native + Django + PostgreSQL. Uses a Retrieval-Augmented Generation (RAG) pipeline powered by DeepSeek R1 and BGE-M3 embeddings with 25,290+ indexed Philippine legal texts. Achieved a 4.62/5.00 ISO/IEC 25010 rating and 93% test case pass rate. Turned over to Bulacan State University as an official institutional capstone.',
      techStack: ['React Native', 'Django (Python)', 'PostgreSQL', 'SQLite', 'FAISS Vector DB', 'DeepSeek R1', 'BGE-M3 Embeddings'],
      stats: { rating: '4.62 / 5.00', testCases: '93% (83/89)', legalTexts: '25,290+' },
      github: null,
      live: null,
      sectionId: 'projects',
    },
    {
      id: 'quizeasy',
      title: 'QuizEasy: Document-to-Knowledge AI Platform',
      year: '2025',
      category: 'Full-Stack Web & AI Platform · EdTech',
      role: 'Full-Stack Developer & UI/UX Designer',
      tags: ['quizeasy', 'quiz', 'flashcard', 'ai', 'edtech', 'study', 'openai', 'nextjs'],
      summary:
        'An AI-powered study companion that converts PDFs and prompts into interactive MCQs and 3D flashcard decks. Built with Next.js 14, TypeScript, OpenAI GPT-4, Groq, PostgreSQL, and NextAuth v5.',
      techStack: ['Next.js 14', 'TypeScript', 'Tailwind CSS', 'PostgreSQL', 'OpenAI GPT-4', 'Groq SDK', 'NextAuth v5'],
      github: 'https://github.com/AdrianLugue/AI-Quiz-Builder',
      live: 'https://quiz-easy-peach.vercel.app',
      sectionId: 'projects',
    },
    {
      id: 'portfolio',
      title: 'Personal Portfolio Website',
      year: '2026',
      category: 'Full-Stack Web Engineering · Creative Design',
      role: 'Frontend & Creative Developer',
      tags: ['portfolio', 'webgl', 'shader', 'react', 'vite', 'glsl', 'this website'],
      summary:
        "This portfolio you're viewing right now. Built with React 19, Vite, WebGL/GLSL paper dithering shaders, a 3D coverflow project carousel, GitHub live telemetry, and a full-screen Project Explorer.",
      techStack: ['React 19', 'Vite', 'Tailwind CSS', 'WebGL / GLSL Shaders', 'React Router', 'GitHub REST API'],
      github: 'https://github.com/AdrianLugue',
      live: null,
      sectionId: 'projects',
    },
  ],
  certifications: [
    {
      id: 'python-certiport',
      title: 'Information Technology Specialist — Python',
      issuer: 'Certiport (A Pearson VUE Business) · CertNexus',
      date: 'May 2026',
      credentialId: 'w6RSN-48J9',
      verificationUrl: 'https://verify.certiport.com',
      summary: 'Certified IT Specialist in Python programming by Certiport & Pearson VUE. Validates core competencies in Python data structures, algorithms, modular coding, and software development logic.',
    },
  ],
};

// ── Quick Chip Definitions ──────────────────────────────────────────────────
export const QUICK_CHIPS = [
  { id: 'projects',       label: '⚡  Top Projects',        query: "What are Neil's top projects?" },
  { id: 'techstack',      label: '🛠  Tech Stack',           query: "What is Neil's tech stack?" },
  { id: 'certifications', label: '📜  Certifications',       query: 'What certifications does Neil have?' },
  { id: 'background',     label: '🎓  Background',          query: "What is Neil's background and education?" },
  { id: 'availability',   label: '💼  Open to Work?',         query: 'Is Neil available for freelance or full-time roles?' },
  { id: 'resume',         label: '📄  Download Resume',       query: 'Can I download the resume?' },
  { id: 'contact',        label: '📬  Get in Touch',          query: 'How can I contact Neil?' },
];

// ── Intent Keyword Map → Knowledge Handler ─────────────────────────────────
export const INTENT_MAP = [
  {
    keywords: ['project', 'projects', 'work', 'built', 'portfolio', 'applications', 'saklolaw', 'quizeasy'],
    handler: 'projects',
  },
  {
    keywords: ['tech stack', 'technology', 'stack', 'skills', 'programming language', 'framework', 'databases', 'frontend', 'backend'],
    handler: 'techstack',
  },
  {
    keywords: ['certification', 'certifications', 'certificate', 'certificates', 'certiport', 'certified', 'pearson', 'training', 'credentials', 'python specialist'],
    handler: 'certifications',
  },
  {
    keywords: ['background', 'education', 'university', 'degree', 'bulsu', 'bulacan state', 'magna cum laude', 'bachelor', 'bsit'],
    handler: 'background',
  },
  {
    keywords: ['available', 'hire', 'freelance', 'full-time', 'open to work', 'job opportunity', 'hiring'],
    handler: 'availability',
  },
  {
    keywords: ['resume', 'cv', 'curriculum vitae', 'download resume', 'pdf resume'],
    handler: 'resume',
  },
  {
    keywords: ['contact', 'email', 'reach out', 'get in touch', 'linkedin', 'message neil'],
    handler: 'contact',
  },
  {
    keywords: ['who is neil', 'about neil', 'introduce neil', 'bio', 'summary'],
    handler: 'bio',
  },
];

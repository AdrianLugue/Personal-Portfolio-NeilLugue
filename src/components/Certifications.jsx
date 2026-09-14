import React from 'react';
import { Award, ExternalLink, ShieldCheck, Download } from 'lucide-react';
import useInView from '../hooks/useInView';
import Button from './Button';
import pythonCertPdf from '../assets/Python_Certificate.pdf';

const CERTIFICATIONS_DATA = [
  {
    id: 'python-certiport',
    title: 'Information Technology Specialist — Python',
    issuer: 'Certiport (A Pearson VUE Business) · CertNexus',
    date: 'May 13, 2026',
    credentialId: 'w6RSN-48J9',
    verificationUrl: 'https://verify.certiport.com',
    pdfUrl: pythonCertPdf,
  },
];

export default function Certifications() {
  const [certRef, isRevealed] = useInView({ threshold: 0.15, once: false });

  return (
    <div
      ref={certRef}
      className={`section-lazy-render relative z-10 w-full flex-1 flex flex-col justify-start px-4 sm:px-8 lg:px-12 py-1 sm:py-2 ${
        isRevealed ? 'is-revealed' : ''
      }`}
    >
      {/* ── Section Header ── */}
      <div className="flex flex-col items-center text-center mb-6 sm:mb-8 lg:mb-10 px-4 sm:px-6 shrink-0">
        <div className="reveal-mask">
          <h2 className="reveal-title font-montserrat font-extrabold text-2xl sm:text-4xl lg:text-5xl tracking-[0.03em]" style={{ color: 'var(--text-primary)' }}>
            Certifications &amp; <span className="text-gold-gradient">Credentials</span>
          </h2>
        </div>
        <div className="reveal-line w-16 h-1 bg-[#7F7255] mx-auto mt-2 sm:mt-2.5 rounded-full" />
      </div>

      {/* ── Certifications Container ── */}
      <div className="w-full max-w-[1180px] mx-auto flex flex-col items-center gap-6">
        {CERTIFICATIONS_DATA.map((cert) => (
          <div
            key={cert.id}
            className="reveal-child reveal-delay-1 w-full halftone-card rounded-[22px] p-6 sm:p-8 lg:p-9 border border-[#C6B99B]/25 hover:border-[#FFD54F]/50 transition-all duration-300 group relative overflow-hidden"
            style={{ boxShadow: '0 16px 50px var(--shadow-card)' }}
          >
            {/* Subtle ambient gold glow */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-[#FFD54F]/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20 group-hover:bg-[#FFD54F]/10 transition-colors duration-500" />

            <div className="relative z-10 flex flex-col gap-4">
              {/* Status & Credential ID Row */}
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border font-mono text-[10px] sm:text-xs font-semibold uppercase tracking-wider shadow-sm" style={{ backgroundColor: 'var(--bg-pill)', borderColor: 'var(--gold)', color: 'var(--gold)' }}>
                  <ShieldCheck size={13} className="text-[#805D15] dark:text-[#FFD54F]" />
                  <span>Verified Credential</span>
                </div>

                <span className="text-[11px] font-mono" style={{ color: 'var(--text-muted)' }}>
                  ID: <strong className="font-semibold" style={{ color: 'var(--text-primary)' }}>{cert.credentialId}</strong>
                </span>

                <span className="text-neutral-500 hidden sm:inline">·</span>

                <span className="text-[11px] font-mono font-semibold" style={{ color: 'var(--gold)' }}>
                  {cert.date}
                </span>
              </div>

              {/* Certification Title & Issuer */}
              <div className="space-y-1">
                <h3 className="font-montserrat font-extrabold text-xl sm:text-2xl lg:text-3xl tracking-tight group-hover:transition-colors duration-200" style={{ color: 'var(--text-primary)' }}>
                  {cert.title}
                </h3>
                <p className="font-mono text-xs sm:text-sm font-semibold flex items-center gap-1.5 pt-0.5" style={{ color: 'var(--gold)' }}>
                  <Award size={14} className="text-[#805D15] dark:text-[#FFD54F] shrink-0" />
                  <span>{cert.issuer}</span>
                </p>
              </div>

              {/* Direct Buttons directly below Issuer */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button
                  href={cert.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="sm"
                  variant="paper"
                  className="w-full sm:w-auto sm:min-w-[210px]"
                  iconLeft={<Download size={13} className="text-[#805D15] dark:text-[#FFD54F]" />}
                  iconRight={<ExternalLink size={11} className="opacity-80 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />}
                >
                  View Certificate PDF
                </Button>

                <Button
                  href={cert.verificationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="sm"
                  variant="outline"
                  className="w-full sm:w-auto sm:min-w-[210px]"
                  iconRight={<ExternalLink size={11} className="opacity-80 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />}
                >
                  Verify on Certiport
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

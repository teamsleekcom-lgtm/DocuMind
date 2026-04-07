import React from 'react';

export const HeroSection: React.FC = () => {
  return (
    <div className="hero-section">
      <h1 className="hero-title">Free, Local, Private PDF Tools</h1>
      <p className="hero-subtitle">DocuMind runs entirely on your computer. No data ever leaves your machine.</p>
      
      <style>{`
        .hero-section {
          padding: 60px 0 40px;
          text-align: center;
          max-width: 800px;
          margin: 0 auto;
        }
        .hero-title {
          font-size: var(--text-3xl);
          font-weight: 700;
          color: var(--color-text-primary);
          margin-bottom: 16px;
          letter-spacing: -0.02em;
        }
        .hero-subtitle {
          font-size: var(--text-lg);
          color: var(--color-text-secondary);
          line-height: 1.5;
        }
      `}</style>
    </div>
  );
};

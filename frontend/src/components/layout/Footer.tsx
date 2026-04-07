import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <span className="version">Version 1.0.0</span>
        <div className="footer-links">
          <a href="https://github.com/DocuMind" target="_blank" rel="noopener noreferrer">GitHub</a>
          <span className="separator">•</span>
          <a href="/license">License</a>
        </div>
      </div>
      <style>{`
        .footer {
          padding: 24px;
          border-top: 1px solid var(--color-border);
          background: var(--color-surface);
          color: var(--color-text-muted);
          font-size: var(--text-xs);
        }
        .footer-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: var(--max-content-width);
          margin: 0 auto;
        }
        .footer-links { display: flex; align-items: center; gap: 8px; }
        .separator { color: var(--color-border); }
      `}</style>
    </footer>
  );
};

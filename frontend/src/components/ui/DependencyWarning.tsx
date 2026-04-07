import React from 'react';
import { useServerStatus } from '../../hooks/useServerStatus';

export const DependencyWarning: React.FC = () => {
  const { status } = useServerStatus();

  if (status === 'online' || status === 'loading') return null;

  return (
    <div className="dependency-warning">
      <div className="warning-content">
        <span className="warning-icon">⚠️</span>
        <div className="warning-text">
          <strong>Backend Offline</strong>
          <p>The DocuMind local server is not responding. PDF processing may be unavailable.</p>
        </div>
        <button className="retry-btn" onClick={() => window.location.reload()}>Retry</button>
      </div>

      <style>{`
        .dependency-warning {
          background: var(--color-error-light);
          border: 1px solid var(--color-error);
          border-radius: var(--radius-md);
          padding: 16px 20px;
          margin-bottom: 24px;
        }
        .warning-content { display: flex; align-items: flex-start; gap: 16px; }
        .warning-icon { font-size: 20px; }
        .warning-text { flex: 1; }
        .warning-text strong { display: block; margin-bottom: 4px; color: var(--color-error); }
        .warning-text p { margin: 0; font-size: var(--text-sm); color: var(--color-text-secondary); }
        .retry-btn {
          background: var(--color-error);
          color: white;
          padding: 6px 12px;
          border-radius: var(--radius-sm);
          font-size: var(--text-xs);
          font-weight: 600;
        }
      `}</style>
    </div>
  );
};

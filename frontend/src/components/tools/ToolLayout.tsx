import React from 'react';

interface ToolLayoutProps {
  children: React.ReactNode;
  options?: React.ReactNode;
}

export const ToolLayout: React.FC<ToolLayoutProps> = ({ children, options }) => {
  return (
    <div className="tool-layout">
      <div className="tool-main">
        {children}
      </div>
      {options && (
        <div className="tool-sidebar">
          <div className="options-panel">
            <h3 className="panel-title">Options</h3>
            {options}
          </div>
        </div>
      )}

      <style>{`
        .tool-layout {
          display: grid;
          grid-template-columns: ${options ? '1fr 340px' : '1fr'};
          gap: 32px;
          align-items: start;
        }
        .tool-main {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .tool-sidebar {
          position: sticky;
          top: calc(var(--nav-height) + 40px);
        }
        .options-panel {
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          padding: 24px;
        }
        .panel-title {
          font-size: var(--text-sm);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--color-text-muted);
          margin-bottom: 20px;
        }
        @media (max-width: 1024px) {
          .tool-layout { grid-template-columns: 1fr; }
          .tool-sidebar { position: static; }
        }
      `}</style>
    </div>
  );
};

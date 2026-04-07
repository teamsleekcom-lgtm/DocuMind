import React from 'react';
import { Link } from 'react-router-dom';
import { Tool } from '../../data/toolRegistry';

interface ToolGridProps {
  tools: Tool[];
}

export const ToolGrid: React.FC<ToolGridProps> = ({ tools }) => {
  return (
    <div className="tool-grid">
      {tools.map(tool => (
        <Link key={tool.id} to={tool.route} className="tool-card">
          <div className="tool-icon-wrapper">
            <span className="tool-icon">{tool.icon || '📄'}</span>
          </div>
          <div className="tool-info">
            <h3 className="tool-name">{tool.name}</h3>
            <p className="tool-description">{tool.description}</p>
          </div>
        </Link>
      ))}

      <style>{`
        .tool-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
        }
        .tool-card {
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          transition: transform var(--transition-base), box-shadow var(--transition-base), border-color var(--transition-base);
          text-decoration: none;
          color: inherit;
        }
        .tool-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-md);
          border-color: var(--color-accent);
        }
        .tool-icon-wrapper {
          width: 48px;
          height: 48px;
          background: var(--color-surface-raised);
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
        }
        .tool-name {
          font-size: var(--text-md);
          font-weight: 600;
          color: var(--color-text-primary);
          margin-bottom: 4px;
        }
        .tool-description {
          font-size: var(--text-sm);
          color: var(--color-text-secondary);
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

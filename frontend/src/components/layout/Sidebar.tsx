import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

const categories = [
  { id: 'organize', label: 'Organize', icon: '📁' },
  { id: 'convert-to', label: 'Convert to PDF', icon: '➜' },
  { id: 'convert-from', label: 'Convert from PDF', icon: '←' },
  { id: 'security', label: 'Security', icon: '🔒' },
  { id: 'edit', label: 'Edit & Enrich', icon: '✏️' },
  { id: 'extract', label: 'Extract & Analyze', icon: '🔍' },
  { id: 'view', label: 'View & Annotate', icon: '👁️' },
  { id: 'advanced', label: 'Advanced', icon: '⚙️' },
];

export const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <span className="section-label">Tools</span>
        <button className="collapse-toggle" onClick={() => setIsCollapsed(!isCollapsed)}>
          {isCollapsed ? '→' : '←'}
        </button>
      </div>
      
      <nav className="sidebar-nav">
        <NavLink to="/" className="nav-item all-tools">
          <span className="icon">📂</span>
          <span className="label">All Tools</span>
        </NavLink>
        
        {categories.map(cat => (
          <NavLink key={cat.id} to={`/category/${cat.id}`} className="nav-item">
            <span className="icon">{cat.icon}</span>
            <span className="label">{cat.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <NavLink to="/settings" className="nav-item">
          <span className="icon">⚙️</span>
          <span className="label">Settings</span>
        </NavLink>
        <NavLink to="/api-docs" className="nav-item">
          <span className="icon">{'</>'}</span>
          <span className="label">API Docs</span>
        </NavLink>
      </div>

      <style>{`
        .sidebar {
          width: var(--sidebar-width);
          height: calc(100vh - var(--nav-height));
          background: var(--color-surface);
          border-right: 1px solid var(--color-border);
          display: flex;
          flex-direction: column;
          transition: width var(--transition-base);
          position: sticky;
          top: var(--nav-height);
        }
        .sidebar.collapsed { width: var(--sidebar-collapsed-width); }
        .sidebar-header {
          padding: 24px 16px 12px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .section-label {
          font-size: var(--text-xs);
          color: var(--color-text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 600;
        }
        .sidebar.collapsed .section-label { display: none; }
        .collapse-toggle { color: var(--color-text-muted); padding: 4px; }
        
        .sidebar-nav { flex: 1; padding: 12px 0; overflow-y: auto; }
        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 16px;
          color: var(--color-text-secondary);
          font-weight: 500;
          font-size: var(--text-sm);
          border-left: 3px solid transparent;
        }
        .nav-item:hover { background: var(--color-accent-light); color: var(--color-accent); }
        .nav-item.active {
          background: var(--color-accent-light);
          color: var(--color-accent);
          border-left-color: var(--color-accent);
        }
        .icon { font-size: 18px; width: 20px; display: flex; justify-content: center; }
        .sidebar.collapsed .label { display: none; }
        .sidebar.collapsed .nav-item { justify-content: center; padding: 12px 0; border-left: none; }
        
        .sidebar-footer { border-top: 1px solid var(--color-border); padding: 12px 0; }
      `}</style>
    </aside>
  );
};

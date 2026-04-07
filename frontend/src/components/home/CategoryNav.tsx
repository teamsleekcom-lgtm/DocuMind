import React from 'react';
import { categories } from '../../data/categories';

interface CategoryNavProps {
  activeCategory?: string;
  onCategorySelect: (id: string) => void;
}

export const CategoryNav: React.FC<CategoryNavProps> = ({ activeCategory, onCategorySelect }) => {
  return (
    <div className="category-nav">
      {categories.map(cat => (
        <button 
          key={cat.id} 
          className={`cat-tab ${activeCategory === cat.id ? 'active' : ''}`}
          onClick={() => onCategorySelect(cat.id)}
        >
          <span className="cat-icon">{cat.icon}</span>
          <span className="cat-label">{cat.label}</span>
        </button>
      ))}

      <style>{`
        .category-nav {
          display: flex;
          overflow-x: auto;
          gap: 8px;
          padding: 8px 4px;
          margin-bottom: 32px;
          border-bottom: 1px solid var(--color-border);
          scrollbar-width: none;
        }
        .category-nav::-webkit-scrollbar { display: none; }
        
        .cat-tab {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          border-radius: 100px;
          font-size: var(--text-sm);
          font-weight: 600;
          color: var(--color-text-secondary);
          white-space: nowrap;
          transition: all var(--transition-fast);
          border: 1px solid transparent;
        }
        .cat-tab:hover { background: var(--color-surface-raised); color: var(--color-text-primary); }
        .cat-tab.active {
          background: var(--color-accent-light);
          color: var(--color-accent);
          border-color: rgba(29, 78, 216, 0.2);
        }
        .cat-icon { font-size: 16px; }
      `}</style>
    </div>
  );
};

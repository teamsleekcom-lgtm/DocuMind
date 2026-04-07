import React, { useState, useEffect, useRef } from 'react';

export const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="search-bar-container">
      <div className="search-input-wrapper">
        <span className="search-icon">🔍</span>
        <input 
          ref={inputRef}
          type="text" 
          placeholder="Search tools (Press /)" 
          className="search-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsDropdownVisible(true)}
        />
        {query && <button className="clear-btn" onClick={() => setQuery('')}>&times;</button>}
      </div>

      {isDropdownVisible && query && (
        <div className="search-dropdown">
          {/* Results will be mapped here from toolRegistry */}
          <div className="search-empty">No tools found for "{query}"</div>
        </div>
      )}

      <style>{`
        .search-bar-container { position: relative; width: 100%; }
        .search-input-wrapper {
          display: flex;
          align-items: center;
          gap: 12px;
          background: var(--color-surface-raised);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          padding: 8px 16px;
          transition: border-color var(--transition-fast), background var(--transition-fast);
        }
        .search-input-wrapper:focus-within {
          background: var(--color-surface);
          border-color: var(--color-border-focus);
          box-shadow: 0 0 0 3px rgba(29, 78, 216, 0.1);
        }
        .search-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: var(--color-text-primary);
          font-size: var(--text-sm);
        }
        .search-icon { color: var(--color-text-muted); font-size: 14px; }
        .clear-btn { color: var(--color-text-muted); font-size: 18px; }
        
        .search-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          left: 0;
          width: 100%;
          background: var(--color-surface);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-lg);
          border: 1px solid var(--color-border);
          max-height: 400px;
          overflow-y: auto;
          z-index: 1000;
        }
        .search-empty { padding: 16px; text-align: center; color: var(--color-text-muted); font-size: var(--text-sm); }
      `}</style>
    </div>
  );
};

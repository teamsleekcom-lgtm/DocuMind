import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  isLoading, 
  className = '', 
  ...props 
}) => {
  return (
    <button 
      className={`btn btn-${variant} btn-${size} ${isLoading ? 'loading' : ''} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? <span className="spinner"></span> : children}
      <style>{`
        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--radius-md);
          font-weight: 600;
          transition: all var(--transition-fast);
          gap: 8px;
          border: 1px solid transparent;
        }
        .btn:disabled { opacity: 0.6; cursor: not-allowed; }
        
        .btn-sm { padding: 6px 12px; font-size: var(--text-sm); }
        .btn-md { padding: 10px 20px; font-size: var(--text-base); }
        .btn-lg { padding: 14px 28px; font-size: var(--text-lg); }

        .btn-primary { background: var(--color-accent); color: white; }
        .btn-primary:hover:not(:disabled) { background: var(--color-accent-hover); }
        
        .btn-secondary { background: var(--color-surface); border-color: var(--color-border); color: var(--color-text-primary); }
        .btn-secondary:hover:not(:disabled) { background: var(--color-surface-raised); border-color: var(--color-text-muted); }
        
        .btn-ghost { color: var(--color-text-secondary); }
        .btn-ghost:hover:not(:disabled) { background: var(--color-surface-raised); color: var(--color-text-primary); }
        
        .btn-danger { background: var(--color-error); color: white; }
        .btn-danger:hover:not(:disabled) { background: #991b1b; }
        
        .btn-icon { padding: 8px; border-radius: 50%; color: var(--color-text-muted); }
        .btn-icon:hover:not(:disabled) { color: var(--color-text-primary); background: var(--color-surface-raised); }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </button>
  );
};

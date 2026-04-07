import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, helperText, className = '', ...props }) => {
  return (
    <div className={`input-container ${className}`}>
      {label && <label className="input-label">{label}</label>}
      <input 
        className={`input-field ${error ? 'error' : ''}`}
        {...props}
      />
      {error && <div className="error-text">{error}</div>}
      {helperText && !error && <div className="helper-text">{helperText}</div>}
      
      <style>{`
        .input-container { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; }
        .input-label { font-size: var(--text-sm); font-weight: 600; color: var(--color-text-secondary); }
        .input-field {
          padding: 10px 14px;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          background: var(--color-surface);
          transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
        }
        .input-field:focus {
          outline: none;
          border-color: var(--color-border-focus);
          box-shadow: 0 0 0 3px rgba(29, 78, 216, 0.1);
        }
        .input-field.error { border-color: var(--color-error); }
        .error-text { font-size: var(--text-xs); color: var(--color-error); }
        .helper-text { font-size: var(--text-xs); color: var(--color-text-muted); }
      `}</style>
    </div>
  );
};

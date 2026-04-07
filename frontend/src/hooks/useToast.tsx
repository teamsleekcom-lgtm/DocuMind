import React, { createContext, useContext, useState, useCallback } from 'react';

type ToastType = 'success' | 'error' | 'info' | 'warning' | 'update';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  title?: string;
}

interface ToastContextType {
  showToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev.slice(-3), { ...toast, id }]); // Max 4 toasts
    
    if (toast.type !== 'error' && toast.type !== 'update') {
      setTimeout(() => removeToast(id), 4000);
    }
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      <div className="toast-container">
        {toasts.map(toast => (
          <div key={toast.id} className={`toast toast-${toast.type}`}>
            <div className="toast-content">
              {toast.title && <div className="toast-title">{toast.title}</div>}
              <div className="toast-message">{toast.message}</div>
            </div>
            <button className="toast-close" onClick={() => removeToast(toast.id)}>&times;</button>
          </div>
        ))}
      </div>
      <style>{`
        .toast-container {
          position: fixed;
          bottom: 24px;
          right: 24px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          z-index: 2000;
        }
        .toast {
          width: 320px;
          padding: 16px;
          background: var(--color-surface);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-lg);
          border-left: 4px solid var(--color-accent);
          display: flex;
          justify-content: space-between;
          animation: slide-in 0.3s ease;
        }
        .toast-success { border-left-color: var(--color-success); }
        .toast-error { border-left-color: var(--color-error); }
        .toast-warning { border-left-color: var(--color-warning); }
        .toast-info { border-left-color: var(--color-info); }
        
        .toast-content { flex: 1; }
        .toast-title { font-weight: 600; font-size: var(--text-sm); margin-bottom: 4px; }
        .toast-message { font-size: var(--text-sm); color: var(--color-text-secondary); }
        .toast-close { font-size: 20px; color: var(--color-text-muted); cursor: pointer; }
        
        @keyframes slide-in {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
};

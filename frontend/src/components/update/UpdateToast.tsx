import React from 'react';
import { useUpdate } from './UpdateContext';
import { Button } from '../ui/Button';

export const UpdateToast: React.FC = () => {
  const { status, installUpdate, updateVersion } = useUpdate();

  if (status !== 'ready') return null;

  return (
    <div className="update-toast">
      <div className="update-content">
        <div className="update-text">
          <strong>Ready to Install v{updateVersion}</strong>
          <p>DocuMind will restart to apply the update.</p>
        </div>
        <Button size="sm" onClick={installUpdate}>Restart Now</Button>
      </div>

      <style>{`
        .update-toast {
          position: fixed;
          bottom: 24px;
          right: 24px;
          width: 340px;
          background: var(--color-accent);
          color: white;
          padding: 20px;
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-lg);
          z-index: 2100;
          animation: slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .update-content { display: flex; align-items: center; gap: 16px; }
        .update-text { flex: 1; }
        .update-text strong { display: block; margin-bottom: 2px; font-size: var(--text-base); }
        .update-text p { margin: 0; font-size: var(--text-xs); opacity: 0.9; }
        
        @keyframes slide-up {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

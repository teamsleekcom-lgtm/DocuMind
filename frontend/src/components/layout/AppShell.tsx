import React from 'react';
import { TopNav } from './TopNav';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  return (
    <div className="app-shell">
      <TopNav />
      <div className="app-body">
        <Sidebar />
        <main className="app-content">
          <div className="content-inner">
            {children}
          </div>
          <Footer />
        </main>
      </div>
      
      {/* Global Progress Bar Shimmer */}
      <div className="global-progress-bar" id="global-progress"></div>

      <style>{`
        .app-shell {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }
        .app-body {
          display: flex;
          flex: 1;
        }
        .app-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: var(--color-bg);
          min-width: 0;
        }
        .content-inner {
          flex: 1;
          padding: 40px;
          max-width: var(--max-content-width);
          width: 100%;
          margin: 0 auto;
        }
        .global-progress-bar {
          position: fixed;
          top: var(--nav-height);
          left: 0;
          width: 100%;
          height: 4px;
          background: linear-gradient(90deg, transparent, var(--color-accent), transparent);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite linear;
          display: none;
          z-index: 1000;
        }
        @keyframes shimmer {
          0% { background-position: -100% 0; }
          100% { background-position: 100% 0; }
        }
      `}</style>
    </div>
  );
};

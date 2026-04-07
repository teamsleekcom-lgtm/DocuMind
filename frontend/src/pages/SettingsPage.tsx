import React from 'react';
import { useServerStatus } from '../hooks/useServerStatus';
import { useUpdate } from '../components/update/UpdateContext';
import { Button } from '../components/ui/Button';

export const SettingsPage: React.FC = () => {
  const { status, version: serverVersion } = useServerStatus();
  const { status: updateStatus, version: appVersion, checkForUpdates } = useUpdate();

  return (
    <div className="settings-page">
      <header className="settings-header">
        <h1 className="settings-title">Settings</h1>
      </header>

      <section className="settings-section">
        <h2 className="section-title">General</h2>
        <div className="settings-card">
          <div className="setting-item">
            <div className="setting-info">
              <div className="setting-label">Language</div>
              <div className="setting-desc">Select your preferred interface language.</div>
            </div>
            <select className="setting-control" defaultValue="en-GB">
              <option value="en-GB">English (UK)</option>
              <option value="de">Deutsch</option>
              <option value="fr">Français</option>
              <option value="es">Español</option>
            </select>
          </div>
        </div>
      </section>

      <section className="settings-section">
        <h2 className="section-title">Updates</h2>
        <div className="settings-card">
          <div className="setting-item">
            <div className="setting-info">
              <div className="setting-label">App Version</div>
              <div className="setting-desc">You are running DocuMind Desktop {appVersion}</div>
            </div>
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={checkForUpdates}
              isLoading={updateStatus === 'checking'}
            >
              Check for Updates
            </Button>
          </div>
        </div>
      </section>

      <section className="settings-section">
        <h2 className="section-title">System Status</h2>
        <div className="settings-card">
          <div className="status-grid">
            <div className="status-item">
              <div className="status-label">Backend Connection</div>
              <div className={`status-value ${status}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </div>
            </div>
            <div className="status-item">
              <div className="status-label">Backend Version</div>
              <div className="status-value">{serverVersion || 'Unknown'}</div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .settings-page { max-width: 800px; padding-bottom: 60px; }
        .settings-header { margin-bottom: 32px; }
        .settings-title { font-size: var(--text-2xl); font-weight: 700; }
        
        .settings-section { margin-bottom: 40px; }
        .section-title { 
          font-size: var(--text-sm); 
          text-transform: uppercase; 
          letter-spacing: 0.05em; 
          color: var(--color-text-muted);
          margin-bottom: 16px;
          font-weight: 600;
        }
        
        .settings-card {
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          padding: 8px 0;
        }
        
        .setting-item {
          padding: 16px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
        }
        .setting-item:not(:last-child) { border-bottom: 1px solid var(--color-border); }
        
        .setting-info { flex: 1; }
        .setting-label { font-size: var(--text-base); font-weight: 600; color: var(--color-text-primary); margin-bottom: 2px; }
        .setting-desc { font-size: var(--text-sm); color: var(--color-text-secondary); }
        
        .setting-control {
          background: var(--color-surface-raised);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          padding: 8px 12px;
          font-size: var(--text-sm);
          min-width: 160px;
        }
        
        .status-grid { display: grid; grid-template-columns: 1fr 1fr; }
        .status-item { padding: 20px 24px; }
        .status-item:not(:last-child) { border-right: 1px solid var(--color-border); }
        .status-label { font-size: var(--text-xs); color: var(--color-text-muted); text-transform: uppercase; margin-bottom: 8px; font-weight: 600; }
        .status-value { font-size: var(--text-base); font-weight: 600; }
        .status-value.online { color: var(--color-success); }
        .status-value.offline { color: var(--color-error); }
        .status-value.loading { color: var(--color-info); }
      `}</style>
    </div>
  );
};

import React, { createContext, useContext, useState, useEffect } from 'react';
import { check } from '@tauri-apps/plugin-updater';
import { relaunch } from '@tauri-apps/plugin-process';
import { useToast } from '../../hooks/useToast';

type UpdateStatus = 'idle' | 'checking' | 'available' | 'downloading' | 'ready' | 'error';

interface UpdateContextType {
  status: UpdateStatus;
  version: string;
  updateVersion: string | null;
  checkForUpdates: () => Promise<void>;
  installUpdate: () => Promise<void>;
}

const UpdateContext = createContext<UpdateContextType | undefined>(undefined);

export const UpdateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [status, setStatus] = useState<UpdateStatus>('idle');
  const [version, setVersion] = useState('1.0.0');
  const [updateVersion, setUpdateVersion] = useState<string | null>(null);
  const { showToast } = useToast();

  const checkForUpdates = async () => {
    if (status === 'checking' || status === 'downloading') return;
    
    setStatus('checking');
    try {
      const update = await check();
      if (update) {
        setUpdateVersion(update.version);
        setStatus('available');
        showToast({ 
          type: 'info', 
          title: 'Update Available', 
          message: `Version ${update.version} is available. Downloading in background...` 
        });
        
        // Start download immediately
        setStatus('downloading');
        await update.downloadAndInstall();
        setStatus('ready');
        showToast({ 
          type: 'update', 
          title: 'Ready to Install', 
          message: 'DocuMind has been updated. Restart now to apply changes.' 
        });
      } else {
        setStatus('idle');
      }
    } catch (error) {
      console.error('Update check failed:', error);
      setStatus('error');
    }
  };

  const installUpdate = async () => {
    try {
      await relaunch();
    } catch (e) {
      console.error('Failed to restart app:', e);
    }
  };

  useEffect(() => {
    // Initial silent check
    checkForUpdates();
  }, []);

  return (
    <UpdateContext.Provider value={{ status, version, updateVersion, checkForUpdates, installUpdate }}>
      {children}
    </UpdateContext.Provider>
  );
};

export const useUpdate = () => {
  const context = useContext(UpdateContext);
  if (!context) throw new Error('useUpdate must be used within an UpdateProvider');
  return context;
};

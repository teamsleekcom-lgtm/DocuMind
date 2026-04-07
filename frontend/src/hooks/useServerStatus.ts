import { useState, useEffect } from 'react';
import client from '../api/client';

interface ServerStatus {
  status: 'online' | 'offline' | 'loading';
  version?: string;
  tasks?: number;
}

export const useServerStatus = () => {
  const [status, setStatus] = useState<ServerStatus>({ status: 'loading' });

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await client.get('/info/status');
        setStatus({ status: 'online', ...res.data });
      } catch (e) {
        setStatus({ status: 'offline' });
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, []);

  return status;
};

import client from './client';

/**
 * DocuMind Programmatic Agent API
 * Exposed to window.DocuMind for external agents and debug consoles.
 */
export const agentApi = {
  version: async () => '1.0.0',
  
  status: async () => {
    try {
      const res = await client.get('/info/status');
      return res.data;
    } catch (e) {
      return { status: 'offline', error: String(e) };
    }
  },

  // Add more programmatic methods as needed
  listTools: async () => {
    // This will return the toolRegistry in Phase 6
    return [];
  }
};

// Expose to window
if (typeof window !== 'undefined') {
  (window as any).DocuMind = agentApi;
}

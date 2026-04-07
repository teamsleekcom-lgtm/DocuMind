import { useState } from 'react';
import client from '../api/client';
import { useToast } from './useToast';

interface ToolOperationOptions {
  endpoint: string;
  method?: 'POST' | 'GET';
  onSuccess?: (data: Blob) => void;
}

export const useToolOperation = (options: ToolOperationOptions) => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { showToast } = useToast();

  const execute = async (formData: FormData) => {
    setIsLoading(true);
    setProgress(0);
    
    try {
      const response = await client({
        url: options.endpoint,
        method: options.method || 'POST',
        data: formData,
        responseType: 'blob',
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            setProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
          }
        },
      });

      showToast({ type: 'success', message: 'Operation completed successfully' });
      
      if (options.onSuccess) {
        options.onSuccess(response.data);
      } else {
        // Default download behavior
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        const contentDisposition = response.headers['content-disposition'];
        let fileName = 'documind-result.pdf';
        if (contentDisposition) {
          const fileNameMatch = contentDisposition.match(/filename="?(.+)"?/);
          if (fileNameMatch?.[1]) fileName = fileNameMatch[1];
        }
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
    } catch (error: any) {
      console.error('Tool execution failed:', error);
      showToast({ 
        type: 'error', 
        title: 'Operation Failed',
        message: error.response?.data?.message || 'An unexpected error occurred during processing.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { execute, isLoading, progress };
};

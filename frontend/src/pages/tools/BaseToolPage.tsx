import React, { useState } from 'react';
import { ToolLayout } from '../../components/tools/ToolLayout';
import { Dropzone } from '../../components/ui/Dropzone';
import { FileList } from '../../components/ui/FileList';
import { Button } from '../../components/ui/Button';
import { useToolOperation } from '../../hooks/useToolOperation';
import { Tool } from '../../data/toolRegistry';

interface BaseToolPageProps {
  tool: Tool;
  optionsContent?: React.ReactNode;
  buildFormData?: (files: File[]) => FormData;
}

export const BaseToolPage: React.FC<BaseToolPageProps> = ({ tool, optionsContent, buildFormData }) => {
  const [files, setFiles] = useState<File[]>([]);
  const { execute, isLoading, progress } = useToolOperation({
    endpoint: tool.endpoint,
  });

  const handleFilesAdded = (newFiles: File[]) => {
    setFiles(prev => [...prev, ...newFiles]);
  };

  const handleRemoveFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleProcess = () => {
    if (files.length === 0) return;
    
    const formData = buildFormData ? buildFormData(files) : new FormData();
    if (!buildFormData) {
      files.forEach(file => formData.append('fileInput', file));
    }
    
    execute(formData);
  };

  return (
    <div className="tool-page">
      <header className="tool-header">
        <h1 className="tool-title">{tool.name}</h1>
        <p className="tool-desc">{tool.description}</p>
      </header>

      <ToolLayout options={optionsContent}>
        <div className="tool-main-content">
          <Dropzone 
            onFilesAdded={handleFilesAdded} 
          />
          
          {files.length > 0 && (
            <>
              <FileList files={files} onRemove={handleRemoveFile} />
              <div className="process-actions">
                <Button 
                  size="lg" 
                  disabled={files.length === 0} 
                  isLoading={isLoading}
                  onClick={handleProcess}
                >
                  {isLoading ? `Processing ${progress}%` : `Process ${files.length} File${files.length > 1 ? 's' : ''}`}
                </Button>
              </div>
            </>
          )}
        </div>
      </ToolLayout>

      <style>{`
        .tool-page { padding-bottom: 60px; }
        .tool-header { margin-bottom: 32px; }
        .tool-title { font-size: var(--text-2xl); font-weight: 700; margin-bottom: 8px; }
        .tool-desc { color: var(--color-text-secondary); font-size: var(--text-base); }
        .process-actions { margin-top: 32px; display: flex; justify-content: center; }
      `}</style>
    </div>
  );
};

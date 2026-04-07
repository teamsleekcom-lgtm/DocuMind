import React, { useCallback, useState } from 'react';

interface DropzoneProps {
  onFilesAdded: (files: File[]) => void;
  acceptedFormats?: string[];
  maxFiles?: number;
}

export const Dropzone: React.FC<DropzoneProps> = ({ onFilesAdded, acceptedFormats = ['.pdf'], maxFiles = Infinity }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesAdded(Array.from(e.dataTransfer.files));
    }
  }, [onFilesAdded]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesAdded(Array.from(e.target.files));
    }
  };

  return (
    <div 
      className={`dropzone ${isDragging ? 'dragging' : ''}`}
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
    >
      <input 
        type="file" 
        id="fileInput" 
        multiple={maxFiles > 1} 
        onChange={handleFileInput}
        accept={acceptedFormats.join(',')}
        style={{ display: 'none' }}
      />
      <label htmlFor="fileInput" className="dropzone-label">
        <div className="icon">📄</div>
        <div className="text-primary">Drop {acceptedFormats.join(', ')} here</div>
        <div className="text-secondary">or click to browse</div>
        <div className="formats">{acceptedFormats.join(' ')}</div>
      </label>

      <style>{`
        .dropzone {
          border: 2px dashed var(--color-border);
          border-radius: var(--radius-lg);
          background: var(--color-surface);
          min-height: 180px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all var(--transition-base);
          cursor: pointer;
        }
        .dropzone.dragging {
          border-color: var(--color-accent);
          background: var(--color-accent-light);
          border-style: solid;
        }
        .dropzone:hover { border-color: var(--color-accent); }
        .dropzone-label {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          width: 100%;
          height: 100%;
          padding: 40px;
        }
        .icon { font-size: 32px; }
        .text-primary { font-size: var(--text-base); font-weight: 600; color: var(--color-text-primary); }
        .text-secondary { font-size: var(--text-sm); color: var(--color-text-secondary); }
        .formats { font-size: var(--text-xs); color: var(--color-text-muted); margin-top: 4px; }
      `}</style>
    </div>
  );
};

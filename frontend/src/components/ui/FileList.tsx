import React from 'react';

interface FileItem {
  name: string;
  size: number;
  type: string;
}

interface FileListProps {
  files: File[];
  onRemove: (index: number) => void;
}

export const FileList: React.FC<FileListProps> = ({ files, onRemove }) => {
  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="file-list">
      {files.map((file, index) => (
        <div key={`${file.name}-${index}`} className="file-item">
          <div className="file-icon">📄</div>
          <div className="file-info">
            <div className="file-name" title={file.name}>{file.name}</div>
            <div className="file-meta">{formatSize(file.size)}</div>
          </div>
          <button className="remove-btn" onClick={() => onRemove(index)}>&times;</button>
        </div>
      ))}

      <style>{`
        .file-list { display: flex; flex-direction: column; gap: 8px; margin-top: 16px; }
        .file-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
        }
        .file-icon { font-size: 20px; }
        .file-info { flex: 1; min-width: 0; }
        .file-name {
          font-size: var(--text-sm);
          font-weight: 500;
          color: var(--color-text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .file-meta { font-size: var(--text-xs); color: var(--color-text-muted); }
        .remove-btn { font-size: 20px; color: var(--color-text-muted); cursor: pointer; }
        .remove-btn:hover { color: var(--color-error); }
      `}</style>
    </div>
  );
};

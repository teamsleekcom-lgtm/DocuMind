import React from 'react';
import { BaseToolPage } from './BaseToolPage';
import { toolRegistry } from '../../data/toolRegistry';

export const MergePDFPage: React.FC = () => {
  const tool = toolRegistry.find(t => t.id === 'merge-pdfs')!;
  
  return <BaseToolPage tool={tool} />;
};

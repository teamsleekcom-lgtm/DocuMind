import React from 'react';
import { BaseToolPage } from './BaseToolPage';
import { toolRegistry } from '../../data/toolRegistry';
import { Input } from '../../components/ui/Input';

export const SplitPDFPage: React.FC = () => {
  const tool = toolRegistry.find(t => t.id === 'split-pdfs')!;
  
  const options = (
    <div className="split-options">
      <Input label="Split Every X Pages" type="number" defaultValue={1} min={1} />
    </div>
  );

  return <BaseToolPage tool={tool} optionsContent={options} />;
};

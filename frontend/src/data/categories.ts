export interface Category {
  id: string;
  label: string;
  icon: string;
  color: string;
  description: string;
}

export const categories: Category[] = [
  {
    id: 'organize',
    label: 'Organize',
    icon: '📁',
    color: '#3B82F6',
    description: 'Merge, split, rotate, and rearrange PDF pages.'
  },
  {
    id: 'convert-to',
    label: 'Convert to PDF',
    icon: '➜',
    color: '#10B981',
    description: 'Convert images, documents, and web pages to PDF.'
  },
  {
    id: 'convert-from',
    label: 'Convert from PDF',
    icon: '←',
    color: '#F59E0B',
    description: 'Export PDFs to Office, images, and other formats.'
  },
  {
    id: 'security',
    label: 'Security',
    icon: '🔒',
    color: '#EF4444',
    description: 'Encrypt, decrypt, sign, and redact sensitive info.'
  },
  {
    id: 'edit',
    label: 'Edit & Enrich',
    icon: '✏️',
    color: '#8B5CF6',
    description: 'Add watermarks, stamps, Bates numbering, and metadata.'
  },
  {
    id: 'extract',
    label: 'Extract & Analyze',
    icon: '🔍',
    color: '#06B6D4',
    description: 'OCR, extract images, text, and tables from PDFs.'
  },
  {
    id: 'view',
    label: 'View & Annotate',
    icon: '👁️',
    color: '#6366F1',
    description: 'View, compare, and annotate your documents.'
  },
  {
    id: 'advanced',
    label: 'Advanced',
    icon: '⚙️',
    color: '#1F2937',
    description: 'Repair, compress, and automate PDF workflows.'
  }
];

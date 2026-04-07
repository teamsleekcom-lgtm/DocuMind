export interface Tool {
  id: string;
  name: string;
  category: string;
  description: string;
  endpoint: string;
  icon?: string;
  route: string;
  isPopular?: boolean;
}

export const toolRegistry: Tool[] = [
  // Organize
  {
    id: 'merge-pdfs',
    name: 'Merge PDFs',
    category: 'organize',
    description: 'Combine multiple PDF files into one document.',
    endpoint: '/general/merge-pdfs',
    route: '/merge-pdfs',
    isPopular: true
  },
  {
    id: 'split-pdfs',
    name: 'Split PDFs',
    category: 'organize',
    description: 'Split a PDF into multiple separate documents.',
    endpoint: '/general/split-pages',
    route: '/split-pdfs',
    isPopular: true
  },
  {
    id: 'rotate-pdf',
    name: 'Rotate PDF',
    category: 'organize',
    description: 'Rotate PDF pages permanently.',
    endpoint: '/general/rotate-pdf',
    route: '/rotate-pdf'
  },
  
  // Convert To
  {
    id: 'img-to-pdf',
    name: 'Image to PDF',
    category: 'convert-to',
    description: 'Convert JPG, PNG, TIFF to PDF.',
    endpoint: '/convert/img/pdf',
    route: '/img-to-pdf',
    isPopular: true
  },
  {
    id: 'docx-to-pdf',
    name: 'Word to PDF',
    category: 'convert-to',
    description: 'Convert DOCX files to PDF.',
    endpoint: '/convert/file/pdf',
    route: '/docx-to-pdf'
  },

  // Convert From
  {
    id: 'pdf-to-img',
    name: 'PDF to Image',
    category: 'convert-from',
    description: 'Convert PDF pages to JPG or PNG.',
    endpoint: '/convert/pdf/img',
    route: '/pdf-to-img'
  },
  {
    id: 'pdf-to-word',
    name: 'PDF to Word',
    category: 'convert-from',
    description: 'Convert PDF to editable DOCX documents.',
    endpoint: '/convert/pdf/docx',
    route: '/pdf-to-word'
  },

  // Security
  {
    id: 'add-password',
    name: 'Password Protect',
    category: 'security',
    description: 'Encrypt your PDF with a password.',
    endpoint: '/security/add-password',
    route: '/add-password'
  },
  {
    id: 'remove-password',
    name: 'Remove Password',
    category: 'security',
    description: 'Remove password protection from a PDF.',
    endpoint: '/security/remove-password',
    route: '/remove-password'
  },

  // Advanced
  {
    id: 'compress-pdf',
    name: 'Compress PDF',
    category: 'advanced',
    description: 'Reduce PDF file size without losing quality.',
    endpoint: '/misc/compress-pdf',
    route: '/compress-pdf',
    isPopular: true
  },
  {
    id: 'repair-pdf',
    name: 'Repair PDF',
    category: 'advanced',
    description: 'Fix corrupted or broken PDF files.',
    endpoint: '/misc/repair-pdf',
    route: '/repair-pdf'
  }
];

// Helper to get tools by category
export const getToolsByCategory = (categoryId: string) => 
  toolRegistry.filter(tool => tool.category === categoryId);

// Helper to get popular tools
export const getPopularTools = () => 
  toolRegistry.filter(tool => tool.isPopular);

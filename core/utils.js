/**
 * DocuMind — Utility Functions
 * File helpers, size formatter, MIME checker, logger wrapper
 */

/** @type {boolean} */
const DEBUG = false;

/**
 * Logger wrapper — can be toggled via DEBUG flag
 */
const logger = {
  /** @param {...any} args */
  log(...args) {
    if (DEBUG) console.log('[DocuMind]', ...args);
  },
  /** @param {...any} args */
  warn(...args) {
    if (DEBUG) console.warn('[DocuMind]', ...args);
  },
  /** @param {...any} args */
  error(...args) {
    console.error('[DocuMind]', ...args);
  }
};

/**
 * Format file size in human-readable form
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted size string
 */
function formatFileSize(bytes) {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const size = (bytes / Math.pow(1024, i)).toFixed(i > 0 ? 1 : 0);
  return `${size} ${units[i]}`;
}

/**
 * Allowed MIME types mapped to categories
 * @type {Object<string, string[]>}
 */
const MIME_MAP = {
  pdf: ['application/pdf'],
  image: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  word: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  excel: [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
    'text/csv'
  ],
  pptx: ['application/vnd.openxmlformats-officedocument.presentationml.presentation'],
  html: ['text/html']
};

/**
 * Allowed file extensions mapped to categories
 * @type {Object<string, string[]>}
 */
const EXT_MAP = {
  pdf: ['.pdf'],
  image: ['.jpg', '.jpeg', '.png', '.webp', '.gif'],
  word: ['.docx'],
  excel: ['.xlsx', '.xls', '.csv'],
  pptx: ['.pptx'],
  html: ['.html', '.htm']
};

/**
 * Validate file by MIME type and extension
 * @param {File} file - File to validate
 * @param {string} category - Category key from MIME_MAP
 * @returns {boolean} Whether the file is valid
 */
function validateFile(file, category) {
  const validMimes = MIME_MAP[category] || [];
  const validExts = EXT_MAP[category] || [];
  const ext = '.' + file.name.split('.').pop().toLowerCase();
  const mimeOk = validMimes.includes(file.type) || file.type === '';
  const extOk = validExts.includes(ext);
  return mimeOk && extOk;
}

/**
 * Get file extension
 * @param {string} filename
 * @returns {string} Extension with dot
 */
function getExtension(filename) {
  const parts = filename.split('.');
  return parts.length > 1 ? '.' + parts.pop().toLowerCase() : '';
}

/**
 * Read file as ArrayBuffer
 * @param {File} file
 * @returns {Promise<ArrayBuffer>}
 */
function readFileAsArrayBuffer(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Read file as text
 * @param {File} file
 * @returns {Promise<string>}
 */
function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

/**
 * Read file as Data URL
 * @param {File} file
 * @returns {Promise<string>}
 */
function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Convert ArrayBuffer to Uint8Array
 * @param {ArrayBuffer} buffer
 * @returns {Uint8Array}
 */
function bufferToUint8(buffer) {
  return new Uint8Array(buffer);
}

/**
 * Check if file exceeds size warning threshold (100MB)
 * @param {File} file
 * @returns {boolean}
 */
function isFileLarge(file) {
  return file.size > 100 * 1024 * 1024;
}

/**
 * Parse URL search parameters
 * @returns {URLSearchParams}
 */
function getURLParams() {
  return new URLSearchParams(window.location.search);
}

/**
 * Check if autorun is requested via URL
 * @returns {boolean}
 */
function isAutorun() {
  return getURLParams().get('autorun') === 'true';
}

/**
 * Check if JSON output is requested via URL
 * @returns {boolean}
 */
function isJSONOutput() {
  return getURLParams().get('output') === 'json';
}

/**
 * Generate a simple unique ID
 * @returns {string}
 */
function uid() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

/**
 * Delay utility
 * @param {number} ms
 * @returns {Promise<void>}
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

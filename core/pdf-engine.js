/**
 * DocuMind — PDF Engine
 * Central wrapper around pdf-lib and PDF.js.
 * All tool pages import from here, never directly from libs.
 */

/* global PDFLib, pdfjsLib */

/**
 * Load a PDF file using pdf-lib
 * @param {File|ArrayBuffer|Uint8Array} file - PDF source
 * @returns {Promise<PDFLib.PDFDocument>} pdf-lib PDFDocument
 */
async function loadPDF(file) {
    let bytes;
    if (file instanceof File) {
        bytes = new Uint8Array(await file.arrayBuffer());
    } else if (file instanceof ArrayBuffer) {
        bytes = new Uint8Array(file);
    } else {
        bytes = file;
    }
    return await PDFLib.PDFDocument.load(bytes, { ignoreEncryption: true });
}

/**
 * Render a specific page of a PDF to a canvas using PDF.js
 * @param {File|ArrayBuffer|Uint8Array} file - PDF source
 * @param {number} pageNum - 1-based page number
 * @param {number} [scale=1] - Render scale
 * @returns {Promise<HTMLCanvasElement>} Rendered canvas
 */
async function renderPage(file, pageNum, scale) {
    scale = scale || 1;
    let data;
    if (file instanceof File) {
        data = new Uint8Array(await file.arrayBuffer());
    } else if (file instanceof ArrayBuffer) {
        data = new Uint8Array(file);
    } else {
        data = file;
    }

    const pdf = await pdfjsLib.getDocument({ data: data }).promise;
    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale: scale });

    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext('2d');

    await page.render({ canvasContext: ctx, viewport: viewport }).promise;
    return canvas;
}

/**
 * Extract text from all pages of a PDF using PDF.js
 * @param {File|ArrayBuffer|Uint8Array} file - PDF source
 * @returns {Promise<string[]>} Array of text content, one entry per page
 */
async function extractText(file) {
    let data;
    if (file instanceof File) {
        data = new Uint8Array(await file.arrayBuffer());
    } else if (file instanceof ArrayBuffer) {
        data = new Uint8Array(file);
    } else {
        data = file;
    }

    const pdf = await pdfjsLib.getDocument({ data: data }).promise;
    const texts = [];

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items.map(item => item.str).join(' ');
        texts.push(pageText);
    }

    return texts;
}

/**
 * Get the total number of pages in a PDF
 * @param {File|ArrayBuffer|Uint8Array} file - PDF source
 * @returns {Promise<number>} Page count
 */
async function getPageCount(file) {
    let data;
    if (file instanceof File) {
        data = new Uint8Array(await file.arrayBuffer());
    } else if (file instanceof ArrayBuffer) {
        data = new Uint8Array(file);
    } else {
        data = file;
    }
    const pdf = await pdfjsLib.getDocument({ data: data }).promise;
    return pdf.numPages;
}

/**
 * Save a pdf-lib PDFDocument as a Blob
 * @param {PDFLib.PDFDocument} pdfDoc - pdf-lib document
 * @returns {Promise<Blob>} PDF blob
 */
async function savePDF(pdfDoc) {
    const bytes = await pdfDoc.save();
    return new Blob([bytes], { type: 'application/pdf' });
}

/**
 * Get the dimensions of a specific page
 * @param {File|ArrayBuffer|Uint8Array} file - PDF source
 * @param {number} pageNum - 1-based page number
 * @returns {Promise<{width: number, height: number}>} Page dimensions in points
 */
async function getPageDimensions(file, pageNum) {
    const pdfDoc = await loadPDF(file);
    const page = pdfDoc.getPage(pageNum - 1);
    const { width, height } = page.getSize();
    return { width, height };
}

/**
 * Get PDF.js data from a file
 * @param {File|ArrayBuffer|Uint8Array} file
 * @returns {Promise<Uint8Array>}
 */
async function getFileBytes(file) {
    if (file instanceof File) {
        return new Uint8Array(await file.arrayBuffer());
    } else if (file instanceof ArrayBuffer) {
        return new Uint8Array(file);
    }
    return file;
}

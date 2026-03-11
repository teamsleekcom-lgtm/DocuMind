/**
 * DocuMind — Agent API
 * Programmatic interface for agents, browser extensions, and injected scripts.
 * Exposes window.DocuMind global. Must work without any DOM references.
 *
 * All methods accept File objects and return Promises.
 * Imports functionality from pdf-engine.js and libs/ directly.
 */

/* global PDFLib, pdfjsLib, JSZip, jspdf, DiffMatchPatch, XLSX, mammoth, Tesseract */

(function () {
    'use strict';

    /**
     * Read file bytes helper
     * @param {File} file
     * @returns {Promise<Uint8Array>}
     */
    async function readBytes(file) {
        if (file instanceof File) {
            return new Uint8Array(await file.arrayBuffer());
        }
        if (file instanceof ArrayBuffer) {
            return new Uint8Array(file);
        }
        return file;
    }

    /**
     * Load pdf-lib document
     * @param {File} file
     * @returns {Promise<PDFLib.PDFDocument>}
     */
    async function pdfLoad(file) {
        const bytes = await readBytes(file);
        return PDFLib.PDFDocument.load(bytes, { ignoreEncryption: true });
    }

    /**
     * Save pdf-lib document to Blob
     * @param {PDFLib.PDFDocument} doc
     * @returns {Promise<Blob>}
     */
    async function pdfSave(doc) {
        const bytes = await doc.save();
        return new Blob([bytes], { type: 'application/pdf' });
    }

    /**
     * Get PDF.js document
     * @param {File} file
     * @returns {Promise<Object>}
     */
    async function pdfJsLoad(file) {
        const data = await readBytes(file);
        return pdfjsLib.getDocument({ data }).promise;
    }

    const DocuMind = {

        // ── Organize ──

        /** @param {File[]} files → Promise<Blob> */
        async merge(files) {
            const merged = await PDFLib.PDFDocument.create();
            for (const file of files) {
                const src = await pdfLoad(file);
                const pages = await merged.copyPages(src, src.getPageIndices());
                pages.forEach(p => merged.addPage(p));
            }
            return pdfSave(merged);
        },

        /** @param {File} file, @param {Object} options → Promise<Blob[]> */
        async split(file, options) {
            options = options || {};
            const src = await pdfLoad(file);
            const total = src.getPageCount();
            const results = [];

            if (options.mode === 'ranges' && options.ranges) {
                for (const range of options.ranges) {
                    const doc = await PDFLib.PDFDocument.create();
                    const indices = [];
                    for (let i = range[0] - 1; i < range[1]; i++) {
                        if (i >= 0 && i < total) indices.push(i);
                    }
                    const pages = await doc.copyPages(src, indices);
                    pages.forEach(p => doc.addPage(p));
                    results.push(await pdfSave(doc));
                }
            } else {
                // Default: one page per file
                for (let i = 0; i < total; i++) {
                    const doc = await PDFLib.PDFDocument.create();
                    const [page] = await doc.copyPages(src, [i]);
                    doc.addPage(page);
                    results.push(await pdfSave(doc));
                }
            }
            return results;
        },

        /** @param {File} file, @param {Object} options → Promise<Blob> */
        async rotate(file, options) {
            options = options || {};
            const doc = await pdfLoad(file);
            const degrees = options.degrees || 90;
            const pages = doc.getPages();

            if (options.pages === 'all' || !options.pages) {
                pages.forEach(p => p.setRotation(PDFLib.degrees(p.getRotation().angle + degrees)));
            } else {
                options.pages.forEach(num => {
                    if (num >= 1 && num <= pages.length) {
                        const p = pages[num - 1];
                        p.setRotation(PDFLib.degrees(p.getRotation().angle + degrees));
                    }
                });
            }
            return pdfSave(doc);
        },

        /** @param {File} file, @param {number[]} pageOrder → Promise<Blob> */
        async reorder(file, pageOrder) {
            const src = await pdfLoad(file);
            const doc = await PDFLib.PDFDocument.create();
            const indices = pageOrder.map(n => n - 1);
            const pages = await doc.copyPages(src, indices);
            pages.forEach(p => doc.addPage(p));
            return pdfSave(doc);
        },

        /** @param {File} file, @param {number} threshold → Promise<Blob> */
        async removeBlankPages(file, threshold) {
            threshold = threshold || 5;
            const src = await pdfLoad(file);
            const pdf = await pdfJsLoad(file);
            const doc = await PDFLib.PDFDocument.create();
            const keepIndices = [];

            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const content = await page.getTextContent();
                const text = content.items.map(item => item.str).join('').trim();
                if (text.length >= threshold) {
                    keepIndices.push(i - 1);
                }
            }

            if (keepIndices.length > 0) {
                const pages = await doc.copyPages(src, keepIndices);
                pages.forEach(p => doc.addPage(p));
            }
            return pdfSave(doc);
        },

        /** @param {File} file, @param {Object} margins → Promise<Blob> */
        async crop(file, margins) {
            margins = margins || {};
            const doc = await pdfLoad(file);
            const pages = doc.getPages();
            const mmToPt = 2.835;

            pages.forEach(page => {
                const { width, height } = page.getSize();
                const top = (margins.top || 0) * mmToPt;
                const bottom = (margins.bottom || 0) * mmToPt;
                const left = (margins.left || 0) * mmToPt;
                const right = (margins.right || 0) * mmToPt;

                page.setCropBox(left, bottom, width - left - right, height - top - bottom);
            });
            return pdfSave(doc);
        },

        // ── Security ──

        /** @param {File} file, @param {string} password → Promise<Blob> */
        async protect(file, password) {
            const doc = await pdfLoad(file);
            doc.encrypt({
                userPassword: password,
                ownerPassword: password,
                permissions: { printing: 'highQuality', modifying: false, copying: false }
            });
            return pdfSave(doc);
        },

        /** @param {File} file, @param {string} password → Promise<Blob> */
        async unlock(file, password) {
            const bytes = await readBytes(file);
            const doc = await PDFLib.PDFDocument.load(bytes, {
                ignoreEncryption: true,
                password: password
            });
            return pdfSave(doc);
        },

        /** @param {File} file, @param {Array} regions → Promise<Blob> */
        async redact(file, regions) {
            const doc = await pdfLoad(file);
            const pages = doc.getPages();

            regions.forEach(r => {
                if (r.page >= 1 && r.page <= pages.length) {
                    const page = pages[r.page - 1];
                    page.drawRectangle({
                        x: r.x, y: r.y,
                        width: r.w, height: r.h,
                        color: PDFLib.rgb(0, 0, 0)
                    });
                }
            });
            return pdfSave(doc);
        },

        // ── Enrich ──

        /** @param {File} file, @param {Object} options → Promise<Blob> */
        async watermark(file, options) {
            options = options || {};
            const doc = await pdfLoad(file);
            const pages = doc.getPages();
            const font = await doc.embedFont(PDFLib.StandardFonts.Helvetica);
            const text = options.text || 'WATERMARK';
            const fontSize = options.fontSize || 48;
            const opacity = options.opacity !== undefined ? options.opacity : 0.3;
            const angle = options.angle || 45;

            pages.forEach(page => {
                const { width, height } = page.getSize();
                page.drawText(text, {
                    x: width / 2 - (text.length * fontSize * 0.3),
                    y: height / 2,
                    size: fontSize,
                    font: font,
                    color: PDFLib.rgb(0.75, 0.75, 0.75),
                    opacity: opacity,
                    rotate: PDFLib.degrees(angle)
                });
            });
            return pdfSave(doc);
        },

        /** @param {File} file, @param {Object} options → Promise<Blob> */
        async addPageNumbers(file, options) {
            options = options || {};
            const doc = await pdfLoad(file);
            const pages = doc.getPages();
            const font = await doc.embedFont(PDFLib.StandardFonts.Helvetica);
            const fontSize = options.fontSize || 10;
            const startAt = options.startAt || 1;
            const position = options.position || 'bottom-center';

            pages.forEach((page, i) => {
                const { width, height } = page.getSize();
                const num = (startAt + i).toString();
                const textWidth = font.widthOfTextAtSize(num, fontSize);
                let x, y;

                if (position.includes('bottom')) y = 20;
                else y = height - 30;

                if (position.includes('center')) x = (width - textWidth) / 2;
                else if (position.includes('right')) x = width - textWidth - 30;
                else x = 30;

                page.drawText(num, { x, y, size: fontSize, font, color: PDFLib.rgb(0.3, 0.3, 0.3) });
            });
            return pdfSave(doc);
        },

        /** @param {File} file, @param {Object} options → Promise<Blob> */
        async addHeaderFooter(file, options) {
            options = options || {};
            const doc = await pdfLoad(file);
            const pages = doc.getPages();
            const font = await doc.embedFont(PDFLib.StandardFonts.Helvetica);
            const fontSize = options.fontSize || 9;

            pages.forEach(page => {
                const { width, height } = page.getSize();
                const draw = (text, x, y) => {
                    if (text) page.drawText(text, { x, y, size: fontSize, font, color: PDFLib.rgb(0.3, 0.3, 0.3) });
                };

                // Header
                draw(options.headerLeft, 30, height - 25);
                if (options.headerCenter) draw(options.headerCenter, (width - font.widthOfTextAtSize(options.headerCenter, fontSize)) / 2, height - 25);
                if (options.headerRight) draw(options.headerRight, width - font.widthOfTextAtSize(options.headerRight, fontSize) - 30, height - 25);

                // Footer
                draw(options.footerLeft, 30, 15);
                if (options.footerCenter) draw(options.footerCenter, (width - font.widthOfTextAtSize(options.footerCenter, fontSize)) / 2, 15);
                if (options.footerRight) draw(options.footerRight, width - font.widthOfTextAtSize(options.footerRight, fontSize) - 30, 15);
            });
            return pdfSave(doc);
        },

        // ── Convert ──

        /** @param {File} file, @param {Object} options → Promise<Blob[]> */
        async toImages(file, options) {
            options = options || {};
            const format = options.format || 'png';
            const dpi = options.dpi || 150;
            const scale = dpi / 72;
            const data = await readBytes(file);
            const pdf = await pdfjsLib.getDocument({ data }).promise;
            const results = [];

            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const viewport = page.getViewport({ scale });
                const canvas = document.createElement('canvas');
                canvas.width = viewport.width;
                canvas.height = viewport.height;
                const ctx = canvas.getContext('2d');
                await page.render({ canvasContext: ctx, viewport }).promise;

                const mimeType = format === 'jpeg' ? 'image/jpeg' : format === 'webp' ? 'image/webp' : 'image/png';
                const blob = await new Promise(resolve => canvas.toBlob(resolve, mimeType, 0.92));
                results.push(blob);
            }
            return results;
        },

        /** @param {File[]} files, @param {Object} options → Promise<Blob> */
        async fromImages(files, options) {
            options = options || {};
            const doc = await PDFLib.PDFDocument.create();

            for (const file of files) {
                const bytes = await readBytes(file);
                const ext = file.name ? file.name.split('.').pop().toLowerCase() : 'png';
                let img;

                if (ext === 'jpg' || ext === 'jpeg') {
                    img = await doc.embedJpg(bytes);
                } else {
                    img = await doc.embedPng(bytes);
                }

                const dims = img.scale(1);
                let pageWidth, pageHeight;

                if (options.pageSize === 'a4') {
                    pageWidth = 595.28;
                    pageHeight = 841.89;
                } else if (options.pageSize === 'letter') {
                    pageWidth = 612;
                    pageHeight = 792;
                } else {
                    pageWidth = dims.width;
                    pageHeight = dims.height;
                }

                const page = doc.addPage([pageWidth, pageHeight]);
                const scale = Math.min(pageWidth / dims.width, pageHeight / dims.height);
                const scaledW = dims.width * scale;
                const scaledH = dims.height * scale;

                page.drawImage(img, {
                    x: (pageWidth - scaledW) / 2,
                    y: (pageHeight - scaledH) / 2,
                    width: scaledW,
                    height: scaledH
                });
            }
            return pdfSave(doc);
        },

        /** @param {File} file → Promise<string> */
        async toText(file) {
            const data = await readBytes(file);
            const pdf = await pdfjsLib.getDocument({ data }).promise;
            const pages = [];

            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const content = await page.getTextContent();
                pages.push(content.items.map(item => item.str).join(' '));
            }
            return pages.join('\n\n');
        },

        /** @param {File} file → Promise<string> */
        async toMarkdown(file) {
            const data = await readBytes(file);
            const pdf = await pdfjsLib.getDocument({ data }).promise;
            const lines = [];

            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const content = await page.getTextContent();
                let lastY = null;
                let currentLine = '';

                content.items.forEach(item => {
                    if (lastY !== null && Math.abs(item.transform[5] - lastY) > 5) {
                        if (currentLine.trim()) {
                            // Detect headings by font size
                            if (item.height > 16) {
                                lines.push('## ' + currentLine.trim());
                            } else if (item.height > 12) {
                                lines.push('### ' + currentLine.trim());
                            } else {
                                lines.push(currentLine.trim());
                            }
                        }
                        lines.push('');
                        currentLine = '';
                    }
                    currentLine += item.str;
                    lastY = item.transform[5];
                });

                if (currentLine.trim()) lines.push(currentLine.trim());
                lines.push('\n---\n');
            }
            return lines.join('\n');
        },

        /** @param {string} htmlString, @param {Object} options → Promise<Blob> */
        async fromHTML(htmlString, options) {
            options = options || {};
            const { jsPDF } = jspdf;
            const pdf = new jsPDF({
                format: options.pageSize === 'letter' ? 'letter' : 'a4',
                unit: 'mm'
            });

            // Simple HTML to PDF conversion
            const div = document.createElement('div');
            div.innerHTML = htmlString;
            div.style.cssText = 'width:190mm;font-family:sans-serif;font-size:12px;line-height:1.5;padding:10mm;';
            document.body.appendChild(div);

            await pdf.html(div, {
                callback: function () { },
                x: 10,
                y: 10,
                html2canvas: { scale: 2 }
            });

            document.body.removeChild(div);
            return pdf.output('blob');
        },

        /** @param {File} file → Promise<Blob> */
        async fromWord(file) {
            const arrayBuffer = await file.arrayBuffer();
            const result = await mammoth.convertToHtml({ arrayBuffer });
            return DocuMind.fromHTML(result.value);
        },

        /** @param {File} file → Promise<Blob> */
        async fromExcel(file) {
            const data = await file.arrayBuffer();
            const workbook = XLSX.read(data);
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const html = XLSX.utils.sheet_to_html(sheet);
            return DocuMind.fromHTML(html);
        },

        /** @param {File} file → Promise<Blob> */
        async fromPptx(file) {
            // Best-effort: extract text content and render as PDF pages
            const zip = await JSZip.loadAsync(file);
            const { jsPDF } = jspdf;
            const pdf = new jsPDF({ format: 'a4', orientation: 'landscape', unit: 'mm' });

            const slideFiles = Object.keys(zip.files)
                .filter(n => n.match(/ppt\/slides\/slide\d+\.xml$/))
                .sort();

            for (let i = 0; i < slideFiles.length; i++) {
                if (i > 0) pdf.addPage();
                const xml = await zip.files[slideFiles[i]].async('text');
                const textContent = xml.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
                const sliceText = textContent.substring(0, 500);
                pdf.setFontSize(12);
                pdf.text('Slide ' + (i + 1), 15, 15);
                pdf.setFontSize(10);
                const lines = pdf.splitTextToSize(sliceText, 267);
                pdf.text(lines, 15, 25);
            }

            return pdf.output('blob');
        },

        /** @param {File} file → Promise<Blob> */
        async toWord(file) {
            const text = await DocuMind.toText(file);
            const paragraphs = text.split('\n\n').filter(p => p.trim());

            const docXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>${paragraphs.map(p => `<w:p><w:r><w:t xml:space="preserve">${p.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</w:t></w:r></w:p>`).join('')}</w:body>
</w:document>`;

            const zip = new JSZip();
            zip.file('[Content_Types].xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>');
            zip.file('_rels/.rels', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>');
            zip.file('word/document.xml', docXml);
            zip.file('word/_rels/document.xml.rels', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"></Relationships>');

            const blob = await zip.generateAsync({ type: 'blob', mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
            return blob;
        },

        /** @param {File} file → Promise<Blob> */
        async toExcel(file) {
            const text = await DocuMind.toText(file);
            const lines = text.split('\n').filter(l => l.trim());
            const data = lines.map(l => l.split(/\s{2,}|\t/));
            const ws = XLSX.utils.aoa_to_sheet(data);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
            const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
            return new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        },

        /** @param {File} file → Promise<Blob> */
        async toPptx(file) {
            const data = await readBytes(file);
            const pdf = await pdfjsLib.getDocument({ data }).promise;
            const zip = new JSZip();

            // Build minimal PPTX structure
            zip.file('[Content_Types].xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Default Extension="png" ContentType="image/png"/><Override PartName="/ppt/presentation.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml"/>' +
                Array.from({ length: pdf.numPages }, (_, i) => `<Override PartName="/ppt/slides/slide${i + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>`).join('') +
                '</Types>');

            zip.file('_rels/.rels', '<?xml version="1.0"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="ppt/presentation.xml"/></Relationships>');

            const slideRefs = Array.from({ length: pdf.numPages }, (_, i) => `<Relationship Id="rId${i + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide${i + 1}.xml"/>`).join('');
            zip.file('ppt/_rels/presentation.xml.rels', `<?xml version="1.0"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${slideRefs}</Relationships>`);

            const slideIds = Array.from({ length: pdf.numPages }, (_, i) => `<p:sldId id="${256 + i}" r:id="rId${i + 1}"/>`).join('');
            zip.file('ppt/presentation.xml', `<?xml version="1.0"?><p:presentation xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><p:sldIdLst>${slideIds}</p:sldIdLst></p:presentation>`);

            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const viewport = page.getViewport({ scale: 2 });
                const canvas = document.createElement('canvas');
                canvas.width = viewport.width;
                canvas.height = viewport.height;
                await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;

                const imgBlob = await new Promise(r => canvas.toBlob(r, 'image/png'));
                const imgData = new Uint8Array(await imgBlob.arrayBuffer());
                zip.file(`ppt/media/image${i}.png`, imgData);

                zip.file(`ppt/slides/_rels/slide${i}.xml.rels`, `<?xml version="1.0"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="../media/image${i}.png"/></Relationships>`);

                zip.file(`ppt/slides/slide${i}.xml`, `<?xml version="1.0"?><p:sld xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"><p:cSld><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr/><p:pic><p:nvPicPr><p:cNvPr id="2" name="img${i}"/><p:cNvPicPr/><p:nvPr/></p:nvPicPr><p:blipFill><a:blip r:embed="rId1"/><a:stretch><a:fillRect/></a:stretch></p:blipFill><p:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="9144000" cy="6858000"/></a:xfrm><a:prstGeom prst="rect"/></p:spPr></p:pic></p:spTree></p:cSld></p:sld>`);
            }

            return zip.generateAsync({ type: 'blob', mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' });
        },

        // ── Extract & Analyze ──

        /** @param {File} file, @param {Object} options → Promise<{text, json}> */
        async ocr(file, options) {
            options = options || {};
            const lang = options.lang || 'eng';
            const result = await Tesseract.recognize(file, lang);
            return {
                text: result.data.text,
                json: {
                    confidence: result.data.confidence,
                    lines: result.data.lines ? result.data.lines.map(l => ({
                        text: l.text,
                        confidence: l.confidence,
                        bbox: l.bbox
                    })) : []
                }
            };
        },

        /** @param {File} file → Promise<{fields, csv, json}> */
        async extractForms(file) {
            const doc = await pdfLoad(file);
            const form = doc.getForm();
            const fields = form.getFields().map(field => ({
                name: field.getName(),
                type: field.constructor.name.replace('PDF', '').replace('Field', '').toLowerCase(),
                value: (() => {
                    try { return field.getText ? field.getText() : ''; } catch (e) { return ''; }
                })()
            }));

            const csv = 'Name,Type,Value\n' + fields.map(f => `"${f.name}","${f.type}","${f.value}"`).join('\n');

            return { fields, csv, json: fields };
        },

        /** @param {File} file → Promise<object> */
        async readMetadata(file) {
            const doc = await pdfLoad(file);
            return {
                title: doc.getTitle() || '',
                author: doc.getAuthor() || '',
                subject: doc.getSubject() || '',
                keywords: doc.getKeywords() || '',
                creator: doc.getCreator() || '',
                producer: doc.getProducer() || '',
                creationDate: doc.getCreationDate() ? doc.getCreationDate().toISOString() : '',
                modificationDate: doc.getModificationDate() ? doc.getModificationDate().toISOString() : '',
                pageCount: doc.getPageCount()
            };
        },

        /** @param {File} file, @param {object} patch → Promise<Blob> */
        async writeMetadata(file, patch) {
            const doc = await pdfLoad(file);
            if (patch.title !== undefined) doc.setTitle(patch.title);
            if (patch.author !== undefined) doc.setAuthor(patch.author);
            if (patch.subject !== undefined) doc.setSubject(patch.subject);
            if (patch.keywords !== undefined) doc.setKeywords(patch.keywords.split ? patch.keywords.split(',') : patch.keywords);
            if (patch.creator !== undefined) doc.setCreator(patch.creator);
            if (patch.producer !== undefined) doc.setProducer(patch.producer);
            return pdfSave(doc);
        },

        /** @param {File} file → Promise<{tables, csv}> */
        async extractTables(file) {
            const data = await readBytes(file);
            const pdf = await pdfjsLib.getDocument({ data }).promise;
            const allTables = [];

            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const content = await page.getTextContent();
                const items = content.items.map(item => ({
                    text: item.str,
                    x: Math.round(item.transform[4]),
                    y: Math.round(item.transform[5]),
                    width: item.width,
                    height: item.height
                }));

                // Group by Y position (rows)
                const rows = {};
                items.forEach(item => {
                    const rowKey = Math.round(item.y / 5) * 5;
                    if (!rows[rowKey]) rows[rowKey] = [];
                    rows[rowKey].push(item);
                });

                const sortedRows = Object.keys(rows).sort((a, b) => b - a);
                if (sortedRows.length > 2) {
                    const table = sortedRows.map(key => {
                        return rows[key].sort((a, b) => a.x - b.x).map(item => item.text);
                    });
                    allTables.push(table);
                }
            }

            const csv = allTables.map(table =>
                table.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n')
            ).join('\n\n');

            return { tables: allTables, csv };
        },

        /** @param {File} file → Promise<object[]> */
        async extractBookmarks(file) {
            const data = await readBytes(file);
            const pdf = await pdfjsLib.getDocument({ data }).promise;
            const outline = await pdf.getOutline();

            function processOutline(items) {
                if (!items) return [];
                return items.map(item => ({
                    title: item.title,
                    children: processOutline(item.items)
                }));
            }

            return processOutline(outline);
        },

        // ── Review ──

        /** @param {File} file1, @param {File} file2 → Promise<{diff, visualDiff}> */
        async compare(file1, file2) {
            const text1 = await DocuMind.toText(file1);
            const text2 = await DocuMind.toText(file2);
            const dmp = new DiffMatchPatch();
            const diffs = dmp.diff_main(text1, text2);
            dmp.diff_cleanupSemantic(diffs);

            let added = 0, removed = 0;
            diffs.forEach(d => {
                if (d[0] === 1) added += d[1].length;
                if (d[0] === -1) removed += d[1].length;
            });

            return {
                diff: { diffs, stats: { added, removed, unchanged: text1.length - removed } },
                visualDiff: null
            };
        },

        /** @param {File} file, @param {Object} options → Promise<Blob> */
        async compress(file, options) {
            options = options || {};
            // Re-serialize via pdf-lib (strips unused objects)
            const doc = await pdfLoad(file);
            const bytes = await doc.save();
            return new Blob([bytes], { type: 'application/pdf' });
        },

        /** @param {File} file → Promise<Blob> */
        async repair(file) {
            // Re-parse and re-serialize
            const doc = await pdfLoad(file);
            const bytes = await doc.save();
            return new Blob([bytes], { type: 'application/pdf' });
        },

        /** @param {File[]} files, @param {string} operation, @param {Object} options → Promise<Blob> */
        async batch(files, operation, options) {
            const zip = new JSZip();
            const method = DocuMind[operation];
            if (!method) throw new Error('Unknown operation: ' + operation);

            for (let i = 0; i < files.length; i++) {
                const result = await method(files[i], options);
                const name = files[i].name.replace(/\.[^.]+$/, '') + '_processed';

                if (result instanceof Blob) {
                    const ext = result.type === 'application/pdf' ? '.pdf' : '.bin';
                    zip.file(name + ext, result);
                } else if (typeof result === 'string') {
                    zip.file(name + '.txt', result);
                }
            }

            return zip.generateAsync({ type: 'blob' });
        },

        // ── Utilities ──

        /** @param {File} file → Promise<object> */
        async getInfo(file) {
            const doc = await pdfLoad(file);
            const metadata = await DocuMind.readMetadata(file);
            let hasForm = false;
            try { hasForm = doc.getForm().getFields().length > 0; } catch (e) { /* no form */ }

            return {
                pages: doc.getPageCount(),
                size: file.size,
                metadata,
                isEncrypted: false,
                hasForm
            };
        }
    };

    // Expose globally
    window.DocuMind = DocuMind;
})();

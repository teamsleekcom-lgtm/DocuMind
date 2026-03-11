# DocuMind

**Your documents, your device.**

A fully client-side PDF and document editing toolkit. Every operation runs locally in your browser — no uploads, no servers, no tracking.

[**→ Open DocuMind**](https://your-deployment.vercel.app)

---

## Features

33 tools across 6 categories:

| Category | Tools |
|---|---|
| **Organize** | Merge, Split, Rotate, Reorder, Remove Blank Pages, Crop |
| **Security** | Protect, Unlock, Redact |
| **Enrich** | Watermark, Page Numbers, Header & Footer, E-Sign |
| **Convert** | PDF↔Images, PDF↔Word, PDF↔Excel, PDF↔PPTX, PDF→Text, PDF→Markdown, HTML→PDF |
| **Extract & Analyze** | OCR, Form Extractor, Metadata Editor, Table Extractor, Bookmark Extractor |
| **Review** | Compare/Diff, Compress, Repair, Batch Processor |

---

## Privacy

- **Zero uploads** — all processing runs via browser APIs and WebAssembly
- **No analytics** — no tracking scripts of any kind
- **No local storage** — files are never persisted to disk by the app
- **Open source** — read every line of the code yourself

---

## Tech Stack

Pure **HTML + CSS + JavaScript**. No framework, no build step.

| Library | Version | License | Purpose |
|---|---|---|---|
| [pdf-lib](https://pdf-lib.js.org) | 1.17.1 | MIT | PDF creation & editing |
| [PDF.js](https://mozilla.github.io/pdf.js/) | 4.4.168 | Apache 2.0 | PDF rendering & text extraction |
| [Tesseract.js](https://tesseract.projectnaptha.com) | 5.1.1 | Apache 2.0 | OCR |
| [JSZip](https://stuk.github.io/jszip/) | 3.10.1 | MIT | ZIP creation |
| [FileSaver.js](https://github.com/eligrey/FileSaver.js) | 2.0.5 | MIT | File downloads |
| [mammoth.js](https://github.com/mwilliamson/mammoth.js) | 1.6.0 | MIT | DOCX→HTML conversion |
| [SheetJS](https://sheetjs.com) | 0.20.3 | Apache 2.0 | Spreadsheet processing |
| [diff-match-patch](https://github.com/google/diff-match-patch) | 1.0.5 | Apache 2.0 | Text diffing |
| [jsPDF](https://github.com/parallax/jsPDF) | 2.5.1 | MIT | HTML→PDF rendering |
| [Pica](https://github.com/nodeca/pica) | 9.0.1 | MIT | High-quality image resizing |

---

## Deployment

| Service | Config |
|---|---|
| **Vercel** | `vercel.json` at root |
| **GitHub Actions** | HTML validation + ESLint on PRs |

Deploy your own:

```bash
git clone https://github.com/your-username/documind
cd documind
npx vercel --prod
```

Or simply open `index.html` directly in a browser — no server needed.

---

## Project Structure

```
/
├── index.html           # Homepage with tool grid
├── manifest.json        # Machine-readable tool registry
├── vercel.json          # Vercel routing & cache headers
├── LICENSES.md          # Third-party license notices
├── README.md
├── styles/
│   ├── global.css       # Design system & variables
│   ├── components.css   # Reusable UI components
│   └── tools.css        # Tool page shared layout
├── core/
│   ├── utils.js         # File & format utilities
│   ├── pdf-engine.js    # pdf-lib + PDF.js wrapper
│   ├── ui-components.js # Dropzone, toast, modal, etc.
│   └── agent-api.js     # Programmatic window.DocuMind API
├── libs/                # Vendored libraries (no CDN)
└── tools/               # 33 individual tool pages
    ├── merge.html
    ├── split.html
    └── ...
```

---

## Agent API

The `window.DocuMind` global object exposes a DOM-free programmatic API:

```javascript
// Example: merge PDFs programmatically
const result = await window.DocuMind.mergePDFs([file1, file2]);
saveAs(result.blob, 'merged.pdf');
```

See [`core/agent-api.js`](core/agent-api.js) and [`manifest.json`](manifest.json) for the full API surface.

---

## License

MIT © DocuMind Contributors

Third-party library licenses: see [LICENSES.md](LICENSES.md)

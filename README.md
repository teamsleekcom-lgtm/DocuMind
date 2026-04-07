# DocuMind

DocuMind is a powerful, local-first PDF processing application. Built for privacy and performance, it runs entirely on your machine with zero data leaving your device.

## Features

- **Local-First:** All processing happens on your own hardware. No cloud, no uploads.
- **Privacy by Design:** Your documents never leave your computer.
- **Native Experience:** Distributed as a native desktop application for Windows, macOS, and Linux.
- **70+ Tools:** Merge, split, compress, convert, OCR, and more.
- **Auto-Update:** Stay up to date with silent, background updates.

## Getting Started

1. Download the latest release for your operating system from our [Landing Page](https://documind-landing.vercel.app).
2. Install and launch DocuMind.
3. On first launch, the application will initialize its local PDF engine.
4. Drag and drop your PDFs and start processing!

## Development

DocuMind is built with:
- **Frontend:** React, Vite, Mantine UI, TailwindCSS.
- **Desktop Shell:** Tauri (Rust).
- **PDF Engine:** Stirling-PDF (Java) running as a local sidecar.

### Prerequisites

- Node.js 20+
- Rust & Cargo
- Java JDK 21+

### Running Locally

```bash
# Start the backend
./gradlew bootRun

# Start the frontend (in a new terminal)
cd frontend
npm install
npm run dev
```

## License

This project is licensed under the Apache License 2.0. See [LICENSE](LICENSE) for details.
DocuMind is a rebranded fork of [Stirling-PDF](https://github.com/Stirling-Tools/Stirling-PDF).

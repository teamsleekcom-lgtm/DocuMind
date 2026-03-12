const { PDFDocument, rgb } = require('./libs/pdf-lib.min.js');
const fs = require('fs');

async function createDemo() {
  const doc = await PDFDocument.create();
  for (let i = 1; i <= 5; i++) {
    const page = doc.addPage([600, 800]);
    page.drawText(`Demo Page ${i}`, { x: 50, y: 700, size: 50 });
  }
  const bytes = await doc.save();
  fs.writeFileSync('demo.pdf', bytes);
  console.log('demo.pdf created.');
}
createDemo();

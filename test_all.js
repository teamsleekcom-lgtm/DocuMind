const express = require('express');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.static(__dirname));

const server = app.listen(3002, async () => {
    console.log('Server started on 3002');
    
    let browser;
    try {
        browser = await puppeteer.launch({ headless: 'new' });
    } catch (e) {
        // Fallback for older puppeteer
        browser = await puppeteer.launch();
    }
    
    const page = await browser.newPage();
    
    const tools = fs.readdirSync(path.join(__dirname, 'tools')).filter(f => f.endsWith('.html'));
    
    let errorCount = 0;
    let brokenTools = [];
    
    for (const tool of tools) {
        console.log(`Testing ${tool}...`);
        
        let pageErrors = [];
        const consoleListener = msg => {
            if (msg.type() === 'error') pageErrors.push(msg.text());
        };
        const pageErrorListener = err => {
            pageErrors.push(err.toString());
        };
        
        page.on('console', consoleListener);
        page.on('pageerror', pageErrorListener);
        
        await page.goto(`http://localhost:3002/tools/${tool}`, { waitUntil: 'networkidle2' });
        const input = await page.$('input[type="file"]');
        if (input) {
            await input.uploadFile(path.join(__dirname, 'demo.pdf'));
            await new Promise(r => setTimeout(r, 500)); // Wait half a sec for JS execution
        } else {
            // some tools like batch might need interaction or different setup, but most have dropzone
        }
        
        if (pageErrors.length > 0) {
            console.log(`[!] ERRORS IN ${tool}:`);
            pageErrors.forEach(e => console.log('    ' + e));
            errorCount++;
            brokenTools.push(tool);
        }
        
        page.off('console', consoleListener);
        page.off('pageerror', pageErrorListener);
    }
    
    await browser.close();
    server.close();
    console.log(`\nFinished! Tools with errors: ${errorCount}`);
    if (errorCount > 0) {
        console.log('Broken tools:', brokenTools.join(', '));
    }
});

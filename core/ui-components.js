/**
 * DocuMind — UI Components
 * Reusable dropzone, progress bar, toast, modal, page preview, download button
 */

/* global formatFileSize, getPageCount, renderPage, logger, uid */

/**
 * Create a file dropzone with drag-and-drop support
 * @param {Object} options
 * @param {HTMLElement} options.container - Container element
 * @param {string} [options.accept] - Accepted file types (e.g., '.pdf')
 * @param {boolean} [options.multiple=false] - Allow multiple files
 * @param {function} [options.onFiles] - Callback when files are added
 * @param {string} [options.label] - Custom label text
 * @returns {Object} Dropzone controller { el, getFiles, clear }
 */
function createDropzone(options) {
    const { container, accept, multiple, onFiles, label } = options;
    const id = 'dz-' + uid();
    const files = [];

    const el = document.createElement('div');
    el.className = 'dropzone';
    el.id = id;
    el.innerHTML = `
    <div class="dropzone-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
        <polyline points="17 8 12 3 7 8"/>
        <line x1="12" y1="3" x2="12" y2="15"/>
      </svg>
    </div>
    <p class="dropzone-text">Drop files here or <strong>click to browse</strong></p>
    ${label ? `<p class="dropzone-hint">${label}</p>` : ''}
    <input type="file" ${accept ? `accept="${accept}"` : ''} ${multiple ? 'multiple' : ''}/>
  `;

    const input = el.querySelector('input');

    el.addEventListener('dragover', (e) => {
        e.preventDefault();
        el.classList.add('drag-over');
    });

    el.addEventListener('dragleave', () => {
        el.classList.remove('drag-over');
    });

    el.addEventListener('drop', (e) => {
        e.preventDefault();
        el.classList.remove('drag-over');
        handleFiles(e.dataTransfer.files);
    });

    input.addEventListener('change', () => {
        handleFiles(input.files);
        input.value = '';
    });

    function handleFiles(fileList) {
        const newFiles = Array.from(fileList);
        if (multiple) {
            files.push(...newFiles);
        } else {
            files.length = 0;
            files.push(newFiles[0]);
        }
        if (onFiles) onFiles([...files]);
    }

    container.appendChild(el);

    return {
        el,
        getFiles: () => [...files],
        clear: () => {
            files.length = 0;
            if (onFiles) onFiles([]);
        },
        addFiles: (newFiles) => {
            if (multiple) {
                files.push(...newFiles);
            } else {
                files.length = 0;
                files.push(newFiles[0]);
            }
            if (onFiles) onFiles([...files]);
        }
    };
}

/**
 * Create a file list display
 * @param {HTMLElement} container
 * @param {File[]} files
 * @param {Object} [options]
 * @param {boolean} [options.removable=true]
 * @param {boolean} [options.sortable=false]
 * @param {function} [options.onRemove]
 * @param {function} [options.onReorder]
 */
function createFileList(container, files, options) {
    options = options || {};
    container.innerHTML = '';

    if (files.length === 0) return;

    const list = document.createElement('ul');
    list.className = 'file-list';

    files.forEach((file, index) => {
        const li = document.createElement('li');
        li.className = 'file-item';
        li.setAttribute('draggable', options.sortable ? 'true' : 'false');
        li.dataset.index = index;

        li.innerHTML = `
      ${options.sortable ? '<span class="file-item-drag"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><circle cx="9" cy="6" r="1.5"/><circle cx="15" cy="6" r="1.5"/><circle cx="9" cy="12" r="1.5"/><circle cx="15" cy="12" r="1.5"/><circle cx="9" cy="18" r="1.5"/><circle cx="15" cy="18" r="1.5"/></svg></span>' : ''}
      <span class="file-item-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
        </svg>
      </span>
      <span class="file-item-info">
        <span class="file-item-name">${file.name}</span>
        <span class="file-item-meta">${formatFileSize(file.size)}</span>
      </span>
      ${options.removable !== false ? '<button class="file-item-remove" title="Remove"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>' : ''}
    `;

        const removeBtn = li.querySelector('.file-item-remove');
        if (removeBtn && options.onRemove) {
            removeBtn.addEventListener('click', () => options.onRemove(index));
        }

        // Drag and drop reordering
        if (options.sortable) {
            li.addEventListener('dragstart', (e) => {
                li.classList.add('dragging');
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/plain', index);
            });

            li.addEventListener('dragend', () => {
                li.classList.remove('dragging');
            });

            li.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
            });

            li.addEventListener('drop', (e) => {
                e.preventDefault();
                const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
                const toIndex = index;
                if (fromIndex !== toIndex && options.onReorder) {
                    options.onReorder(fromIndex, toIndex);
                }
            });
        }

        list.appendChild(li);
    });

    container.appendChild(list);
}

/**
 * Create an animated progress bar
 * @param {HTMLElement} container
 * @returns {Object} { el, update(percent, label), show(), hide(), reset() }
 */
function createProgressBar(container) {
    const el = document.createElement('div');
    el.className = 'progress-container';
    el.innerHTML = `
    <div class="progress-bar-wrapper">
      <div class="progress-bar"></div>
    </div>
    <div class="progress-label">
      <span class="progress-status">Processing...</span>
      <span class="progress-percent">0%</span>
    </div>
  `;

    const bar = el.querySelector('.progress-bar');
    const status = el.querySelector('.progress-status');
    const percent = el.querySelector('.progress-percent');

    if (container) container.appendChild(el);

    return {
        el,
        update(pct, label) {
            bar.style.width = Math.min(100, Math.max(0, pct)) + '%';
            percent.textContent = Math.round(pct) + '%';
            if (label) status.textContent = label;
        },
        show() { el.classList.add('active'); },
        hide() { el.classList.remove('active'); },
        reset() {
            bar.style.width = '0%';
            percent.textContent = '0%';
            status.textContent = 'Processing...';
        }
    };
}

/**
 * Show a toast notification
 * @param {string} message - Toast message
 * @param {'success'|'error'|'info'} [type='info'] - Toast type
 */
function showToast(message, type) {
    type = type || 'info';
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const icons = {
        success: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
        error: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
        info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'
    };

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<span class="toast-icon">${icons[type]}</span><span>${message}</span>`;

    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('removing');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

/**
 * Create a lightbox modal overlay
 * @param {string|HTMLElement} content - Modal content (HTML string or element)
 * @returns {Object} { el, close }
 */
function createModal(content) {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';

    const modal = document.createElement('div');
    modal.className = 'modal';

    const closeBtn = document.createElement('button');
    closeBtn.className = 'modal-close';
    closeBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';

    modal.appendChild(closeBtn);

    if (typeof content === 'string') {
        const contentEl = document.createElement('div');
        contentEl.innerHTML = content;
        modal.appendChild(contentEl);
    } else {
        modal.appendChild(content);
    }

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    function close() {
        overlay.remove();
    }

    closeBtn.addEventListener('click', close);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) close();
    });

    return { el: overlay, close };
}

/**
 * Create a thumbnail grid of PDF pages
 * @param {HTMLElement} container
 * @param {File} file
 * @param {Object} [options]
 * @param {boolean} [options.selectable=false]
 * @param {boolean} [options.sortable=false]
 * @param {function} [options.onSelect]
 * @returns {Promise<Object>} { getSelected, getOrder }
 */
async function createPagePreview(container, file, options) {
    options = options || {};
    container.innerHTML = '';

    const grid = document.createElement('div');
    grid.className = 'page-grid';

    const count = await getPageCount(file);
    const selected = new Set();
    const order = [];

    for (let i = 1; i <= count; i++) {
        order.push(i);
        const thumb = document.createElement('div');
        thumb.className = 'page-thumb';
        thumb.dataset.page = i;

        try {
            const canvas = await renderPage(file, i, 0.3);
            thumb.appendChild(canvas);
        } catch (e) {
            const placeholder = document.createElement('div');
            placeholder.style.cssText = 'height:120px;display:flex;align-items:center;justify-content:center;color:#999;font-size:0.75rem;';
            placeholder.textContent = 'Page ' + i;
            thumb.appendChild(placeholder);
        }

        const label = document.createElement('div');
        label.className = 'page-thumb-label';
        label.textContent = 'Page ' + i;
        thumb.appendChild(label);

        if (options.selectable) {
            thumb.addEventListener('click', () => {
                if (selected.has(i)) {
                    selected.delete(i);
                    thumb.classList.remove('selected');
                } else {
                    selected.add(i);
                    thumb.classList.add('selected');
                }
                if (options.onSelect) options.onSelect([...selected]);
            });
        }

        if (options.sortable) {
            thumb.setAttribute('draggable', 'true');
            thumb.addEventListener('dragstart', (e) => {
                thumb.classList.add('dragging');
                e.dataTransfer.setData('text/plain', i.toString());
            });
            thumb.addEventListener('dragend', () => thumb.classList.remove('dragging'));
            thumb.addEventListener('dragover', (e) => e.preventDefault());
            thumb.addEventListener('drop', (e) => {
                e.preventDefault();
                const from = parseInt(e.dataTransfer.getData('text/plain'));
                const to = i;
                const fromIdx = order.indexOf(from);
                const toIdx = order.indexOf(to);
                order.splice(fromIdx, 1);
                order.splice(toIdx, 0, from);
                // Re-render order
                const items = [...grid.children];
                const movedItem = items.find(el => parseInt(el.dataset.page) === from);
                const targetItem = items.find(el => parseInt(el.dataset.page) === to);
                if (movedItem && targetItem) {
                    grid.insertBefore(movedItem, targetItem);
                }
            });
        }

        grid.appendChild(thumb);
    }

    container.appendChild(grid);

    return {
        getSelected: () => [...selected],
        getOrder: () => [...order],
        selectAll: () => {
            for (let i = 1; i <= count; i++) {
                selected.add(i);
                const t = grid.querySelector(`[data-page="${i}"]`);
                if (t) t.classList.add('selected');
            }
        },
        deselectAll: () => {
            selected.clear();
            grid.querySelectorAll('.page-thumb').forEach(t => t.classList.remove('selected'));
        }
    };
}

/**
 * Create a styled download button
 * @param {Blob} blob - File blob to download
 * @param {string} filename - Download filename
 * @param {HTMLElement} [container] - Optional container to append to
 * @returns {HTMLButtonElement}
 */
function createDownloadButton(blob, filename, container) {
    const btn = document.createElement('button');
    btn.className = 'download-btn';
    btn.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/>
      <line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
    Download ${filename}
  `;

    btn.addEventListener('click', () => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    if (container) container.appendChild(btn);
    return btn;
}

/**
 * Build the shared nav bar HTML
 * @returns {string}
 */
function getNavHTML() {
    return `
  <nav class="nav">
    <a href="/" class="nav-logo">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
      </svg>
      DocuMind
    </a>
    <div class="nav-links">
      <a href="https://github.com" class="nav-link" target="_blank" rel="noopener">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
        GitHub
      </a>
    </div>
  </nav>`;
}

/**
 * Build the shared footer HTML
 * @returns {string}
 */
function getFooterHTML() {
    return `
  <footer class="footer">
    <div class="container">
      <p>All processing happens in your browser. Your files never leave your device.</p>
      <div class="footer-links">
        <a href="https://github.com" target="_blank" rel="noopener">GitHub</a>
        <a href="/LICENSES.md">Licenses</a>
      </div>
    </div>
  </footer>`;
}

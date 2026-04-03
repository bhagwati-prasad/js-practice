window.addEventListener('load', function() {
    function loadNoteModalScript() {
        return new Promise((resolve, reject) => {
            if (window.NoteModal && typeof window.NoteModal.openForContext === 'function') {
                resolve();
                return;
            }

            const existing = document.querySelector('script[data-global-note-modal="true"]');
            if (existing) {
                existing.addEventListener('load', () => resolve(), { once: true });
                existing.addEventListener('error', () => reject(new Error('Failed to load note modal script.')), { once: true });
                return;
            }

            const script = document.createElement('script');
            script.src = '/js/noteModal.js?v=1';
            script.async = true;
            script.dataset.globalNoteModal = 'true';
            script.addEventListener('load', () => resolve(), { once: true });
            script.addEventListener('error', () => reject(new Error('Failed to load note modal script.')), { once: true });
            document.body.appendChild(script);
        });
    }

    function ensureContextMenuAssets() {
        return new Promise((resolve, reject) => {
            if (window.contextMenu && typeof window.contextMenu.register === 'function') {
                resolve();
                return;
            }

            if (!document.querySelector('link[data-global-context-menu-css="true"]')) {
                const css = document.createElement('link');
                css.rel = 'stylesheet';
                css.href = '/components/contextMenu/contextMenu.css';
                css.dataset.globalContextMenuCss = 'true';
                document.head.appendChild(css);
            }

            const existing = document.querySelector('script[data-global-context-menu="true"]');
            if (existing) {
                existing.addEventListener('load', () => resolve(), { once: true });
                existing.addEventListener('error', () => reject(new Error('Failed to load context menu script.')), { once: true });
                return;
            }

            const script = document.createElement('script');
            script.src = '/components/contextMenu/contextMenu.js';
            script.async = true;
            script.dataset.globalContextMenu = 'true';
            script.addEventListener('load', () => resolve(), { once: true });
            script.addEventListener('error', () => reject(new Error('Failed to load context menu script.')), { once: true });
            document.body.appendChild(script);
        });
    }

    function buildPageReference() {
        const selectedProblem = document.querySelector('.problem-item.active, .problem-item.selected');
        const selectedBenchmark = document.querySelector('.benchmark-item.active, .benchmark-item.selected');

        if (selectedProblem) {
            const id = selectedProblem.dataset.problem || selectedProblem.getAttribute('data-problem') || window.location.pathname;
            return {
                pagePath: window.location.pathname,
                contextType: 'problem',
                contextId: id,
                label: selectedProblem.textContent.trim() || document.title
            };
        }

        if (selectedBenchmark) {
            const id = selectedBenchmark.dataset.benchmark || selectedBenchmark.getAttribute('data-benchmark') || window.location.pathname;
            return {
                pagePath: window.location.pathname,
                contextType: 'benchmark',
                contextId: id,
                label: selectedBenchmark.textContent.trim() || document.title
            };
        }

        return {
            pagePath: window.location.pathname,
            contextType: 'page',
            contextId: window.location.pathname,
            label: document.title
        };
    }

    function buildReferenceFromTarget(target) {
        if (!target) return buildPageReference();

        const label = target.textContent ? target.textContent.trim() : document.title;
        const problemId = target.dataset.problem || target.getAttribute('data-problem');
        const benchmarkId = target.dataset.benchmark || target.getAttribute('data-benchmark');

        if (problemId) {
            return {
                pagePath: window.location.pathname,
                contextType: 'problem',
                contextId: problemId,
                label: label || document.title
            };
        }

        if (benchmarkId) {
            return {
                pagePath: window.location.pathname,
                contextType: 'benchmark',
                contextId: benchmarkId,
                label: label || document.title
            };
        }

        return {
            pagePath: window.location.pathname,
            contextType: 'item',
            contextId: target.id || label || window.location.pathname,
            label: label || document.title
        };
    }

    async function initNoteContextMenu() {
        try {
            await ensureContextMenuAssets();
            if (!window.contextMenu || typeof window.contextMenu.register !== 'function') return;

            const targets = document.querySelectorAll('.problem-item, [data-problem], .benchmark-item, [data-benchmark]');
            if (!targets.length) return;

            targets.forEach(target => {
                target.setAttribute('data-context-menu', 'globalNoteContext');
                const problemId = target.dataset.problem || target.getAttribute('data-problem');
                const benchmarkId = target.dataset.benchmark || target.getAttribute('data-benchmark');

                if (problemId) {
                    target.setAttribute('data-context-type', 'problem');
                    target.setAttribute('data-context-id', problemId);
                } else if (benchmarkId) {
                    target.setAttribute('data-context-type', 'benchmark');
                    target.setAttribute('data-context-id', benchmarkId);
                } else {
                    target.setAttribute('data-context-type', 'item');
                    target.setAttribute('data-context-id', target.id || target.textContent.trim());
                }
                target.setAttribute('data-context-label', target.textContent.trim() || document.title);
            });

            window.contextMenu.register('globalNoteContext', [
                { label: 'Open Note', icon: 'notebook-pen', action: 'note:openFromContext' }
            ]);

            if (window.__noteContextMenuBound) return;

            window.contextMenu.on('note:openFromContext', async ({ target }) => {
                await loadNoteModalScript();
                if (!window.NoteModal || typeof window.NoteModal.openForContext !== 'function') return;
                await window.NoteModal.openForContext(buildReferenceFromTarget(target));
            });

            window.__noteContextMenuBound = true;
        } catch (err) {
            console.error(err);
        }
    }

    function injectGlobalNoteButton() {
        if (window.location.pathname.includes('/notes/')) return;
        if (document.getElementById('globalNoteBtn')) return;

        const targetToolbar = document.querySelector('header .end-align.toolbar') || document.querySelector('.header .toolbar');
        if (!targetToolbar) return;

        const button = document.createElement('button');
        button.id = 'globalNoteBtn';
        button.className = 'primary-btn';
        button.textContent = 'Note';
        button.title = 'Open note editor';

        button.addEventListener('click', async function() {
            try {
                await loadNoteModalScript();
                if (!window.NoteModal || typeof window.NoteModal.openForContext !== 'function') {
                    return;
                }
                await window.NoteModal.openForContext(buildPageReference());
            } catch (err) {
                console.error(err);
            }
        });

        targetToolbar.prepend(button);
    }

    // Right Sidebar functionality
    const settingsToggle = document.getElementById('settingsToggle');
    const rightSidebar = document.getElementById('rightSidebar');
    const closeRightSidebar = document.getElementById('closeRightSidebar');

    if (settingsToggle && rightSidebar) {
        settingsToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            rightSidebar.classList.toggle('open');
        });
    }

    if (closeRightSidebar && rightSidebar) {
        closeRightSidebar.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            rightSidebar.classList.remove('open');
        });
    }

    // Theme toggle functionality
    const themeToggle = document.getElementById('themeToggle');

    function updateThemeIcon(isLightTheme) {
        if (!themeToggle) return;
        
        if (isLightTheme) {
            themeToggle.innerHTML = `
                <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                </svg>
            `;
        } else {
            themeToggle.innerHTML = `
                <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/>
                </svg>
            `;
        }
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('light-theme');
            
            const isLightTheme = document.body.classList.contains('light-theme');
            
            if (window.monacoLoaded && window.editor && typeof monaco !== 'undefined') {
                monaco.editor.setTheme(isLightTheme ? 'vs' : 'vs-dark');
            }
            
            updateThemeIcon(isLightTheme);
            localStorage.setItem('theme', document.body.classList.contains('light-theme') ? 'light' : 'dark');
        });
    }

    if (localStorage.getItem('theme') === 'light') {
        document.body.classList.add('light-theme');
        updateThemeIcon(true);
    }

    injectGlobalNoteButton();
    initNoteContextMenu();
});
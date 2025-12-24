const MOBILE_BREAKPOINT = 1200;

const EDITOR_CONFIG = {
    value: '// Welcome to JS Practice!\n// Select a problem from the sidebar to begin.\n\nconsole.log("Hello, World!");',
    language: 'javascript',
    theme: 'vs-dark',
    fontSize: 14,
    minimap: { enabled: true },
    automaticLayout: true,
    scrollBeyondLastLine: false,
    wordWrap: 'on'
};

const THEME = {
    LIGHT: 'vs',
    DARK: 'vs-dark'
};

const FONT_SIZE = {
    MIN: 10,
    MAX: 24
};

let editor;
let monacoLoaded = false;
let playgroundMode = 'normal';

function createMonacoEditor() {
    monacoLoaded = true;
    editor = monaco.editor.create(document.getElementById('editor'), EDITOR_CONFIG);
    
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
        const runButton = document.getElementById('runButton');
        if (runButton) runButton.click();
    });
}

function initMonaco() {
    if (typeof require !== 'undefined' && typeof monaco === 'undefined') {
        require.config({ paths: { vs: 'https://unpkg.com/monaco-editor@0.44.0/min/vs' } });
        require(['vs/editor/editor.main'], createMonacoEditor);
    } else if (typeof monaco !== 'undefined') {
        createMonacoEditor();
    } else {
        const editorContainer = document.getElementById('editor');
        editorContainer.innerHTML = '<textarea id="fallback-editor" style="width: 100%; height: 100%; background-color: #1e1e1e; color: #d4d4d4; border: none; padding: 15px; font-family: \'Consolas\', \'Monaco\', monospace; font-size: 14px; resize: none; outline: none;">// Welcome to JS Practice!\n// Select a problem from the sidebar to begin.\n\nconsole.log("Hello, World!");</textarea>';
        
        editor = {
            getValue: () => document.getElementById('fallback-editor').value,
            setValue: (value) => { document.getElementById('fallback-editor').value = value; }
        };
    }
}

const sidebar = document.getElementById('sidebar');
const toggleBtn = document.getElementById('toggleSidebar');
const closeBtn = document.getElementById('closeSidebar');

function resetPlaygroundMode() {
    const mainContent = document.querySelector('.main-content');
    const floatingPlaygroundControl = document.getElementById('floatingPlaygroundControl');
    
    if (mainContent) {
        mainContent.classList.remove('playground', 'playground-vertical', 'playground-horizontal');
    }
    
    if (floatingPlaygroundControl) {
        floatingPlaygroundControl.classList.remove('visible');
    }
    
    playgroundMode = 'normal';
}

function resetElementStyles() {
    const elements = [
        { el: document.getElementById('editor'), props: ['width', 'height', 'flex'] },
        { el: document.querySelector('.input-output-section'), props: ['width', 'height', 'flex'] },
        { el: document.querySelector('.editor-section'), props: ['flexDirection'] }
    ];
    
    elements.forEach(({ el, props }) => {
        if (el) props.forEach(prop => el.style[prop] = '');
    });
}

function updatePlayground(mode) {
    const mainContent = document.querySelector('.main-content');
    const floatingPlaygroundControl = document.getElementById('floatingPlaygroundControl');
    
    mainContent.classList.remove('playground', 'playground-vertical', 'playground-horizontal');
    resetElementStyles();
    
    if (mode === 'vertical') {
        mainContent.classList.add('playground', 'playground-vertical');
        floatingPlaygroundControl.classList.add('visible');
        updateFloatingPlaygroundIcon('vertical');
    } else if (mode === 'horizontal') {
        mainContent.classList.add('playground', 'playground-horizontal');
        floatingPlaygroundControl.classList.add('visible');
        updateFloatingPlaygroundIcon('horizontal');
    } else {
        floatingPlaygroundControl.classList.remove('visible');
        updateFloatingPlaygroundIcon('normal');
    }
    playgroundMode = mode;
}

function updateFloatingPlaygroundIcon(mode) {
    const icon = document.querySelector('#floatingPlaygroundControl .icon');
    if (!icon) return;
    
    const icons = {
        'normal': '<path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
        'vertical': '<path d="M3 3h8v18H3zM13 3h8v18h-8z" stroke="currentColor" stroke-width="2" fill="none"/>',
        'horizontal': '<path d="M3 3h18v8H3zM3 13h18v8H3z" stroke="currentColor" stroke-width="2" fill="none"/>'
    };
    
    icon.innerHTML = icons[mode] || icons.normal;
}

toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
    resetPlaygroundMode();
});

closeBtn.addEventListener('click', () => {
    sidebar.classList.add('collapsed');
});

window.addEventListener('load', function() {
    setTimeout(initMonaco, 100);

    const playgroundToggle = document.getElementById('playgroundToggle');
    const floatingPlaygroundControl = document.getElementById('floatingPlaygroundControl');
    const mainContent = document.querySelector('.main-content');

    if (!playgroundToggle || !floatingPlaygroundControl || !mainContent) {
        console.error('Playground elements not found');
        return;
    }

    playgroundToggle.addEventListener('click', () => {
        if (playgroundMode === 'normal') {
            sidebar.classList.add('collapsed');
            updatePlayground('horizontal');
        } else if (playgroundMode === 'horizontal') {
            updatePlayground('vertical');
        } else {
            updatePlayground('horizontal');
        }
    });

    floatingPlaygroundControl.addEventListener('click', () => {
        if (playgroundMode === 'horizontal') {
            updatePlayground('vertical');
        } else {
            updatePlayground('horizontal');
        }
    });
});

const tabHeaders = document.querySelectorAll('.tab-header');
const tabPanels = document.querySelectorAll('.tab-panel');

tabHeaders.forEach(header => {
    header.addEventListener('click', () => {
        const tabName = header.getAttribute('data-tab');
        
        tabHeaders.forEach(h => h.classList.remove('active'));
        tabPanels.forEach(p => p.classList.remove('active'));
        
        header.classList.add('active');
        const targetPanel = tabName === 'input' ? document.getElementById('inputTab') : document.getElementById('consoleTab');
        if (targetPanel) {
            targetPanel.classList.add('active');
        }
    });
});

const problemItems = document.querySelectorAll('.problem-item');
const problemTitle = document.getElementById('problemTitle');
const problemContent = document.getElementById('problemContent');

problemItems.forEach(item => {
    item.addEventListener('click', () => {
        const problemId = item.getAttribute('data-problem');
        const problem = problems[problemId];
        
        if (problem) {
            problemItems.forEach(p => p.classList.remove('active'));
            item.classList.add('active');
            
            problemTitle.textContent = problem.title;
            problemContent.innerHTML = problem.description;
            
            if (editor) {
                editor.setValue(problem.starterCode);
            }
            
            document.getElementById('console').textContent = '';
            document.getElementById('console').className = '';
            document.getElementById('sampleInput').value = '';
            
            if (window.innerWidth < MOBILE_BREAKPOINT) {
                sidebar.classList.add('collapsed');
            }
        }
    });
});

const runButton = document.getElementById('runButton');
const outputElement = document.getElementById('console');
const sampleInputElement = document.getElementById('sampleInput');

runButton.addEventListener('click', () => {
    if (!editor) {
        outputElement.textContent = 'Editor not initialized yet. Please wait...';
        outputElement.className = 'error';
        return;
    }
    
    const code = editor.getValue();
    const input = sampleInputElement.value;
    
    outputElement.textContent = '';
    outputElement.className = '';
    
    const logs = [];
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;
    
    console.log = (...args) => {
        logs.push(args.map(arg => {
            if (typeof arg === 'object') {
                return JSON.stringify(arg, null, 2);
            }
            return String(arg);
        }).join(' '));
        originalLog.apply(console, args);
    };
    
    console.error = (...args) => {
        logs.push('ERROR: ' + args.map(arg => String(arg)).join(' '));
        originalError.apply(console, args);
    };
    
    console.warn = (...args) => {
        logs.push('WARNING: ' + args.map(arg => String(arg)).join(' '));
        originalWarn.apply(console, args);
    };
    
    try {
        if (input.trim()) {
            window.INPUT = input;
        }
        
        eval(code);
        
        if (logs.length > 0) {
            outputElement.textContent = logs.join('\n');
            outputElement.className = 'success';
        } else {
            outputElement.textContent = 'Code executed successfully (no output)';
            outputElement.className = 'success';
        }
    } catch (error) {
        outputElement.textContent = `Error: ${error.message}\n\nStack trace:\n${error.stack}`;
        outputElement.className = 'error';
    } finally {
        console.log = originalLog;
        console.error = originalError;
        console.warn = originalWarn;
    }
});

document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        runButton.click();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('themeToggle');

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('light-theme');
            
            const isLightTheme = document.body.classList.contains('light-theme');
            
            if (monacoLoaded && editor && monaco) {
                monaco.editor.setTheme(isLightTheme ? 'vs' : 'vs-dark');
            }
            
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
        });
    }

    const rightSidebar = document.getElementById('rightSidebar');
    const settingsToggle = document.getElementById('settingsToggle');
    const closeRightSidebar = document.getElementById('closeRightSidebar');

    if (settingsToggle && rightSidebar) {
        settingsToggle.addEventListener('click', () => {
            rightSidebar.classList.toggle('open');
        });
    }

    if (closeRightSidebar && rightSidebar) {
        closeRightSidebar.addEventListener('click', () => {
            rightSidebar.classList.remove('open');
        });
    }

    const minimapToggle = document.getElementById('minimapToggle');
    const wordWrapToggle = document.getElementById('wordWrapToggle');
    const fontSizeInput = document.getElementById('fontSizeInput');

    if (minimapToggle) {
        minimapToggle.addEventListener('change', (e) => {
            if (editor && editor.updateOptions) {
                editor.updateOptions({ minimap: { enabled: e.target.checked } });
            }
        });
    }

    if (wordWrapToggle) {
        wordWrapToggle.addEventListener('change', (e) => {
            if (editor && editor.updateOptions) {
                editor.updateOptions({ wordWrap: e.target.checked ? 'on' : 'off' });
            }
        });
    }

    if (fontSizeInput) {
        fontSizeInput.addEventListener('change', (e) => {
            const fontSize = parseInt(e.target.value);
            if (editor && editor.updateOptions && fontSize >= FONT_SIZE.MIN && fontSize <= FONT_SIZE.MAX) {
                editor.updateOptions({ fontSize: fontSize });
            }
        });
    }
});

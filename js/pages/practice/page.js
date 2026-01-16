const MOBILE_BREAKPOINT = 1200;

const EDITOR_CONFIG = {
    value: '',
    language: 'javascript',
    theme: localStorage.getItem('theme') === 'light' ? 'vs' : 'vs-dark',
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

window.editor = null;
window.monacoLoaded = false;
let playgroundMode = 'normal';

function createMonacoEditor() {
    window.monacoLoaded = true;
    window.editor = monaco.editor.create(document.getElementById('editor'), EDITOR_CONFIG);
    
    window.editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
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
        
        window.editor = {
            getValue: () => document.getElementById('fallback-editor').value,
            setValue: (value) => { document.getElementById('fallback-editor').value = value; }
        };
    }
}

const sidebar = document.getElementById('sidebar');
const toggleBtn = document.getElementById('toggleSidebar');
const closeBtn = document.getElementById('closeSidebar');

// Initialize Left Sidebar Component
if (sidebar) {
    window.leftSidebarInstance = new LeftSidebar('sidebar', {
        toggleButtonId: 'toggleSidebar',
        closeButtonId: 'closeSidebar',
        enableTopicToggle: true
    });
}

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
    const icon = document.querySelector('#floatingPlaygroundControl .playground-icon');
    if (!icon) return;

    const icons = {
        normal: '<rect x="3" y="3" width="18" height="18" rx="2"></rect>',
        vertical: '<rect x="3" y="3" width="18" height="18" rx="2"></rect><line x1="12" y1="3" x2="12" y2="21"></line>',
        horizontal: '<rect x="3" y="3" width="18" height="18" rx="2"></rect><line x1="3" y1="12" x2="21" y2="12"></line>'
    };

    icon.innerHTML = icons[mode] || icons.normal;
}

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
    });if (window.leftSidebarInstance) {
                window.leftSidebarInstance.close();
            }

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

const runButton = document.getElementById('runButton');
const outputElement = document.getElementById('console');
const sampleInputElement = document.getElementById('sampleInput');

runButton.addEventListener('click', () => {
    if (!window.editor) {
        outputElement.textContent = 'Editor not initialized yet. Please wait...';
        outputElement.className = 'error';
        return;
    }
    
    const code = window.editor.getValue();
    const input = sampleInputElement.value;
    
    outputElement.textContent = '';
    outputElement.className = '';
    
    const logs = [];
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;
    
    console.log = (...args) => {
        logs.push(args.map(arg => {
            if(Array.isArray(arg)) {
                return JSON.stringify(arg).replace(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/g, ', ');
            }
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
    // Editor settings event handlers
    const minimapToggle = document.getElementById('minimapToggle');
    const wordWrapToggle = document.getElementById('wordWrapToggle');
    const fontSizeInput = document.getElementById('fontSizeInput');

    if (minimapToggle) {
        minimapToggle.addEventListener('change', (e) => {
            if (window.editor && window.editor.updateOptions) {
                window.editor.updateOptions({ minimap: { enabled: e.target.checked } });
            }
        });
    }

    if (wordWrapToggle) {
        wordWrapToggle.addEventListener('change', (e) => {
            if (window.editor && window.editor.updateOptions) {
                window.editor.updateOptions({ wordWrap: e.target.checked ? 'on' : 'off' });
            }
        });
    }

    if (fontSizeInput) {
        fontSizeInput.addEventListener('change', (e) => {
            const fontSize = parseInt(e.target.value);
            if (window.editor && window.editor.updateOptions && fontSize >= FONT_SIZE.MIN && fontSize <= FONT_SIZE.MAX) {
                window.editor.updateOptions({ fontSize: fontSize });
            }
        });
    }
});

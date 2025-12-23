const MOBILE_BREAKPOINT = 1200;

let editor;
let monacoLoaded = false;

function initMonaco() {
    if (typeof require !== 'undefined' && typeof monaco === 'undefined') {
        require.config({ paths: { vs: 'https://unpkg.com/monaco-editor@0.44.0/min/vs' } });
        require(['vs/editor/editor.main'], function () {
            monacoLoaded = true;
            editor = monaco.editor.create(document.getElementById('editor'), {
                value: '// Welcome to JS Practice!\n// Select a problem from the sidebar to begin.\n\nconsole.log("Hello, World!");',
                language: 'javascript',
                theme: 'vs-dark',
                fontSize: 14,
                minimap: { enabled: true },
                automaticLayout: true,
                scrollBeyondLastLine: false,
                wordWrap: 'on'
            });
        });
    } else if (typeof monaco !== 'undefined') {
        // Monaco already loaded
        monacoLoaded = true;
        editor = monaco.editor.create(document.getElementById('editor'), {
            value: '// Welcome to JS Practice!\n// Select a problem from the sidebar to begin.\n\nconsole.log("Hello, World!");',
            language: 'javascript',
            theme: 'vs-dark',
            fontSize: 14,
            minimap: { enabled: true },
            automaticLayout: true,
            scrollBeyondLastLine: false,
            wordWrap: 'on'
        });
    } else {
        // Fallback to textarea if Monaco fails to load
        const editorContainer = document.getElementById('editor');
        editorContainer.innerHTML = '<textarea id="fallback-editor" style="width: 100%; height: 100%; background-color: #1e1e1e; color: #d4d4d4; border: none; padding: 15px; font-family: \'Consolas\', \'Monaco\', monospace; font-size: 14px; resize: none; outline: none;">// Welcome to JS Practice!\n// Select a problem from the sidebar to begin.\n\nconsole.log("Hello, World!");</textarea>';
        
        editor = {
            getValue: function() {
                return document.getElementById('fallback-editor').value;
            },
            setValue: function(value) {
                document.getElementById('fallback-editor').value = value;
            }
        };
    }
}

window.addEventListener('load', function() {
    setTimeout(initMonaco, 100);
});

const sidebar = document.getElementById('sidebar');
const toggleBtn = document.getElementById('toggleSidebar');
const closeBtn = document.getElementById('closeSidebar');

toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
});

closeBtn.addEventListener('click', () => {
    sidebar.classList.add('collapsed');
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
        
        // RISKY: Evil Eval used for code execution
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

// Keyboard shortcut for running code (Ctrl+Enter or Cmd+Enter)
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
                // Moon icon
                themeToggle.innerHTML = `
                    <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                    </svg>
                `;
            } else {
                // Sun icon
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

    console.log('Right sidebar elements:', { rightSidebar, settingsToggle, closeRightSidebar });

    if (settingsToggle && rightSidebar) {
        settingsToggle.addEventListener('click', () => {
            console.log('Settings toggle clicked');
            rightSidebar.classList.toggle('open');
            console.log('Right sidebar classes:', rightSidebar.className);
        });
    }

    if (closeRightSidebar && rightSidebar) {
        closeRightSidebar.addEventListener('click', () => {
            console.log('Close right sidebar clicked');
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
            if (editor && editor.updateOptions && fontSize >= 10 && fontSize <= 24) {
                editor.updateOptions({ fontSize: fontSize });
            }
        });
    }
});

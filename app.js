// Constants
const MOBILE_BREAKPOINT = 1200;

// Problems are now loaded from separate topic files via index.html script tags

// Monaco Editor instance
let editor;
let monacoLoaded = false;

// Initialize Monaco Editor
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
        
        // Use the textarea as editor
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

// Wait for page load
window.addEventListener('load', function() {
    setTimeout(initMonaco, 100);
});

// Sidebar toggle functionality
const sidebar = document.getElementById('sidebar');
const toggleBtn = document.getElementById('toggleSidebar');
const closeBtn = document.getElementById('closeSidebar');

toggleBtn.addEventListener('click', () => {
    sidebar.classList.remove('collapsed');
});

closeBtn.addEventListener('click', () => {
    sidebar.classList.add('collapsed');
});

// Problem selection functionality
const problemItems = document.querySelectorAll('.problem-item');
const problemTitle = document.getElementById('problemTitle');
const problemContent = document.getElementById('problemContent');

problemItems.forEach(item => {
    item.addEventListener('click', () => {
        const problemId = item.getAttribute('data-problem');
        const problem = problems[problemId];
        
        if (problem) {
            // Update active state
            problemItems.forEach(p => p.classList.remove('active'));
            item.classList.add('active');
            
            // Update problem description
            problemTitle.textContent = problem.title;
            problemContent.innerHTML = problem.description;
            
            // Update editor code
            if (editor) {
                editor.setValue(problem.starterCode);
            }
            
            // Clear output and input
            document.getElementById('output').textContent = '';
            document.getElementById('output').className = '';
            document.getElementById('sampleInput').value = '';
            
            // Close sidebar on mobile/small screens
            if (window.innerWidth < MOBILE_BREAKPOINT) {
                sidebar.classList.add('collapsed');
            }
        }
    });
});

// Run button functionality
const runButton = document.getElementById('runButton');
const outputElement = document.getElementById('output');
const sampleInputElement = document.getElementById('sampleInput');

runButton.addEventListener('click', () => {
    if (!editor) {
        outputElement.textContent = 'Editor not initialized yet. Please wait...';
        outputElement.className = 'error';
        return;
    }
    
    const code = editor.getValue();
    const input = sampleInputElement.value;
    
    // Clear previous output
    outputElement.textContent = '';
    outputElement.className = '';
    
    // Capture console.log output
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
        // If there's input, make it available as a global variable
        if (input.trim()) {
            window.INPUT = input;
        }
        
        // Execute the code
        // NOTE: eval() is used here for local practice purposes only.
        // This should NOT be used in production environments due to security risks.
        eval(code);
        
        // Display output
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
        // Restore original console methods
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

// Problem definitions
const problems = {
    'two-sum': {
        title: 'Two Sum',
        description: `
            <h2>Problem Description</h2>
            <p>Given an array of integers <code>nums</code> and an integer <code>target</code>, return indices of the two numbers such that they add up to <code>target</code>.</p>
            <p>You may assume that each input would have exactly one solution, and you may not use the same element twice.</p>
            
            <h3>Example 1:</h3>
            <pre><code>Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].</code></pre>
            
            <h3>Example 2:</h3>
            <pre><code>Input: nums = [3,2,4], target = 6
Output: [1,2]</code></pre>
            
            <h3>Constraints:</h3>
            <ul>
                <li>2 <= nums.length <= 10^4</li>
                <li>-10^9 <= nums[i] <= 10^9</li>
                <li>-10^9 <= target <= 10^9</li>
            </ul>
        `,
        starterCode: `function twoSum(nums, target) {
    // Your code here
    
}

// Test the function
const nums = [2, 7, 11, 15];
const target = 9;
console.log(twoSum(nums, target));`
    },
    'reverse-array': {
        title: 'Reverse Array',
        description: `
            <h2>Problem Description</h2>
            <p>Write a function that reverses an array in place.</p>
            
            <h3>Example:</h3>
            <pre><code>Input: [1, 2, 3, 4, 5]
Output: [5, 4, 3, 2, 1]</code></pre>
            
            <h3>Constraints:</h3>
            <ul>
                <li>The array should be reversed in place</li>
                <li>Do not use built-in reverse method</li>
            </ul>
        `,
        starterCode: `function reverseArray(arr) {
    // Your code here
    
}

// Test the function
const arr = [1, 2, 3, 4, 5];
reverseArray(arr);
console.log(arr);`
    },
    'reverse-string': {
        title: 'Reverse String',
        description: `
            <h2>Problem Description</h2>
            <p>Write a function that reverses a string.</p>
            
            <h3>Example:</h3>
            <pre><code>Input: "hello"
Output: "olleh"</code></pre>
        `,
        starterCode: `function reverseString(s) {
    // Your code here
    
}

// Test the function
const str = "hello";
console.log(reverseString(str));`
    },
    'palindrome': {
        title: 'Check Palindrome',
        description: `
            <h2>Problem Description</h2>
            <p>Given a string, determine if it is a palindrome, considering only alphanumeric characters and ignoring cases.</p>
            
            <h3>Example 1:</h3>
            <pre><code>Input: "A man, a plan, a canal: Panama"
Output: true</code></pre>
            
            <h3>Example 2:</h3>
            <pre><code>Input: "race a car"
Output: false</code></pre>
        `,
        starterCode: `function isPalindrome(s) {
    // Your code here
    
}

// Test the function
console.log(isPalindrome("A man, a plan, a canal: Panama"));
console.log(isPalindrome("race a car"));`
    },
    'fibonacci': {
        title: 'Fibonacci Number',
        description: `
            <h2>Problem Description</h2>
            <p>The Fibonacci numbers form a sequence, such that each number is the sum of the two preceding ones, starting from 0 and 1.</p>
            <p>Given n, calculate F(n).</p>
            
            <h3>Example 1:</h3>
            <pre><code>Input: n = 2
Output: 1
Explanation: F(2) = F(1) + F(0) = 1 + 0 = 1</code></pre>
            
            <h3>Example 2:</h3>
            <pre><code>Input: n = 4
Output: 3
Explanation: F(4) = F(3) + F(2) = 2 + 1 = 3</code></pre>
        `,
        starterCode: `function fibonacci(n) {
    // Your code here
    
}

// Test the function
console.log(fibonacci(2));  // 1
console.log(fibonacci(4));  // 3
console.log(fibonacci(10)); // 55`
    },
    'valid-parentheses': {
        title: 'Valid Parentheses',
        description: `
            <h2>Problem Description</h2>
            <p>Given a string containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.</p>
            <p>An input string is valid if:</p>
            <ul>
                <li>Open brackets must be closed by the same type of brackets.</li>
                <li>Open brackets must be closed in the correct order.</li>
            </ul>
            
            <h3>Example 1:</h3>
            <pre><code>Input: s = "()"
Output: true</code></pre>
            
            <h3>Example 2:</h3>
            <pre><code>Input: s = "()[]{}"
Output: true</code></pre>
            
            <h3>Example 3:</h3>
            <pre><code>Input: s = "(]"
Output: false</code></pre>
        `,
        starterCode: `function isValid(s) {
    // Your code here
    
}

// Test the function
console.log(isValid("()"));      // true
console.log(isValid("()[]{}"));  // true
console.log(isValid("(]"));      // false`
    },
    'max-depth': {
        title: 'Maximum Depth of Binary Tree',
        description: `
            <h2>Problem Description</h2>
            <p>Given the root of a binary tree, return its maximum depth.</p>
            <p>A binary tree's maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.</p>
            
            <h3>Example:</h3>
            <pre><code>Input: root = [3,9,20,null,null,15,7]
Output: 3</code></pre>
        `,
        starterCode: `// Definition for a binary tree node
function TreeNode(val, left, right) {
    this.val = (val===undefined ? 0 : val)
    this.left = (left===undefined ? null : left)
    this.right = (right===undefined ? null : right)
}

function maxDepth(root) {
    // Your code here
    
}

// Test the function
const root = new TreeNode(3);
root.left = new TreeNode(9);
root.right = new TreeNode(20);
root.right.left = new TreeNode(15);
root.right.right = new TreeNode(7);
console.log(maxDepth(root)); // 3`
    }
};

// Add default problems for items without definitions
const defaultProblemIds = [
    'find-duplicate', 'max-subarray', 'anagram', 'longest-substring',
    'reverse-linked-list', 'detect-cycle', 'merge-lists',
    'min-stack', 'implement-queue',
    'invert-tree', 'validate-bst',
    'dfs', 'bfs', 'number-of-islands',
    'climbing-stairs', 'coin-change'
];

defaultProblemIds.forEach(id => {
    if (!problems[id]) {
        const title = id.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        problems[id] = {
            title: title,
            description: `
                <h2>Problem Description</h2>
                <p>This is the ${title} problem. Implementation coming soon!</p>
                <p>Try writing your own solution based on the problem name.</p>
            `,
            starterCode: `function solve() {
    // Your code here
    
}

// Test the function
console.log(solve());`
        };
    }
});

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
            if (window.innerWidth < 1200) {
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

// Stack & Queue Problems

const stackQueueProblems = {
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
    'min-stack': {
        title: 'Min Stack',
        description: `
            <h2>Problem Description</h2>
            <p>This is the Min Stack problem. Implementation coming soon!</p>
            <p>Try writing your own solution based on the problem name.</p>
        `,
        starterCode: `function solve() {
    // Your code here
    
}

// Test the function
console.log(solve());`
    },
    'implement-queue': {
        title: 'Implement Queue Using Stacks',
        description: `
            <h2>Problem Description</h2>
            <p>This is the Implement Queue Using Stacks problem. Implementation coming soon!</p>
            <p>Try writing your own solution based on the problem name.</p>
        `,
        starterCode: `function solve() {
    // Your code here
    
}

// Test the function
console.log(solve());`
    }
};

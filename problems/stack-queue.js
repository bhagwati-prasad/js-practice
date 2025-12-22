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
            <p>Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.</p>
            
            <p>Implement the MinStack class:</p>
            <ul>
                <li><code>MinStack()</code> initializes the stack object.</li>
                <li><code>void push(int val)</code> pushes the element val onto the stack.</li>
                <li><code>void pop()</code> removes the element on the top of the stack.</li>
                <li><code>int top()</code> gets the top element of the stack.</li>
                <li><code>int getMin()</code> retrieves the minimum element in the stack.</li>
            </ul>
            
            <h3>Example:</h3>
            <pre><code>Input:
["MinStack","push","push","push","getMin","pop","top","getMin"]
[[],[-2],[0],[-3],[],[],[],[]]

Output:
[null,null,null,null,-3,null,0,-2]

Explanation:
MinStack minStack = new MinStack();
minStack.push(-2);
minStack.push(0);
minStack.push(-3);
minStack.getMin(); // return -3
minStack.pop();
minStack.top();    // return 0
minStack.getMin(); // return -2</code></pre>
            
            <h3>Constraints:</h3>
            <ul>
                <li>-2^31 <= val <= 2^31 - 1</li>
                <li>Methods pop, top and getMin operations will always be called on non-empty stacks</li>
                <li>At most 3 * 10^4 calls will be made to push, pop, top, and getMin</li>
            </ul>
        `,
        starterCode: `class MinStack {
    constructor() {
        // Your code here
    }
    
    push(val) {
        // Your code here
    }
    
    pop() {
        // Your code here
    }
    
    top() {
        // Your code here
    }
    
    getMin() {
        // Your code here
    }
}

// Test the function
const minStack = new MinStack();
minStack.push(-2);
minStack.push(0);
minStack.push(-3);
console.log(minStack.getMin()); // -3
minStack.pop();
console.log(minStack.top());    // 0
console.log(minStack.getMin()); // -2`
    },
    'implement-queue': {
        title: 'Implement Queue Using Stacks',
        description: `
            <h2>Problem Description</h2>
            <p>Implement a first in first out (FIFO) queue using only two stacks. The implemented queue should support all the functions of a normal queue (push, peek, pop, and empty).</p>
            
            <p>Implement the MyQueue class:</p>
            <ul>
                <li><code>void push(int x)</code> Pushes element x to the back of the queue.</li>
                <li><code>int pop()</code> Removes the element from the front of the queue and returns it.</li>
                <li><code>int peek()</code> Returns the element at the front of the queue.</li>
                <li><code>boolean empty()</code> Returns true if the queue is empty, false otherwise.</li>
            </ul>
            
            <h3>Example:</h3>
            <pre><code>Input:
["MyQueue", "push", "push", "peek", "pop", "empty"]
[[], [1], [2], [], [], []]

Output:
[null, null, null, 1, 1, false]

Explanation:
MyQueue myQueue = new MyQueue();
myQueue.push(1); // queue is: [1]
myQueue.push(2); // queue is: [1, 2]
myQueue.peek();  // return 1
myQueue.pop();   // return 1, queue is [2]
myQueue.empty(); // return false</code></pre>
            
            <h3>Constraints:</h3>
            <ul>
                <li>1 <= x <= 9</li>
                <li>At most 100 calls will be made to push, pop, peek, and empty</li>
                <li>All the calls to pop and peek are valid</li>
            </ul>
        `,
        starterCode: `class MyQueue {
    constructor() {
        // Your code here
    }
    
    push(x) {
        // Your code here
    }
    
    pop() {
        // Your code here
    }
    
    peek() {
        // Your code here
    }
    
    empty() {
        // Your code here
    }
}

// Test the function
const myQueue = new MyQueue();
myQueue.push(1);
myQueue.push(2);
console.log(myQueue.peek());  // 1
console.log(myQueue.pop());   // 1
console.log(myQueue.empty()); // false`
    }
};

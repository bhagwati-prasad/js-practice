// Tree Problems

const treeProblems = {
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
    },
    'invert-tree': {
        title: 'Invert Binary Tree',
        description: `
            <h2>Problem Description</h2>
            <p>Given the <code>root</code> of a binary tree, invert the tree, and return its root.</p>
            
            <h3>Example 1:</h3>
            <pre><code>Input: root = [4,2,7,1,3,6,9]
Output: [4,7,2,9,6,3,1]</code></pre>
            
            <h3>Example 2:</h3>
            <pre><code>Input: root = [2,1,3]
Output: [2,3,1]</code></pre>
            
            <h3>Example 3:</h3>
            <pre><code>Input: root = []
Output: []</code></pre>
            
            <h3>Constraints:</h3>
            <ul>
                <li>The number of nodes in the tree is in the range [0, 100]</li>
                <li>-100 <= Node.val <= 100</li>
            </ul>
        `,
        starterCode: `// Definition for a binary tree node
function TreeNode(val, left, right) {
    this.val = (val===undefined ? 0 : val)
    this.left = (left===undefined ? null : left)
    this.right = (right===undefined ? null : right)
}

function invertTree(root) {
    // Your code here
    
}

// Helper function to print tree level order
function printTree(root) {
    if (!root) return [];
    let result = [];
    let queue = [root];
    while (queue.length > 0) {
        let node = queue.shift();
        result.push(node.val);
        if (node.left) queue.push(node.left);
        if (node.right) queue.push(node.right);
    }
    return result;
}

// Test the function
const root = new TreeNode(4);
root.left = new TreeNode(2);
root.right = new TreeNode(7);
root.left.left = new TreeNode(1);
root.left.right = new TreeNode(3);
root.right.left = new TreeNode(6);
root.right.right = new TreeNode(9);
console.log(printTree(invertTree(root)));`
    },
    'validate-bst': {
        title: 'Validate Binary Search Tree',
        description: `
            <h2>Problem Description</h2>
            <p>Given the <code>root</code> of a binary tree, determine if it is a valid binary search tree (BST).</p>
            
            <p>A valid BST is defined as follows:</p>
            <ul>
                <li>The left subtree of a node contains only nodes with keys less than the node's key.</li>
                <li>The right subtree of a node contains only nodes with keys greater than the node's key.</li>
                <li>Both the left and right subtrees must also be binary search trees.</li>
            </ul>
            
            <h3>Example 1:</h3>
            <pre><code>Input: root = [2,1,3]
Output: true</code></pre>
            
            <h3>Example 2:</h3>
            <pre><code>Input: root = [5,1,4,null,null,3,6]
Output: false
Explanation: The root node's value is 5 but its right child's value is 4.</code></pre>
            
            <h3>Constraints:</h3>
            <ul>
                <li>The number of nodes in the tree is in the range [1, 10^4]</li>
                <li>-2^31 <= Node.val <= 2^31 - 1</li>
            </ul>
        `,
        starterCode: `// Definition for a binary tree node
function TreeNode(val, left, right) {
    this.val = (val===undefined ? 0 : val)
    this.left = (left===undefined ? null : left)
    this.right = (right===undefined ? null : right)
}

function isValidBST(root) {
    // Your code here
    
}

// Test the function
const root1 = new TreeNode(2);
root1.left = new TreeNode(1);
root1.right = new TreeNode(3);
console.log(isValidBST(root1)); // true

const root2 = new TreeNode(5);
root2.left = new TreeNode(1);
root2.right = new TreeNode(4);
root2.right.left = new TreeNode(3);
root2.right.right = new TreeNode(6);
console.log(isValidBST(root2)); // false`
    }
};

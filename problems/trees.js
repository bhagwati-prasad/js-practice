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
            <p>This is the Invert Binary Tree problem. Implementation coming soon!</p>
            <p>Try writing your own solution based on the problem name.</p>
        `,
        starterCode: `function solve() {
    // Your code here
    
}

// Test the function
console.log(solve());`
    },
    'validate-bst': {
        title: 'Validate Binary Search Tree',
        description: `
            <h2>Problem Description</h2>
            <p>This is the Validate Binary Search Tree problem. Implementation coming soon!</p>
            <p>Try writing your own solution based on the problem name.</p>
        `,
        starterCode: `function solve() {
    // Your code here
    
}

// Test the function
console.log(solve());`
    }
};

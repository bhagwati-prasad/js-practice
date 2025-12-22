// Array Problems

const arrayProblems = {
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
    'find-duplicate': {
        title: 'Find Duplicate',
        description: `
            <h2>Problem Description</h2>
            <p>This is the Find Duplicate problem. Implementation coming soon!</p>
            <p>Try writing your own solution based on the problem name.</p>
        `,
        starterCode: `function solve() {
    // Your code here
    
}

// Test the function
console.log(solve());`
    },
    'max-subarray': {
        title: 'Max Subarray',
        description: `
            <h2>Problem Description</h2>
            <p>This is the Max Subarray problem. Implementation coming soon!</p>
            <p>Try writing your own solution based on the problem name.</p>
        `,
        starterCode: `function solve() {
    // Your code here
    
}

// Test the function
console.log(solve());`
    }
};

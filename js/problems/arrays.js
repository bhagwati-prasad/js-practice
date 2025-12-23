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
            <p>Given an array of integers <code>nums</code> containing <code>n + 1</code> integers where each integer is in the range <code>[1, n]</code> inclusive, find the duplicate number.</p>
            <p>There is only one repeated number in <code>nums</code>, return this repeated number.</p>
            
            <h3>Example 1:</h3>
            <pre><code>Input: nums = [1,3,4,2,2]
Output: 2</code></pre>
            
            <h3>Example 2:</h3>
            <pre><code>Input: nums = [3,1,3,4,2]
Output: 3</code></pre>
            
            <h3>Constraints:</h3>
            <ul>
                <li>1 <= n <= 10^5</li>
                <li>nums.length == n + 1</li>
                <li>1 <= nums[i] <= n</li>
                <li>All the integers in nums appear only once except for precisely one integer which appears two or more times</li>
            </ul>
        `,
        starterCode: `function findDuplicate(nums) {
    // Your code here
    
}

// Test the function
console.log(findDuplicate([1,3,4,2,2])); // 2
console.log(findDuplicate([3,1,3,4,2])); // 3`
    },
    'max-subarray': {
        title: 'Max Subarray',
        description: `
            <h2>Problem Description</h2>
            <p>Given an integer array <code>nums</code>, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.</p>
            <p>This is also known as Kadane's Algorithm problem.</p>
            
            <h3>Example 1:</h3>
            <pre><code>Input: nums = [-2,1,-3,4,-1,2,1,-5,4]
Output: 6
Explanation: [4,-1,2,1] has the largest sum = 6</code></pre>
            
            <h3>Example 2:</h3>
            <pre><code>Input: nums = [1]
Output: 1</code></pre>
            
            <h3>Example 3:</h3>
            <pre><code>Input: nums = [5,4,-1,7,8]
Output: 23</code></pre>
            
            <h3>Constraints:</h3>
            <ul>
                <li>1 <= nums.length <= 10^5</li>
                <li>-10^4 <= nums[i] <= 10^4</li>
            </ul>
        `,
        starterCode: `function maxSubArray(nums) {
    // Your code here
    
}

// Test the function
console.log(maxSubArray([-2,1,-3,4,-1,2,1,-5,4])); // 6
console.log(maxSubArray([1])); // 1
console.log(maxSubArray([5,4,-1,7,8])); // 23`
    }
};

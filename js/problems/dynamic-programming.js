// Dynamic Programming Problems

const dynamicProgrammingProblems = {
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
    'climbing-stairs': {
        title: 'Climbing Stairs',
        description: `
            <h2>Problem Description</h2>
            <p>You are climbing a staircase. It takes <code>n</code> steps to reach the top.</p>
            <p>Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?</p>
            
            <h3>Example 1:</h3>
            <pre><code>Input: n = 2
Output: 2
Explanation: There are two ways to climb to the top.
1. 1 step + 1 step
2. 2 steps</code></pre>
            
            <h3>Example 2:</h3>
            <pre><code>Input: n = 3
Output: 3
Explanation: There are three ways to climb to the top.
1. 1 step + 1 step + 1 step
2. 1 step + 2 steps
3. 2 steps + 1 step</code></pre>
            
            <h3>Constraints:</h3>
            <ul>
                <li>1 <= n <= 45</li>
            </ul>
        `,
        starterCode: `function climbStairs(n) {
    // Your code here
    
}

// Test the function
console.log(climbStairs(2));  // 2
console.log(climbStairs(3));  // 3
console.log(climbStairs(5));  // 8`
    },
    'coin-change': {
        title: 'Coin Change',
        description: `
            <h2>Problem Description</h2>
            <p>You are given an integer array <code>coins</code> representing coins of different denominations and an integer <code>amount</code> representing a total amount of money.</p>
            <p>Return the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return -1.</p>
            <p>You may assume that you have an infinite number of each kind of coin.</p>
            
            <h3>Example 1:</h3>
            <pre><code>Input: coins = [1,2,5], amount = 11
Output: 3
Explanation: 11 = 5 + 5 + 1</code></pre>
            
            <h3>Example 2:</h3>
            <pre><code>Input: coins = [2], amount = 3
Output: -1</code></pre>
            
            <h3>Example 3:</h3>
            <pre><code>Input: coins = [1], amount = 0
Output: 0</code></pre>
            
            <h3>Constraints:</h3>
            <ul>
                <li>1 <= coins.length <= 12</li>
                <li>1 <= coins[i] <= 2^31 - 1</li>
                <li>0 <= amount <= 10^4</li>
            </ul>
        `,
        starterCode: `function coinChange(coins, amount) {
    // Your code here
    
}

// Test the function
console.log(coinChange([1,2,5], 11)); // 3
console.log(coinChange([2], 3));      // -1
console.log(coinChange([1], 0));      // 0`
    }
};

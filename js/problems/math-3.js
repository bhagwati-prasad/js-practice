// Advanced Engineering Math Problems

const engineeringMathProblems = {
    'next-permutation': {
        title: 'Next Permutation',
        description: `
            <h2>Problem Description</h2>
            <p>Implement the "next permutation" algorithm, which rearranges numbers into the lexicographically next greater permutation of numbers.</p>
            <p>If such an arrangement is not possible, it must rearrange it as the lowest possible order (i.e., sorted in ascending order).</p>
            <p>This is a classic problem for understanding lexicographical ordering logic.</p>
            
            <h3>Example 1:</h3>
            <pre><code>Input: nums = [1,2,3]
Output: [1,3,2]</code></pre>

            <h3>Example 2:</h3>
            <pre><code>Input: nums = [3,2,1]
Output: [1,2,3]</code></pre>
        `,
        starterCode: `function nextPermutation(nums) {
    // Your code here
    
}

const arr = [1, 2, 3];
nextPermutation(arr);
console.log(arr);`
    },
    'rotate-image': {
        title: 'Rotate Image (Matrix)',
        description: `
            <h2>Problem Description</h2>
            <p>You are given an <code>n x n</code> 2D matrix representing an image. Rotate the image by 90 degrees (clockwise).</p>
            <p>You have to rotate the image in-place, which means you have to modify the input 2D matrix directly.</p>
            <p>This involves matrix transposition followed by reversing rows.</p>
            
            <h3>Example:</h3>
            <pre><code>Input: matrix = [[1,2,3],[4,5,6],[7,8,9]]
Output: [[7,4,1],[8,5,2],[9,6,3]]</code></pre>
        `,
        starterCode: `function rotate(matrix) {
    // Your code here
    
}

const mat = [[1,2,3],[4,5,6],[7,8,9]];
rotate(mat);
console.log(mat);`
    },
    'matrix-multiplication': {
        title: 'Matrix Multiplication',
        description: `
            <h2>Problem Description</h2>
            <p>Write a function to multiply two matrices <code>A</code> (m x n) and <code>B</code> (n x p). Return the resulting matrix of size (m x p).</p>
            <p>The element at [i][j] is the dot product of row i of A and column j of B.</p>
            
            <h3>Example:</h3>
            <pre><code>Input: A = [[1,2],[3,4]], B = [[2,0],[1,2]]
Output: [[4,4],[10,8]]
Explanation: 
[1*2 + 2*1, 1*0 + 2*2]
[3*2 + 4*1, 3*0 + 4*2]</code></pre>
        `,
        starterCode: `function multiplyMatrices(A, B) {
    // Your code here
    
}

console.log(multiplyMatrices([[1,2],[3,4]], [[2,0],[1,2]]));`
    },
    'shuffle-array': {
        title: 'Fisher-Yates Shuffle',
        description: `
            <h2>Problem Description</h2>
            <p>Implement an algorithm to shuffle an array such that every permutation is equally likely.</p>
            <p>This is known as the Fisher-Yates (or Knuth) Shuffle. It is critical for randomized algorithms.</p>
            
            <h3>Example:</h3>
            <pre><code>Input: [1, 2, 3]
Output: [2, 3, 1] (One of 6 possible outcomes)</code></pre>
        `,
        starterCode: `function shuffle(nums) {
    // Your code here
    
}

console.log(shuffle([1, 2, 3, 4, 5]));`
    },
    'max-points-line': {
        title: 'Max Points on a Line',
        description: `
            <h2>Problem Description</h2>
            <p>Given an array of points where <code>points[i] = [xi, yi]</code>, represents a point on the X-Y plane, return the maximum number of points that lie on the same straight line.</p>
            <p>This requires calculating slopes and handling vertical lines and floating point precision.</p>
            
            <h3>Example:</h3>
            <pre><code>Input: points = [[1,1],[2,2],[3,3]]
Output: 3</code></pre>
        `,
        starterCode: `function maxPoints(points) {
    // Your code here
    
}

console.log(maxPoints([[1,1],[2,2],[3,3]]));`
    },
    'point-in-polygon': {
        title: 'Point Inside Polygon',
        description: `
            <h2>Problem Description</h2>
            <p>Determine if a given point <code>(x, y)</code> lies inside a polygon defined by a list of vertices.</p>
            <p>A common method is the Ray Casting algorithm: count intersections of a ray starting from the point and going to infinity.</p>
            
            <h3>Example:</h3>
            <pre><code>Input: point = [3, 3], polygon = [[0,0], [0,10], [10,10], [10,0]]
Output: true</code></pre>
        `,
        starterCode: `function isPointInPolygon(point, polygon) {
    // Your code here
    
}

console.log(isPointInPolygon([3,3], [[0,0],[0,10],[10,10],[10,0]]));`
    },
    'gray-code': {
        title: 'Gray Code',
        description: `
            <h2>Problem Description</h2>
            <p>An n-bit gray code sequence is a sequence of 2^n integers where:</p>
            <ul>
                <li>Every integer is in the inclusive range [0, 2^n - 1]</li>
                <li>The first integer is 0</li>
                <li>An integer differs from the previous integer by exactly one bit</li>
            </ul>
            <p>Given n, return any valid n-bit gray code sequence.</p>
            
            <h3>Example:</h3>
            <pre><code>Input: n = 2
Output: [0,1,3,2]
Binary: 00, 01, 11, 10</code></pre>
        `,
        starterCode: `function grayCode(n) {
    // Your code here
    
}

console.log(grayCode(2));`
    },
    'fraction-to-decimal': {
        title: 'Fraction to Recurring Decimal',
        description: `
            <h2>Problem Description</h2>
            <p>Given two integers representing the numerator and denominator of a fraction, return the fraction in string format.</p>
            <p>If the fractional part is repeating, enclose the repeating part in parentheses.</p>
            
            <h3>Example 1:</h3>
            <pre><code>Input: numerator = 1, denominator = 2
Output: "0.5"</code></pre>

            <h3>Example 2:</h3>
            <pre><code>Input: numerator = 2, denominator = 3
Output: "0.(6)"</code></pre>
        `,
        starterCode: `function fractionToDecimal(numerator, denominator) {
    // Your code here
    
}

console.log(fractionToDecimal(4, 333));`
    },
    'reservoir-sampling': {
        title: 'Reservoir Sampling',
        description: `
            <h2>Problem Description</h2>
            <p>Given a stream of numbers of unknown length, randomly select <code>k</code> items from it with uniform probability.</p>
            <p>You cannot store all numbers in memory.</p>
            
            <h3>Example:</h3>
            <pre><code>Input: Stream [1, 2, 3, 4, 5], k=1
Output: 3 (Each number had 20% chance)</code></pre>
        `,
        starterCode: `function pickRandom(stream, k) {
    // Your code here
    
}

// Simulate stream
const stream = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
console.log(pickRandom(stream, 1));`
    },
    'basic-calculator': {
        title: 'Basic Calculator',
        description: `
            <h2>Problem Description</h2>
            <p>Implement a basic calculator to evaluate a simple expression string.</p>
            <p>The expression string contains only non-negative integers, '+', '-', '*', '/' operators and empty spaces.</p>
            <p>This tests logic regarding Operator Precedence.</p>
            
            <h3>Example:</h3>
            <pre><code>Input: s = "3+2*2"
Output: 7</code></pre>
        `,
        starterCode: `function calculate(s) {
    // Your code here
    
}

console.log(calculate("3+2*2"));`
    },
    'sqrt-newton': {
        title: 'Sqrt(x) using Newton Method',
        description: `
            <h2>Problem Description</h2>
            <p>Compute the square root of a number <code>n</code> using Newton's Method (Newton-Raphson).</p>
            <p>Iterative formula: x_new = 0.5 * (x_old + n / x_old).</p>
            
            <h3>Example:</h3>
            <pre><code>Input: n = 16
Output: 4</code></pre>
        `,
        starterCode: `function mySqrtNewton(n) {
    // Your code here
    
}

console.log(mySqrtNewton(25));`
    },
    'extended-gcd': {
        title: 'Extended Euclidean Algorithm',
        description: `
            <h2>Problem Description</h2>
            <p>The Extended Euclidean Algorithm finds integers x and y such that <code>ax + by = gcd(a, b)</code>.</p>
            <p>This is fundamental in finding Modular Inverses for cryptography.</p>
            
            <h3>Example:</h3>
            <pre><code>Input: a = 35, b = 15
Output: { gcd: 5, x: 1, y: -2 }
Explanation: 35(1) + 15(-2) = 35 - 30 = 5</code></pre>
        `,
        starterCode: `function extendedGCD(a, b) {
    // Your code here
    
}

console.log(extendedGCD(35, 15));`
    },
    'count-primes-set-bits': {
        title: 'Prime Number of Set Bits',
        description: `
            <h2>Problem Description</h2>
            <p>Given two integers L and R, find the count of numbers in the range [L, R] (inclusive) having a prime number of set bits in their binary representation.</p>
            
            <h3>Example:</h3>
            <pre><code>Input: L = 6, R = 10
Output: 4
Explanation:
6 -> 110 (2 bits, prime)
7 -> 111 (3 bits, prime)
9 -> 1001 (2 bits, prime)
10 -> 1010 (2 bits, prime)</code></pre>
        `,
        starterCode: `function countPrimeSetBits(left, right) {
    // Your code here
    
}

console.log(countPrimeSetBits(6, 10));`
    },
    'super-egg-drop': {
        title: 'Super Egg Drop (Math/DP)',
        description: `
            <h2>Problem Description</h2>
            <p>You have <code>k</code> eggs and a building with <code>n</code> floors. Determine the minimum number of moves needed to find the exact floor from which an egg breaks.</p>
            <p>This is a famous mathematical optimization problem involving Binomial Coefficients.</p>
            
            <h3>Example:</h3>
            <pre><code>Input: k = 2, n = 6
Output: 3</code></pre>
        `,
        starterCode: `function superEggDrop(k, n) {
    // Your code here
    
}

console.log(superEggDrop(2, 6));`
    },
    'number-of-islands': {
        title: 'Number of Islands (Grid Topology)',
        description: `
            <h2>Problem Description</h2>
            <p>Given an m x n 2D binary grid grid which represents a map of '1's (land) and '0's (water), return the number of islands.</p>
            <p>This applies graph theory (connected components) to a matrix.</p>
            
            <h3>Example:</h3>
            <pre><code>Input: grid = [
  ["1","1","0","0","0"],
  ["1","1","0","0","0"],
  ["0","0","1","0","0"],
  ["0","0","0","1","1"]
]
Output: 3</code></pre>
        `,
        starterCode: `function numIslands(grid) {
    // Your code here
    
}

console.log(numIslands([
  ["1","1","0","0","0"],
  ["1","1","0","0","0"],
  ["0","0","1","0","0"],
  ["0","0","0","1","1"]
]));`
    }
};

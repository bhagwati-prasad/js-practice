// Additional Math Algorithm Problems

const moreMathProblems = {
    'sieve-eratosthenes': {
        title: 'Sieve of Eratosthenes',
        description: `
            <h2>Problem Description</h2>
            <p>Given a number <code>n</code>, print all prime numbers smaller than or equal to <code>n</code>. Use the Sieve of Eratosthenes algorithm for efficiency.</p>
            
            <h3>Example:</h3>
            <pre><code>Input: n = 30
Output: [2, 3, 5, 7, 11, 13, 17, 19, 23, 29]</code></pre>

            <h3>Constraints:</h3>
            <ul>
                <li>0 <= n <= 10^5</li>
            </ul>
        `,
        starterCode: `function sieveOfEratosthenes(n) {
    // Your code here
    
}

console.log(sieveOfEratosthenes(30));`
    },
    'clock-angle': {
        title: 'Angle Between Clock Hands',
        description: `
            <h2>Problem Description</h2>
            <p>Calculate the smaller angle (in degrees) formed between the hour hand and the minute hand of a clock at a given time.</p>
            
            <h3>Example:</h3>
            <pre><code>Input: hour = 12, minutes = 30
Output: 165
Explanation: The hour hand is halfway between 12 and 1. The minute hand is at 6. Angle is |15 - 180| = 165.</code></pre>
        `,
        starterCode: `function clockAngle(hour, minutes) {
    // Your code here
    
}

console.log(clockAngle(12, 30));`
    },
    'excel-column-number': {
        title: 'Excel Sheet Column Number',
        description: `
            <h2>Problem Description</h2>
            <p>Given a column title as it appears in an Excel sheet, return its corresponding column number.</p>
            <p>A -> 1, B -> 2, ..., Z -> 26, AA -> 27, AB -> 28...</p>
            
            <h3>Example:</h3>
            <pre><code>Input: columnTitle = "AB"
Output: 28</code></pre>
        `,
        starterCode: `function titleToNumber(columnTitle) {
    // Your code here
    
}

console.log(titleToNumber("AB"));`
    },
    'amicable-numbers': {
        title: 'Amicable Numbers',
        description: `
            <h2>Problem Description</h2>
            <p>Two numbers are said to be amicable if the sum of the proper divisors of one number equals the other number (and they are not equal).</p>
            <p>Check if two given numbers <code>a</code> and <code>b</code> are amicable.</p>
            
            <h3>Example:</h3>
            <pre><code>Input: a = 220, b = 284
Output: true
Explanation: 
Divisors of 220 sum to 284.
Divisors of 284 sum to 220.</code></pre>
        `,
        starterCode: `function areAmicable(a, b) {
    // Your code here
    
}

console.log(areAmicable(220, 284));`
    },
    'shoelace-formula': {
        title: 'Area of Polygon (Shoelace)',
        description: `
            <h2>Problem Description</h2>
            <p>Calculate the area of a polygon given the coordinates of its vertices in order.</p>
            <p>Input is an array of [x, y] coordinates.</p>
            
            <h3>Example:</h3>
            <pre><code>Input: vertices = [[0,0], [4,0], [4,3], [0,3]] (A rectangle)
Output: 12</code></pre>
        `,
        starterCode: `function polygonArea(vertices) {
    // Your code here
    
}

console.log(polygonArea([[0,0], [4,0], [4,3], [0,3]]));`
    },
    'rectangle-overlap': {
        title: 'Rectangle Overlap',
        description: `
            <h2>Problem Description</h2>
            <p>Determine if two axis-aligned rectangles overlap. A rectangle is represented by [x1, y1, x2, y2], where (x1, y1) is bottom-left and (x2, y2) is top-right.</p>
            
            <h3>Example:</h3>
            <pre><code>Input: rec1 = [0,0,2,2], rec2 = [1,1,3,3]
Output: true</code></pre>
        `,
        starterCode: `function isRectangleOverlap(rec1, rec2) {
    // Your code here
    
}

console.log(isRectangleOverlap([0,0,2,2], [1,1,3,3]));`
    },
    'modular-exponentiation': {
        title: 'Modular Exponentiation',
        description: `
            <h2>Problem Description</h2>
            <p>Calculate <code>(base^exponent) % modulus</code> efficiently. This is useful for dealing with large numbers where direct calculation would overflow.</p>
            
            <h3>Example:</h3>
            <pre><code>Input: base = 2, exponent = 10, modulus = 1000
Output: 24
Explanation: 2^10 = 1024. 1024 % 1000 = 24.</code></pre>
        `,
        starterCode: `function modPow(base, exponent, modulus) {
    // Your code here
    
}

console.log(modPow(2, 10, 1000));`
    },
    'hamming-distance': {
        title: 'Hamming Distance',
        description: `
            <h2>Problem Description</h2>
            <p>The Hamming distance between two integers is the number of positions at which the corresponding bits are different.</p>
            
            <h3>Example:</h3>
            <pre><code>Input: x = 1, y = 4
Output: 2
Explanation:
1   (0 0 0 1)
4   (0 1 0 0)
       ^   ^  (2 differences)</code></pre>
        `,
        starterCode: `function hammingDistance(x, y) {
    // Your code here
    
}

console.log(hammingDistance(1, 4));`
    },
    'magic-square': {
        title: 'Check Magic Square',
        description: `
            <h2>Problem Description</h2>
            <p>A magic square is a square matrix grid where the sum of numbers in each row, each column, and both main diagonals is the same.</p>
            
            <h3>Example:</h3>
            <pre><code>Input: grid = [[2,7,6],[9,5,1],[4,3,8]]
Output: true
Explanation: All sums equal 15.</code></pre>
        `,
        starterCode: `function isMagicSquare(grid) {
    // Your code here
    
}

console.log(isMagicSquare([[2,7,6],[9,5,1],[4,3,8]]));`
    },
    'base-7': {
        title: 'Base 7 Conversion',
        description: `
            <h2>Problem Description</h2>
            <p>Given an integer <code>num</code>, return a string of its base 7 representation.</p>
            
            <h3>Example:</h3>
            <pre><code>Input: num = 100
Output: "202"
Explanation: 2 * 49 + 0 * 7 + 2 * 1 = 100</code></pre>
        `,
        starterCode: `function convertToBase7(num) {
    // Your code here
    
}

console.log(convertToBase7(100));`
    },
    'kaprekar-constant': {
        title: 'Kaprekar Constant (6174)',
        description: `
            <h2>Problem Description</h2>
            <p>Take any 4-digit number using at least two different digits. Order digits desc and asc, subtract them. Repeat. It always reaches 6174. Return steps to reach it.</p>
            
            <h3>Example:</h3>
            <pre><code>Input: num = 1234
Output: 3
Explanation:
3210 (implied 0) - 0123 = 3087
8730 - 0378 = 8352
8532 - 2358 = 6174</code></pre>
        `,
        starterCode: `function kaprekarSteps(num) {
    // Your code here
    
}

console.log(kaprekarSteps(1234));`
    },
    'josephus-problem': {
        title: 'Josephus Problem',
        description: `
            <h2>Problem Description</h2>
            <p>There are n people standing in a circle. Every k-th person is eliminated until one remains. Find the position of the survivor.</p>
            
            <h3>Example:</h3>
            <pre><code>Input: n = 5, k = 2
Output: 3
Explanation: The order of elimination is 2, 4, 1, 5. 3 survives.</code></pre>
        `,
        starterCode: `function josephus(n, k) {
    // Your code here
    
}

console.log(josephus(5, 2));`
    },
    'single-number': {
        title: 'Single Number',
        description: `
            <h2>Problem Description</h2>
            <p>Given a non-empty array of integers where every element appears twice except for one. Find that single one.</p>
            <p>Use bitwise XOR for O(n) time and O(1) space.</p>
            
            <h3>Example:</h3>
            <pre><code>Input: nums = [4,1,2,1,2]
Output: 4</code></pre>
        `,
        starterCode: `function singleNumber(nums) {
    // Your code here
    
}

console.log(singleNumber([4,1,2,1,2]));`
    },
    'integer-break': {
        title: 'Integer Break',
        description: `
            <h2>Problem Description</h2>
            <p>Given an integer n, break it into the sum of k positive integers, where k >= 2, and maximize the product of those integers.</p>
            
            <h3>Example:</h3>
            <pre><code>Input: n = 10
Output: 36
Explanation: 10 = 3 + 3 + 4, 3 * 3 * 4 = 36.</code></pre>
        `,
        starterCode: `function integerBreak(n) {
    // Your code here
    
}

console.log(integerBreak(10));`
    },
    'complex-number-mult': {
        title: 'Complex Number Multiplication',
        description: `
            <h2>Problem Description</h2>
            <p>Given two strings representing complex numbers in the form "a+bi", return a string representing their product.</p>
            
            <h3>Example:</h3>
            <pre><code>Input: num1 = "1+1i", num2 = "1+1i"
Output: "0+2i"
Explanation: (1 + i) * (1 + i) = 1 + i2 + 2i = 2i (0+2i)</code></pre>
        `,
        starterCode: `function complexNumberMultiply(num1, num2) {
    // Your code here
    
}

console.log(complexNumberMultiply("1+1i", "1+1i"));`
    }
};

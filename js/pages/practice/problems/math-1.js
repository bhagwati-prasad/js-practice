// Math Algorithm Problems Dataset

const mathProblems = {
    'fibonacci-number': {
        title: 'Fibonacci Number',
        description: `
            <h2>Problem Description</h2>
            <p>The Fibonacci numbers, commonly denoted F(n) form a sequence, called the Fibonacci sequence, such that each number is the sum of the two preceding ones, starting from 0 and 1.</p>
            <p>Given <code>n</code>, calculate <code>F(n)</code>.</p>
            
            <h3>Example 1:</h3>
            <pre><code>Input: n = 2
Output: 1
Explanation: F(2) = F(1) + F(0) = 1 + 0 = 1.</code></pre>

            <h3>Example 2:</h3>
            <pre><code>Input: n = 4
Output: 3
Explanation: F(4) = F(3) + F(2) = 2 + 1 = 3.</code></pre>
            
            <h3>Constraints:</h3>
            <ul>
                <li>0 <= n <= 30</li>
            </ul>
        `,
        starterCode: `function fib(n) {
    // Your code here
    
}

console.log(fib(4));`
    },
    'check-prime': {
        title: 'Check Prime',
        description: `
            <h2>Problem Description</h2>
            <p>Write a function to determine if a given number <code>n</code> is a prime number.</p>
            <p>A prime number is a number greater than 1 that has no positive divisors other than 1 and itself.</p>
            
            <h3>Example 1:</h3>
            <pre><code>Input: n = 7
Output: true</code></pre>

            <h3>Example 2:</h3>
            <pre><code>Input: n = 4
Output: false</code></pre>
            
            <h3>Constraints:</h3>
            <ul>
                <li>0 <= n <= 10^9</li>
            </ul>
        `,
        starterCode: `function isPrime(n) {
    // Your code here
    
}

console.log(isPrime(7));`
    },
    'factorial': {
        title: 'Factorial',
        description: `
            <h2>Problem Description</h2>
            <p>Write a function to calculate the factorial of a non-negative integer <code>n</code>.</p>
            <p>The factorial of n is the product of all positive integers less than or equal to n.</p>
            
            <h3>Example:</h3>
            <pre><code>Input: n = 5
Output: 120
Explanation: 5 * 4 * 3 * 2 * 1 = 120</code></pre>
            
            <h3>Constraints:</h3>
            <ul>
                <li>0 <= n <= 20</li>
            </ul>
        `,
        starterCode: `function factorial(n) {
    // Your code here
    
}

console.log(factorial(5));`
    },
    'gcd': {
        title: 'Greatest Common Divisor',
        description: `
            <h2>Problem Description</h2>
            <p>Find the Greatest Common Divisor (GCD) of two numbers.</p>
            
            <h3>Example:</h3>
            <pre><code>Input: a = 48, b = 18
Output: 6</code></pre>
            
            <h3>Constraints:</h3>
            <ul>
                <li>1 <= a, b <= 10^9</li>
            </ul>
        `,
        starterCode: `function gcd(a, b) {
    // Your code here
    
}

console.log(gcd(48, 18));`
    },
    'lcm': {
        title: 'Least Common Multiple',
        description: `
            <h2>Problem Description</h2>
            <p>Find the Least Common Multiple (LCM) of two numbers.</p>
            
            <h3>Example:</h3>
            <pre><code>Input: a = 4, b = 6
Output: 12</code></pre>
            
            <h3>Constraints:</h3>
            <ul>
                <li>1 <= a, b <= 1000</li>
            </ul>
        `,
        starterCode: `function lcm(a, b) {
    // Your code here
    
}

console.log(lcm(4, 6));`
    },
    'palindrome-number': {
        title: 'Palindrome Number',
        description: `
            <h2>Problem Description</h2>
            <p>Determine whether an integer is a palindrome. An integer is a palindrome when it reads the same backward as forward.</p>
            
            <h3>Example 1:</h3>
            <pre><code>Input: x = 121
Output: true</code></pre>
            
            <h3>Example 2:</h3>
            <pre><code>Input: x = -121
Output: false
Explanation: Reads 121- from left to right.</code></pre>
            
            <h3>Constraints:</h3>
            <ul>
                <li>-2^31 <= x <= 2^31 - 1</li>
            </ul>
        `,
        starterCode: `function isPalindrome(x) {
    // Your code here
    
}

console.log(isPalindrome(121));`
    },
    'armstrong-number': {
        title: 'Armstrong Number',
        description: `
            <h2>Problem Description</h2>
            <p>Check if a number is an Armstrong number (or Narcissistic number). A number is an Armstrong number if the sum of its own digits each raised to the power of the number of digits equals the number itself.</p>
            
            <h3>Example:</h3>
            <pre><code>Input: n = 153
Output: true
Explanation: 1^3 + 5^3 + 3^3 = 1 + 125 + 27 = 153</code></pre>
            
            <h3>Constraints:</h3>
            <ul>
                <li>0 <= n <= 10^8</li>
            </ul>
        `,
        starterCode: `function isArmstrong(n) {
    // Your code here
    
}

console.log(isArmstrong(153));`
    },
    'sum-digits': {
        title: 'Sum of Digits',
        description: `
            <h2>Problem Description</h2>
            <p>Calculate the sum of digits of a given non-negative integer.</p>
            
            <h3>Example:</h3>
            <pre><code>Input: n = 1234
Output: 10
Explanation: 1 + 2 + 3 + 4 = 10</code></pre>
            
            <h3>Constraints:</h3>
            <ul>
                <li>0 <= n <= 10^9</li>
            </ul>
        `,
        starterCode: `function sumDigits(n) {
    // Your code here
    
}

console.log(sumDigits(1234));`
    },
    'reverse-integer': {
        title: 'Reverse Integer',
        description: `
            <h2>Problem Description</h2>
            <p>Given a signed 32-bit integer <code>x</code>, return <code>x</code> with its digits reversed. If reversing <code>x</code> causes the value to go outside the signed 32-bit integer range, then return 0.</p>
            
            <h3>Example:</h3>
            <pre><code>Input: x = 123
Output: 321</code></pre>
            
            <h3>Constraints:</h3>
            <ul>
                <li>-2^31 <= x <= 2^31 - 1</li>
            </ul>
        `,
        starterCode: `function reverseInteger(x) {
    // Your code here
    
}

console.log(reverseInteger(-123));`
    },
    'power-of-two': {
        title: 'Power of Two',
        description: `
            <h2>Problem Description</h2>
            <p>Given an integer <code>n</code>, return true if it is a power of two. Otherwise, return false.</p>
            
            <h3>Example:</h3>
            <pre><code>Input: n = 16
Output: true</code></pre>
            
            <h3>Constraints:</h3>
            <ul>
                <li>-2^31 <= n <= 2^31 - 1</li>
            </ul>
        `,
        starterCode: `function isPowerOfTwo(n) {
    // Your code here
    
}

console.log(isPowerOfTwo(16));`
    },
    'count-primes': {
        title: 'Count Primes',
        description: `
            <h2>Problem Description</h2>
            <p>Count the number of prime numbers less than a non-negative number, <code>n</code>.</p>
            
            <h3>Example:</h3>
            <pre><code>Input: n = 10
Output: 4
Explanation: There are 4 prime numbers less than 10, they are 2, 3, 5, 7.</code></pre>
            
            <h3>Constraints:</h3>
            <ul>
                <li>0 <= n <= 5 * 10^6</li>
            </ul>
        `,
        starterCode: `function countPrimes(n) {
    // Your code here
    
}

console.log(countPrimes(10));`
    },
    'prime-factors': {
        title: 'Prime Factors',
        description: `
            <h2>Problem Description</h2>
            <p>Return an array containing all prime factors of a given number <code>n</code>.</p>
            
            <h3>Example:</h3>
            <pre><code>Input: n = 12
Output: [2, 2, 3]</code></pre>
            
            <h3>Constraints:</h3>
            <ul>
                <li>2 <= n <= 10^6</li>
            </ul>
        `,
        starterCode: `function primeFactors(n) {
    // Your code here
    
}

console.log(primeFactors(12));`
    },
    'valid-triangle': {
        title: 'Valid Triangle',
        description: `
            <h2>Problem Description</h2>
            <p>Given three side lengths, determine if they can form a valid triangle.</p>
            <p>A triangle is valid if sum of any two sides is greater than the third side.</p>
            
            <h3>Example:</h3>
            <pre><code>Input: a = 3, b = 4, c = 5
Output: true</code></pre>
            
            <h3>Constraints:</h3>
            <ul>
                <li>a, b, c > 0</li>
            </ul>
        `,
        starterCode: `function isValidTriangle(a, b, c) {
    // Your code here
    
}

console.log(isValidTriangle(3, 4, 5));`
    },
    'area-circle': {
        title: 'Area of Circle',
        description: `
            <h2>Problem Description</h2>
            <p>Calculate the area of a circle given its radius <code>r</code>.</p>
            
            <h3>Example:</h3>
            <pre><code>Input: r = 3
Output: 28.274333882308138</code></pre>
            
            <h3>Constraints:</h3>
            <ul>
                <li>r >= 0</li>
            </ul>
        `,
        starterCode: `function areaCircle(r) {
    // Your code here
    
}

console.log(areaCircle(3));`
    },
    'celsius-fahrenheit': {
        title: 'Celsius to Fahrenheit',
        description: `
            <h2>Problem Description</h2>
            <p>Convert temperature from Celsius to Fahrenheit.</p>
            <p>Formula: F = C * 9/5 + 32</p>
            
            <h3>Example:</h3>
            <pre><code>Input: c = 25
Output: 77</code></pre>
            
        `,
        starterCode: `function toFahrenheit(c) {
    // Your code here
    
}

console.log(toFahrenheit(25));`
    },
    'leap-year': {
        title: 'Leap Year',
        description: `
            <h2>Problem Description</h2>
            <p>Determine if a given year is a leap year.</p>
            
            <h3>Example:</h3>
            <pre><code>Input: year = 2000
Output: true</code></pre>
            
            <h3>Constraints:</h3>
            <ul>
                <li>1 <= year <= 9999</li>
            </ul>
        `,
        starterCode: `function isLeapYear(year) {
    // Your code here
    
}

console.log(isLeapYear(2024));`
    },
    'collatz-conjecture': {
        title: 'Collatz Conjecture Steps',
        description: `
            <h2>Problem Description</h2>
            <p>Given a number n, return the number of steps to reach 1.</p>
            <p>If even, divide by 2. If odd, multiply by 3 and add 1.</p>
            
            <h3>Example:</h3>
            <pre><code>Input: n = 6
Output: 8
Explanation: 6->3->10->5->16->8->4->2->1</code></pre>
            
            <h3>Constraints:</h3>
            <ul>
                <li>n >= 1</li>
            </ul>
        `,
        starterCode: `function collatzSteps(n) {
    // Your code here
    
}

console.log(collatzSteps(6));`
    },
    'harshad-number': {
        title: 'Harshad Number',
        description: `
            <h2>Problem Description</h2>
            <p>A Harshad number is an integer that is divisible by the sum of its digits.</p>
            
            <h3>Example:</h3>
            <pre><code>Input: n = 18
Output: true
Explanation: 1 + 8 = 9, and 18 is divisible by 9</code></pre>
        `,
        starterCode: `function isHarshad(n) {
    // Your code here
    
}

console.log(isHarshad(18));`
    },
    'perfect-number': {
        title: 'Perfect Number',
        description: `
            <h2>Problem Description</h2>
            <p>A Perfect Number is a positive integer that is equal to the sum of its positive divisors, excluding the number itself.</p>
            
            <h3>Example:</h3>
            <pre><code>Input: n = 28
Output: true
Explanation: 1 + 2 + 4 + 7 + 14 = 28</code></pre>
            
            <h3>Constraints:</h3>
            <ul>
                <li>1 <= n <= 10^8</li>
            </ul>
        `,
        starterCode: `function checkPerfectNumber(num) {
    // Your code here
    
}

console.log(checkPerfectNumber(28));`
    },
    'sqrt-int': {
        title: 'Integer Square Root',
        description: `
            <h2>Problem Description</h2>
            <p>Given a non-negative integer x, compute and return the square root of x.</p>
            <p>Since the return type is an integer, the decimal digits are truncated.</p>
            
            <h3>Example:</h3>
            <pre><code>Input: x = 8
Output: 2
Explanation: The square root of 8 is 2.82842..., so we return 2.</code></pre>
            
            <h3>Constraints:</h3>
            <ul>
                <li>0 <= x <= 2^31 - 1</li>
            </ul>
        `,
        starterCode: `function mySqrt(x) {
    // Your code here
    
}

console.log(mySqrt(8));`
    },
    'power-x-n': {
        title: 'Power(x, n)',
        description: `
            <h2>Problem Description</h2>
            <p>Implement pow(x, n), which calculates x raised to the power n.</p>
            
            <h3>Example:</h3>
            <pre><code>Input: x = 2.00000, n = 10
Output: 1024.00000</code></pre>
            
            <h3>Constraints:</h3>
            <ul>
                <li>-100.0 < x < 100.0</li>
                <li>-2^31 <= n <= 2^31-1</li>
            </ul>
        `,
        starterCode: `function myPow(x, n) {
    // Your code here
    
}

console.log(myPow(2, 10));`
    },
    'pascals-triangle': {
        title: 'Pascals Triangle',
        description: `
            <h2>Problem Description</h2>
            <p>Given an integer <code>numRows</code>, return the first numRows of Pascal's triangle.</p>
            
            <h3>Example:</h3>
            <pre><code>Input: numRows = 5
Output: [[1],[1,1],[1,2,1],[1,3,3,1],[1,4,6,4,1]]</code></pre>
            
            <h3>Constraints:</h3>
            <ul>
                <li>1 <= numRows <= 30</li>
            </ul>
        `,
        starterCode: `function generatePascal(numRows) {
    // Your code here
    
}

console.log(generatePascal(5));`
    },
    'fizz-buzz': {
        title: 'FizzBuzz',
        description: `
            <h2>Problem Description</h2>
            <p>Return an array of strings from 1 to n.</p>
            <p>Multiples of 3: "Fizz", Multiples of 5: "Buzz", Multiples of both: "FizzBuzz".</p>
            
            <h3>Example:</h3>
            <pre><code>Input: n = 3
Output: ["1","2","Fizz"]</code></pre>
        `,
        starterCode: `function fizzBuzz(n) {
    // Your code here
    
}

console.log(fizzBuzz(15));`
    },
    'count-digits': {
        title: 'Count Digits',
        description: `
            <h2>Problem Description</h2>
            <p>Given a number n, count the number of digits in it.</p>
            
            <h3>Example:</h3>
            <pre><code>Input: n = 54321
Output: 5</code></pre>
        `,
        starterCode: `function countDigits(n) {
    // Your code here
    
}

console.log(countDigits(54321));`
    },
    'binary-to-decimal': {
        title: 'Binary to Decimal',
        description: `
            <h2>Problem Description</h2>
            <p>Convert a binary number (given as a string) to a decimal integer.</p>
            
            <h3>Example:</h3>
            <pre><code>Input: binary = "101"
Output: 5</code></pre>
        `,
        starterCode: `function binaryToDecimal(binary) {
    // Your code here
    
}

console.log(binaryToDecimal("101"));`
    },
    'decimal-to-binary': {
        title: 'Decimal to Binary',
        description: `
            <h2>Problem Description</h2>
            <p>Convert a decimal number to its binary string representation.</p>
            
            <h3>Example:</h3>
            <pre><code>Input: n = 5
Output: "101"</code></pre>
        `,
        starterCode: `function decimalToBinary(n) {
    // Your code here
    
}

console.log(decimalToBinary(5));`
    },
    'sum-natural': {
        title: 'Sum of Natural Numbers',
        description: `
            <h2>Problem Description</h2>
            <p>Calculate sum of first n natural numbers.</p>
            
            <h3>Example:</h3>
            <pre><code>Input: n = 5
Output: 15
Explanation: 1+2+3+4+5 = 15</code></pre>
        `,
        starterCode: `function sumNatural(n) {
    // Your code here
    
}

console.log(sumNatural(5));`
    },
    'product-digits': {
        title: 'Product of Digits',
        description: `
            <h2>Problem Description</h2>
            <p>Given an integer n, return the difference between the product of its digits and the sum of its digits.</p>
            
            <h3>Example:</h3>
            <pre><code>Input: n = 234
Output: 15
Explanation: Product = 2*3*4 = 24. Sum = 2+3+4 = 9. Result = 24 - 9 = 15</code></pre>
        `,
        starterCode: `function subtractProductAndSum(n) {
    // Your code here
    
}

console.log(subtractProductAndSum(234));`
    },
    'digital-root': {
        title: 'Digital Root',
        description: `
            <h2>Problem Description</h2>
            <p>Given a non-negative integer num, repeatedly add all its digits until the result has only one digit.</p>
            
            <h3>Example:</h3>
            <pre><code>Input: num = 38
Output: 2
Explanation: 3 + 8 = 11, 1 + 1 = 2.</code></pre>
        `,
        starterCode: `function addDigits(num) {
    // Your code here
    
}

console.log(addDigits(38));`
    },
    'nth-prime': {
        title: 'Nth Prime',
        description: `
            <h2>Problem Description</h2>
            <p>Find the nth prime number.</p>
            
            <h3>Example:</h3>
            <pre><code>Input: n = 5
Output: 11
Explanation: Primes are 2, 3, 5, 7, 11...</code></pre>
        `,
        starterCode: `function nthPrime(n) {
    // Your code here
    
}

console.log(nthPrime(5));`
    },
    'missing-number': {
        title: 'Missing Number',
        description: `
            <h2>Problem Description</h2>
            <p>Given an array nums containing n distinct numbers in the range [0, n], return the only number in the range that is missing from the array.</p>
            
            <h3>Example:</h3>
            <pre><code>Input: nums = [3,0,1]
Output: 2</code></pre>
        `,
        starterCode: `function missingNumber(nums) {
    // Your code here
    
}

console.log(missingNumber([3,0,1]));`
    },
    'ugly-number': {
        title: 'Ugly Number',
        description: `
            <h2>Problem Description</h2>
            <p>An ugly number is a positive integer whose prime factors are limited to 2, 3, and 5.</p>
            
            <h3>Example:</h3>
            <pre><code>Input: n = 6
Output: true
Explanation: 6 = 2 * 3</code></pre>
        `,
        starterCode: `function isUgly(n) {
    // Your code here
    
}

console.log(isUgly(6));`
    },
    'happy-number': {
        title: 'Happy Number',
        description: `
            <h2>Problem Description</h2>
            <p>A happy number is a number defined by the following process: replace the number by the sum of the squares of its digits. Repeat until the number equals 1 (happy) or loops endlessly (not happy).</p>
            
            <h3>Example:</h3>
            <pre><code>Input: n = 19
Output: true
Explanation:
1^2 + 9^2 = 82
8^2 + 2^2 = 68
6^2 + 8^2 = 100
1^2 + 0^2 + 0^2 = 1</code></pre>
        `,
        starterCode: `function isHappy(n) {
    // Your code here
    
}

console.log(isHappy(19));`
    },
    'strong-number': {
        title: 'Strong Number',
        description: `
            <h2>Problem Description</h2>
            <p>A Strong number is a number where the sum of the factorial of its digits is equal to the number itself.</p>
            
            <h3>Example:</h3>
            <pre><code>Input: n = 145
Output: true
Explanation: 1! + 4! + 5! = 1 + 24 + 120 = 145</code></pre>
        `,
        starterCode: `function isStrong(n) {
    // Your code here
    
}

console.log(isStrong(145));`
    },
    'automorphic-number': {
        title: 'Automorphic Number',
        description: `
            <h2>Problem Description</h2>
            <p>A number is called Automorphic number if and only if its square ends in the same digits as the number itself.</p>
            
            <h3>Example:</h3>
            <pre><code>Input: n = 25
Output: true
Explanation: 25^2 = 625 (ends in 25)</code></pre>
        `,
        starterCode: `function isAutomorphic(n) {
    // Your code here
    
}

console.log(isAutomorphic(25));`
    },
    'abundant-number': {
        title: 'Abundant Number',
        description: `
            <h2>Problem Description</h2>
            <p>An Abundant number is a number for which the sum of its proper divisors is greater than the number itself.</p>
            
            <h3>Example:</h3>
            <pre><code>Input: n = 12
Output: true
Explanation: Divisors: 1, 2, 3, 4, 6. Sum = 16 > 12</code></pre>
        `,
        starterCode: `function isAbundant(n) {
    // Your code here
    
}

console.log(isAbundant(12));`
    },
    'deficient-number': {
        title: 'Deficient Number',
        description: `
            <h2>Problem Description</h2>
            <p>A number is Deficient if the sum of its proper divisors is less than the number itself.</p>
            
            <h3>Example:</h3>
            <pre><code>Input: n = 15
Output: true
Explanation: Divisors: 1, 3, 5. Sum = 9 < 15</code></pre>
        `,
        starterCode: `function isDeficient(n) {
    // Your code here
    
}

console.log(isDeficient(15));`
    },
    'sum-squares': {
        title: 'Sum of Squares',
        description: `
            <h2>Problem Description</h2>
            <p>Given a non-negative integer c, decide whether there're two integers a and b such that a^2 + b^2 = c.</p>
            
            <h3>Example:</h3>
            <pre><code>Input: c = 5
Output: true
Explanation: 1^2 + 2^2 = 5</code></pre>
        `,
        starterCode: `function judgeSquareSum(c) {
    // Your code here
    
}

console.log(judgeSquareSum(5));`
    },
    'check-arithmetic-progression': {
        title: 'Check Arithmetic Progression',
        description: `
            <h2>Problem Description</h2>
            <p>Given an array of numbers, check if it forms an arithmetic progression (difference between consecutive terms is constant).</p>
            
            <h3>Example:</h3>
            <pre><code>Input: arr = [1, 3, 5]
Output: true</code></pre>
        `,
        starterCode: `function isArithmeticProgression(arr) {
    // Your code here
    
}

console.log(isArithmeticProgression([1, 3, 5]));`
    },
    'geometric-series-sum': {
        title: 'Geometric Series Sum',
        description: `
            <h2>Problem Description</h2>
            <p>Calculate the sum of the first n terms of a Geometric Progression given first term (a) and common ratio (r).</p>
            
            <h3>Example:</h3>
            <pre><code>Input: a = 2, r = 2, n = 3
Output: 14
Explanation: 2 + 4 + 8 = 14</code></pre>
        `,
        starterCode: `function sumGeometric(a, r, n) {
    // Your code here
    
}

console.log(sumGeometric(2, 2, 3));`
    },
    'sum-cubes': {
        title: 'Sum of Cubes',
        description: `
            <h2>Problem Description</h2>
            <p>Calculate sum of cubes of first n natural numbers.</p>
            
            <h3>Example:</h3>
            <pre><code>Input: n = 3
Output: 36
Explanation: 1^3 + 2^3 + 3^3 = 1 + 8 + 27 = 36</code></pre>
        `,
        starterCode: `function sumCubes(n) {
    // Your code here
    
}

console.log(sumCubes(3));`
    },
    'quadratic-roots': {
        title: 'Quadratic Equation Roots',
        description: `
            <h2>Problem Description</h2>
            <p>Find roots of ax^2 + bx + c = 0. Return valid real roots array.</p>
            
            <h3>Example:</h3>
            <pre><code>Input: a = 1, b = -3, c = 2
Output: [2, 1]</code></pre>
        `,
        starterCode: `function findRoots(a, b, c) {
    // Your code here
    
}

console.log(findRoots(1, -3, 2));`
    },
    'ncr-combination': {
        title: 'nCr Combination',
        description: `
            <h2>Problem Description</h2>
            <p>Calculate nCr: number of ways to choose r items from a set of n distinct items.</p>
            <p>Formula: n! / (r! * (n-r)!)</p>
            
            <h3>Example:</h3>
            <pre><code>Input: n = 5, r = 2
Output: 10</code></pre>
        `,
        starterCode: `function combinations(n, r) {
    // Your code here
    
}

console.log(combinations(5, 2));`
    },
    'npr-permutation': {
        title: 'nPr Permutation',
        description: `
            <h2>Problem Description</h2>
            <p>Calculate nPr: number of ways to arrange r items from n distinct items.</p>
            <p>Formula: n! / (n-r)!</p>
            
            <h3>Example:</h3>
            <pre><code>Input: n = 5, r = 2
Output: 20</code></pre>
        `,
        starterCode: `function permutations(n, r) {
    // Your code here
    
}

console.log(permutations(5, 2));`
    },
    'catalan-number': {
        title: 'Catalan Numbers',
        description: `
            <h2>Problem Description</h2>
            <p>Find the nth Catalan number. Catalan numbers are a sequence of natural numbers that occur in various counting problems.</p>
            <p>C(n) = (2n)! / ((n+1)! * n!)</p>
            
            <h3>Example:</h3>
            <pre><code>Input: n = 3
Output: 5</code></pre>
        `,
        starterCode: `function catalan(n) {
    // Your code here
    
}

console.log(catalan(3));`
    },
    'trailing-zeros': {
        title: 'Trailing Zeros Factorial',
        description: `
            <h2>Problem Description</h2>
            <p>Given an integer n, return the number of trailing zeroes in n!.</p>
            
            <h3>Example:</h3>
            <pre><code>Input: n = 5
Output: 1
Explanation: 5! = 120, one trailing zero.</code></pre>
        `,
        starterCode: `function trailingZeroes(n) {
    // Your code here
    
}

console.log(trailingZeroes(5));`
    },
    'add-binary': {
        title: 'Add Binary Strings',
        description: `
            <h2>Problem Description</h2>
            <p>Given two binary strings a and b, return their sum as a binary string.</p>
            
            <h3>Example:</h3>
            <pre><code>Input: a = "11", b = "1"
Output: "100"</code></pre>
        `,
        starterCode: `function addBinary(a, b) {
    // Your code here
    
}

console.log(addBinary("11", "1"));`
    },
    'multiply-strings': {
        title: 'Multiply Strings',
        description: `
            <h2>Problem Description</h2>
            <p>Given two non-negative integers represented as strings, return the product represented as a string.</p>
            
            <h3>Example:</h3>
            <pre><code>Input: num1 = "2", num2 = "3"
Output: "6"</code></pre>
        `,
        starterCode: `function multiply(num1, num2) {
    // Your code here
    
}

console.log(multiply("2", "3"));`
    },
    'roman-to-int': {
        title: 'Roman to Integer',
        description: `
            <h2>Problem Description</h2>
            <p>Convert a Roman numeral to an integer.</p>
            
            <h3>Example:</h3>
            <pre><code>Input: s = "III"
Output: 3</code></pre>
        `,
        starterCode: `function romanToInt(s) {
    // Your code here
    
}

console.log(romanToInt("IV"));`
    },
    'int-to-roman': {
        title: 'Integer to Roman',
        description: `
            <h2>Problem Description</h2>
            <p>Convert an integer to a Roman numeral.</p>
            
            <h3>Example:</h3>
            <pre><code>Input: num = 3
Output: "III"</code></pre>
        `,
        starterCode: `function intToRoman(num) {
    // Your code here
    
}

console.log(intToRoman(3));`
    }
};

// String Problems

const stringProblems = {
    'reverse-string': {
        title: 'Reverse String',
        description: `
            <h2>Problem Description</h2>
            <p>Write a function that reverses a string.</p>
            
            <h3>Example:</h3>
            <pre><code>Input: "hello"
Output: "olleh"</code></pre>
        `,
        starterCode: `function reverseString(s) {
    // Your code here
    
}

// Test the function
const str = "hello";
console.log(reverseString(str));`
    },
    'palindrome': {
        title: 'Check Palindrome',
        description: `
            <h2>Problem Description</h2>
            <p>Given a string, determine if it is a palindrome, considering only alphanumeric characters and ignoring cases.</p>
            
            <h3>Example 1:</h3>
            <pre><code>Input: "A man, a plan, a canal: Panama"
Output: true</code></pre>
            
            <h3>Example 2:</h3>
            <pre><code>Input: "race a car"
Output: false</code></pre>
        `,
        starterCode: `function isPalindrome(s) {
    // Your code here
    
}

// Test the function
console.log(isPalindrome("A man, a plan, a canal: Panama"));
console.log(isPalindrome("race a car"));`
    },
    'anagram': {
        title: 'Valid Anagram',
        description: `
            <h2>Problem Description</h2>
            <p>Given two strings <code>s</code> and <code>t</code>, return <code>true</code> if <code>t</code> is an anagram of <code>s</code>, and <code>false</code> otherwise.</p>
            <p>An Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.</p>
            
            <h3>Example 1:</h3>
            <pre><code>Input: s = "anagram", t = "nagaram"
Output: true</code></pre>
            
            <h3>Example 2:</h3>
            <pre><code>Input: s = "rat", t = "car"
Output: false</code></pre>
            
            <h3>Constraints:</h3>
            <ul>
                <li>1 <= s.length, t.length <= 5 * 10^4</li>
                <li>s and t consist of lowercase English letters</li>
            </ul>
        `,
        starterCode: `function isAnagram(s, t) {
    // Your code here
    
}

// Test the function
console.log(isAnagram("anagram", "nagaram")); // true
console.log(isAnagram("rat", "car")); // false`
    },
    'longest-substring': {
        title: 'Longest Substring Without Repeating Characters',
        description: `
            <h2>Problem Description</h2>
            <p>Given a string <code>s</code>, find the length of the longest substring without repeating characters.</p>
            
            <h3>Example 1:</h3>
            <pre><code>Input: s = "abcabcbb"
Output: 3
Explanation: The answer is "abc", with the length of 3.</code></pre>
            
            <h3>Example 2:</h3>
            <pre><code>Input: s = "bbbbb"
Output: 1
Explanation: The answer is "b", with the length of 1.</code></pre>
            
            <h3>Example 3:</h3>
            <pre><code>Input: s = "pwwkew"
Output: 3
Explanation: The answer is "wke", with the length of 3.</code></pre>
            
            <h3>Constraints:</h3>
            <ul>
                <li>0 <= s.length <= 5 * 10^4</li>
                <li>s consists of English letters, digits, symbols and spaces</li>
            </ul>
        `,
        starterCode: `function lengthOfLongestSubstring(s) {
    // Your code here
    
}

// Test the function
console.log(lengthOfLongestSubstring("abcabcbb")); // 3
console.log(lengthOfLongestSubstring("bbbbb")); // 1
console.log(lengthOfLongestSubstring("pwwkew")); // 3`
    }
};

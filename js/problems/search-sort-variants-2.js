// Algorithm Problem Variants: Searching & Sorting

const searchSortVariants = {
    // --- BINARY SEARCH VARIANTS ---

    'first-bad-version': {
        title: 'First Bad Version (Lower Bound)',
        description: `
            <h2>Problem Description</h2>
            <p>You are a product manager leading a team to develop a new product. Unfortunately, the latest version of your product fails the quality check. Since each version is developed based on the previous version, all the versions after a bad version are also bad.</p>
            <p>Suppose you have <code>n</code> versions <code>[1, 2, ..., n]</code> and you want to find out the first bad one, which causes all the following ones to be bad.</p>
            <p>You are given an API <code>bool isBadVersion(version)</code> which returns whether a version is bad.</p>
            
            <h3>Example:</h3>
            <pre><code>Input: n = 5, bad = 4
Output: 4
Explanation:
call isBadVersion(3) -> false
call isBadVersion(5) -> true
call isBadVersion(4) -> true
Then 4 is the first bad version.</code></pre>
        `,
        starterCode: `function solution(isBadVersion) {
    // isBadVersion is a function provided to you
    return function(n) {
        // Your binary search logic here
        
    };
}`
    },
    'find-min-rotated': {
        title: 'Find Minimum in Rotated Sorted Array',
        description: `
            <h2>Problem Description</h2>
            <p>Suppose an array of length <code>n</code> sorted in ascending order is rotated between 1 and n times.</p>
            <p>Find the minimum element in this array.</p>
            <p>You must write an algorithm that runs in <code>O(log n)</code> time.</p>
            
            <h3>Example:</h3>
            <pre><code>Input: nums = [3,4,5,1,2]
Output: 1
Explanation: The original array was [1,2,3,4,5] rotated 3 times.</code></pre>
        `,
        starterCode: `function findMin(nums) {
    // Your code here
    
}

console.log(findMin([3,4,5,1,2]));`
    },
    'koko-eating-bananas': {
        title: 'Koko Eating Bananas (Binary Search on Answer)',
        description: `
            <h2>Problem Description</h2>
            <p>Koko loves to eat bananas. There are <code>n</code> piles of bananas, the <code>i-th</code> pile has <code>piles[i]</code> bananas. The guards have gone and will come back in <code>h</code> hours.</p>
            <p>Koko can decide her bananas-per-hour eating speed of <code>k</code>. Return the minimum integer <code>k</code> such that she can eat all the bananas within <code>h</code> hours.</p>
            <p>This is a classic "Binary Search on Answer" problem.</p>
            
            <h3>Example:</h3>
            <pre><code>Input: piles = [3,6,7,11], h = 8
Output: 4</code></pre>
        `,
        starterCode: `function minEatingSpeed(piles, h) {
    // Your code here
    
}

console.log(minEatingSpeed([3,6,7,11], 8));`
    },
    'peak-index-mountain': {
        title: 'Peak Index in a Mountain Array',
        description: `
            <h2>Problem Description</h2>
            <p>An array is a <strong>mountain array</strong> if the elements strictly increase until a "peak" index and then strictly decrease.</p>
            <p>Return the index of the peak element. Your solution must be in <code>O(log(n))</code> complexity.</p>
            
            <h3>Example:</h3>
            <pre><code>Input: arr = [0,10,5,2]
Output: 1</code></pre>
        `,
        starterCode: `function peakIndexInMountainArray(arr) {
    // Your code here
    
}

console.log(peakIndexInMountainArray([0,10,5,2]));`
    },

    // --- SORTING MECHANIC VARIANTS (Bubble, Quick, Merge) ---

    'sort-array-by-parity': {
        title: 'Sort Array By Parity (Partitioning)',
        description: `
            <h2>Problem Description</h2>
            <p>Given an integer array <code>nums</code>, move all the even integers at the beginning of the array followed by all the odd integers.</p>
            <p>This problem checks your ability to implement the <strong>Partition</strong> logic found in Quick Sort (Hoare or Lomuto partition schemes).</p>
            
            <h3>Example:</h3>
            <pre><code>Input: nums = [3,1,2,4]
Output: [2,4,3,1]
Explanation: [4,2,3,1], [2,4,1,3], and [4,2,1,3] would also be accepted.</code></pre>
        `,
        starterCode: `function sortArrayByParity(nums) {
    // Your code here
    
}

console.log(sortArrayByParity([3,1,2,4]));`
    },
    'move-zeroes': {
        title: 'Move Zeroes (Bubble/Partition Logic)',
        description: `
            <h2>Problem Description</h2>
            <p>Given an integer array <code>nums</code>, move all <code>0</code>'s to the end of it while maintaining the relative order of the non-zero elements.</p>
            <p>You must do this in-place without making a copy of the array.</p>
            
            <h3>Example:</h3>
            <pre><code>Input: nums = [0,1,0,3,12]
Output: [1,3,12,0,0]</code></pre>
        `,
        starterCode: `function moveZeroes(nums) {
    // Your code here
    
}

console.log(moveZeroes([0,1,0,3,12]));`
    },
    'reverse-pairs': {
        title: 'Reverse Pairs (Merge Sort Variant)',
        description: `
            <h2>Problem Description</h2>
            <p>Given an array <code>nums</code>, we call <code>(i, j)</code> an important reverse pair if <code>i < j</code> and <code>nums[i] > 2 * nums[j]</code>.</p>
            <p>Return the number of important reverse pairs in the given array.</p>
            <p>This is a more advanced variation of the "Count Inversions" problem, typically solved by modifying the <strong>Merge Sort</strong> algorithm.</p>
            
            <h3>Example:</h3>
            <pre><code>Input: nums = [1,3,2,3,1]
Output: 2
Explanation: (3, 1) and (3, 1) are the pairs.</code></pre>
        `,
        starterCode: `function reversePairs(nums) {
    // Your code here
    
}

console.log(reversePairs([1,3,2,3,1]));`
    },
    'h-index': {
        title: 'H-Index (Counting Sort Variant)',
        description: `
            <h2>Problem Description</h2>
            <p>Given an array of citations (each citation is a non-negative integer), write a function to compute the researcher's h-index.</p>
            <p>A scientist has index <code>h</code> if <code>h</code> of their <code>n</code> papers have at least <code>h</code> citations each.</p>
            <p>While this can be solved with normal sort, the optimal solution uses <strong>Counting Sort</strong> (buckets) logic because the h-index is bounded by the number of papers.</p>
            
            <h3>Example:</h3>
            <pre><code>Input: citations = [3,0,6,1,5]
Output: 3</code></pre>
        `,
        starterCode: `function hIndex(citations) {
    // Your code here
    
}

console.log(hIndex([3,0,6,1,5]));`
    },
    'pancake-sorting': {
        title: 'Pancake Sorting (Reversal Logic)',
        description: `
            <h2>Problem Description</h2>
            <p>Given an array of integers <code>arr</code>, sort the array performing a series of <strong>pancake flips</strong>.</p>
            <p>In one pancake flip we do the following steps: Choose an integer <code>k</code> where <code>1 <= k <= arr.length</code>. Reverse the sub-array <code>arr[0...k-1]</code>.</p>
            <p>This explores the idea of sorting via reversals, similar to how Insertion Sort places elements one by one.</p>
            
            <h3>Example:</h3>
            <pre><code>Input: arr = [3,2,4,1]
Output: [4,2,4,3] (One valid sequence)</code></pre>
        `,
        starterCode: `function pancakeSort(arr) {
    // Your code here
    
}

console.log(pancakeSort([3,2,4,1]));`
    },
    'meeting-rooms': {
        title: 'Meeting Rooms (Interval Sorting)',
        description: `
            <h2>Problem Description</h2>
            <p>Given an array of meeting time intervals consisting of start and end times <code>[[s1,e1],[s2,e2],...]</code>, determine if a person could attend all meetings.</p>
            <p>This relies on sorting intervals by their start time, a standard application of sorting in geometry/scheduling.</p>
            
            <h3>Example:</h3>
            <pre><code>Input: intervals = [[0,30],[5,10],[15,20]]
Output: false</code></pre>
        `,
        starterCode: `function canAttendMeetings(intervals) {
    // Your code here
    
}

console.log(canAttendMeetings([[0,30],[5,10],[15,20]]));`
    },
    'top-k-frequent': {
        title: 'Top K Frequent Elements (Bucket/QuickSelect)',
        description: `
            <h2>Problem Description</h2>
            <p>Given an integer array <code>nums</code> and an integer <code>k</code>, return the <code>k</code> most frequent elements.</p>
            <p>This can be solved using <strong>Bucket Sort</strong> (O(n)) or <strong>QuickSelect</strong> (average O(n)).</p>
            
            <h3>Example:</h3>
            <pre><code>Input: nums = [1,1,1,2,2,3], k = 2
Output: [1,2]</code></pre>
        `,
        starterCode: `function topKFrequent(nums, k) {
    // Your code here
    
}

console.log(topKFrequent([1,1,1,2,2,3], 2));`
    },
    'diagonal-traverse': {
        title: 'Diagonal Traverse (Traversal Order)',
        description: `
            <h2>Problem Description</h2>
            <p>Given an <code>m x n</code> matrix, return an array of all the elements of the array in a diagonal order.</p>
            <p>This is effectively a sorting/ordering problem based on indices sum (i + j).</p>
            
            <h3>Example:</h3>
            <pre><code>Input: mat = [[1,2,3],[4,5,6],[7,8,9]]
Output: [1,2,4,7,5,3,6,8,9]</code></pre>
        `,
        starterCode: `function findDiagonalOrder(mat) {
    // Your code here
    
}

console.log(findDiagonalOrder([[1,2,3],[4,5,6],[7,8,9]]));`
    }
};

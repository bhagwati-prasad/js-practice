// Linked List Problems

const linkedListProblems = {
    'reverse-linked-list': {
        title: 'Reverse Linked List',
        description: `
            <h2>Problem Description</h2>
            <p>Given the <code>head</code> of a singly linked list, reverse the list, and return the reversed list.</p>
            
            <h3>Example 1:</h3>
            <pre><code>Input: head = [1,2,3,4,5]
Output: [5,4,3,2,1]</code></pre>
            
            <h3>Example 2:</h3>
            <pre><code>Input: head = [1,2]
Output: [2,1]</code></pre>
            
            <h3>Example 3:</h3>
            <pre><code>Input: head = []
Output: []</code></pre>
            
            <h3>Constraints:</h3>
            <ul>
                <li>The number of nodes in the list is the range [0, 5000]</li>
                <li>-5000 <= Node.val <= 5000</li>
            </ul>
        `,
        starterCode: `// Definition for singly-linked list node
function ListNode(val, next) {
    this.val = (val===undefined ? 0 : val)
    this.next = (next===undefined ? null : next)
}

function reverseList(head) {
    // Your code here
    
}

// Helper function to print list
function printList(head) {
    let result = [];
    while (head) {
        result.push(head.val);
        head = head.next;
    }
    return result;
}

// Test the function
let head = new ListNode(1);
head.next = new ListNode(2);
head.next.next = new ListNode(3);
console.log(printList(reverseList(head)));`
    },
    'detect-cycle': {
        title: 'Detect Cycle',
        description: `
            <h2>Problem Description</h2>
            <p>Given <code>head</code>, the head of a linked list, determine if the linked list has a cycle in it.</p>
            <p>There is a cycle in a linked list if there is some node in the list that can be reached again by continuously following the <code>next</code> pointer.</p>
            <p>Return <code>true</code> if there is a cycle in the linked list. Otherwise, return <code>false</code>.</p>
            
            <h3>Example 1:</h3>
            <pre><code>Input: head = [3,2,0,-4], pos = 1
Output: true
Explanation: There is a cycle, where the tail connects to the 1st node (0-indexed).</code></pre>
            
            <h3>Example 2:</h3>
            <pre><code>Input: head = [1,2], pos = 0
Output: true
Explanation: There is a cycle, where the tail connects to the 0th node.</code></pre>
            
            <h3>Example 3:</h3>
            <pre><code>Input: head = [1], pos = -1
Output: false
Explanation: There is no cycle in the linked list.</code></pre>
            
            <h3>Constraints:</h3>
            <ul>
                <li>The number of the nodes in the list is in the range [0, 10^4]</li>
                <li>-10^5 <= Node.val <= 10^5</li>
                <li>pos is -1 or a valid index in the linked-list</li>
            </ul>
        `,
        starterCode: `// Definition for singly-linked list node
function ListNode(val) {
    this.val = val;
    this.next = null;
}

function hasCycle(head) {
    // Your code here
    
}

// Test the function
let head1 = new ListNode(3);
head1.next = new ListNode(2);
head1.next.next = new ListNode(0);
head1.next.next.next = new ListNode(-4);
head1.next.next.next.next = head1.next; // Creates cycle
console.log(hasCycle(head1)); // true

let head2 = new ListNode(1);
head2.next = new ListNode(2);
console.log(hasCycle(head2)); // false`
    },
    'merge-lists': {
        title: 'Merge Two Sorted Lists',
        description: `
            <h2>Problem Description</h2>
            <p>You are given the heads of two sorted linked lists <code>list1</code> and <code>list2</code>.</p>
            <p>Merge the two lists in a one sorted list. The list should be made by splicing together the nodes of the first two lists.</p>
            <p>Return the head of the merged linked list.</p>
            
            <h3>Example 1:</h3>
            <pre><code>Input: list1 = [1,2,4], list2 = [1,3,4]
Output: [1,1,2,3,4,4]</code></pre>
            
            <h3>Example 2:</h3>
            <pre><code>Input: list1 = [], list2 = []
Output: []</code></pre>
            
            <h3>Example 3:</h3>
            <pre><code>Input: list1 = [], list2 = [0]
Output: [0]</code></pre>
            
            <h3>Constraints:</h3>
            <ul>
                <li>The number of nodes in both lists is in the range [0, 50]</li>
                <li>-100 <= Node.val <= 100</li>
                <li>Both list1 and list2 are sorted in non-decreasing order</li>
            </ul>
        `,
        starterCode: `// Definition for singly-linked list node
function ListNode(val, next) {
    this.val = (val===undefined ? 0 : val)
    this.next = (next===undefined ? null : next)
}

function mergeTwoLists(list1, list2) {
    // Your code here
    
}

// Helper function to print list
function printList(head) {
    let result = [];
    while (head) {
        result.push(head.val);
        head = head.next;
    }
    return result;
}

// Test the function
let list1 = new ListNode(1);
list1.next = new ListNode(2);
list1.next.next = new ListNode(4);

let list2 = new ListNode(1);
list2.next = new ListNode(3);
list2.next.next = new ListNode(4);

console.log(printList(mergeTwoLists(list1, list2)));`
    }
};

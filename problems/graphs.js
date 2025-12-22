// Graph Problems

const graphProblems = {
    'dfs': {
        title: 'Depth First Search',
        description: `
            <h2>Problem Description</h2>
            <p>Implement Depth First Search (DFS) traversal for a graph.</p>
            <p>Given a graph represented as an adjacency list and a starting vertex, perform DFS and return the order of visited vertices.</p>
            
            <h3>Example:</h3>
            <pre><code>Input: 
graph = {
    0: [1, 2],
    1: [2],
    2: [0, 3],
    3: [3]
}
startVertex = 2

Output: [2, 0, 1, 3]</code></pre>
            
            <h3>Algorithm:</h3>
            <ul>
                <li>Start at the given vertex</li>
                <li>Visit the vertex and mark it as visited</li>
                <li>For each unvisited neighbor, recursively perform DFS</li>
            </ul>
            
            <h3>Constraints:</h3>
            <ul>
                <li>The graph may contain cycles</li>
                <li>All vertices are reachable from the start vertex</li>
            </ul>
        `,
        starterCode: `function dfs(graph, start) {
    // Your code here
    
}

// Test the function
const graph = {
    0: [1, 2],
    1: [2],
    2: [0, 3],
    3: [3]
};
console.log(dfs(graph, 2)); // Example: [2, 0, 1, 3]`
    },
    'bfs': {
        title: 'Breadth First Search',
        description: `
            <h2>Problem Description</h2>
            <p>Implement Breadth First Search (BFS) traversal for a graph.</p>
            <p>Given a graph represented as an adjacency list and a starting vertex, perform BFS and return the order of visited vertices.</p>
            
            <h3>Example:</h3>
            <pre><code>Input: 
graph = {
    0: [1, 2],
    1: [2],
    2: [0, 3],
    3: [3]
}
startVertex = 2

Output: [2, 0, 3, 1]</code></pre>
            
            <h3>Algorithm:</h3>
            <ul>
                <li>Start at the given vertex</li>
                <li>Use a queue to keep track of vertices to visit</li>
                <li>Visit vertices level by level</li>
                <li>Mark each vertex as visited when added to queue</li>
            </ul>
            
            <h3>Constraints:</h3>
            <ul>
                <li>The graph may contain cycles</li>
                <li>All vertices are reachable from the start vertex</li>
            </ul>
        `,
        starterCode: `function bfs(graph, start) {
    // Your code here
    
}

// Test the function
const graph = {
    0: [1, 2],
    1: [2],
    2: [0, 3],
    3: [3]
};
console.log(bfs(graph, 2)); // Example: [2, 0, 3, 1]`
    },
    'number-of-islands': {
        title: 'Number Of Islands',
        description: `
            <h2>Problem Description</h2>
            <p>Given an <code>m x n</code> 2D binary grid which represents a map of '1's (land) and '0's (water), return the number of islands.</p>
            <p>An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.</p>
            
            <h3>Example 1:</h3>
            <pre><code>Input: grid = [
  ["1","1","1","1","0"],
  ["1","1","0","1","0"],
  ["1","1","0","0","0"],
  ["0","0","0","0","0"]
]
Output: 1</code></pre>
            
            <h3>Example 2:</h3>
            <pre><code>Input: grid = [
  ["1","1","0","0","0"],
  ["1","1","0","0","0"],
  ["0","0","1","0","0"],
  ["0","0","0","1","1"]
]
Output: 3</code></pre>
            
            <h3>Constraints:</h3>
            <ul>
                <li>m == grid.length</li>
                <li>n == grid[i].length</li>
                <li>1 <= m, n <= 300</li>
                <li>grid[i][j] is '0' or '1'</li>
            </ul>
        `,
        starterCode: `function numIslands(grid) {
    // Your code here
    
}

// Test the function
const grid1 = [
    ["1","1","1","1","0"],
    ["1","1","0","1","0"],
    ["1","1","0","0","0"],
    ["0","0","0","0","0"]
];
console.log(numIslands(grid1)); // 1

const grid2 = [
    ["1","1","0","0","0"],
    ["1","1","0","0","0"],
    ["0","0","1","0","0"],
    ["0","0","0","1","1"]
];
console.log(numIslands(grid2)); // 3`
    }
};

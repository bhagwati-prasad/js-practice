const dsaData = `{
  "root": {
    "id": "ROOT_001",
    "name": "Software Engineering Interview",
    "type": "domain",
    "children": [
      {
        "id": "DS_001",
        "name": "Data Structures",
        "related_concepts": [],
        "problems": [],
        "children": [
          {
            "id": "DS_LINEAR",
            "name": "Linear Data Structures",
            "children": [
              {
                "id": "ARR_001",
                "name": "Arrays",
                "related_concepts": ["MEM_001"], 
                "problems": ["Implement a dynamic array", "Rotate an array by K positions"],
                "children": [
                  {
                    "id": "ARR_STR",
                    "name": "Strings (Array of Characters)",
                    "related_concepts": ["ARR_001"],
                    "problems": ["Reverse a string", "Check if palindrome"],
                    "children": []
                  },
                  {
                    "id": "MAT_001",
                    "name": "Matrices (2D Arrays)",
                    "related_concepts": ["ALG_DP_GRID"],
                    "problems": ["Spiral Matrix Traversal", "Rotate Image 90 degrees"],
                    "children": []
                  }
                ]
              },
              {
                "id": "LL_001",
                "name": "Linked Lists",
                "related_concepts": ["MEM_POINTERS"],
                "problems": ["Reverse a Linked List", "Detect Cycle in LL"],
                "children": [
                  {
                    "id": "LL_SLL",
                    "name": "Singly Linked List",
                    "problems": ["Delete node without head pointer"],
                    "children": []
                  },
                  {
                    "id": "LL_DLL",
                    "name": "Doubly Linked List",
                    "problems": ["Design a Browser History (Back/Forward)"],
                    "children": []
                  }
                ]
              }
            ]
          },
          {
            "id": "DS_NON_LINEAR",
            "name": "Non-Linear Data Structures",
            "children": [
              {
                "id": "TREE_001",
                "name": "Trees",
                "related_concepts": ["ALG_REC_001"],
                "problems": ["Calculate Depth of Tree", "Diameter of Binary Tree"],
                "children": [
                  {
                    "id": "TREE_BIN",
                    "name": "Binary Trees",
                    "children": [
                      {
                        "id": "TREE_BST",
                        "name": "Binary Search Tree (BST)",
                        "related_concepts": ["ALG_SEARCH_BIN"],
                        "problems": ["Validate BST", "Lowest Common Ancestor in BST"],
                        "children": [
                          {
                            "id": "TREE_AVL",
                            "name": "Self-Balancing Trees (AVL/Red-Black)",
                            "problems": ["Implement Left Rotation", "Insert into AVL"],
                            "children": []
                          }
                        ]
                      },
                      {
                        "id": "TREE_HEAP",
                        "name": "Heaps (Priority Queue)",
                        "related_concepts": ["ARR_001"],
                        "problems": ["Kth Largest Element", "Merge K Sorted Lists"],
                        "children": []
                      }
                    ]
                  },
                  {
                    "id": "TREE_TRIE",
                    "name": "Trie (Prefix Tree)",
                    "related_concepts": ["ARR_STR"],
                    "problems": ["Implement Autocomplete System", "Word Search II"],
                    "children": []
                  }
                ]
              },
              {
                "id": "GRAPH_001",
                "name": "Graphs",
                "related_concepts": ["TREE_001", "MAT_001"],
                "problems": ["Clone Graph", "Number of Islands"],
                "children": [
                  {
                    "id": "GRAPH_DIR",
                    "name": "Directed Graphs",
                    "problems": ["Course Schedule (Cycle Detection)"],
                    "children": [
                        {
                            "id": "GRAPH_DAG",
                            "name": "Directed Acyclic Graph (DAG)",
                            "related_concepts": ["ALG_SORT_TOPO"],
                            "problems": ["Find Eventual Safe States"],
                            "children": []
                        }
                    ]
                  },
                  {
                    "id": "GRAPH_UNDIR",
                    "name": "Undirected Graphs",
                    "problems": ["Valid Tree Graph"],
                    "children": []
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "ALG_001",
        "name": "Algorithms",
        "children": [
          {
            "id": "ALG_PATT",
            "name": "Patterns & Techniques",
            "children": [
              {
                "id": "PATT_TP",
                "name": "Two Pointers",
                "related_concepts": ["ARR_001", "LL_001"],
                "problems": ["Two Sum II", "Container With Most Water"],
                "children": []
              },
              {
                "id": "PATT_SW",
                "name": "Sliding Window",
                "related_concepts": ["ARR_001"],
                "problems": ["Longest Substring Without Repeating Characters", "Minimum Window Substring"],
                "children": [
                  {
                    "id": "PATT_SW_FIXED",
                    "name": "Fixed Size Window",
                    "problems": ["Maximum Sum Subarray of Size K"],
                    "children": []
                  },
                  {
                    "id": "PATT_SW_DYN",
                    "name": "Dynamic Size Window",
                    "problems": ["Smallest Subarray with a given sum"],
                    "children": []
                  }
                ]
              }
            ]
          },
          {
            "id": "ALG_REC_001",
            "name": "Recursion",
            "related_concepts": ["MEM_STACK"],
            "problems": ["Factorial", "Tower of Hanoi"],
            "children": [
              {
                "id": "ALG_BACK",
                "name": "Backtracking",
                "related_concepts": ["TREE_001"],
                "problems": ["N-Queens", "Sudoku Solver", "Generate Parentheses"],
                "children": []
              }
            ]
          },
          {
            "id": "ALG_SORT",
            "name": "Sorting",
            "children": [
              {
                "id": "SORT_NLOGN",
                "name": "Divide and Conquer Sorts",
                "related_concepts": ["ALG_REC_001"],
                "children": [
                  {
                    "id": "SORT_MERGE",
                    "name": "Merge Sort",
                    "problems": ["Implement Merge Sort", "Count Inversions"],
                    "children": []
                  },
                  {
                    "id": "SORT_QUICK",
                    "name": "Quick Sort",
                    "problems": ["Sort an Array using Partitioning"],
                    "children": []
                  }
                ]
              }
            ]
          },
          {
            "id": "ALG_GRAPH",
            "name": "Graph Algorithms",
            "related_concepts": ["GRAPH_001"],
            "children": [
              {
                "id": "ALG_BFS_DFS",
                "name": "Traversal (BFS/DFS)",
                "related_concepts": ["MEM_QUEUE", "MEM_STACK"],
                "problems": ["Flood Fill", "01 Matrix"],
                "children": []
              },
              {
                "id": "ALG_SP",
                "name": "Shortest Path",
                "children": [
                  {
                    "id": "SP_UNWEIGHT",
                    "name": "Unweighted (BFS)",
                    "problems": ["Shortest Path in Binary Matrix"],
                    "children": []
                  },
                  {
                    "id": "SP_WEIGHT_POS",
                    "name": "Weighted Positive (Dijkstra)",
                    "related_concepts": ["TREE_HEAP"],
                    "problems": ["Network Delay Time", "Cheapest Flights Within K Stops"],
                    "children": []
                  },
                  {
                    "id": "SP_WEIGHT_NEG",
                    "name": "Weighted Negative (Bellman-Ford)",
                    "problems": ["Find Negative Cycle in Graph"],
                    "children": []
                  }
                ]
              }
            ]
          },
          {
            "id": "ALG_DP",
            "name": "Dynamic Programming",
            "related_concepts": ["ALG_REC_001"],
            "problems": ["Climbing Stairs"],
            "children": [
              {
                "id": "DP_1D",
                "name": "1D DP",
                "problems": ["House Robber", "Decode Ways"],
                "children": []
              },
              {
                "id": "DP_KNAP",
                "name": "Knapsack Patterns",
                "children": [
                  {
                    "id": "DP_01",
                    "name": "0/1 Knapsack",
                    "problems": ["Partition Equal Subset Sum"],
                    "children": []
                  },
                  {
                    "id": "DP_UNBOUND",
                    "name": "Unbounded Knapsack",
                    "problems": ["Coin Change", "Coin Change II"],
                    "children": []
                  }
                ]
              },
              {
                "id": "DP_LCS",
                "name": "Longest Common Subsequence",
                "problems": ["Edit Distance", "Longest Palindromic Subsequence"],
                "children": []
              }
            ]
          }
        ]
      }
    ]
  }
}`;
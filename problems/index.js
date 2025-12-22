// Problem Registry
// This file combines all problem definitions from different topic files.
// Note: All topic files (arrays.js, strings.js, etc.) are loaded before this file
// via script tags in index.html, making their variables available in the global scope.

// Combine all problems into a single object
const problems = {
    ...arrayProblems,
    ...stringProblems,
    ...linkedListProblems,
    ...stackQueueProblems,
    ...treeProblems,
    ...graphProblems,
    ...dynamicProgrammingProblems
};

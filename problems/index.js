// Problem Registry
// This file imports and combines all problem definitions from different topic files

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

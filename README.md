# JS Practice - Data Structures & Algorithms

A web-based platform for practicing Data Structures and Algorithms in JavaScript. This interactive website provides a clean interface with a Monaco code editor, organized problem sets, and instant code execution.

## Features

- **Monaco Code Editor**: Full-featured code editor with syntax highlighting, IntelliSense, and keyboard shortcuts
- **Collapsible Sidebar**: Topic-wise organized problem list (closed by default)
- **Split View**: Problem description on the left, code editor on the right
- **Run Functionality**: Execute your code instantly and see the output
- **Sample Input**: Test your solutions with custom inputs
- **Dark Theme**: Easy on the eyes with VS Code-inspired dark theme

## Topics Covered

- Arrays
- Strings
- Linked Lists
- Stack & Queue
- Trees
- Graphs
- Dynamic Programming

## How to Use

1. Open `index.html` in a web browser
2. Click the menu button (☰) to open the problem list
3. Select a problem from the topic-wise organized list
4. Read the problem description on the left panel
5. Write your solution in the Monaco editor on the right panel
6. Add sample input in the input area if needed
7. Click "Run" or press `Ctrl+Enter` (or `Cmd+Enter` on Mac) to execute your code
8. View the output below the editor

## Project Structure

```
js-practice/
├── index.html              # Main HTML file with layout structure
├── styles.css              # CSS styling for the entire application
├── app.js                  # JavaScript logic, Monaco editor setup, and UI functionality
├── problems/               # Problem definitions organized by topic
│   ├── arrays.js           # Array problems (Two Sum, Reverse Array, etc.)
│   ├── strings.js          # String problems (Palindrome, Reverse String, etc.)
│   ├── linked-lists.js     # Linked List problems
│   ├── stack-queue.js      # Stack & Queue problems
│   ├── trees.js            # Tree problems
│   ├── graphs.js           # Graph problems
│   ├── dynamic-programming.js  # Dynamic Programming problems
│   └── index.js            # Problem registry that combines all topics
└── README.md               # This file
```

## Technical Details

- **Frontend**: Pure HTML, CSS, and vanilla JavaScript (no frameworks)
- **Code Editor**: Monaco Editor (the editor that powers VS Code)
- **Styling**: Custom CSS with VS Code dark theme inspiration
- **Code Execution**: Uses `eval()` for client-side code execution

## Browser Compatibility

Works best in modern browsers:
- Chrome/Edge (recommended)
- Firefox
- Safari

## Getting Started

Simply open the `index.html` file in your web browser. No build process or server required!

```bash
# Clone the repository
git clone https://github.com/bhagwati-prasad/js-practice.git

# Navigate to the directory
cd js-practice

# Open index.html in your browser
# On macOS: open index.html
# On Linux: xdg-open index.html
# On Windows: start index.html
```

## Contributing

Feel free to add more problems by editing the topic-specific files in the `problems/` directory. Each problem should have:
- `title`: Problem name
- `description`: HTML description of the problem
- `starterCode`: Initial code template

### Adding New Problems

1. Navigate to the appropriate topic file in the `problems/` directory (e.g., `problems/arrays.js` for array problems)
2. Add your problem definition to the topic's object following the existing pattern
3. If creating a new topic, create a new file in `problems/` directory and add it to `problems/index.js`
4. Update `index.html` to include the new script file if you added a new topic

## License

This project is open source and available for educational purposes.
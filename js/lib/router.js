class Router {
    constructor() {
        this.routes = new Map();
        this.currentRoute = null;
        this.init();
    }

    init() {
        window.addEventListener('DOMContentLoaded', () => {
            this.handleRoute(window.location.pathname);
        });

        window.addEventListener('popstate', (event) => {
            this.handleRoute(window.location.pathname, false);
        });

        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="/"]');
            if (link) {
                e.preventDefault();
                const path = link.getAttribute('href');
                this.navigate(path);
            }
        });
    }

    register(pattern, handler) {
        this.routes.set(pattern, handler);
    }

    navigate(path, pushState = true) {
        if (pushState) {
            window.history.pushState({ path }, '', path);
        }
        this.handleRoute(path, pushState);
    }

    handleRoute(path, pushState = true) {
        this.currentRoute = path;

        for (const [pattern, handler] of this.routes) {
            const match = this.matchRoute(pattern, path);
            if (match) {
                handler(match.params);
                return;
            }
        }

        if (this.routes.has('*')) {
            this.routes.get('*')();
        }
    }

    matchRoute(pattern, path) {
        const patternParts = pattern.split('/').filter(Boolean);
        const pathParts = path.split('/').filter(Boolean);

        if (patternParts.length !== pathParts.length) {
            return null;
        }

        const params = {};
        
        for (let i = 0; i < patternParts.length; i++) {
            const patternPart = patternParts[i];
            const pathPart = pathParts[i];

            if (patternPart.startsWith(':')) {
                const paramName = patternPart.slice(1);
                params[paramName] = pathPart;
            } else if (patternPart !== pathPart) {
                return null;
            }
        }

        return { params };
    }

    getCurrentRoute() {
        return this.currentRoute;
    }
}

const router = new Router();

router.register('/practice/:problemId', (params) => {
    const { problemId } = params;
    loadProblem(problemId);
});

router.register('/', () => {
    const problemContent = document.getElementById('problemContent');
    const problemTitle = document.getElementById('problemTitle');
    
    if (problemTitle) {
        problemTitle.textContent = 'Welcome to JS Practice';
    }
    
    if (problemContent) {
        problemContent.innerHTML = `
            <p>Select a problem from the sidebar to get started.</p>
            <p>This platform allows you to practice Data Structures and Algorithms in JavaScript.</p>
            <h3>How to use:</h3>
            <ol>
                <li>Click the "Practice Problems" button to open the problem list</li>
                <li>Select a problem from the topic-wise organized list</li>
                <li>Read the problem description on the left</li>
                <li>Write your solution in the Monaco editor on the right</li>
                <li>Add sample input in the input area</li>
                <li>Click "Run" to test your solution</li>
            </ol>
        `;
    }
});

router.register('*', () => {
    console.warn('Route not found:', router.getCurrentRoute());
    router.navigate('/', false);
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = router;
}

// Problem loading and UI management
function loadProblem(problemId) {
    const problem = typeof problems !== 'undefined' ? problems[problemId] : null;
    
    if (!problem) {
        console.error('Problem not found:', problemId);
        return;
    }
    
    const MOBILE_BREAKPOINT = 1200;
    
    // Update active state
    const problemItems = document.querySelectorAll('.problem-item');
    const currentItem = document.querySelector(`.problem-item a[href="/practice/${problemId}"]`)?.parentElement;
    
    problemItems.forEach(item => item.classList.remove('active'));
    if (currentItem) {
        currentItem.classList.add('active');
        currentItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    
    // Update problem content
    const problemTitle = document.getElementById('problemTitle');
    const problemContent = document.getElementById('problemContent');
    
    if (problemTitle) {
        problemTitle.textContent = problem.title;
    }
    
    if (problemContent) {
        problemContent.innerHTML = problem.description;
    }
    
    // Update editor
    if (window.editor && problem.starterCode) {
        window.editor.setValue(problem.starterCode);
    }
    
    // Clear console and input
    const consoleElement = document.getElementById('console');
    const sampleInputElement = document.getElementById('sampleInput');
    
    if (consoleElement) {
        consoleElement.textContent = '';
        consoleElement.className = '';
    }
    
    if (sampleInputElement) {
        sampleInputElement.value = '';
    }
    
    // Close sidebar on mobile
    if (window.innerWidth < MOBILE_BREAKPOINT) {
        const sidebar = document.getElementById('sidebar');
        if (sidebar) {
            sidebar.classList.add('collapsed');
        }
    }
}
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
            const link = e.target.closest('[data-route]');
            if (link) {
                e.preventDefault();
                const path = link.getAttribute('data-route');
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
    
    const problemItem = document.querySelector(`[data-problem="${problemId}"]`);
    if (problemItem) {
        const sidebar = document.getElementById('sidebar');
        if (sidebar.classList.contains('collapsed')) {
            sidebar.classList.remove('collapsed');
        }
        
        problemItem.click();
        
        problemItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
});

router.register('/', () => {
    const problemContent = document.getElementById('problemContent');
    if (problemContent) {
        problemContent.innerHTML = `
            <h1 id="problemTitle">Welcome to JS Practice</h1>
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

function setupProblemRouting() {
    document.addEventListener('DOMContentLoaded', () => {
        const problemItems = document.querySelectorAll('.problem-item[data-problem]');
        problemItems.forEach(item => {
            const problemId = item.getAttribute('data-problem');
            item.setAttribute('data-route', `/practice/${problemId}`);
            
            item.addEventListener('click', (e) => {
                e.preventDefault();
                router.navigate(`/practice/${problemId}`);
            }, true);
        });
    });
}

setupProblemRouting();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = router;
}
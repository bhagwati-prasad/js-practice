/**
 * Left Sidebar Component
 * Manages collapsible sidebar with topic/category groups
 */

class LeftSidebar {
    constructor(sidebarId, options = {}) {
        this.sidebar = document.getElementById(sidebarId);
        if (!this.sidebar) {
            console.error(`Sidebar with id "${sidebarId}" not found`);
            return;
        }

        this.options = {
            toggleButtonId: options.toggleButtonId || 'toggleSidebar',
            closeButtonId: options.closeButtonId || 'closeSidebar',
            defaultCollapsed: options.defaultCollapsed || false,
            enableTopicToggle: options.enableTopicToggle !== false, // true by default
            ...options
        };

        this.init();
    }

    init() {
        // Set initial state
        if (this.options.defaultCollapsed) {
            this.sidebar.classList.add('collapsed');
        }

        // Setup sidebar toggle
        this.setupSidebarToggle();

        // Setup topic/category collapse toggle
        if (this.options.enableTopicToggle) {
            this.setupTopicToggle();
        }
    }

    setupSidebarToggle() {
        const toggleBtn = document.getElementById(this.options.toggleButtonId);
        const closeBtn = document.getElementById(this.options.closeButtonId);

        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                this.toggle();
            });
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.close();
            });
        }
    }

    setupTopicToggle() {
        const topicHeaders = this.sidebar.querySelectorAll('.topic-header');
        
        topicHeaders.forEach(header => {
            header.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleTopic(header);
            });
        });
    }

    toggleTopic(header) {
        header.classList.toggle('collapsed');
        const list = header.nextElementSibling;
        
        if (list && list.classList.contains('topic-item-list')) {
            if (header.classList.contains('collapsed')) {
                list.style.display = 'none';
            } else {
                list.style.display = 'block';
            }
        }
    }

    toggle() {
        this.sidebar.classList.toggle('collapsed');
    }

    open() {
        this.sidebar.classList.remove('collapsed');
    }

    close() {
        this.sidebar.classList.add('collapsed');
    }

    isOpen() {
        return !this.sidebar.classList.contains('collapsed');
    }

    // Collapse all topics
    collapseAllTopics() {
        const topicHeaders = this.sidebar.querySelectorAll('.topic-header');
        topicHeaders.forEach(header => {
            if (!header.classList.contains('collapsed')) {
                this.toggleTopic(header);
            }
        });
    }

    // Expand all topics
    expandAllTopics() {
        const topicHeaders = this.sidebar.querySelectorAll('.topic-header');
        topicHeaders.forEach(header => {
            if (header.classList.contains('collapsed')) {
                this.toggleTopic(header);
            }
        });
    }

    // Highlight active item
    setActiveItem(itemElement) {
        // Remove active class from all items
        const allItems = this.sidebar.querySelectorAll('.topic-item');
        allItems.forEach(item => item.classList.remove('active'));
        
        // Add active class to selected item
        if (itemElement) {
            itemElement.classList.add('active');
        }
    }
}

// Export for module usage or global access
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LeftSidebar;
}

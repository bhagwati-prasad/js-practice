# Left Sidebar Component

A reusable collapsible sidebar component with topic/category groups for navigation.

## Features

- **Collapsible sidebar** - Toggle entire sidebar visibility
- **Collapsible topics** - Each topic can be expanded/collapsed independently
- **Active item highlighting** - Visually indicates the selected item
- **Pseudo-element icons** - Uses `::after` pseudo-element for collapse/expand indicators
- **Unified naming** - Uses consistent `topic` and `topic-item` class names across all pages

## Files

- `leftSidebar.css` - Component styles
- `leftSidebar.js` - Component JavaScript class

## Usage

### 1. Include CSS and JS

```html
<link rel="stylesheet" href="components/leftSidebar/leftSidebar.css">
<script src="components/leftSidebar/leftSidebar.js"></script>
```

### 2. HTML Structure

```html
<aside id="sidebar" class="sidebar collapsed">
    <div class="sidebar-header">
        <h2>Problems</h2>
        <button id="closeSidebar" class="close-btn" title="Close sidebar">×</button>
    </div>
    <div class="sidebar-content">
        <div class="topic">
            <h3 class="topic-header">Category Name</h3>
            <ul class="topic-item-list">
                <li class="topic-item" data-id="item-1">
                    <a href="/path/to/item">Item Name</a>
                </li>
                <li class="topic-item active" data-id="item-2">
                    <a href="/path/to/item">Active Item</a>
                </li>
            </ul>
        </div>
    </div>
</aside>
```

### 3. Initialize Component

```javascript
// Basic initialization
const leftSidebar = new LeftSidebar('sidebar', {
    toggleButtonId: 'toggleSidebar',
    closeButtonId: 'closeSidebar',
    enableTopicToggle: true
});

// With custom options
const leftSidebar = new LeftSidebar('sidebar', {
    toggleButtonId: 'toggleSidebar',
    closeButtonId: 'closeSidebar',
    defaultCollapsed: false,
    enableTopicToggle: true
});
```

## API

### Constructor Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `toggleButtonId` | string | `'toggleSidebar'` | ID of button to toggle sidebar |
| `closeButtonId` | string | `'closeSidebar'` | ID of button to close sidebar |
| `defaultCollapsed` | boolean | `false` | Whether sidebar starts collapsed |
| `enableTopicToggle` | boolean | `true` | Enable topic expand/collapse |

### Methods

#### `toggle()`
Toggle sidebar open/closed state.

#### `open()`
Open the sidebar.

#### `close()`
Close the sidebar.

#### `isOpen()`
Returns `true` if sidebar is open, `false` if collapsed.

#### `toggleTopic(header)`
Toggle a specific topic open/closed.
- **header**: HTMLElement - The topic header element

#### `collapseAllTopics()`
Collapse all topics in the sidebar.

#### `expandAllTopics()`
Expand all topics in the sidebar.

#### `setActiveItem(itemElement)`
Set the active item and remove active state from others.
- **itemElement**: HTMLElement - The topic item to make active

## CSS Classes

### Main Classes
- `.sidebar` - Main sidebar container
- `.sidebar.collapsed` - Collapsed state (hidden off-screen)
- `.sidebar-header` - Header section with title and close button
- `.sidebar-content` - Scrollable content area

### Topic Classes
- `.topic` - Topic/category container
- `.topic-header` - Clickable header for expand/collapse
- `.topic-header.collapsed` - Collapsed topic state
- `.topic-header::after` - Pseudo-element showing ▼ or ▶ icon
- `.topic-item-list` - List of items in topic
- `.topic-item` - Individual item in list
- `.topic-item.active` - Active/selected item

## Styling Customization

The component uses CSS variables for theming:

```css
/* Override in your theme */
:root {
    --sidebar-width: 300px;
    --bg-tertiary: #1e1e1e;
    --text-secondary: #999;
    --spacing-md: 8px;
    --spacing-xl: 24px;
    /* ... other variables */
}
```

## Pages Using This Component

1. **index.html** (root) - Practice problems sidebar
2. **tools/benchmark/index.html** - Sample functions sidebar
3. **tools/notes/index.html** - Collections sidebar

## Migration Notes

This component replaces:
- Individual sidebar implementations in each page
- Old `.function-category` / `.category-header` classes (benchmark)
- Inline sidebar toggle scripts

All pages now use consistent `.topic` and `.topic-header` naming.

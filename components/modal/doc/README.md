# Modal Component

A reusable, template-based modal component with namespaced CSS to prevent styling conflicts and a comprehensive animation system.

## Features

- 🎨 Template-based HTML structure loaded dynamically
- 🔒 Namespaced CSS (all classes prefixed with `modal-`)
- ⌨️ Keyboard support (Escape to close)
- 🖱️ Click outside to close
- 🎬 **Comprehensive Animation System** - 8+ pre-built animations, chainable, customizable
- 🎭 Smooth animations
- 🎯 Focus management
- 🧩 Flexible content (HTML string or DOM elements)
- 🛠️ Static helpers for common dialogs (alert, confirm, prompt)

## Animation System

The modal includes a powerful animation system with multiple pre-built animations that are plug-and-play. See the dedicated documentation:

- **[Animation Documentation](ANIMATION.md)** - Complete guide with examples
- **[Quick Reference](ANIMATION-QUICK-REF.md)** - Cheat sheet for common patterns
- **[Live Examples](animation-examples.html)** - Interactive demo of all animations
- **[Test Page](animation-test.html)** - Simple test interface

### Quick Animation Example

```javascript
// Use default "from element to center" animation
const modal = new Modal({
    title: 'Welcome',
    body: '<p>Animated modal!</p>',
    animation: ModalAnimations.fromElementToCenter
});

button.addEventListener('click', (e) => {
    modal.show(e.target); // Pass trigger element
});

// Or try other animations
animation: ModalAnimations.fade
animation: ModalAnimations.zoom
animation: ModalAnimations.slideFromTop
```

## Installation

1. Include the CSS in your HTML:
```html
<link rel="stylesheet" href="/components/modal/modal.css">
```

2. Include the JavaScript:
```html
<script src="/components/modal/modal.js"></script>
```

The modal will automatically load its template from `modal.html`.

## Basic Usage

### Simple Modal

```javascript
const modal = new Modal({
    title: 'Welcome',
    body: '<p>Hello, World!</p>',
    primaryButton: {
        text: 'OK',
        onClick: () => console.log('OK clicked')
    }
});
modal.show();
```

### Input Modal

```javascript
const modal = new Modal({
    title: 'Enter Name',
    body: '<input type="text" class="modal-input" placeholder="Your name..." />',
    primaryButton: {
        text: 'Submit',
        onClick: (modalInstance) => {
            const name = modalInstance.getInputValue('.modal-input');
            console.log('Name:', name);
        }
    },
    secondaryButton: {
        text: 'Cancel'
    }
});
modal.show();
```

### Confirm Dialog

```javascript
Modal.confirm(
    'Delete Item',
    'Are you sure you want to delete this item?',
    () => {
        // User confirmed
        deleteItem();
    }
);
```

### Alert Dialog

```javascript
Modal.alert('Success', 'Your changes have been saved!');
```

### Prompt Dialog

```javascript
Modal.prompt('New Collection', 'Enter collection name', (name) => {
    console.log('Collection name:', name);
    createCollection(name);
});
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `title` | string | `''` | Modal title text |
| `body` | string\|HTMLElement | `''` | Modal body content |
| `primaryButton` | object\|null | `null` | Primary button configuration |
| `secondaryButton` | object\|null | `null` | Secondary button configuration |
| `closeOnOverlay` | boolean | `true` | Close when clicking outside |
| `closeOnEscape` | boolean | `true` | Close when pressing Escape |
| `showCloseButton` | boolean | `true` | Show X button in header |
| `onClose` | function\|null | `null` | Callback when modal closes |

### Button Configuration

```javascript
{
    text: 'Button Text',
    onClick: (modalInstance) => {
        // Your logic here
        // Return false to prevent auto-close
        return true;
    },
    disabled: false
}
```

## Methods

### Instance Methods

- `show()` - Display the modal
- `hide()` - Hide the modal
- `update(options)` - Update modal options and re-render
- `getInputValue(selector)` - Get value from input in modal body
- `setInputValue(selector, value)` - Set value of input in modal body
- `setButtonDisabled(button, disabled)` - Enable/disable buttons ('primary' or 'secondary')
- `destroy()` - Remove modal from DOM and clean up

### Static Methods

- `Modal.confirm(title, message, onConfirm)` - Create confirm dialog
- `Modal.alert(title, message, onClose)` - Create alert dialog
- `Modal.prompt(title, placeholder, onSubmit)` - Create prompt dialog

## Advanced Examples

### Radio Button Modal

```javascript
const modal = new Modal({
    title: 'Choose Type',
    body: `
        <div class="modal-radio-group">
            <label>
                <input type="radio" name="type" value="option1" checked>
                <span>Option 1</span>
            </label>
            <label>
                <input type="radio" name="type" value="option2">
                <span>Option 2</span>
            </label>
        </div>
        <input type="text" class="modal-input" placeholder="Enter name..." />
    `,
    primaryButton: {
        text: 'Create',
        onClick: (m) => {
            const type = m.elements.body.querySelector('input[name="type"]:checked').value;
            const name = m.getInputValue('.modal-input');
            console.log('Type:', type, 'Name:', name);
        }
    },
    secondaryButton: { text: 'Cancel' }
});
modal.show();
```

### Dynamic Content Update

```javascript
const modal = new Modal({
    title: 'Loading...',
    body: '<p>Please wait...</p>',
    showCloseButton: false
});
modal.show();

// Later, update content
setTimeout(() => {
    modal.update({
        title: 'Complete',
        body: '<p>Operation completed successfully!</p>',
        primaryButton: { text: 'OK' },
        showCloseButton: true
    });
}, 2000);
```

### Validation Example

```javascript
const modal = new Modal({
    title: 'Create Item',
    body: '<input type="text" class="modal-input" id="itemName" placeholder="Item name..." />',
    primaryButton: {
        text: 'Create',
        onClick: (m) => {
            const name = m.getInputValue('#itemName');
            if (!name || name.trim() === '') {
                m._shakeModal();
                return false; // Prevent modal from closing
            }
            createItem(name);
            return true; // Allow modal to close
        }
    },
    secondaryButton: { text: 'Cancel' }
});
modal.show();
```

## CSS Customization

The modal uses CSS variables for theming:

```css
:root {
    --bg-primary: #ffffff;
    --text-primary: #333333;
    --text-secondary: #666666;
    --border-color: #e0e0e0;
    --hover-bg: #f0f0f0;
    --primary-color: #007bff;
    --btn-primary-bg: #007bff;
    --btn-primary-text: #ffffff;
    --btn-primary-hover: #0056b3;
    --btn-secondary-bg: #f5f5f5;
    --btn-secondary-text: #666666;
    --btn-secondary-hover: #e0e0e0;
}
```

All modal classes are namespaced with `modal-` prefix to prevent conflicts.

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Requires ES6+ support
- Uses async/await for template loading
- Uses Fetch API for loading template

## License

MIT

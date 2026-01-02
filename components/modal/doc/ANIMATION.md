# Modal Animation System

A comprehensive, plug-and-play animation system for the Modal component. Animations can be used individually, chained together, or run in parallel.

## Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [Available Animations](#available-animations)
- [Advanced Usage](#advanced-usage)
- [Creating Custom Animations](#creating-custom-animations)
- [API Reference](#api-reference)

## Overview

The `ModalAnimations` object provides a collection of pre-built animations that can be easily applied to any modal. All animations are designed to be:

- **Plug-and-play**: Simply pass an animation to the modal options
- **Chainable**: Combine multiple animations in sequence
- **Customizable**: Create your own animations with the provided API
- **Performant**: Uses CSS transitions and requestAnimationFrame for smooth animations

## Quick Start

### Basic Usage

```javascript
// Create a modal with the default animation
const modal = new Modal({
    title: 'My Modal',
    body: '<p>Modal content here</p>',
    animation: ModalAnimations.fromElementToCenter
});

// Show the modal (pass trigger element for position-based animations)
const button = document.getElementById('my-button');
button.addEventListener('click', (e) => {
    modal.show(e.target);
});
```

### Using Different Animations

```javascript
// Fade animation
const fadeModal = new Modal({
    title: 'Fade Modal',
    body: '<p>Fades in smoothly</p>',
    animation: ModalAnimations.fade
});

// Zoom animation
const zoomModal = new Modal({
    title: 'Zoom Modal',
    body: '<p>Zooms in with a bounce</p>',
    animation: ModalAnimations.zoom
});

// Slide from top
const slideModal = new Modal({
    title: 'Slide Modal',
    body: '<p>Slides down from top</p>',
    animation: ModalAnimations.slideFromTop
});
```

## Available Animations

### 1. **fromElementToCenter** (Default)
Opens from the clicked element's position with 0 opacity, then moves to center with opacity increasing to 1.

```javascript
animation: ModalAnimations.fromElementToCenter
```

**Best for**: Interactive elements where context is important

### 2. **fade**
Simple fade-in effect with no position change.

```javascript
animation: ModalAnimations.fade
```

**Best for**: Subtle, non-distracting appearances

### 3. **slideFromTop**
Modal slides down from above the viewport.

```javascript
animation: ModalAnimations.slideFromTop
```

**Best for**: Notifications, alerts from system

### 4. **slideFromBottom**
Modal slides up from below the viewport.

```javascript
animation: ModalAnimations.slideFromBottom
```

**Best for**: Mobile-style interactions, bottom sheets

### 5. **zoom**
Scales up from a small size to normal size.

```javascript
animation: ModalAnimations.zoom
```

**Best for**: Drawing attention, playful interfaces

### 6. **flip**
3D flip effect rotating on the X-axis.

```javascript
animation: ModalAnimations.flip
```

**Best for**: Modern, unique interactions

### 7. **rotateScale**
Combines rotation and scaling for a spinning effect.

```javascript
animation: ModalAnimations.rotateScale
```

**Best for**: Eye-catching, dynamic entrances

### 8. **none**
No animation - instant appearance.

```javascript
animation: ModalAnimations.none
```

**Best for**: Performance-critical scenarios, accessibility

## Advanced Usage

### Chaining Animations

Run animations in sequence:

```javascript
const chainedAnimation = ModalAnimations.chain(
    ModalAnimations.zoom,
    ModalAnimations.fade
);

const modal = new Modal({
    title: 'Chained Modal',
    body: '<p>Runs animations in sequence</p>',
    animation: chainedAnimation
});
```

**Note**: Chained animations run one after another. Be mindful of total duration.

### Parallel Animations

Run animations simultaneously:

```javascript
const parallelAnimation = ModalAnimations.parallel(
    ModalAnimations.fade,
    ModalAnimations.zoom
);

const modal = new Modal({
    title: 'Parallel Modal',
    body: '<p>Runs animations at the same time</p>',
    animation: parallelAnimation
});
```

**Note**: Only use parallel animations that complement each other and don't conflict.

## Creating Custom Animations

### Using ModalAnimations.create()

Create custom animations by providing `show` and `hide` functions:

```javascript
const customAnimation = ModalAnimations.create({
    show: async (modal, triggerElement) => {
        const container = modal.elements.container;
        const overlay = modal.elements.overlay;
        
        // Set initial state
        container.style.opacity = '0';
        container.style.transform = 'translateY(-50px)';
        container.style.transition = 'all 0.4s ease';
        
        // Trigger animation
        requestAnimationFrame(() => {
            container.style.opacity = '1';
            container.style.transform = 'translateY(0)';
            overlay.style.opacity = '1';
        });
        
        // Return promise that resolves when animation completes
        return new Promise(resolve => setTimeout(resolve, 400));
    },
    
    hide: async (modal) => {
        const container = modal.elements.container;
        const overlay = modal.elements.overlay;
        
        container.style.transition = 'all 0.3s ease';
        container.style.opacity = '0';
        container.style.transform = 'translateY(50px)';
        overlay.style.opacity = '0';
        
        return new Promise(resolve => setTimeout(resolve, 300));
    }
});

// Use the custom animation
const modal = new Modal({
    title: 'Custom Animation',
    body: '<p>Using my custom animation</p>',
    animation: customAnimation
});
```

### Animation Function Parameters

**show(modal, triggerElement)**
- `modal`: The Modal instance with access to `elements` and `options`
- `triggerElement`: The DOM element that triggered the modal (may be null)
- Returns: `Promise` that resolves when animation completes

**hide(modal)**
- `modal`: The Modal instance
- Returns: `Promise` that resolves when animation completes

### Accessing Modal Elements

Within animation functions, you can access modal elements:

```javascript
modal.elements.overlay      // The overlay background
modal.elements.container    // The modal container
modal.elements.title        // The title element
modal.elements.body         // The body content
modal.elements.footer       // The footer with buttons
```

## API Reference

### ModalAnimations Object

#### Pre-built Animations
- `ModalAnimations.fromElementToCenter` - Default position-based animation
- `ModalAnimations.fade` - Simple fade effect
- `ModalAnimations.slideFromTop` - Slide from top
- `ModalAnimations.slideFromBottom` - Slide from bottom
- `ModalAnimations.zoom` - Scale up effect
- `ModalAnimations.flip` - 3D flip effect
- `ModalAnimations.rotateScale` - Rotate and scale
- `ModalAnimations.none` - No animation

#### Methods

**ModalAnimations.create(config)**

Create a custom animation.

```javascript
const animation = ModalAnimations.create({
    show: async (modal, triggerElement) => { /* ... */ },
    hide: async (modal) => { /* ... */ }
});
```

**Parameters:**
- `config.show` (Function): Show animation function
- `config.hide` (Function): Hide animation function

**Returns:** Animation object

---

**ModalAnimations.chain(...animations)**

Chain multiple animations to run in sequence.

```javascript
const chained = ModalAnimations.chain(
    ModalAnimations.zoom,
    ModalAnimations.fade
);
```

**Parameters:**
- `...animations` (Animation[]): Animation objects to chain

**Returns:** Chained animation object

---

**ModalAnimations.parallel(...animations)**

Run multiple animations simultaneously.

```javascript
const parallel = ModalAnimations.parallel(
    ModalAnimations.fade,
    ModalAnimations.zoom
);
```

**Parameters:**
- `...animations` (Animation[]): Animation objects to run in parallel

**Returns:** Combined animation object

### Modal Constructor Option

```javascript
new Modal({
    // ... other options
    animation: ModalAnimations.fromElementToCenter
});
```

**Type:** `Object` with `show` and `hide` functions  
**Default:** `ModalAnimations.fromElementToCenter`

### Modal.show(triggerElement)

Show the modal with animation.

```javascript
modal.show(element);
```

**Parameters:**
- `triggerElement` (HTMLElement, optional): The element that triggered the modal

### Modal.hide()

Hide the modal with animation.

```javascript
modal.hide();
```

## Examples

### Example 1: Basic Animation

```javascript
const modal = new Modal({
    title: 'Welcome',
    body: '<p>Welcome to our app!</p>',
    animation: ModalAnimations.zoom,
    primaryButton: {
        text: 'Get Started',
        onClick: () => console.log('Started')
    }
});

document.getElementById('welcome-btn').addEventListener('click', (e) => {
    modal.show(e.target);
});
```

### Example 2: Custom Slide Animation

```javascript
const slideRight = ModalAnimations.create({
    show: async (modal) => {
        const container = modal.elements.container;
        container.style.transform = 'translateX(-100vw)';
        container.style.transition = 'transform 0.5s ease-out';
        
        requestAnimationFrame(() => {
            container.style.transform = 'translateX(0)';
        });
        
        return new Promise(resolve => setTimeout(resolve, 500));
    },
    hide: async (modal) => {
        const container = modal.elements.container;
        container.style.transition = 'transform 0.3s ease-in';
        container.style.transform = 'translateX(100vw)';
        
        return new Promise(resolve => setTimeout(resolve, 300));
    }
});

const modal = new Modal({
    title: 'Slide Right',
    body: '<p>Custom slide animation</p>',
    animation: slideRight
});
```

### Example 3: Context-Aware Animation

```javascript
// Different animations based on trigger element
function showContextModal(triggerElement) {
    const animationType = triggerElement.dataset.animation || 'default';
    
    const animations = {
        'default': ModalAnimations.fromElementToCenter,
        'quick': ModalAnimations.fade,
        'dramatic': ModalAnimations.flip
    };
    
    const modal = new Modal({
        title: 'Context Modal',
        body: `<p>Opened with ${animationType} animation</p>`,
        animation: animations[animationType],
        onClose: () => modal.destroy()
    });
    
    modal.show(triggerElement);
}

// Usage:
// <button data-animation="quick">Quick Open</button>
// <button data-animation="dramatic">Dramatic Open</button>
```

## Best Practices

1. **Choose appropriate animations**: Match animations to your use case
   - Use subtle animations (fade, fromElementToCenter) for frequent actions
   - Use dramatic animations (flip, rotateScale) for important moments

2. **Performance**: 
   - Avoid chaining too many animations
   - Test on lower-end devices
   - Use `ModalAnimations.none` for performance-critical scenarios

3. **Accessibility**:
   - Respect user's reduced motion preferences
   - Keep animations short (< 500ms for most cases)
   - Provide alternatives for users with motion sensitivity

4. **User Experience**:
   - Be consistent with animation choices across your app
   - Don't overuse dramatic animations
   - Ensure animations enhance rather than distract

## Browser Support

The animation system uses modern CSS features:
- CSS Transforms
- CSS Transitions
- requestAnimationFrame

**Supported Browsers:**
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

For older browsers, animations will gracefully degrade to instant show/hide.

## License

Part of the Modal Component system. See main project license.

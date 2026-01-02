# Modal Animation System - Quick Reference

## 🚀 Basic Usage

```javascript
// Create modal with animation
const modal = new Modal({
    title: 'My Title',
    body: '<p>Content</p>',
    animation: ModalAnimations.fromElementToCenter
});

// Show modal
button.addEventListener('click', (e) => {
    modal.show(e.target); // Pass trigger element
});
```

## 🎨 Available Animations

| Animation | Description | Use Case |
|-----------|-------------|----------|
| `fromElementToCenter` | Opens from clicked element → center | Default, interactive elements |
| `fade` | Simple fade in/out | Subtle, professional |
| `slideFromTop` | Slides down from top | Alerts, notifications |
| `slideFromBottom` | Slides up from bottom | Mobile-style, bottom sheets |
| `zoom` | Scales up with bounce | Attention-grabbing |
| `flip` | 3D flip effect | Modern, unique |
| `rotateScale` | Rotate + scale | Dramatic, eye-catching |
| `none` | No animation | Performance-critical |

## 💡 Quick Examples

### Default Animation (From Element)
```javascript
const modal = new Modal({
    animation: ModalAnimations.fromElementToCenter
});
modal.show(clickedElement);
```

### Fade Animation
```javascript
const modal = new Modal({
    animation: ModalAnimations.fade
});
modal.show();
```

### Custom Animation
```javascript
const custom = ModalAnimations.create({
    show: async (modal, trigger) => {
        // Animation logic
        return new Promise(resolve => setTimeout(resolve, 300));
    },
    hide: async (modal) => {
        // Hide logic
        return new Promise(resolve => setTimeout(resolve, 300));
    }
});

const modal = new Modal({ animation: custom });
```

### Chained Animations
```javascript
const chained = ModalAnimations.chain(
    ModalAnimations.zoom,
    ModalAnimations.fade
);

const modal = new Modal({ animation: chained });
```

### Parallel Animations
```javascript
const parallel = ModalAnimations.parallel(
    ModalAnimations.fade,
    ModalAnimations.zoom
);

const modal = new Modal({ animation: parallel });
```

## 🎯 Common Patterns

### Conditional Animation
```javascript
const isMobile = window.innerWidth < 768;
const modal = new Modal({
    animation: isMobile ? 
        ModalAnimations.slideFromBottom : 
        ModalAnimations.fromElementToCenter
});
```

### Animation from Data Attribute
```javascript
button.addEventListener('click', (e) => {
    const animType = e.target.dataset.animation;
    const animations = {
        'fade': ModalAnimations.fade,
        'zoom': ModalAnimations.zoom,
        'slide': ModalAnimations.slideFromTop
    };
    
    const modal = new Modal({
        animation: animations[animType] || ModalAnimations.fromElementToCenter
    });
    modal.show(e.target);
});
```

### Disable Animation
```javascript
// No animation
const modal = new Modal({
    animation: ModalAnimations.none
});

// Or for accessibility
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const modal = new Modal({
    animation: prefersReducedMotion ? 
        ModalAnimations.none : 
        ModalAnimations.fromElementToCenter
});
```

## 📦 Modal Elements Access

Inside custom animations:

```javascript
modal.elements.overlay      // Background overlay
modal.elements.container    // Modal container
modal.elements.title        // Title element
modal.elements.body         // Body content
modal.elements.footer       // Footer with buttons
```

## ⚡ Performance Tips

1. Keep animations under 500ms
2. Use `ModalAnimations.none` for low-end devices
3. Avoid chaining too many animations
4. Test on mobile devices

## ♿ Accessibility

```javascript
// Respect reduced motion preference
const prefersReducedMotion = 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const animation = prefersReducedMotion ? 
    ModalAnimations.none : 
    ModalAnimations.fromElementToCenter;
```

## 🔗 See Also

- [Full Documentation](ANIMATION.md)
- [Live Examples](animation-examples.html)
- [Test Page](animation-test.html)
- [Main Modal README](README.md)

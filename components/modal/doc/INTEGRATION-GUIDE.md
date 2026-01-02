# Modal Animation System - Integration Guide

## Quick Start (60 seconds)

### 1. Include Required Files
```html
<link rel="stylesheet" href="/components/modal/modal.css">
<script src="/components/modal/modal.js"></script>
```

### 2. Create Modal with Animation
```javascript
const modal = new Modal({
    title: 'Hello!',
    body: '<p>Your content here</p>',
    animation: ModalAnimations.fromElementToCenter,  // ← Animation here
    primaryButton: { text: 'OK' }
});
```

### 3. Show Modal on Button Click
```javascript
document.getElementById('myButton').addEventListener('click', (e) => {
    modal.show(e.target);  // ← Pass clicked element
});
```

**That's it!** Your modal now has smooth animations. 🎉

---

## Step-by-Step Integration

### For Existing Modals

If you already have modals, just add the `animation` option:

**Before:**
```javascript
const modal = new Modal({
    title: 'My Modal',
    body: '<p>Content</p>'
});
modal.show();
```

**After:**
```javascript
const modal = new Modal({
    title: 'My Modal',
    body: '<p>Content</p>',
    animation: ModalAnimations.zoom  // ← Add this
});
modal.show(clickedElement);  // ← Optionally pass trigger element
```

### For New Modals

Create with animation from the start:

```javascript
// 1. Choose your animation
const animation = ModalAnimations.slideFromBottom;

// 2. Create modal
const modal = new Modal({
    title: 'Welcome',
    body: '<p>Welcome to our app!</p>',
    animation: animation,
    primaryButton: {
        text: 'Get Started',
        onClick: () => {
            console.log('User started');
        }
    }
});

// 3. Show when needed
document.getElementById('welcomeBtn').addEventListener('click', (e) => {
    modal.show(e.target);
});
```

---

## Choosing the Right Animation

### 🎯 For Interactive Elements (Default)
```javascript
animation: ModalAnimations.fromElementToCenter
```
Best when modal is triggered by a specific button or element.

### ✨ For Subtle Dialogs
```javascript
animation: ModalAnimations.fade
```
Professional, non-distracting, good for frequent actions.

### 📱 For Mobile-Style Interfaces
```javascript
animation: ModalAnimations.slideFromBottom
```
Familiar to mobile users, great for bottom sheets.

### 🚨 For Important Alerts
```javascript
animation: ModalAnimations.zoom
```
Grabs attention, use for critical messages.

### 🎨 For Unique Branding
```javascript
animation: ModalAnimations.flip
// or
animation: ModalAnimations.rotateScale
```
Distinctive, memorable, use sparingly.

### ⚡ For Performance
```javascript
animation: ModalAnimations.none
```
No animation, instant, best for low-end devices.

---

## Common Integration Patterns

### Pattern 1: Single Reusable Modal
```javascript
// Create once
const confirmModal = new Modal({
    title: 'Confirm',
    animation: ModalAnimations.fromElementToCenter,
    primaryButton: { text: 'Yes' },
    secondaryButton: { text: 'No' }
});

// Update and show as needed
function showConfirmation(message, onConfirm) {
    confirmModal.update({ body: `<p>${message}</p>` });
    confirmModal.options.primaryButton.onClick = onConfirm;
    confirmModal.show();
}

// Usage
deleteBtn.addEventListener('click', (e) => {
    showConfirmation('Delete this item?', () => {
        // Delete logic
    });
});
```

### Pattern 2: Dynamic Animation Selection
```javascript
function showModal(config, triggerElement) {
    const isMobile = window.innerWidth < 768;
    const animation = isMobile ? 
        ModalAnimations.slideFromBottom : 
        ModalAnimations.fromElementToCenter;
    
    const modal = new Modal({
        ...config,
        animation: animation,
        onClose: (m) => m.destroy()
    });
    
    modal.show(triggerElement);
}

// Usage
button.addEventListener('click', (e) => {
    showModal({
        title: 'Details',
        body: '<p>Info here</p>'
    }, e.target);
});
```

### Pattern 3: Data-Attribute Driven
```html
<button data-modal-animation="zoom">Click Me</button>
<button data-modal-animation="fade">Or Me</button>
```

```javascript
const animationMap = {
    'zoom': ModalAnimations.zoom,
    'fade': ModalAnimations.fade,
    'slide': ModalAnimations.slideFromTop,
    'default': ModalAnimations.fromElementToCenter
};

document.querySelectorAll('[data-modal-animation]').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const animType = e.target.dataset.modalAnimation;
        const animation = animationMap[animType] || animationMap.default;
        
        const modal = new Modal({
            title: 'Dynamic Modal',
            body: '<p>Content based on clicked button</p>',
            animation: animation,
            onClose: (m) => m.destroy()
        });
        
        modal.show(e.target);
    });
});
```

### Pattern 4: Accessibility-Aware
```javascript
// Check user preference
const prefersReducedMotion = 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Choose animation accordingly
function createAccessibleModal(config) {
    return new Modal({
        ...config,
        animation: prefersReducedMotion ? 
            ModalAnimations.none : 
            (config.animation || ModalAnimations.fromElementToCenter)
    });
}

// Usage
const modal = createAccessibleModal({
    title: 'Accessible Modal',
    body: '<p>Respects user preferences</p>'
});
```

---

## Troubleshooting

### Modal doesn't animate
**Problem**: Modal appears instantly without animation.

**Solutions**:
1. Check animation is set: `animation: ModalAnimations.zoom`
2. Verify modal.js is loaded properly
3. Check browser console for errors
4. Try simpler animation: `ModalAnimations.fade`

### Animation is too fast/slow
**Problem**: Animation timing doesn't feel right.

**Solution**: Create custom animation with your timing:
```javascript
const slowZoom = ModalAnimations.create({
    show: async (modal) => {
        const container = modal.elements.container;
        container.style.transform = 'scale(0.3)';
        container.style.opacity = '0';
        container.style.transition = 'all 0.8s ease';  // ← Slower
        
        requestAnimationFrame(() => {
            container.style.transform = 'scale(1)';
            container.style.opacity = '1';
        });
        
        return new Promise(resolve => setTimeout(resolve, 800));
    },
    hide: async (modal) => {
        // Hide logic
    }
});
```

### Trigger element positioning wrong
**Problem**: fromElementToCenter animation starts at wrong position.

**Solutions**:
1. Make sure you pass trigger: `modal.show(e.target)`
2. Check trigger element is visible
3. Try without trigger: `modal.show()` (will use center)

### Animation looks janky
**Problem**: Animation is not smooth.

**Solutions**:
1. Use simpler animation: `ModalAnimations.fade`
2. Check for conflicting CSS
3. Test on better hardware
4. Use `ModalAnimations.none` for low-end devices

---

## Best Practices

### ✅ DO

- Use `fromElementToCenter` for contextual modals
- Pass trigger element: `modal.show(e.target)`
- Respect `prefers-reduced-motion`
- Test animations on mobile devices
- Use `none` for performance-critical scenarios
- Keep animations under 500ms
- Be consistent across your app

### ❌ DON'T

- Don't use dramatic animations for frequent actions
- Don't chain more than 2-3 animations
- Don't ignore accessibility
- Don't forget to destroy modals: `onClose: (m) => m.destroy()`
- Don't make animations too long (>1 second)
- Don't use different animations for same type of action

---

## Next Steps

1. **Try the demos**: Open [animation-examples.html](animation-examples.html)
2. **Read the docs**: See [ANIMATION.md](ANIMATION.md) for complete API
3. **Quick reference**: Check [ANIMATION-QUICK-REF.md](ANIMATION-QUICK-REF.md)
4. **Customize**: Create your own animations with `ModalAnimations.create()`

---

## Need Help?

- Check [ANIMATION.md](ANIMATION.md) for detailed documentation
- View [animation-examples.html](animation-examples.html) for live demos
- Test with [animation-test.html](animation-test.html)
- See [IMPLEMENTATION-SUMMARY.md](IMPLEMENTATION-SUMMARY.md) for technical details

## Quick Links

- 📚 [Full Documentation](ANIMATION.md)
- ⚡ [Quick Reference](ANIMATION-QUICK-REF.md)
- 🎨 [Live Examples](animation-examples.html)
- 🧪 [Test Page](animation-test.html)
- 📦 [Main README](README.md)

/**
 * ModalAnimations - Animation Repository
 * A collection of reusable modal animations that can be chained or passed as arguments
 * 
 * Usage:
 * - As animation option: new Modal({ animation: ModalAnimations.fromElementToCenter })
 * - Chain animations: ModalAnimations.chain(animation1, animation2)
 * - Custom animation: ModalAnimations.create({ show: (modal, trigger) => {...}, hide: (modal) => {...} })
 */
const ModalAnimations = {
    /**
     * Default animation - Opens from clicked element position/size to center
     * Modal appears at the trigger element with 0 opacity, then moves to center with opacity 1
     */
    fromElementToCenter: {
        show: async (modal, triggerElement) => {
            const container = modal.elements.container;
            const overlay = modal.elements.overlay;
            
            // Get trigger element position and size
            let startRect = { left: window.innerWidth / 2, top: window.innerHeight / 2, width: 0, height: 0 };
            if (triggerElement) {
                startRect = triggerElement.getBoundingClientRect();
            }
            
            // Get final position (center of screen)
            const finalRect = container.getBoundingClientRect();
            const centerLeft = (window.innerWidth - finalRect.width) / 2;
            const centerTop = (window.innerHeight - finalRect.height) / 2;
            
            // Set initial state (at trigger element position with 0 opacity)
            container.style.position = 'fixed';
            container.style.left = `${startRect.left + startRect.width / 2}px`;
            container.style.top = `${startRect.top + startRect.height / 2}px`;
            container.style.transform = 'translate(-50%, -50%) scale(0.1)';
            container.style.opacity = '0';
            container.style.transition = 'none';
            
            overlay.style.opacity = '0';
            overlay.style.transition = 'none';
            
            // Force reflow
            container.offsetHeight;
            
            // Animate to center
            container.style.transition = 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
            overlay.style.transition = 'opacity 0.4s ease';
            
            requestAnimationFrame(() => {
                container.style.left = `${centerLeft}px`;
                container.style.top = `${centerTop}px`;
                container.style.transform = 'translate(0, 0) scale(1)';
                container.style.opacity = '1';
                overlay.style.opacity = '1';
            });
            
            return new Promise(resolve => setTimeout(resolve, 400));
        },
        
        hide: async (modal) => {
            const container = modal.elements.container;
            const overlay = modal.elements.overlay;
            
            container.style.transition = 'all 0.3s ease';
            overlay.style.transition = 'opacity 0.3s ease';
            
            container.style.transform = 'translate(0, 0) scale(0.8)';
            container.style.opacity = '0';
            overlay.style.opacity = '0';
            
            return new Promise(resolve => setTimeout(resolve, 300));
        }
    },

    /**
     * Fade animation - Simple fade in/out
     */
    fade: {
        show: async (modal) => {
            const container = modal.elements.container;
            const overlay = modal.elements.overlay;
            
            container.style.opacity = '0';
            container.style.transform = 'scale(1)';
            container.style.transition = 'opacity 0.3s ease';
            overlay.style.transition = 'opacity 0.3s ease';
            
            requestAnimationFrame(() => {
                container.style.opacity = '1';
                overlay.style.opacity = '1';
            });
            
            return new Promise(resolve => setTimeout(resolve, 300));
        },
        
        hide: async (modal) => {
            if (!modal.elements) return Promise.resolve();
            const container = modal.elements.container;
            const overlay = modal.elements.overlay;
            
            container.style.transition = 'opacity 0.3s ease';
            overlay.style.transition = 'opacity 0.3s ease';
            
            container.style.opacity = '0';
            overlay.style.opacity = '0';
            
            return new Promise(resolve => setTimeout(resolve, 300));
        }
    },

    /**
     * Slide from top animation
     */
    slideFromTop: {
        show: async (modal) => {
            const container = modal.elements.container;
            const overlay = modal.elements.overlay;
            
            container.style.transform = 'translateY(-100vh)';
            container.style.opacity = '1';
            container.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
            overlay.style.transition = 'opacity 0.4s ease';
            
            requestAnimationFrame(() => {
                container.style.transform = 'translateY(0)';
                overlay.style.opacity = '1';
            });
            
            return new Promise(resolve => setTimeout(resolve, 400));
        },
        
        hide: async (modal) => {
            if (!modal.elements) return Promise.resolve();
            const container = modal.elements.container;
            const overlay = modal.elements.overlay;
            
            container.style.transition = 'transform 0.3s ease';
            overlay.style.transition = 'opacity 0.3s ease';
            
            container.style.transform = 'translateY(-100vh)';
            overlay.style.opacity = '0';
            
            return new Promise(resolve => setTimeout(resolve, 300));
        }
    },

    /**
     * Slide from bottom animation
     */
    slideFromBottom: {
        show: async (modal) => {
            const container = modal.elements.container;
            const overlay = modal.elements.overlay;
            
            container.style.transform = 'translateY(100vh)';
            container.style.opacity = '1';
            container.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
            overlay.style.transition = 'opacity 0.4s ease';
            
            requestAnimationFrame(() => {
                container.style.transform = 'translateY(0)';
                overlay.style.opacity = '1';
            });
            
            return new Promise(resolve => setTimeout(resolve, 400));
        },
        
        hide: async (modal) => {
            if (!modal.elements) return Promise.resolve();
            const container = modal.elements.container;
            const overlay = modal.elements.overlay;
            
            container.style.transition = 'transform 0.3s ease';
            overlay.style.transition = 'opacity 0.3s ease';
            
            container.style.transform = 'translateY(100vh)';
            overlay.style.opacity = '0';
            
            return new Promise(resolve => setTimeout(resolve, 300));
        }
    },

    /**
     * Zoom animation - Scale from small to normal
     */
    zoom: {
        show: async (modal) => {
            const container = modal.elements.container;
            const overlay = modal.elements.overlay;
            
            container.style.transform = 'scale(0.3)';
            container.style.opacity = '0';
            container.style.transition = 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
            overlay.style.transition = 'opacity 0.4s ease';
            
            requestAnimationFrame(() => {
                container.style.transform = 'scale(1)';
                container.style.opacity = '1';
                overlay.style.opacity = '1';
            });
            
            return new Promise(resolve => setTimeout(resolve, 400));
        },
        
        hide: async (modal) => {
            if (!modal.elements) return Promise.resolve();
            const container = modal.elements.container;
            const overlay = modal.elements.overlay;
            
            container.style.transition = 'all 0.3s ease';
            overlay.style.transition = 'opacity 0.3s ease';
            
            container.style.transform = 'scale(0.5)';
            container.style.opacity = '0';
            overlay.style.opacity = '0';
            
            return new Promise(resolve => setTimeout(resolve, 300));
        }
    },

    /**
     * Flip animation - 3D flip effect
     */
    flip: {
        show: async (modal) => {
            const container = modal.elements.container;
            const overlay = modal.elements.overlay;
            
            container.style.transform = 'perspective(1000px) rotateX(-90deg)';
            container.style.opacity = '0';
            container.style.transition = 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
            overlay.style.transition = 'opacity 0.5s ease';
            
            requestAnimationFrame(() => {
                container.style.transform = 'perspective(1000px) rotateX(0deg)';
                container.style.opacity = '1';
                overlay.style.opacity = '1';
            });
            
            return new Promise(resolve => setTimeout(resolve, 500));
        },
        
        hide: async (modal) => {
            if (!modal.elements) return Promise.resolve();
            const container = modal.elements.container;
            const overlay = modal.elements.overlay;
            
            container.style.transition = 'all 0.3s ease';
            overlay.style.transition = 'opacity 0.3s ease';
            
            container.style.transform = 'perspective(1000px) rotateX(90deg)';
            container.style.opacity = '0';
            overlay.style.opacity = '0';
            
            return new Promise(resolve => setTimeout(resolve, 300));
        }
    },

    /**
     * Rotate and scale animation
     */
    rotateScale: {
        show: async (modal) => {
            const container = modal.elements.container;
            const overlay = modal.elements.overlay;
            
            container.style.transform = 'scale(0.3) rotate(-180deg)';
            container.style.opacity = '0';
            container.style.transition = 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
            overlay.style.transition = 'opacity 0.5s ease';
            
            requestAnimationFrame(() => {
                container.style.transform = 'scale(1) rotate(0deg)';
                container.style.opacity = '1';
                overlay.style.opacity = '1';
            });
            
            return new Promise(resolve => setTimeout(resolve, 500));
        },
        
        hide: async (modal) => {
            if (!modal.elements) return Promise.resolve();
            const container = modal.elements.container;
            const overlay = modal.elements.overlay;
            
            container.style.transition = 'all 0.3s ease';
            overlay.style.transition = 'opacity 0.3s ease';
            
            container.style.transform = 'scale(0.5) rotate(180deg)';
            container.style.opacity = '0';
            overlay.style.opacity = '0';
            
            return new Promise(resolve => setTimeout(resolve, 300));
        }
    },

    /**
     * No animation - Instant show/hide
     */
    none: {
        show: async (modal) => {
            const container = modal.elements.container;
            const overlay = modal.elements.overlay;
            
            container.style.opacity = '1';
            container.style.transform = 'none';
            overlay.style.opacity = '1';
            
            return Promise.resolve();
        },
        
        hide: async (modal) => {
            return Promise.resolve();
        }
    },

    /**
     * Create a custom animation
     * @param {Object} config - Animation configuration
     * @param {Function} config.show - Show animation function (modal, triggerElement) => Promise
     * @param {Function} config.hide - Hide animation function (modal) => Promise
     * @returns {Object} Animation object
     */
    create: (config) => {
        if (!config.show || !config.hide) {
            throw new Error('Animation must have show and hide functions');
        }
        return {
            show: config.show,
            hide: config.hide
        };
    },

    /**
     * Chain multiple animations to run in sequence
     * @param {...Object} animations - Animation objects to chain
     * @returns {Object} Chained animation object
     */
    chain: (...animations) => {
        return {
            show: async (modal, triggerElement) => {
                for (const animation of animations) {
                    await animation.show(modal, triggerElement);
                }
            },
            hide: async (modal) => {
                for (const animation of animations.reverse()) {
                    await animation.hide(modal);
                }
            }
        };
    },

    /**
     * Combine multiple animations to run in parallel
     * @param {...Object} animations - Animation objects to run in parallel
     * @returns {Object} Combined animation object
     */
    parallel: (...animations) => {
        return {
            show: async (modal, triggerElement) => {
                await Promise.all(animations.map(anim => anim.show(modal, triggerElement)));
            },
            hide: async (modal) => {
                await Promise.all(animations.map(anim => anim.hide(modal)));
            }
        };
    }
};

/**
 * Modal Component
 * A reusable modal dialog with template-based rendering
 * 
 * Usage:
 * const modal = new Modal({
 *     title: 'Confirm Action',
 *     body: '<p>Are you sure?</p>',
 *     primaryButton: { text: 'Confirm', onClick: () => console.log('Confirmed') },
 *     secondaryButton: { text: 'Cancel', onClick: () => modal.hide() },
 *     animation: ModalAnimations.fade // Optional animation (default is fade)
 * });
 * modal.show(triggerElement); // Pass trigger element for position-based animations
 */

class Modal {
    static template = null;
    static templateLoaded = false;
    static loadPromise = null;

    /**
     * Create a new Modal instance
     * @param {Object} options - Configuration options
     * @param {string} options.title - Modal title
     * @param {string|HTMLElement} options.body - Modal body content (HTML string or DOM element)
     * @param {Object} options.primaryButton - Primary button config { text, onClick, disabled }
     * @param {Object} options.secondaryButton - Secondary button config { text, onClick, disabled }
     * @param {boolean} options.closeOnOverlay - Close modal when clicking overlay (default: true)
     * @param {boolean} options.closeOnEscape - Close modal on Escape key (default: true)
     * @param {Function} options.onClose - Callback when modal closes
     * @param {boolean} options.showCloseButton - Show X button in header (default: true)
     * @param {Object} options.animation - Animation to use (default: ModalAnimations.fade)
     */
    constructor(options = {}) {
        this.options = {
            title: '',
            body: '',
            primaryButton: null,
            secondaryButton: null,
            closeOnOverlay: true,
            closeOnEscape: true,
            showCloseButton: true,
            onClose: null,
            animation: ModalAnimations.fade, // Default animation
            ...options
        };

        this.element = null;
        this.isVisible = false;
        this.handlers = new Map();
        this.initPromise = null;
        this.triggerElement = null; // Store trigger element for animations
        
        this.initPromise = this._init();
    }

    /**
     * Load the modal template
     */
    static async loadTemplate() {
        if (this.templateLoaded && this.template) {
            return this.template;
        }

        if (this.loadPromise) {
            return this.loadPromise;
        }

        this.loadPromise = (async () => {
            try {
                const response = await fetch('/components/modal/modal.html');
                const html = await response.text();
                
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const template = doc.querySelector('#modal-template');
                
                if (!template) {
                    throw new Error('Modal template not found');
                }

                this.template = template;
                this.templateLoaded = true;
                return template;
            } catch (error) {
                console.error('Failed to load modal template:', error);
                throw error;
            }
        })();

        return this.loadPromise;
    }

    /**
     * Initialize modal element from template
     */
    async _init() {
        const template = await Modal.loadTemplate();
        const clone = template.content.cloneNode(true);
        
        this.element = clone.querySelector('.modal-overlay');
        document.body.appendChild(this.element);

        this._setupElements();
        this._setupEventListeners();
        this._render();
    }

    /**
     * Cache references to modal elements
     */
    _setupElements() {
        this.elements = {
            overlay: this.element,
            container: this.element.querySelector('.modal-container'),
            title: this.element.querySelector('.modal-title'),
            closeBtn: this.element.querySelector('.modal-close'),
            body: this.element.querySelector('.modal-body'),
            footer: this.element.querySelector('.modal-footer'),
            primaryBtn: this.element.querySelector('.modal-btn-primary'),
            secondaryBtn: this.element.querySelector('.modal-btn-secondary')
        };
    }

    /**
     * Setup event listeners
     */
    _setupEventListeners() {
        // Close button
        this.handlers.set('close', () => this.hide());
        this.elements.closeBtn.addEventListener('click', this.handlers.get('close'));

        // Overlay click
        if (this.options.closeOnOverlay) {
            this.handlers.set('overlay', (e) => {
                if (this.elements && e.target === this.elements.overlay) {
                    this._shakeModal();
                    this.hide();
                }
            });
            this.elements.overlay.addEventListener('click', this.handlers.get('overlay'));
        }

        // Escape key
        if (this.options.closeOnEscape) {
            this.handlers.set('escape', (e) => {
                if (this.elements && e.key === 'Escape' && this.isVisible) {
                    this.hide();
                }
            });
            document.addEventListener('keydown', this.handlers.get('escape'));
        }

        // Primary button
        if (this.options.primaryButton) {
            this.handlers.set('primary', async (e) => {
                e.preventDefault();
                if (this.options.primaryButton.onClick) {
                    const result = await this.options.primaryButton.onClick(this);
                    // Only auto-close if onClick doesn't return false
                    if (result !== false) {
                        this.hide();
                    }
                } else {
                    this.hide();
                }
            });
            this.elements.primaryBtn.addEventListener('click', this.handlers.get('primary'));
        }

        // Secondary button
        if (this.options.secondaryButton) {
            this.handlers.set('secondary', async (e) => {
                e.preventDefault();
                if (this.options.secondaryButton.onClick) {
                    const result = await this.options.secondaryButton.onClick(this);
                    if (result !== false) {
                        this.hide();
                    }
                } else {
                    this.hide();
                }
            });
            this.elements.secondaryBtn.addEventListener('click', this.handlers.get('secondary'));
        }
    }

    /**
     * Render modal content
     */
    _render() {
        // Title
        this.elements.title.textContent = this.options.title;

        // Close button visibility
        this.elements.closeBtn.style.display = this.options.showCloseButton ? 'flex' : 'none';

        // Body
        if (typeof this.options.body === 'string') {
            this.elements.body.innerHTML = this.options.body;
        } else if (this.options.body instanceof HTMLElement) {
            this.elements.body.innerHTML = '';
            this.elements.body.appendChild(this.options.body);
        }

        // Buttons
        if (this.options.primaryButton) {
            this.elements.primaryBtn.textContent = this.options.primaryButton.text || 'OK';
            this.elements.primaryBtn.disabled = this.options.primaryButton.disabled || false;
            this.elements.primaryBtn.style.display = 'block';
        } else {
            this.elements.primaryBtn.style.display = 'none';
        }

        if (this.options.secondaryButton) {
            this.elements.secondaryBtn.textContent = this.options.secondaryButton.text || 'Cancel';
            this.elements.secondaryBtn.disabled = this.options.secondaryButton.disabled || false;
            this.elements.secondaryBtn.style.display = 'block';
        } else {
            this.elements.secondaryBtn.style.display = 'none';
        }

        // Hide footer if no buttons
        if (!this.options.primaryButton && !this.options.secondaryButton) {
            this.elements.footer.style.display = 'none';
        }
    }

    /**
     * Shake modal animation (for invalid actions)
     */
    _shakeModal() {
        this.elements.container.classList.add('modal-shake');
        setTimeout(() => {
            this.elements.container.classList.remove('modal-shake');
        }, 300);
    }

    /**
     * Show the modal
     * @param {HTMLElement} triggerElement - The element that triggered the modal (for animations)
     */
    async show(triggerElement = null) {
        if (this.isVisible) return;
        
        // Wait for initialization to complete
        await this.initPromise;
        
        this.triggerElement = triggerElement;
        this.isVisible = true;
        
        // Display overlay
        this.elements.overlay.style.display = 'flex';
        
        // Trigger reflow
        this.element.offsetHeight;
        
        // Run show animation
        if (this.options.animation && this.options.animation.show) {
            await this.options.animation.show(this, triggerElement);
        } else {
            // Fallback to default CSS animation
            this.elements.overlay.classList.add('modal-show');
        }
        
        // Focus first input if exists
        setTimeout(() => {
            const firstInput = this.elements.body.querySelector('input, textarea, select');
            if (firstInput) {
                firstInput.focus();
            }
        }, 100);
    }

    /**
     * Hide the modal
     */
    async hide() {
        if (!this.isVisible) return;
        
        this.isVisible = false;
        
        // Run hide animation (check if elements still exist)
        if (this.options.animation && this.options.animation.hide && this.elements) {
            await this.options.animation.hide(this);
        } else if (this.elements) {
            // Fallback to default CSS animation
            this.elements.overlay.classList.remove('modal-show');
        }
        
        // Hide overlay after animation
        setTimeout(() => {
            if (!this.isVisible && this.elements && this.elements.overlay) {
                this.elements.overlay.style.display = 'none';
            }
        }, 50);
        
        if (this.options.onClose) {
            this.options.onClose(this);
        }
    }

    /**
     * Update modal options
     * @param {Object} options - Options to update
     */
    update(options) {
        this.options = { ...this.options, ...options };
        this._render();
    }

    /**
     * Get input value from modal body
     * @param {string} selector - CSS selector for input element
     */
    getInputValue(selector) {
        const input = this.elements.body.querySelector(selector);
        return input ? input.value : null;
    }

    /**
     * Set input value in modal body
     * @param {string} selector - CSS selector for input element
     * @param {string} value - Value to set
     */
    setInputValue(selector, value) {
        const input = this.elements.body.querySelector(selector);
        if (input) {
            input.value = value;
        }
    }

    /**
     * Enable/disable buttons
     */
    setButtonDisabled(button, disabled) {
        if (button === 'primary') {
            this.elements.primaryBtn.disabled = disabled;
        } else if (button === 'secondary') {
            this.elements.secondaryBtn.disabled = disabled;
        }
    }

    /**
     * Destroy modal and clean up
     */
    destroy() {
        if (!this.element) return; // Already destroyed

        // Remove all event listeners
        if (this.handlers.has('close')) {
            this.elements.closeBtn.removeEventListener('click', this.handlers.get('close'));
        }
        if (this.handlers.has('overlay')) {
            this.elements.overlay.removeEventListener('click', this.handlers.get('overlay'));
        }
        if (this.handlers.has('escape')) {
            document.removeEventListener('keydown', this.handlers.get('escape'));
        }
        if (this.handlers.has('primary')) {
            this.elements.primaryBtn.removeEventListener('click', this.handlers.get('primary'));
        }
        if (this.handlers.has('secondary')) {
            this.elements.secondaryBtn.removeEventListener('click', this.handlers.get('secondary'));
        }

        // Remove element
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }

        this.element = null;
        this.elements = null;
        this.handlers.clear();
    }

    /**
     * Static helper to create a simple confirm dialog
     */
    static confirm(title, message, onConfirm) {
        const modal = new Modal({
            title,
            body: `<p class="modal-text">${message}</p>`,
            primaryButton: {
                text: 'Confirm',
                onClick: () => {
                    if (onConfirm) onConfirm();
                }
            },
            secondaryButton: {
                text: 'Cancel'
            },
            onClose: () => modal.destroy()
        });
        modal.show();
        return modal;
    }

    /**
     * Static helper to create a simple alert dialog
     */
    static alert(title, message, onClose) {
        const modal = new Modal({
            title,
            body: `<p class="modal-text">${message}</p>`,
            primaryButton: {
                text: 'OK',
                onClick: () => {
                    if (onClose) onClose();
                }
            },
            onClose: () => modal.destroy()
        });
        modal.show();
        return modal;
    }

    /**
     * Static helper to create a prompt dialog
     */
    static prompt(title, placeholder, onSubmit) {
        const modal = new Modal({
            title,
            body: `<input type="text" class="modal-input" placeholder="${placeholder}" />`,
            primaryButton: {
                text: 'Submit',
                onClick: (modalInstance) => {
                    const value = modalInstance.getInputValue('.modal-input');
                    if (value && onSubmit) {
                        onSubmit(value);
                    }
                    return value ? true : false; // Prevent close if empty
                }
            },
            secondaryButton: {
                text: 'Cancel'
            },
            onClose: () => modal.destroy()
        });
        modal.show();
        return modal;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Modal;
}

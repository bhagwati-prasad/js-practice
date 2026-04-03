/**
 * ContextMenu Component
 *
 * A singleton context menu available throughout the app.
 * Pages register named menus and bind action handlers — the component
 * handles positioning, keyboard nav, and dispatching.
 *
 * ── Quick start ─────────────────────────────────────────────────────────────
 *
 * 1. Include the script (once, globally — e.g. in app.js or each page):
 *      <script src="/components/contextMenu/contextMenu.js"></script>
 *
 * 2. Register a menu (static items):
 *      contextMenu.register('noteItem', [
    *          { label: 'Edit',   icon: 'pencil', action: 'note:edit'   },
    *          { label: 'Delete', icon: 'trash-2', action: 'note:delete', danger: true },
 *      ]);
 *
 *    Or register with a factory (dynamic items evaluated at open-time):
 *      contextMenu.register('noteItem', (target, data) => [
 *          { label: data.pinned === 'true' ? 'Unpin' : 'Pin', action: 'note:pin' },
 *          { type: 'separator' },
 *          { label: 'Delete', action: 'note:delete', danger: true },
 *      ]);
 *
 * 3. Bind elements via HTML attribute (declarative — works with event delegation):
 *      <li data-context-menu="noteItem" data-context-id="abc123" data-context-pinned="true">
 *    All data-context-* attrs (except data-context-menu itself) are collected
 *    and passed as `data` to both the factory and the action handler.
 *    Attribute name mapping: data-context-note-id → data.noteId
 *
 *    Or bind programmatically (for dynamic elements):
 *      contextMenu.bind(element, 'noteItem', { id: note.id, pinned: note.pinned });
 *
 * 4. Handle actions (on the same page or a shared module):
 *      contextMenu.on('note:edit', ({ target, data, item }) => {
 *          openEditor(data.id);
 *      });
 *
 *      contextMenu.on('note:delete', ({ target, data }) => {
 *          deleteNote(data.id);
 *      });
 *
 * 5. Clean up when a page is torn down (SPA navigation):
 *      contextMenu.off('note:edit');  // remove all handlers for this action
 *      contextMenu.off('note:edit', specificHandler);  // remove one
 *
 * ── Item shape ───────────────────────────────────────────────────────────────
 *
 *   { label, action, icon?, disabled?, danger? }
 *   { type: 'separator' }
 *
 * ── API ──────────────────────────────────────────────────────────────────────
 *
 *   contextMenu.register(name, items | factory)
 *   contextMenu.unregister(name)
 *   contextMenu.on(action, handler)
 *   contextMenu.off(action, handler?)
 *   contextMenu.bind(element, menuName, data?)
 *   contextMenu.open(x, y, items)   ← ad-hoc, no registry needed
 *   contextMenu.close()
 */

class ContextMenu {
    #menu = null;
    #currentTarget = null;
    #currentData = null;
    #registry = new Map();   // menuName → items[] | (target, data) => items[]
    #handlers = new Map();   // action   → Set<handler>

    constructor() {
        this._buildDOM();
        this._bindGlobalEvents();
    }

    // ── Public API ────────────────────────────────────────────────────────────

    /**
     * Register a named menu.
     * @param {string} name
     * @param {Array|Function} itemsOrFactory  Static array or (target, data) => Array
     * @returns {ContextMenu}
     */
    register(name, itemsOrFactory) {
        this.#registry.set(name, itemsOrFactory);
        return this;
    }

    /**
     * Remove a registered menu.
     * @param {string} name
     * @returns {ContextMenu}
     */
    unregister(name) {
        this.#registry.delete(name);
        return this;
    }

    /**
     * Subscribe to an action.
     * @param {string} action
     * @param {Function} handler  Receives { target, data, item }
     * @returns {ContextMenu}
     */
    on(action, handler) {
        if (!this.#handlers.has(action)) {
            this.#handlers.set(action, new Set());
        }
        this.#handlers.get(action).add(handler);
        return this;
    }

    /**
     * Unsubscribe from an action.
     * @param {string} action
     * @param {Function} [handler]  Omit to remove all handlers for this action
     * @returns {ContextMenu}
     */
    off(action, handler) {
        if (!handler) {
            this.#handlers.delete(action);
        } else {
            this.#handlers.get(action)?.delete(handler);
        }
        return this;
    }

    /**
     * Programmatically bind a DOM element to a named menu.
     * Use this for dynamically created elements that can't use data attributes.
     * @param {HTMLElement} element
     * @param {string} menuName
     * @param {Object} [data={}]
     * @returns {ContextMenu}
     */
    bind(element, menuName, data = {}) {
        element.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this._openForTarget(e, element, menuName, data);
        });
        return this;
    }

    /**
     * Open with an explicit item list (no registry lookup).
     * Useful for one-off menus that don't need a registered name.
     * @param {number} x
     * @param {number} y
     * @param {Array} items
     */
    open(x, y, items) {
        this.#currentTarget = null;
        this.#currentData = null;
        this._render(items);
        this._position(x, y);
        this.#menu.classList.add('context-menu--visible');
        this._focusFirst();
    }

    close() {
        this.#menu.classList.remove('context-menu--visible');
        this.#currentTarget = null;
        this.#currentData = null;
    }

    // ── Private ───────────────────────────────────────────────────────────────

    _buildDOM() {
        this.#menu = document.createElement('ul');
        this.#menu.className = 'context-menu';
        this.#menu.setAttribute('role', 'menu');
        this.#menu.setAttribute('aria-label', 'Context menu');
        document.body.appendChild(this.#menu);
    }

    _bindGlobalEvents() {
        // Declarative binding via data-context-menu attribute
        document.addEventListener('contextmenu', (e) => {
            const trigger = e.target.closest('[data-context-menu]');

            // No matching trigger → let browser default run (or another handler)
            if (!trigger) {
                this.close();
                return;
            }

            e.preventDefault();

            const menuName = trigger.dataset.contextMenu;

            // Collect data-context-<key> attributes → { key: value }
            const data = {};
            for (const [attrKey, attrVal] of Object.entries(trigger.dataset)) {
                if (attrKey === 'contextMenu') continue;
                if (!attrKey.startsWith('context')) continue;
                // "contextNoteId" → "noteId",  "contextId" → "id"
                const stripped = attrKey.slice('context'.length);
                const key = stripped.charAt(0).toLowerCase() + stripped.slice(1);
                data[key] = attrVal;
            }

            this._openForTarget(e, trigger, menuName, data);
        });

        // Close on any outside click
        document.addEventListener('pointerdown', (e) => {
            if (!this.#menu.contains(e.target)) {
                this.close();
            }
        });

        // Keyboard: Escape closes, Arrow keys navigate
        document.addEventListener('keydown', (e) => {
            if (!this.#menu.classList.contains('context-menu--visible')) return;

            if (e.key === 'Escape') {
                this.close();
                return;
            }

            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                e.preventDefault();
                this._moveFocus(e.key === 'ArrowDown' ? 1 : -1);
            }
        });

        // Close on scroll (menu position would be stale)
        document.addEventListener('scroll', () => this.close(), { passive: true, capture: true });
    }

    _openForTarget(event, target, menuName, data) {
        const factory = this.#registry.get(menuName);
        if (!factory) {
            console.warn(`ContextMenu: no menu registered as "${menuName}"`);
            return;
        }

        const items = typeof factory === 'function'
            ? factory(target, data)
            : factory;

        if (!Array.isArray(items) || items.length === 0) return;

        this.#currentTarget = target;
        this.#currentData = data;

        this._render(items);
        this._position(event.clientX, event.clientY);
        this.#menu.classList.add('context-menu--visible');
        this._focusFirst();
    }

    _render(items) {
        this.#menu.innerHTML = '';

        for (const item of items) {
            if (item.type === 'separator') {
                const sep = document.createElement('li');
                sep.className = 'context-menu__separator';
                sep.setAttribute('role', 'separator');
                this.#menu.appendChild(sep);
                continue;
            }

            const li = document.createElement('li');
            li.className = 'context-menu__item';
            li.setAttribute('role', 'menuitem');

            if (item.disabled) {
                li.classList.add('context-menu__item--disabled');
                li.setAttribute('aria-disabled', 'true');
            } else {
                li.tabIndex = 0;
            }

            if (item.danger) {
                li.classList.add('context-menu__item--danger');
            }

            if (item.icon) {
                const icon = document.createElement('span');
                icon.className = 'context-menu__icon';
                icon.setAttribute('aria-hidden', 'true');
                icon.textContent = item.icon;
                li.appendChild(icon);
            }

            const label = document.createElement('span');
            label.className = 'context-menu__label';
            label.textContent = item.label;
            li.appendChild(label);

            if (!item.disabled) {
                li.addEventListener('click', () => {
                    this._dispatch(item.action, item);
                    this.close();
                });

                li.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        this._dispatch(item.action, item);
                        this.close();
                    }
                });
            }

            this.#menu.appendChild(li);
        }
    }

    _position(x, y) {
        // Measure off-screen to get true dimensions before showing
        this.#menu.style.visibility = 'hidden';
        this.#menu.style.display = 'block';

        const menuWidth = this.#menu.offsetWidth;
        const menuHeight = this.#menu.offsetHeight;
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const padding = 8; // keep off edge

        const left = (x + menuWidth + padding > vw) ? x - menuWidth : x;
        const top  = (y + menuHeight + padding > vh) ? y - menuHeight : y;

        this.#menu.style.left = `${Math.max(padding, left)}px`;
        this.#menu.style.top  = `${Math.max(padding, top)}px`;
        this.#menu.style.visibility = '';
        this.#menu.style.display = '';
    }

    _focusFirst() {
        const first = this.#menu.querySelector('.context-menu__item:not(.context-menu__item--disabled)');
        first?.focus();
    }

    _moveFocus(direction) {
        const items = Array.from(
            this.#menu.querySelectorAll('.context-menu__item:not(.context-menu__item--disabled)')
        );
        if (!items.length) return;

        const current = document.activeElement;
        const index = items.indexOf(current);
        const next = items[(index + direction + items.length) % items.length];
        next?.focus();
    }

    _dispatch(action, item) {
        const handlers = this.#handlers.get(action);
        if (!handlers?.size) return;

        const payload = {
            target: this.#currentTarget,
            data: this.#currentData,
            item,
        };

        for (const handler of handlers) {
            try {
                handler(payload);
            } catch (err) {
                console.error(`ContextMenu: error in handler for "${action}"`, err);
            }
        }
    }
}

// Single global instance — available as window.contextMenu on every page
window.contextMenu = new ContextMenu();

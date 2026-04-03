# ContextMenu Component

A singleton, theme-aware context menu available throughout the app.

---

## Files

```
components/contextMenu/
├── contextMenu.js   — Core component (creates window.contextMenu)
└── contextMenu.css  — Styles (uses app theme variables)
```

---

## Include on a Page

Add both files to any page that uses context menus:

```html
<link rel="stylesheet" href="/components/contextMenu/contextMenu.css">
<!-- ... other scripts ... -->
<script src="/components/contextMenu/contextMenu.js"></script>
```

---

## How It Works — The Three Parts

### 1. Register a menu (define what items appear)

Menus are registered by name. Items can be static or computed at open-time via a factory function.

**Static items:**
```js
contextMenu.register('noteItem', [
    { label: 'Edit',   icon: '✏️', action: 'note:edit'   },
    { label: 'Copy',   icon: '📋', action: 'note:copy'   },
    { type: 'separator' },
    { label: 'Delete', icon: '🗑️', action: 'note:delete', danger: true },
]);
```

**Factory function** (evaluated every time the menu opens — use when items depend on current state):
```js
contextMenu.register('noteItem', (target, data) => {
    const note = noteStore.get(data.id);
    return [
        { label: 'Edit', action: 'note:edit' },
        {
            label: note.pinned ? 'Unpin' : 'Pin',
            icon:  note.pinned ? '📍' : '📌',
            action: 'note:pin',
        },
        { type: 'separator' },
        { label: 'Delete', action: 'note:delete', danger: true },
        { label: 'Archive (unavailable)', action: 'note:archive', disabled: true },
    ];
});
```

### 2. Bind elements (trigger the menu on right-click)

**Declarative — via HTML attributes** (preferred, works with dynamic lists via event delegation):
```html
<li class="note-item"
    data-context-menu="noteItem"
    data-context-id="abc123"
    data-context-pinned="true">
    My Note
</li>
```

All `data-context-*` attributes (except `data-context-menu` itself) are automatically collected into the `data` object passed to your factory and handlers:
- `data-context-id="abc123"` → `data.id === "abc123"`
- `data-context-note-type="code"` → `data.noteType === "code"`

**Programmatic — for JS-created elements:**
```js
contextMenu.bind(element, 'noteItem', { id: note.id, pinned: note.pinned });
```

### 3. Handle actions (respond to clicks)

```js
contextMenu.on('note:edit', ({ target, data, item }) => {
    // target — the DOM element that was right-clicked
    // data   — the collected data-context-* values (strings)
    // item   — the menu item object that was clicked
    openNoteEditor(data.id);
});

contextMenu.on('note:delete', ({ target, data }) => {
    deleteNote(data.id);
});

contextMenu.on('note:pin', ({ data }) => {
    togglePin(data.id);
});
```

---

## Item Shape

| Field      | Type      | Required | Description                        |
|------------|-----------|----------|------------------------------------|
| `label`    | `string`  | ✅       | Displayed text                     |
| `action`   | `string`  | ✅       | Dispatched to `contextMenu.on()`   |
| `icon`     | `string`  |          | Emoji or short text shown left     |
| `disabled` | `boolean` |          | Greys out, non-clickable           |
| `danger`   | `boolean` |          | Renders in error/red colour        |
| `type`     | `'separator'` |      | Renders a horizontal divider       |

---

## Full API

| Method | Description |
|---|---|
| `register(name, items \| factory)` | Register a named menu |
| `unregister(name)` | Remove a registered menu |
| `on(action, handler)` | Subscribe to an action |
| `off(action, handler?)` | Unsubscribe (omit handler to remove all) |
| `bind(element, menuName, data?)` | Bind a JS element to a named menu |
| `open(x, y, items)` | Open an ad-hoc menu at coordinates |
| `close()` | Close the menu |

---

## Cleanup (SPA / page transitions)

When navigating away from a page, remove its action handlers to prevent stale callbacks:

```js
// Remove all handlers for these actions when leaving the notes page
contextMenu.off('note:edit');
contextMenu.off('note:delete');
contextMenu.off('note:pin');

// Or keep a reference and remove just one:
const handleEdit = ({ data }) => openEditor(data.id);
contextMenu.on('note:edit', handleEdit);
// later:
contextMenu.off('note:edit', handleEdit);
```

---

## Using on Multiple Pages / Contexts

Different areas of the same page can use different menu names:

```html
<!-- Notes list item -->
<li data-context-menu="noteItem" data-context-id="n1">My Note</li>

<!-- Collection folder -->
<div data-context-menu="collectionFolder" data-context-collection-id="c1">My Collection</div>

<!-- Code block inside a note -->
<pre data-context-menu="codeBlock" data-context-lang="js">...</pre>
```

Each registers independently:
```js
contextMenu.register('collectionFolder', [ /* ... */ ]);
contextMenu.register('codeBlock', [ /* ... */ ]);

contextMenu.on('collection:rename', ({ data }) => renameCollection(data.collectionId));
contextMenu.on('codeBlock:copy',    ({ target }) => copyElementText(target));
```

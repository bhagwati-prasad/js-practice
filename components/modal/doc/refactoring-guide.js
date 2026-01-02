/**
 * Example: How to refactor existing modals in uiController.js
 * to use the new Modal component
 */

// ==============================================================
// BEFORE: Old approach with hardcoded HTML modals
// ==============================================================

// Old initialization (REMOVE THIS)
function initOLD() {
    elements = {
        // ... other elements ...
        collectionModal: document.getElementById('collectionModal'),
        collectionNameInput: document.getElementById('collectionNameInput'),
        cancelCollectionBtn: document.getElementById('cancelCollectionBtn'),
        createCollectionBtn: document.getElementById('createCollectionBtn'),
        // ... more modal elements ...
    };

    // Old event listeners (REMOVE THIS)
    elements.addCollectionBtn.addEventListener('click', openCollectionModal);
    elements.cancelCollectionBtn.addEventListener('click', closeCollectionModal);
    elements.createCollectionBtn.addEventListener('click', createCollection);
}

// Old modal functions (REMOVE THIS)
function openCollectionModal() {
    elements.collectionNameInput.value = '';
    elements.collectionModal.classList.add('show');
    elements.collectionNameInput.focus();
}

function closeCollectionModal() {
    elements.collectionModal.classList.remove('show');
}

function createCollection() {
    const name = elements.collectionNameInput.value.trim();
    if (name) {
        NoteBook.addCollection(name);
        closeCollectionModal();
        renderCollectionTree();
    }
}

// ==============================================================
// AFTER: New approach with Modal component
// ==============================================================

// New initialization (ADD THIS)
function initNEW() {
    elements = {
        // ... other elements ...
        addCollectionBtn: document.getElementById('addCollectionBtn'),
        addNotebookBtn: document.getElementById('addNotebookBtn'),
        // No need to reference modal DOM elements anymore!
    };

    // New event listeners - much simpler!
    elements.addCollectionBtn.addEventListener('click', openCollectionModal);
    elements.addNotebookBtn.addEventListener('click', openNotebookModal);
}

// New modal function - cleaner and reusable
function openCollectionModal() {
    const modal = new Modal({
        title: 'New Collection',
        body: '<input type="text" class="modal-input" id="collectionNameInput" placeholder="Enter collection name">',
        primaryButton: {
            text: 'Create',
            onClick: (m) => {
                const name = m.getInputValue('#collectionNameInput');
                if (name && name.trim()) {
                    NoteBook.addCollection(name.trim());
                    renderCollectionTree();
                    return true; // Allow modal to close
                } else {
                    m._shakeModal(); // Visual feedback
                    return false; // Prevent closing
                }
            }
        },
        secondaryButton: {
            text: 'Cancel'
        },
        onClose: () => modal.destroy() // Clean up when closed
    });
    modal.show();
}

// ==============================================================
// More Examples
// ==============================================================

// Example: Notebook Modal
function openNotebookModal() {
    const modal = new Modal({
        title: 'New Notebook',
        body: '<input type="text" class="modal-input" id="notebookNameInput" placeholder="Enter notebook name">',
        primaryButton: {
            text: 'Create',
            onClick: (m) => {
                const name = m.getInputValue('#notebookNameInput');
                if (name && name.trim()) {
                    const currentCollection = NoteBook.getCurrentCollection();
                    if (currentCollection) {
                        NoteBook.addNotebook(name.trim(), currentCollection.id);
                        renderCollectionTree();
                        return true;
                    }
                }
                m._shakeModal();
                return false;
            }
        },
        secondaryButton: {
            text: 'Cancel'
        },
        onClose: () => modal.destroy()
    });
    modal.show();
}

// Example: Add Item Modal (with radio buttons)
function openAddItemModal() {
    const modal = new Modal({
        title: 'Add Item to Collection',
        body: `
            <div class="modal-radio-group">
                <label>
                    <input type="radio" name="itemType" value="collection" checked>
                    <span>Collection</span>
                </label>
                <label>
                    <input type="radio" name="itemType" value="notebook">
                    <span>Notebook</span>
                </label>
            </div>
            <input type="text" class="modal-input" id="addItemNameInput" placeholder="Enter name">
        `,
        primaryButton: {
            text: 'Create',
            onClick: (m) => {
                const type = m.elements.body.querySelector('input[name="itemType"]:checked').value;
                const name = m.getInputValue('#addItemNameInput');
                
                if (name && name.trim()) {
                    const currentCollection = NoteBook.getCurrentCollection();
                    if (currentCollection) {
                        if (type === 'collection') {
                            NoteBook.addNestedCollection(name.trim(), currentCollection.id);
                        } else {
                            NoteBook.addNotebook(name.trim(), currentCollection.id);
                        }
                        renderCollectionTree();
                        return true;
                    }
                }
                m._shakeModal();
                return false;
            }
        },
        secondaryButton: {
            text: 'Cancel'
        },
        onClose: () => modal.destroy()
    });
    modal.show();
}

// Example: Delete Confirmation
function confirmDeleteNote() {
    const note = NoteBook.getCurrentNote();
    if (!note) return;

    Modal.confirm(
        'Delete Note',
        `Are you sure you want to delete "${note.title}"? This action cannot be undone.`,
        () => {
            NoteBook.deleteNote(note.id);
            renderNotesList();
            clearEditor();
        }
    );
}

// Example: Replace Modal (complex modal)
function openReplaceModal() {
    const modal = new Modal({
        title: 'Find and Replace',
        body: `
            <input type="text" class="modal-input" id="findText" placeholder="Find...">
            <input type="text" class="modal-input" id="replaceText" placeholder="Replace with...">
            <div class="modal-radio-group">
                <label>
                    <input type="checkbox" id="caseSensitive">
                    <span>Case sensitive</span>
                </label>
                <label>
                    <input type="checkbox" id="wholeWord">
                    <span>Whole word</span>
                </label>
            </div>
        `,
        primaryButton: {
            text: 'Replace All',
            onClick: (m) => {
                const findText = m.getInputValue('#findText');
                const replaceText = m.getInputValue('#replaceText');
                const caseSensitive = m.elements.body.querySelector('#caseSensitive').checked;
                const wholeWord = m.elements.body.querySelector('#wholeWord').checked;
                
                if (findText) {
                    performReplace(findText, replaceText, caseSensitive, wholeWord);
                    return true;
                }
                m._shakeModal();
                return false;
            }
        },
        secondaryButton: {
            text: 'Cancel'
        },
        onClose: () => modal.destroy()
    });
    modal.show();
}

// ==============================================================
// Benefits of New Approach:
// ==============================================================

/*
1. ✅ No HTML duplication - modals created dynamically
2. ✅ Cleaner code - no manual DOM manipulation
3. ✅ Reusable - one component for all modals
4. ✅ Namespaced CSS - no style conflicts
5. ✅ Built-in features:
   - Keyboard shortcuts (Escape)
   - Click outside to close
   - Focus management
   - Animations
   - Shake effect for validation
6. ✅ Easy to maintain - change Modal class, all modals benefit
7. ✅ Better UX - consistent behavior across all modals
8. ✅ Type safety - configuration object instead of scattered IDs
9. ✅ Memory management - destroy() cleans up properly
10. ✅ Static helpers - Modal.confirm(), Modal.alert(), Modal.prompt()
*/

// ==============================================================
// Migration Steps:
// ==============================================================

/*
Step 1: Add modal component files to project
   - /components/modal/modal.html
   - /components/modal/modal.css
   - /components/modal/modal.js

Step 2: Include in HTML
   <link rel="stylesheet" href="../../components/modal/modal.css">
   <script src="../../components/modal/modal.js"></script>

Step 3: Remove old modal HTML from index.html
   - Remove all <div class="modal" id="..."> elements

Step 4: Refactor modal functions in uiController.js
   - Replace openXModal() functions with new Modal() calls
   - Remove closeXModal() functions (handled by component)
   - Remove DOM element references for modals

Step 5: Test all modal interactions
   - Verify all modals work correctly
   - Test keyboard shortcuts
   - Test validation

Step 6: Remove unused CSS
   - Remove old .modal classes from styles.css if present
   - Keep only modal-specific business styles if any
*/

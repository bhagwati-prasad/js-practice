const NoteBook = (function() {
    /*
    Collection = Collection + Notebooks
    Notebook = Notes
    Note = Cells
    Cell = { id, text, highlighted, codeMode }
    */
    const STORAGE_KEY = 'note_data';
    let data = {
        collections: [],
        currentCollectionId: null,
        currentNotebookId: null,
        currentNoteId: null
    };
    let lastOperationError = null;

    function generateId() {
        const rand = Math.random().toString(36).substring(2, 11);
        return 'id_' + Date.now() + '_' + rand;
    }

    function saveData() {
        const saved = StorageDriver.save(STORAGE_KEY, data);
        if (!saved) {
            lastOperationError = 'Failed to save data to storage.';
        }
        return saved;
    }

    function clearOperationError() {
        lastOperationError = null;
    }

    function failOperation(message) {
        lastOperationError = message;
        return false;
    }

    function loadData() {
        const loaded = StorageDriver.load(STORAGE_KEY);
        if (loaded) {
            if (loaded.notebooks && !loaded.collections) {
                data.collections = [{
                    id: generateId(),
                    name: 'My Collection',
                    type: 'collection',
                    createdAt: new Date().toISOString(),
                    items: loaded.notebooks.map(nb => ({...nb, type: 'notebook'}))
                }];
                data.currentCollectionId = data.collections[0].id;
                data.currentNotebookId = loaded.currentNotebookId;
                data.currentNoteId = loaded.currentNoteId;
            } else {
                data = loaded;
            }
        }
        normalizeAllNotes();
        return data;
    }

    function findCollection(id, collections = data.collections) {
        for (let col of collections) {
            if (col.id === id) return col;
            if (col.items) {
                for (let item of col.items) {
                    if (item.type === 'collection') {
                        const found = findCollection(id, [item]);
                        if (found) return found;
                    }
                }
            }
        }
        return null;
    }

    function findNotebook(id, collections = data.collections) {
        for (let col of collections) {
            if (col.items) {
                for (let item of col.items) {
                    if (item.type === 'notebook' && item.id === id) {
                        return item;
                    } else if (item.type === 'collection') {
                        const found = findNotebook(id, [item]);
                        if (found) return found;
                    }
                }
            }
        }
        return null;
    }

    function findParentCollection(itemId, collections = data.collections) {
        for (let col of collections) {
            if (col.items) {
                for (let item of col.items) {
                    if (item.id === itemId) {
                        return col;
                    } else if (item.type === 'collection') {
                        const found = findParentCollection(itemId, [item]);
                        if (found) return found;
                    }
                }
            }
        }
        return null;
    }

    function isDescendantCollection(sourceCollectionId, targetCollectionId) {
        const source = findCollection(sourceCollectionId);
        if (!source || !Array.isArray(source.items)) return false;

        const stack = source.items.filter(item => item.type === 'collection');
        while (stack.length > 0) {
            const current = stack.pop();
            if (current.id === targetCollectionId) return true;

            if (Array.isArray(current.items)) {
                current.items.forEach(item => {
                    if (item.type === 'collection') {
                        stack.push(item);
                    }
                });
            }
        }

        return false;
    }

    function findNote(nbId, nId) {
        const nb = findNotebook(nbId);
        if (!nb) return null;
        return nb.notes.find(n => n.id === nId);
    }

    function getAllCollections(collections = data.collections, result = []) {
        for (let col of collections) {
            result.push(col);
            if (col.items) {
                for (let item of col.items) {
                    if (item.type === 'collection') {
                        getAllCollections([item], result);
                    }
                }
            }
        }
        return result;
    }

    function getAllNotebooks(collections = data.collections, result = []) {
        for (let col of collections) {
            if (col.items) {
                for (let item of col.items) {
                    if (item.type === 'notebook') {
                        result.push(item);
                    } else if (item.type === 'collection') {
                        getAllNotebooks([item], result);
                    }
                }
            }
        }
        return result;
    }

    function buildCollectionPath(collectionId, collections = data.collections, currentPath = []) {
        for (let col of collections) {
            if (col.id === collectionId) {
                return [...currentPath, col];
            }
            if (col.items) {
                for (let item of col.items) {
                    if (item.type === 'collection') {
                        const found = buildCollectionPath(collectionId, [item], [...currentPath, col]);
                        if (found) return found;
                    }
                }
            }
        }
        return null;
    }

    function resolvePathToNoteEntities(pathInput) {
        if (typeof pathInput !== 'string') return null;

        const parts = pathInput.split('/').map(p => p.trim()).filter(p => p.length > 0);
        if (parts.length < 3) return null; // Expect at least collection/notebook/note

        const noteTitle = parts.pop();
        const notebookName = parts.pop();

        let currentCollections = data.collections;
        let collection = null;

        for (const part of parts) {
            const match = currentCollections.find(item => item.type === 'collection' && item.name === part);
            if (!match) return null;
            collection = match;
            currentCollections = match.items ? match.items.filter(item => item.type === 'collection') : [];
        }

        if (!collection || !collection.items) return null;

        const notebook = collection.items.find(item => item.type === 'notebook' && item.name === notebookName);
        if (!notebook) return null;

        const note = Array.isArray(notebook.notes) ? notebook.notes.find(n => n.title === noteTitle) : null;

        return { collection, notebook, note, noteTitle };
    }

    function ensureCellObject(cell) {
        const text = typeof cell === 'string'
            ? cell
            : (cell && typeof cell.text === 'string')
                ? cell.text
                : '';

        return {
            id: (cell && cell.id) ? cell.id : generateId(),
            text,
            highlighted: !!(cell && cell.highlighted),
            codeMode: !!(cell && cell.codeMode)
        };
    }

    function normalizeCells(cells = []) {
        if (!Array.isArray(cells)) return null;
        return cells.map(ensureCellObject);
    }

    function normalizeReference(reference) {
        if (!reference || typeof reference !== 'object') return null;

        const pagePath = typeof reference.pagePath === 'string' ? reference.pagePath.trim() : '';
        const contextType = typeof reference.contextType === 'string' ? reference.contextType.trim() : '';
        const contextId = typeof reference.contextId === 'string' ? reference.contextId.trim() : '';

        if (!pagePath || !contextType || !contextId) {
            return null;
        }

        return {
            pagePath,
            contextType,
            contextId,
            label: typeof reference.label === 'string' ? reference.label.trim() : '',
            createdAt: typeof reference.createdAt === 'string' && reference.createdAt
                ? reference.createdAt
                : new Date().toISOString()
        };
    }

    function getReferenceKey(reference) {
        if (!reference) return '';
        return [reference.pagePath, reference.contextType, reference.contextId].join('::').toLowerCase();
    }

    function normalizeReferences(references = []) {
        if (!Array.isArray(references)) return [];

        const deduped = new Map();
        references.forEach(ref => {
            const normalized = normalizeReference(ref);
            if (!normalized) return;
            deduped.set(getReferenceKey(normalized), normalized);
        });

        return Array.from(deduped.values());
    }

    function ensureNoteReferences(note) {
        if (!note) return note;

        if (!Array.isArray(note.references)) {
            if (note.reference && typeof note.reference === 'object') {
                note.references = [note.reference];
            } else {
                note.references = [];
            }
        }

        note.references = normalizeReferences(note.references);
        return note;
    }

    function ensureNoteCells(note) {
        if (!note) return note;

        if (!Array.isArray(note.cells)) {
            if (Array.isArray(note.content)) {
                note.cells = note.content;
            } else if (typeof note.content === 'string') {
                note.cells = note.content ? [{ id: generateId(), text: note.content }] : [];
            } else {
                note.cells = [];
            }
        }

        note.cells = normalizeCells(note.cells) || [];
        note.content = note.cells;
        ensureNoteReferences(note);
        return note;
    }

    function normalizeAllNotes() {
        const notebooks = getAllNotebooks();
        notebooks.forEach(nb => {
            if (!Array.isArray(nb.notes)) {
                nb.notes = [];
            }
            nb.notes = nb.notes.map(note => ensureNoteCells(note));
        });
    }

    return {
        init: function() {
            loadData();
            clearOperationError();
            if (data.collections.length === 0) {
                const col = this.createCollection('collection-root');
                this.createNotebook(col.id, 'My First Notebook');
            }
            return data;
        },

        createCollection: function(name, parentCollectionId = null) {
            const col = {
                id: generateId(),
                name: name || 'Untitled Collection',
                type: 'collection',
                createdAt: new Date().toISOString(),
                items: []
            };
            
            // If no parent specified and collections exist, use first root collection
            if (!parentCollectionId && data.collections.length > 0) {
                parentCollectionId = data.collections[0].id;
            }
            
            if (parentCollectionId) {
                const parent = findCollection(parentCollectionId);
                if (parent) {
                    parent.items.push(col);
                } else {
                    return null;
                }
            } else {
                // Only allow root-level creation during initialization (when no collections exist)
                data.collections.push(col);
            }
            
            saveData();
            return col;
        },

        getCollections: function(parentId = null) {
            if (!parentId) {
                return data.collections;
            }
            const parent = findCollection(parentId);
            return parent ? parent.items.filter(item => item.type === 'collection') : [];
        },

        getAllCollections: function() {
            return getAllCollections();
        },

        getCollection: function(id) {
            return findCollection(id);
        },

        getCollectionPath: function(id) {
            return buildCollectionPath(id);
        },

        updateCollection: function(id, updates) {
            const col = findCollection(id);
            if (!col) return null;
            Object.assign(col, updates);
            saveData();
            return col;
        },

        deleteCollection: function(id) {
            clearOperationError();
            const idx = data.collections.findIndex(c => c.id === id);
            if (idx !== -1) {
                data.collections.splice(idx, 1);
                if (data.currentCollectionId === id) {
                    data.currentCollectionId = data.collections[0] ? data.collections[0].id : null;
                    data.currentNotebookId = null;
                    data.currentNoteId = null;
                }
                return saveData() ? true : failOperation('Collection removed but failed to persist changes.');
            }
            
            const parent = findParentCollection(id);
            if (parent) {
                const itemIdx = parent.items.findIndex(item => item.id === id);
                if (itemIdx !== -1) {
                    parent.items.splice(itemIdx, 1);
                    if (data.currentCollectionId === id) {
                        data.currentCollectionId = parent.id;
                        data.currentNotebookId = null;
                        data.currentNoteId = null;
                    }
                    return saveData() ? true : failOperation('Collection removed but failed to persist changes.');
                }
                return failOperation('Collection parent found, but item is missing from parent items.');
            }
            
            return failOperation('Collection not found.');
        },

        createNotebook: function(collectionId, name) {
            const col = findCollection(collectionId);
            if (!col) return null;
            
            const nb = {
                id: generateId(),
                name: name || 'Untitled',
                type: 'notebook',
                createdAt: new Date().toISOString(),
                notes: []
            };
            col.items.push(nb);
            saveData();
            return nb;
        },

        getNotebooks: function(collectionId = null) {
            if (!collectionId) {
                return getAllNotebooks();
            }
            const col = findCollection(collectionId);
            return col ? col.items.filter(item => item.type === 'notebook') : [];
        },

        getNotebook: function(id) {
            return findNotebook(id);
        },

        updateNotebook: function(id, updates) {
            const nb = findNotebook(id);
            if (!nb) return null;
            Object.assign(nb, updates);
            saveData();
            return nb;
        },

        deleteNotebook: function(id) {
            clearOperationError();
            const parent = findParentCollection(id);
            if (!parent) return failOperation('Notebook parent collection not found.');
            
            const idx = parent.items.findIndex(item => item.id === id);
            if (idx === -1) return failOperation('Notebook not found inside its parent collection.');
            
            parent.items.splice(idx, 1);
            
            if (data.currentNotebookId === id) {
                data.currentNotebookId = null;
                data.currentNoteId = null;
            }
            
            return saveData() ? true : failOperation('Notebook removed but failed to persist changes.');
        },

        moveItemToCollection: function(itemId, targetCollectionId, itemType) {
            clearOperationError();
            if (itemType !== 'collection' && itemType !== 'notebook') {
                return failOperation('Invalid item type for move operation.');
            }

            const item = itemType === 'collection' 
                ? findCollection(itemId)
                : findNotebook(itemId);
            
            const targetCollection = findCollection(targetCollectionId);
            
            if (!item) return failOperation('Source item not found.');
            if (!targetCollection) return failOperation('Target collection not found.');
            if (itemId === targetCollectionId) return failOperation('Cannot move an item into itself.');

            if (itemType === 'collection' && isDescendantCollection(itemId, targetCollectionId)) {
                return failOperation('Cannot move a collection into one of its descendants.');
            }
            
            // Find current parent
            const parentCollection = itemType === 'collection'
                ? findParentCollection(itemId)
                : findParentCollection(itemId);
            
            // If already in target collection, no need to move
            if (parentCollection && parentCollection.id === targetCollectionId) {
                // Already in the right place, but return true to indicate success
                return saveData() ? true : failOperation('Item already in target collection, but failed to persist state.');
            }
            
            // Check if item already exists in target to prevent duplicates
            const existsInTarget = targetCollection.items && 
                targetCollection.items.some(i => i.id === itemId);
            
            if (existsInTarget) {
                // Already in target, don't add again
                return saveData() ? true : failOperation('Item already exists in target collection, but failed to persist state.');
            }
            
            // Remove from current parent
            if (parentCollection) {
                const idx = parentCollection.items.findIndex(i => i.id === itemId);
                if (idx !== -1) {
                    parentCollection.items.splice(idx, 1);
                } else {
                    return failOperation('Source item missing from its parent collection.');
                }
            } else if (itemType === 'collection') {
                // Remove from root collections
                const idx = data.collections.findIndex(c => c.id === itemId);
                if (idx !== -1) {
                    data.collections.splice(idx, 1);
                } else {
                    return failOperation('Source collection not found at root level.');
                }
            } else {
                return failOperation('Notebook parent collection not found.');
            }
            
            // Add to target collection
            if (!targetCollection.items) {
                targetCollection.items = [];
            }
            targetCollection.items.push(item);
            
            return saveData() ? true : failOperation('Item moved but failed to persist changes.');
        },

        getLastOperationError: function() {
            return lastOperationError;
        },

        createNote: function(nbId, title, content) {
            const nb = findNotebook(nbId);
            if (!nb) return null;
            
            const cells = normalizeCells(content || []) || [];
            const note = ensureNoteCells({
                id: generateId(),
                title: title || 'Untitled',
                cells,
                references: [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });
            
            nb.notes.push(note);
            saveData();
            return note;
        },

        createNewNote: function(pathInput, cells = []) {
            const resolved = resolvePathToNoteEntities(pathInput);
            if (!resolved || !resolved.notebook) return null;

            const normalizedCells = normalizeCells(cells);
            if (!normalizedCells) return null;

            if (resolved.note) {
                return this.updateNote(resolved.notebook.id, resolved.note.id, {
                    title: resolved.noteTitle,
                    cells: normalizedCells
                });
            }

            return this.createNote(resolved.notebook.id, resolved.noteTitle, normalizedCells);
        },

        getNotes: function(nbId) {
            const nb = findNotebook(nbId);
            return nb ? nb.notes.map(note => ensureNoteCells(note)) : [];
        },

        getNote: function(nbId, nId) {
            return ensureNoteCells(findNote(nbId, nId));
        },

        getNewNote: function(pathInput) {
            const resolved = resolvePathToNoteEntities(pathInput);
            if (!resolved || !resolved.note) return null;
            ensureNoteCells(resolved.note);
            if (!Array.isArray(resolved.note.cells)) return null;

            return resolved.note.cells.map(cell => ({
                id: cell.id,
                text: cell.text || '',
                highlighted: !!cell.highlighted,
                codeMode: !!cell.codeMode
            }));
        },

        updateNote: function(nbId, nId, updates) {
            const note = findNote(nbId, nId);
            if (!note) return null;
            ensureNoteCells(note);

            const sanitizedUpdates = Object.assign({}, updates);
            delete sanitizedUpdates.cells;
            delete sanitizedUpdates.content;
            delete sanitizedUpdates.references;

            let nextCells = null;
            if (Array.isArray(updates.cells)) {
                nextCells = normalizeCells(updates.cells);
            } else if (Array.isArray(updates.content)) {
                // backward compatibility
                nextCells = normalizeCells(updates.content);
            }

            if (nextCells) {
                note.cells = nextCells;
                note.content = nextCells;
            }

            if (Array.isArray(updates.references)) {
                note.references = normalizeReferences(updates.references);
            }

            Object.assign(note, sanitizedUpdates, {
                updatedAt: new Date().toISOString()
            });

            // Keep alias in sync
            note.content = note.cells;
            ensureNoteReferences(note);
            
            saveData();
            return note;
        },

        addNoteReference: function(nbId, nId, reference) {
            const note = findNote(nbId, nId);
            if (!note) return null;

            ensureNoteCells(note);
            const normalized = normalizeReference(reference);
            if (!normalized) return null;

            const key = getReferenceKey(normalized);
            const existingIndex = note.references.findIndex(ref => getReferenceKey(ref) === key);

            if (existingIndex !== -1) {
                note.references[existingIndex] = {
                    ...note.references[existingIndex],
                    ...normalized,
                    createdAt: note.references[existingIndex].createdAt || normalized.createdAt
                };
            } else {
                note.references.push(normalized);
            }

            note.updatedAt = new Date().toISOString();
            saveData();
            return note.references;
        },

        removeNoteReference: function(nbId, nId, referenceMatcher) {
            const note = findNote(nbId, nId);
            if (!note) return false;

            ensureNoteCells(note);

            const target = normalizeReference(referenceMatcher);
            if (!target) return false;

            const targetKey = getReferenceKey(target);
            const originalLength = note.references.length;
            note.references = note.references.filter(ref => getReferenceKey(ref) !== targetKey);

            if (note.references.length === originalLength) {
                return false;
            }

            note.updatedAt = new Date().toISOString();
            saveData();
            return true;
        },

        findNotesByReference: function(referenceInput) {
            const target = normalizeReference(referenceInput);
            if (!target) return [];

            const targetKey = getReferenceKey(target);
            const results = [];
            const notebooks = getAllNotebooks();

            notebooks.forEach(nb => {
                const notes = Array.isArray(nb.notes) ? nb.notes : [];
                notes.forEach(note => {
                    ensureNoteCells(note);
                    const match = note.references.find(ref => getReferenceKey(ref) === targetKey);
                    if (!match) return;

                    results.push({
                        notebookId: nb.id,
                        notebookName: nb.name,
                        note,
                        reference: match
                    });
                });
            });

            results.sort((a, b) => {
                const left = a.note.updatedAt || '';
                const right = b.note.updatedAt || '';
                if (left === right) {
                    return (a.note.title || '').localeCompare(b.note.title || '');
                }
                return left < right ? 1 : -1;
            });

            return results;
        },

        getPrimaryOrLatestReference: function(nbId, nId) {
            const note = findNote(nbId, nId);
            if (!note) return null;

            ensureNoteCells(note);
            if (!note.references.length) return null;

            const sorted = [...note.references].sort((a, b) => {
                const left = a.createdAt || '';
                const right = b.createdAt || '';
                return left < right ? 1 : -1;
            });

            return sorted[0] || null;
        },

        moveNoteToNotebook: function(sourceNotebookId, noteId, targetNotebookId, options = {}) {
            clearOperationError();

            const sourceNotebook = findNotebook(sourceNotebookId);
            const targetNotebook = findNotebook(targetNotebookId);

            if (!sourceNotebook) return failOperation('Source notebook not found.');
            if (!targetNotebook) return failOperation('Target notebook not found.');

            const sourceIndex = Array.isArray(sourceNotebook.notes)
                ? sourceNotebook.notes.findIndex(n => n.id === noteId)
                : -1;

            if (sourceIndex === -1) return failOperation('Note not found in source notebook.');

            const note = sourceNotebook.notes[sourceIndex];
            if (!note) return failOperation('Note not available to move.');

            if (sourceNotebookId === targetNotebookId) {
                if (options && typeof options.title === 'string' && options.title.trim()) {
                    note.title = options.title.trim();
                    note.updatedAt = new Date().toISOString();
                    saveData();
                }
                return {
                    notebookId: sourceNotebookId,
                    note: ensureNoteCells(note)
                };
            }

            sourceNotebook.notes.splice(sourceIndex, 1);
            if (!Array.isArray(targetNotebook.notes)) {
                targetNotebook.notes = [];
            }

            if (options && typeof options.title === 'string' && options.title.trim()) {
                note.title = options.title.trim();
            }
            note.updatedAt = new Date().toISOString();
            ensureNoteCells(note);

            targetNotebook.notes.push(note);

            if (data.currentNoteId === noteId) {
                data.currentNotebookId = targetNotebookId;
            }

            if (!saveData()) {
                return failOperation('Note moved but failed to persist changes.');
            }

            return {
                notebookId: targetNotebookId,
                note
            };
        },

        deleteNote: function(nbId, nId) {
            const nb = findNotebook(nbId);
            if (!nb) return false;
            
            const idx = nb.notes.findIndex(n => n.id === nId);
            if (idx === -1) return false;
            
            nb.notes.splice(idx, 1);
            
            if (data.currentNoteId === nId) {
                data.currentNoteId = null;
            }
            
            saveData();
            return true;
        },

        setCurrentCollection: function(id) {
            // Allow null to deselect
            if (id !== null && !findCollection(id)) return false;
            data.currentCollectionId = id;
            data.currentNotebookId = null;
            data.currentNoteId = null;
            saveData();
            return true;
        },

        getCurrentCollection: function() {
            return data.currentCollectionId;
        },

        setCurrentNotebook: function(id) {
            // Allow null to deselect
            if (id !== null && !findNotebook(id)) return false;
            data.currentNotebookId = id;
            data.currentNoteId = null;
            saveData();
            return true;
        },

        getCurrentNotebook: function() {
            return data.currentNotebookId;
        },

        setCurrentNote: function(id) {
            data.currentNoteId = id;
            saveData();
            return true;
        },

        getCurrentNote: function() {
            return data.currentNoteId;
        },

        getPath: function() {
            const path = [];
            const currentCollectionId = data.currentCollectionId;
            const currentNotebookId = data.currentNotebookId;
            const currentNoteId = data.currentNoteId;

            if (currentCollectionId) {
                const collectionPath = buildCollectionPath(currentCollectionId);
                if (collectionPath) {
                    collectionPath.forEach(col => {
                        path.push({
                            id: col.id,
                            name: col.name,
                            type: 'collection'
                        });
                    });
                }
            }

            if (currentNotebookId) {
                const notebook = findNotebook(currentNotebookId);
                if (notebook) {
                    path.push({
                        id: notebook.id,
                        name: notebook.name,
                        type: 'notebook'
                    });
                }
            }

            if (currentNoteId && currentNotebookId) {
                const note = findNote(currentNotebookId, currentNoteId);
                if (note) {
                    path.push({
                        id: note.id,
                        name: note.title,
                        type: 'note'
                    });
                }
            }

            return path;
        },

        setPath: function(pathInput) {
            let path = [];
            
            if (typeof pathInput === 'string') {
                const parts = pathInput.split('/').map(p => p.trim()).filter(p => p.length > 0);
                
                let currentCollections = data.collections;
                let collectionId = null;
                let notebookId = null;
                let noteId = null;
                
                for (let i = 0; i < parts.length; i++) {
                    const partName = parts[i];
                    
                    const collection = currentCollections.find(c => c.name === partName);
                    if (collection) {
                        collectionId = collection.id;
                        currentCollections = collection.items ? collection.items.filter(item => item.type === 'collection') : [];
                        continue;
                    }
                    
                    if (collectionId && !notebookId) {
                        const col = findCollection(collectionId);
                        if (col && col.items) {
                            const notebook = col.items.find(item => item.type === 'notebook' && item.name === partName);
                            if (notebook) {
                                notebookId = notebook.id;
                                continue;
                            }
                        }
                    }
                    
                    if (notebookId && !noteId) {
                        const notebook = findNotebook(notebookId);
                        if (notebook && notebook.notes) {
                            const note = notebook.notes.find(n => n.title === partName);
                            if (note) {
                                noteId = note.id;
                                break;
                            }
                        }
                    }
                }
                
                if (collectionId) {
                    data.currentCollectionId = collectionId;
                }
                if (notebookId) {
                    data.currentNotebookId = notebookId;
                }
                if (noteId) {
                    data.currentNoteId = noteId;
                }
                
                saveData();
                return { collectionId, notebookId, noteId };
                
            } else if (Array.isArray(pathInput)) {
                let collectionId = null;
                let notebookId = null;
                let noteId = null;
                
                pathInput.forEach(item => {
                    if (item.type === 'collection') {
                        collectionId = item.id;
                    } else if (item.type === 'notebook') {
                        notebookId = item.id;
                    } else if (item.type === 'note') {
                        noteId = item.id;
                    }
                });
                
                // Set only valid IDs
                if (collectionId && findCollection(collectionId)) {
                    data.currentCollectionId = collectionId;
                }
                if (notebookId && findNotebook(notebookId)) {
                    data.currentNotebookId = notebookId;
                }
                if (noteId && notebookId) {
                    const note = findNote(notebookId, noteId);
                    if (note) {
                        data.currentNoteId = noteId;
                    }
                }
                
                saveData();
                return { collectionId, notebookId, noteId };
            }
            
            return null;
        },

        searchNotes: function(query) {
            const results = [];
            const lower = query.toLowerCase();
            const notebooks = getAllNotebooks();
            
            notebooks.forEach(nb => {
                nb.notes.forEach(note => {
                    ensureNoteCells(note);
                    const contentStr = Array.isArray(note.cells) 
                        ? note.cells.map(cell => cell.text || '').join(' ')
                        : '';
                    
                    if (note.title.toLowerCase().includes(lower) ||
                        contentStr.toLowerCase().includes(lower)) {
                        results.push({
                            notebookId: nb.id,
                            notebookName: nb.name,
                            note: note
                        });
                    }
                });
            });
            
            return results;
        },

        exportData: function() {
            return JSON.stringify(data, null, 2);
        },

        importData: function(json) {
            try {
                const imp = JSON.parse(json);
                
                // Handle old format migration
                if (imp.notebooks && !imp.collections) {
                    imp.collections = [{
                        id: generateId(),
                        name: 'Imported Collection',
                        type: 'collection',
                        createdAt: new Date().toISOString(),
                        items: imp.notebooks.map(nb => {
                            nb.type = 'notebook';
                            nb.notes.forEach(note => {
                                if (typeof note.content === 'string') {
                                    note.cells = note.content ? [{ id: generateId(), text: note.content }] : [];
                                    note.content = note.cells;
                                } else if (Array.isArray(note.content) && !note.cells) {
                                    note.cells = note.content;
                                }
                            });
                            return nb;
                        })
                    }];
                    delete imp.notebooks;
                }
                
                // Ensure all notebooks have type field and process notes
                function processItems(items) {
                    items.forEach(item => {
                        if (!item.type) {
                            item.type = item.notes ? 'notebook' : 'collection';
                        }
                        if (item.type === 'notebook' && item.notes) {
                            item.notes.forEach(note => {
                                if (typeof note.content === 'string') {
                                    note.cells = note.content ? [{ id: generateId(), text: note.content }] : [];
                                    note.content = note.cells;
                                } else if (Array.isArray(note.content) && !note.cells) {
                                    note.cells = note.content;
                                }
                            });
                        }
                        if (item.items) {
                            processItems(item.items);
                        }
                    });
                }
                
                if (imp.collections) {
                    imp.collections.forEach(col => {
                        if (col.items) {
                            processItems(col.items);
                        }
                    });
                    data = imp;
                    normalizeAllNotes();
                    saveData();
                    return true;
                }
                return false;
            } catch (e) {
                console.error('Import error:', e);
                return false;
            }
        }
    };
})();
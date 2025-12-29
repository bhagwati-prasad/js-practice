const NoteBook = (function() {
    const STORAGE_KEY = 'onenote_data';
    let data = {
        collections: [], // Root level collections
        currentCollectionId: null,
        currentNotebookId: null,
        currentNoteId: null
    };

    function generateId() {
        return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    function saveData() {
        return StorageDriver.save(STORAGE_KEY, data);
    }

    function loadData() {
        const loaded = StorageDriver.load(STORAGE_KEY);
        if (loaded) {
            // Migration: convert old notebooks structure to new collections structure
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
        return data;
    }

    // Find collection by ID recursively
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

    // Find notebook by ID recursively
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

    // Find the parent collection of a notebook or collection
    function findParentCollection(itemId, collections = data.collections, parent = null) {
        for (let col of collections) {
            if (col.items) {
                for (let item of col.items) {
                    if (item.id === itemId) {
                        return col;
                    } else if (item.type === 'collection') {
                        const found = findParentCollection(itemId, [item], col);
                        if (found) return found;
                    }
                }
            }
        }
        return parent;
    }

    function findNote(nbId, nId) {
        const nb = findNotebook(nbId);
        if (!nb) return null;
        return nb.notes.find(n => n.id === nId);
    }

    // Get all collections (helper for flat list)
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

    // Get all notebooks (helper for flat list)
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

    // Build complete path from root to a collection
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

    return {
        init: function() {
            loadData();
            if (data.collections.length === 0) {
                const col = this.createCollection('collection-root');
                this.createNotebook(col.id, 'My First Notebook');
            }
            return data;
        },

        // Collection methods
        createCollection: function(name, parentCollectionId = null) {
            const col = {
                id: generateId(),
                name: name || 'Untitled Collection',
                type: 'collection',
                createdAt: new Date().toISOString(),
                items: [] // Can contain notebooks or other collections
            };
            
            if (parentCollectionId) {
                const parent = findCollection(parentCollectionId);
                if (parent) {
                    parent.items.push(col);
                } else {
                    return null;
                }
            } else {
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
            // Check if it's a root collection
            const idx = data.collections.findIndex(c => c.id === id);
            if (idx !== -1) {
                data.collections.splice(idx, 1);
                if (data.currentCollectionId === id) {
                    data.currentCollectionId = data.collections[0] ? data.collections[0].id : null;
                    data.currentNotebookId = null;
                    data.currentNoteId = null;
                }
                saveData();
                return true;
            }
            
            // Find in nested collections
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
                    saveData();
                    return true;
                }
            }
            
            return false;
        },

        // Notebook methods
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
            const parent = findParentCollection(id);
            if (!parent) return false;
            
            const idx = parent.items.findIndex(item => item.id === id);
            if (idx === -1) return false;
            
            parent.items.splice(idx, 1);
            
            if (data.currentNotebookId === id) {
                data.currentNotebookId = null;
                data.currentNoteId = null;
            }
            
            saveData();
            return true;
        },

        // Note methods (unchanged, notes remain as collection of textareas)
        createNote: function(nbId, title, content) {
            const nb = findNotebook(nbId);
            if (!nb) return null;
            
            const note = {
                id: generateId(),
                title: title || 'Untitled',
                content: content || [],
                isCodeMode: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            
            nb.notes.push(note);
            saveData();
            return note;
        },

        getNotes: function(nbId) {
            const nb = findNotebook(nbId);
            return nb ? nb.notes : [];
        },

        getNote: function(nbId, nId) {
            return findNote(nbId, nId);
        },

        updateNote: function(nbId, nId, updates) {
            const note = findNote(nbId, nId);
            if (!note) return null;
            
            Object.assign(note, updates, {
                updatedAt: new Date().toISOString()
            });
            
            saveData();
            return note;
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

        // Current selection methods
        setCurrentCollection: function(id) {
            if (!findCollection(id)) return false;
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
            if (!findNotebook(id)) return false;
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

        // Path methods - get and set complete path from collection to note
        getPath: function() {
            const path = [];
            const currentCollectionId = data.currentCollectionId;
            const currentNotebookId = data.currentNotebookId;
            const currentNoteId = data.currentNoteId;

            // Build collection path
            if (currentCollectionId) {
                const collectionPath = buildCollectionPath(currentCollectionId);
                if (collectionPath) {
                    // Add all collections in the path (skip root if needed)
                    collectionPath.forEach(col => {
                        path.push({
                            id: col.id,
                            name: col.name,
                            type: 'collection'
                        });
                    });
                }
            }

            // Add notebook to path
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

            // Add note to path
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
            // Accept either array of path objects or string with '/' separators
            let path = [];
            
            if (typeof pathInput === 'string') {
                // Parse string path like "Collection1/SubCollection/Notebook1/Note Title"
                const parts = pathInput.split('/').map(p => p.trim()).filter(p => p.length > 0);
                
                // Try to resolve each part by name
                let currentCollections = data.collections;
                let collectionId = null;
                let notebookId = null;
                let noteId = null;
                
                for (let i = 0; i < parts.length; i++) {
                    const partName = parts[i];
                    
                    // Try to find collection
                    const collection = currentCollections.find(c => c.name === partName);
                    if (collection) {
                        collectionId = collection.id;
                        currentCollections = collection.items ? collection.items.filter(item => item.type === 'collection') : [];
                        continue;
                    }
                    
                    // Try to find notebook in current collection
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
                    
                    // Try to find note in current notebook
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
                
                // Set the resolved path
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
                // Accept array of path objects with id, name, and type
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
                    const contentStr = Array.isArray(note.content) 
                        ? note.content.map(block => block.text || '').join(' ')
                        : note.content || '';
                    
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
                                    note.content = note.content ? [{ id: generateId(), text: note.content }] : [];
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
                                    note.content = note.content ? [{ id: generateId(), text: note.content }] : [];
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
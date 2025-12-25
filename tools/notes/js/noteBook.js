const NoteBook = (function() {
    const STORAGE_KEY = 'onenote_data';
    let data = {
        notebooks: [],
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
            data = loaded;
        }
        return data;
    }

    function findNotebook(id) {
        return data.notebooks.find(nb => nb.id === id);
    }

    function findNote(nbId, nId) {
        const nb = findNotebook(nbId);
        if (!nb) return null;
        return nb.notes.find(n => n.id === nId);
    }

    return {
        init: function() {
            loadData();
            if (data.notebooks.length === 0) {
                this.createNotebook('My First Notebook');
            }
            return data;
        },

        createNotebook: function(name) {
            const nb = {
                id: generateId(),
                name: name || 'Untitled',
                createdAt: new Date().toISOString(),
                notes: []
            };
            data.notebooks.push(nb);
            saveData();
            return nb;
        },

        getNotebooks: function() {
            return data.notebooks;
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
            const idx = data.notebooks.findIndex(nb => nb.id === id);
            if (idx === -1) return false;
            
            data.notebooks.splice(idx, 1);
            
            if (data.currentNotebookId === id) {
                data.currentNotebookId = data.notebooks[0] ? data.notebooks[0].id : null;
                data.currentNoteId = null;
            }
            
            saveData();
            return true;
        },

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

        searchNotes: function(query) {
            const results = [];
            const lower = query.toLowerCase();
            
            data.notebooks.forEach(nb => {
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
                if (imp.notebooks) {
                    imp.notebooks.forEach(nb => {
                        nb.notes.forEach(note => {
                            if (typeof note.content === 'string') {
                                note.content = note.content ? [{ id: generateId(), text: note.content }] : [];
                            }
                        });
                    });
                    data = imp;
                    saveData();
                    return true;
                }
                return false;
            } catch (e) {
                return false;
            }
        }
    };
})();
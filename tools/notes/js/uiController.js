const UIController = (function() {
    let elements = {};
    let saveTimeout;

    function initElements() {
        elements = {
            notebookList: document.getElementById('notebookList'),
            notesList: document.getElementById('notesList'),
            editorArea: document.getElementById('editorArea'),
            addNotebookBtn: document.getElementById('addNotebookBtn'),
            addNoteBtn: document.getElementById('addNoteBtn'),
            deleteNoteBtn: document.getElementById('deleteNoteBtn'),
            floatingToolbar: document.getElementById('floatingToolbar'),
            toolCodeMode: document.getElementById('toolCodeMode'),
            toolSort: document.getElementById('toolSort'),
            toolReplace: document.getElementById('toolReplace'),
            replaceModal: document.getElementById('replaceModal'),
            findInput: document.getElementById('findInput'),
            replaceInput: document.getElementById('replaceInput'),
            confirmReplaceBtn: document.getElementById('confirmReplaceBtn'),
            cancelReplaceBtn: document.getElementById('cancelReplaceBtn'),
            exportBtn: document.getElementById('exportBtn'),
            importBtn: document.getElementById('importBtn'),
            searchInput: document.getElementById('searchInput'),
            notebookModal: document.getElementById('notebookModal'),
            notebookNameInput: document.getElementById('notebookNameInput'),
            createNotebookBtn: document.getElementById('createNotebookBtn'),
            cancelNotebookBtn: document.getElementById('cancelNotebookBtn'),
            localStorageBtn: document.getElementById('localStorageBtn'),
            sessionStorageBtn: document.getElementById('sessionStorageBtn')
        };
    }

    function initEventListeners() {
        bindStorageEvents();
        bindNotebookEvents();
        bindNoteEvents();
        bindFloatingToolbarEvents();
        bindSearchEvents();
        bindImportExportEvents();
    }

    function bindStorageEvents() {
        elements.localStorageBtn.addEventListener('click', function() {
            StorageDriver.setDriver('localStorage');
            elements.localStorageBtn.classList.add('active');
            elements.sessionStorageBtn.classList.remove('active');
            NoteBook.init();
            renderNotebooks();
            renderNotes();
            renderEditor();
        });

        elements.sessionStorageBtn.addEventListener('click', function() {
            StorageDriver.setDriver('sessionStorage');
            elements.sessionStorageBtn.classList.add('active');
            elements.localStorageBtn.classList.remove('active');
            NoteBook.init();
            renderNotebooks();
            renderNotes();
            renderEditor();
        });
    }

    function bindNotebookEvents() {
        elements.addNotebookBtn.addEventListener('click', function() {
            elements.notebookModal.classList.add('show');
            elements.notebookNameInput.value = '';
            elements.notebookNameInput.focus();
        });

        elements.createNotebookBtn.addEventListener('click', function() {
            const name = elements.notebookNameInput.value.trim();
            if (name) {
                const notebook = NoteBook.createNotebook(name);
                NoteBook.setCurrentNotebook(notebook.id);
                renderNotebooks();
                renderNotes();
                elements.notebookModal.classList.remove('show');
            }
        });

        elements.cancelNotebookBtn.addEventListener('click', function() {
            elements.notebookModal.classList.remove('show');
        });

        elements.notebookNameInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                elements.createNotebookBtn.click();
            }
        });
    }

    function bindNoteEvents() {
        elements.addNoteBtn.addEventListener('click', function() {
            const currentNotebookId = NoteBook.getCurrentNotebook();
            if (!currentNotebookId) return;
            
            const note = NoteBook.createNote(currentNotebookId, 'Untitled Note', '');
            NoteBook.setCurrentNote(note.id);
            renderNotes();
            renderEditor();
        });

        elements.deleteNoteBtn.addEventListener('click', function() {
            const currentNotebookId = NoteBook.getCurrentNotebook();
            const currentNoteId = NoteBook.getCurrentNote();
            
            if (currentNotebookId && currentNoteId) {
                if (confirm('Are you sure you want to delete this note?')) {
                    NoteBook.deleteNote(currentNotebookId, currentNoteId);
                    renderNotes();
                    renderEditor();
                }
            }
        });
    }

    function bindFloatingToolbarEvents() {
        elements.toolCodeMode.addEventListener('click', function() {
            const currentNotebookId = NoteBook.getCurrentNotebook();
            const currentNoteId = NoteBook.getCurrentNote();
            if (!currentNotebookId || !currentNoteId) return;

            const note = NoteBook.getNote(currentNotebookId, currentNoteId);
            const newState = !note.isCodeMode;
            NoteBook.updateNote(currentNotebookId, currentNoteId, { isCodeMode: newState });
            renderEditor();
        });

        elements.toolSort.addEventListener('click', function() {
            if (NoteProcessor.sortSubsection()) {
                renderEditor();
            }
        });

        elements.toolReplace.addEventListener('click', function() {
            const currentNotebookId = NoteBook.getCurrentNotebook();
            const currentNoteId = NoteBook.getCurrentNote();
            
            if (!currentNotebookId || !currentNoteId) {
                alert('Please select a note first.');
                return;
            }
            
            elements.findInput.value = '';
            elements.replaceInput.value = '';
            elements.replaceModal.classList.add('show');
            elements.findInput.focus();
        });

        elements.confirmReplaceBtn.addEventListener('click', function() {
            const findText = elements.findInput.value;
            const replaceText = elements.replaceInput.value;
            
            if (!findText) {
                alert('Please enter text to find.');
                return;
            }

            const currentNotebookId = NoteBook.getCurrentNotebook();
            const currentNoteId = NoteBook.getCurrentNote();
            if (!currentNotebookId || !currentNoteId) return;

            const note = NoteBook.getNote(currentNotebookId, currentNoteId);
            
            if (Array.isArray(note.content)) {
                note.content.forEach(block => {
                    if (block.text) {
                        block.text = block.text.split(findText).join(replaceText);
                    }
                });
            }

            NoteBook.updateNote(currentNotebookId, currentNoteId, { content: note.content });
            renderEditor();
            elements.replaceModal.classList.remove('show');
        });

        elements.cancelReplaceBtn.addEventListener('click', function() {
            elements.replaceModal.classList.remove('show');
        });
    }

    function bindSearchEvents() {
        elements.searchInput.addEventListener('input', function() {
            const query = this.value.trim();
            if (query) {
                const results = NoteBook.searchNotes(query);
                renderSearchResults(results);
            } else {
                renderNotes();
            }
        });
    }

    function bindImportExportEvents() {
        elements.exportBtn.addEventListener('click', function() {
            const data = NoteBook.exportData();
            const blob = new Blob([data], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'onenote_export_' + new Date().getTime() + '.json';
            a.click();
            URL.revokeObjectURL(url);
        });

        elements.importBtn.addEventListener('click', function() {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';
            
            input.onchange = function(e) {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(event) {
                        if (NoteBook.importData(event.target.result)) {
                            renderNotebooks();
                            renderNotes();
                            alert('Data imported successfully!');
                        } else {
                            alert('Failed to import data.');
                        }
                    };
                    reader.readAsText(file);
                }
            };
            
            input.click();
        });
    }

    function renderNotebooks() {
        const notebooks = NoteBook.getNotebooks();
        const currentNotebookId = NoteBook.getCurrentNotebook();
        elements.notebookList.innerHTML = '';
        
        notebooks.forEach(notebook => {
            const div = document.createElement('div');
            div.className = 'primary-btn notebook-item' + (notebook.id === currentNotebookId ? ' active' : '');
            div.innerHTML = `
                <span>${notebook.name}</span>
                <div class="notebook-actions">
                    <button onclick="window.renameNotebook('${notebook.id}')">✎</button>
                    <button onclick="window.deleteNotebook('${notebook.id}')">✕</button>
                </div>
            `;
            
            div.addEventListener('click', function(e) {
                if (!e.target.closest('.notebook-actions')) {
                    NoteBook.setCurrentNotebook(notebook.id);
                    renderNotebooks();
                    renderNotes();
                    renderEditor();
                }
            });
            
            elements.notebookList.appendChild(div);
        });
        
        if (!currentNotebookId && notebooks.length > 0) {
            NoteBook.setCurrentNotebook(notebooks[0].id);
            renderNotes();
        }
    }

    function renderNotes() {
        const currentNotebookId = NoteBook.getCurrentNotebook();
        
        if (!currentNotebookId) {
            elements.notesList.innerHTML = '<div style="padding: 20px; text-align: center; color: #999;">No notebook selected</div>';
            return;
        }
        
        const notes = NoteBook.getNotes(currentNotebookId);
        const currentNoteId = NoteBook.getCurrentNote();
        elements.notesList.innerHTML = '';
        
        notes.forEach(note => {
            const div = document.createElement('div');
            div.className = 'note-item' + (note.id === currentNoteId ? ' active' : '');
            
            const contentPreview = Array.isArray(note.content) && note.content.length > 0
                ? note.content[0].text.substring(0, 50)
                : '';
            
            div.innerHTML = `
                <div class="note-title">${note.title}</div>
                <div class="note-preview">${contentPreview}</div>
            `;
            
            div.addEventListener('click', function() {
                NoteBook.setCurrentNote(note.id);
                renderNotes();
                renderEditor();
            });
            
            elements.notesList.appendChild(div);
        });
    }

    function renderEditor() {
        const currentNotebookId = NoteBook.getCurrentNotebook();
        const currentNoteId = NoteBook.getCurrentNote();

        if (!currentNotebookId || !currentNoteId) {
            elements.editorArea.innerHTML = '<div class="empty-state">Select a note or create a new one</div>';
            elements.floatingToolbar.classList.remove('visible');
            return;
        }

        const note = NoteBook.getNote(currentNotebookId, currentNoteId);
        
        if (!note) {
            elements.editorArea.innerHTML = '<div class="empty-state">Note not found</div>';
            elements.floatingToolbar.classList.remove('visible');
            return;
        }

        if (!Array.isArray(note.content)) {
            note.content = [];
        }

        elements.floatingToolbar.classList.add('visible');

        if (note.isCodeMode) {
            elements.toolCodeMode.classList.add('active');
        } else {
            elements.toolCodeMode.classList.remove('active');
        }

        elements.editorArea.innerHTML = `
            <div class="editor-header">
                <input type="text" id="noteTitleInput" value="${note.title}" placeholder="Note title">
            </div>
            <div class="editor-content" id="editorContentContainer"></div>
        `;
        
        elements.editorArea.appendChild(elements.floatingToolbar);

        const titleInput = document.getElementById('noteTitleInput');
        const contentContainer = document.getElementById('editorContentContainer');

        function triggerSave() {
            clearTimeout(saveTimeout);
            saveTimeout = setTimeout(function() {
                NoteBook.updateNote(currentNotebookId, currentNoteId, {
                    title: titleInput.value,
                    content: note.content
                });
                renderNotes();
            }, 500);
        }

        titleInput.addEventListener('input', triggerSave);

        function generateBlockId() {
            return 'block_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        }

        function createTextBlock(text = '', blockId = null) {
            const id = blockId || generateBlockId();
            const wrapper = document.createElement('div');
            wrapper.className = 'text-block-wrapper';
            wrapper.dataset.blockId = id;
            
            const textarea = document.createElement('textarea');
            textarea.className = 'text-block';
            textarea.value = text;
            textarea.placeholder = 'Click to type...';
            
            textarea.addEventListener('input', function() {
                const blockIndex = note.content.findIndex(b => b.id === id);
                if (blockIndex !== -1) {
                    note.content[blockIndex].text = this.value;
                } else {
                    note.content.push({ id, text: this.value });
                }
                triggerSave();
            });
            
            textarea.addEventListener('blur', function() {
                if (this.value.trim() === '') {
                    const blockIndex = note.content.findIndex(b => b.id === id);
                    if (blockIndex !== -1) {
                        note.content.splice(blockIndex, 1);
                        wrapper.remove();
                        triggerSave();
                    }
                }
            });
            
            wrapper.appendChild(textarea);
            return wrapper;
        }

        note.content.forEach(block => {
            const blockEl = createTextBlock(block.text, block.id);
            contentContainer.appendChild(blockEl);
        });

        contentContainer.addEventListener('click', function(e) {
            if (e.target === contentContainer) {
                const newBlockId = generateBlockId();
                note.content.push({ id: newBlockId, text: '' });
                const newBlock = createTextBlock('', newBlockId);
                contentContainer.appendChild(newBlock);
                newBlock.querySelector('textarea').focus();
                triggerSave();
            }
        });
    }

    function renderSearchResults(results) {
        const currentNoteId = NoteBook.getCurrentNote();
        elements.notesList.innerHTML = '';
        
        if (results.length === 0) {
            elements.notesList.innerHTML = '<div style="padding: 20px; text-align: center; color: #999;">No results found</div>';
            return;
        }
        
        results.forEach(result => {
            const div = document.createElement('div');
            div.className = 'note-item' + (result.note.id === currentNoteId ? ' active' : '');
            
            const contentPreview = Array.isArray(result.note.content) && result.note.content.length > 0
                ? result.note.content[0].text.substring(0, 50)
                : '';
            
            div.innerHTML = `
                <div class="note-title">${result.note.title}</div>
                <div class="note-preview">${result.notebookName}</div>
                <div class="note-preview">${contentPreview}</div>
            `;
            
            div.addEventListener('click', function() {
                NoteBook.setCurrentNotebook(result.notebookId);
                NoteBook.setCurrentNote(result.note.id);
                elements.searchInput.value = '';
                renderNotebooks();
                renderNotes();
                renderEditor();
            });
            
            elements.notesList.appendChild(div);
        });
    }

    function init() {
        initElements();
        NoteBook.init();
        renderNotebooks();
        Draggable.init('#floatingToolbar');
        initEventListeners();

        window.renameNotebook = function(notebookId) {
            const notebook = NoteBook.getNotebook(notebookId);
            if (!notebook) return;
            
            const newName = prompt('Enter new notebook name:', notebook.name);
            if (newName && newName.trim()) {
                NoteBook.updateNotebook(notebookId, { name: newName.trim() });
                renderNotebooks();
            }
        };

        window.deleteNotebook = function(notebookId) {
            const notebook = NoteBook.getNotebook(notebookId);
            if (!notebook) return;
            
            if (confirm(`Are you sure you want to delete "${notebook.name}" and all its notes?`)) {
                NoteBook.deleteNotebook(notebookId);
                renderNotebooks();
                renderNotes();
                renderEditor();
            }
        };
    }

    return { init };
})();

window.addEventListener('load', UIController.init);

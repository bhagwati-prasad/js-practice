const UIController = (function() {
    let elements = {};
    let saveTimeout;
    let expandedCollections = new Set(); // Track which collections are expanded

    function initElements() {
        elements = {
            collectionList: document.getElementById('collectionList'),
            notesList: document.getElementById('notesList'),
            editorArea: document.getElementById('editorArea'),
            addCollectionBtn: document.getElementById('addCollectionBtn'),
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
            collectionModal: document.getElementById('collectionModal'),
            collectionNameInput: document.getElementById('collectionNameInput'),
            createCollectionBtn: document.getElementById('createCollectionBtn'),
            cancelCollectionBtn: document.getElementById('cancelCollectionBtn'),
            notebookModal: document.getElementById('notebookModal'),
            notebookNameInput: document.getElementById('notebookNameInput'),
            createNotebookBtn: document.getElementById('createNotebookBtn'),
            cancelNotebookBtn: document.getElementById('cancelNotebookBtn'),
            addItemModal: document.getElementById('addItemModal'),
            addItemNameInput: document.getElementById('addItemNameInput'),
            confirmAddItemBtn: document.getElementById('confirmAddItemBtn'),
            cancelAddItemBtn: document.getElementById('cancelAddItemBtn'),
            localStorageBtn: document.getElementById('localStorageBtn'),
            sessionStorageBtn: document.getElementById('sessionStorageBtn'),
            currentCollectionPath: document.getElementById('currentCollectionPath')
        };
    }

    function initEventListeners() {
        bindStorageEvents();
        bindCollectionEvents();
        bindNotebookEvents();
        bindAddItemEvents();
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
            renderCollections();
            renderNotes();
            renderEditor();
        });

        elements.sessionStorageBtn.addEventListener('click', function() {
            StorageDriver.setDriver('sessionStorage');
            elements.sessionStorageBtn.classList.add('active');
            elements.localStorageBtn.classList.remove('active');
            NoteBook.init();
            renderCollections();
            renderNotes();
            renderEditor();
        });
    }

    function bindCollectionEvents() {
        elements.addCollectionBtn.addEventListener('click', function() {
            elements.collectionModal.classList.add('show');
            elements.collectionNameInput.value = '';
            elements.collectionNameInput.focus();
        });

        elements.createCollectionBtn.addEventListener('click', function() {
            const name = elements.collectionNameInput.value.trim();
            if (name) {
                const currentCollectionId = NoteBook.getCurrentCollection();
                const collection = NoteBook.createCollection(name, currentCollectionId);
                if (collection) {
                    NoteBook.setCurrentCollection(collection.id);
                    renderCollections();
                    renderNotes();
                }
                elements.collectionModal.classList.remove('show');
            }
        });

        elements.cancelCollectionBtn.addEventListener('click', function() {
            elements.collectionModal.classList.remove('show');
        });

        elements.collectionNameInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                elements.createCollectionBtn.click();
            }
        });
    }

    function bindNotebookEvents() {
        elements.addNotebookBtn.addEventListener('click', function() {
            const currentCollectionId = NoteBook.getCurrentCollection();
            if (!currentCollectionId) {
                alert('Please select a collection first.');
                return;
            }
            elements.notebookModal.classList.add('show');
            elements.notebookNameInput.value = '';
            elements.notebookNameInput.focus();
        });

        elements.createNotebookBtn.addEventListener('click', function() {
            const name = elements.notebookNameInput.value.trim();
            const currentCollectionId = NoteBook.getCurrentCollection();
            if (name && currentCollectionId) {
                const notebook = NoteBook.createNotebook(currentCollectionId, name);
                if (notebook) {
                    NoteBook.setCurrentNotebook(notebook.id);
                    renderCollections();
                    renderNotes();
                }
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

    function bindAddItemEvents() {
        let targetCollectionId = null;

        window.addItemToCollection = function(collectionId) {
            targetCollectionId = collectionId;
            elements.addItemModal.classList.add('show');
            elements.addItemNameInput.value = '';
            elements.addItemNameInput.focus();
            const collectionRadio = document.querySelector('input[name="itemType"][value="collection"]');
            if (collectionRadio) {
                collectionRadio.checked = true;
            }
        };

        elements.confirmAddItemBtn.addEventListener('click', function() {
            const name = elements.addItemNameInput.value.trim();
            const itemType = document.querySelector('input[name="itemType"]:checked').value;
            
            if (name && targetCollectionId) {
                if (itemType === 'collection') {
                    NoteBook.createCollection(name, targetCollectionId);
                } else {
                    NoteBook.createNotebook(targetCollectionId, name);
                }
                renderCollections();
                elements.addItemModal.classList.remove('show');
            }
        });

        elements.cancelAddItemBtn.addEventListener('click', function() {
            elements.addItemModal.classList.remove('show');
        });

        elements.addItemNameInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                elements.confirmAddItemBtn.click();
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
                            renderCollections();
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

    function renderCollections() {
        const collections = NoteBook.getCollections();
        const currentCollectionId = NoteBook.getCurrentCollection();
        const currentNotebookId = NoteBook.getCurrentNotebook();
        elements.collectionList.innerHTML = '';
        
        function renderItemElement(item, level = 0) {
            const div = document.createElement('div');
            div.className = 'tree-item';
            div.style.paddingLeft = (level * 20 + 10) + 'px';
            
            const isCollection = item.type === 'collection';
            const isNotebook = item.type === 'notebook';
            const isActive = currentNotebookId 
                ? (isNotebook && item.id === currentNotebookId)
                : (isCollection && item.id === currentCollectionId);
            
            if (isActive) {
                div.classList.add('active');
            }
            
            const icon = isCollection ? '📁' : '📒';
            const hasChildren = isCollection && item.items && item.items.length > 0;
            const isExpanded = expandedCollections.has(item.id);
            const expandBtn = hasChildren 
                ? `<span class="expand-btn${isExpanded ? ' expanded' : ''}">➢</span>` 
                : '<span class="expand-btn invisible">➢</span>';
            
            div.innerHTML = `
                ${expandBtn}
                <span class="tree-item-icon">${icon}</span>
                <span class="tree-item-name">${item.name}</span>
                <div class="tree-item-actions">
                    ${isCollection ? `<button onclick="window.addItemToCollection('${item.id}')">+</button>` : ''}
                    <button onclick="window.renameItem('${item.id}', '${item.type}')">✎</button>
                    <button onclick="window.deleteItem('${item.id}', '${item.type}')">✕</button>
                </div>
            `;
            
            const nameSpan = div.querySelector('.tree-item-name');
            const iconSpan = div.querySelector('.tree-item-icon');
            const expandBtnEl = div.querySelector('.expand-btn');
            
            // Click on name or icon to select (and expand if collection)
            const selectHandler = function(e) {
                e.stopPropagation();
                if (isCollection) {
                    NoteBook.setCurrentCollection(item.id);
                    // Auto-expand when selecting a collection
                    if (hasChildren && !expandedCollections.has(item.id)) {
                        expandedCollections.add(item.id);
                    }
                } else if (isNotebook) {
                    NoteBook.setCurrentNotebook(item.id);
                }
                renderCollections();
                renderNotes();
                renderEditor();
            };
            
            nameSpan.addEventListener('click', selectHandler);
            iconSpan.addEventListener('click', selectHandler);
            
            // Expand/collapse functionality - only for collections with children
            if (hasChildren) {
                expandBtnEl.classList.remove('invisible');
                const childrenContainer = document.createElement('div');
                childrenContainer.className = 'tree-children';
                childrenContainer.style.display = isExpanded ? 'block' : 'none';
                
                expandBtnEl.addEventListener('click', function(e) {
                    e.stopPropagation();
                    if (expandedCollections.has(item.id)) {
                        expandedCollections.delete(item.id);
                    } else {
                        expandedCollections.add(item.id);
                    }
                    renderCollections();
                });
                
                // Recursively render children
                item.items.forEach(child => {
                    childrenContainer.appendChild(renderItemElement(child, level + 1));
                });
                
                // Return fragment containing both the item and its children
                const fragment = document.createDocumentFragment();
                fragment.appendChild(div);
                fragment.appendChild(childrenContainer);
                return fragment;
            }
            
            return div;
        }
        
        if (collections.length === 1 && collections[0].items) {
            collections[0].items.forEach(item => {
                const el = renderItemElement(item, 0);
                elements.collectionList.appendChild(el);
            });
            
            if (!currentCollectionId && !currentNotebookId && collections[0].items.length > 0) {
                const firstItem = collections[0].items[0];
                if (firstItem.type === 'collection') {
                    NoteBook.setCurrentCollection(firstItem.id);
                    expandedCollections.add(firstItem.id);
                } else {
                    NoteBook.setCurrentNotebook(firstItem.id);
                }
            }
        } else {
            collections.forEach(collection => {
                const el = renderItemElement(collection, 0);
                elements.collectionList.appendChild(el);
            });
            
            if (!currentCollectionId && collections.length > 0) {
                NoteBook.setCurrentCollection(collections[0].id);
                expandedCollections.add(collections[0].id);
            }
        }
        
        updateCollectionPath();
    }
    
    function updateCollectionPath() {
        const currentCollectionId = NoteBook.getCurrentCollection();
        const currentNotebookId = NoteBook.getCurrentNotebook();
        const currentNoteId = NoteBook.getCurrentNote();
        
        if (!elements.currentCollectionPath) return;
        
        const fullPath = NoteBook.getPath();
        
        if (fullPath.length === 0) {
            elements.currentCollectionPath.textContent = 'No selection';
            return;
        }
        
        elements.currentCollectionPath.innerHTML = '';
        
        fullPath.forEach((pathItem, index) => {
            const span = document.createElement('span');
            span.className = 'breadcrumb-segment';
            span.textContent = pathItem.name;
            span.style.cursor = 'pointer';
            span.style.color = '#007acc';
            
            span.addEventListener('click', function() {
                const targetPath = fullPath.slice(0, index + 1);
                NoteBook.setPath(targetPath);
                
                renderCollections();
                renderNotes();
                renderEditor();
            });
            
            // Hover effect
            span.addEventListener('mouseenter', function() {
                span.style.textDecoration = 'underline';
            });
            span.addEventListener('mouseleave', function() {
                span.style.textDecoration = 'none';
            });
            
            elements.currentCollectionPath.appendChild(span);
            
            // Add separator if not the last item
            if (index < fullPath.length - 1) {
                const separator = document.createElement('span');
                separator.textContent = ' > ';
                separator.style.color = '#999';
                elements.currentCollectionPath.appendChild(separator);
            }
        });
    }

    function renderNotebooks() {
        renderCollections();
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
                updateCollectionPath(); // Update breadcrumb to show note title
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
                updateCollectionPath(); // Update breadcrumb when note title changes
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
            textarea.placeholder = 'Type ...';
            
            // Auto-resize function
            function autoResize() {
                textarea.style.height = 'auto';
                textarea.style.height = textarea.scrollHeight + 'px';
            }
            
            textarea.addEventListener('input', function() {
                autoResize();
                const blockIndex = note.content.findIndex(b => b.id === id);
                if (blockIndex !== -1) {
                    note.content[blockIndex].text = this.value;
                } else {
                    note.content.push({ id, text: this.value });
                }
                triggerSave();
            });
            
            setTimeout(autoResize, 0);
            
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
                renderCollections();
                renderNotes();
                renderEditor();
                updateCollectionPath(); // Update breadcrumb when selecting from search
            });
            
            elements.notesList.appendChild(div);
        });
    }

    function init() {
        initElements();
        NoteBook.init();
        
        if (elements.currentCollectionPath) {
            elements.currentCollectionPath.textContent = 'No selection';
        }
        
        renderCollections();
        Draggable.init('#floatingToolbar');
        initEventListeners();

        window.renameItem = function(itemId, itemType) {
            const item = itemType === 'collection' 
                ? NoteBook.getCollection(itemId) 
                : NoteBook.getNotebook(itemId);
            if (!item) return;
            
            const newName = prompt(`Enter new ${itemType} name:`, item.name);
            if (newName && newName.trim()) {
                if (itemType === 'collection') {
                    NoteBook.updateCollection(itemId, { name: newName.trim() });
                } else {
                    NoteBook.updateNotebook(itemId, { name: newName.trim() });
                }
                renderCollections();
            }
        };

        window.deleteItem = function(itemId, itemType) {
            const item = itemType === 'collection' 
                ? NoteBook.getCollection(itemId) 
                : NoteBook.getNotebook(itemId);
            if (!item) return;
            
            if (confirm(`Are you sure you want to delete "${item.name}"${itemType === 'collection' ? ' and all its contents' : ' and all its notes'}?`)) {
                if (itemType === 'collection') {
                    NoteBook.deleteCollection(itemId);
                } else {
                    NoteBook.deleteNotebook(itemId);
                }
                renderCollections();
                renderNotes();
                renderEditor();
            }
        };

        // Keep old functions for backward compatibility
        window.renameNotebook = function(notebookId) {
            window.renameItem(notebookId, 'notebook');
        };

        window.deleteNotebook = function(notebookId) {
            window.deleteItem(notebookId, 'notebook');
        };
    }

    return { init };
})();

window.addEventListener('load', UIController.init);

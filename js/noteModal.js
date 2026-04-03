(function() {
    const NOTE_STYLES = [
        '/components/modal/modal.css',
        '/tools/notes/css/styles.css?v=3',
        '/tools/notes/css/note-editor.css?v=1',
        '/tools/notes/css/text-block.css?v=1',
        '/css/note-modal.css?v=1'
    ];

    const NOTE_SCRIPTS = [
        '/components/modal/modal.js?v=3',
        '/tools/notes/js/storageDriver.js',
        '/tools/notes/js/noteBook.js?v=2'
    ];

    let monacoLoaderPromise = null;

    function escapeHtml(value) {
        return String(value || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function ensureStyles() {
        NOTE_STYLES.forEach(href => {
            if (document.querySelector('link[data-note-modal="' + href + '"]')) return;
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = href;
            link.setAttribute('data-note-modal', href);
            document.head.appendChild(link);
        });
    }

    function loadScript(src) {
        return new Promise((resolve, reject) => {
            const existing = document.querySelector('script[data-note-modal="' + src + '"]');
            if (existing) {
                if (existing.dataset.loaded === 'true') {
                    resolve();
                    return;
                }
                existing.addEventListener('load', () => resolve(), { once: true });
                existing.addEventListener('error', () => reject(new Error('Failed to load ' + src)), { once: true });
                return;
            }

            const script = document.createElement('script');
            script.src = src;
            script.async = false;
            script.setAttribute('data-note-modal', src);
            script.addEventListener('load', () => {
                script.dataset.loaded = 'true';
                resolve();
            }, { once: true });
            script.addEventListener('error', () => reject(new Error('Failed to load ' + src)), { once: true });
            document.body.appendChild(script);
        });
    }

    async function ensureCoreDependencies() {
        ensureStyles();
        for (const src of NOTE_SCRIPTS) {
            await loadScript(src);
        }
        if (window.StorageDriver && typeof window.StorageDriver.setDriver === 'function') {
            window.StorageDriver.setDriver('localStorage');
        }
        if (window.NoteBook && typeof window.NoteBook.init === 'function') {
            window.NoteBook.init();
        }
    }

    function loadMonaco() {
        if (window.monaco) return Promise.resolve(window.monaco);
        if (monacoLoaderPromise) return monacoLoaderPromise;

        monacoLoaderPromise = new Promise(async (resolve, reject) => {
            try {
                if (typeof window.require === 'undefined') {
                    await loadScript('https://unpkg.com/monaco-editor@0.44.0/min/vs/loader.js');
                }
                if (typeof window.require === 'undefined') {
                    reject(new Error('Monaco loader not available'));
                    return;
                }
                window.require.config({ paths: { vs: 'https://unpkg.com/monaco-editor@0.44.0/min/vs' } });
                window.require(['vs/editor/editor.main'], function() {
                    resolve(window.monaco);
                }, reject);
            } catch (err) {
                reject(err);
            }
        });

        return monacoLoaderPromise;
    }

    function createLocationReference(context = {}) {
        return {
            pagePath: context.pagePath || window.location.pathname,
            contextType: context.contextType || 'page',
            contextId: context.contextId || window.location.pathname,
            label: context.label || document.title || 'Untitled context',
            createdAt: new Date().toISOString()
        };
    }

    function findCollectionForNotebook(notebookId) {
        const collections = window.NoteBook.getAllCollections();
        for (const col of collections) {
            const notebooks = window.NoteBook.getNotebooks(col.id);
            if (Array.isArray(notebooks) && notebooks.some(nb => nb.id === notebookId)) {
                return col;
            }
        }
        return null;
    }

    function getPathString(notebookId, noteId) {
        const notebook = window.NoteBook.getNotebook(notebookId);
        const note = window.NoteBook.getNote(notebookId, noteId);
        if (!notebook || !note) return 'No path selected';

        const col = findCollectionForNotebook(notebookId);
        if (!col) return notebook.name + ' > ' + note.title;

        const colPath = window.NoteBook.getCollectionPath(col.id) || [col];
        const left = colPath.map(item => item.name).join(' > ');
        return left + ' > ' + notebook.name + ' > ' + note.title;
    }

    function ensureNotebookTarget() {
        let currentNotebookId = window.NoteBook.getCurrentNotebook();
        if (currentNotebookId && window.NoteBook.getNotebook(currentNotebookId)) {
            return currentNotebookId;
        }

        const all = window.NoteBook.getNotebooks();
        if (all.length > 0) {
            currentNotebookId = all[0].id;
            window.NoteBook.setCurrentNotebook(currentNotebookId);
            return currentNotebookId;
        }

        const roots = window.NoteBook.getCollections();
        let root = roots[0];
        if (!root) {
            root = window.NoteBook.createCollection('collection-root');
        }
        const notebook = window.NoteBook.createNotebook(root.id, 'My First Notebook');
        if (!notebook) return null;

        window.NoteBook.setCurrentCollection(root.id);
        window.NoteBook.setCurrentNotebook(notebook.id);
        return notebook.id;
    }

    function enableDrag(container, handle) {
        if (!container || !handle) return;

        let posX = 0;
        let posY = 0;
        let mouseX = 0;
        let mouseY = 0;

        handle.onmousedown = function(e) {
            e.preventDefault();
            mouseX = e.clientX;
            mouseY = e.clientY;
            document.onmouseup = stopDrag;
            document.onmousemove = onDrag;
        };

        function onDrag(e) {
            e.preventDefault();
            posX = mouseX - e.clientX;
            posY = mouseY - e.clientY;
            mouseX = e.clientX;
            mouseY = e.clientY;

            container.style.position = 'fixed';
            container.style.top = (container.offsetTop - posY) + 'px';
            container.style.left = (container.offsetLeft - posX) + 'px';
            container.style.right = 'auto';
            container.style.margin = '0';
        }

        function stopDrag() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    async function selectExistingOrNew(reference) {
        const matches = window.NoteBook.findNotesByReference(reference);
        if (!matches.length) return { action: 'create' };

        const options = matches.map((match, index) => {
            const label = (match.note.title || 'Untitled') + ' - ' + (match.notebookName || 'Notebook');
            return '<option value="' + index + '">' + escapeHtml(label) + '</option>';
        }).join('');

        const body = [
            '<p class="modal-text">A note is already linked to this location.</p>',
            '<div class="modal-radio-group">',
            '<label><input type="radio" name="noteChoice" value="existing" checked><span>Open existing linked note</span></label>',
            '<label><input type="radio" name="noteChoice" value="new"><span>Create new linked note</span></label>',
            '</div>',
            '<label class="modal-text" for="existingLinkedNoteSelect">Choose note</label>',
            '<select id="existingLinkedNoteSelect" class="note-modal-compact-select">' + options + '</select>'
        ].join('');

        return await new Promise(resolve => {
            const decisionModal = new window.Modal({
                title: 'Linked Notes Found',
                body,
                primaryButton: {
                    text: 'Continue',
                    onClick: (m) => {
                        const selected = m.elements.body.querySelector('input[name="noteChoice"]:checked');
                        if (!selected) return false;

                        if (selected.value === 'new') {
                            resolve({ action: 'create' });
                            return true;
                        }

                        const select = m.elements.body.querySelector('#existingLinkedNoteSelect');
                        const picked = Number(select ? select.value : 0);
                        const chosen = matches[picked];
                        if (!chosen) {
                            m._shakeModal();
                            return false;
                        }

                        resolve({ action: 'open', notebookId: chosen.notebookId, noteId: chosen.note.id });
                        return true;
                    }
                },
                secondaryButton: {
                    text: 'Cancel',
                    onClick: () => {
                        resolve({ action: 'cancel' });
                        return true;
                    }
                },
                onClose: () => decisionModal.destroy()
            });
            decisionModal.show();
        });
    }

    async function chooseTargetNotebook(currentNotebookId) {
        const allCollections = window.NoteBook.getAllCollections();
        const options = allCollections.map(col => '<option value="' + escapeHtml(col.id) + '">' + escapeHtml(col.name) + '</option>').join('');

        const body = [
            '<label class="modal-text" for="targetCollectionSelect">Collection</label>',
            '<select id="targetCollectionSelect" class="note-modal-compact-select">' + options + '</select>',
            '<label class="modal-text" for="targetNotebookSelect">Notebook</label>',
            '<select id="targetNotebookSelect" class="note-modal-compact-select"></select>'
        ].join('');

        return await new Promise(resolve => {
            const picker = new window.Modal({
                title: 'Change Note Path',
                body,
                primaryButton: {
                    text: 'Move',
                    onClick: (m) => {
                        const notebookSelect = m.elements.body.querySelector('#targetNotebookSelect');
                        const notebookId = notebookSelect ? notebookSelect.value : '';
                        if (!notebookId) {
                            m._shakeModal();
                            return false;
                        }
                        resolve(notebookId);
                        return true;
                    }
                },
                secondaryButton: {
                    text: 'Cancel',
                    onClick: () => {
                        resolve(null);
                        return true;
                    }
                },
                onClose: () => picker.destroy()
            });

            picker.show().then(() => {
                const collectionSelect = picker.elements.body.querySelector('#targetCollectionSelect');
                const notebookSelect = picker.elements.body.querySelector('#targetNotebookSelect');

                function renderNotebookOptions() {
                    const notebooks = window.NoteBook.getNotebooks(collectionSelect.value) || [];
                    notebookSelect.innerHTML = notebooks
                        .map(nb => '<option value="' + escapeHtml(nb.id) + '">' + escapeHtml(nb.name) + '</option>')
                        .join('');
                    if (currentNotebookId && notebooks.some(nb => nb.id === currentNotebookId)) {
                        notebookSelect.value = currentNotebookId;
                    }
                }

                collectionSelect.addEventListener('change', renderNotebookOptions);

                const initialCollection = findCollectionForNotebook(currentNotebookId);
                if (initialCollection) {
                    collectionSelect.value = initialCollection.id;
                }
                renderNotebookOptions();
            });
        });
    }

    async function openEditorModal(notebookId, noteId) {
        let currentNotebookId = notebookId;
        const currentNoteId = noteId;
        let note = window.NoteBook.getNote(currentNotebookId, currentNoteId);
        if (!note) {
            window.Modal.alert('Note not found', 'Unable to load note.');
            return;
        }

        if (!Array.isArray(note.content)) note.content = [];

        const blockEditors = new Map();
        let saveTimeout = null;
        let codeContainerByBlock = new Map();

        const body = [
            '<div class="note-modal-layout">',
            '  <div class="note-modal-path-row">',
            '    <div id="noteModalPath" class="note-modal-path"></div>',
            '    <button id="changeNotePathBtn" class="note-editor__action-btn">Change Path</button>',
            '  </div>',
            '  <div class="note-modal-editor">',
            '    <div class="note-editor" id="noteModalEditorCard">',
            '      <div class="note-editor__header">',
            '        <input type="text" class="note-editor__title" id="noteModalTitleInput" placeholder="Note title">',
            '        <div class="note-modal-actions">',
            '          <button id="noteModalAddBlock" class="note-editor__action-btn">+ Block</button>',
            '        </div>',
            '      </div>',
            '      <div class="note-editor__body">',
            '        <div class="editor-content" id="noteModalContentContainer"></div>',
            '      </div>',
            '    </div>',
            '  </div>',
            '</div>'
        ].join('');

        const modal = new window.Modal({
            title: 'Note',
            body,
            onClose: () => {
                blockEditors.forEach(editor => editor && editor.dispose && editor.dispose());
                blockEditors.clear();
                modal.destroy();
            }
        });

        await modal.show();

        modal.elements.container.classList.add('note-modal-container');
        enableDrag(modal.elements.container, modal.elements.title.closest('.modal-header') || modal.elements.title);

        const pathEl = modal.elements.body.querySelector('#noteModalPath');
        const titleInput = modal.elements.body.querySelector('#noteModalTitleInput');
        const contentContainer = modal.elements.body.querySelector('#noteModalContentContainer');
        const addBlockBtn = modal.elements.body.querySelector('#noteModalAddBlock');
        const changePathBtn = modal.elements.body.querySelector('#changeNotePathBtn');

        function refreshPath() {
            pathEl.textContent = getPathString(currentNotebookId, currentNoteId);
        }

        function triggerSave() {
            clearTimeout(saveTimeout);
            saveTimeout = setTimeout(function() {
                window.NoteBook.updateNote(currentNotebookId, currentNoteId, {
                    title: titleInput.value || 'Untitled',
                    content: note.content
                });
                refreshPath();
            }, 400);
        }

        function generateBlockId() {
            return 'block_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        }

        function createTextBlock(text = '', blockId = null, isHighlighted = false, isCodeMode = false) {
            const id = blockId || generateBlockId();
            const wrapper = document.createElement('div');
            wrapper.className = 'text-block-card';
            if (isHighlighted) wrapper.classList.add('text-block-card--highlight');
            wrapper.dataset.blockId = id;

            const header = document.createElement('div');
            header.className = 'text-block-card__header';

            const actions = document.createElement('div');
            actions.className = 'text-block-card__actions';

            const codeBtn = document.createElement('button');
            codeBtn.className = 'text-block-card__btn';
            codeBtn.textContent = isCodeMode ? 'Text' : 'Code';

            const highlightBtn = document.createElement('button');
            highlightBtn.className = 'text-block-card__btn';
            highlightBtn.textContent = isHighlighted ? 'Unhighlight' : 'Highlight';

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'text-block-card__btn text-block-card__btn--danger';
            deleteBtn.textContent = 'Delete';

            actions.appendChild(codeBtn);
            actions.appendChild(highlightBtn);
            actions.appendChild(deleteBtn);
            header.appendChild(actions);

            const bodyEl = document.createElement('div');
            bodyEl.className = 'text-block-card__body';

            const textarea = document.createElement('textarea');
            textarea.className = 'text-block';
            textarea.value = text;
            textarea.placeholder = 'Type ...';
            textarea.dataset.mode = isCodeMode ? 'code' : 'text';
            bodyEl.appendChild(textarea);

            wrapper.appendChild(header);
            wrapper.appendChild(bodyEl);
            contentContainer.appendChild(wrapper);

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
                    note.content.push({ id, text: this.value, highlighted: false, codeMode: false });
                }
                triggerSave();
            });

            highlightBtn.addEventListener('click', function() {
                const blockIndex = note.content.findIndex(b => b.id === id);
                const nextState = !(blockIndex !== -1 ? !!note.content[blockIndex].highlighted : false);
                if (blockIndex !== -1) note.content[blockIndex].highlighted = nextState;
                wrapper.classList.toggle('text-block-card--highlight', nextState);
                highlightBtn.textContent = nextState ? 'Unhighlight' : 'Highlight';
                triggerSave();
            });

            deleteBtn.addEventListener('click', function() {
                const blockIndex = note.content.findIndex(b => b.id === id);
                if (blockIndex !== -1) note.content.splice(blockIndex, 1);
                const editor = blockEditors.get(id);
                if (editor) {
                    editor.dispose();
                    blockEditors.delete(id);
                }
                const codeEl = codeContainerByBlock.get(id);
                if (codeEl) codeEl.remove();
                wrapper.remove();
                triggerSave();
            });

            function enableCodeMode() {
                loadMonaco().then(monaco => {
                    textarea.style.display = 'none';
                    const codeContainer = document.createElement('div');
                    codeContainer.className = 'text-block-card__code';
                    bodyEl.appendChild(codeContainer);
                    codeContainerByBlock.set(id, codeContainer);

                    const editor = monaco.editor.create(codeContainer, {
                        value: textarea.value || '',
                        language: 'javascript',
                        theme: document.body.classList.contains('light-theme') ? 'vs' : 'vs-dark',
                        automaticLayout: true,
                        minimap: { enabled: false },
                        fontSize: 14,
                        lineNumbers: 'on'
                    });

                    editor.onDidChangeModelContent(function() {
                        const value = editor.getValue();
                        textarea.value = value;
                        const idx = note.content.findIndex(b => b.id === id);
                        if (idx !== -1) {
                            note.content[idx].text = value;
                            note.content[idx].codeMode = true;
                        }
                        triggerSave();
                    });

                    blockEditors.set(id, editor);
                    const idx = note.content.findIndex(b => b.id === id);
                    if (idx !== -1) note.content[idx].codeMode = true;
                    codeBtn.textContent = 'Text';
                    textarea.dataset.mode = 'code';
                    triggerSave();
                }).catch(() => {
                    window.Modal.alert('Editor load failed', 'Monaco editor could not be loaded.');
                });
            }

            function disableCodeMode() {
                const editor = blockEditors.get(id);
                if (editor) {
                    textarea.value = editor.getValue();
                    editor.dispose();
                    blockEditors.delete(id);
                }
                const codeContainer = codeContainerByBlock.get(id);
                if (codeContainer) {
                    codeContainer.remove();
                    codeContainerByBlock.delete(id);
                }
                textarea.style.display = 'block';
                const idx = note.content.findIndex(b => b.id === id);
                if (idx !== -1) {
                    note.content[idx].text = textarea.value;
                    note.content[idx].codeMode = false;
                }
                codeBtn.textContent = 'Code';
                textarea.dataset.mode = 'text';
                triggerSave();
            }

            codeBtn.addEventListener('click', function() {
                const idx = note.content.findIndex(b => b.id === id);
                const isCode = idx !== -1 ? !!note.content[idx].codeMode : textarea.dataset.mode === 'code';
                if (isCode) {
                    disableCodeMode();
                } else {
                    enableCodeMode();
                }
            });

            if (!note.content.find(b => b.id === id)) {
                note.content.push({ id, text: text || '', highlighted: !!isHighlighted, codeMode: !!isCodeMode });
            }

            if (isCodeMode) {
                enableCodeMode();
            }

            setTimeout(autoResize, 0);
        }

        titleInput.value = note.title || '';
        titleInput.addEventListener('input', triggerSave);

        if (!note.content.length) {
            createTextBlock('', null, false, false);
        } else {
            note.content.forEach(block => {
                createTextBlock(block.text || '', block.id, !!block.highlighted, !!block.codeMode);
            });
        }

        addBlockBtn.addEventListener('click', function() {
            createTextBlock('', null, false, false);
            triggerSave();
        });

        changePathBtn.addEventListener('click', async function() {
            const targetNotebookId = await chooseTargetNotebook(currentNotebookId);
            if (!targetNotebookId || targetNotebookId === currentNotebookId) return;

            const moved = window.NoteBook.moveNoteToNotebook(currentNotebookId, currentNoteId, targetNotebookId, {
                title: titleInput.value || note.title || 'Untitled'
            });

            if (!moved || moved === false) {
                const reason = window.NoteBook.getLastOperationError && window.NoteBook.getLastOperationError();
                window.Modal.alert('Path change failed', reason || 'Unable to move note.');
                return;
            }

            currentNotebookId = moved.notebookId;
            note = window.NoteBook.getNote(currentNotebookId, currentNoteId);
            refreshPath();
            triggerSave();
        });

        refreshPath();
    }

    async function openForContext(context = {}) {
        await ensureCoreDependencies();

        const reference = createLocationReference(context);
        const decision = await selectExistingOrNew(reference);

        if (!decision || decision.action === 'cancel') return;

        if (decision.action === 'open') {
            await openEditorModal(decision.notebookId, decision.noteId);
            return;
        }

        const targetNotebookId = ensureNotebookTarget();
        if (!targetNotebookId) {
            window.Modal.alert('Notebook required', 'No notebook is available for note creation.');
            return;
        }

        const baseTitle = reference.label || 'Untitled Note';
        const note = window.NoteBook.createNote(targetNotebookId, baseTitle, []);
        if (!note) {
            window.Modal.alert('Note creation failed', 'Unable to create a new note.');
            return;
        }

        window.NoteBook.addNoteReference(targetNotebookId, note.id, reference);
        await openEditorModal(targetNotebookId, note.id);
    }

    window.NoteModal = {
        openForContext,
        createLocationReference
    };
})();

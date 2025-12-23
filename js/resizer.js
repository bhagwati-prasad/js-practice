(function() {
    'use strict';

    function initVerticalResizer() {
        const resizer = document.getElementById('verticalResizer');
        const leftPanel = document.querySelector('.problem-description');
        const rightPanel = document.querySelector('.editor-section');
        
        if (!resizer || !leftPanel || !rightPanel) return;

        let isResizing = false;
        let startX = 0;
        let startLeftWidth = 0;

        resizer.addEventListener('mousedown', (e) => {
            isResizing = true;
            startX = e.clientX;
            startLeftWidth = leftPanel.offsetWidth;
            resizer.classList.add('resizing');
            document.body.style.cursor = 'col-resize';
            document.body.style.userSelect = 'none';
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isResizing) return;

            const dx = e.clientX - startX;
            const newLeftWidth = startLeftWidth + dx;
            const minWidth = 200;
            const maxWidth = window.innerWidth - 400;

            if (newLeftWidth >= minWidth && newLeftWidth <= maxWidth) {
                leftPanel.style.flex = 'none';
                leftPanel.style.width = newLeftWidth + 'px';
            }
        });

        document.addEventListener('mouseup', () => {
            if (isResizing) {
                isResizing = false;
                resizer.classList.remove('resizing');
                document.body.style.cursor = '';
                document.body.style.userSelect = '';
            }
        });
    }

    function initHorizontalResizer() {
        const resizer = document.getElementById('horizontalResizer');
        const editorContainer = document.getElementById('editor');
        const inputOutputSection = document.querySelector('.input-output-section');
        
        if (!resizer || !editorContainer || !inputOutputSection) return;

        let isResizing = false;
        let startY = 0;
        let startEditorHeight = 0;

        resizer.addEventListener('mousedown', (e) => {
            isResizing = true;
            startY = e.clientY;
            startEditorHeight = editorContainer.offsetHeight;
            resizer.classList.add('resizing');
            document.body.style.cursor = 'row-resize';
            document.body.style.userSelect = 'none';
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isResizing) return;

            const dy = e.clientY - startY;
            const newEditorHeight = startEditorHeight + dy;
            const minHeight = 150;
            const editorSection = document.querySelector('.editor-section');
            const maxHeight = editorSection.offsetHeight - 150;

            if (newEditorHeight >= minHeight && newEditorHeight <= maxHeight) {
                editorContainer.style.flex = 'none';
                editorContainer.style.height = newEditorHeight + 'px';
                
                const remainingHeight = editorSection.offsetHeight - newEditorHeight - resizer.offsetHeight;
                inputOutputSection.style.height = remainingHeight + 'px';
            }
        });

        document.addEventListener('mouseup', () => {
            if (isResizing) {
                isResizing = false;
                resizer.classList.remove('resizing');
                document.body.style.cursor = '';
                document.body.style.userSelect = '';
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initVerticalResizer();
            initHorizontalResizer();
        });
    } else {
        initVerticalResizer();
        initHorizontalResizer();
    }
})();

const Draggable = (function() {
    let draggedItem = null;
    let draggedItemType = null;
    let draggedItemId = null;

    function init(selector, handleSelector) {
        const elements = document.querySelectorAll(selector);
        
        elements.forEach(elmnt => {
            let handle;
            
            if (handleSelector) {
                handle = elmnt.querySelector(handleSelector);
            } else {
                const dragHandle = document.createElement('div');
                dragHandle.className = 'drag-handle';
                dragHandle.textContent = ':::';
                elmnt.insertBefore(dragHandle, elmnt.firstChild);
                handle = dragHandle;
            }
            
            if (!handle) {
                handle = elmnt;
            }
            
            let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
            
            handle.onmousedown = dragMouseDown;
            
            function dragMouseDown(e) {
                e.preventDefault();
                pos3 = e.clientX;
                pos4 = e.clientY;
                document.onmouseup = closeDragElement;
                document.onmousemove = elementDrag;
            }
            
            function elementDrag(e) {
                e.preventDefault();
                pos1 = pos3 - e.clientX;
                pos2 = pos4 - e.clientY;
                pos3 = e.clientX;
                pos4 = e.clientY;
                elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
                elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
                elmnt.style.right = 'auto';
            }
            
            function closeDragElement() {
                document.onmouseup = null;
                document.onmousemove = null;
            }
        });
    }

    /**
     * Initialize drag-and-drop for collection/notebook items
     * Allows dragging items to other collections to move them
     */
    function initCollectionDragDrop() {
        document.addEventListener('dragstart', handleDragStart);
        document.addEventListener('dragover', handleDragOver);
        document.addEventListener('dragleave', handleDragLeave);
        document.addEventListener('drop', handleDrop);
        document.addEventListener('dragend', handleDragEnd);
    }

    function handleDragStart(e) {
        // Check if dragging a tree-item (collection or notebook)
        const treeItem = e.target.closest('.tree-item');
        if (!treeItem) return;

        draggedItem = treeItem;
        const nameSpan = treeItem.querySelector('.tree-item-name');
        const itemType = treeItem.querySelector('.tree-item-icon').textContent === '📁' ? 'collection' : 'notebook';
        
        // Extract item ID from the context (we need to enhance this)
        draggedItemType = itemType;
        draggedItemId = treeItem.dataset.itemId;

        if (!draggedItemId) return; // No valid item to drag

        treeItem.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', treeItem.innerHTML);
    }

    function handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';

        // Check if dropping on collection-list (root container)
        const collectionList = e.target.closest('.collection-list');
        if (collectionList && !e.target.closest('.tree-item')) {
            collectionList.classList.add('drop-target');
            return;
        }

        const treeItem = e.target.closest('.tree-item');
        if (!treeItem || treeItem === draggedItem) return;

        // Only allow dropping on collections
        const icon = treeItem.querySelector('.tree-item-icon');
        if (icon && icon.textContent === '📁') {
            treeItem.classList.add('drop-target');
        }
    }

    function handleDragLeave(e) {
        const collectionList = e.target.closest('.collection-list');
        if (collectionList && !e.target.closest('.tree-item')) {
            collectionList.classList.remove('drop-target');
        }

        const treeItem = e.target.closest('.tree-item');
        if (treeItem) {
            treeItem.classList.remove('drop-target');
        }
    }

    function handleDrop(e) {
        e.preventDefault();
        e.stopPropagation();

        // Check if dropping on collection-list (root container)
        const collectionList = e.target.closest('.collection-list');
        if (collectionList && !e.target.closest('.tree-item') && draggedItemId) {
            collectionList.classList.remove('drop-target');
            
            // Move item to first root collection
            if (window.moveItemToCollection) {
                window.moveItemToCollection(draggedItemId, 'ROOT', draggedItemType);
            }
            return;
        }

        const treeItem = e.target.closest('.tree-item');
        if (!treeItem || !draggedItemId) return;

        treeItem.classList.remove('drop-target');

        // Get target collection ID
        const targetCollectionId = treeItem.dataset.itemId;

        // Check if item is a collection and target is not its own ID
        if (draggedItemType && targetCollectionId && draggedItemId !== targetCollectionId) {
            // Move the item to the target collection
            if (window.moveItemToCollection) {
                window.moveItemToCollection(draggedItemId, targetCollectionId, draggedItemType);
            }
        }
    }

    function handleDragEnd(e) {
        if (draggedItem) {
            draggedItem.classList.remove('dragging');
        }
        // Remove all drop-target classes
        document.querySelectorAll('.drop-target').forEach(el => {
            el.classList.remove('drop-target');
        });
        // Also remove from collection-list if present
        const collectionList = document.querySelector('.collection-list');
        if (collectionList) {
            collectionList.classList.remove('drop-target');
        }
        draggedItem = null;
        draggedItemType = null;
        draggedItemId = null;
    }
    
    return { 
        init,
        initCollectionDragDrop
    };
})();

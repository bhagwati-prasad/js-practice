const Draggable = (function() {
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
    
    return { init };
})();

(function() {
    'use strict';

    function initResizer(config) {
        const { direction, panel1Selector, panel2Selector, minSize = 150 } = config;
        
        const resizer = document.querySelector(`.${direction}-resizer`);
        const panel1 = document.querySelector(panel1Selector);
        const panel2 = document.querySelector(panel2Selector);
        
        if (!resizer || !panel1 || !panel2) return;

        const isHorizontal = direction === 'horizontal';
        const cursor = isHorizontal ? 'row-resize' : 'col-resize';
        const dimension = isHorizontal ? 'height' : 'width';
        const position = isHorizontal ? 'clientY' : 'clientX';
        
        let isResizing = false;
        let startPos = 0;
        let startSize = 0;

        resizer.addEventListener('mousedown', (e) => {
            isResizing = true;
            startPos = e[position];
            startSize = isHorizontal ? panel1.offsetHeight : panel1.offsetWidth;
            resizer.classList.add('resizing');
            document.body.style.cursor = cursor;
            document.body.style.userSelect = 'none';
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isResizing) return;

            const delta = e[position] - startPos;
            const newSize = startSize + delta;
            const maxSize = (isHorizontal ? panel1.parentElement.offsetHeight : window.innerWidth) - minSize - 50;

            if (newSize >= minSize && newSize <= maxSize) {
                panel1.style.flex = 'none';
                panel1.style[dimension] = newSize + 'px';
                
                if (isHorizontal && panel2) {
                    const remaining = panel1.parentElement.offsetHeight - newSize - resizer.offsetHeight;
                    panel2.style.height = remaining + 'px';
                }
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

    function init() {
        initResizer({
            direction: 'vertical',
            panel1Selector: '.problem-description',
            panel2Selector: '.editor-section',
            minSize: 200
        });

        initResizer({
            direction: 'horizontal',
            panel1Selector: '#editor',
            panel2Selector: '.input-output-section',
            minSize: 150
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

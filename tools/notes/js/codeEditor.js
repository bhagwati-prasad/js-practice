const CodeEditor = (function() {
    function getLineNumbers(content) {
        if (!content) return '1';
        const lines = content.split('\n').length;
        return Array(lines).fill(0).map((_, i) => i + 1).join('\n');
    }

    function render(container, content, onInputCallback) {
        container.innerHTML = `
            <div class="code-editor-wrapper">
                <div class="line-numbers" id="codeLineNumbers"></div>
                <textarea class="code-textarea" id="codeTextArea" spellcheck="false">${content}</textarea>
            </div>
        `;

        const textarea = document.getElementById('codeTextArea');
        const lineNumbers = document.getElementById('codeLineNumbers');

        lineNumbers.innerText = getLineNumbers(textarea.value);

        textarea.addEventListener('scroll', function() {
            lineNumbers.scrollTop = textarea.scrollTop;
        });

        textarea.addEventListener('input', function() {
            lineNumbers.innerText = getLineNumbers(textarea.value);
            onInputCallback(textarea.value);
        });

        textarea.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                e.preventDefault();
                const start = this.selectionStart;
                const end = this.selectionEnd;
                this.value = this.value.substring(0, start) + "    " + this.value.substring(end);
                this.selectionStart = this.selectionEnd = start + 4;
                const event = new Event('input');
                this.dispatchEvent(event);
            }
        });
    }

    return { render };
})();

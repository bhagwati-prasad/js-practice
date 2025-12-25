window.addEventListener('load', function() {
    const themeToggle = document.getElementById('themeToggle');

    function updateThemeIcon(isLightTheme) {
        if (!themeToggle) return;
        
        if (isLightTheme) {
            themeToggle.innerHTML = `
                <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                </svg>
            `;
        } else {
            themeToggle.innerHTML = `
                <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/>
                </svg>
            `;
        }
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('light-theme');
            
            const isLightTheme = document.body.classList.contains('light-theme');
            
            if (window.monacoLoaded && window.editor && typeof monaco !== 'undefined') {
                monaco.editor.setTheme(isLightTheme ? 'vs' : 'vs-dark');
            }
            
            updateThemeIcon(isLightTheme);
            localStorage.setItem('theme', document.body.classList.contains('light-theme') ? 'light' : 'dark');
        });
    }

    if (localStorage.getItem('theme') === 'light') {
        document.body.classList.add('light-theme');
        updateThemeIcon(true);
    }
});
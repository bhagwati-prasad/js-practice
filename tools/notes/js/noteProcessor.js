const NoteProcessor = (function() {
    function sortSubsection() {
        const currentNotebookId = NoteBook.getCurrentNotebook();
        const currentNoteId = NoteBook.getCurrentNote();
        
        if (!currentNotebookId || !currentNoteId) return false;

        const note = NoteBook.getNote(currentNotebookId, currentNoteId);
        if (!note.content || !Array.isArray(note.content)) return false;

        note.content.forEach(block => {
            if (!block.text) return;
            
            const delimiter = '----';
            const sections = block.text.split(delimiter);
            
            const sortedSections = sections.map(section => {
                return section
                    .trim()
                    .split('\n')
                    .filter(line => line.trim() !== '')
                    .sort((a, b) => a.localeCompare(b))
                    .join('\n');
            });

            block.text = sortedSections.join(`\n${delimiter}\n`);
        });
        
        NoteBook.updateNote(currentNotebookId, currentNoteId, { content: note.content });
        
        return true;
    }

    return { sortSubsection };
})();

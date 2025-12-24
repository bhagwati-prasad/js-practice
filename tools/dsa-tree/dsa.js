/**
 * ConceptVisualizer Module
 * Renders a hierarchical JSON tree in two modes: 'directory' and 'graph'.
 */

const CSS_STYLES = `
<style>
    :root {
        --cv-primary: #2563eb;
        --cv-bg: #f8fafc;
        --cv-border: #cbd5e1;
        --cv-text: #1e293b;
        --cv-line-color: #94a3b8;
    }

    .cv-container {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        color: var(--cv-text);
        padding: 20px;
        background: var(--cv-bg);
        border-radius: 8px;
        overflow-x: auto;
    }

    /* --- MODE 1: DIRECTORY TREE --- */
    .cv-directory ul {
        list-style-type: none;
        padding-left: 20px;
        margin: 0;
    }
    
    .cv-directory li {
        margin: 5px 0;
        position: relative;
    }

    .cv-directory details > summary {
        cursor: pointer;
        font-weight: 600;
        padding: 4px 8px;
        border-radius: 4px;
        transition: background 0.2s;
        list-style: none; /* Hide default triangle in some browsers */
    }

    .cv-directory details > summary::-webkit-details-marker {
        display: none;
    }

    .cv-directory details > summary:before {
        content: '📁';
        margin-right: 8px;
        display: inline-block;
    }

    .cv-directory details[open] > summary:before {
        content: '📂';
    }

    .cv-directory .node-leaf {
        padding: 4px 8px;
        margin-left: 20px;
        display: block;
    }
    
    .cv-directory .node-leaf:before {
        content: '📄';
        margin-right: 8px;
    }

    .cv-directory .meta-tag {
        font-size: 0.8em;
        background: #e2e8f0;
        padding: 2px 6px;
        border-radius: 4px;
        margin-left: 10px;
        color: #475569;
    }

    /* --- MODE 2: GRAPH (ORG CHART) --- */
    .cv-graph {
        display: flex;
        justify-content: center;
        min-width: fit-content;
    }

    .cv-graph table {
        border-collapse: collapse;
        margin: 0 auto;
    }

    .cv-graph td {
        text-align: center;
        vertical-align: top;
        padding: 0 5px;
        position: relative;
    }

    .cv-node-card {
        border: 2px solid var(--cv-primary);
        background: white;
        padding: 10px;
        border-radius: 8px;
        display: inline-block;
        min-width: 120px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        z-index: 2;
        position: relative;
    }

    .cv-node-title {
        font-weight: bold;
        display: block;
        margin-bottom: 4px;
    }

    .cv-node-problems {
        font-size: 0.75em;
        color: #64748b;
        text-align: left;
        border-top: 1px solid #eee;
        padding-top: 4px;
        margin-top: 4px;
    }

    /* Lines for the Graph */
    .cv-line-down {
        background: var(--cv-line-color);
        width: 2px;
        height: 20px;
        margin: 0 auto;
    }

    .cv-line-top {
        border-top: 2px solid var(--cv-line-color);
    }

    .cv-line-left {
        border-right: 2px solid var(--cv-line-color);
    }

    .cv-line-right {
        border-left: 2px solid var(--cv-line-color);
    }
</style>
`;

const ConceptVisualizer = (function() {

    // --- HELPER: Render Related Concepts Badge ---
    function renderBadges(node) {
        if (!node.related_concepts || node.related_concepts.length === 0) return '';
        return `<span class="meta-tag" title="Related to: ${node.related_concepts.join(', ')}">🔗 ${node.related_concepts.length} Related</span>`;
    }

    // --- MODE 1: DIRECTORY RECURSION ---
    function buildDirectoryHTML(node) {
        const hasChildren = node.children && node.children.length > 0;
        const badges = renderBadges(node);

        if (hasChildren) {
            let childrenHTML = node.children.map(child => buildDirectoryHTML(child)).join('');
            return `
                <li>
                    <details open>
                        <summary>${node.name} ${badges}</summary>
                        <ul>${childrenHTML}</ul>
                    </details>
                </li>`;
        } else {
            return `
                <li>
                    <span class="node-leaf">${node.name} ${badges}</span>
                </li>`;
        }
    }

    // --- MODE 2: GRAPH RECURSION (TABLE-BASED LAYOUT) ---
    // Using tables is the most robust way to align trees in pure HTML/CSS without absolute positioning math
    function buildGraphHTML(node) {
        const hasChildren = node.children && node.children.length > 0;
        const badges = renderBadges(node);
        const problemCount = node.problems ? node.problems.length : 0;
        
        const cardHTML = `
            <div class="cv-node-card">
                <span class="cv-node-title">${node.name}</span>
                ${badges}
                ${problemCount > 0 ? `<div class="cv-node-problems">${problemCount} Problems</div>` : ''}
            </div>
        `;

        if (!hasChildren) {
            return `
                <table>
                    <tr><td colspan="2">${cardHTML}</td></tr>
                </table>`;
        }

        let childrenCells = '';
        node.children.forEach((child, index) => {
            // Logic to draw connecting lines
            const isFirst = index === 0;
            const isLast = index === node.children.length - 1;
            
            let lineHTML = '';
            
            // We need a row above the child to hold the connector lines
            // Left Line | Right Line
            if (node.children.length > 1) {
                 const leftClass = isFirst ? '' : 'cv-line-top cv-line-left'; // Line comes from right, goes down
                 const rightClass = isLast ? '' : 'cv-line-top cv-line-right'; // Line comes from left, goes down
                 // Middle nodes need both borders
                 
                 // Special case: if only 2 children, or middle child
                 lineHTML = `
                    <tr>
                        <td class="${isFirst ? '' : 'cv-line-top'} ${isLast ? '' : 'cv-line-left'}">&nbsp;</td>
                        <td class="${isFirst ? '' : 'cv-line-top'} ${isLast ? '' : 'cv-line-right'}">&nbsp;</td>
                    </tr>
                 `;
            } else {
                // Single child, just a straight line down
                lineHTML = `<tr><td colspan="2"><div class="cv-line-down"></div></td></tr>`;
            }

            childrenCells += `
                <td>
                    <table>
                        ${lineHTML}
                        <tr><td colspan="2">${buildGraphHTML(child)}</td></tr>
                    </table>
                </td>
            `;
        });

        return `
            <table>
                <tr>
                    <td colspan="${node.children.length * 2}">
                        ${cardHTML}
                        <div class="cv-line-down"></div>
                    </td>
                </tr>
                <tr>
                    ${childrenCells}
                </tr>
            </table>
        `;
    }

    // --- PUBLIC API ---
    return {
        /**
         * Renders the tree into a container.
         * @param {Object} data - The JSON tree object (must have a single root object or be the root itself).
         * @param {HTMLElement} element - The DOM element to append to.
         * @param {string} mode - 'directory' or 'graph'.
         */
        render: function(data, element, mode = 'directory') {
            if (!element) {
                console.error("Target element not found.");
                return;
            }

            // Normalize data: if data is wrapper {root: {...}}, use data.root
            const rootNode = data.root ? data.root : data;

            let contentHTML = '';
            
            if (mode === 'directory') {
                contentHTML = `
                    <div class="cv-directory">
                        <ul>${buildDirectoryHTML(rootNode)}</ul>
                    </div>`;
            } else if (mode === 'graph') {
                contentHTML = `
                    <div class="cv-graph">
                        ${buildGraphHTML(rootNode)}
                    </div>`;
            } else {
                contentHTML = `<p>Error: Unknown mode '${mode}'</p>`;
            }

            element.innerHTML = CSS_STYLES + `<div class="cv-container">${contentHTML}</div>`;
        }
    };
})();

export default ConceptVisualizer;
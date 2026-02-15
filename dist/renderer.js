/**
 * Core renderer — parses markdown and dispatches to block renderers.
 */
import { parseMarkdown } from 'blecsd/utils';
import { renderInline } from './inline.js';
import { renderHeading } from './blocks/heading.js';
import { renderCode } from './blocks/code.js';
import { renderList } from './blocks/list.js';
import { renderTable } from './blocks/table.js';
import { renderBlockquote } from './blocks/blockquote.js';
import { renderHr } from './blocks/hr.js';
/**
 * Render an array of markdown blocks into markup-tagged lines.
 * Exported for use by blockquote (recursive rendering).
 */
export function renderBlocks(blocks, theme, width) {
    const allLines = [];
    for (let i = 0; i < blocks.length; i++) {
        const block = blocks[i];
        const blockLines = renderBlock(block, theme, width);
        allLines.push(...blockLines);
        // Add spacing between blocks (but not after the last one)
        if (i < blocks.length - 1) {
            allLines.push('');
        }
    }
    return allLines;
}
function renderBlock(block, theme, width) {
    const { data } = block;
    switch (data.kind) {
        case 'heading':
            return renderHeading(data, theme, width);
        case 'code':
            return renderCode(data, theme, width);
        case 'list':
            return renderList(data, theme, width);
        case 'table':
            return renderTable(data, theme, width);
        case 'blockquote':
            return renderBlockquote(data, theme, width);
        case 'hr':
            return renderHr(theme, width);
        case 'paragraph':
            return [renderInline(data.inline, theme)];
        case 'html':
            // Render raw HTML as dimmed text
            return [`{dim}${data.html}{/dim}`];
        default:
            return [];
    }
}
/**
 * Main entry point: parse markdown source and render to a single markup-tagged string.
 */
export function renderMarkdownToMarkup(source, theme, width) {
    const result = parseMarkdown(source);
    const lines = renderBlocks(result.blocks, theme, width);
    return lines.join('\n');
}
//# sourceMappingURL=renderer.js.map
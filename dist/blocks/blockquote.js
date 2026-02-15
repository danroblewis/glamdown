/**
 * Blockquote block renderer — left bar + dimmed italic text.
 */
import { renderBlocks } from '../renderer.js';
export function renderBlockquote(data, theme, width) {
    // Recursively render nested blocks
    const innerLines = renderBlocks(data.blocks, theme, width - 4);
    // Prefix each line with the bar
    return innerLines.map((line) => `  {${theme.blockquoteBar}-fg}│{/} {italic}{dim}${line}{/dim}{/italic}`);
}
//# sourceMappingURL=blockquote.js.map
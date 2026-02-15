/**
 * Blockquote block renderer — left bar + dimmed italic text.
 */

import type { BlockquoteData } from 'blecsd/utils';
import { renderBlocks } from '../renderer.js';
import type { Theme } from '../theme.js';

export function renderBlockquote(
  data: BlockquoteData,
  theme: Theme,
  width: number,
): string[] {
  // Recursively render nested blocks
  const innerLines = renderBlocks(data.blocks, theme, width - 4);

  // Prefix each line with the bar
  return innerLines.map(
    (line) =>
      `  {${theme.blockquoteBar}-fg}│{/} {italic}{dim}${line}{/dim}{/italic}`,
  );
}

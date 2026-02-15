/**
 * Core renderer — parses markdown and dispatches to block renderers.
 */

import { parseMarkdown, type MarkdownBlock } from 'blecsd/utils';
import { renderInline } from './inline.js';
import { renderHeading } from './blocks/heading.js';
import { renderCode } from './blocks/code.js';
import { renderList } from './blocks/list.js';
import { renderTable } from './blocks/table.js';
import { renderBlockquote } from './blocks/blockquote.js';
import { renderHr } from './blocks/hr.js';
import type { Theme } from './theme.js';

/**
 * Render an array of markdown blocks into markup-tagged lines.
 * Exported for use by blockquote (recursive rendering).
 */
export function renderBlocks(
  blocks: readonly MarkdownBlock[],
  theme: Theme,
  width: number,
): string[] {
  const allLines: string[] = [];

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i]!;
    const blockLines = renderBlock(block, theme, width);
    allLines.push(...blockLines);

    // Add spacing between blocks (but not after the last one)
    if (i < blocks.length - 1) {
      allLines.push('');
    }
  }

  return allLines;
}

function renderBlock(
  block: MarkdownBlock,
  theme: Theme,
  width: number,
): string[] {
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
export function renderMarkdownToMarkup(
  source: string,
  theme: Theme,
  width: number,
): string {
  const result = parseMarkdown(source);
  const lines = renderBlocks(result.blocks, theme, width);
  return lines.join('\n');
}

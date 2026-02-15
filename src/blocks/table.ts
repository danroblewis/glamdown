/**
 * Table block renderer — Unicode box-drawing table.
 */

import type { TableData } from 'blecsd/utils';
import { stripTags } from 'blecsd';
import { renderInline } from '../inline.js';
import type { Theme } from '../theme.js';

export function renderTable(
  data: TableData,
  theme: Theme,
  _width: number,
): string[] {
  const lines: string[] = [];
  const numCols = data.headers.length;

  // Render all cell content and measure visible widths
  const headerTexts = data.headers.map((h) => renderInline(h.inline, theme));
  const headerWidths = data.headers.map((h) => stripTags(renderInline(h.inline, theme)).length);

  const rowTexts = data.rows.map((row) =>
    row.map((cell) => renderInline(cell.inline, theme)),
  );
  const rowWidths = data.rows.map((row) =>
    row.map((cell) => stripTags(renderInline(cell.inline, theme)).length),
  );

  // Calculate column widths
  const colWidths: number[] = [];
  for (let c = 0; c < numCols; c++) {
    let max = headerWidths[c] ?? 0;
    for (const rw of rowWidths) {
      max = Math.max(max, rw[c] ?? 0);
    }
    colWidths.push(Math.max(max, 3)); // minimum 3 chars
  }

  const bc = theme.tableBorder;

  // Helper to pad a tagged string to a visible width
  function padCell(tagged: string, visibleLen: number, colIdx: number): string {
    const target = colWidths[colIdx]!;
    const padNeeded = Math.max(0, target - visibleLen);
    const align = data.alignments[colIdx] ?? 'left';

    if (align === 'center') {
      const left = Math.floor(padNeeded / 2);
      const right = padNeeded - left;
      return ' '.repeat(left) + tagged + ' '.repeat(right);
    } else if (align === 'right') {
      return ' '.repeat(padNeeded) + tagged;
    }
    return tagged + ' '.repeat(padNeeded);
  }

  // Top border: ┌───┬───┐
  const topSegments = colWidths.map((w) => '─'.repeat(w + 2));
  lines.push(`{${bc}-fg}┌${topSegments.join('┬')}┐{/}`);

  // Header row: │ H1 │ H2 │
  const headerCells = headerTexts.map((text, i) =>
    ` {bold}${padCell(text, headerWidths[i]!, i)}{/bold} `,
  );
  lines.push(`{${bc}-fg}│{/}${headerCells.join(`{${bc}-fg}│{/}`)}{${bc}-fg}│{/}`);

  // Separator: ├───┼───┤
  const sepSegments = colWidths.map((w) => '─'.repeat(w + 2));
  lines.push(`{${bc}-fg}├${sepSegments.join('┼')}┤{/}`);

  // Data rows
  for (let r = 0; r < data.rows.length; r++) {
    const cells = rowTexts[r]!.map((text, c) =>
      ` ${padCell(text, rowWidths[r]![c]!, c)} `,
    );
    lines.push(`{${bc}-fg}│{/}${cells.join(`{${bc}-fg}│{/}`)}{${bc}-fg}│{/}`);
  }

  // Bottom border: └───┴───┘
  const bottomSegments = colWidths.map((w) => '─'.repeat(w + 2));
  lines.push(`{${bc}-fg}└${bottomSegments.join('┴')}┘{/}`);

  return lines;
}

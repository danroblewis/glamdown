/**
 * List block renderer — bullet, ordered, and task lists.
 */

import type { ListData } from 'blecsd/utils';
import { renderInline } from '../inline.js';
import type { Theme } from '../theme.js';

const BULLETS = ['•', '◦', '▸'];

export function renderList(
  data: ListData,
  theme: Theme,
  _width: number,
): string[] {
  const lines: string[] = [];
  let orderedIndex = data.start ?? 1;

  for (const item of data.items) {
    const indent = '  '.repeat(item.indent);
    const content = renderInline(item.inline, theme);

    if (item.checked !== undefined) {
      // Task list
      if (item.checked) {
        lines.push(
          `${indent}{${theme.taskDone}-fg} {/} ${content}`,
        );
      } else {
        lines.push(
          `${indent}{${theme.taskPending}-fg} {/} ${content}`,
        );
      }
    } else if (data.ordered) {
      lines.push(`${indent}{${theme.bulletColor}-fg}${orderedIndex}.{/} ${content}`);
      orderedIndex++;
    } else {
      const bullet = BULLETS[Math.min(item.indent, BULLETS.length - 1)]!;
      lines.push(`${indent}{${theme.bulletColor}-fg}${bullet}{/} ${content}`);
    }
  }

  return lines;
}

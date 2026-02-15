/**
 * Horizontal rule renderer.
 */

import type { Theme } from '../theme.js';

export function renderHr(theme: Theme, width: number): string[] {
  return [
    '',
    `{${theme.hrColor}-fg}${'─'.repeat(width)}{/}`,
    '',
  ];
}

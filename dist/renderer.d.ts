/**
 * Core renderer — parses markdown and dispatches to block renderers.
 */
import { type MarkdownBlock } from 'blecsd/utils';
import type { Theme } from './theme.js';
/**
 * Render an array of markdown blocks into markup-tagged lines.
 * Exported for use by blockquote (recursive rendering).
 */
export declare function renderBlocks(blocks: readonly MarkdownBlock[], theme: Theme, width: number): string[];
/**
 * Main entry point: parse markdown source and render to a single markup-tagged string.
 */
export declare function renderMarkdownToMarkup(source: string, theme: Theme, width: number): string;

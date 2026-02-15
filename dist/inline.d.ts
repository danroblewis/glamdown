/**
 * Inline element renderer — converts InlineElement[] to markup-tagged string.
 */
import type { InlineElement } from 'blecsd/utils';
import type { Theme } from './theme.js';
export declare function renderInline(elements: readonly InlineElement[], theme: Theme): string;

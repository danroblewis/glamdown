/**
 * Code block renderer — fenced code with box-drawing border + syntax highlighting.
 *
 * Code lines are output as pre-rendered ANSI (prefixed with ANSI_PREFIX)
 * because brace escaping conflicts with the tag system for `{` and `}` characters.
 */
import type { CodeData } from 'blecsd/utils';
import type { Theme } from '../theme.js';
/** Prefix marker for lines that contain raw ANSI instead of tags */
export declare const ANSI_PREFIX = "\0ANSI\0";
export declare function renderCode(data: CodeData, theme: Theme, width: number): string[];

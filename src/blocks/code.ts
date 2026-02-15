/**
 * Code block renderer — fenced code with box-drawing border + syntax highlighting.
 *
 * Code lines are output as pre-rendered ANSI (prefixed with ANSI_PREFIX)
 * because brace escaping conflicts with the tag system for `{` and `}` characters.
 */

import {
  escapeTags,
  getGrammarByName,
  createHighlightCache,
  highlightWithCache,
  type TokenType,
} from 'blecsd';
import type { CodeData } from 'blecsd/utils';
import type { Theme } from '../theme.js';

/** Prefix marker for lines that contain raw ANSI instead of tags */
export const ANSI_PREFIX = '\x00ANSI\x00';

const CSI = '\x1b[';

function sgrReset(): string {
  return `${CSI}0m`;
}

function sgrFg(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${CSI}38;2;${r};${g};${b}m`;
}

function sgrBg(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${CSI}48;2;${r};${g};${b}m`;
}

const TOKEN_COLORS: Record<string, keyof Theme> = {
  keyword: 'syntaxKeyword',
  string: 'syntaxString',
  number: 'syntaxNumber',
  comment: 'syntaxComment',
  function: 'syntaxFunction',
  type: 'syntaxType',
  constant: 'syntaxConstant',
  operator: 'syntaxOperator',
  property: 'syntaxProperty',
  variable: 'syntaxVariable',
  builtin: 'syntaxBuiltin',
  regexp: 'syntaxRegexp',
  tag: 'syntaxTag',
  attribute: 'syntaxAttribute',
  punctuation: 'syntaxPunctuation',
};

/** Render a single code line to ANSI with syntax highlighting */
function highlightLineAnsi(
  lineText: string,
  tokens: readonly { readonly type: TokenType; readonly text: string }[],
  theme: Theme,
): string {
  if (tokens.length === 0) {
    return sgrFg(theme.codeText) + lineText + sgrReset();
  }

  let result = '';
  for (const token of tokens) {
    const colorKey = TOKEN_COLORS[token.type];
    const color = colorKey ? (theme[colorKey] as string) : theme.codeText;
    result += sgrFg(color) + token.text;
  }
  result += sgrReset();
  return result;
}

export function renderCode(
  data: CodeData,
  theme: Theme,
  width: number,
): string[] {
  const lines: string[] = [];
  const codeLines = data.code.replace(/\n$/, '').split('\n');

  // Determine inner width (border + padding on each side)
  const innerWidth = Math.max(width - 4, 10);

  // Try syntax highlighting
  let highlightedLines: { tokens: readonly { readonly type: TokenType; readonly text: string }[]; text: string }[] | null = null;
  if (data.language) {
    try {
      const grammar = getGrammarByName(data.language);
      if (grammar.name !== 'plaintext' || data.language === 'plaintext') {
        const cache = createHighlightCache(grammar);
        const result = highlightWithCache(cache, data.code);
        highlightedLines = result.map((entry) => ({
          tokens: entry.tokens,
          text: entry.text,
        }));
      }
    } catch {
      // Fall back to plain text
    }
  }

  // Build language label (tag-based, no braces in content)
  const lang = data.language ? ` ${data.language} ` : '';

  // Top border (tag-based — no braces in border chars)
  const topAfterLabel = Math.max(0, width - 2 - lang.length - 3);
  const topBorder = `{${theme.codeBorderColor}-fg}╭${'─'.repeat(3)}{${theme.codeLabelColor}-fg}${lang}{${theme.codeBorderColor}-fg}${'─'.repeat(topAfterLabel)}╮{/}`;
  lines.push(topBorder);

  // Code lines — pre-rendered as ANSI to avoid brace escaping issues
  const borderColor = sgrFg(theme.codeBorderColor);
  const bgColor = sgrBg(theme.codeBg);

  for (let i = 0; i < codeLines.length; i++) {
    const raw = codeLines[i]!;
    let content: string;

    if (highlightedLines && highlightedLines[i]) {
      content = highlightLineAnsi(raw, highlightedLines[i]!.tokens, theme);
    } else {
      content = sgrFg(theme.codeText) + raw + sgrReset();
    }

    // Pad visible content to inner width
    const padLen = Math.max(0, innerWidth - raw.length);
    const padding = ' '.repeat(padLen);

    // Build complete ANSI line with border and bg
    const line =
      borderColor + '│' + sgrReset() + ' ' +
      bgColor + content + padding + sgrReset() +
      ' ' + borderColor + '│' + sgrReset();

    lines.push(ANSI_PREFIX + line);
  }

  // Bottom border (tag-based)
  const bottomBorder = `{${theme.codeBorderColor}-fg}╰${'─'.repeat(width - 2)}╯{/}`;
  lines.push(bottomBorder);

  return lines;
}

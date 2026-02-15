/**
 * Application setup — uses blECSd program for terminal I/O and parseTags for styling.
 * Renders content directly to the terminal with manual scrolling.
 */

import { parseTags, stripTags } from 'blecsd';
import { createProgram, type Program } from 'blecsd/terminal';
import { renderMarkdownToMarkup } from './renderer.js';
import { theme } from './theme.js';
import { setupInput } from './input.js';
import { ANSI_PREFIX } from './blocks/code.js';

/** ANSI escape helpers */
const CSI = '\x1b[';

function sgrReset(): string {
  return `${CSI}0m`;
}

function sgrFg(r: number, g: number, b: number): string {
  return `${CSI}38;2;${r};${g};${b}m`;
}

function sgrBg(r: number, g: number, b: number): string {
  return `${CSI}48;2;${r};${g};${b}m`;
}

function moveTo(x: number, y: number): string {
  return `${CSI}${y + 1};${x + 1}H`;
}

// AttrFlags values from blecsd/utils/sattr
const ATTR_BOLD          = 1 << 0;
const ATTR_UNDERLINE     = 1 << 1;
const ATTR_BLINK         = 1 << 2;
const ATTR_INVERSE       = 1 << 3;
const ATTR_DIM           = 1 << 5;
const ATTR_ITALIC        = 1 << 6;
const ATTR_STRIKETHROUGH = 1 << 7;

function attrCodes(attrs: number): string {
  let s = '';
  if (attrs & ATTR_BOLD) s += `${CSI}1m`;
  if (attrs & ATTR_DIM) s += `${CSI}2m`;
  if (attrs & ATTR_ITALIC) s += `${CSI}3m`;
  if (attrs & ATTR_UNDERLINE) s += `${CSI}4m`;
  if (attrs & ATTR_BLINK) s += `${CSI}5m`;
  if (attrs & ATTR_INVERSE) s += `${CSI}7m`;
  if (attrs & ATTR_STRIKETHROUGH) s += `${CSI}9m`;
  return s;
}

export interface ViewerState {
  scrollY: number;
  lines: string[];
  program: Program;
  cols: number;
  rows: number;
  filename: string;
}

/**
 * Unpack RGBA color from parseTags (format: (R<<24)|(G<<16)|(B<<8)|A).
 * This differs from blecsd's unpackColor which expects ARGB.
 */
function unpackRgba(color: number): { r: number; g: number; b: number; a: number } {
  return {
    r: (color >>> 24) & 0xff,
    g: (color >>> 16) & 0xff,
    b: (color >>> 8) & 0xff,
    a: color & 0xff,
  };
}

/** Parse a tagged line into ANSI-escaped string */
function taggedLineToAnsi(taggedLine: string): string {
  const parsed = parseTags(taggedLine);
  let result = '';

  for (const seg of parsed.segments) {
    // Apply style
    result += sgrReset();

    // Foreground (parseTags packs colors as RGBA)
    const fg = unpackRgba(seg.fg);
    if (fg.a > 0) {
      result += sgrFg(fg.r, fg.g, fg.b);
    }

    // Background
    const bg = unpackRgba(seg.bg);
    if (bg.a > 0) {
      result += sgrBg(bg.r, bg.g, bg.b);
    }

    // Attributes
    if (seg.attrs) {
      result += attrCodes(seg.attrs);
    }

    result += seg.text;
  }

  result += sgrReset();
  return result;
}

/** Render the visible portion of content to the terminal */
export function render(state: ViewerState): void {
  const { program, lines, scrollY, cols, rows, filename } = state;
  const viewHeight = rows - 2; // Reserve 1 for header, 1 for footer

  let output = '';

  // Header bar
  const title = ` glamdown — ${filename} `;
  const padR = Math.max(0, cols - title.length);
  output += moveTo(0, 0);
  output += sgrReset();
  output += sgrBg(49, 50, 68); // #313244
  output += sgrFg(205, 214, 244); // #cdd6f4
  output += `${CSI}1m`; // bold
  output += title + ' '.repeat(padR);
  output += sgrReset();

  // Content area
  for (let i = 0; i < viewHeight; i++) {
    const lineIdx = scrollY + i;
    output += moveTo(0, i + 1);
    output += sgrReset();

    if (lineIdx < lines.length) {
      const line = lines[lineIdx]!;
      if (line.startsWith(ANSI_PREFIX)) {
        // Pre-rendered ANSI line (code block content)
        const ansiContent = line.slice(ANSI_PREFIX.length);
        output += ansiContent;
      } else {
        const ansiLine = taggedLineToAnsi(line);
        // Pad line to full width to clear previous content
        const visLen = stripTags(line).length;
        const pad = Math.max(0, cols - visLen);
        output += ansiLine + ' '.repeat(pad);
      }
    } else {
      // Empty line
      output += ' '.repeat(cols);
    }
  }

  // Footer bar
  const totalLines = lines.length;
  const scrollPercent =
    totalLines <= viewHeight
      ? 100
      : Math.round((scrollY / Math.max(1, totalLines - viewHeight)) * 100);
  const footerLeft = ` q:quit  j/k:scroll  space/pgdn:page  g/G:top/bottom`;
  const footerRight = `${scrollPercent}% (${scrollY + 1}/${totalLines}) `;
  const footerPad = Math.max(0, cols - footerLeft.length - footerRight.length);
  output += moveTo(0, rows - 1);
  output += sgrReset();
  output += sgrBg(49, 50, 68);
  output += sgrFg(166, 173, 200); // #a6adc8
  output += footerLeft + ' '.repeat(footerPad) + footerRight;
  output += sgrReset();

  program.rawWrite(output);
  program.flush();
}

export async function runApp(source: string, filename: string): Promise<void> {
  // 1. Create terminal program
  const program = createProgram({
    useAlternateScreen: true,
    hideCursor: true,
    title: `glamdown — ${filename}`,
  });

  await program.init();

  const cols = program.cols;
  const rows = program.rows;

  // 2. Render markdown to tagged markup lines
  const contentWidth = Math.max(cols - 2, 20);
  const renderedContent = renderMarkdownToMarkup(source, theme, contentWidth);
  const lines = renderedContent.split('\n');

  // 3. Create viewer state
  const state: ViewerState = {
    scrollY: 0,
    lines,
    program,
    cols,
    rows,
    filename,
  };

  // 4. Initial render
  render(state);

  // 5. Set up input handling
  setupInput(state);
}

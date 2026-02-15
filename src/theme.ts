/**
 * Catppuccin Mocha-inspired color theme for glamdown.
 */

export interface Theme {
  // Headings
  h1: string;
  h2: string;
  h3: string;
  h4: string;
  h5: string;
  h6: string;

  // Body
  text: string;
  bg: string;

  // Inline
  inlineCodeFg: string;
  inlineCodeBg: string;
  linkColor: string;

  // Code blocks
  codeBorderColor: string;
  codeBg: string;
  codeText: string;
  codeLabelColor: string;

  // Blockquote
  blockquoteBar: string;
  blockquoteText: string;

  // List
  bulletColor: string;
  taskDone: string;
  taskPending: string;

  // Table
  tableBorder: string;

  // HR
  hrColor: string;

  // Scrollbar
  scrollbarFg: string;
  scrollbarBg: string;

  // Syntax highlight
  syntaxKeyword: string;
  syntaxString: string;
  syntaxNumber: string;
  syntaxComment: string;
  syntaxFunction: string;
  syntaxType: string;
  syntaxConstant: string;
  syntaxOperator: string;
  syntaxProperty: string;
  syntaxVariable: string;
  syntaxBuiltin: string;
  syntaxRegexp: string;
  syntaxTag: string;
  syntaxAttribute: string;
  syntaxPunctuation: string;
}

export const theme: Theme = {
  // Headings — Catppuccin Mocha
  h1: '#f38ba8',
  h2: '#fab387',
  h3: '#f9e2af',
  h4: '#a6e3a1',
  h5: '#89b4fa',
  h6: '#cba6f7',

  // Body
  text: '#cdd6f4',
  bg: '#1e1e2e',

  // Inline code
  inlineCodeFg: '#cba6f7',
  inlineCodeBg: '#313244',

  // Links
  linkColor: '#89b4fa',

  // Code blocks
  codeBorderColor: '#585b70',
  codeBg: '#1e1e2e',
  codeText: '#cdd6f4',
  codeLabelColor: '#a6adc8',

  // Blockquote
  blockquoteBar: '#585b70',
  blockquoteText: '#a6adc8',

  // Lists
  bulletColor: '#f9e2af',
  taskDone: '#a6e3a1',
  taskPending: '#f38ba8',

  // Table
  tableBorder: '#585b70',

  // HR
  hrColor: '#585b70',

  // Scrollbar
  scrollbarFg: '#585b70',
  scrollbarBg: '#313244',

  // Syntax highlighting
  syntaxKeyword: '#cba6f7',
  syntaxString: '#a6e3a1',
  syntaxNumber: '#fab387',
  syntaxComment: '#6c7086',
  syntaxFunction: '#89b4fa',
  syntaxType: '#f9e2af',
  syntaxConstant: '#fab387',
  syntaxOperator: '#89dceb',
  syntaxProperty: '#89b4fa',
  syntaxVariable: '#cdd6f4',
  syntaxBuiltin: '#f38ba8',
  syntaxRegexp: '#f38ba8',
  syntaxTag: '#f38ba8',
  syntaxAttribute: '#f9e2af',
  syntaxPunctuation: '#9399b2',
};

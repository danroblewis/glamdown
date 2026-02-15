/**
 * Catppuccin Mocha-inspired color theme for glamdown.
 */
export interface Theme {
    h1: string;
    h2: string;
    h3: string;
    h4: string;
    h5: string;
    h6: string;
    text: string;
    bg: string;
    inlineCodeFg: string;
    inlineCodeBg: string;
    linkColor: string;
    codeBorderColor: string;
    codeBg: string;
    codeText: string;
    codeLabelColor: string;
    blockquoteBar: string;
    blockquoteText: string;
    bulletColor: string;
    taskDone: string;
    taskPending: string;
    tableBorder: string;
    hrColor: string;
    scrollbarFg: string;
    scrollbarBg: string;
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
export declare const theme: Theme;

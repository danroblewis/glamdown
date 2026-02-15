/**
 * Horizontal rule renderer.
 */
export function renderHr(theme, width) {
    return [
        '',
        `{${theme.hrColor}-fg}${'─'.repeat(width)}{/}`,
        '',
    ];
}
//# sourceMappingURL=hr.js.map
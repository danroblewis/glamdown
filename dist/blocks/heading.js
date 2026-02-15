/**
 * Heading block renderer — H1-H6 with decorative styling.
 */
import { renderInline } from '../inline.js';
export function renderHeading(data, theme, width) {
    const lines = [];
    const text = renderInline(data.inline, theme);
    const colors = {
        1: theme.h1,
        2: theme.h2,
        3: theme.h3,
        4: theme.h4,
        5: theme.h5,
        6: theme.h6,
    };
    const color = colors[data.level] ?? theme.text;
    switch (data.level) {
        case 1: {
            const deco = '═'.repeat(width);
            lines.push('');
            lines.push(`{${color}-fg}${deco}{/}`);
            lines.push(`{${color}-fg}{bold}${text}{/bold}{/}`);
            lines.push(`{${color}-fg}${deco}{/}`);
            lines.push('');
            break;
        }
        case 2: {
            const deco = '─'.repeat(width);
            lines.push('');
            lines.push(`{${color}-fg}{bold}${text}{/bold}{/}`);
            lines.push(`{${color}-fg}${deco}{/}`);
            lines.push('');
            break;
        }
        default: {
            const prefix = '#'.repeat(data.level) + ' ';
            lines.push('');
            lines.push(`{${color}-fg}{bold}${prefix}${text}{/bold}{/}`);
            lines.push('');
            break;
        }
    }
    return lines;
}
//# sourceMappingURL=heading.js.map
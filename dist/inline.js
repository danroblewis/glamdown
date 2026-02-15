/**
 * Inline element renderer — converts InlineElement[] to markup-tagged string.
 */
import { escapeTags } from 'blecsd';
export function renderInline(elements, theme) {
    let result = '';
    for (const el of elements) {
        result += renderElement(el, theme);
    }
    return result;
}
function renderElement(el, theme) {
    switch (el.type) {
        case 'text':
            return escapeTags(el.content);
        case 'bold': {
            const inner = el.children
                ? renderInline(el.children, theme)
                : escapeTags(el.content);
            return `{bold}${inner}{/bold}`;
        }
        case 'italic': {
            const inner = el.children
                ? renderInline(el.children, theme)
                : escapeTags(el.content);
            return `{italic}${inner}{/italic}`;
        }
        case 'code':
            return `{${theme.inlineCodeFg}-fg}{${theme.inlineCodeBg}-bg} ${escapeTags(el.content)} {/}`;
        case 'link': {
            const inner = el.children
                ? renderInline(el.children, theme)
                : escapeTags(el.content);
            return `{${theme.linkColor}-fg}{underline}${inner}{/underline}{/} (${escapeTags(el.href ?? '')})`;
        }
        case 'image':
            return `{dim}[img: ${escapeTags(el.content)}]{/dim}`;
        case 'strikethrough': {
            const inner = el.children
                ? renderInline(el.children, theme)
                : escapeTags(el.content);
            return `{dim}{strikethrough}${inner}{/strikethrough}{/dim}`;
        }
        default:
            return escapeTags(el.content);
    }
}
//# sourceMappingURL=inline.js.map
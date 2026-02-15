# glamdown Test File

Welcome to **glamdown**, a *luxurious* terminal markdown renderer.

## Features

Here's what we support:

### Inline Formatting

This is **bold**, *italic*, ~~strikethrough~~, and `inline code`. You can also have [links](https://example.com) and ![images](logo.png).

### Code Blocks

```javascript
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10)); // 55
```

```python
def greet(name: str) -> str:
    """Return a greeting message."""
    return f"Hello, {name}!"

if __name__ == "__main__":
    print(greet("World"))
```

### Lists

**Unordered:**
- First item
  - Nested item
    - Deeply nested
- Second item
- Third item

**Ordered:**
1. Step one
2. Step two
3. Step three

**Task list:**
- [x] Implement parser
- [x] Add syntax highlighting
- [ ] Polish the output
- [ ] Write documentation

### Tables

| Feature | Status | Priority |
|---------|--------|----------|
| Headings | Done | High |
| Code blocks | Done | High |
| Tables | Done | Medium |
| Lists | Done | Medium |

### Blockquotes

> "The best way to predict the future is to invent it."
> — Alan Kay

> This is a blockquote with **bold** and *italic* text.

---

## More Examples

Here's some code with braces `{like this}` that should be escaped.

### JSON Example

```json
{
  "name": "glamdown",
  "version": "0.1.0",
  "features": ["markdown", "syntax-highlight", "scrolling"]
}
```

### Shell Commands

```bash
# Install and run
npm install
npx tsx src/cli.ts README.md

# Or pipe content
echo "# Hello" | npx tsx src/cli.ts
```

---

*Thanks for trying glamdown!*

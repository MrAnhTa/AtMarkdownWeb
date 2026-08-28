# AtMarkdown Web

[Tiếng Việt](README-vi.md)

AtMarkdown Web is a browser-based Markdown reader and editor built with React and Vite. It brings the rich rendering experience of the AtMarkdown Windows application to a modern two-panel interface with a dark blue gradient design.

## Features

- Real-time Markdown preview while typing.
- Open `.md`, `.markdown`, `.mdown`, `.mkd`, and plain-text files, including drag and drop.
- GitHub Flavored Markdown with tables, task lists, strikethrough, and autolinks.
- Language-aware syntax highlighting and a copy button for every code block.
- Inline and block mathematics rendered with KaTeX.
- Mermaid diagrams rendered directly from `mermaid` fenced code blocks.
- GitHub-style `NOTE`, `TIP`, `IMPORTANT`, `WARNING`, and `CAUTION` callouts.
- AtMarkdown-style callout icons and colors, plus safe `<kbd>` rendering.
- Automatically generated document outline with smooth heading navigation.
- Resizable Input and Preview panels with persisted dimensions.
- One-click Input panel collapse for a distraction-free reading layout.
- Browser fullscreen mode for the Preview panel.
- Adjustable content font size from 80% to 140%, persisted locally.
- Toggleable desktop outline and mobile outline drawer.
- Resizable outline panel with its width persisted locally.
- English, Vietnamese, and French user interfaces.
- Locale-specific sample documents for EN, VI, and FR.
- Automatic draft persistence using browser `localStorage`.
- Responsive desktop, tablet, and mobile layouts with dedicated print/PDF styles.
- Fully local Markdown processing; document content is not uploaded to a server.
- Sanitized embedded HTML: safe presentation elements such as `<kbd>` are supported, while scripts and event handlers are removed.

## Requirements

- Node.js 20.19+ or 22.12+; the latest Node.js LTS release is recommended.
- npm 10+.

## Install and run locally

```bash
cd AtMarkdownWeb
npm install
npm run dev
```

Vite prints the local URL in the terminal, usually `http://localhost:5173`.

## Production build

```bash
npm run build
```

The production site is generated in `dist/`. Test the production build locally with:

```bash
npm run preview
```

## Extended Markdown syntax

### Callouts

```markdown
> [!TIP]
> A useful tip for your readers.
```

Supported types: `NOTE`, `TIP`, `IMPORTANT`, `WARNING`, and `CAUTION`.

### KaTeX formulas

```markdown
Inline formula: $E = mc^2$

$$
\int_0^1 x^2 dx = \frac{1}{3}
$$
```

### Mermaid diagrams

````markdown
```mermaid
flowchart LR
  A[Markdown] --> B[Preview]
```
````

## Project structure

```text
AtMarkdownWeb/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── MarkdownPreview.jsx
│   │   └── MermaidDiagram.jsx
│   ├── lib/
│   │   ├── i18n.js
│   │   └── markdown.js
│   ├── App.jsx
│   ├── main.jsx
│   ├── sampleMarkdown.js
│   └── styles.css
├── index.html
├── package.json
└── vite.config.js
```

## Technology

- React and Vite
- `react-markdown`, `remark-gfm`, and `remark-math`
- `rehype-highlight`, `rehype-katex`, `rehype-raw`, and `rehype-sanitize`
- Mermaid and KaTeX

## Deployment

The generated `dist/` directory is a static site that can be deployed to GitHub Pages, Cloudflare Pages, Netlify, Vercel, or any static web server. When deploying under a subpath, configure the appropriate `base` value in `vite.config.js`.

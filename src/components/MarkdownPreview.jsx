import { Children, isValidElement, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import rehypeKatex from 'rehype-katex'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import { remarkAtMarkdown } from '../lib/markdown.js'
import MermaidDiagram from './MermaidDiagram.jsx'

const safeHtmlSchema = {
  ...defaultSchema,
  clobberPrefix: '',
  tagNames: [...(defaultSchema.tagNames || []), 'aside', 'kbd'],
  attributes: {
    ...defaultSchema.attributes,
    aside: [
      ...(defaultSchema.attributes?.aside || []),
      ['className', /^markdown-alert(?:-(note|tip|important|warning|caution))?$/],
    ],
    p: [
      ...(defaultSchema.attributes?.p || []),
      ['className', 'markdown-alert-title'],
      ['dataAlertType', 'NOTE', 'TIP', 'IMPORTANT', 'WARNING', 'CAUTION'],
    ],
  },
}

const alertIconPaths = {
  NOTE: 'M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0Zm0 1.5a6.5 6.5 0 1 1 0 13 6.5 6.5 0 0 1 0-13ZM6.5 7.75A.75.75 0 0 1 7.25 7h1.5a.75.75 0 0 1 .75.75v2.75h.25a.75.75 0 0 1 0 1.5H8a.75.75 0 0 1 0-1.5h.25v-2H8a.75.75 0 0 1-.75-.75ZM8 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z',
  TIP: 'M8 1.5c-2.363 0-4 1.69-4 3.75 0 .984.424 1.625.984 2.304l.214.253c.223.264.47.556.673.868.309.476.463.968.463 1.575v.25h3.333v-.25c0-.607.155-1.1.464-1.575.203-.312.45-.604.672-.868l.215-.253c.56-.679.984-1.32.984-2.304 0-2.06-1.637-3.75-4-3.75ZM5.5 5.25C5.5 3.992 6.558 3 8 3s2.5.992 2.5 2.25c0 .542-.234.966-.672 1.5-.32.39-.602.74-.848 1.1-.426.657-.647 1.344-.647 2.15H7.667c0-.806-.22-1.493-.647-2.15a11.96 11.96 0 0 0-.848-1.1c-.438-.534-.672-.958-.672-1.5Z',
  IMPORTANT: 'M1.75 0h12.5C15.216 0 16 .784 16 1.75v12.5A1.75 1.75 0 0 1 14.25 16H1.75A1.75 1.75 0 0 1 0 14.25V1.75C0 .784.784 0 1.75 0Zm0 1.5a.25.25 0 0 0-.25.25v12.5c0 .138.112.25.25.25h12.5a.25.25 0 0 0 .25-.25V1.75a.25.25 0 0 0-.25-.25H1.75ZM8 4a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 8 4Zm0 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z',
  WARNING: 'M6.457 1.047c.659-1.234 2.427-1.234 3.086 0l6.082 11.378A1.75 1.75 0 0 1 14.082 15H1.918a1.75 1.75 0 0 1-1.543-2.575L6.457 1.047Zm1.763.707a.25.25 0 0 0-.44 0L1.698 13.132a.25.25 0 0 0 .22.368h12.164a.25.25 0 0 0 .22-.368L8.22 1.754ZM8.75 5.75v2.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 1 1.5 0ZM9 11a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z',
  CAUTION: 'M4.47.22A.749.749 0 0 1 5 0h6c.199 0 .389.079.53.22l4.25 4.25c.141.141.22.331.22.53v6a.749.749 0 0 1-.22.53l-4.25 4.25A.749.749 0 0 1 11 16H5a.749.749 0 0 1-.53-.22L.22 11.53A.749.749 0 0 1 0 11V5c0-.199.079-.389.22-.53L4.47.22Zm.84 1.28L1.5 5.31v5.38l3.81 3.81h5.38l3.81-3.81V5.31L10.69 1.5H5.31ZM8 4a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 8 4Zm0 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z',
}

function AlertTitle({ type, labels }) {
  const title = labels[`alert${type[0]}${type.slice(1).toLowerCase()}`] || type
  return <><svg className="alert-icon" viewBox="0 0 16 16" aria-hidden="true"><path d={alertIconPaths[type]} /></svg>{title}</>
}

function nodeText(node) {
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(nodeText).join('')
  if (isValidElement(node)) return nodeText(node.props.children)
  return ''
}

function CodeBlock({ children, labels, theme }) {
  const [copied, setCopied] = useState(false)
  const child = Children.only(children)
  const language = child?.props?.className?.match(/language-([\w-]+)/)?.[1]
  const source = nodeText(child?.props?.children).replace(/\n$/, '')

  if (language === 'mermaid') return <MermaidDiagram chart={source} labels={labels} theme={theme} />

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(source)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="code-shell">
      <div className="code-toolbar">
        <span>{language || 'text'}</span>
        <button type="button" onClick={copyCode} aria-label={labels.copyCode}>
          {copied ? labels.copied : labels.copy}
        </button>
      </div>
      <pre>{children}</pre>
    </div>
  )
}

export default function MarkdownPreview({ content, labels, theme }) {
  return (
    <article className="markdown-body">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath, remarkAtMarkdown]}
        rehypePlugins={[rehypeRaw, [rehypeSanitize, safeHtmlSchema], rehypeKatex, rehypeHighlight]}
        components={{
          pre: (props) => <CodeBlock {...props} labels={labels} theme={theme} />,
          a: ({ href, children, ...props }) => (
            <a
              href={href}
              target={href?.startsWith('#') ? undefined : '_blank'}
              rel={href?.startsWith('#') ? undefined : 'noopener noreferrer'}
              {...props}
            >
              {children}
            </a>
          ),
          img: ({ alt, ...props }) => <img alt={alt || ''} loading="lazy" {...props} />,
          p: ({ children, ...props }) => {
            const type = props['data-alert-type'] || props.dataAlertType
            return <p {...props}>{type ? <AlertTitle type={type} labels={labels} /> : children}</p>
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </article>
  )
}

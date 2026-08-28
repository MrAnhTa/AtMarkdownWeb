const alertTypes = new Set(['NOTE', 'TIP', 'IMPORTANT', 'WARNING', 'CAUTION'])

function plainText(node) {
  if (!node) return ''
  if (typeof node.value === 'string') return node.value
  return Array.isArray(node.children) ? node.children.map(plainText).join('') : ''
}

export function createSlugger() {
  const seen = new Map()

  return (value) => {
    const base = String(value)
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLocaleLowerCase('vi')
      .trim()
      .replace(/[^\p{Letter}\p{Number}\s-]/gu, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-') || 'section'
    const count = seen.get(base) ?? 0
    seen.set(base, count + 1)
    return count ? `${base}-${count}` : base
  }
}

function walk(node, visitor) {
  visitor(node)
  if (Array.isArray(node.children)) node.children.forEach((child) => walk(child, visitor))
}

export function remarkAtMarkdown() {
  return (tree) => {
    const slug = createSlugger()

    walk(tree, (node) => {
      if (node.type === 'heading') {
        node.data = node.data || {}
        node.data.hProperties = node.data.hProperties || {}
        node.data.hProperties.id = slug(plainText(node))
      }

      if (node.type !== 'blockquote' || node.children?.[0]?.type !== 'paragraph') return
      const paragraph = node.children[0]
      const first = paragraph.children?.[0]
      if (first?.type !== 'text') return
      const match = first.value.match(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*/i)
      if (!match) return

      const type = match[1].toUpperCase()
      if (!alertTypes.has(type)) return
      first.value = first.value.slice(match[0].length)
      node.data = {
        hName: 'aside',
        hProperties: {
          className: ['markdown-alert', `markdown-alert-${type.toLowerCase()}`],
        },
      }
      node.children.unshift({
        type: 'paragraph',
        data: {
          hProperties: {
            className: ['markdown-alert-title'],
            dataAlertType: type,
          },
        },
        children: [{ type: 'text', value: type }],
      })
    })
  }
}

function stripInlineMarkdown(value) {
  return value
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[`*_~]/g, '')
    .replace(/<[^>]+>/g, '')
    .trim()
}

export function extractHeadings(markdown) {
  const slug = createSlugger()
  const headings = []
  let fenced = false

  for (const line of markdown.split(/\r?\n/)) {
    if (/^\s*(```|~~~)/.test(line)) {
      fenced = !fenced
      continue
    }
    if (fenced) continue
    const match = line.match(/^(#{1,4})\s+(.+?)\s*#*\s*$/)
    if (!match) continue
    const label = stripInlineMarkdown(match[2])
    headings.push({ level: match[1].length, label, id: slug(label) })
  }

  return headings
}

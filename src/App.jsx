import { useEffect, useMemo, useRef, useState } from 'react'
import MarkdownPreview from './components/MarkdownPreview.jsx'
import { localeCodes, translations } from './lib/i18n.js'
import { extractHeadings } from './lib/markdown.js'
import { getSampleMarkdown } from './sampleMarkdown.js'

const storageKey = 'atmarkdown-web-content-v1'

function Icon({ name }) {
  const paths = {
    file: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/><path d="M8 13h8M8 17h6"/></>,
    upload: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m17 8-5-5-5 5M12 3v12"/></>,
    sparkle: <><path d="m12 3-1.9 5.1L5 10l5.1 1.9L12 17l1.9-5.1L19 10l-5.1-1.9Z"/><path d="M5 3v4M3 5h4M19 17v4M17 19h4"/></>,
    trash: <><path d="M3 6h18M8 6V4h8v2M19 6l-1 15H6L5 6M10 11v5M14 11v5"/></>,
    eye: <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></>,
    menu: <><path d="M4 6h16M4 12h16M4 18h16"/></>,
    close: <><path d="m18 6-12 12M6 6l12 12"/></>,
    collapse: <><path d="M9 18 3 12l6-6M3 12h18"/></>,
    expand: <><path d="M15 18l6-6-6-6M21 12H3"/></>,
    fullscreen: <><path d="M8 3H3v5M16 3h5v5M8 21H3v-5M16 21h5v-5"/></>,
    minimize: <><path d="M8 3v5H3M16 3v5h5M8 21v-5H3M16 21v-5h5"/></>,
    minus: <path d="M5 12h14"/>,
    plus: <><path d="M5 12h14M12 5v14"/></>,
    globe: <><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"/></>,
  }
  return <svg className="ui-icon" viewBox="0 0 24 24" aria-hidden="true">{paths[name]}</svg>
}

function initialContent(locale) {
  try {
    return localStorage.getItem(storageKey) || getSampleMarkdown(locale)
  } catch {
    return getSampleMarkdown(locale)
  }
}

function initialEditorWidth() {
  try {
    return Number(localStorage.getItem('atmarkdown-editor-width')) || 440
  } catch {
    return 440
  }
}

function storedNumber(key, fallback) {
  try {
    const value = Number(localStorage.getItem(key))
    return Number.isFinite(value) && value > 0 ? value : fallback
  } catch {
    return fallback
  }
}

function initialLocale() {
  try {
    const stored = localStorage.getItem('atmarkdown-locale')
    if (stored && translations[stored]) return stored
  } catch { /* use browser language */ }
  const browserLocale = navigator.language?.slice(0, 2)
  return translations[browserLocale] ? browserLocale : 'en'
}

export default function App() {
  const [locale, setLocale] = useState(initialLocale)
  const [content, setContent] = useState(() => initialContent(locale))
  const [saved, setSaved] = useState(true)
  const [outlineOpen, setOutlineOpen] = useState(() => window.matchMedia('(min-width: 821px)').matches)
  const [editorWidth, setEditorWidth] = useState(initialEditorWidth)
  const [editorCollapsed, setEditorCollapsed] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [fontScale, setFontScale] = useState(() => storedNumber('atmarkdown-font-scale', 1))
  const [outlineWidth, setOutlineWidth] = useState(() => storedNumber('atmarkdown-outline-width', 210))
  const fileInput = useRef(null)
  const workspaceRef = useRef(null)
  const previewRef = useRef(null)
  const readerLayoutRef = useRef(null)
  const headings = useMemo(() => extractHeadings(content), [content])
  const labels = translations[locale]
  const words = useMemo(() => content.trim() ? content.trim().split(/\s+/).length : 0, [content])

  useEffect(() => {
    setSaved(false)
    const timeout = window.setTimeout(() => {
      try {
        localStorage.setItem(storageKey, content)
        setSaved(true)
      } catch {
        setSaved(false)
      }
    }, 350)
    return () => window.clearTimeout(timeout)
  }, [content])

  useEffect(() => {
    const onFullscreenChange = () => setIsFullscreen(document.fullscreenElement === previewRef.current)
    document.addEventListener('fullscreenchange', onFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange)
  }, [])

  useEffect(() => {
    document.documentElement.lang = locale
    try { localStorage.setItem('atmarkdown-locale', locale) } catch { /* optional preference */ }
  }, [locale])

  function changeFont(delta) {
    setFontScale((current) => {
      const next = Math.round(Math.min(1.4, Math.max(0.8, current + delta)) * 10) / 10
      try { localStorage.setItem('atmarkdown-font-scale', String(next)) } catch { /* optional preference */ }
      return next
    })
  }

  function resizeEditor(clientX) {
    const bounds = workspaceRef.current?.getBoundingClientRect()
    if (!bounds) return
    const nextWidth = Math.min(Math.max(clientX - bounds.left, 280), Math.max(280, bounds.width - 480))
    setEditorWidth(nextWidth)
    try { localStorage.setItem('atmarkdown-editor-width', String(Math.round(nextWidth))) } catch { /* optional preference */ }
  }

  function startResize(event) {
    if (event.pointerType === 'mouse' && event.button !== 0) return
    event.currentTarget.setPointerCapture(event.pointerId)
    document.body.classList.add('is-resizing')
    resizeEditor(event.clientX)
  }

  function stopResize(event) {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
    document.body.classList.remove('is-resizing')
  }

  function resizeWithKeyboard(event) {
    if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return
    event.preventDefault()
    const direction = event.key === 'ArrowLeft' ? -1 : 1
    setEditorWidth((width) => {
      const nextWidth = Math.max(280, Math.min(width + direction * 24, (workspaceRef.current?.clientWidth || 1000) - 480))
      try { localStorage.setItem('atmarkdown-editor-width', String(Math.round(nextWidth))) } catch { /* optional preference */ }
      return nextWidth
    })
  }

  function resizeOutline(clientX) {
    const bounds = readerLayoutRef.current?.getBoundingClientRect()
    if (!bounds) return
    const maxWidth = Math.max(170, Math.min(420, bounds.width - 360))
    const nextWidth = Math.min(Math.max(clientX - bounds.left, 170), maxWidth)
    setOutlineWidth(nextWidth)
    try { localStorage.setItem('atmarkdown-outline-width', String(Math.round(nextWidth))) } catch { /* optional preference */ }
  }

  function startOutlineResize(event) {
    if (event.pointerType === 'mouse' && event.button !== 0) return
    event.currentTarget.setPointerCapture(event.pointerId)
    document.body.classList.add('is-resizing-outline')
    resizeOutline(event.clientX)
  }

  function stopOutlineResize(event) {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
    document.body.classList.remove('is-resizing-outline')
  }

  function resizeOutlineWithKeyboard(event) {
    if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return
    event.preventDefault()
    const direction = event.key === 'ArrowLeft' ? -1 : 1
    const availableWidth = readerLayoutRef.current?.clientWidth || 900
    setOutlineWidth((width) => {
      const nextWidth = Math.max(170, Math.min(width + direction * 20, Math.min(420, availableWidth - 360)))
      try { localStorage.setItem('atmarkdown-outline-width', String(Math.round(nextWidth))) } catch { /* optional preference */ }
      return nextWidth
    })
  }

  async function toggleFullscreen() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen()
      else await previewRef.current?.requestFullscreen()
    } catch {
      // Fullscreen can be unavailable when the page is embedded by another application.
    }
  }

  function readFile(file) {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setContent(String(reader.result || ''))
    reader.readAsText(file)
  }

  function jumpTo(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    if (window.matchMedia('(max-width: 820px)').matches) setOutlineOpen(false)
  }

  return (
    <div className="app-shell">
      <main
        ref={workspaceRef}
        className={`workspace ${editorCollapsed ? 'editor-is-collapsed' : ''}`}
        style={{ '--editor-width': `${editorWidth}px` }}
      >
        <section className="editor-panel" aria-label={labels.editor} aria-hidden={editorCollapsed}>
          <div className="panel-heading">
            <div><span className="eyebrow">{labels.input}</span><h1>{labels.editor}</h1></div>
            <div className="panel-heading-actions">
              <span className={`save-state ${saved ? 'is-saved' : ''}`}><i />{saved ? labels.saved : labels.saving}</span>
              <button type="button" onClick={() => setEditorCollapsed(true)} title={labels.collapseInput} aria-label={labels.collapseInput}><Icon name="collapse" /></button>
            </div>
          </div>
          <div className="editor-toolbar">
            <button type="button" onClick={() => fileInput.current?.click()}><Icon name="upload" />{labels.openFile}</button>
            <button type="button" onClick={() => setContent(getSampleMarkdown(locale))}><Icon name="sparkle" />{labels.sample}</button>
            <button className="danger-button" type="button" onClick={() => setContent('')} aria-label={labels.clear} title={labels.clear}><Icon name="trash" /></button>
            <input ref={fileInput} type="file" accept=".md,.markdown,.mdown,.mkd,text/markdown,text/plain" hidden onChange={(event) => readFile(event.target.files?.[0])} />
          </div>
          <div
            className="editor-wrap"
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault()
              readFile(event.dataTransfer.files?.[0])
            }}
          >
            <textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder={labels.placeholder}
              spellCheck="false"
              aria-label={labels.markdownContent}
            />
          </div>
          <footer className="editor-footer">
            <span>{content.length.toLocaleString(localeCodes[locale])} {labels.characters}</span>
            <span>{words.toLocaleString(localeCodes[locale])} {labels.words}</span>
            <span>Markdown</span>
          </footer>
        </section>

        <div
          className="panel-resizer"
          role="separator"
          aria-label={labels.resizeInput}
          aria-orientation="vertical"
          aria-valuemin="280"
          aria-valuenow={Math.round(editorWidth)}
          tabIndex={editorCollapsed ? -1 : 0}
          onPointerDown={startResize}
          onPointerMove={(event) => event.currentTarget.hasPointerCapture(event.pointerId) && resizeEditor(event.clientX)}
          onPointerUp={stopResize}
          onPointerCancel={stopResize}
          onKeyDown={resizeWithKeyboard}
        ><span /></div>

        <section
          ref={previewRef}
          className={`preview-panel ${!outlineOpen ? 'outline-is-hidden' : ''}`}
          style={{ '--reader-scale': fontScale, '--outline-width': `${outlineWidth}px` }}
          aria-label={labels.preview}
        >
          <div className="preview-topbar">
            <div className="preview-label">
              <Icon name="eye" /><span>{labels.preview}</span>
              <div className="font-controls" aria-label={labels.increaseFont}>
                <button type="button" onClick={() => changeFont(-0.1)} disabled={fontScale <= 0.8} title={labels.decreaseFont} aria-label={labels.decreaseFont}><Icon name="minus" /></button>
                <output>{Math.round(fontScale * 100)}%</output>
                <button type="button" onClick={() => changeFont(0.1)} disabled={fontScale >= 1.4} title={labels.increaseFont} aria-label={labels.increaseFont}><Icon name="plus" /></button>
              </div>
            </div>
            <div className="preview-actions">
              <label className="language-select" title={labels.language}><Icon name="globe" /><select value={locale} onChange={(event) => setLocale(event.target.value)} aria-label={labels.language}><option value="vi">VI</option><option value="en">EN</option><option value="fr">FR</option></select></label>
              {editorCollapsed && <button type="button" onClick={() => setEditorCollapsed(false)} title={labels.showInput}><Icon name="expand" /><span>{labels.showInput}</span></button>}
              <button type="button" onClick={toggleFullscreen} title={isFullscreen ? labels.closeFullscreen : labels.openFullscreen}><Icon name={isFullscreen ? 'minimize' : 'fullscreen'} /><span>{isFullscreen ? labels.exitFullscreen : labels.fullscreen}</span></button>
              <button className={`outline-toggle ${outlineOpen ? 'is-active' : ''}`} type="button" aria-pressed={outlineOpen} onClick={() => setOutlineOpen((value) => !value)}><Icon name={outlineOpen ? 'close' : 'menu'} />{labels.outline}</button>
            </div>
          </div>
          <div ref={readerLayoutRef} className="reader-layout">
            <aside className={`outline ${outlineOpen ? 'is-open' : ''}`}>
              <div className="outline-title"><span>{labels.content}</span><b>{headings.length}</b></div>
              {headings.length ? (
                <nav aria-label={labels.outlineLabel}>
                  {headings.map((heading) => (
                    <button
                      type="button"
                      key={heading.id}
                      style={{ '--depth': Math.max(0, heading.level - 1) }}
                      onClick={() => jumpTo(heading.id)}
                      title={heading.label}
                    >
                      {heading.label}
                    </button>
                  ))}
                </nav>
              ) : <p className="outline-empty">{labels.outlineEmpty}</p>}
            </aside>
            <div
              className="outline-resizer"
              role="separator"
              aria-label={labels.resizeOutline}
              aria-orientation="vertical"
              aria-valuemin="170"
              aria-valuemax="420"
              aria-valuenow={Math.round(outlineWidth)}
              tabIndex={outlineOpen ? 0 : -1}
              onPointerDown={startOutlineResize}
              onPointerMove={(event) => event.currentTarget.hasPointerCapture(event.pointerId) && resizeOutline(event.clientX)}
              onPointerUp={stopOutlineResize}
              onPointerCancel={stopOutlineResize}
              onKeyDown={resizeOutlineWithKeyboard}
            ><span /></div>
            <div className="preview-scroll">
              {content.trim() ? <MarkdownPreview content={content} labels={labels} /> : (
                <div className="empty-state"><Icon name="file" /><h2>{labels.emptyTitle}</h2><p>{labels.emptyBody}</p></div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

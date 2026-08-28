import { useEffect, useId, useState } from 'react'

let renderSequence = 0
let renderQueue = Promise.resolve()

export default function MermaidDiagram({ chart, labels }) {
  const reactId = useId()
  const [result, setResult] = useState({ svg: '', error: '' })

  useEffect(() => {
    let active = true
    const id = `mermaid-${reactId.replace(/[^a-zA-Z0-9_-]/g, '')}-${++renderSequence}`

    async function renderChart() {
      try {
        renderQueue = renderQueue.catch(() => undefined).then(async () => {
          const { default: mermaid } = await import('mermaid')
          mermaid.initialize({
            startOnLoad: false,
            securityLevel: 'strict',
            theme: 'dark',
            fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
            flowchart: { htmlLabels: true, curve: 'basis', useMaxWidth: true },
            sequence: { useMaxWidth: true, wrap: true },
            themeVariables: {
              background: '#08162d',
              primaryColor: '#12365f',
              primaryTextColor: '#f0f7ff',
              primaryBorderColor: '#38bdf8',
              lineColor: '#72c9ee',
              secondaryColor: '#172554',
              tertiaryColor: '#0f2949',
              clusterBkg: '#0d2442',
              clusterBorder: '#31577b',
              edgeLabelBackground: '#08162d',
              fontSize: '15px',
            },
          })
          return mermaid.render(id, chart.trim())
        })
        const { svg } = await renderQueue
        if (active) setResult({ svg, error: '' })
      } catch (error) {
        if (active) {
          setResult({
            svg: '',
            error: error instanceof Error ? error.message : labels.mermaidError,
          })
        }
      }
    }

    setResult({ svg: '', error: '' })
    const timeout = window.setTimeout(renderChart, 140)
    return () => {
      active = false
      window.clearTimeout(timeout)
    }
  }, [chart, reactId, labels.mermaidError])

  if (result.error) {
    return (
      <div className="mermaid-error" role="alert">
        <strong>{labels.mermaidInvalid}</strong>
        <span>{result.error}</span>
      </div>
    )
  }

  if (!result.svg) return <div className="mermaid-loading">{labels.mermaidLoading}</div>

  return (
    <div
      className="mermaid-diagram"
      role="img"
      aria-label={labels.mermaidLabel}
      dangerouslySetInnerHTML={{ __html: result.svg }}
    />
  )
}

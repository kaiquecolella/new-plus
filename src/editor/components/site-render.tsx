import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import { BASE_CSS, renderTemplate, themeCss } from "../template"
import type { Field, Props, Theme } from "../types"

interface SiteRenderProps {
  html: string
  css: string
  fields: Field[]
  props: Props
  theme: Theme
  className?: string
}

/**
 * Renderiza uma seção do site dentro de um Shadow DOM: o CSS do componente fica isolado
 * do editor (e vice-versa), e as media queries viram container queries do host.
 */
export function SiteRender({ html, css, fields, props, theme, className }: SiteRenderProps) {
  const hostRef = useRef<HTMLDivElement>(null)
  const { markup, error } = useMemo(() => renderTemplate(html, fields, props), [html, fields, props])
  const themeStyles = useMemo(() => themeCss(theme), [theme])

  useLayoutEffect(() => {
    const host = hostRef.current!
    let root = host.shadowRoot
    if (!root) {
      root = host.attachShadow({ mode: "open" })
      // É uma apresentação: links e formulários do site não navegam.
      root.addEventListener("click", (e) => {
        if ((e.target as Element).closest?.("a")) e.preventDefault()
      })
      root.addEventListener("submit", (e) => e.preventDefault())
    }
    root.innerHTML = `<style>${themeStyles}\n${BASE_CSS}\n${css}</style>${error ? errorBox(error) : markup}`
  }, [markup, css, themeStyles, error])

  return <div ref={hostRef} className={className} style={{ containerType: "inline-size" }} />
}

function errorBox(message: string) {
  const safe = message.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c]!)
  return `<div style="padding:32px;font:14px/1.5 monospace;color:#b91c1c;background:#fef2f2">Erro no template: ${safe}</div>`
}

/** Miniatura: renderiza a seção em largura de desktop e escala para caber no card. */
export function SiteThumb(props: Omit<SiteRenderProps, "className"> & { height?: number }) {
  const boxRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0.2)
  const BASE = 1280

  useEffect(() => {
    const el = boxRef.current!
    const ro = new ResizeObserver(([entry]) => setScale(entry.contentRect.width / BASE))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <div ref={boxRef} className="pointer-events-none relative w-full overflow-hidden bg-white" style={{ height: props.height ?? 96 }}>
      <div style={{ width: BASE, transform: `scale(${scale})`, transformOrigin: "top left" }}>
        <SiteRender {...props} />
      </div>
    </div>
  )
}

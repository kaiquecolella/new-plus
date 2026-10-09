import Mustache from "mustache"
import { iconSvg } from "./site-icons"
import type { Field, Props, Theme } from "./types"

// Sem escape de "/" — deixa URLs legíveis no HTML gerado.
Mustache.escape = (text: string) =>
  String(text).replace(/[&<>"']/g, (c) => `&${{ "&": "amp", "<": "lt", ">": "gt", '"': "quot", "'": "#39" }[c]};`)

export const FONTS: Record<string, { label: string; body: string; heading: string }> = {
  moderna: { label: "Moderna — Inter", body: "'Inter', sans-serif", heading: "'Inter', sans-serif" },
  elegante: { label: "Elegante — Playfair + Inter", body: "'Inter', sans-serif", heading: "'Playfair Display', serif" },
  amigavel: { label: "Amigável — Poppins", body: "'DM Sans', sans-serif", heading: "'Poppins', sans-serif" },
  geometrica: { label: "Geométrica — Jakarta", body: "'Plus Jakarta Sans', sans-serif", heading: "'Plus Jakarta Sans', sans-serif" },
}

export const RADII: Record<string, { label: string; value: string }> = {
  reto: { label: "Reto", value: "4px" },
  suave: { label: "Suave", value: "14px" },
  redondo: { label: "Redondo", value: "24px" },
}

export const PRIMARY_COLORS = ["#0d9488", "#2563eb", "#7c3aed", "#db2777", "#ea580c", "#16a34a", "#0f172a"]

export function themeCss(theme: Theme): string {
  const font = FONTS[theme.font] ?? FONTS.moderna
  const radius = RADII[theme.radius]?.value ?? "14px"
  return `:host {
  --primary: ${theme.primary};
  --primary-contrast: #ffffff;
  --primary-soft: color-mix(in srgb, var(--primary) 10%, white);
  --text: #0f172a;
  --muted: #64748b;
  --bg: #ffffff;
  --surface: #f8fafc;
  --border: #e2e8f0;
  --radius: ${radius};
  --font: ${font.body};
  --heading-font: ${font.heading};
}`
}

/** CSS global do site — disponível em todas as seções. */
export const BASE_CSS = `*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
:host { display: block; font-family: var(--font); color: var(--text); background: var(--bg); line-height: 1.6; -webkit-font-smoothing: antialiased; }
a { color: inherit; text-decoration: none; }
img { display: block; max-width: 100%; }
ul { list-style: none; }
button, input, textarea, select { font: inherit; color: inherit; }
h1, h2, h3, h4 { font-family: var(--heading-font); line-height: 1.15; letter-spacing: -0.02em; font-weight: 700; }
svg { width: 1em; height: 1em; flex-shrink: 0; }

.container { width: 100%; max-width: 1160px; margin: 0 auto; padding: 0 32px; }
.eyebrow { display: inline-block; font-size: 13px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; color: var(--primary); margin-bottom: 12px; }
.section-title { font-size: clamp(28px, 3.4cqi, 42px); }
.section-head { max-width: 680px; margin: 0 auto 52px; text-align: center; }
.section-head p { margin-top: 14px; font-size: 17px; color: var(--muted); }

.btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; height: 48px; padding: 0 24px; border: 1px solid transparent; border-radius: calc(var(--radius) * .7); font-size: 15px; font-weight: 600; cursor: pointer; transition: all .2s; white-space: nowrap; }
.btn-primary { background: var(--primary); color: var(--primary-contrast); box-shadow: 0 8px 24px -10px var(--primary); }
.btn-primary:hover { filter: brightness(.93); transform: translateY(-1px); }
.btn-outline { background: #fff; border-color: var(--border); color: var(--text); }
.btn-outline:hover { border-color: var(--primary); color: var(--primary); }
.btn-light { background: #fff; color: var(--primary); }

@container (max-width: 640px) {
  .container { padding: 0 20px; }
  .section-head { margin-bottom: 36px; }
}`

function initials(name: string): string {
  const words = name.replace(/^(dr|dra)\.?\s+/i, "").split(/\s+/).filter(Boolean)
  return ((words[0]?.[0] ?? "") + (words.length > 1 ? words[words.length - 1][0] : "")).toUpperCase()
}

/** Adiciona à view dados derivados: SVG dos ícones, índice nos itens das listas. */
function buildView(fields: Field[], props: Props): Props {
  const view: Props = { ...props }
  for (const f of fields) {
    if (f.type === "icon") view[`${f.name}Svg`] = iconSvg(props[f.name])
    if (f.type === "textarea" && f.lines)
      view[`${f.name}Lines`] = String(props[f.name] ?? "")
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => ({ line }))
    if (f.name === "name" && typeof props.name === "string") view.initials = initials(props.name)
    if (f.type === "list") {
      const items = Array.isArray(props[f.name]) ? (props[f.name] as Props[]) : []
      view[f.name] = items.map((item, i) => ({ ...buildView(f.fields, item), index: i + 1 }))
    }
  }
  return view
}

export function renderTemplate(html: string, fields: Field[], props: Props): { markup: string; error?: string } {
  try {
    return { markup: Mustache.render(html, buildView(fields, props)) }
  } catch (e) {
    return { markup: "", error: e instanceof Error ? e.message : String(e) }
  }
}

export interface TemplateVar {
  snippet: string
  label: string
  children?: TemplateVar[]
}

/** Lista as variáveis que o dev pode usar no HTML, a partir dos campos do componente. */
export function templateVars(fields: Field[]): TemplateVar[] {
  return fields.map((f) => {
    switch (f.type) {
      case "list":
        return {
          snippet: `{{#${f.name}}}\n  \n{{/${f.name}}}`,
          label: `${f.label} (lista)`,
          children: [
            ...templateVars(f.fields),
            ...(f.fields.some((c) => c.name === "name") ? [{ snippet: "{{initials}}", label: "Iniciais do nome" }] : []),
            { snippet: "{{index}}", label: "Posição do item" },
          ],
        }
      case "toggle":
        return { snippet: `{{#${f.name}}}\n  \n{{/${f.name}}}`, label: `${f.label} (condicional)` }
      case "icon":
        return { snippet: `{{{${f.name}Svg}}}`, label: `${f.label} (SVG)` }
      case "textarea":
        return f.lines
          ? { snippet: `{{#${f.name}Lines}}{{line}}{{/${f.name}Lines}}`, label: `${f.label} (cada linha)` }
          : { snippet: `{{${f.name}}}`, label: f.label }
      case "select":
        return { snippet: `{{${f.name}}}`, label: `${f.label}: ${f.options.map((o) => o.value).join(" | ")}` }
      default:
        return { snippet: `{{${f.name}}}`, label: f.label }
    }
  })
}

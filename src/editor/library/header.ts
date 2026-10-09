import { PanelTop } from "lucide-react"
import type { BlockType, Variant } from "../types"
import { MARINA, OFFICIAL, code } from "./shared"

export const header: BlockType = {
  type: "header",
  name: "Cabeçalho",
  category: "Topo",
  description: "Logo, menu de navegação e botão de ação",
  icon: PanelTop,
  fields: [
    { type: "text", name: "logoText", label: "Nome / logo" },
    {
      type: "list",
      name: "links",
      label: "Links do menu",
      itemLabel: "Link",
      fields: [{ type: "text", name: "label", label: "Texto" }],
      newItem: { label: "Novo link" },
      max: 7,
    },
    { type: "text", name: "phone", label: "Telefone" },
    { type: "text", name: "ctaLabel", label: "Texto do botão" },
    { type: "toggle", name: "showCta", label: "Mostrar botão" },
    {
      type: "select",
      name: "style",
      label: "Estilo",
      options: [
        { value: "light", label: "Claro" },
        { value: "dark", label: "Escuro" },
        { value: "primary", label: "Cor principal" },
      ],
    },
  ],
  defaultProps: {
    logoText: "Clínica Lumen",
    links: [
      { label: "Início" },
      { label: "Especialidades" },
      { label: "Quem somos" },
      { label: "Blog" },
      { label: "Contato" },
    ],
    phone: "(11) 4002-8922",
    ctaLabel: "Agendar consulta",
    showCta: true,
    style: "light",
  },
}

export const headerVariants: Variant[] = [
  {
    id: "header-padrao",
    blockType: "header",
    name: "Padrão",
    description: "Logo à esquerda, menu e botão à direita",
    author: OFFICIAL,
    official: true,
    uses: 184,
    createdAt: "há 8 meses",
    html: code(`
      <header class="hd hd--{{style}}">
        <div class="container hd__inner">
          <a href="#" class="hd__logo">
            <span class="hd__mark"></span>
            <span>{{logoText}}</span>
          </a>
          <nav class="hd__nav">
            {{#links}}<a href="#">{{label}}</a>{{/links}}
          </nav>
          <div class="hd__actions">
            <span class="hd__phone">{{phone}}</span>
            {{#showCta}}<a href="#" class="btn btn-primary hd__cta">{{ctaLabel}}</a>{{/showCta}}
            <button class="hd__burger" aria-label="Menu"><span></span></button>
          </div>
        </div>
      </header>
    `),
    css: code(`
      .hd { background: #fff; border-bottom: 1px solid var(--border); }
      .hd--dark { background: #0b1220; color: #fff; border-color: rgba(255,255,255,.08); }
      .hd--primary { background: var(--primary); color: #fff; border-color: transparent; }
      .hd__inner { display: flex; align-items: center; gap: 32px; height: 76px; }
      .hd__logo { display: flex; align-items: center; gap: 10px; font-family: var(--heading-font); font-size: 19px; font-weight: 700; letter-spacing: -0.02em; }
      .hd__mark { position: relative; width: 34px; height: 34px; border-radius: calc(var(--radius) * .6); background: linear-gradient(135deg, var(--primary), color-mix(in srgb, var(--primary) 55%, #fff)); }
      .hd__mark::before, .hd__mark::after { content: ""; position: absolute; inset: 0; margin: auto; background: #fff; border-radius: 2px; }
      .hd__mark::before { width: 14px; height: 4px; }
      .hd__mark::after { width: 4px; height: 14px; }
      .hd--primary .hd__mark { background: rgba(255,255,255,.2); }
      .hd__nav { display: flex; gap: 28px; margin-left: auto; font-size: 15px; font-weight: 500; }
      .hd__nav a { opacity: .72; transition: opacity .2s; }
      .hd__nav a:hover, .hd__nav a:first-child { opacity: 1; }
      .hd--light .hd__nav a:first-child { color: var(--primary); }
      .hd__actions { display: flex; align-items: center; gap: 16px; }
      .hd__phone { font-size: 14px; font-weight: 600; opacity: .8; }
      .hd__cta { height: 42px; padding: 0 18px; font-size: 14px; }
      .hd--primary .hd__cta { background: #fff; color: var(--primary); box-shadow: none; }
      .hd__burger { display: none; position: relative; width: 40px; height: 40px; border: 1px solid currentColor; border-radius: 10px; background: transparent; opacity: .7; }
      .hd__burger span, .hd__burger span::before, .hd__burger span::after { content: ""; position: absolute; width: 16px; height: 2px; border-radius: 2px; background: currentColor; }
      .hd__burger span { left: 11px; top: 18px; }
      .hd__burger span::before { left: 0; top: -5px; }
      .hd__burger span::after { left: 0; top: 5px; }

      @container (max-width: 1024px) { .hd__phone { display: none; } }
      @container (max-width: 860px) {
        .hd__nav, .hd__cta { display: none; }
        .hd__actions { margin-left: auto; }
        .hd__burger { display: block; }
      }
    `),
  },
  {
    id: "header-centralizado",
    blockType: "header",
    name: "Centralizado",
    description: "Barra de contato no topo e logo centralizado",
    author: MARINA,
    official: false,
    uses: 37,
    createdAt: "há 2 semanas",
    html: code(`
      <header class="hc hc--{{style}}">
        <div class="hc__top">
          <div class="container hc__top-inner">
            <span>Atendimento: {{phone}}</span>
            {{#showCta}}<a href="#" class="hc__link">{{ctaLabel}} →</a>{{/showCta}}
          </div>
        </div>
        <div class="container hc__main">
          <a href="#" class="hc__logo">{{logoText}}</a>
          <nav class="hc__nav">
            {{#links}}<a href="#">{{label}}</a>{{/links}}
          </nav>
        </div>
      </header>
    `),
    css: code(`
      .hc { background: #fff; border-bottom: 1px solid var(--border); }
      .hc--dark { background: #0b1220; color: #fff; border-color: transparent; }
      .hc--primary { background: var(--primary); color: #fff; border-color: transparent; }
      .hc__top { background: var(--primary); color: #fff; font-size: 13px; }
      .hc--primary .hc__top { background: rgba(0,0,0,.15); }
      .hc__top-inner { display: flex; align-items: center; justify-content: space-between; height: 36px; }
      .hc__link { font-weight: 600; }
      .hc__main { display: flex; flex-direction: column; align-items: center; gap: 14px; padding-top: 22px; padding-bottom: 18px; }
      .hc__logo { font-family: var(--heading-font); font-size: 28px; font-weight: 700; letter-spacing: -0.03em; }
      .hc__nav { display: flex; gap: 32px; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: .1em; }
      .hc__nav a { opacity: .65; transition: opacity .2s; }
      .hc__nav a:hover { opacity: 1; }

      @container (max-width: 700px) {
        .hc__nav { flex-wrap: wrap; justify-content: center; gap: 10px 18px; font-size: 11px; }
      }
    `),
  },
]

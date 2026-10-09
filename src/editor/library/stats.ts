import { ChartNoAxesColumn } from "lucide-react"
import type { BlockType, Variant } from "../types"
import { OFFICIAL, code } from "./shared"

export const stats: BlockType = {
  type: "stats",
  name: "Números",
  category: "Institucional",
  description: "Faixa com indicadores de destaque",
  icon: ChartNoAxesColumn,
  fields: [
    {
      type: "list",
      name: "items",
      label: "Indicadores",
      itemLabel: "Indicador",
      fields: [
        { type: "text", name: "value", label: "Valor" },
        { type: "text", name: "label", label: "Legenda" },
      ],
      newItem: { value: "100%", label: "Nova métrica" },
      max: 6,
    },
    {
      type: "select",
      name: "style",
      label: "Fundo",
      options: [
        { value: "primary", label: "Cor principal" },
        { value: "dark", label: "Escuro" },
        { value: "light", label: "Suave" },
      ],
    },
  ],
  defaultProps: {
    items: [
      { value: "+12 mil", label: "pacientes por ano" },
      { value: "30+", label: "especialistas" },
      { value: "98%", label: "recomendariam a clínica" },
      { value: "24h", label: "para resultados de exames" },
    ],
    style: "primary",
  },
}

export const statsVariants: Variant[] = [
  {
    id: "stats-faixa",
    blockType: "stats",
    name: "Faixa de números",
    description: "Indicadores grandes lado a lado",
    author: OFFICIAL,
    official: true,
    uses: 88,
    createdAt: "há 5 meses",
    html: code(`
      <section class="st st--{{style}}">
        <div class="container st__grid">
          {{#items}}
          <div class="st__item">
            <strong>{{value}}</strong>
            <span>{{label}}</span>
          </div>
          {{/items}}
        </div>
      </section>
    `),
    css: code(`
      .st { padding: 64px 0; }
      .st--primary { background: var(--primary); color: #fff; }
      .st--dark { background: #0b1220; color: #fff; }
      .st--light { background: var(--primary-soft); color: var(--text); }
      .st__grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 32px; }
      .st__item { text-align: center; }
      .st__item strong { display: block; font-family: var(--heading-font); font-size: clamp(36px, 4cqi, 52px); font-weight: 700; line-height: 1.1; letter-spacing: -0.03em; }
      .st--light .st__item strong { color: var(--primary); }
      .st__item span { font-size: 15px; opacity: .8; }
    `),
  },
]

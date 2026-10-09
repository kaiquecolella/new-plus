import { BadgeCheck } from "lucide-react"
import type { BlockType, Variant } from "../types"
import { LUCAS, OFFICIAL, code } from "./shared"

export const logos: BlockType = {
  type: "logos",
  name: "Convênios",
  category: "Institucional",
  description: "Faixa com convênios ou parceiros",
  icon: BadgeCheck,
  fields: [
    { type: "text", name: "title", label: "Título" },
    {
      type: "list",
      name: "items",
      label: "Convênios",
      itemLabel: "Convênio",
      fields: [{ type: "text", name: "name", label: "Nome" }],
      newItem: { name: "Novo convênio" },
    },
    {
      type: "select",
      name: "style",
      label: "Estilo dos itens",
      options: [
        { value: "plain", label: "Texto simples" },
        { value: "cards", label: "Cartões" },
      ],
    },
  ],
  defaultProps: {
    title: "Aceitamos os principais convênios",
    items: [
      { name: "Saúde Mais" },
      { name: "VidaPlena" },
      { name: "Clin+ Care" },
      { name: "Bem Viver" },
      { name: "Previna" },
      { name: "Integra Saúde" },
    ],
    style: "plain",
  },
}

export const logosVariants: Variant[] = [
  {
    id: "logos-faixa",
    blockType: "logos",
    name: "Faixa simples",
    description: "Lista centralizada de convênios",
    author: OFFICIAL,
    official: true,
    uses: 143,
    createdAt: "há 7 meses",
    html: code(`
      <section class="lg">
        <div class="container">
          <p class="lg__title">{{title}}</p>
          <ul class="lg__list lg__list--{{style}}">
            {{#items}}<li><span class="lg__dot"></span>{{name}}</li>{{/items}}
          </ul>
        </div>
      </section>
    `),
    css: code(`
      .lg { padding: 44px 0; background: #fff; border-bottom: 1px solid var(--border); }
      .lg__title { margin-bottom: 24px; text-align: center; font-size: 13px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; color: var(--muted); }
      .lg__list { display: flex; flex-wrap: wrap; justify-content: center; gap: 12px 44px; }
      .lg__list li { display: flex; align-items: center; gap: 10px; font-family: var(--heading-font); font-size: 20px; font-weight: 700; letter-spacing: -0.02em; color: #94a3b8; }
      .lg__dot { width: 22px; height: 22px; border-radius: 7px; background: currentColor; opacity: .5; }
      .lg__list--cards { gap: 14px; }
      .lg__list--cards li { padding: 14px 22px; border: 1px solid var(--border); border-radius: var(--radius); background: var(--surface); font-size: 16px; }
    `),
  },
  {
    id: "logos-carrossel",
    blockType: "logos",
    name: "Carrossel animado",
    description: "Convênios deslizando em loop infinito",
    author: LUCAS,
    official: false,
    uses: 22,
    createdAt: "há 5 dias",
    html: code(`
      <section class="mq">
        <p class="mq__title">{{title}}</p>
        <div class="mq__track">
          <ul>
            {{#items}}<li>{{name}}</li>{{/items}}
            {{#items}}<li>{{name}}</li>{{/items}}
          </ul>
        </div>
      </section>
    `),
    css: code(`
      .mq { overflow: hidden; padding: 40px 0; background: var(--surface); border-block: 1px solid var(--border); }
      .mq__title { margin-bottom: 22px; text-align: center; font-size: 13px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; color: var(--muted); }
      .mq__track { mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent); }
      .mq ul { display: flex; gap: 64px; width: max-content; animation: mq 28s linear infinite; }
      .mq li { font-family: var(--heading-font); font-size: 22px; font-weight: 700; white-space: nowrap; color: #94a3b8; }
      .mq li::before { content: "✚"; margin-right: 10px; color: var(--primary); opacity: .6; }

      @keyframes mq { to { transform: translateX(calc(-50% - 32px)); } }
    `),
  },
]

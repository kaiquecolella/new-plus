import { MessageSquareQuote } from "lucide-react"
import type { BlockType, Variant } from "../types"
import { MARINA, OFFICIAL, code } from "./shared"

export const testimonials: BlockType = {
  type: "testimonials",
  name: "Depoimentos",
  category: "Institucional",
  description: "Avaliações de pacientes ou clientes",
  icon: MessageSquareQuote,
  fields: [
    { type: "text", name: "eyebrow", label: "Chamada" },
    { type: "textarea", name: "title", label: "Título" },
    {
      type: "list",
      name: "items",
      label: "Depoimentos",
      itemLabel: "Depoimento",
      fields: [
        { type: "textarea", name: "quote", label: "Depoimento" },
        { type: "text", name: "name", label: "Nome" },
        { type: "text", name: "info", label: "Informação" },
      ],
      newItem: { quote: "Escreva aqui o depoimento.", name: "Nome do paciente", info: "Paciente" },
    },
  ],
  defaultProps: {
    eyebrow: "Depoimentos",
    title: "O que nossos pacientes dizem",
    items: [
      {
        quote: "Fui atendida no horário, sem pressa e com muita atenção. A médica explicou cada detalhe do tratamento.",
        name: "Juliana Martins",
        info: "Paciente de cardiologia",
      },
      {
        quote: "Levo meus dois filhos na pediatria há anos. A equipe é carinhosa e o agendamento pelo WhatsApp facilita muito.",
        name: "Carlos Eduardo",
        info: "Pai de pacientes",
      },
      {
        quote: "Fiz todos os exames no mesmo dia e recebi os resultados online. Estrutura impecável.",
        name: "Patrícia Gomes",
        info: "Check-up executivo",
      },
    ],
  },
}

export const testimonialsVariants: Variant[] = [
  {
    id: "testimonials-cards",
    blockType: "testimonials",
    name: "Cards",
    description: "Três colunas com avaliação e autor",
    author: OFFICIAL,
    official: true,
    uses: 132,
    createdAt: "há 8 meses",
    html: code(`
      <section class="ts">
        <div class="container">
          <div class="section-head">
            <span class="eyebrow">{{eyebrow}}</span>
            <h2 class="section-title">{{title}}</h2>
          </div>
          <div class="ts__grid">
            {{#items}}
            <figure class="ts__card">
              <div class="ts__stars">★★★★★</div>
              <blockquote>“{{quote}}”</blockquote>
              <figcaption>
                <span class="ts__avatar">{{initials}}</span>
                <div><strong>{{name}}</strong><span>{{info}}</span></div>
              </figcaption>
            </figure>
            {{/items}}
          </div>
        </div>
      </section>
    `),
    css: code(`
      .ts { padding: 104px 0; background: var(--surface); }
      .ts__grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
      .ts__card { display: flex; flex-direction: column; padding: 30px; border: 1px solid var(--border); border-radius: calc(var(--radius) * 1.1); background: #fff; }
      .ts__stars { margin-bottom: 16px; letter-spacing: 2px; color: #f59e0b; }
      .ts__card blockquote { flex: 1; font-size: 16px; line-height: 1.7; }
      .ts__card figcaption { display: flex; align-items: center; gap: 12px; margin-top: 24px; padding-top: 20px; border-top: 1px solid var(--border); }
      .ts__avatar { display: grid; place-items: center; width: 42px; height: 42px; border-radius: 50%; background: var(--primary-soft); color: var(--primary); font-size: 14px; font-weight: 700; }
      .ts__card strong { display: block; font-size: 15px; }
      .ts__card figcaption div span { font-size: 13px; color: var(--muted); }

      @container (max-width: 900px) { .ts__grid { grid-template-columns: 1fr; } }
    `),
  },
  {
    id: "testimonials-slider",
    blockType: "testimonials",
    name: "Slider escuro",
    description: "Citações grandes em carrossel horizontal",
    author: MARINA,
    official: false,
    uses: 19,
    createdAt: "há 4 dias",
    html: code(`
      <section class="tq">
        <div class="container">
          <span class="eyebrow">{{eyebrow}}</span>
          <h2 class="section-title">{{title}}</h2>
          <div class="tq__track">
            {{#items}}
            <figure class="tq__slide">
              <blockquote>{{quote}}</blockquote>
              <figcaption><strong>{{name}}</strong> · {{info}}</figcaption>
            </figure>
            {{/items}}
          </div>
        </div>
      </section>
    `),
    css: code(`
      .tq { overflow: hidden; padding: 104px 0; background: #0b1220; color: #fff; }
      .tq .eyebrow { color: color-mix(in srgb, var(--primary) 60%, #fff); }
      .tq__track { display: flex; gap: 24px; margin-top: 44px; padding-bottom: 12px; overflow-x: auto; scroll-snap-type: x mandatory; scrollbar-width: thin; }
      .tq__slide { flex: 0 0 min(640px, 85%); padding: 40px; border: 1px solid rgba(255,255,255,.08); border-radius: calc(var(--radius) * 1.2); background: rgba(255,255,255,.05); scroll-snap-align: start; }
      .tq__slide blockquote { font-family: var(--heading-font); font-size: clamp(20px, 2.2cqi, 26px); line-height: 1.45; letter-spacing: -0.01em; }
      .tq__slide blockquote::before { content: "“"; display: block; font-size: 64px; line-height: .8; color: var(--primary); }
      .tq__slide figcaption { margin-top: 24px; font-size: 14px; color: #94a3b8; }
      .tq__slide strong { color: #fff; }
    `),
  },
]

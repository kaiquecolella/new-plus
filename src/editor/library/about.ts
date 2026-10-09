import { Building2 } from "lucide-react"
import type { BlockType, Variant } from "../types"
import { ANA, OFFICIAL, code, img } from "./shared"

export const about: BlockType = {
  type: "about",
  name: "Quem somos",
  category: "Institucional",
  description: "História, diferenciais e números da empresa",
  icon: Building2,
  fields: [
    { type: "text", name: "eyebrow", label: "Chamada" },
    { type: "textarea", name: "title", label: "Título" },
    { type: "textarea", name: "text", label: "Texto" },
    {
      type: "list",
      name: "bullets",
      label: "Diferenciais",
      itemLabel: "Diferencial",
      fields: [{ type: "text", name: "text", label: "Texto" }],
      newItem: { text: "Novo diferencial" },
    },
    {
      type: "list",
      name: "stats",
      label: "Números",
      itemLabel: "Número",
      fields: [
        { type: "text", name: "value", label: "Valor" },
        { type: "text", name: "label", label: "Legenda" },
      ],
      newItem: { value: "100+", label: "Nova métrica" },
      max: 4,
    },
    { type: "image", name: "image", label: "Imagem" },
    { type: "text", name: "badgeValue", label: "Selo — número" },
    { type: "text", name: "badgeLabel", label: "Selo — legenda" },
    { type: "text", name: "ctaLabel", label: "Texto do botão" },
    {
      type: "select",
      name: "imagePosition",
      label: "Posição da imagem",
      options: [
        { value: "left", label: "Esquerda" },
        { value: "right", label: "Direita" },
      ],
    },
  ],
  defaultProps: {
    eyebrow: "Quem somos",
    title: "Mais de 15 anos cuidando de famílias inteiras",
    text: "A Clínica Lumen nasceu com um propósito simples: oferecer medicina de excelência com tempo para ouvir. Hoje reunimos mais de 30 especialistas, estrutura completa de exames e um atendimento que trata cada paciente pelo nome.",
    bullets: [
      { text: "Corpo clínico com especialistas certificados" },
      { text: "Consulta, exames e resultados no mesmo lugar" },
      { text: "Agendamento online e lembretes por WhatsApp" },
    ],
    stats: [
      { value: "15+", label: "anos de história" },
      { value: "30+", label: "especialistas" },
      { value: "12 mil", label: "pacientes por ano" },
      { value: "4.9", label: "nota no Google" },
    ],
    image: img("1519494026892-80bbd2d6fd0d"),
    badgeValue: "15+",
    badgeLabel: "anos de cuidado",
    ctaLabel: "Conheça nossa história",
    imagePosition: "left",
  },
}

export const aboutVariants: Variant[] = [
  {
    id: "about-imagem-texto",
    blockType: "about",
    name: "Imagem + texto",
    description: "Foto com selo e lista de diferenciais",
    author: OFFICIAL,
    official: true,
    uses: 167,
    createdAt: "há 8 meses",
    html: code(`
      <section class="ab">
        <div class="container ab__grid ab__grid--{{imagePosition}}">
          <div class="ab__media">
            <div class="ab__img" style="background-image: url('{{image}}')"></div>
            <div class="ab__badge">
              <strong>{{badgeValue}}</strong>
              <span>{{badgeLabel}}</span>
            </div>
          </div>
          <div class="ab__content">
            <span class="eyebrow">{{eyebrow}}</span>
            <h2 class="section-title">{{title}}</h2>
            <p>{{text}}</p>
            <ul class="ab__list">
              {{#bullets}}<li><span class="ab__check">✓</span>{{text}}</li>{{/bullets}}
            </ul>
            <a href="#" class="btn btn-primary">{{ctaLabel}}</a>
          </div>
        </div>
      </section>
    `),
    css: code(`
      .ab { padding: 104px 0; background: #fff; }
      .ab__grid { display: grid; grid-template-columns: 1fr 1fr; gap: 72px; align-items: center; }
      .ab__grid--right .ab__media { order: 2; }
      .ab__media { position: relative; }
      .ab__img { aspect-ratio: 5 / 5.2; border-radius: calc(var(--radius) * 1.6); background-color: var(--primary-soft); background-size: cover; background-position: center; }
      .ab__badge { position: absolute; right: -20px; top: 40px; display: flex; flex-direction: column; padding: 20px 24px; border-radius: var(--radius); background: var(--primary); color: #fff; box-shadow: 0 20px 40px -18px var(--primary); }
      .ab__badge strong { font-family: var(--heading-font); font-size: 34px; line-height: 1; }
      .ab__badge span { margin-top: 4px; font-size: 13px; opacity: .85; }
      .ab__content p { margin: 18px 0 24px; font-size: 17px; color: var(--muted); }
      .ab__list { display: grid; gap: 12px; margin-bottom: 32px; }
      .ab__list li { display: flex; align-items: center; gap: 12px; font-weight: 500; }
      .ab__check { display: grid; place-items: center; width: 24px; height: 24px; border-radius: 50%; background: var(--primary-soft); color: var(--primary); font-size: 13px; font-weight: 700; }

      @container (max-width: 860px) {
        .ab { padding: 72px 0; }
        .ab__grid { grid-template-columns: 1fr; gap: 48px; }
        .ab__grid--right .ab__media { order: 0; }
        .ab__badge { right: 16px; }
      }
    `),
  },
  {
    id: "about-numeros",
    blockType: "about",
    name: "Com números",
    description: "Título, grade de números e foto panorâmica",
    author: ANA,
    official: false,
    uses: 41,
    createdAt: "há 3 semanas",
    html: code(`
      <section class="an">
        <div class="container">
          <div class="an__top">
            <div>
              <span class="eyebrow">{{eyebrow}}</span>
              <h2 class="section-title">{{title}}</h2>
            </div>
            <p>{{text}}</p>
          </div>
          <div class="an__stats">
            {{#stats}}
            <div class="an__stat"><strong>{{value}}</strong><span>{{label}}</span></div>
            {{/stats}}
          </div>
          <div class="an__img" style="background-image: url('{{image}}')"></div>
        </div>
      </section>
    `),
    css: code(`
      .an { padding: 104px 0; background: var(--surface); }
      .an__top { display: grid; grid-template-columns: 1fr 1fr; gap: 56px; align-items: end; margin-bottom: 48px; }
      .an__top p { font-size: 17px; color: var(--muted); }
      .an__stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; overflow: hidden; margin-bottom: 32px; border: 1px solid var(--border); border-radius: var(--radius); background: var(--border); }
      .an__stat { display: flex; flex-direction: column; gap: 4px; padding: 28px; background: #fff; }
      .an__stat strong { font-family: var(--heading-font); font-size: 36px; line-height: 1.1; color: var(--primary); }
      .an__stat span { font-size: 14px; color: var(--muted); }
      .an__img { aspect-ratio: 21 / 8; border-radius: calc(var(--radius) * 1.4); background-color: var(--primary-soft); background-size: cover; background-position: center; }

      @container (max-width: 860px) {
        .an { padding: 72px 0; }
        .an__top { grid-template-columns: 1fr; gap: 16px; }
        .an__stats { grid-template-columns: repeat(2, 1fr); }
        .an__img { aspect-ratio: 4 / 3; }
      }
    `),
  },
]

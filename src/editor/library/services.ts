import { LayoutGrid } from "lucide-react"
import type { BlockType, Variant } from "../types"
import { LUCAS, OFFICIAL, code } from "./shared"

export const services: BlockType = {
  type: "services",
  name: "Especialidades",
  category: "Institucional",
  description: "Serviços ou especialidades com ícone e descrição",
  icon: LayoutGrid,
  fields: [
    { type: "text", name: "eyebrow", label: "Chamada" },
    { type: "textarea", name: "title", label: "Título" },
    { type: "textarea", name: "subtitle", label: "Subtítulo" },
    {
      type: "list",
      name: "items",
      label: "Especialidades",
      itemLabel: "Especialidade",
      fields: [
        { type: "icon", name: "icon", label: "Ícone" },
        { type: "text", name: "title", label: "Nome" },
        { type: "textarea", name: "text", label: "Descrição" },
      ],
      newItem: { icon: "stethoscope", title: "Nova especialidade", text: "Descreva brevemente o atendimento." },
    },
    {
      type: "select",
      name: "columns",
      label: "Colunas",
      options: [
        { value: "2", label: "2 colunas" },
        { value: "3", label: "3 colunas" },
        { value: "4", label: "4 colunas" },
      ],
    },
  ],
  defaultProps: {
    eyebrow: "Especialidades",
    title: "Cuidado completo para cada fase da vida",
    subtitle: "Da prevenção ao tratamento, reunimos as principais especialidades médicas em um só endereço.",
    items: [
      { icon: "heart", title: "Cardiologia", text: "Check-ups, eletrocardiograma e acompanhamento de hipertensão." },
      { icon: "baby", title: "Pediatria", text: "Do recém-nascido ao adolescente, com consultas de puericultura." },
      { icon: "brain", title: "Neurologia", text: "Diagnóstico e tratamento de enxaquecas, epilepsia e distúrbios do sono." },
      { icon: "eye", title: "Oftalmologia", text: "Exames de vista, mapeamento de retina e adaptação de lentes." },
      { icon: "bone", title: "Ortopedia", text: "Tratamento de lesões, dores articulares e reabilitação." },
      { icon: "microscope", title: "Exames laboratoriais", text: "Coleta no local e resultados online em até 24 horas." },
    ],
    columns: "3",
  },
}

export const servicesVariants: Variant[] = [
  {
    id: "services-cards",
    blockType: "services",
    name: "Grade de cards",
    description: "Cards com ícone, título e link",
    author: OFFICIAL,
    official: true,
    uses: 158,
    createdAt: "há 8 meses",
    html: code(`
      <section class="sv">
        <div class="container">
          <div class="section-head">
            <span class="eyebrow">{{eyebrow}}</span>
            <h2 class="section-title">{{title}}</h2>
            <p>{{subtitle}}</p>
          </div>
          <div class="sv__grid sv__grid--{{columns}}">
            {{#items}}
            <article class="sv__card">
              <span class="sv__icon">{{{iconSvg}}}</span>
              <h3>{{title}}</h3>
              <p>{{text}}</p>
              <a href="#" class="sv__more">Saiba mais →</a>
            </article>
            {{/items}}
          </div>
        </div>
      </section>
    `),
    css: code(`
      .sv { padding: 104px 0; background: var(--surface); }
      .sv__grid { display: grid; gap: 20px; }
      .sv__grid--2 { grid-template-columns: repeat(2, 1fr); }
      .sv__grid--3 { grid-template-columns: repeat(3, 1fr); }
      .sv__grid--4 { grid-template-columns: repeat(4, 1fr); }
      .sv__card { padding: 30px; border: 1px solid var(--border); border-radius: calc(var(--radius) * 1.1); background: #fff; transition: all .25s; }
      .sv__card:hover { transform: translateY(-4px); border-color: color-mix(in srgb, var(--primary) 40%, var(--border)); box-shadow: 0 24px 40px -24px rgba(15,23,42,.25); }
      .sv__icon { display: grid; place-items: center; width: 52px; height: 52px; margin-bottom: 22px; border-radius: calc(var(--radius) * .8); background: var(--primary-soft); color: var(--primary); font-size: 26px; }
      .sv__card h3 { margin-bottom: 8px; font-size: 19px; }
      .sv__card p { font-size: 15px; color: var(--muted); }
      .sv__more { display: inline-block; margin-top: 18px; font-size: 14px; font-weight: 600; color: var(--primary); }

      @container (max-width: 960px) {
        .sv__grid--3, .sv__grid--4 { grid-template-columns: repeat(2, 1fr); }
      }
      @container (max-width: 600px) {
        .sv { padding: 72px 0; }
        .sv__grid { grid-template-columns: 1fr !important; }
      }
    `),
  },
  {
    id: "services-lista",
    blockType: "services",
    name: "Lista com ícones",
    description: "Título fixo à esquerda e lista em linhas",
    author: LUCAS,
    official: false,
    uses: 29,
    createdAt: "há 10 dias",
    html: code(`
      <section class="sl">
        <div class="container sl__grid">
          <div class="sl__head">
            <span class="eyebrow">{{eyebrow}}</span>
            <h2 class="section-title">{{title}}</h2>
            <p>{{subtitle}}</p>
          </div>
          <ul class="sl__list">
            {{#items}}
            <li>
              <span class="sl__icon">{{{iconSvg}}}</span>
              <div><h3>{{title}}</h3><p>{{text}}</p></div>
              <span class="sl__arrow">→</span>
            </li>
            {{/items}}
          </ul>
        </div>
      </section>
    `),
    css: code(`
      .sl { padding: 104px 0; background: #fff; }
      .sl__grid { display: grid; grid-template-columns: .8fr 1.2fr; gap: 72px; align-items: start; }
      .sl__head p { margin-top: 14px; font-size: 17px; color: var(--muted); }
      .sl__list li { display: flex; align-items: center; gap: 20px; padding: 22px 0; border-bottom: 1px solid var(--border); }
      .sl__list li:first-child { border-top: 1px solid var(--border); }
      .sl__icon { display: grid; place-items: center; width: 48px; height: 48px; border: 1px solid var(--border); border-radius: 50%; color: var(--primary); font-size: 22px; }
      .sl__list div { flex: 1; }
      .sl__list h3 { font-size: 18px; }
      .sl__list p { font-size: 15px; color: var(--muted); }
      .sl__arrow { color: var(--muted); transition: transform .2s; }
      .sl__list li:hover .sl__arrow { transform: translateX(4px); color: var(--primary); }

      @container (max-width: 860px) {
        .sl { padding: 72px 0; }
        .sl__grid { grid-template-columns: 1fr; gap: 36px; }
      }
    `),
  },
]

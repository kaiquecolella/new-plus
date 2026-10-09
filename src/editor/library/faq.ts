import { CircleHelp } from "lucide-react"
import type { BlockType, Variant } from "../types"
import { MARINA, OFFICIAL, code } from "./shared"

export const faq: BlockType = {
  type: "faq",
  name: "FAQ",
  category: "Conteúdo",
  description: "Perguntas frequentes",
  icon: CircleHelp,
  fields: [
    { type: "text", name: "eyebrow", label: "Chamada" },
    { type: "textarea", name: "title", label: "Título" },
    { type: "textarea", name: "subtitle", label: "Subtítulo" },
    {
      type: "list",
      name: "items",
      label: "Perguntas",
      itemLabel: "Pergunta",
      fields: [
        { type: "text", name: "question", label: "Pergunta" },
        { type: "textarea", name: "answer", label: "Resposta" },
      ],
      newItem: { question: "Nova pergunta?", answer: "Resposta da pergunta." },
    },
    { type: "text", name: "ctaText", label: "Texto da chamada final" },
    { type: "text", name: "ctaLabel", label: "Texto do botão" },
  ],
  defaultProps: {
    eyebrow: "Dúvidas",
    title: "Perguntas frequentes",
    subtitle: "Separamos as dúvidas mais comuns dos nossos pacientes.",
    items: [
      {
        question: "Quais convênios vocês aceitam?",
        answer: "Atendemos os principais convênios da região e também consultas particulares. Consulte a lista completa na recepção ou pelo WhatsApp.",
      },
      {
        question: "Como faço para agendar uma consulta?",
        answer: "Pelo site, pelo WhatsApp ou por telefone. Você recebe a confirmação na hora e um lembrete um dia antes do atendimento.",
      },
      {
        question: "Dá para fazer os exames no mesmo dia da consulta?",
        answer: "Sim. A maioria dos exames laboratoriais e de imagem pode ser feita logo após a consulta, sem novo agendamento.",
      },
      {
        question: "Os resultados ficam disponíveis online?",
        answer: "Sim, em até 24 horas na área do paciente, com acesso por CPF e senha.",
      },
      {
        question: "Vocês atendem aos sábados?",
        answer: "Funcionamos de segunda a sexta, das 7h às 20h, e aos sábados, das 8h às 13h.",
      },
    ],
    ctaText: "Ainda tem dúvidas? Nossa equipe responde rapidinho.",
    ctaLabel: "Falar no WhatsApp",
  },
}

export const faqVariants: Variant[] = [
  {
    id: "faq-acordeao",
    blockType: "faq",
    name: "Acordeão",
    description: "Perguntas que abrem e fecham ao clicar",
    author: OFFICIAL,
    official: true,
    uses: 149,
    createdAt: "há 8 meses",
    html: code(`
      <section class="fq">
        <div class="container fq__wrap">
          <div class="section-head">
            <span class="eyebrow">{{eyebrow}}</span>
            <h2 class="section-title">{{title}}</h2>
            <p>{{subtitle}}</p>
          </div>
          <div class="fq__list">
            {{#items}}
            <details class="fq__item">
              <summary>{{question}}<span class="fq__icon"></span></summary>
              <p>{{answer}}</p>
            </details>
            {{/items}}
          </div>
          <div class="fq__cta">
            <span>{{ctaText}}</span>
            <a href="#" class="btn btn-primary">{{ctaLabel}}</a>
          </div>
        </div>
      </section>
    `),
    css: code(`
      .fq { padding: 104px 0; background: #fff; }
      .fq__wrap { max-width: 820px; }
      .fq__list { display: grid; gap: 12px; }
      .fq__item { border: 1px solid var(--border); border-radius: var(--radius); background: #fff; transition: border-color .2s, box-shadow .2s; }
      .fq__item[open] { border-color: color-mix(in srgb, var(--primary) 45%, var(--border)); box-shadow: 0 12px 30px -20px rgba(15,23,42,.3); }
      .fq__item summary { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 20px 24px; font-size: 16px; font-weight: 600; list-style: none; cursor: pointer; }
      .fq__item summary::-webkit-details-marker { display: none; }
      .fq__icon { position: relative; flex-shrink: 0; width: 28px; height: 28px; border-radius: 50%; background: var(--primary-soft); }
      .fq__icon::before, .fq__icon::after { content: ""; position: absolute; inset: 0; width: 12px; height: 2px; margin: auto; border-radius: 2px; background: var(--primary); }
      .fq__icon::after { transform: rotate(90deg); transition: transform .25s; }
      .fq__item[open] .fq__icon::after { transform: rotate(0); }
      .fq__item p { padding: 0 24px 22px; font-size: 15px; color: var(--muted); }
      .fq__cta { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 16px; margin-top: 32px; padding: 24px 28px; border-radius: var(--radius); background: var(--primary-soft); font-weight: 600; }
    `),
  },
  {
    id: "faq-duas-colunas",
    blockType: "faq",
    name: "Duas colunas",
    description: "Chamada fixa à esquerda, respostas abertas à direita",
    author: MARINA,
    official: false,
    uses: 26,
    createdAt: "há 1 mês",
    html: code(`
      <section class="f2">
        <div class="container f2__grid">
          <div class="f2__head">
            <span class="eyebrow">{{eyebrow}}</span>
            <h2 class="section-title">{{title}}</h2>
            <p>{{subtitle}}</p>
            <div class="f2__cta">
              <strong>{{ctaText}}</strong>
              <a href="#" class="btn btn-primary">{{ctaLabel}}</a>
            </div>
          </div>
          <dl class="f2__list">
            {{#items}}
            <div class="f2__item">
              <dt><span>{{index}}.</span>{{question}}</dt>
              <dd>{{answer}}</dd>
            </div>
            {{/items}}
          </dl>
        </div>
      </section>
    `),
    css: code(`
      .f2 { padding: 104px 0; background: var(--surface); }
      .f2__grid { display: grid; grid-template-columns: .8fr 1.2fr; gap: 72px; }
      .f2__head p { margin-top: 14px; font-size: 17px; color: var(--muted); }
      .f2__cta { display: grid; justify-items: start; gap: 14px; margin-top: 32px; padding: 24px; border: 1px solid var(--border); border-radius: var(--radius); background: #fff; }
      .f2__list { display: grid; gap: 28px; }
      .f2__item dt { display: flex; gap: 14px; font-family: var(--heading-font); font-size: 17px; font-weight: 700; }
      .f2__item dt span { min-width: 28px; color: var(--primary); }
      .f2__item dd { margin: 8px 0 0 42px; font-size: 15px; color: var(--muted); }

      @container (max-width: 860px) {
        .f2 { padding: 72px 0; }
        .f2__grid { grid-template-columns: 1fr; gap: 40px; }
      }
    `),
  },
]

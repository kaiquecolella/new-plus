import { Megaphone, Mail } from "lucide-react"
import type { BlockType, Variant } from "../types"
import { OFFICIAL, code } from "./shared"

export const cta: BlockType = {
  type: "cta",
  name: "Chamada para ação",
  category: "Conversão",
  description: "Faixa de destaque para converter o visitante",
  icon: Megaphone,
  fields: [
    { type: "textarea", name: "title", label: "Título" },
    { type: "textarea", name: "text", label: "Texto" },
    { type: "text", name: "ctaLabel", label: "Botão principal" },
    { type: "text", name: "secondaryLabel", label: "Botão secundário" },
    { type: "toggle", name: "showSecondary", label: "Mostrar botão secundário" },
    {
      type: "select",
      name: "style",
      label: "Fundo",
      options: [
        { value: "gradient", label: "Gradiente" },
        { value: "dark", label: "Escuro" },
        { value: "soft", label: "Suave" },
      ],
    },
  ],
  defaultProps: {
    title: "Sua saúde não pode esperar",
    text: "Agende sua consulta em menos de 2 minutos e seja atendido por quem entende de cuidado.",
    ctaLabel: "Agendar agora",
    secondaryLabel: "(11) 4002-8922",
    showSecondary: true,
    style: "gradient",
  },
}

export const ctaVariants: Variant[] = [
  {
    id: "cta-faixa",
    blockType: "cta",
    name: "Caixa de destaque",
    description: "Caixa arredondada com título e botões",
    author: OFFICIAL,
    official: true,
    uses: 176,
    createdAt: "há 8 meses",
    html: code(`
      <section class="ct">
        <div class="container">
          <div class="ct__box ct__box--{{style}}">
            <div class="ct__shape"></div>
            <div class="ct__content">
              <h2>{{title}}</h2>
              <p>{{text}}</p>
            </div>
            <div class="ct__actions">
              <a href="#" class="btn btn-light">{{ctaLabel}}</a>
              {{#showSecondary}}<a href="#" class="btn ct__ghost">{{secondaryLabel}}</a>{{/showSecondary}}
            </div>
          </div>
        </div>
      </section>
    `),
    css: code(`
      .ct { padding: 88px 0; background: #fff; }
      .ct__box { position: relative; overflow: hidden; display: flex; align-items: center; justify-content: space-between; gap: 40px; padding: 56px 60px; border-radius: calc(var(--radius) * 1.8); color: #fff; }
      .ct__box--gradient { background: linear-gradient(120deg, var(--primary), color-mix(in srgb, var(--primary) 60%, #1e1b4b)); }
      .ct__box--dark { background: #0b1220; }
      .ct__box--soft { background: var(--primary-soft); color: var(--text); }
      .ct__box--soft .btn-light { background: var(--primary); color: #fff; }
      .ct__box--soft .ct__ghost { border-color: var(--border); }
      .ct__shape { position: absolute; right: -80px; top: -120px; width: 360px; height: 360px; border-radius: 50%; background: rgba(255,255,255,.08); pointer-events: none; }
      .ct__content { position: relative; max-width: 560px; }
      .ct__content h2 { margin-bottom: 12px; font-size: clamp(28px, 3.2cqi, 40px); }
      .ct__content p { font-size: 17px; opacity: .85; }
      .ct__actions { position: relative; display: flex; flex-wrap: wrap; gap: 12px; }
      .ct__ghost { border-color: rgba(255,255,255,.35); background: transparent; color: inherit; }

      @container (max-width: 860px) {
        .ct { padding: 56px 0; }
        .ct__box { flex-direction: column; align-items: start; padding: 40px 28px; }
      }
    `),
  },
]

export const contact: BlockType = {
  type: "contact",
  name: "Contato",
  category: "Conversão",
  description: "Informações de contato, formulário e mapa",
  icon: Mail,
  fields: [
    { type: "text", name: "eyebrow", label: "Chamada" },
    { type: "textarea", name: "title", label: "Título" },
    { type: "textarea", name: "text", label: "Texto" },
    { type: "text", name: "address", label: "Endereço" },
    { type: "text", name: "phone", label: "Telefone" },
    { type: "text", name: "email", label: "E-mail" },
    { type: "text", name: "hours", label: "Horário" },
    { type: "text", name: "formTitle", label: "Título do formulário" },
    { type: "text", name: "buttonLabel", label: "Texto do botão" },
  ],
  defaultProps: {
    eyebrow: "Contato",
    title: "Estamos perto de você",
    text: "Fale com a nossa equipe para tirar dúvidas, agendar consultas ou conhecer nossa estrutura.",
    address: "Av. Paulista, 1000 — Bela Vista, São Paulo/SP",
    phone: "(11) 4002-8922",
    email: "contato@clinicalumen.com.br",
    hours: "Seg a sex, 7h–20h · Sáb, 8h–13h",
    formTitle: "Envie uma mensagem",
    buttonLabel: "Enviar mensagem",
  },
}

export const contactVariants: Variant[] = [
  {
    id: "contact-form",
    blockType: "contact",
    name: "Formulário + mapa",
    description: "Dados de contato, formulário e mapa ilustrado",
    author: OFFICIAL,
    official: true,
    uses: 102,
    createdAt: "há 7 meses",
    html: code(`
      <section class="cn">
        <div class="container cn__grid">
          <div>
            <span class="eyebrow">{{eyebrow}}</span>
            <h2 class="section-title">{{title}}</h2>
            <p class="cn__text">{{text}}</p>
            <dl class="cn__info">
              <div><dt>Endereço</dt><dd>{{address}}</dd></div>
              <div><dt>Telefone</dt><dd>{{phone}}</dd></div>
              <div><dt>E-mail</dt><dd>{{email}}</dd></div>
              <div><dt>Horário</dt><dd>{{hours}}</dd></div>
            </dl>
          </div>
          <form class="cn__form">
            <h3>{{formTitle}}</h3>
            <div class="cn__row">
              <input placeholder="Nome">
              <input placeholder="Telefone">
            </div>
            <input placeholder="E-mail">
            <textarea rows="4" placeholder="Como podemos ajudar?"></textarea>
            <button class="btn btn-primary" type="submit">{{buttonLabel}}</button>
          </form>
        </div>
        <div class="cn__map"><span>{{address}}</span></div>
      </section>
    `),
    css: code(`
      .cn { padding: 104px 0 0; background: var(--surface); }
      .cn__grid { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: start; padding-bottom: 80px; }
      .cn__text { margin: 14px 0 32px; font-size: 17px; color: var(--muted); }
      .cn__info { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
      .cn__info dt { margin-bottom: 4px; font-size: 12px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: var(--primary); }
      .cn__info dd { font-weight: 500; }
      .cn__form { display: grid; gap: 14px; padding: 36px; border: 1px solid var(--border); border-radius: calc(var(--radius) * 1.2); background: #fff; box-shadow: 0 24px 50px -30px rgba(15,23,42,.3); }
      .cn__form h3 { margin-bottom: 6px; font-size: 22px; }
      .cn__row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
      .cn__form input, .cn__form textarea { width: 100%; padding: 13px 14px; border: 1px solid var(--border); border-radius: calc(var(--radius) * .6); background: var(--surface); font-size: 15px; outline: none; resize: vertical; }
      .cn__form input:focus, .cn__form textarea:focus { border-color: var(--primary); background: #fff; }
      .cn__map { display: grid; place-items: center; height: 280px; background-color: color-mix(in srgb, var(--primary) 8%, #eef2f7); background-image: linear-gradient(rgba(255,255,255,.7) 2px, transparent 2px), linear-gradient(90deg, rgba(255,255,255,.7) 2px, transparent 2px), linear-gradient(35deg, transparent 48%, rgba(255,255,255,.95) 48%, rgba(255,255,255,.95) 52%, transparent 52%); background-size: 64px 64px, 64px 64px, 100% 100%; }
      .cn__map span { display: flex; align-items: center; gap: 10px; padding: 12px 18px; border-radius: 999px; background: #fff; font-size: 14px; font-weight: 600; box-shadow: 0 12px 30px -12px rgba(15,23,42,.35); }
      .cn__map span::before { content: ""; width: 10px; height: 10px; border-radius: 50%; background: var(--primary); box-shadow: 0 0 0 4px color-mix(in srgb, var(--primary) 25%, transparent); }

      @container (max-width: 860px) {
        .cn { padding-top: 72px; }
        .cn__grid { grid-template-columns: 1fr; gap: 40px; }
      }
      @container (max-width: 520px) { .cn__info, .cn__row { grid-template-columns: 1fr; } }
    `),
  },
]

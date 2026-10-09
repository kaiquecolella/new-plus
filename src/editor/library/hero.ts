import { GalleryHorizontalEnd } from "lucide-react"
import type { BlockType, Variant } from "../types"
import { OFFICIAL, RAFAEL, code, img } from "./shared"

export const hero: BlockType = {
  type: "hero",
  name: "Banner",
  category: "Topo",
  description: "Primeira dobra com título, texto e chamadas",
  icon: GalleryHorizontalEnd,
  fields: [
    { type: "text", name: "eyebrow", label: "Selo / chamada curta" },
    { type: "textarea", name: "title", label: "Título" },
    { type: "textarea", name: "subtitle", label: "Subtítulo" },
    { type: "text", name: "primaryCta", label: "Botão principal" },
    { type: "text", name: "secondaryCta", label: "Botão secundário" },
    { type: "image", name: "image", label: "Imagem" },
    { type: "text", name: "highlightValue", label: "Destaque — número" },
    { type: "text", name: "highlightLabel", label: "Destaque — legenda" },
    { type: "toggle", name: "showSecondary", label: "Mostrar botão secundário" },
    {
      type: "select",
      name: "background",
      label: "Fundo",
      options: [
        { value: "soft", label: "Suave" },
        { value: "white", label: "Branco" },
        { value: "dark", label: "Escuro" },
      ],
    },
  ],
  defaultProps: {
    eyebrow: "Atendimento humanizado desde 2008",
    title: "Cuidar da sua saúde pode ser simples e acolhedor",
    subtitle:
      "Consultas, exames e acompanhamento em um só lugar, com especialistas que ouvem você de verdade.",
    primaryCta: "Agendar consulta",
    secondaryCta: "Ver especialidades",
    image: img("1631217868264-e5b90bb7e133"),
    highlightValue: "+12 mil",
    highlightLabel: "pacientes atendidos por ano",
    showSecondary: true,
    background: "soft",
  },
}

export const heroVariants: Variant[] = [
  {
    id: "hero-split",
    blockType: "hero",
    name: "Split com imagem",
    description: "Texto à esquerda, foto com destaque flutuante à direita",
    author: OFFICIAL,
    official: true,
    uses: 211,
    createdAt: "há 8 meses",
    html: code(`
      <section class="hero hero--{{background}}">
        <div class="container hero__grid">
          <div class="hero__content">
            <span class="hero__badge"><i></i>{{eyebrow}}</span>
            <h1>{{title}}</h1>
            <p>{{subtitle}}</p>
            <div class="hero__actions">
              <a href="#" class="btn btn-primary">{{primaryCta}}</a>
              {{#showSecondary}}<a href="#" class="btn btn-outline">{{secondaryCta}}</a>{{/showSecondary}}
            </div>
          </div>
          <div class="hero__media">
            <div class="hero__img" style="background-image: url('{{image}}')"></div>
            <div class="hero__float">
              <strong>{{highlightValue}}</strong>
              <span>{{highlightLabel}}</span>
            </div>
          </div>
        </div>
      </section>
    `),
    css: code(`
      .hero { position: relative; overflow: hidden; padding: 88px 0 96px; }
      .hero--soft { background: linear-gradient(180deg, var(--primary-soft), #fff); }
      .hero--white { background: #fff; }
      .hero--dark { background: #0b1220; color: #fff; }
      .hero--dark p { color: #cbd5e1; }
      .hero__grid { display: grid; grid-template-columns: 1.05fr 1fr; gap: 64px; align-items: center; }
      .hero__badge { display: inline-flex; align-items: center; gap: 8px; padding: 6px 14px 6px 10px; border: 1px solid var(--border); border-radius: 999px; background: #fff; color: var(--primary); font-size: 13px; font-weight: 600; }
      .hero--dark .hero__badge { background: rgba(255,255,255,.06); border-color: rgba(255,255,255,.12); }
      .hero__badge i { width: 8px; height: 8px; border-radius: 50%; background: var(--primary); box-shadow: 0 0 0 4px color-mix(in srgb, var(--primary) 20%, transparent); }
      .hero h1 { margin: 22px 0 18px; font-size: clamp(36px, 5cqi, 60px); }
      .hero p { max-width: 520px; font-size: 18px; color: var(--muted); }
      .hero__actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 34px; }
      .hero__media { position: relative; }
      .hero__img { aspect-ratio: 1 / 1.05; border-radius: calc(var(--radius) * 1.6); background-color: var(--primary-soft); background-size: cover; background-position: center; box-shadow: 0 30px 60px -30px rgba(15,23,42,.45); }
      .hero__float { position: absolute; left: -28px; bottom: 36px; display: flex; flex-direction: column; padding: 18px 22px; border-radius: var(--radius); background: #fff; color: var(--text); box-shadow: 0 20px 40px -16px rgba(15,23,42,.3); }
      .hero__float strong { font-family: var(--heading-font); font-size: 28px; line-height: 1.1; color: var(--primary); }
      .hero__float span { font-size: 13px; color: var(--muted); }

      @container (max-width: 860px) {
        .hero { padding: 56px 0 64px; }
        .hero__grid { grid-template-columns: 1fr; gap: 44px; }
        .hero__img { aspect-ratio: 4 / 3; }
        .hero__float { left: 16px; bottom: 16px; }
      }
    `),
  },
  {
    id: "hero-centralizado",
    blockType: "hero",
    name: "Centralizado",
    description: "Título grande centralizado com imagem panorâmica",
    author: OFFICIAL,
    official: true,
    uses: 96,
    createdAt: "há 6 meses",
    html: code(`
      <section class="hx hx--{{background}}">
        <div class="hx__glow"></div>
        <div class="container hx__inner">
          <span class="eyebrow">{{eyebrow}}</span>
          <h1>{{title}}</h1>
          <p>{{subtitle}}</p>
          <div class="hx__actions">
            <a href="#" class="btn btn-primary">{{primaryCta}}</a>
            {{#showSecondary}}<a href="#" class="btn btn-outline">{{secondaryCta}}</a>{{/showSecondary}}
          </div>
          <div class="hx__proof"><strong>{{highlightValue}}</strong> {{highlightLabel}}</div>
          <div class="hx__image" style="background-image: url('{{image}}')"></div>
        </div>
      </section>
    `),
    css: code(`
      .hx { position: relative; overflow: hidden; padding: 96px 0 0; text-align: center; }
      .hx--soft { background: var(--primary-soft); }
      .hx--white { background: #fff; }
      .hx--dark { background: #0b1220; color: #fff; }
      .hx--dark p, .hx--dark .hx__proof { color: #cbd5e1; }
      .hx__glow { position: absolute; left: 50%; top: -520px; width: 900px; height: 900px; transform: translateX(-50%); background: radial-gradient(circle, color-mix(in srgb, var(--primary) 35%, transparent), transparent 65%); pointer-events: none; }
      .hx__inner { position: relative; display: flex; flex-direction: column; align-items: center; }
      .hx h1 { max-width: 860px; margin-bottom: 20px; font-size: clamp(38px, 5.6cqi, 68px); }
      .hx p { max-width: 620px; font-size: 19px; color: var(--muted); }
      .hx__actions { display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; margin-top: 34px; }
      .hx__proof { margin-top: 22px; font-size: 14px; color: var(--muted); }
      .hx__proof strong { color: var(--primary); }
      .hx__image { width: 100%; max-width: 1040px; aspect-ratio: 16 / 7; margin-top: 56px; border-radius: calc(var(--radius) * 1.4) calc(var(--radius) * 1.4) 0 0; background-color: #fff; background-size: cover; background-position: center; box-shadow: 0 -20px 60px -30px rgba(15,23,42,.35); }

      @container (max-width: 700px) {
        .hx { padding-top: 64px; }
        .hx__image { aspect-ratio: 4 / 3; margin-top: 40px; }
      }
    `),
  },
  {
    id: "hero-formulario",
    blockType: "hero",
    name: "Com formulário",
    description: "Imagem de fundo com formulário de agendamento",
    author: RAFAEL,
    official: false,
    uses: 58,
    createdAt: "há 1 mês",
    html: code(`
      <section class="hf hf--{{background}}" style="--img: url('{{image}}')">
        <div class="container hf__grid">
          <div>
            <span class="eyebrow">{{eyebrow}}</span>
            <h1>{{title}}</h1>
            <p>{{subtitle}}</p>
            <div class="hf__proof"><strong>{{highlightValue}}</strong> {{highlightLabel}}</div>
          </div>
          <form class="hf__form">
            <h3>{{primaryCta}}</h3>
            <label>Nome <input placeholder="Seu nome completo"></label>
            <label>WhatsApp <input placeholder="(11) 90000-0000"></label>
            <label>Especialidade
              <select><option>Clínica geral</option><option>Cardiologia</option><option>Pediatria</option></select>
            </label>
            <button class="btn btn-primary" type="submit">{{primaryCta}}</button>
            {{#showSecondary}}<small>{{secondaryCta}}</small>{{/showSecondary}}
          </form>
        </div>
      </section>
    `),
    css: code(`
      .hf { position: relative; padding: 96px 0; color: #fff; background-color: #0b1220; background-image: var(--img); background-size: cover; background-position: center; }
      .hf::before { content: ""; position: absolute; inset: 0; background: linear-gradient(90deg, rgba(11,18,32,.94) 35%, rgba(11,18,32,.55)); }
      .hf--soft::before { background: linear-gradient(90deg, color-mix(in srgb, var(--primary) 92%, #000) 35%, color-mix(in srgb, var(--primary) 50%, transparent)); }
      .hf--white { color: var(--text); }
      .hf--white::before { background: linear-gradient(90deg, rgba(255,255,255,.97) 40%, rgba(255,255,255,.65)); }
      .hf__grid { position: relative; display: grid; grid-template-columns: 1.2fr .9fr; gap: 56px; align-items: center; }
      .hf .eyebrow { color: inherit; opacity: .8; }
      .hf h1 { margin-bottom: 18px; font-size: clamp(34px, 4.6cqi, 56px); }
      .hf p { max-width: 540px; font-size: 18px; opacity: .85; }
      .hf__proof { margin-top: 28px; font-size: 15px; opacity: .9; }
      .hf__proof strong { margin-right: 6px; font-size: 22px; }
      .hf__form { display: grid; gap: 14px; padding: 32px; border-radius: calc(var(--radius) * 1.2); background: #fff; color: var(--text); box-shadow: 0 30px 60px -20px rgba(0,0,0,.45); }
      .hf__form h3 { margin-bottom: 4px; font-size: 22px; }
      .hf__form label { display: grid; gap: 6px; font-size: 13px; font-weight: 600; color: var(--muted); }
      .hf__form input, .hf__form select { height: 46px; padding: 0 14px; border: 1px solid var(--border); border-radius: calc(var(--radius) * .6); background: var(--surface); color: var(--text); font-size: 15px; outline: none; }
      .hf__form input:focus, .hf__form select:focus { border-color: var(--primary); box-shadow: 0 0 0 3px color-mix(in srgb, var(--primary) 20%, transparent); }
      .hf__form .btn { width: 100%; margin-top: 6px; }
      .hf__form small { text-align: center; font-size: 12px; color: var(--muted); }

      @container (max-width: 860px) {
        .hf { padding: 64px 0; }
        .hf__grid { grid-template-columns: 1fr; gap: 36px; }
      }
    `),
  },
]

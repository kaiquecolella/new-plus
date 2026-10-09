import { PanelBottom } from "lucide-react"
import type { BlockType, Variant } from "../types"
import { ANA, OFFICIAL, code } from "./shared"

export const footer: BlockType = {
  type: "footer",
  name: "Rodapé",
  category: "Rodapé",
  description: "Links institucionais, redes sociais e direitos",
  icon: PanelBottom,
  fields: [
    { type: "text", name: "logoText", label: "Nome / logo" },
    { type: "textarea", name: "description", label: "Descrição" },
    {
      type: "list",
      name: "columns",
      label: "Colunas de links",
      itemLabel: "Coluna",
      fields: [
        { type: "text", name: "title", label: "Título" },
        { type: "textarea", name: "links", label: "Links (um por linha)", lines: true },
      ],
      newItem: { title: "Nova coluna", links: "Link 1\nLink 2" },
      max: 4,
    },
    { type: "text", name: "copyright", label: "Direitos autorais" },
    { type: "toggle", name: "showSocial", label: "Mostrar redes sociais" },
    {
      type: "select",
      name: "style",
      label: "Estilo",
      options: [
        { value: "dark", label: "Escuro" },
        { value: "light", label: "Claro" },
      ],
    },
  ],
  defaultProps: {
    logoText: "Clínica Lumen",
    description: "Medicina de excelência com atendimento humano. Cuidando de você e da sua família desde 2008.",
    columns: [
      { title: "Especialidades", links: "Cardiologia\nPediatria\nOrtopedia\nDermatologia" },
      { title: "Institucional", links: "Quem somos\nCorpo clínico\nBlog\nTrabalhe conosco" },
      { title: "Atendimento", links: "(11) 4002-8922\nWhatsApp\nÁrea do paciente\nPolítica de privacidade" },
    ],
    copyright: "© 2026 Clínica Lumen · Responsável técnico: Dr. Rafael Menezes — CRM 123456",
    showSocial: true,
    style: "dark",
  },
}

export const footerVariants: Variant[] = [
  {
    id: "footer-colunas",
    blockType: "footer",
    name: "Colunas",
    description: "Marca, colunas de links e redes sociais",
    author: OFFICIAL,
    official: true,
    uses: 190,
    createdAt: "há 8 meses",
    html: code(`
      <footer class="ft ft--{{style}}">
        <div class="container">
          <div class="ft__top">
            <div class="ft__brand">
              <a href="#" class="ft__logo"><span class="ft__mark"></span>{{logoText}}</a>
              <p>{{description}}</p>
              {{#showSocial}}
              <div class="ft__social">
                <a href="#">IG</a><a href="#">FB</a><a href="#">IN</a><a href="#">YT</a>
              </div>
              {{/showSocial}}
            </div>
            {{#columns}}
            <div class="ft__col">
              <h4>{{title}}</h4>
              <ul>
                {{#linksLines}}<li><a href="#">{{line}}</a></li>{{/linksLines}}
              </ul>
            </div>
            {{/columns}}
          </div>
          <div class="ft__bottom">{{copyright}}</div>
        </div>
      </footer>
    `),
    css: code(`
      .ft { padding: 80px 0 32px; }
      .ft--dark { --ft-strong: #fff; --ft-line: rgba(255,255,255,.08); background: #0b1220; color: #94a3b8; }
      .ft--light { --ft-strong: var(--text); --ft-line: var(--border); background: var(--surface); color: var(--muted); border-top: 1px solid var(--border); }
      .ft__top { display: grid; grid-template-columns: 1.6fr repeat(3, 1fr); gap: 48px; padding-bottom: 56px; }
      .ft__logo { display: flex; align-items: center; gap: 10px; font-family: var(--heading-font); font-size: 20px; font-weight: 700; color: var(--ft-strong); }
      .ft__mark { position: relative; width: 32px; height: 32px; border-radius: calc(var(--radius) * .6); background: var(--primary); }
      .ft__mark::before, .ft__mark::after { content: ""; position: absolute; inset: 0; margin: auto; border-radius: 2px; background: #fff; }
      .ft__mark::before { width: 13px; height: 4px; }
      .ft__mark::after { width: 4px; height: 13px; }
      .ft__brand p { max-width: 320px; margin: 18px 0 22px; font-size: 15px; }
      .ft__social { display: flex; gap: 10px; }
      .ft__social a { display: grid; place-items: center; width: 38px; height: 38px; border: 1px solid var(--ft-line); border-radius: 50%; font-size: 12px; font-weight: 700; transition: all .2s; }
      .ft__social a:hover { border-color: var(--primary); background: var(--primary); color: #fff; }
      .ft__col h4 { margin-bottom: 16px; font-family: var(--font); font-size: 14px; letter-spacing: 0; color: var(--ft-strong); }
      .ft__col ul { display: grid; gap: 10px; font-size: 15px; }
      .ft__col a:hover { color: var(--ft-strong); }
      .ft__bottom { padding-top: 28px; border-top: 1px solid var(--ft-line); font-size: 13px; }

      @container (max-width: 860px) {
        .ft__top { grid-template-columns: 1fr 1fr; }
        .ft__brand { grid-column: 1 / -1; }
      }
      @container (max-width: 480px) { .ft__top { grid-template-columns: 1fr; } }
    `),
  },
  {
    id: "footer-minimalista",
    blockType: "footer",
    name: "Minimalista",
    description: "Uma linha só: logo, links e direitos",
    author: ANA,
    official: false,
    uses: 45,
    createdAt: "há 3 semanas",
    html: code(`
      <footer class="fm fm--{{style}}">
        <div class="container fm__inner">
          <a href="#" class="fm__logo">{{logoText}}</a>
          <nav>
            {{#columns}}<a href="#">{{title}}</a>{{/columns}}
          </nav>
          <span>{{copyright}}</span>
        </div>
      </footer>
    `),
    css: code(`
      .fm { padding: 36px 0; border-top: 1px solid var(--border); }
      .fm--dark { background: #0b1220; color: #94a3b8; border-color: transparent; }
      .fm--light { background: #fff; color: var(--muted); }
      .fm__inner { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 16px 24px; font-size: 14px; }
      .fm__logo { font-family: var(--heading-font); font-size: 18px; font-weight: 700; color: var(--primary); }
      .fm nav { display: flex; flex-wrap: wrap; gap: 24px; }
      .fm nav a:hover { color: var(--primary); }
    `),
  },
]

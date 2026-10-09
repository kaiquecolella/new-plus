import { Users } from "lucide-react"
import type { BlockType, Variant } from "../types"
import { OFFICIAL, code, img } from "./shared"

const photo = (id: string) => img(id, 600, "&h=690&crop=faces")

export const team: BlockType = {
  type: "team",
  name: "Equipe",
  category: "Institucional",
  description: "Corpo clínico ou time com foto e cargo",
  icon: Users,
  fields: [
    { type: "text", name: "eyebrow", label: "Chamada" },
    { type: "textarea", name: "title", label: "Título" },
    { type: "textarea", name: "subtitle", label: "Subtítulo" },
    {
      type: "list",
      name: "members",
      label: "Profissionais",
      itemLabel: "Profissional",
      fields: [
        { type: "image", name: "photo", label: "Foto" },
        { type: "text", name: "name", label: "Nome" },
        { type: "text", name: "role", label: "Especialidade" },
        { type: "text", name: "crm", label: "Registro" },
      ],
      newItem: { photo: "", name: "Novo profissional", role: "Especialidade", crm: "CRM 000000" },
      max: 8,
    },
  ],
  defaultProps: {
    eyebrow: "Corpo clínico",
    title: "Especialistas que acompanham você de perto",
    subtitle: "Profissionais experientes, com formação nas melhores instituições do país.",
    members: [
      { photo: photo("1612349317150-e413f6a5b16d"), name: "Dr. Rafael Menezes", role: "Cardiologista", crm: "CRM 123456" },
      { photo: photo("1559839734-2b71ea197ec2"), name: "Dra. Helena Duarte", role: "Pediatra", crm: "CRM 234567" },
      { photo: photo("1622253692010-333f2da6031d"), name: "Dr. Thiago Nunes", role: "Ortopedista", crm: "CRM 345678" },
      { photo: photo("1594824476967-48c8b964273f"), name: "Dra. Camila Rocha", role: "Dermatologista", crm: "CRM 456789" },
    ],
  },
}

export const teamVariants: Variant[] = [
  {
    id: "team-cards",
    blockType: "team",
    name: "Cards com foto",
    description: "Grade de profissionais com foto vertical",
    author: OFFICIAL,
    official: true,
    uses: 74,
    createdAt: "há 6 meses",
    html: code(`
      <section class="tm">
        <div class="container">
          <div class="section-head">
            <span class="eyebrow">{{eyebrow}}</span>
            <h2 class="section-title">{{title}}</h2>
            <p>{{subtitle}}</p>
          </div>
          <div class="tm__grid">
            {{#members}}
            <article class="tm__card">
              <div class="tm__photo" style="background-image: url('{{photo}}')"></div>
              <h3>{{name}}</h3>
              <span class="tm__role">{{role}}</span>
              <span class="tm__crm">{{crm}}</span>
            </article>
            {{/members}}
          </div>
        </div>
      </section>
    `),
    css: code(`
      .tm { padding: 104px 0; background: #fff; }
      .tm__grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
      .tm__photo { aspect-ratio: 4 / 4.6; margin-bottom: 18px; border-radius: calc(var(--radius) * 1.2); background-color: var(--primary-soft); background-size: cover; background-position: center top; transition: transform .3s; }
      .tm__card:hover .tm__photo { transform: scale(1.02); }
      .tm__card h3 { font-size: 18px; }
      .tm__role { display: block; font-size: 14px; font-weight: 600; color: var(--primary); }
      .tm__crm { display: block; margin-top: 2px; font-size: 13px; color: var(--muted); }

      @container (max-width: 960px) { .tm__grid { grid-template-columns: repeat(2, 1fr); } }
      @container (max-width: 520px) {
        .tm { padding: 72px 0; }
        .tm__grid { grid-template-columns: 1fr; }
      }
    `),
  },
]

import { Newspaper } from "lucide-react"
import type { BlockType, Variant } from "../types"
import { LUCAS, OFFICIAL, code, img } from "./shared"

export const blog: BlockType = {
  type: "blog",
  name: "Blog",
  category: "Conteúdo",
  description: "Últimos artigos publicados no blog",
  icon: Newspaper,
  fields: [
    { type: "text", name: "eyebrow", label: "Chamada" },
    { type: "textarea", name: "title", label: "Título" },
    { type: "textarea", name: "subtitle", label: "Subtítulo" },
    { type: "text", name: "ctaLabel", label: "Texto do botão" },
    {
      type: "list",
      name: "posts",
      label: "Posts",
      help: "No sistema real, os posts vêm da consulta ao blog (últimos publicados).",
      itemLabel: "Post",
      fields: [
        { type: "image", name: "image", label: "Imagem de capa" },
        { type: "text", name: "category", label: "Categoria" },
        { type: "textarea", name: "title", label: "Título" },
        { type: "textarea", name: "excerpt", label: "Resumo" },
        { type: "text", name: "date", label: "Data" },
        { type: "text", name: "readTime", label: "Tempo de leitura" },
      ],
      newItem: { image: "", category: "Saúde", title: "Novo artigo", excerpt: "Resumo do artigo.", date: "30 set 2026", readTime: "4 min" },
      max: 6,
    },
  ],
  defaultProps: {
    eyebrow: "Blog",
    title: "Conteúdo para cuidar melhor de você",
    subtitle: "Dicas de saúde e bem-estar escritas pelo nosso corpo clínico.",
    ctaLabel: "Ver todos os artigos",
    posts: [
      {
        image: img("1511174511562-5f7f18b874f8", 800),
        category: "Prevenção",
        title: "Check-up anual: quais exames fazer em cada idade",
        excerpt: "Um guia prático para entender o que avaliar aos 20, 40 e 60 anos — e por que a prevenção faz diferença.",
        date: "12 set 2026",
        readTime: "6 min",
      },
      {
        image: img("1490645935967-10de6ba17061", 800),
        category: "Alimentação",
        title: "5 hábitos alimentares que protegem o coração",
        excerpt: "Pequenas trocas no prato do dia a dia que ajudam a controlar colesterol e pressão arterial.",
        date: "03 set 2026",
        readTime: "4 min",
      },
      {
        image: img("1571019613454-1cb2f99b2d8b", 800),
        category: "Bem-estar",
        title: "Exercício e saúde mental: o que a ciência já sabe",
        excerpt: "Como a atividade física regular reduz ansiedade, melhora o sono e aumenta a disposição.",
        date: "27 ago 2026",
        readTime: "5 min",
      },
    ],
  },
}

export const blogVariants: Variant[] = [
  {
    id: "blog-grade",
    blockType: "blog",
    name: "Grade de posts",
    description: "Cards com capa, categoria e resumo",
    author: OFFICIAL,
    official: true,
    uses: 120,
    createdAt: "há 7 meses",
    html: code(`
      <section class="bl">
        <div class="container">
          <div class="bl__head">
            <div>
              <span class="eyebrow">{{eyebrow}}</span>
              <h2 class="section-title">{{title}}</h2>
              <p>{{subtitle}}</p>
            </div>
            <a href="#" class="btn btn-outline">{{ctaLabel}}</a>
          </div>
          <div class="bl__grid">
            {{#posts}}
            <article class="bl__card">
              <div class="bl__img" style="background-image: url('{{image}}')">
                <span>{{category}}</span>
              </div>
              <div class="bl__body">
                <div class="bl__meta">{{date}} · {{readTime}} de leitura</div>
                <h3>{{title}}</h3>
                <p>{{excerpt}}</p>
                <a href="#" class="bl__link">Ler artigo →</a>
              </div>
            </article>
            {{/posts}}
          </div>
        </div>
      </section>
    `),
    css: code(`
      .bl { padding: 104px 0; background: #fff; }
      .bl__head { display: flex; align-items: end; justify-content: space-between; gap: 24px; margin-bottom: 48px; }
      .bl__head p { max-width: 520px; margin-top: 12px; font-size: 17px; color: var(--muted); }
      .bl__grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
      .bl__card { display: flex; flex-direction: column; overflow: hidden; border: 1px solid var(--border); border-radius: calc(var(--radius) * 1.1); background: #fff; transition: all .25s; }
      .bl__card:hover { transform: translateY(-3px); box-shadow: 0 24px 40px -24px rgba(15,23,42,.3); }
      .bl__img { position: relative; aspect-ratio: 16 / 10; background-color: var(--primary-soft); background-size: cover; background-position: center; }
      .bl__img span { position: absolute; left: 16px; top: 16px; padding: 5px 12px; border-radius: 999px; background: rgba(255,255,255,.92); color: var(--primary); font-size: 12px; font-weight: 700; }
      .bl__body { display: flex; flex: 1; flex-direction: column; padding: 24px; }
      .bl__meta { margin-bottom: 10px; font-size: 13px; color: var(--muted); }
      .bl__body h3 { margin-bottom: 10px; font-size: 19px; line-height: 1.3; }
      .bl__body p { flex: 1; font-size: 15px; color: var(--muted); }
      .bl__link { margin-top: 18px; font-size: 14px; font-weight: 600; color: var(--primary); }

      @container (max-width: 960px) { .bl__grid { grid-template-columns: repeat(2, 1fr); } }
      @container (max-width: 640px) {
        .bl { padding: 72px 0; }
        .bl__grid { grid-template-columns: 1fr; }
        .bl__head { flex-direction: column; align-items: start; }
      }
    `),
  },
  {
    id: "blog-editorial",
    blockType: "blog",
    name: "Lista editorial",
    description: "Chamada à esquerda e posts em linhas",
    author: LUCAS,
    official: false,
    uses: 33,
    createdAt: "há 2 semanas",
    html: code(`
      <section class="be">
        <div class="container be__wrap">
          <div class="be__head">
            <span class="eyebrow">{{eyebrow}}</span>
            <h2 class="section-title">{{title}}</h2>
            <p>{{subtitle}}</p>
            <a href="#" class="btn btn-primary">{{ctaLabel}}</a>
          </div>
          <div class="be__list">
            {{#posts}}
            <article class="be__item">
              <div class="be__img" style="background-image: url('{{image}}')"></div>
              <div>
                <span class="be__cat">{{category}}</span>
                <h3>{{title}}</h3>
                <div class="be__meta">{{date}} · {{readTime}}</div>
              </div>
            </article>
            {{/posts}}
          </div>
        </div>
      </section>
    `),
    css: code(`
      .be { padding: 104px 0; background: var(--surface); }
      .be__wrap { display: grid; grid-template-columns: .8fr 1.2fr; gap: 64px; }
      .be__head p { margin: 14px 0 28px; font-size: 17px; color: var(--muted); }
      .be__list { display: grid; gap: 16px; }
      .be__item { display: grid; grid-template-columns: 170px 1fr; gap: 22px; align-items: center; padding: 14px; border: 1px solid var(--border); border-radius: var(--radius); background: #fff; transition: border-color .2s; }
      .be__item:hover { border-color: var(--primary); }
      .be__img { aspect-ratio: 4 / 3; border-radius: calc(var(--radius) * .7); background-color: var(--primary-soft); background-size: cover; background-position: center; }
      .be__cat { font-size: 12px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: var(--primary); }
      .be__item h3 { margin: 6px 0 8px; font-size: 18px; line-height: 1.3; }
      .be__meta { font-size: 13px; color: var(--muted); }

      @container (max-width: 900px) {
        .be { padding: 72px 0; }
        .be__wrap { grid-template-columns: 1fr; gap: 36px; }
      }
      @container (max-width: 520px) { .be__item { grid-template-columns: 1fr; } }
    `),
  },
]

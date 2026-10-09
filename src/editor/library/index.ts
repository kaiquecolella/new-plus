import type { BlockType, Section, Variant } from "../types"
import { about, aboutVariants } from "./about"
import { blog, blogVariants } from "./blog"
import { contact, contactVariants, cta, ctaVariants } from "./conversion"
import { faq, faqVariants } from "./faq"
import { footer, footerVariants } from "./footer"
import { header, headerVariants } from "./header"
import { hero, heroVariants } from "./hero"
import { logos, logosVariants } from "./logos"
import { services, servicesVariants } from "./services"
import { stats, statsVariants } from "./stats"
import { team, teamVariants } from "./team"
import { testimonials, testimonialsVariants } from "./testimonials"

export const BLOCK_TYPES: BlockType[] = [
  header,
  hero,
  logos,
  about,
  services,
  stats,
  team,
  testimonials,
  blog,
  faq,
  cta,
  contact,
  footer,
]

export const BLOCKS_BY_TYPE: Record<string, BlockType> = Object.fromEntries(BLOCK_TYPES.map((b) => [b.type, b]))

export const INITIAL_VARIANTS: Variant[] = [
  ...headerVariants,
  ...heroVariants,
  ...logosVariants,
  ...aboutVariants,
  ...servicesVariants,
  ...statsVariants,
  ...teamVariants,
  ...testimonialsVariants,
  ...blogVariants,
  ...faqVariants,
  ...ctaVariants,
  ...contactVariants,
  ...footerVariants,
]

export function newSectionId(): string {
  return `s-${Math.random().toString(36).slice(2, 9)}`
}

export function createSection(variant: Variant): Section {
  const block = BLOCKS_BY_TYPE[variant.blockType]
  return {
    id: newSectionId(),
    blockType: variant.blockType,
    variantId: variant.id,
    props: structuredClone(block.defaultProps),
  }
}

/** Home completa montada para a apresentação. */
const INITIAL_PAGE = [
  "header-padrao",
  "hero-split",
  "logos-faixa",
  "about-imagem-texto",
  "services-cards",
  "stats-faixa",
  "team-cards",
  "testimonials-cards",
  "blog-grade",
  "faq-acordeao",
  "cta-faixa",
  "contact-form",
  "footer-colunas",
]

export function initialSections(): Section[] {
  return INITIAL_PAGE.map((id) => createSection(INITIAL_VARIANTS.find((v) => v.id === id)!))
}

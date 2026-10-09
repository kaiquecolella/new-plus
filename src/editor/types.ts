import type { LucideIcon } from "lucide-react"

export type Props = Record<string, unknown>

interface BaseField {
  name: string
  label: string
  help?: string
}

export type Field =
  | (BaseField & { type: "text" | "textarea"; placeholder?: string; lines?: boolean })
  | (BaseField & { type: "image" })
  | (BaseField & { type: "icon" })
  | (BaseField & { type: "toggle" })
  | (BaseField & { type: "select"; options: { value: string; label: string }[] })
  | (BaseField & {
      type: "list"
      itemLabel: string
      fields: Field[]
      newItem: Props
      max?: number
    })

export interface BlockType {
  type: string
  name: string
  category: string
  description: string
  icon: LucideIcon
  fields: Field[]
  defaultProps: Props
}

export interface Author {
  name: string
  initials: string
  color: string
}

export interface Variant {
  id: string
  blockType: string
  name: string
  description: string
  author: Author
  official: boolean
  html: string
  css: string
  uses: number
  createdAt: string
  basedOn?: string
  isNew?: boolean
}

export interface Section {
  id: string
  blockType: string
  variantId: string
  props: Props
  /** Código editado só nesta seção, ainda não salvo como versão. */
  override?: { html: string; css: string }
}

export interface Theme {
  primary: string
  font: string
  radius: string
}

export type Device = "desktop" | "tablet" | "mobile"

import { create } from "zustand"
import { BLOCKS_BY_TYPE, INITIAL_VARIANTS, createSection, initialSections, newSectionId } from "./library"
import { YOU } from "./library/shared"
import type { Device, Props, Section, Theme, Variant } from "./types"

const INITIAL_THEME: Theme = { primary: "#0d9488", font: "moderna", radius: "suave" }

interface EditorState {
  sections: Section[]
  variants: Variant[]
  theme: Theme
  selectedId: string | null
  codeSectionId: string | null
  device: Device
  preview: boolean
  past: Section[][]
  future: Section[][]
  lastCommit: { key: string; at: number } | null
  /** Tipo de bloco que a biblioteca deve abrir/destacar (ex.: após salvar uma versão). */
  libraryFocus: string | null

  select: (id: string | null) => void
  insertVariant: (variantId: string, index?: number) => void
  moveSection: (from: number, to: number) => void
  moveBy: (id: string, delta: number) => void
  duplicate: (id: string) => void
  remove: (id: string) => void
  updateProps: (id: string, props: Props, key?: string) => void
  changeVariant: (id: string, variantId: string) => void
  setOverride: (id: string, override: Section["override"]) => void
  saveVariant: (sectionId: string, data: { name: string; description: string; html: string; css: string }) => Variant
  setTheme: (theme: Partial<Theme>) => void
  setDevice: (device: Device) => void
  togglePreview: () => void
  openCode: (id: string | null) => void
  undo: () => void
  redo: () => void
  clearPage: () => void
  reset: () => void
}

function initialState() {
  return {
    sections: initialSections(),
    variants: INITIAL_VARIANTS,
    theme: INITIAL_THEME,
    selectedId: null,
    codeSectionId: null,
    device: "desktop" as Device,
    preview: false,
    past: [],
    future: [],
    lastCommit: null,
    libraryFocus: null,
  }
}

export const useEditor = create<EditorState>()((set, get) => {
  /** Grava o novo estado da página no histórico. Edições seguidas com a mesma `key` viram um passo só. */
  function commit(next: Section[], key?: string) {
    const { sections, past, lastCommit } = get()
    const now = Date.now()
    const coalesce = key !== undefined && lastCommit?.key === key && now - lastCommit.at < 1200
    set({
      sections: next,
      past: coalesce ? past : [...past.slice(-60), sections],
      future: [],
      lastCommit: key ? { key, at: now } : null,
    })
  }

  const mapSection = (id: string, fn: (s: Section) => Section) => get().sections.map((s) => (s.id === id ? fn(s) : s))

  return {
    ...initialState(),

    select: (id) => set({ selectedId: id }),

    insertVariant: (variantId, index) => {
      const variant = get().variants.find((v) => v.id === variantId)
      if (!variant) return
      const section = createSection(variant)
      const next = [...get().sections]
      next.splice(index ?? next.length, 0, section)
      commit(next)
      set({ selectedId: section.id })
    },

    moveSection: (from, to) => {
      if (from === to) return
      const next = [...get().sections]
      const [moved] = next.splice(from, 1)
      next.splice(to, 0, moved)
      commit(next)
    },

    moveBy: (id, delta) => {
      const index = get().sections.findIndex((s) => s.id === id)
      const to = index + delta
      if (index < 0 || to < 0 || to >= get().sections.length) return
      get().moveSection(index, to)
    },

    duplicate: (id) => {
      const index = get().sections.findIndex((s) => s.id === id)
      if (index < 0) return
      const copy = { ...structuredClone(get().sections[index]), id: newSectionId() }
      const next = [...get().sections]
      next.splice(index + 1, 0, copy)
      commit(next)
      set({ selectedId: copy.id })
    },

    remove: (id) => {
      commit(get().sections.filter((s) => s.id !== id))
      if (get().selectedId === id) set({ selectedId: null })
    },

    updateProps: (id, props, key) => commit(mapSection(id, (s) => ({ ...s, props })), key ?? `props:${id}`),

    changeVariant: (id, variantId) => commit(mapSection(id, (s) => ({ ...s, variantId, override: undefined }))),

    setOverride: (id, override) => commit(mapSection(id, (s) => ({ ...s, override }))),

    saveVariant: (sectionId, data) => {
      const section = get().sections.find((s) => s.id === sectionId)!
      const base = get().variants.find((v) => v.id === section.variantId)
      const variant: Variant = {
        id: `${section.blockType}-${Math.random().toString(36).slice(2, 8)}`,
        blockType: section.blockType,
        name: data.name,
        description: data.description || `Baseada em “${base?.name ?? BLOCKS_BY_TYPE[section.blockType].name}”`,
        author: YOU,
        official: false,
        html: data.html,
        css: data.css,
        uses: 1,
        createdAt: "agora mesmo",
        basedOn: base?.name,
        isNew: true,
      }
      set({ variants: [...get().variants, variant], libraryFocus: section.blockType })
      commit(mapSection(sectionId, (s) => ({ ...s, variantId: variant.id, override: undefined })))
      return variant
    },

    setTheme: (theme) => set({ theme: { ...get().theme, ...theme } }),
    setDevice: (device) => set({ device }),
    togglePreview: () => set({ preview: !get().preview, selectedId: null }),
    openCode: (id) => set({ codeSectionId: id, ...(id ? { selectedId: id } : {}) }),

    undo: () => {
      const { past, sections, future, selectedId } = get()
      if (!past.length) return
      const prev = past[past.length - 1]
      set({
        sections: prev,
        past: past.slice(0, -1),
        future: [sections, ...future],
        lastCommit: null,
        selectedId: prev.some((s) => s.id === selectedId) ? selectedId : null,
      })
    },

    redo: () => {
      const { past, sections, future, selectedId } = get()
      if (!future.length) return
      const next = future[0]
      set({
        sections: next,
        past: [...past, sections],
        future: future.slice(1),
        lastCommit: null,
        selectedId: next.some((s) => s.id === selectedId) ? selectedId : null,
      })
    },

    clearPage: () => {
      commit([])
      set({ selectedId: null })
    },

    reset: () => set(initialState()),
  }
})

export function useVariant(id: string | undefined): Variant | undefined {
  return useEditor((s) => s.variants.find((v) => v.id === id))
}

/** Código efetivo da seção: a edição local (se houver) ou o da versão. */
export function sectionCode(section: Section, variants: Variant[]): { html: string; css: string } {
  if (section.override) return section.override
  const v = variants.find((x) => x.id === section.variantId)
  return { html: v?.html ?? "", css: v?.css ?? "" }
}

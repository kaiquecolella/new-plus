import { useDraggable } from "@dnd-kit/core"
import { ChevronRight, Layers, Plus, Search, Sparkles, Blocks } from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"
import { cn } from "cn"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { BLOCK_TYPES, BLOCKS_BY_TYPE } from "../library"
import { useEditor } from "../store"
import type { BlockType, Variant } from "../types"
import { AuthorAvatar } from "./author-avatar"
import { SiteThumb } from "./site-render"
import { scrollToSection } from "./scroll"

type Filter = "all" | "official" | "community" | "mine"

/** Versões novas que já foram mostradas (rolagem automática acontece só uma vez). */
const revealed = new Set<string>()

export function LibraryPanel() {
  return (
    <aside className="flex w-[300px] shrink-0 flex-col border-r bg-sidebar">
      <Tabs defaultValue="components" className="min-h-0 flex-1 gap-0">
        <div className="border-b px-3 py-2.5">
          <TabsList className="w-full">
            <TabsTrigger value="components">
              <Blocks /> Componentes
            </TabsTrigger>
            <TabsTrigger value="layers">
              <Layers /> Camadas
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="components" className="flex min-h-0 flex-col">
          <ComponentsTab />
        </TabsContent>
        <TabsContent value="layers" className="min-h-0">
          <LayersTab />
        </TabsContent>
      </Tabs>
    </aside>
  )
}

function ComponentsTab() {
  const variants = useEditor((s) => s.variants)
  const libraryFocus = useEditor((s) => s.libraryFocus)
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState<Filter>("all")
  const [open, setOpen] = useState<Record<string, boolean>>({ hero: true })

  // Ao salvar uma nova versão, abre o grupo correspondente para mostrá-la.
  useEffect(() => {
    if (libraryFocus) {
      setOpen((o) => ({ ...o, [libraryFocus]: true }))
      setFilter("all")
      setQuery("")
    }
  }, [libraryFocus, variants.length])

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase()
    const matches = (v: Variant, b: BlockType) =>
      (filter === "all" ||
        (filter === "official" && v.official) ||
        (filter === "community" && !v.official && v.author.name !== "Você") ||
        (filter === "mine" && v.author.name === "Você")) &&
      (!q || `${b.name} ${v.name} ${v.description} ${v.author.name}`.toLowerCase().includes(q))

    const categories: { name: string; blocks: { block: BlockType; variants: Variant[] }[] }[] = []
    for (const block of BLOCK_TYPES) {
      const list = variants.filter((v) => v.blockType === block.type && matches(v, block))
      if (!list.length) continue
      let cat = categories.find((c) => c.name === block.category)
      if (!cat) categories.push((cat = { name: block.category, blocks: [] }))
      cat.blocks.push({ block, variants: list })
    }
    return categories
  }, [variants, query, filter])

  const searching = query.trim() !== "" || filter !== "all"

  return (
    <>
      <div className="space-y-2.5 border-b px-3 py-3">
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar componentes…" className="bg-background pl-8" />
        </div>
        <ToggleGroup
          type="single"
          size="sm"
          variant="outline"
          spacing={0}
          value={filter}
          onValueChange={(v) => v && setFilter(v as Filter)}
          className="w-full"
        >
          <ToggleGroupItem value="all" className="flex-1 text-xs">Todos</ToggleGroupItem>
          <ToggleGroupItem value="official" className="flex-1 text-xs">Oficiais</ToggleGroupItem>
          <ToggleGroupItem value="community" className="flex-1 text-xs">Time</ToggleGroupItem>
          <ToggleGroupItem value="mine" className="flex-1 text-xs">Minhas</ToggleGroupItem>
        </ToggleGroup>
      </div>
      <ScrollArea className="min-h-0 flex-1">
        <div className="space-y-5 px-3 py-3">
          {groups.map((cat) => (
            <div key={cat.name}>
              <p className="mb-1.5 px-1 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">{cat.name}</p>
              <div className="space-y-1">
                {cat.blocks.map(({ block, variants }) => (
                  <BlockGroup
                    key={block.type}
                    block={block}
                    variants={variants}
                    open={searching || !!open[block.type]}
                    onToggle={() => setOpen((o) => ({ ...o, [block.type]: !o[block.type] }))}
                  />
                ))}
              </div>
            </div>
          ))}
          {groups.length === 0 && (
            <div className="px-2 py-10 text-center text-sm text-muted-foreground">
              {filter === "mine" ? (
                <>
                  <Sparkles className="mx-auto mb-2 size-6 opacity-60" />
                  Você ainda não salvou nenhuma versão. Clique na engrenagem de uma seção para editar o código e salvar.
                </>
              ) : (
                "Nenhum componente encontrado."
              )}
            </div>
          )}
        </div>
      </ScrollArea>
      <p className="border-t px-4 py-2.5 text-[11px] leading-snug text-muted-foreground">
        Arraste para a página ou clique para adicionar abaixo da seção selecionada.
      </p>
    </>
  )
}

function BlockGroup({ block, variants, open, onToggle }: { block: BlockType; variants: Variant[]; open: boolean; onToggle: () => void }) {
  const Icon = block.icon
  const hasNew = variants.some((v) => v.isNew)
  return (
    <div className={cn("rounded-lg", open && "bg-background ring-1 ring-border")}>
      <button
        onClick={onToggle}
        className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left text-sm hover:bg-muted/70"
      >
        <span className="grid size-7 place-items-center rounded-md bg-background ring-1 ring-border">
          <Icon className="size-4 text-muted-foreground" />
        </span>
        <span className="flex-1 font-medium">{block.name}</span>
        {hasNew && <span className="size-2 rounded-full bg-emerald-500" />}
        <Badge variant="secondary" className="tabular-nums">{variants.length}</Badge>
        <ChevronRight className={cn("size-4 text-muted-foreground transition-transform", open && "rotate-90")} />
      </button>
      {open && (
        <div className="space-y-2 px-2 pt-0.5 pb-2">
          {variants.map((v) => (
            <VariantCard key={v.id} variant={v} />
          ))}
        </div>
      )}
    </div>
  )
}

function VariantCard({ variant }: { variant: Variant }) {
  const theme = useEditor((s) => s.theme)
  const block = BLOCKS_BY_TYPE[variant.blockType]
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `lib:${variant.id}`,
    data: { kind: "library", variantId: variant.id },
  })
  const cardRef = useRef<HTMLDivElement | null>(null)

  // Versão recém-publicada: rola a biblioteca até ela.
  useEffect(() => {
    if (!variant.isNew || revealed.has(variant.id)) return
    revealed.add(variant.id)
    setTimeout(() => cardRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 150)
  }, [variant.isNew, variant.id])

  function add() {
    const { sections, selectedId, insertVariant } = useEditor.getState()
    const selIndex = sections.findIndex((s) => s.id === selectedId)
    insertVariant(variant.id, selIndex >= 0 ? selIndex + 1 : undefined)
    scrollToSection(useEditor.getState().selectedId)
  }

  return (
    <div
      ref={(el) => {
        setNodeRef(el)
        cardRef.current = el
      }}
      {...listeners}
      {...attributes}
      onClick={add}
      className={cn(
        "group/card relative cursor-grab overflow-hidden rounded-md border bg-background text-left transition-all hover:border-primary/60 hover:shadow-md active:cursor-grabbing",
        isDragging && "opacity-40",
        variant.isNew && "border-emerald-400 ring-2 ring-emerald-400/30"
      )}
    >
      <div className="border-b">
        <SiteThumb html={variant.html} css={variant.css} fields={block.fields} props={block.defaultProps} theme={theme} />
      </div>
      <div className="flex items-start gap-2 p-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className="truncate text-[13px] font-medium">{variant.name}</p>
            {variant.official ? (
              <Badge variant="outline" className="h-4 px-1.5 text-[10px]">Oficial</Badge>
            ) : variant.isNew ? (
              <Badge className="h-4 bg-emerald-500 px-1.5 text-[10px] text-white">Nova</Badge>
            ) : null}
          </div>
          <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <AuthorAvatar author={variant.author} className="size-4 text-[8px]" />
            <span className="truncate">{variant.author.name}</span>
            <span>·</span>
            <span className="shrink-0">{variant.uses} {variant.uses === 1 ? "uso" : "usos"}</span>
          </div>
        </div>
        <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-md bg-primary text-primary-foreground opacity-0 transition-opacity group-hover/card:opacity-100">
          <Plus className="size-3.5" />
        </span>
      </div>
    </div>
  )
}

function LayersTab() {
  const sections = useEditor((s) => s.sections)
  const variants = useEditor((s) => s.variants)
  const selectedId = useEditor((s) => s.selectedId)
  const select = useEditor((s) => s.select)

  return (
    <ScrollArea className="h-full">
      <div className="space-y-0.5 p-3">
        <p className="mb-2 px-1 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
          Home · {sections.length} seções
        </p>
        {sections.map((s, i) => {
          const block = BLOCKS_BY_TYPE[s.blockType]
          const variant = variants.find((v) => v.id === s.variantId)
          const Icon = block.icon
          return (
            <button
              key={s.id}
              onClick={() => {
                select(s.id)
                scrollToSection(s.id)
              }}
              className={cn(
                "flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-left text-sm hover:bg-muted",
                selectedId === s.id && "bg-primary/10 text-primary hover:bg-primary/10"
              )}
            >
              <span className="w-4 text-right text-[11px] text-muted-foreground tabular-nums">{i + 1}</span>
              <Icon className="size-4 shrink-0 opacity-70" />
              <span className="flex-1 truncate font-medium">{block.name}</span>
              <span className="truncate text-xs text-muted-foreground">{variant?.name}</span>
              {s.override && <span className="size-1.5 shrink-0 rounded-full bg-amber-500" />}
            </button>
          )
        })}
      </div>
    </ScrollArea>
  )
}

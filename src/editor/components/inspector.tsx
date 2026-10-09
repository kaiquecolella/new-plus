import { Check, Code2, Copy, Database, Palette, Settings, SlidersHorizontal, Trash2, TriangleAlert, X } from "lucide-react"
import { useMemo } from "react"
import { cn } from "cn"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { BLOCKS_BY_TYPE } from "../library"
import { useEditor } from "../store"
import { FONTS, PRIMARY_COLORS, RADII } from "../template"
import type { Field, Section } from "../types"
import { AuthorAvatar } from "./author-avatar"
import { FieldEditor } from "./fields"

const isLayoutField = (f: Field) => f.type === "select" || f.type === "toggle"

export function Inspector() {
  const section = useEditor((s) => s.sections.find((x) => x.id === s.selectedId))
  return (
    <aside className="flex w-[320px] shrink-0 flex-col border-l bg-sidebar">
      {section ? <SectionInspector key={section.id} section={section} /> : <PageSettings />}
    </aside>
  )
}

function SectionInspector({ section }: { section: Section }) {
  const block = BLOCKS_BY_TYPE[section.blockType]
  const allVariants = useEditor((s) => s.variants)
  const variants = useMemo(() => allVariants.filter((v) => v.blockType === section.blockType), [allVariants, section.blockType])
  const { select, updateProps, changeVariant, setOverride, openCode, duplicate, remove } = useEditor.getState()
  const variant = variants.find((v) => v.id === section.variantId)
  const Icon = block.icon
  const contentFields = block.fields.filter((f) => !isLayoutField(f))
  const layoutFields = block.fields.filter(isLayoutField)

  const renderFields = (fields: Field[]) =>
    fields.map((f) => (
      <FieldEditor
        key={f.name}
        id={`${section.id}-${f.name}`}
        field={f}
        value={section.props[f.name]}
        onChange={(v) => updateProps(section.id, { ...section.props, [f.name]: v }, `props:${section.id}:${f.name}`)}
      />
    ))

  return (
    <>
      <div className="flex items-start gap-3 border-b px-4 py-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
          <Icon className="size-4.5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-semibold">{block.name}</p>
          <p className="truncate text-xs text-muted-foreground">{block.description}</p>
        </div>
        <Button variant="ghost" size="icon-sm" onClick={() => select(null)}>
          <X />
        </Button>
      </div>

      <ScrollArea className="min-h-0 flex-1">
        <div className="space-y-4 p-4">
          <div className="space-y-2 rounded-lg border bg-background p-3">
            <Label className="text-xs text-muted-foreground">Versão do componente</Label>
            <Select value={section.variantId} onValueChange={(id) => changeVariant(section.id, id)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {variants.map((v) => (
                  <SelectItem key={v.id} value={v.id}>
                    <AuthorAvatar author={v.author} className="size-4 text-[7px]" />
                    {v.name}
                    <span className="text-xs text-muted-foreground">· {v.official ? "Oficial" : v.author.name}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {variant && (
              <p className="text-[11px] leading-snug text-muted-foreground">
                {variant.description}. Por <span className="font-medium text-foreground">{variant.author.name}</span>
                {variant.basedOn && <> · baseada em “{variant.basedOn}”</>} · {variant.createdAt}
              </p>
            )}
            <Button variant="outline" size="sm" className="w-full" onClick={() => openCode(section.id)}>
              <Settings /> Editar HTML e CSS
            </Button>
          </div>

          {section.override && (
            <Alert className="border-amber-300 bg-amber-50 text-amber-900">
              <TriangleAlert />
              <AlertTitle>Código editado só nesta seção</AlertTitle>
              <AlertDescription className="text-amber-800">
                <p>Salve como uma nova versão para o time poder reutilizar.</p>
                <div className="mt-2 flex gap-2">
                  <Button size="xs" onClick={() => openCode(section.id)}>
                    <Code2 /> Salvar versão
                  </Button>
                  <Button size="xs" variant="outline" className="bg-transparent" onClick={() => setOverride(section.id, undefined)}>
                    Descartar
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}

          <Tabs defaultValue="content">
            <TabsList className="w-full">
              <TabsTrigger value="content">
                <Database /> Conteúdo
              </TabsTrigger>
              <TabsTrigger value="layout" disabled={!layoutFields.length}>
                <SlidersHorizontal /> Layout
              </TabsTrigger>
            </TabsList>
            <TabsContent value="content" className="mt-2 space-y-4">
              <p className="flex items-start gap-1.5 rounded-md bg-muted/60 px-2.5 py-2 text-[11px] leading-snug text-muted-foreground">
                <Database className="mt-px size-3 shrink-0" />
                Os textos vêm do banco de dados — no código eles aparecem como variáveis.
              </p>
              {renderFields(contentFields)}
            </TabsContent>
            <TabsContent value="layout" className="mt-2 space-y-4">
              {renderFields(layoutFields)}
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>

      <div className="flex gap-2 border-t p-3">
        <Button variant="outline" size="sm" className="flex-1" onClick={() => duplicate(section.id)}>
          <Copy /> Duplicar
        </Button>
        <Button variant="destructive" size="sm" className="flex-1" onClick={() => remove(section.id)}>
          <Trash2 /> Remover
        </Button>
      </div>
    </>
  )
}

function PageSettings() {
  const theme = useEditor((s) => s.theme)
  const count = useEditor((s) => s.sections.length)
  const setTheme = useEditor((s) => s.setTheme)

  return (
    <>
      <div className="flex items-center gap-3 border-b px-4 py-3">
        <span className="grid size-9 place-items-center rounded-lg bg-primary/10 text-primary">
          <Palette className="size-4.5" />
        </span>
        <div>
          <p className="font-semibold">Página · Home</p>
          <p className="text-xs text-muted-foreground">{count} seções · tema aplicado em todas</p>
        </div>
      </div>
      <ScrollArea className="min-h-0 flex-1">
        <div className="space-y-5 p-4">
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Cor principal</Label>
            <div className="flex flex-wrap items-center gap-2">
              {PRIMARY_COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setTheme({ primary: c })}
                  className={cn(
                    "grid size-7 place-items-center rounded-full ring-offset-2 ring-offset-sidebar transition-transform hover:scale-110",
                    theme.primary === c && "ring-2 ring-foreground/70"
                  )}
                  style={{ background: c }}
                >
                  {theme.primary === c && <Check className="size-3.5 text-white" />}
                </button>
              ))}
              <label className="relative grid size-7 cursor-pointer place-items-center overflow-hidden rounded-full bg-[conic-gradient(red,yellow,lime,aqua,blue,magenta,red)] ring-1 ring-border" title="Cor personalizada">
                <input
                  type="color"
                  value={theme.primary}
                  onChange={(e) => setTheme({ primary: e.target.value })}
                  className="absolute inset-0 cursor-pointer opacity-0"
                />
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Tipografia</Label>
            <Select value={theme.font} onValueChange={(font) => setTheme({ font })}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(FONTS).map(([key, f]) => (
                  <SelectItem key={key} value={key}>
                    <span style={{ fontFamily: f.heading }}>{f.label}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Arredondamento</Label>
            <ToggleGroup
              type="single"
              variant="outline"
              size="sm"
              spacing={0}
              value={theme.radius}
              onValueChange={(radius) => radius && setTheme({ radius })}
              className="w-full"
            >
              {Object.entries(RADII).map(([key, r]) => (
                <ToggleGroupItem key={key} value={key} className="flex-1 text-xs">
                  {r.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>

          <Separator />

          <div className="space-y-3">
            <p className="text-sm font-semibold">Como funciona</p>
            {[
              ["Arraste", "componentes da biblioteca para montar a página."],
              ["Clique", "em uma seção para editar textos, listas e layout aqui."],
              ["Engrenagem", "abre o HTML e o CSS da seção para o dev ajustar."],
              ["Salve", "como uma nova versão — ela fica disponível para todo o time."],
            ].map(([title, text], i) => (
              <div key={title} className="flex gap-3">
                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground">
                  {i + 1}
                </span>
                <p className="text-[13px] leading-snug text-muted-foreground">
                  <span className="font-medium text-foreground">{title}</span> {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>
    </>
  )
}

import { css as cssLang } from "@codemirror/lang-css"
import { html as htmlLang } from "@codemirror/lang-html"
import { EditorView } from "@codemirror/view"
import CodeMirror from "@uiw/react-codemirror"
import { Braces, CircleAlert, Database, Lock, Monitor, RotateCcw, Save, Settings, Smartphone, Sparkles } from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"
import { toast } from "sonner"
import { cn } from "cn"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { BLOCKS_BY_TYPE } from "../library"
import { sectionCode, useEditor } from "../store"
import { BASE_CSS, renderTemplate, templateVars, themeCss, type TemplateVar } from "../template"
import type { Section } from "../types"
import { AuthorAvatar } from "./author-avatar"
import { SiteRender } from "./site-render"

type Tab = "html" | "css" | "theme"

export function CodeDialog() {
  const section = useEditor((s) => s.sections.find((x) => x.id === s.codeSectionId))
  const openCode = useEditor((s) => s.openCode)
  return (
    <Dialog open={!!section} onOpenChange={(o) => !o && openCode(null)}>
      {section && <CodeDialogBody key={section.id} section={section} />}
    </Dialog>
  )
}

function CodeDialogBody({ section }: { section: Section }) {
  const block = BLOCKS_BY_TYPE[section.blockType]
  const variants = useEditor((s) => s.variants)
  const theme = useEditor((s) => s.theme)
  const { openCode, setOverride } = useEditor.getState()
  const variant = variants.find((v) => v.id === section.variantId)!
  const initial = sectionCode(section, variants)

  const [html, setHtml] = useState(initial.html)
  const [css, setCss] = useState(initial.css)
  const [tab, setTab] = useState<Tab>("html")
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop")
  const [saveOpen, setSaveOpen] = useState(false)
  const htmlView = useRef<EditorView | null>(null)

  // Preview com pequeno atraso para não re-renderizar a cada tecla; guarda o último template válido.
  const [debounced, setDebounced] = useState({ html, css })
  useEffect(() => {
    const t = setTimeout(() => setDebounced({ html, css }), 200)
    return () => clearTimeout(t)
  }, [html, css])
  const error = useMemo(() => renderTemplate(debounced.html, block.fields, section.props).error, [debounced.html, block.fields, section.props])
  const [lastValid, setLastValid] = useState(debounced)
  useEffect(() => {
    if (!error) setLastValid(debounced)
  }, [debounced, error])

  const changedFromVariant = html !== variant.html || css !== variant.css
  const changedFromCurrent = html !== initial.html || css !== initial.css
  const vars = useMemo(() => templateVars(block.fields), [block.fields])
  const themeCode = useMemo(() => `/* Tema global — definido em "Página". Somente leitura. */\n${themeCss(theme)}\n\n${BASE_CSS}`, [theme])

  function insert(snippet: string) {
    const view = htmlView.current
    if (!view) return
    const { from, to } = view.state.selection.main
    view.dispatch({ changes: { from, to, insert: snippet }, selection: { anchor: from + snippet.length } })
    view.focus()
  }

  function applyLocal() {
    setOverride(section.id, changedFromVariant ? { html, css } : undefined)
    toast.success("Código aplicado nesta seção", { description: "Salve como nova versão para disponibilizar ao time." })
    openCode(null)
  }

  return (
    <DialogContent
      showCloseButton
      className="flex h-[92vh] w-[96vw] max-w-none flex-col gap-0 overflow-hidden p-0 sm:max-w-[1560px]"
      onEscapeKeyDown={(e) => saveOpen && e.preventDefault()}
    >
      <DialogHeader className="flex-row items-center gap-3 border-b px-5 py-3 pr-12">
        <span className="grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground">
          <Settings className="size-4.5" />
        </span>
        <div className="min-w-0 flex-1">
          <DialogTitle className="flex items-center gap-2 text-base">
            Código da seção · {block.name}
            {changedFromVariant && <Badge className="bg-amber-400 text-amber-950">alterado</Badge>}
          </DialogTitle>
          <DialogDescription className="flex items-center gap-1.5 text-xs">
            Partindo da versão <span className="font-medium text-foreground">“{variant.name}”</span> de
            <AuthorAvatar author={variant.author} className="size-4 text-[7px]" />
            {variant.author.name}
          </DialogDescription>
        </div>
      </DialogHeader>

      <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        {/* Editor */}
        <div className="flex min-h-0 flex-col bg-[#282c34] text-slate-300">
          <div className="flex items-center gap-1 border-b border-white/10 px-2 pt-2">
            {(
              [
                ["html", "HTML"],
                ["css", "CSS"],
                ["theme", "Tema global"],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={cn(
                  "flex items-center gap-1.5 rounded-t-md px-3.5 py-2 text-xs font-medium transition-colors",
                  tab === key ? "bg-[#21252b] text-white" : "text-slate-400 hover:text-slate-200"
                )}
              >
                {key === "theme" && <Lock className="size-3" />}
                {label}
              </button>
            ))}
            <span className="ml-auto pr-2 text-[11px] text-slate-500">Mustache · {"{{ variável }}"}</span>
          </div>

          <div className="min-h-0 flex-1 overflow-hidden bg-[#21252b] text-[13px]">
            {tab === "html" && (
              <CodeMirror
                value={html}
                onChange={setHtml}
                extensions={[htmlLang(), EditorView.lineWrapping]}
                theme="dark"
                height="100%"
                className="h-full"
                onCreateEditor={(view) => (htmlView.current = view)}
                basicSetup={{ foldGutter: true, highlightActiveLine: true }}
              />
            )}
            {tab === "css" && (
              <CodeMirror value={css} onChange={setCss} extensions={[cssLang(), EditorView.lineWrapping]} theme="dark" height="100%" className="h-full" />
            )}
            {tab === "theme" && (
              <CodeMirror value={themeCode} extensions={[cssLang(), EditorView.lineWrapping]} theme="dark" height="100%" className="h-full" editable={false} readOnly />
            )}
          </div>

          {tab === "html" && <VariablesPanel vars={vars} onInsert={insert} />}
        </div>

        {/* Preview */}
        <div className="flex min-h-0 flex-col bg-muted/40">
          <div className="flex items-center gap-2 border-b bg-background px-4 py-2">
            <p className="text-sm font-medium">Pré-visualização</p>
            <span className="text-xs text-muted-foreground">com o conteúdo atual da seção</span>
            {error && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge variant="destructive" className="ml-1">
                    <CircleAlert /> Erro no template
                  </Badge>
                </TooltipTrigger>
                <TooltipContent className="max-w-sm font-mono">{error}</TooltipContent>
              </Tooltip>
            )}
            <ToggleGroup
              type="single"
              size="sm"
              variant="outline"
              spacing={0}
              value={device}
              onValueChange={(v) => v && setDevice(v as "desktop" | "mobile")}
              className="ml-auto"
            >
              <ToggleGroupItem value="desktop" aria-label="Desktop">
                <Monitor />
              </ToggleGroupItem>
              <ToggleGroupItem value="mobile" aria-label="Celular">
                <Smartphone />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
          <div className="min-h-0 flex-1 overflow-auto p-5">
            <ScaledPreview width={device === "desktop" ? 1280 : 390}>
              <SiteRender html={lastValid.html} css={lastValid.css} fields={block.fields} props={section.props} theme={theme} />
            </ScaledPreview>
          </div>
        </div>
      </div>

      <DialogFooter className="mx-0 mb-0 items-center rounded-none px-5 py-3 sm:justify-between">
        <Button variant="ghost" size="sm" disabled={!changedFromVariant} onClick={() => (setHtml(variant.html), setCss(variant.css))}>
          <RotateCcw /> Restaurar original
        </Button>
        <div className="flex flex-col-reverse gap-2 sm:flex-row">
          <Button variant="outline" onClick={() => openCode(null)}>
            Cancelar
          </Button>
          <Button variant="outline" disabled={!changedFromCurrent || !!error} onClick={applyLocal}>
            Aplicar só nesta seção
          </Button>
          <Button disabled={!changedFromVariant || !!error} onClick={() => setSaveOpen(true)}>
            <Save /> Salvar como nova versão
          </Button>
        </div>
      </DialogFooter>

      <SaveVariantDialog
        open={saveOpen}
        onOpenChange={setSaveOpen}
        section={section}
        baseName={variant.name}
        code={{ html, css }}
      />
    </DialogContent>
  )
}

function VariablesPanel({ vars, onInsert }: { vars: TemplateVar[]; onInsert: (snippet: string) => void }) {
  return (
    <div className="max-h-[34%] shrink-0 overflow-y-auto border-t border-white/10 bg-[#282c34] px-4 py-3">
      <p className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
        <Database className="size-3" /> Variáveis do banco
        <span className="font-normal tracking-normal normal-case text-slate-500">— os textos vêm do conteúdo; clique para inserir</span>
      </p>
      <div className="flex flex-wrap gap-1.5">
        {vars.map((v) => (
          <VarChip key={v.snippet} v={v} onInsert={onInsert} />
        ))}
      </div>
    </div>
  )
}

function VarChip({ v, onInsert }: { v: TemplateVar; onInsert: (snippet: string) => void }) {
  const chip = (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={() => onInsert(v.snippet)}
          className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-[11px] text-sky-300 ring-1 ring-white/10 transition-colors hover:bg-sky-400/15 hover:text-sky-200"
        >
          {v.snippet.split("\n")[0]}
        </button>
      </TooltipTrigger>
      <TooltipContent>{v.label}</TooltipContent>
    </Tooltip>
  )
  if (!v.children) return chip
  return (
    <div className="flex w-full flex-wrap items-center gap-1.5 rounded-md bg-white/[0.03] p-1.5 ring-1 ring-white/5">
      <Braces className="size-3 text-slate-500" />
      {chip}
      <span className="text-[11px] text-slate-500">dentro:</span>
      {v.children.map((c) => (
        <VarChip key={c.snippet} v={c} onInsert={onInsert} />
      ))}
    </div>
  )
}

/** Renderiza o preview na largura do dispositivo e escala para caber no painel. */
function ScaledPreview({ width, children }: { width: number; children: React.ReactNode }) {
  const outer = useRef<HTMLDivElement>(null)
  const inner = useRef<HTMLDivElement>(null)
  const [box, setBox] = useState({ available: width, height: 0 })

  useEffect(() => {
    const ro = new ResizeObserver(() => {
      setBox({ available: outer.current!.clientWidth, height: inner.current!.offsetHeight })
    })
    ro.observe(outer.current!)
    ro.observe(inner.current!)
    return () => ro.disconnect()
  }, [])

  const scale = Math.min(1, box.available / width)
  return (
    <div ref={outer} className="w-full">
      <div
        className="mx-auto overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black/10"
        style={{ width: width * scale, height: box.height * scale }}
      >
        <div ref={inner} style={{ width, transform: `scale(${scale})`, transformOrigin: "top left" }}>
          {children}
        </div>
      </div>
    </div>
  )
}

interface SaveVariantDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  section: Section
  baseName: string
  code: { html: string; css: string }
}

function SaveVariantDialog({ open, onOpenChange, section, baseName, code }: SaveVariantDialogProps) {
  const block = BLOCKS_BY_TYPE[section.blockType]
  const variants = useEditor((s) => s.variants)
  const { saveVariant, openCode } = useEditor.getState()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [touched, setTouched] = useState(false)

  const existing = variants.filter((v) => v.blockType === section.blockType)
  const trimmed = name.trim()
  const nameError = !trimmed
    ? "Dê um nome para a nova versão."
    : trimmed.length < 3
      ? "Use pelo menos 3 caracteres."
      : existing.some((v) => v.name.toLowerCase() === trimmed.toLowerCase())
        ? `Já existe uma versão de ${block.name} com esse nome — escolha outro.`
        : null

  function submit(e: React.FormEvent) {
    e.preventDefault()
    setTouched(true)
    if (nameError) return
    saveVariant(section.id, { name: trimmed, description: description.trim(), ...code })
    onOpenChange(false)
    openCode(null)
    toast.success(`Versão “${trimmed}” publicada`, {
      description: `Disponível para todo o time em Componentes › ${block.name}.`,
      icon: <Sparkles className="size-4" />,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={submit} className="grid gap-4">
          <DialogHeader>
            <DialogTitle>Salvar como nova versão</DialogTitle>
            <DialogDescription>
              O HTML e o CSS serão salvos como uma nova versão de <b>{block.name}</b>, baseada em “{baseName}”. A versão
              original continua intacta.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-1.5">
            <Label htmlFor="variant-name">Nome da versão</Label>
            <Input
              id="variant-name"
              autoFocus
              value={name}
              placeholder={`Ex.: ${baseName} — cantos retos`}
              aria-invalid={touched && !!nameError}
              onChange={(e) => setName(e.target.value)}
            />
            {touched && nameError ? (
              <p className="text-xs text-destructive">{nameError}</p>
            ) : (
              <p className="text-xs text-muted-foreground">
                Nomes em uso: {existing.map((v) => v.name).join(", ")}
              </p>
            )}
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="variant-desc">Descrição <span className="font-normal text-muted-foreground">(opcional)</span></Label>
            <Textarea
              id="variant-desc"
              value={description}
              placeholder="O que muda em relação à original?"
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Voltar ao código
            </Button>
            <Button type="submit">
              <Save /> Publicar na biblioteca
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

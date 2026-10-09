import { useDraggable } from "@dnd-kit/core"
import { ArrowDown, ArrowUp, Copy, GripVertical, LayoutTemplate, Lock, MousePointerClick, Settings, Trash2 } from "lucide-react"
import type { ReactNode } from "react"
import { cn } from "cn"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { BLOCKS_BY_TYPE } from "../library"
import { sectionCode, useEditor, useVariant } from "../store"
import type { Device, Section } from "../types"
import { SiteRender } from "./site-render"

const DEVICE_WIDTH: Record<Device, number> = { desktop: 1280, tablet: 820, mobile: 390 }

export function Canvas({ dropIndex, draggingId }: { dropIndex: number | null; draggingId: string | null }) {
  const sections = useEditor((s) => s.sections)
  const device = useEditor((s) => s.device)
  const preview = useEditor((s) => s.preview)
  const select = useEditor((s) => s.select)

  return (
    <div
      id="canvas-scroll"
      className="canvas-bg relative min-w-0 flex-1 overflow-y-auto"
      onClick={() => select(null)}
    >
      <div
        className="mx-auto px-6 py-6 transition-[max-width] duration-300 ease-out"
        style={{ maxWidth: DEVICE_WIDTH[device] + 48 }}
      >
        <div id="canvas-frame" className="overflow-hidden rounded-xl bg-white shadow-2xl ring-1 shadow-black/10 ring-black/10">
          <BrowserBar device={device} />
          {sections.map((section, i) => (
            <CanvasSection
              key={section.id}
              section={section}
              index={i}
              total={sections.length}
              dropBefore={dropIndex === i}
              dropAfter={dropIndex === sections.length && i === sections.length - 1}
              dimmed={draggingId === section.id}
            />
          ))}
          {!preview && <EndZone empty={sections.length === 0} active={dropIndex === sections.length} />}
        </div>
      </div>
    </div>
  )
}

function BrowserBar({ device }: { device: Device }) {
  return (
    <div className="flex h-10 items-center gap-3 border-b bg-muted/50 px-4">
      <div className="flex gap-1.5">
        <span className="size-3 rounded-full bg-[#ff5f57]" />
        <span className="size-3 rounded-full bg-[#febc2e]" />
        <span className="size-3 rounded-full bg-[#28c840]" />
      </div>
      <div className="mx-auto flex h-6 w-full max-w-md items-center justify-center gap-1.5 rounded-md bg-background px-3 text-xs text-muted-foreground ring-1 ring-border">
        <Lock className="size-3" />
        clinicalumen.com.br
      </div>
      <span className="hidden w-16 text-right text-xs text-muted-foreground tabular-nums sm:block">
        {DEVICE_WIDTH[device]}px
      </span>
    </div>
  )
}

function EndZone({ empty, active }: { empty: boolean; active: boolean }) {
  return (
    <div className={cn("p-4", empty && "py-24")}>
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-6 text-center text-sm text-muted-foreground transition-colors",
          empty ? "py-16" : "py-6",
          active ? "border-primary bg-primary/5 text-primary" : "border-border"
        )}
      >
        {empty ? (
          <>
            <LayoutTemplate className="size-8 opacity-60" />
            <p className="font-medium text-foreground">A página está vazia</p>
            <p>Arraste um componente da biblioteca para cá — ou clique nele para adicionar.</p>
          </>
        ) : (
          <p>Arraste mais componentes para cá</p>
        )}
      </div>
    </div>
  )
}

interface CanvasSectionProps {
  section: Section
  index: number
  total: number
  dropBefore: boolean
  dropAfter: boolean
  dimmed: boolean
}

function CanvasSection({ section, index, total, dropBefore, dropAfter, dimmed }: CanvasSectionProps) {
  const block = BLOCKS_BY_TYPE[section.blockType]
  const variant = useVariant(section.variantId)
  const variants = useEditor((s) => s.variants)
  const theme = useEditor((s) => s.theme)
  const preview = useEditor((s) => s.preview)
  const selected = useEditor((s) => s.selectedId === section.id)
  const { select, moveBy, duplicate, remove, openCode } = useEditor.getState()
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: `canvas:${section.id}`,
    data: { kind: "canvas", sectionId: section.id },
    disabled: preview,
  })
  const code = sectionCode(section, variants)
  const Icon = block.icon

  return (
    <div
      data-section-id={section.id}
      className={cn("group/section relative transition-opacity", dimmed && "opacity-40")}
      onClick={(e) => {
        e.stopPropagation()
        if (!preview) select(section.id)
      }}
    >
      <SiteRender html={code.html} css={code.css} fields={block.fields} props={section.props} theme={theme} />

      {!preview && (
        <>
          <div
            className={cn(
              "pointer-events-none absolute inset-0 z-10 ring-2 ring-inset transition-shadow",
              selected ? "ring-primary" : "ring-transparent group-hover/section:ring-primary/40"
            )}
          />

          <div
            className={cn(
              "absolute top-3 left-3 z-20 flex items-center gap-1.5 rounded-md bg-primary py-1 pr-2 pl-1.5 text-xs font-medium text-primary-foreground shadow-md transition-opacity",
              selected ? "opacity-100" : "opacity-0 group-hover/section:opacity-100"
            )}
          >
            <Icon className="size-3.5" />
            {block.name}
            <span className="opacity-70">· {variant?.name}</span>
            {section.override && (
              <Badge className="h-4 bg-amber-400 px-1.5 text-[10px] text-amber-950">código editado</Badge>
            )}
          </div>

          <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
            <div
              className={cn(
                "flex items-center gap-0.5 rounded-lg bg-background p-0.5 shadow-md ring-1 ring-black/10 transition-opacity",
                selected ? "opacity-100" : "opacity-0 group-hover/section:opacity-100"
              )}
            >
              <ToolButton label="Arrastar para reordenar">
                <Button variant="ghost" size="icon-sm" className="cursor-grab active:cursor-grabbing" ref={setNodeRef} {...listeners} {...attributes}>
                  <GripVertical />
                </Button>
              </ToolButton>
              <ToolButton label="Mover para cima">
                <Button variant="ghost" size="icon-sm" disabled={index === 0} onClick={() => moveBy(section.id, -1)}>
                  <ArrowUp />
                </Button>
              </ToolButton>
              <ToolButton label="Mover para baixo">
                <Button variant="ghost" size="icon-sm" disabled={index === total - 1} onClick={() => moveBy(section.id, 1)}>
                  <ArrowDown />
                </Button>
              </ToolButton>
              <ToolButton label="Duplicar">
                <Button variant="ghost" size="icon-sm" onClick={() => duplicate(section.id)}>
                  <Copy />
                </Button>
              </ToolButton>
              <ToolButton label="Remover">
                <Button variant="ghost" size="icon-sm" className="hover:text-destructive" onClick={() => remove(section.id)}>
                  <Trash2 />
                </Button>
              </ToolButton>
            </div>
            <ToolButton label="Editar HTML e CSS">
              <Button
                size="icon"
                className={cn(
                  "rounded-lg shadow-lg transition-all hover:scale-105",
                  selected ? "opacity-100" : "opacity-80 group-hover/section:opacity-100"
                )}
                onClick={() => openCode(section.id)}
              >
                <Settings className="size-4.5" />
              </Button>
            </ToolButton>
          </div>

          {dropBefore && <DropLine position="top" />}
          {dropAfter && <DropLine position="bottom" />}
        </>
      )}
    </div>
  )
}

function DropLine({ position }: { position: "top" | "bottom" }) {
  return (
    <div className={cn("pointer-events-none absolute inset-x-0 z-30 flex justify-center", position === "top" ? "-top-[3px]" : "-bottom-[3px]")}>
      <div className="absolute inset-x-0 h-1.5 rounded-full bg-primary shadow-[0_0_0_4px] shadow-primary/20" />
      <span className="relative -mt-2.5 flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-[11px] font-medium text-primary-foreground shadow">
        <MousePointerClick className="size-3" /> Soltar aqui
      </span>
    </div>
  )
}

function ToolButton({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side="bottom">{label}</TooltipContent>
    </Tooltip>
  )
}

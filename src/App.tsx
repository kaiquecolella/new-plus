import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors, type DragStartEvent } from "@dnd-kit/core"
import { MonitorSmartphone } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Canvas } from "@/editor/components/canvas"
import { CodeDialog } from "@/editor/components/code-dialog"
import { Inspector } from "@/editor/components/inspector"
import { LibraryPanel } from "@/editor/components/library-panel"
import { Topbar } from "@/editor/components/topbar"
import { BLOCKS_BY_TYPE } from "@/editor/library"
import { useEditor } from "@/editor/store"

type DragData = { kind: "library"; variantId: string } | { kind: "canvas"; sectionId: string }

/**
 * Calcula em qual posição da página o item seria solto, a partir da posição do ponteiro
 * sobre as seções renderizadas. Retorna null fora do canvas ou quando não haveria mudança.
 */
function computeDropIndex(p: { x: number; y: number }, drag: DragData): number | null {
  const scroller = document.getElementById("canvas-scroll")
  if (!scroller) return null
  const area = scroller.getBoundingClientRect()
  if (p.x < area.left || p.x > area.right || p.y < area.top || p.y > area.bottom) return null

  const els = scroller.querySelectorAll("[data-section-id]")
  let index = els.length
  for (let i = 0; i < els.length; i++) {
    const r = els[i].getBoundingClientRect()
    if (p.y < r.top + r.height / 2) {
      index = i
      break
    }
  }
  if (drag.kind === "canvas") {
    const from = useEditor.getState().sections.findIndex((s) => s.id === drag.sectionId)
    if (index === from || index === from + 1) return null
  }
  return index
}

function autoScroll(p: { x: number; y: number }) {
  const scroller = document.getElementById("canvas-scroll")
  if (!scroller) return
  const area = scroller.getBoundingClientRect()
  if (p.x < area.left || p.x > area.right) return
  const EDGE = 90
  if (p.y < area.top + EDGE) scroller.scrollTop -= Math.ceil((area.top + EDGE - p.y) / 5)
  else if (p.y > area.bottom - EDGE) scroller.scrollTop += Math.ceil((p.y - (area.bottom - EDGE)) / 5)
}

export default function App() {
  const preview = useEditor((s) => s.preview)
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }))
  const [drag, setDrag] = useState<DragData | null>(null)
  const [dropIndex, setDropIndex] = useState<number | null>(null)
  const dropRef = useRef<number | null>(null)
  const pointer = useRef({ x: 0, y: 0 })

  // Enquanto arrasta: acompanha o ponteiro, atualiza o indicador de posição e rola o canvas nas bordas.
  useEffect(() => {
    if (!drag) return
    const onMove = (e: PointerEvent) => (pointer.current = { x: e.clientX, y: e.clientY })
    window.addEventListener("pointermove", onMove)
    let raf = 0
    const tick = () => {
      const index = computeDropIndex(pointer.current, drag)
      if (index !== dropRef.current) {
        dropRef.current = index
        setDropIndex(index)
      }
      autoScroll(pointer.current)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => {
      window.removeEventListener("pointermove", onMove)
      cancelAnimationFrame(raf)
    }
  }, [drag])

  function onDragStart(e: DragStartEvent) {
    const ev = e.activatorEvent as PointerEvent
    pointer.current = { x: ev.clientX, y: ev.clientY }
    dropRef.current = null
    setDrag(e.active.data.current as DragData)
  }

  function onDragEnd() {
    const index = dropRef.current
    const { sections, insertVariant, moveSection } = useEditor.getState()
    if (drag && index !== null) {
      if (drag.kind === "library") insertVariant(drag.variantId, index)
      else {
        const from = sections.findIndex((s) => s.id === drag.sectionId)
        moveSection(from, index > from ? index - 1 : index)
      }
    }
    dropRef.current = null
    setDropIndex(null)
    setDrag(null)
  }

  useKeyboardShortcuts()

  return (
    <TooltipProvider delayDuration={300}>
      <DndContext sensors={sensors} autoScroll={false} onDragStart={onDragStart} onDragEnd={onDragEnd} onDragCancel={onDragEnd}>
        <div className="flex h-screen flex-col overflow-hidden">
          <Topbar />
          <div className="flex min-h-0 flex-1">
            {!preview && <LibraryPanel />}
            <Canvas dropIndex={dropIndex} draggingId={drag?.kind === "canvas" ? drag.sectionId : null} />
            {!preview && <Inspector />}
          </div>
        </div>
        <DragOverlay dropAnimation={null}>{drag && <DragChip drag={drag} />}</DragOverlay>
      </DndContext>
      <CodeDialog />
      <Toaster theme="light" position="bottom-center" />
      <SmallScreenNotice />
    </TooltipProvider>
  )
}

function DragChip({ drag }: { drag: DragData }) {
  const state = useEditor.getState()
  const variantId =
    drag.kind === "library" ? drag.variantId : state.sections.find((s) => s.id === drag.sectionId)?.variantId
  const variant = state.variants.find((v) => v.id === variantId)
  if (!variant) return null
  const block = BLOCKS_BY_TYPE[variant.blockType]
  const Icon = block.icon
  return (
    <div className="inline-flex cursor-grabbing items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-medium whitespace-nowrap text-primary-foreground shadow-xl ring-4 ring-primary/20">
      <Icon className="size-4" />
      {block.name}
      <span className="opacity-70">· {variant.name}</span>
    </div>
  )
}

function useKeyboardShortcuts() {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement
      if (target.closest("input, textarea, select, [contenteditable=true], [role=dialog]")) return
      const s = useEditor.getState()
      const mod = e.ctrlKey || e.metaKey
      if (mod && e.key.toLowerCase() === "z") {
        e.preventDefault()
        if (e.shiftKey) s.redo()
        else s.undo()
      } else if (mod && e.key.toLowerCase() === "y") {
        e.preventDefault()
        s.redo()
      } else if ((e.key === "Delete" || e.key === "Backspace") && s.selectedId) {
        e.preventDefault()
        s.remove(s.selectedId)
      } else if (e.key === "Escape") {
        if (s.preview) s.togglePreview()
        else s.select(null)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])
}

function SmallScreenNotice() {
  return (
    <div className="fixed inset-0 z-[100] hidden flex-col items-center justify-center gap-3 bg-background p-8 text-center max-[1099px]:flex">
      <MonitorSmartphone className="size-10 text-primary" />
      <p className="text-lg font-semibold">Abra em uma tela maior</p>
      <p className="max-w-sm text-sm text-muted-foreground">
        O editor foi pensado para computador (a partir de 1100px de largura). A visualização de celular está disponível dentro do editor.
      </p>
    </div>
  )
}

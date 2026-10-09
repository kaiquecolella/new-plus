import { ChevronRight, Eye, EyeOff, Monitor, MoreHorizontal, Redo2, RotateCcw, Send, Smartphone, Tablet, Trash2, Undo2 } from "lucide-react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { useEditor } from "../store"
import type { Device } from "../types"

export function Topbar() {
  const device = useEditor((s) => s.device)
  const preview = useEditor((s) => s.preview)
  const canUndo = useEditor((s) => s.past.length > 0)
  const canRedo = useEditor((s) => s.future.length > 0)
  const { setDevice, togglePreview, undo, redo, clearPage, reset } = useEditor.getState()

  return (
    <header className="relative flex h-14 shrink-0 items-center gap-3 border-b bg-background px-3">
      <div className="flex items-center gap-2.5">
        <span className="grid size-8 place-items-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
          E
        </span>
        <div className="hidden items-center gap-1.5 text-sm md:flex">
          <span className="text-muted-foreground">Clínica Lumen</span>
          <ChevronRight className="size-3.5 text-muted-foreground" />
          <span className="font-semibold">Home</span>
          <Badge variant="secondary" className="ml-1">Rascunho</Badge>
        </div>
      </div>

      <div className="absolute left-1/2 flex -translate-x-1/2 items-center gap-2">
        <ToggleGroup
          type="single"
          variant="outline"
          size="sm"
          spacing={0}
          value={device}
          onValueChange={(v) => v && setDevice(v as Device)}
        >
          <ToggleGroupItem value="desktop" aria-label="Desktop" className="px-3">
            <Monitor /> <span className="hidden lg:inline">Desktop</span>
          </ToggleGroupItem>
          <ToggleGroupItem value="tablet" aria-label="Tablet" className="px-3">
            <Tablet /> <span className="hidden lg:inline">Tablet</span>
          </ToggleGroupItem>
          <ToggleGroupItem value="mobile" aria-label="Celular" className="px-3">
            <Smartphone /> <span className="hidden lg:inline">Celular</span>
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="ml-auto flex items-center gap-1">
        <IconAction label="Desfazer (Ctrl+Z)" disabled={!canUndo} onClick={undo}>
          <Undo2 />
        </IconAction>
        <IconAction label="Refazer (Ctrl+Shift+Z)" disabled={!canRedo} onClick={redo}>
          <Redo2 />
        </IconAction>
        <Separator orientation="vertical" className="mx-1 h-5!" />
        <Button variant={preview ? "secondary" : "ghost"} size="sm" onClick={togglePreview}>
          {preview ? <EyeOff /> : <Eye />}
          {preview ? "Sair da visualização" : "Visualizar"}
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm">
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={clearPage}>
              <Trash2 /> Limpar página
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={reset}>
              <RotateCcw /> Reiniciar demonstração
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button
          size="sm"
          className="ml-1"
          onClick={() => toast.success("Página publicada!", { description: "Isso é uma demonstração — nada foi salvo de verdade." })}
        >
          <Send /> Publicar
        </Button>
      </div>
    </header>
  )
}

function IconAction({ label, children, ...props }: React.ComponentProps<typeof Button> & { label: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" size="icon-sm" {...props}>
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
}

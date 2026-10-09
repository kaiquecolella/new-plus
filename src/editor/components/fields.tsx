import { ArrowDown, ArrowUp, ChevronRight, ImageOff, Plus, Trash2 } from "lucide-react"
import { useState } from "react"
import { cn } from "cn"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { SITE_ICONS } from "../site-icons"
import type { Field, Props } from "../types"

interface FieldEditorProps {
  field: Field
  value: unknown
  onChange: (value: unknown) => void
  id: string
}

export function FieldEditor({ field, value, onChange, id }: FieldEditorProps) {
  switch (field.type) {
    case "text":
      return (
        <FieldShell field={field} id={id}>
          <Input id={id} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} />
        </FieldShell>
      )
    case "textarea":
      return (
        <FieldShell field={field} id={id}>
          <Textarea id={id} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} className="min-h-16 resize-y" />
        </FieldShell>
      )
    case "image":
      return (
        <FieldShell field={field} id={id}>
          <div className="flex gap-2">
            <div
              className="grid size-9 shrink-0 place-items-center rounded-md bg-muted bg-cover bg-center ring-1 ring-border"
              style={value ? { backgroundImage: `url('${value}')` } : undefined}
            >
              {!value && <ImageOff className="size-4 text-muted-foreground" />}
            </div>
            <Input id={id} value={String(value ?? "")} placeholder="https://…" onChange={(e) => onChange(e.target.value)} className="text-xs" />
          </div>
        </FieldShell>
      )
    case "icon":
      return (
        <FieldShell field={field} id={id}>
          <Select value={String(value ?? "heart")} onValueChange={onChange}>
            <SelectTrigger id={id} className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(SITE_ICONS).map(([key, { label, icon: Icon }]) => (
                <SelectItem key={key} value={key}>
                  <Icon /> {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FieldShell>
      )
    case "toggle":
      return (
        <div className="flex items-center justify-between gap-3 py-0.5">
          <Label htmlFor={id} className="font-normal">{field.label}</Label>
          <Switch id={id} checked={!!value} onCheckedChange={onChange} />
        </div>
      )
    case "select":
      return (
        <FieldShell field={field} id={id}>
          <ToggleGroup
            type="single"
            variant="outline"
            size="sm"
            spacing={0}
            value={String(value ?? "")}
            onValueChange={(v) => v && onChange(v)}
            className="w-full"
          >
            {field.options.map((o) => (
              <ToggleGroupItem key={o.value} value={o.value} className="flex-1 text-xs">
                {o.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </FieldShell>
      )
    case "list":
      return <ListEditor field={field} value={value} onChange={onChange} id={id} />
  }
}

function FieldShell({ field, id, children }: { field: Field; id: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-xs text-muted-foreground">{field.label}</Label>
      {children}
      {field.help && <p className="text-[11px] leading-snug text-muted-foreground">{field.help}</p>}
    </div>
  )
}

function ListEditor({ field, value, onChange, id }: FieldEditorProps & { field: Extract<Field, { type: "list" }> }) {
  const items = Array.isArray(value) ? (value as Props[]) : []
  const [open, setOpen] = useState<number | null>(null)
  const summaryField = field.fields.find((f) => f.type === "text" || f.type === "textarea")

  const update = (next: Props[]) => onChange(next)
  const move = (i: number, d: number) => {
    const next = [...items]
    ;[next[i], next[i + d]] = [next[i + d], next[i]]
    update(next)
    setOpen(open === i ? i + d : open)
  }

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <Label className="text-xs text-muted-foreground">
          {field.label} <span className="tabular-nums">({items.length})</span>
        </Label>
      </div>
      {field.help && <p className="text-[11px] leading-snug text-muted-foreground">{field.help}</p>}
      <div className="space-y-1">
        {items.map((item, i) => (
          <div key={i} className={cn("rounded-md border bg-background", open === i && "ring-1 ring-primary/30")}>
            <div className="group/item flex items-center gap-1 py-1 pr-1 pl-2">
              <button onClick={() => setOpen(open === i ? null : i)} className="flex min-w-0 flex-1 items-center gap-1.5 text-left text-xs">
                <ChevronRight className={cn("size-3.5 shrink-0 text-muted-foreground transition-transform", open === i && "rotate-90")} />
                <span className="truncate font-medium">
                  {summaryField ? String(item[summaryField.name] || `${field.itemLabel} ${i + 1}`) : `${field.itemLabel} ${i + 1}`}
                </span>
              </button>
              <div className="flex opacity-0 transition-opacity group-hover/item:opacity-100">
                <Button variant="ghost" size="icon-xs" disabled={i === 0} onClick={() => move(i, -1)}>
                  <ArrowUp />
                </Button>
                <Button variant="ghost" size="icon-xs" disabled={i === items.length - 1} onClick={() => move(i, 1)}>
                  <ArrowDown />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  className="hover:text-destructive"
                  onClick={() => {
                    update(items.filter((_, j) => j !== i))
                    setOpen(null)
                  }}
                >
                  <Trash2 />
                </Button>
              </div>
            </div>
            {open === i && (
              <div className="space-y-3 border-t px-2.5 py-2.5">
                {field.fields.map((sub) => (
                  <FieldEditor
                    key={sub.name}
                    id={`${id}-${i}-${sub.name}`}
                    field={sub}
                    value={item[sub.name]}
                    onChange={(v) => update(items.map((it, j) => (j === i ? { ...it, [sub.name]: v } : it)))}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <Button
        variant="outline"
        size="sm"
        className="w-full border-dashed"
        disabled={field.max !== undefined && items.length >= field.max}
        onClick={() => {
          update([...items, structuredClone(field.newItem)])
          setOpen(items.length)
        }}
      >
        <Plus /> Adicionar {field.itemLabel.toLowerCase()}
      </Button>
    </div>
  )
}

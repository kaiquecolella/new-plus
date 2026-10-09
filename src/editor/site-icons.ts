import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import {
  Activity,
  Baby,
  Bone,
  Brain,
  CalendarCheck,
  Clock,
  Eye,
  HeartPulse,
  Mail,
  MapPin,
  Microscope,
  Phone,
  ShieldCheck,
  Smile,
  Star,
  Stethoscope,
  type LucideIcon,
} from "lucide-react"

/** Ícones disponíveis para os campos do tipo "icon" dentro do site. */
export const SITE_ICONS: Record<string, { label: string; icon: LucideIcon }> = {
  heart: { label: "Coração", icon: HeartPulse },
  stethoscope: { label: "Estetoscópio", icon: Stethoscope },
  baby: { label: "Bebê", icon: Baby },
  brain: { label: "Cérebro", icon: Brain },
  eye: { label: "Olho", icon: Eye },
  bone: { label: "Osso", icon: Bone },
  smile: { label: "Sorriso", icon: Smile },
  activity: { label: "Atividade", icon: Activity },
  microscope: { label: "Microscópio", icon: Microscope },
  shield: { label: "Escudo", icon: ShieldCheck },
  calendar: { label: "Calendário", icon: CalendarCheck },
  clock: { label: "Relógio", icon: Clock },
  phone: { label: "Telefone", icon: Phone },
  mail: { label: "E-mail", icon: Mail },
  pin: { label: "Localização", icon: MapPin },
  star: { label: "Estrela", icon: Star },
}

const cache = new Map<string, string>()

export function iconSvg(key: unknown): string {
  const k = typeof key === "string" && key in SITE_ICONS ? key : "heart"
  let svg = cache.get(k)
  if (!svg) {
    svg = renderToStaticMarkup(createElement(SITE_ICONS[k].icon, { size: 24, strokeWidth: 1.75 }))
    cache.set(k, svg)
  }
  return svg
}

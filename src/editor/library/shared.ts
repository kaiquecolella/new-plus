import type { Author } from "../types"

export const OFFICIAL: Author = { name: "Time de Produto", initials: "TP", color: "#0f172a" }
export const MARINA: Author = { name: "Marina Costa", initials: "MC", color: "#db2777" }
export const RAFAEL: Author = { name: "Rafael Lima", initials: "RL", color: "#2563eb" }
export const ANA: Author = { name: "Ana Beatriz", initials: "AB", color: "#7c3aed" }
export const LUCAS: Author = { name: "Lucas Andrade", initials: "LA", color: "#ea580c" }
export const YOU: Author = { name: "Você", initials: "EU", color: "#0d9488" }

export const img = (id: string, w = 1200, extra = "") =>
  `https://images.unsplash.com/photo-${id}?w=${w}&q=75&auto=format&fit=crop${extra}`

/** Remove a indentação comum para o código ficar limpo no editor. */
export function code(s: string): string {
  const lines = s.replace(/^\n/, "").replace(/\s+$/, "").split("\n")
  const indent = Math.min(...lines.filter((l) => l.trim()).map((l) => l.match(/^ */)![0].length))
  return lines.map((l) => l.slice(indent)).join("\n") + "\n"
}

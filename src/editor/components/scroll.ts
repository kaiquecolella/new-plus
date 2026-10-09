/** Rola o canvas até a seção (após o React aplicar a mudança). */
export function scrollToSection(id: string | null) {
  if (!id) return
  requestAnimationFrame(() => {
    document.querySelector(`[data-section-id="${id}"]`)?.scrollIntoView({ behavior: "smooth", block: "start" })
  })
}

import { cn } from "cn"
import type { Author } from "../types"

export function AuthorAvatar({ author, className }: { author: Author; className?: string }) {
  return (
    <span
      className={cn("grid size-6 shrink-0 place-items-center rounded-full text-[10px] font-semibold text-white", className)}
      style={{ background: author.color }}
      title={author.name}
    >
      {author.initials}
    </span>
  )
}

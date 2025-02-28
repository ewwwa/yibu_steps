import { LayoutTemplate } from "lucide-react"
import Image from "next/image"
import type { Session } from "@/types/session"

interface SessionIndicatorProps {
  session: Partial<Session>
}

export function SessionIndicator({ session }: SessionIndicatorProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative w-10 h-10 bg-[#1A1E2E] rounded-md overflow-hidden flex items-center justify-center">
        {session.imageUrl ? (
          <Image
            src={session.imageUrl || "/placeholder.svg"}
            alt={session.title || "Session"}
            fill
            className="object-cover"
          />
        ) : (
          <LayoutTemplate className="w-5 h-5 text-white/40" />
        )}
      </div>
      <span className="text-white text-sm truncate max-w-[120px]">{session.title || "Session 01"}</span>
    </div>
  )
}


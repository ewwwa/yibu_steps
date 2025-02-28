"use client"

import { useState, useRef, useEffect } from "react"
import { LayoutTemplate, Plus, X, ChevronUp, ChevronDown } from "lucide-react"
import Image from "next/image"
import type { Session } from "@/types/session"

interface SessionThumbnailBarProps {
  sessions: Partial<Session>[]
  onAddSession: () => void
  onSelectSession: (id: string) => void
  onRemoveSession: (index: number) => void
  selectedSessionId: string | null
}

export function SessionThumbnailBar({
  sessions = [],
  onAddSession,
  onSelectSession,
  onRemoveSession,
  selectedSessionId,
}: SessionThumbnailBarProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [hasScroll, setHasScroll] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isCollapsed, setIsCollapsed] = useState(false)

  const toggleCollapse = () => setIsCollapsed((prev) => !prev)

  useEffect(() => {
    const checkForScroll = () => {
      if (containerRef.current) {
        const { scrollWidth, clientWidth } = containerRef.current
        setHasScroll(scrollWidth > clientWidth)
      }
    }

    //checkForScroll() //Removed as per update request
    //window.addEventListener("resize", checkForScroll)
    //return () => window.removeEventListener("resize", checkForScroll)
  }, [])

  useEffect(() => {
    if (containerRef.current && sessions.length > 0) {
      const container = containerRef.current
      const lastSessionElement = container.children[container.children.length - 1] as HTMLElement
      if (lastSessionElement) {
        const scrollPosition =
          lastSessionElement.offsetLeft - container.clientWidth + lastSessionElement.offsetWidth + 100 // 100px extra for padding
        container.scrollTo({
          left: Math.max(0, scrollPosition),
          behavior: "smooth",
        })
      }
    }
  }, [sessions.length])

  return (
    <div className={`fixed bottom-[72px] left-0 right-0 ${isCollapsed ? "h-[0.01px]" : "h-auto"} z-30`}>
      <div className={`w-full bg-[#1E2335] border-t border-white/5 relative ${isCollapsed ? "h-[0.01px]" : "h-auto"}`}>
        {!isCollapsed && (
          <div className="w-full">
            <div
              ref={containerRef}
              className="session-thumbnails flex items-center w-full py-3 sm:py-4 pl-3 sm:pl-4 relative overflow-x-auto custom-scrollbar scroll-smooth"
              onScroll={() => setHasScroll(containerRef.current!.scrollLeft > 0)}
            >
              <div className="w-20 sm:w-24 flex-shrink-0" />
              {sessions.map((session, index) => (
                <div
                  key={session.id || index}
                  className="flex flex-col items-center relative z-20 mr-3 sm:mr-4 cursor-pointer w-[84px] sm:w-[92px]"
                  onClick={() => session.id && onSelectSession(session.id)}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <div className="p-0.5">
                    <div
                      className={`relative w-[84px] h-[56px] sm:w-[92px] sm:h-[64px] bg-[#2A3142] rounded-lg overflow-hidden flex items-center justify-center aspect-video ${
                        selectedSessionId === session.id ? "outline outline-[2px] outline-white" : ""
                      }`}
                    >
                      {session.imageUrl ? (
                        <Image
                          src={session.imageUrl || "/placeholder.svg"}
                          alt={session.title || `Session ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <LayoutTemplate className="w-8 h-8 text-white/20" />
                      )}
                      {hoveredIndex === index && sessions.length > 1 && (
                        <button
                          className="absolute top-2 right-2 bg-[#E11D48] hover:bg-[#BE123C] rounded-full p-1.5 transition-colors duration-200"
                          onClick={(e) => {
                            e.stopPropagation()
                            onRemoveSession(index)
                          }}
                          aria-label={`Remove ${session.title || `Session ${index + 1}`}`}
                        >
                          <X className="w-4 h-4 text-white" />
                        </button>
                      )}
                    </div>
                  </div>
                  <span className="mt-2 text-white/80 text-[10px] sm:text-sm font-medium truncate w-[84px] sm:w-[92px] text-center block">
                    {session.title || `Session ${index + 1}`}
                  </span>
                </div>
              ))}
            </div>

            <div
              className={`absolute left-0 top-0 bottom-0 w-24 bg-[#1E2335] z-20 flex items-center justify-center ${
                hasScroll ? "shadow-[4px_0_8px_rgba(0,0,0,0.25)]" : ""
              }`}
            >
              <button
                onClick={onAddSession}
                className="w-[36px] h-[36px] sm:w-[42px] sm:h-[42px] bg-[#E65100] hover:bg-[#B23F00] text-white rounded-full transition-colors duration-200 flex items-center justify-center"
                aria-label="Add new session"
              >
                <Plus className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
          </div>
        )}
        <button
          onClick={toggleCollapse}
          className={`absolute left-1/2 -translate-x-1/2 w-10 h-10 sm:w-8 sm:h-8 ${
            isCollapsed
              ? "-top-5 sm:-top-4 bg-[#E65100] hover:bg-[#B23F00] transition-colors duration-200"
              : "-top-5 sm:-top-4 bg-[#1E2335]"
          } rounded-full z-40 flex items-center justify-center`}
        >
          {isCollapsed ? (
            <ChevronUp className="w-5 h-5 sm:w-4 sm:h-4 text-white" />
          ) : (
            <ChevronDown className="w-5 h-5 sm:w-4 sm:h-4 text-white" />
          )}
        </button>
      </div>
    </div>
  )
}


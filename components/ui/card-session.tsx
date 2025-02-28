"use client"

import type * as React from "react"
import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import type { Session } from "@/types/session"
import { Input } from "@/components/ui/input"
import { Pencil } from "lucide-react"
;<style jsx global>{`
  @keyframes pulseOrange {
    0%, 100% {
      box-shadow: 0 0 0 0 rgba(255, 107, 44, 0.4);
    }
    50% {
      box-shadow: 0 0 0 10px rgba(255, 107, 44, 0);
    }
  }

  .animate-pulse-orange {
    animation: pulseOrange 1s ease-in-out;
  }
`}</style>

interface CardSessionProps extends React.HTMLAttributes<HTMLDivElement> {
  currentSession: Partial<Session>
  isFormTouched: boolean
  children: React.ReactNode
  sessionsList?: React.ReactNode
  onTitleChange: (newTitle: string) => void
  isNewSession?: boolean
  isSelected?: boolean
  shouldAnimate?: boolean
}

export function CardSession({
  currentSession,
  isFormTouched,
  children,
  sessionsList,
  className,
  onTitleChange,
  isNewSession,
  isSelected,
  ...props
}: CardSessionProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(currentSession.title || "Session 01")
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setTitle(newValue || currentSession.title || "Session 01")
  }

  const handleTitleBlur = () => {
    setIsEditing(false)
    if (typeof onTitleChange === "function") {
      onTitleChange(title)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleTitleBlur()
    }
  }

  return (
    <div className="w-full">
      <Card
        className={cn(
          "bg-[#2A3142] border-white/5 shadow-none rounded-lg",
          className,
          (isNewSession || isSelected) && "animate-pulse-orange",
        )}
        {...props}
      >
        <CardHeader className="p-4 min-[1025px]:p-6">
          <CardTitle className="text-white text-xl font-semibold flex items-center truncate">
            {isEditing ? (
              <div className="relative w-fit min-w-[60px] max-w-full">
                <Input
                  ref={inputRef}
                  value={title}
                  onChange={handleTitleChange}
                  onBlur={handleTitleBlur}
                  onKeyDown={handleKeyDown}
                  placeholder={currentSession.title || "Session 01"}
                  className="bg-[#1A1E2E] text-white w-full rounded-none pl-3 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  style={{
                    width: `${Math.max(title.length * 1.2, 1)}ch`,
                  }}
                />
              </div>
            ) : (
              <div className="flex items-center cursor-pointer group w-full" onClick={() => setIsEditing(true)}>
                <span className="truncate">{title}</span>
                <Pencil className="w-4 h-4 ml-2 flex-shrink-0 opacity-50 group-hover:opacity-100 transition-opacity" />
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <div className="px-6 pb-6">{children}</div>
        {sessionsList && <div className="w-full">{sessionsList}</div>}
      </Card>
    </div>
  )
}


"use client"
import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"

interface ColorPickerProps {
  initialColor: string
  onChange: (color: string) => void
}

export function ColorPicker({ initialColor, onChange }: ColorPickerProps) {
  const [color, setColor] = useState(initialColor)
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  const colors = [
    // Row 1
    "#FF7744",
    "#4488FF",
    "#44AA66",
    "#FFDD33",
    "#FF4477",
    "#9944FF",
    // Row 2
    "#6633CC",
    "#3344AA",
    "#33AAFF",
    "#33CCFF",
    "#33CCCC",
    "#339988",
    // Row 3
    "#44BB55",
    "#66CC44",
    "#CCDD33",
    "#FFEE33",
    "#FFBB33",
    "#FF8833",
    // Row 4
    "#FF5722",
    "#775544",
    "#999999",
    "#667788",
    "#FFFFFF",
    "#000000",
  ]

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    const updatePanelPosition = () => {
      if (!inputRef.current || !panelRef.current || !isOpen) return

      const inputRect = inputRef.current.getBoundingClientRect()
      const panelRect = panelRef.current.getBoundingClientRect()

      // Position panel directly above input with no gap
      panelRef.current.style.position = "fixed"
      panelRef.current.style.bottom = `${window.innerHeight - inputRect.top}px`
      panelRef.current.style.left = `${inputRect.left}px`

      // Adjust left position if it would overflow the viewport
      if (inputRect.left + panelRect.width > window.innerWidth) {
        panelRef.current.style.left = `${window.innerWidth - panelRect.width}px`
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    if (isOpen) {
      updatePanelPosition()
      window.addEventListener("scroll", updatePanelPosition, true)
      window.addEventListener("resize", updatePanelPosition)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      window.removeEventListener("scroll", updatePanelPosition, true)
      window.removeEventListener("resize", updatePanelPosition)
    }
  }, [isOpen])

  const handleColorChange = (newColor: string) => {
    setColor(newColor)
    onChange(newColor)
  }

  return (
    <div ref={containerRef} className="w-full" onClick={() => setIsOpen(true)}>
      <div
        ref={inputRef}
        className="flex items-center h-10 px-3 py-2 rounded-md bg-[#1A1E2E] border border-white/10 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="w-5 h-5 rounded-sm mr-2" style={{ backgroundColor: color }} />
        <input
          type="text"
          value={color}
          onChange={(e) => handleColorChange(e.target.value)}
          className="bg-transparent border-none text-white text-sm focus:outline-none flex-1"
          onClick={(e) => {
            e.stopPropagation()
            setIsOpen(true)
          }}
        />
      </div>

      {isOpen && (
        <div ref={panelRef} className="fixed w-[320px] p-4 bg-[#1A1E2E] border border-white/10 rounded-lg shadow-xl">
          <div className="grid grid-cols-6 gap-3 w-[288px]">
            {colors.map((colorOption) => (
              <button
                key={colorOption}
                className={cn(
                  "w-8 h-8 rounded-[4px] border border-white/10 transition-all",
                  color === colorOption && "ring-2 ring-white ring-offset-2 ring-offset-[#1A1E2E]",
                )}
                style={{ backgroundColor: colorOption }}
                onClick={() => handleColorChange(colorOption)}
                aria-label={`Select color ${colorOption}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}


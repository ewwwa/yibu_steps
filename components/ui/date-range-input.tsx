"use client"

import { useState, useRef, useEffect } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format, isAfter, isBefore, addDays } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Input } from "@/components/ui/input"

interface DateRangeInputProps {
  startDate: Date | undefined
  endDate: Date | undefined
  onChange: (dates: { start: Date | undefined; end: Date | undefined }) => void
  error?: string
  disabled?: boolean
  eventDate?: Date
}

export function DateRangeInput({
  startDate,
  endDate,
  onChange,
  error,
  disabled = false,
  eventDate,
}: DateRangeInputProps) {
  const [isOpen, setIsOpen] = useState(false)
  const triggerRef = useRef<HTMLDivElement>(null)

  const formatDate = (date: Date | undefined) => {
    return date ? format(date, "dd/MM/yy") : ""
  }

  const handleSelect = (date: Date | undefined) => {
    if (!startDate || (startDate && endDate)) {
      onChange({ start: date, end: undefined })
    } else {
      if (date && isAfter(date, startDate)) {
        onChange({ start: startDate, end: date })
        setIsOpen(false)
      } else {
        onChange({ start: date, end: undefined })
      }
    }
  }

  const validateDateRange = () => {
    if (startDate && endDate) {
      if (isBefore(endDate, startDate)) {
        return "End date cannot be before start date"
      }
      if (eventDate && isAfter(endDate, eventDate)) {
        return "Registration must end before the event date"
      }
    }
    return ""
  }

  const rangeError = validateDateRange()

  const tomorrow = addDays(new Date(), 1)
  const placeholderText = `${formatDate(tomorrow)} to...`

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (triggerRef.current && !triggerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="space-y-2">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <div className="relative cursor-pointer" ref={triggerRef} onClick={() => setIsOpen(true)}>
            <Input
              value={startDate && endDate ? `${formatDate(startDate)} to ${formatDate(endDate)}` : placeholderText}
              readOnly
              className="bg-[#1A1E2E] border-white/10 text-white placeholder:text-white/40 pl-3 cursor-pointer rounded-md focus:border-white"
              disabled={disabled}
            />
            <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 h-5 w-5 pointer-events-none" />
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-[#1A1E2E] border border-white/10 rounded-md shadow-lg" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={startDate}
            selected={{ from: startDate, to: endDate }}
            onSelect={(range) => {
              handleSelect(range?.from)
              handleSelect(range?.to)
            }}
            numberOfMonths={2}
            disabled={(date) => (eventDate ? isAfter(date, eventDate) : false)}
            className="rounded-md border-0"
            classNames={{
              months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
              month: "space-y-4",
              caption: "flex justify-center pt-1 relative items-center text-white",
              caption_label: "text-sm font-medium text-white",
              nav: "space-x-1 flex items-center",
              nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 text-white",
              nav_button_previous: "absolute left-1",
              nav_button_next: "absolute right-1",
              table: "w-full border-collapse space-y-1",
              head_row: "flex",
              head_cell: "text-white/60 rounded-md w-9 font-normal text-[0.8rem]",
              row: "flex w-full mt-2",
              cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-[#FF6B2C]",
              day: "h-9 w-9 p-0 font-normal text-white aria-selected:opacity-100 hover:bg-white/10",
              day_selected:
                "bg-[#FF6B2C] text-white hover:bg-[#FF6B2C] hover:text-white focus:bg-[#FF6B2C] focus:text-white",
              day_today: "bg-transparent border border-[#2A3142]",
              day_outside: "text-white/40 opacity-50",
              day_disabled: "text-white/40 opacity-50",
              day_range_middle: "aria-selected:bg-[#FF6B2C] aria-selected:text-white",
              day_hidden: "invisible",
            }}
          />
        </PopoverContent>
      </Popover>
      {(error || rangeError) && <p className="text-[#FF6B2C] text-sm mt-1">{error || rangeError}</p>}
    </div>
  )
}


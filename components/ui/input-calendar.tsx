"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { format, addDays } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface InputCalendarProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string
  onSelect?: (date: Date | null) => void
  selected?: Date
}

export function InputCalendar({ className, onSelect, selected, ...props }: InputCalendarProps) {
  const [date, setDate] = React.useState<Date | undefined>(selected || addDays(new Date(), 1))
  const [isOpen, setIsOpen] = React.useState(false)

  const handleSelect = (newDate: Date | undefined) => {
    console.log("InputCalendar handleSelect called with:", newDate)
    setDate(newDate)
    setIsOpen(false)
    if (onSelect) {
      onSelect(newDate || null)
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div className="relative cursor-pointer" onClick={() => setIsOpen(true)}>
          <Input
            value={date ? format(date, "dd/MM/yy") : ""}
            readOnly
            className="bg-[#1A1E2E] border-white/10 text-white placeholder:text-white/40 pl-3 cursor-pointer rounded-md focus:border-white"
            {...props}
          />
          <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 h-5 w-5 pointer-events-none" />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 border-white/10" align="start" side="top">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          disabled={(date) => date <= new Date() || date < new Date("1900-01-01")}
          initialFocus
          className="rounded-md border-0 bg-[#1A1E2E]"
          weekStartsOn={1}
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
            day_today: "bg-transparent border border-[#2A3142]",
            day_selected:
              "bg-[#FF6B2C] text-white hover:bg-[#FF6B2C] hover:text-white focus:bg-[#FF6B2C] focus:text-white",
            day_outside: "text-white/40 opacity-50",
            day_disabled: "text-white/40 opacity-50",
            day_hidden: "invisible",
          }}
          components={{
            IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4 text-white" />,
            IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4 text-white" />,
          }}
        />
      </PopoverContent>
    </Popover>
  )
}


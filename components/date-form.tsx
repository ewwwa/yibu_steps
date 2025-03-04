"use client"

import React from "react"
import type { EventFormErrors } from "@/types/event"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CalendarIcon, ChevronLeft, ChevronRight, AlertCircle } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import type { EventDetails } from "./event-form"

interface DateFormProps {
  eventDetails: EventDetails
  errors: EventFormErrors
  handleChange: (changes: Partial<EventDetails>) => void
  setErrors: React.Dispatch<React.SetStateAction<EventFormErrors>>
  setIsFormTouched: React.Dispatch<React.SetStateAction<boolean>>
}

export function DateForm({ eventDetails, errors, handleChange, setErrors, setIsFormTouched }: DateFormProps) {
  const [calendarOpen, setCalendarOpen] = React.useState(false)
  const [startTimeOpen, setStartTimeOpen] = React.useState(false)
  const [endTimeOpen, setEndTimeOpen] = React.useState(false)
  const [registrationCalendarOpen, setRegistrationCalendarOpen] = React.useState(false)
  const startTimeRef = React.useRef<HTMLDivElement>(null)
  const endTimeRef = React.useRef<HTMLDivElement>(null)

  const generateHourOptions = () => {
    return [
      Array.from({ length: 6 }, (_, i) => (i + 7).toString().padStart(2, "0")),
      Array.from({ length: 6 }, (_, i) => (i + 13).toString().padStart(2, "0")),
      Array.from({ length: 6 }, (_, i) => ((i + 19) % 24).toString().padStart(2, "0")),
    ]
  }

  const generateMinuteOptions = () => {
    return ["00", "15", "30", "45"]
  }

  const handleTimeChange = (type: "start" | "end", hour: string, minute: string) => {
    const newTime = `${hour}:${minute}`
    handleChange({ [type === "start" ? "startTime" : "endTime"]: newTime })
    if (type === "start") {
      setStartTimeOpen(false)
    } else {
      setEndTimeOpen(false)
    }
  }

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (startTimeRef.current && !startTimeRef.current.contains(event.target as Node)) {
        setStartTimeOpen(false)
      }
      if (endTimeRef.current && !endTimeRef.current.contains(event.target as Node)) {
        setEndTimeOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <Card className="bg-[#2A3142] border-white/5 shadow-none rounded-lg overflow-hidden">
      <CardContent className="space-y-6">
        {/* Event Date */}
        <div className="space-y-2">
          <Label htmlFor="eventDate" className="text-white font-semibold">
            Event Date
          </Label>
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <div className="relative cursor-pointer" onClick={() => setCalendarOpen(true)}>
                <Input
                  id="eventDate"
                  value={eventDetails.eventDate ? format(eventDetails.eventDate, "dd/MM/yyyy") : ""}
                  readOnly
                  className={cn(
                    "bg-[#1A1E2E] border-white/10 text-white placeholder:text-white/40 pl-3 cursor-pointer rounded-md h-[40px] px-3 py-2",
                    errors.eventDate && "border-[#FF2B2B] border-2",
                  )}
                />
                <CalendarIcon
                  className={cn(
                    "absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 pointer-events-none",
                    errors.eventDate ? "text-[#FF2B2B]" : "text-white/40",
                  )}
                />
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 border-white/10" align="start">
              <Calendar
                mode="single"
                selected={eventDetails.eventDate}
                onSelect={(date) => {
                  if (date) {
                    handleChange({ eventDate: date })
                    setCalendarOpen(false)
                  }
                }}
                disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
                initialFocus
                className="rounded-md border-0 bg-[#1A1E2E]"
                weekStartsOn={1}
                classNames={{
                  months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                  month: "space-y-4",
                  caption: "flex justify-center pt-1 relative items-center text-white",
                  caption_label: "text-sm font-medium",
                  nav: "space-x-1 flex items-center",
                  nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 text-white",
                  nav_button_previous: "absolute left-1",
                  nav_button_next: "absolute right-1",
                  table: "w-full border-collapse space-y-1",
                  head_row: "flex",
                  head_cell: "text-white/60 rounded-md w-9 font-normal text-[0.8rem]",
                  row: "flex w-full mt-2",
                  cell: cn(
                    "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
                    "[&:has([aria-selected])]:bg-[#FF6B2C]",
                    "[&:has([aria-selected][data-outside])]:bg-[#FF6B2C]/30",
                  ),
                  day: "h-9 w-9 p-0 font-normal text-white aria-selected:opacity-100 hover:bg-white/10",
                  day_today: "bg-transparent border border-[#2A3142] text-white/40",
                  day_selected: cn(
                    "bg-[#FF6B2C] text-white hover:bg-[#FF6B2C] hover:text-white focus:bg-[#FF6B2C] focus:text-white",
                    "[&[data-outside]]:bg-[#FF6B2C]/30 [&[data-outside]]:text-white/70",
                  ),
                  day_outside:
                    "text-white/20 opacity-50 hover:bg-transparent cursor-not-allowed data-[selected]:bg-[#FF6B2C]/30",
                  day_disabled: "text-white/40 opacity-50",
                  day_hidden: "invisible",
                }}
                components={{
                  IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
                  IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
                }}
              />
            </PopoverContent>
          </Popover>
          {errors.eventDate && (
            <div className="flex items-center gap-2 mt-4" role="alert">
              <AlertCircle className="h-5 w-5 text-[#FF2B2B] flex-shrink-0" />
              <p className="text-white text-sm font-[system-ui]">{errors.eventDate}</p>
            </div>
          )}
        </div>

        {/* Registration Period */}
        <div className="space-y-2 relative z-0">
          <Label htmlFor="registrationTime" className="text-white font-semibold">
            Registration Period
          </Label>
          <Popover open={registrationCalendarOpen} onOpenChange={setRegistrationCalendarOpen}>
            <PopoverTrigger asChild>
              <div className="relative cursor-pointer">
                <Input
                  id="registrationTime"
                  value={
                    eventDetails.registrationStart
                      ? `${format(eventDetails.registrationStart, "dd/MM/yyyy")}${eventDetails.registrationEnd ? ` to ${format(eventDetails.registrationEnd, "dd/MM/yyyy")}` : " to..."}`
                      : ""
                  }
                  readOnly
                  className={cn(
                    "bg-[#1A1E2E] border-white/10 text-white placeholder:text-white/40 pl-3 cursor-pointer rounded-md h-[40px] px-3 py-2",
                    errors.registrationTime && "border-[#FF2B2B] border-2",
                  )}
                  placeholder="Select registration start and end dates"
                />
                <CalendarIcon
                  className={cn(
                    "absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 pointer-events-none",
                    errors.registrationTime ? "text-[#FF2B2B]" : "text-white/40",
                  )}
                />
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 border-white/10" align="start">
              <Calendar
                mode="range"
                selected={{
                  from: eventDetails.registrationStart,
                  to: eventDetails.registrationEnd,
                }}
                onSelect={(range) => {
                  handleChange({
                    registrationStart: range?.from,
                    registrationEnd: range?.to,
                  })
                  if (range?.from && range?.to) {
                    setRegistrationCalendarOpen(false)
                  }
                }}
                disabled={(date) => {
                  const tomorrow = new Date()
                  tomorrow.setDate(tomorrow.getDate() + 1)
                  tomorrow.setHours(0, 0, 0, 0)
                  return date < tomorrow
                }}
                numberOfMonths={2}
                defaultMonth={eventDetails.registrationStart || new Date()}
                initialFocus
                className="rounded-md border-0 bg-[#1A1E2E]"
                weekStartsOn={1}
                classNames={{
                  months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                  month: "space-y-4",
                  caption: "flex justify-center pt-1 relative items-center text-white",
                  caption_label: "text-sm font-medium",
                  nav: "space-x-1 flex items-center",
                  nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 text-white",
                  nav_button_previous: "absolute left-1",
                  nav_button_next: "absolute right-1",
                  table: "w-full border-collapse space-y-1",
                  head_row: "flex",
                  head_cell: "text-white/60 rounded-md w-9 font-normal text-[0.8rem]",
                  row: "flex w-full mt-2",
                  cell: cn(
                    "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
                    "[&:has([aria-selected])]:bg-[#FF6B2C]",
                    "[&:has([aria-selected][data-outside])]:bg-[#FF6B2C]/30",
                  ),
                  day: "h-9 w-9 p-0 font-normal text-white aria-selected:opacity-100 hover:bg-white/10 disabled:hover:bg-transparent",
                  day_today: "bg-transparent border border-[#2A3142] text-white/40",
                  day_selected: cn(
                    "bg-[#FF6B2C] text-white hover:bg-[#FF6B2C] hover:text-white focus:bg-[#FF6B2C] focus:text-white",
                    "[&[data-outside]]:bg-[#FF6B2C]/30 [&[data-outside]]:text-white/70",
                  ),
                  day_outside:
                    "text-white/20 opacity-50 hover:bg-transparent cursor-not-allowed data-[selected]:bg-[#FF6B2C]/30",
                  day_disabled: "text-white/40 opacity-50 hover:bg-transparent",
                  day_range_middle: cn(
                    "aria-selected:bg-[#CC4400] aria-selected:text-white",
                    "disabled:bg-transparent disabled:aria-selected:bg-transparent disabled:aria-selected:text-white/40",
                    "[&[data-outside]]:bg-[#FF6B2C]/20 [&[data-outside]]:text-white/50",
                  ),
                  day_hidden: "invisible",
                }}
                components={{
                  IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
                  IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
                }}
              />
            </PopoverContent>
          </Popover>
          {errors.registrationTime && (
            <div className="flex items-center gap-2 mt-4" role="alert">
              <AlertCircle className="h-5 w-5 text-[#FF2B2B] flex-shrink-0" />
              <p className="text-white text-sm font-[system-ui]">{errors.registrationTime}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}


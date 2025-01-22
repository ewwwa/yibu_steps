import React from "react"
import type { EventDetails, EventFormErrors } from "@/types/event"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { CalendarIcon, ChevronLeft, ChevronRight, Clock } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format, addDays, isBefore, isAfter, parse } from "date-fns"
import { cn } from "@/lib/utils"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"

interface EventDetailsStepProps {
  eventDetails: Partial<EventDetails>
  errors: EventFormErrors
  handleChange: (changes: Partial<EventDetails>) => void
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
  form?: any
}

export function EventDetailsStep({
  eventDetails,
  errors,
  handleChange,
  handleImageUpload,
  form,
}: EventDetailsStepProps) {
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

  if (!form) {
    return (
      <>
        <Card className="bg-[#2A3142] border-white/5 shadow-none rounded-lg overflow-visible">
          <CardHeader>
            <CardTitle className="text-white font-bold">Event Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="eventName" className="text-white font-semibold">
                Name
              </Label>
              <Input
                id="eventName"
                placeholder="E.g., Annual Conference 2025"
                className="bg-[#1A1E2E] border-white/10 text-white placeholder:text-white/40 rounded-md"
                value={eventDetails.eventName}
                onChange={(e) => handleChange({ eventName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description" className="text-white font-semibold">
                Description
              </Label>
              <Textarea
                id="description"
                value={eventDetails.description}
                onChange={(e) => handleChange({ description: e.target.value })}
                className="bg-[#1A1E2E] border-white/10 text-white placeholder:text-white/40 min-h-[100px] rounded-lg"
                placeholder="E.g., A detailed overview of the event's purpose and activities."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="eventDate" className="text-white font-semibold">
                Date
              </Label>
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <div className="relative cursor-pointer" onClick={() => setCalendarOpen(true)}>
                    <Input
                      id="eventDate"
                      value={eventDetails.eventDate ? format(eventDetails.eventDate, "dd/MM/yy") : ""}
                      readOnly
                      className="bg-[#1A1E2E] border-white/10 text-white placeholder:text-white/40 pl-3 cursor-pointer rounded-md"
                    />
                    <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 h-5 w-5 pointer-events-none" />
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
                    disabled={(date) => date <= new Date() || date < new Date("1900-01-01")}
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
                      IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
                      IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
                    }}
                  />
                </PopoverContent>
              </Popover>
              {errors.eventDate && <p className="text-red-500 text-sm mt-1">{errors.eventDate}</p>}
            </div>
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime" className="text-white font-semibold">
                    Start Time
                  </Label>
                  <div className="relative" ref={startTimeRef}>
                    <Input
                      id="startTime"
                      value={eventDetails.startTime}
                      readOnly
                      className="bg-[#1A1E2E] border-white/10 text-white placeholder:text-white/40 cursor-pointer rounded-md"
                      onClick={() => setStartTimeOpen(!startTimeOpen)}
                      placeholder="E.g., 10:00"
                    />
                    <Clock className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 h-5 w-5 pointer-events-none" />
                    {startTimeOpen && (
                      <div className="absolute z-10 top-full mt-1 w-[320px] bg-[#1A1E2E] border border-white/10 rounded-md p-2">
                        <div className="grid grid-cols-4 gap-2">
                          <div className="col-span-3">
                            <div className="text-white font-semibold mb-2">Hours</div>
                            <div className="grid grid-cols-3 gap-1">
                              {generateHourOptions().map((column, colIndex) => (
                                <div key={colIndex} className="flex flex-col">
                                  {column.map((hour) => (
                                    <button
                                      key={hour}
                                      className={cn(
                                        "px-2 py-1 text-white hover:bg-white/10 rounded",
                                        eventDetails.startTime?.startsWith(hour) && "bg-[#FF6B2C]",
                                      )}
                                      onClick={() =>
                                        handleTimeChange("start", hour, eventDetails.startTime?.split(":")[1] || "00")
                                      }
                                    >
                                      {hour}
                                    </button>
                                  ))}
                                </div>
                              ))}
                            </div>
                          </div>
                          <div>
                            <div className="text-white font-semibold mb-2">Minutes</div>
                            <div className="flex flex-col">
                              {generateMinuteOptions().map((minute) => (
                                <button
                                  key={minute}
                                  className={cn(
                                    "px-2 py-1 text-white hover:bg-white/10 rounded",
                                    eventDetails.startTime?.endsWith(minute) && "bg-[#FF6B2C]",
                                  )}
                                  onClick={() =>
                                    handleTimeChange("start", eventDetails.startTime?.split(":")[0] || "00", minute)
                                  }
                                >
                                  {minute}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime" className="text-white font-semibold">
                    End Time
                  </Label>
                  <div className="relative" ref={endTimeRef}>
                    <Input
                      id="endTime"
                      value={eventDetails.endTime}
                      readOnly
                      className="bg-[#1A1E2E] border-white/10 text-white placeholder:text-white/40 cursor-pointer rounded-md"
                      onClick={() => setEndTimeOpen(!endTimeOpen)}
                      placeholder="E.g., 4:00"
                    />
                    <Clock className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 h-5 w-5 pointer-events-none" />
                    {endTimeOpen && (
                      <div className="absolute z-[100] top-full mt-1 w-[320px] bg-[#1A1E2E] border border-white/10 rounded-md p-2">
                        <div className="grid grid-cols-4 gap-2">
                          <div className="col-span-3">
                            <div className="text-white font-semibold mb-2">Hours</div>
                            <div className="grid grid-cols-3 gap-1">
                              {generateHourOptions().map((column, colIndex) => (
                                <div key={colIndex} className="flex flex-col">
                                  {column.map((hour) => (
                                    <button
                                      key={hour}
                                      className={cn(
                                        "px-2 py-1 text-white hover:bg-white/10 rounded",
                                        eventDetails.endTime?.startsWith(hour) && "bg-[#FF6B2C]",
                                      )}
                                      onClick={() =>
                                        handleTimeChange("end", hour, eventDetails.endTime?.split(":")[1] || "00")
                                      }
                                    >
                                      {hour}
                                    </button>
                                  ))}
                                </div>
                              ))}
                            </div>
                          </div>
                          <div>
                            <div className="text-white font-semibold mb-2">Minutes</div>
                            <div className="flex flex-col">
                              {generateMinuteOptions().map((minute) => (
                                <button
                                  key={minute}
                                  className={cn(
                                    "px-2 py-1 text-white hover:bg-white/10 rounded",
                                    eventDetails.endTime?.endsWith(minute) && "bg-[#FF6B2C]",
                                  )}
                                  onClick={() =>
                                    handleTimeChange("end", eventDetails.endTime?.split(":")[0] || "00", minute)
                                  }
                                >
                                  {minute}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {errors.endTime && <p className="text-red-500 text-sm mt-1">{errors.endTime}</p>}
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
                          ? `${format(eventDetails.registrationStart, "dd/MM/yy")}${eventDetails.registrationEnd ? ` to ${format(eventDetails.registrationEnd, "dd/MM/yy")}` : " to..."}`
                          : ""
                      }
                      readOnly
                      className="bg-[#1A1E2E] border-white/10 text-white placeholder:text-white/40 pl-3 cursor-pointer rounded-md"
                      placeholder="Select registration start and end dates"
                    />
                    <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 h-5 w-5 pointer-events-none" />
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
                      cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-[#FF6B2C]",
                      day: "h-9 w-9 p-0 font-normal text-white aria-selected:opacity-100 hover:bg-white/10",
                      day_today: "bg-transparent border border-[#2A3142]",
                      day_selected:
                        "bg-[#FF6B2C] text-white hover:bg-[#FF6B2C] hover:text-white focus:bg-[#FF6B2C] focus:text-white",
                      day_outside: "text-white/40 opacity-50",
                      day_disabled: "text-white/40 opacity-50",
                      day_range_middle: "aria-selected:bg-[#CC4400] aria-selected:text-white",
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
                <p className="text-red-500 text-sm mt-1 relative z-30">{errors.registrationTime}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="location" className="text-white font-semibold">
                Location
              </Label>
              <Input
                id="location"
                value={eventDetails.location}
                onChange={(e) => handleChange({ location: e.target.value })}
                className="bg-[#1A1E2E] border-white/10 text-white placeholder:text-white/40 rounded-md"
                placeholder="E.g., Broekwegkade 13A, 2725 BX"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#2A3142] border-white/5 shadow-none rounded-lg overflow-visible mt-6">
          <CardHeader>
            <CardTitle className="text-white font-bold">Background Image</CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              className="w-full bg-[#1A1E2E] border-white/10 text-white hover:bg-[#2A3142] rounded-md"
              onClick={() => document.getElementById("backgroundImage")?.click()}
            >
              Upload Image
            </Button>
            <Input
              type="file"
              id="backgroundImage"
              accept="image/*"
              className="hidden rounded-md"
              onChange={handleImageUpload}
            />
          </CardContent>
        </Card>
      </>
    )
  }

  return (
    <>
      <Card className="bg-[#2A3142] border-white/5 shadow-none rounded-lg overflow-visible">
        <CardHeader>
          <CardTitle className="text-white font-bold">Event Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={form.control}
            name="eventName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white font-semibold">Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="E.g., Annual Conference 2025"
                    className="bg-[#1A1E2E] border-white/10 text-white placeholder:text-white/40 rounded-md"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="space-y-2">
            <Label htmlFor="description" className="text-white font-semibold">
              Description
            </Label>
            <Textarea
              id="description"
              value={eventDetails.description}
              onChange={(e) => handleChange({ description: e.target.value })}
              className="bg-[#1A1E2E] border-white/10 text-white placeholder:text-white/40 min-h-[100px] rounded-lg"
              placeholder="E.g., A detailed overview of the event's purpose and activities."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="eventDate" className="text-white font-semibold">
              Date
            </Label>
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <div className="relative cursor-pointer" onClick={() => setCalendarOpen(true)}>
                  <Input
                    id="eventDate"
                    value={eventDetails.eventDate ? format(eventDetails.eventDate, "dd/MM/yy") : ""}
                    readOnly
                    className="bg-[#1A1E2E] border-white/10 text-white placeholder:text-white/40 pl-3 cursor-pointer rounded-md"
                  />
                  <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 h-5 w-5 pointer-events-none" />
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
                  disabled={(date) => date <= new Date() || date < new Date("1900-01-01")}
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
                    IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
                    IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
                  }}
                />
              </PopoverContent>
            </Popover>
            {errors.eventDate && <p className="text-red-500 text-sm mt-1">{errors.eventDate}</p>}
          </div>
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime" className="text-white font-semibold">
                  Start Time
                </Label>
                <div className="relative" ref={startTimeRef}>
                  <Input
                    id="startTime"
                    value={eventDetails.startTime}
                    readOnly
                    className="bg-[#1A1E2E] border-white/10 text-white placeholder:text-white/40 cursor-pointer rounded-md"
                    onClick={() => setStartTimeOpen(!startTimeOpen)}
                    placeholder="E.g., 10:00"
                  />
                  <Clock className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 h-5 w-5 pointer-events-none" />
                  {startTimeOpen && (
                    <div className="absolute z-10 top-full mt-1 w-[320px] bg-[#1A1E2E] border border-white/10 rounded-md p-2">
                      <div className="grid grid-cols-4 gap-2">
                        <div className="col-span-3">
                          <div className="text-white font-semibold mb-2">Hours</div>
                          <div className="grid grid-cols-3 gap-1">
                            {generateHourOptions().map((column, colIndex) => (
                              <div key={colIndex} className="flex flex-col">
                                {column.map((hour) => (
                                  <button
                                    key={hour}
                                    className={cn(
                                      "px-2 py-1 text-white hover:bg-white/10 rounded",
                                      eventDetails.startTime?.startsWith(hour) && "bg-[#FF6B2C]",
                                    )}
                                    onClick={() =>
                                      handleTimeChange("start", hour, eventDetails.startTime?.split(":")[1] || "00")
                                    }
                                  >
                                    {hour}
                                  </button>
                                ))}
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <div className="text-white font-semibold mb-2">Minutes</div>
                          <div className="flex flex-col">
                            {generateMinuteOptions().map((minute) => (
                              <button
                                key={minute}
                                className={cn(
                                  "px-2 py-1 text-white hover:bg-white/10 rounded",
                                  eventDetails.startTime?.endsWith(minute) && "bg-[#FF6B2C]",
                                )}
                                onClick={() =>
                                  handleTimeChange("start", eventDetails.startTime?.split(":")[0] || "00", minute)
                                }
                              >
                                {minute}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime" className="text-white font-semibold">
                  End Time
                </Label>
                <div className="relative" ref={endTimeRef}>
                  <Input
                    id="endTime"
                    value={eventDetails.endTime}
                    readOnly
                    className="bg-[#1A1E2E] border-white/10 text-white placeholder:text-white/40 cursor-pointer rounded-md"
                    onClick={() => setEndTimeOpen(!endTimeOpen)}
                    placeholder="E.g., 4:00"
                  />
                  <Clock className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 h-5 w-5 pointer-events-none" />
                  {endTimeOpen && (
                    <div className="absolute z-[100] top-full mt-1 w-[320px] bg-[#1A1E2E] border border-white/10 rounded-md p-2">
                      <div className="grid grid-cols-4 gap-2">
                        <div className="col-span-3">
                          <div className="text-white font-semibold mb-2">Hours</div>
                          <div className="grid grid-cols-3 gap-1">
                            {generateHourOptions().map((column, colIndex) => (
                              <div key={colIndex} className="flex flex-col">
                                {column.map((hour) => (
                                  <button
                                    key={hour}
                                    className={cn(
                                      "px-2 py-1 text-white hover:bg-white/10 rounded",
                                      eventDetails.endTime?.startsWith(hour) && "bg-[#FF6B2C]",
                                    )}
                                    onClick={() =>
                                      handleTimeChange("end", hour, eventDetails.endTime?.split(":")[1] || "00")
                                    }
                                  >
                                    {hour}
                                  </button>
                                ))}
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <div className="text-white font-semibold mb-2">Minutes</div>
                          <div className="flex flex-col">
                            {generateMinuteOptions().map((minute) => (
                              <button
                                key={minute}
                                className={cn(
                                  "px-2 py-1 text-white hover:bg-white/10 rounded",
                                  eventDetails.endTime?.endsWith(minute) && "bg-[#FF6B2C]",
                                )}
                                onClick={() =>
                                  handleTimeChange("end", eventDetails.endTime?.split(":")[0] || "00", minute)
                                }
                              >
                                {minute}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          {errors.endTime && <p className="text-red-500 text-sm mt-1">{errors.endTime}</p>}
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
                        ? `${format(eventDetails.registrationStart, "dd/MM/yy")}${eventDetails.registrationEnd ? ` to ${format(eventDetails.registrationEnd, "dd/MM/yy")}` : " to..."}`
                        : ""
                    }
                    readOnly
                    className="bg-[#1A1E2E] border-white/10 text-white placeholder:text-white/40 pl-3 cursor-pointer rounded-md"
                    placeholder="Select registration start and end dates"
                  />
                  <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 h-5 w-5 pointer-events-none" />
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
                    cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-[#FF6B2C]",
                    day: "h-9 w-9 p-0 font-normal text-white aria-selected:opacity-100 hover:bg-white/10",
                    day_today: "bg-transparent border border-[#2A3142]",
                    day_selected:
                      "bg-[#FF6B2C] text-white hover:bg-[#FF6B2C] hover:text-white focus:bg-[#FF6B2C] focus:text-white",
                    day_outside: "text-white/40 opacity-50",
                    day_disabled: "text-white/40 opacity-50",
                    day_range_middle: "aria-selected:bg-[#CC4400] aria-selected:text-white",
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
              <p className="text-red-500 text-sm mt-1 relative z-30">{errors.registrationTime}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="location" className="text-white font-semibold">
              Location
            </Label>
            <Input
              id="location"
              value={eventDetails.location}
              onChange={(e) => handleChange({ location: e.target.value })}
              className="bg-[#1A1E2E] border-white/10 text-white placeholder:text-white/40 rounded-md"
              placeholder="E.g., Broekwegkade 13A, 2725 BX"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[#2A3142] border-white/5 shadow-none rounded-lg overflow-visible mt-6">
        <CardHeader>
          <CardTitle className="text-white font-bold">Background Image</CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            className="w-full bg-[#1A1E2E] border-white/10 text-white hover:bg-[#2A3142] rounded-md"
            onClick={() => document.getElementById("backgroundImage")?.click()}
          >
            Upload Image
          </Button>
          <Input
            type="file"
            id="backgroundImage"
            accept="image/*"
            className="hidden rounded-md"
            onChange={handleImageUpload}
          />
        </CardContent>
      </Card>
    </>
  )
}


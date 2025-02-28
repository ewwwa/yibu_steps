"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import type { EventDetails } from "@/types/event"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { EventPreview } from "./event-preview"
import type { Area } from "react-easy-crop/types"

const eventDetailsSchema = z.object({
  eventName: z.string().min(1, "Event name is required"),
  description: z.string().min(1, "Description is required"),
  eventDate: z.date({
    required_error: "Event date is required",
  }),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  registrationStart: z.string().min(1, "Registration start date is required"),
  registrationEnd: z.string().min(1, "Registration end date is required"),
  location: z.string().min(1, "Location is required"),
  maxInvitations: z.number().min(1, "Maximum invitations is required"),
  backgroundImage: z.string().min(1, "Background image is required"),
})

interface EventDetailsFormProps {
  onSubmit: (data: EventDetails) => void
  onChange: (data: Partial<EventDetails>) => void
}

export default function EventDetailsForm({ onSubmit, onChange }: EventDetailsFormProps) {
  const [isFormValid, setIsFormValid] = useState(false)
  const [selectedStartHour, setSelectedStartHour] = useState("07")
  const [selectedStartMinute, setSelectedStartMinute] = useState("00")
  const [selectedEndHour, setSelectedEndHour] = useState("19")
  const [selectedEndMinute, setSelectedEndMinute] = useState("00")
  const [timeError, setTimeError] = useState<string | null>(null)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)

  const form = useForm<EventDetails>({
    resolver: zodResolver(eventDetailsSchema),
    defaultValues: {
      eventName: "",
      description: "",
      eventDate: new Date(new Date().setDate(new Date().getDate() + 1)), // Set to tomorrow
      startTime: "07:00",
      endTime: "19:00",
      registrationStart: "",
      registrationEnd: "",
      location: "",
      maxInvitations: 2500,
      backgroundImage: "",
    },
  })

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        form.setValue("backgroundImage", reader.result as string)
        onChange(form.getValues())
      }
      reader.readAsDataURL(file)
    }
  }

  useEffect(() => {
    const subscription = form.watch((value) => {
      onChange(value as Partial<EventDetails>)
      const isFormValid = Object.keys(eventDetailsSchema.shape).every((key) => value[key as keyof EventDetails])
      setIsFormValid(isFormValid)
    })
    return () => subscription.unsubscribe()
  }, [form, onChange])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const startTimePanel = document.getElementById("startTimePanel")
      const endTimePanel = document.getElementById("endTimePanel")
      const startTimeInput = document.getElementById("startTimeInput")
      const endTimeInput = document.getElementById("endTimeInput")

      if (
        startTimePanel &&
        !startTimePanel.contains(event.target as Node) &&
        startTimeInput &&
        !startTimeInput.contains(event.target as Node)
      ) {
        startTimePanel.classList.add("hidden")
      }
      if (
        endTimePanel &&
        !endTimePanel.contains(event.target as Node) &&
        endTimeInput &&
        !endTimeInput.contains(event.target as Node)
      ) {
        endTimePanel.classList.add("hidden")
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const generateHourOptions = () => {
    return [
      Array.from({ length: 6 }, (_, i) => (i + 7).toString().padStart(2, "0")),
      Array.from({ length: 6 }, (_, i) => (i + 13).toString().padStart(2, "0")),
      Array.from({ length: 6 }, (_, i) => ((i + 19) % 24).toString().padStart(2, "0")),
    ]
  }

  const generateMinuteOptions = () => {
    return [0, 15, 30, 45].map((minute) => ({
      value: minute.toString().padStart(2, "0"),
      label: minute.toString().padStart(2, "0"),
    }))
  }

  const validateTimes = (start: string, end: string) => {
    const [startHour, startMinute] = start.split(":").map(Number)
    const [endHour, endMinute] = end.split(":").map(Number)

    const startTimeInMinutes = startHour * 60 + startMinute
    const endTimeInMinutes = endHour * 60 + endMinute

    // Check if end time is at least 15 minutes later than start time
    if (endTimeInMinutes <= startTimeInMinutes + 14) {
      setTimeError("End time must be at least 15 minutes later than start time")
      return false
    }

    setTimeError(null)
    return true
  }

  const handleStartTimeChange = (newTime: string) => {
    const [newHour, newMinute] = newTime.split(":").map(Number)
    const currentEndTime = `${selectedEndHour}:${selectedEndMinute}`

    // If the new start time makes the current end time invalid
    if (!validateTimes(newTime, currentEndTime)) {
      // Set end time to start time + 15 minutes
      const newEndTimeInMinutes = newHour * 60 + newMinute + 15
      const newEndHour = Math.floor(newEndTimeInMinutes / 60) % 24
      const newEndMinute = newEndTimeInMinutes % 60

      setSelectedEndHour(newEndHour.toString().padStart(2, "0"))
      setSelectedEndMinute(newEndMinute.toString().padStart(2, "0"))
      form.setValue("endTime", `${newEndHour.toString().padStart(2, "0")}:${newEndMinute.toString().padStart(2, "0")}`)
    }
  }

  const handleStartHourClick = (hour: string) => {
    const newStartTime = `${hour}:${selectedStartMinute}`
    setSelectedStartHour(hour)
    form.setValue("startTime", newStartTime)
    handleStartTimeChange(newStartTime)
  }

  const handleStartMinuteClick = (minute: string) => {
    const newStartTime = `${selectedStartHour}:${minute}`
    setSelectedStartMinute(minute)
    form.setValue("startTime", newStartTime)
    handleStartTimeChange(newStartTime)
  }

  const handleEndHourClick = (hour: string) => {
    const newEndTime = `${hour}:${selectedEndMinute}`
    if (!validateTimes(`${selectedStartHour}:${selectedStartMinute}`, newEndTime)) {
      return // Don't update if it would create an invalid state
    }
    setSelectedEndHour(hour)
    form.setValue("endTime", newEndTime)
  }

  const handleEndMinuteClick = (minute: string) => {
    const newEndTime = `${selectedEndHour}:${minute}`
    if (!validateTimes(`${selectedStartHour}:${selectedStartMinute}`, newEndTime)) {
      return // Don't update if it would create an invalid state
    }
    setSelectedEndMinute(minute)
    form.setValue("endTime", newEndTime)
  }

  const handleSubmit = (data: EventDetails) => {
    if (isFormValid && validateTimes(data.startTime, data.endTime)) {
      onSubmit(data)
    }
  }

  const handleCropComplete = (croppedArea: Area) => {
    setCroppedAreaPixels(croppedArea)
  }

  return (
    <div className="grid grid-cols-2 gap-8">
      <Card className="bg-[#2A3142] rounded-lg shadow-none">
        <CardContent className="pt-6 pb-6 px-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              {/* Event Details Card */}
              <Card className="bg-[#2A3142] border border-white/5 mb-6 shadow-none rounded-lg">
                <CardHeader>
                  <CardTitle className="text-white font-bold">Event Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="eventName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white font-semibold">Event Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter event name"
                            className="bg-[#1A1E2E] border-white/10 text-white placeholder:text-white/40"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white font-semibold">Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter event description"
                            className="min-h-[100px] bg-[#1A1E2E] border-white/10 text-white placeholder:text-white/40"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Date and Time Card */}
              <Card className="bg-[#2A3142] border border-white/5 mb-6 shadow-none rounded-lg">
                <CardHeader>
                  <CardTitle className="text-white font-bold">Date and Time</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="eventDate"
                      render={({ field }) => (
                        <FormItem className="w-1/2">
                          <FormLabel className="text-white font-semibold">Event Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full pl-3 text-left font-normal bg-[#1A1E2E] border-white/10 text-white hover:bg-[#1A1E2E] hover:text-white h-10",
                                    !field.value && "text-white/40",
                                  )}
                                >
                                  {field.value ? format(field.value, "dd/MM/yy") : <span>Pick a date</span>}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={(date) => {
                                  field.onChange(date)
                                  const popoverTrigger = document.querySelector('[data-state="open"]')
                                  if (popoverTrigger) {
                                    ;(popoverTrigger as HTMLElement).click()
                                  }
                                }}
                                disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
                                initialFocus
                                className="rounded-md border-0 bg-[#1A1E2E]"
                                classNames={{
                                  months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                                  month: "space-y-4",
                                  caption: "flex justify-center pt-1 relative items-center",
                                  caption_label: "text-sm font-medium text-white",
                                  nav: "space-x-1 flex items-center",
                                  nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
                                  nav_button_previous: "absolute left-1",
                                  nav_button_next: "absolute right-1",
                                  table: "w-full border-collapse space-y-1",
                                  head_row: "flex",
                                  head_cell:
                                    "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem] text-white",
                                  row: "flex w-full mt-2",
                                  cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                                  day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 text-white",
                                  day_selected:
                                    "bg-[#FF6B2C] text-white hover:bg-[#FF6B2C] hover:text-white focus:bg-[#FF6B2C] focus:text-white",
                                  day_today: "bg-accent text-accent-foreground",
                                  day_outside: "text-muted-foreground opacity-50",
                                  day_disabled: "text-muted-foreground opacity-50",
                                  day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                                  day_hidden: "invisible",
                                }}
                                components={{
                                  IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4 text-white" />,
                                  IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4 text-white" />,
                                }}
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="startTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white font-semibold">Start Time</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  id="startTimeInput"
                                  type="text"
                                  placeholder="Select start time"
                                  className="bg-[#1A1E2E] border-white/10 text-white placeholder:text-white/40"
                                  value={`${selectedStartHour}:${selectedStartMinute}`}
                                  onClick={(e) => {
                                    e.preventDefault()
                                    document.getElementById("startTimePanel")?.classList.remove("hidden")
                                  }}
                                  onChange={(value) => {
                                    field.onChange(value)
                                    handleStartTimeChange(value)
                                  }}
                                  readOnly
                                />
                                <div
                                  id="startTimePanel"
                                  className="absolute top-full left-0 mt-1 bg-[#1A1E2E] border border-white/10 rounded-md p-4 hidden z-50 min-w-[320px]"
                                >
                                  <div className="flex flex-col">
                                    <div className="flex mb-2">
                                      <div className="flex-grow text-center text-white font-semibold">Hours</div>
                                      <div className="w-16 text-center text-white font-semibold">Minutes</div>
                                    </div>
                                    <div className="flex">
                                      <div className="grid grid-cols-3 gap-2 pr-4 border-r border-white/10 w-[216px]">
                                        {generateHourOptions().map((column, colIndex) => (
                                          <div key={`column-${colIndex}`} className="flex flex-col gap-2">
                                            {column.map((hour) => (
                                              <button
                                                key={`start-hour-${hour}`}
                                                className={cn(
                                                  "w-12 h-8 text-center text-white hover:bg-white/10 rounded",
                                                  selectedStartHour === hour && "bg-[#FF6B2C] text-white",
                                                )}
                                                onClick={(e) => {
                                                  e.preventDefault()
                                                  handleStartHourClick(hour)
                                                }}
                                              >
                                                {hour}
                                              </button>
                                            ))}
                                          </div>
                                        ))}
                                      </div>
                                      <div className="pl-4">
                                        {generateMinuteOptions().map((minute) => (
                                          <button
                                            key={`start-minute-${minute.value}`}
                                            className={cn(
                                              "w-12 h-8 text-center text-white hover:bg-white/10 rounded block mb-2",
                                              selectedStartMinute === minute.value && "bg-[#FF6B2C] text-white",
                                            )}
                                            onClick={(e) => {
                                              e.preventDefault()
                                              handleStartMinuteClick(minute.value)
                                            }}
                                          >
                                            {minute.label}
                                          </button>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="endTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white font-semibold">End Time</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  id="endTimeInput"
                                  type="text"
                                  placeholder="Select end time"
                                  className={cn(
                                    "bg-[#1A1E2E] border-white/10 text-white placeholder:text-white/40",
                                    timeError && "border-[#FF6B2C] focus-visible:ring-[#FF6B2C]",
                                  )}
                                  value={`${selectedEndHour}:${selectedEndMinute}`}
                                  onClick={(e) => {
                                    e.preventDefault()
                                    document.getElementById("endTimePanel")?.classList.remove("hidden")
                                  }}
                                  onChange={(value) => {
                                    field.onChange(value)
                                    validateTimes(form.getValues().startTime, value)
                                  }}
                                  readOnly
                                />
                                <div
                                  id="endTimePanel"
                                  className="absolute top-full left-0 mt-1 bg-[#1A1E2E] border border-white/10 rounded-md p-4 hidden z-50 min-w-[320px]"
                                >
                                  <div className="flex flex-col">
                                    <div className="flex mb-2">
                                      <div className="flex-grow text-center text-white font-semibold">Hours</div>
                                      <div className="w-16 text-center text-white font-semibold">Minutes</div>
                                    </div>
                                    <div className="flex">
                                      <div className="grid grid-cols-3 gap-2 pr-4 border-r border-white/10 w-[216px]">
                                        {generateHourOptions().map((column, colIndex) => (
                                          <div key={`column-${colIndex}`} className="flex flex-col gap-2">
                                            {column.map((hour) => (
                                              <button
                                                key={`end-hour-${hour}`}
                                                className={cn(
                                                  "w-12 h-8 text-center text-white hover:bg-white/10 rounded",
                                                  selectedEndHour === hour && "bg-[#FF6B2C] text-white",
                                                )}
                                                onClick={(e) => {
                                                  e.preventDefault()
                                                  handleEndHourClick(hour)
                                                }}
                                              >
                                                {hour}
                                              </button>
                                            ))}
                                          </div>
                                        ))}
                                      </div>
                                      <div className="pl-4">
                                        {generateMinuteOptions().map((minute) => (
                                          <button
                                            key={`end-minute-${minute.value}`}
                                            className={cn(
                                              "w-12 h-8 text-center text-white hover:bg-white/10 rounded block mb-2",
                                              selectedEndMinute === minute.value && "bg-[#FF6B2C] text-white",
                                            )}
                                            onClick={(e) => {
                                              e.preventDefault()
                                              handleEndMinuteClick(minute.value)
                                            }}
                                          >
                                            {minute.label}
                                          </button>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    {timeError && <p className="text-[#FF6B2C] text-sm">{timeError}</p>}
                  </div>
                </CardContent>
              </Card>

              {/* Location and Capacity Card */}
              <Card className="bg-[#2A3142] border border-white/5 mb-6 shadow-none rounded-lg">
                <CardHeader>
                  <CardTitle className="text-white font-bold">Location and Capacity</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white font-semibold">Location</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter event location"
                            className="bg-[#1A1E2E] border-white/10 text-white placeholder:text-white/40"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="maxInvitations"
                    render={({ field: { onChange, ...field } }) => (
                      <FormItem>
                        <FormLabel className="text-white font-semibold">Maximum Invitations</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            className="bg-[#1A1E2E] border-white/10 text-white"
                            onChange={(e) => onChange(Number.parseInt(e.target.value))}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Background Image Card */}
              <Card className="bg-[#2A3142] border border-white/5 mb-6 shadow-none rounded-lg">
                <CardHeader>
                  <CardTitle className="text-white font-bold">Background Image</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="backgroundImage"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="space-y-4">
                            <div className="relative">
                              <Input
                                type="file"
                                accept="image/*"
                                onChange={handleFileUpload}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              />
                              <Button type="button" className="bg-[#1A1E2E] text-white hover:bg-[#2A3142]">
                                <Upload className="h-4 w-4 mr-2" />
                                Upload Image
                              </Button>
                            </div>
                            {field.value && (
                              <div className="mt-4">
                                <img src={field.value} alt="Background Preview" className="max-w-full h-auto rounded" />
                              </div>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Button
                type="submit"
                className="w-full bg-[#FF6B2C] hover:bg-[#FF8B3C] text-white rounded-lg"
                disabled={!form.formState.isValid}
              >
                Continue to Step 2
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <EventPreview event={form.getValues()} onCropComplete={handleCropComplete} />
    </div>
  )
}


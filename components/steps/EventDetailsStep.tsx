"use client"

import React, { useState } from "react"
import type { EventDetails, EventFormErrors } from "@/types/event"
import { Card, CardHeader, CardTitle, CollapsibleCardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Clock, Upload } from "lucide-react"
import { cn } from "@/lib/utils"
import { ColorPicker } from "@/components/ui/color-picker"
import { InputCalendar } from "@/components/ui/input-calendar"
import { DateRangeInput } from "@/components/ui/date-range-input"

interface EventDetailsStepProps {
  eventDetails: Partial<EventDetails>
  errors: EventFormErrors
  handleChange: (changes: Partial<EventDetails>) => void
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
  cardTitles: {
    eventDetails: string
    dateTime: string
    locationCapacity: string
    backgroundImage: string
  }
  setIsFormTouched: React.Dispatch<React.SetStateAction<boolean>>
  isValid: boolean
}

export function EventDetailsStep({
  eventDetails,
  errors,
  handleChange,
  handleImageUpload,
  cardTitles,
  setIsFormTouched,
  isValid,
}: EventDetailsStepProps) {
  const [startTimeOpen, setStartTimeOpen] = React.useState(false)
  const [endTimeOpen, setEndTimeOpen] = React.useState(false)
  const startTimeRef = React.useRef<HTMLDivElement>(null)
  const endTimeRef = React.useRef<HTMLDivElement>(null)

  const [openCards, setOpenCards] = useState({
    eventDetails: true,
    dateTime: true,
    locationCapacity: true,
    backgroundImage: true,
  })

  const [timeError, setTimeError] = useState<string | null>(null)
  const [lastModifiedTime, setLastModifiedTime] = useState<"start" | "end" | null>(null)

  const toggleCard = (cardName: keyof typeof openCards) => {
    setOpenCards((prev) => ({ ...prev, [cardName]: !prev[cardName] }))
  }

  const generateHourOptions = () => {
    return [
      Array.from({ length: 6 }, (_, i) => (i + 7).toString().padStart(2, "0")),
      Array.from({ length: 6 }, (_, i) => (i + 13).toString().padStart(2, "0")),
      Array.from({ length: 5 }, (_, i) => ((i + 19) % 24).toString().padStart(2, "0")),
    ]
  }

  const generateMinuteOptions = () => {
    return ["00", "15", "30", "45"]
  }

  const handleTimeChange = (type: "start" | "end", hour: string, minute: string) => {
    const newTime = `${hour}:${minute}`
    const updatedSession = { ...eventDetails, [type === "start" ? "startTime" : "endTime"]: newTime }
    handleChange(updatedSession)
    setIsFormTouched(true)
    setLastModifiedTime(type)
    validateTimes(updatedSession.startTime, updatedSession.endTime, type)
    if (type === "start") {
      setStartTimeOpen(false)
    } else {
      setEndTimeOpen(false)
    }
  }

  const validateTimes = (start: string, end: string, lastModified: "start" | "end") => {
    const [startHour, startMinute] = start.split(":").map(Number)
    const [endHour, endMinute] = end.split(":").map(Number)

    const startTimeInMinutes = startHour * 60 + startMinute
    const endTimeInMinutes = endHour * 60 + endMinute

    if (endTimeInMinutes <= startTimeInMinutes) {
      if (lastModified === "start") {
        setTimeError("Start time must be before end time.")
      } else {
        setTimeError("End time must be after start time.")
      }
    } else {
      setTimeError(null)
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

  const handleDateSelect = (date: Date | null) => {
    if (date instanceof Date && !isNaN(date.getTime())) {
      handleChange({ eventDate: date })
      setIsFormTouched(true)
    }
  }

  return (
    <>
      <div className="space-y-6">
        {/* Event Details Card */}
        <Card className="bg-[#2A3142] border-white/5 shadow-none rounded-lg overflow-hidden" collapsible>
          <CardHeader collapsible onToggle={() => toggleCard("eventDetails")} isOpen={openCards.eventDetails}>
            <CardTitle className="text-white font-bold">{cardTitles.eventDetails}</CardTitle>
          </CardHeader>
          <CollapsibleCardContent isOpen={openCards.eventDetails}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="eventName" className="text-white/70">
                  Name
                </Label>
                <Input
                  id="eventName"
                  placeholder="E.g., Annual Conference 2025"
                  className="bg-[#1A1E2E] border-white/10 text-white placeholder:text-white/40 rounded-md"
                  value={eventDetails.eventName}
                  onChange={(e) => {
                    handleChange({ eventName: e.target.value })
                    setIsFormTouched(true)
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-white/70">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={eventDetails.description}
                  onChange={(e) => {
                    handleChange({ description: e.target.value })
                    setIsFormTouched(true)
                  }}
                  className="bg-[#1A1E2E] border-white/10 text-white placeholder:text-white/40 min-h-[100px] rounded-lg"
                  placeholder="E.g., A detailed overview of the event's purpose and activities."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="helloDate" className="text-white/70">
                  Date
                </Label>
                <InputCalendar
                  id="helloDate"
                  selected={eventDetails.eventDate instanceof Date ? eventDetails.eventDate : undefined}
                  onSelect={handleDateSelect}
                />
                {errors.eventDate && <p className="text-red-500 text-sm mt-1">{errors.eventDate}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime" className="text-white/70">
                    Start Time
                  </Label>
                  <div className="relative" ref={startTimeRef}>
                    <Input
                      id="startTime"
                      value={eventDetails.startTime}
                      readOnly
                      className={cn(
                        "bg-[#1A1E2E] text-white placeholder:text-white/40 cursor-pointer rounded-md focus:border-white focus:ring-1 focus:ring-white pr-10 border-transparent",
                        lastModifiedTime === "start" && timeError && "border-[#FF2B2B] focus-visible:ring-[#FF2B2B]",
                      )}
                      onClick={() => setStartTimeOpen(!startTimeOpen)}
                      placeholder="E.g., 10:00"
                    />
                    <Clock
                      className={cn(
                        "absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 pointer-events-none",
                        lastModifiedTime === "start" && timeError ? "text-[#FF2B2B]" : "text-white/40",
                      )}
                      strokeWidth={1.5}
                    />
                    {startTimeOpen && (
                      <div
                        className="fixed w-[320px] bg-[#1A1E2E] border border-white/10 rounded-md p-4 mt-1"
                        style={{
                          zIndex: 9999,
                          position: "fixed",
                          left: startTimeRef.current?.getBoundingClientRect().left ?? 0,
                          bottom: window.innerHeight - (startTimeRef.current?.getBoundingClientRect().top ?? 0),
                        }}
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
                                        eventDetails.startTime?.startsWith(hour) && "bg-[#E65100]",
                                      )}
                                      onClick={(e) => {
                                        e.preventDefault()
                                        handleTimeChange("start", hour, eventDetails.startTime?.split(":")[1] || "00")
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
                                  key={`start-minute-${minute}`}
                                  className={cn(
                                    "w-12 h-8 text-center text-white hover:bg-white/10 rounded block mb-2",
                                    eventDetails.startTime?.endsWith(minute) && "bg-[#E65100]",
                                  )}
                                  onClick={(e) => {
                                    e.preventDefault()
                                    handleTimeChange("start", eventDetails.startTime?.split(":")[0] || "00", minute)
                                  }}
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
                  <Label htmlFor="endTime" className="text-white/70">
                    End Time
                  </Label>
                  <div className="relative" ref={endTimeRef}>
                    <Input
                      id="endTime"
                      value={eventDetails.endTime}
                      readOnly
                      className={cn(
                        "bg-[#1A1E2E] text-white placeholder:text-white/40 cursor-pointer rounded-md focus:border-white focus:ring-1 focus:ring-white pr-10 border-transparent",
                        lastModifiedTime === "end" && timeError && "border-[#FF2B2B] focus-visible:ring-[#FF2B2B]",
                      )}
                      onClick={() => setEndTimeOpen(!endTimeOpen)}
                      placeholder="E.g., 4:00"
                    />
                    <Clock
                      className={cn(
                        "absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 pointer-events-none",
                        lastModifiedTime === "end" && timeError ? "text-[#FF2B2B]" : "text-white/40",
                      )}
                      strokeWidth={1.5}
                    />
                    {endTimeOpen && (
                      <div
                        className="fixed w-[320px] bg-[#1A1E2E] border border-white/10 rounded-md p-4 mt-1"
                        style={{
                          zIndex: 9999,
                          position: "fixed",
                          left: endTimeRef.current?.getBoundingClientRect().left ?? 0,
                          bottom: window.innerHeight - (endTimeRef.current?.getBoundingClientRect().top ?? 0),
                        }}
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
                                        eventDetails.endTime?.startsWith(hour) && "bg-[#E65100]",
                                      )}
                                      onClick={(e) => {
                                        e.preventDefault()
                                        handleTimeChange("end", hour, eventDetails.endTime?.split(":")[1] || "00")
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
                                  key={`end-minute-${minute}`}
                                  className={cn(
                                    "w-12 h-8 text-center text-white hover:bg-white/10 rounded block mb-2",
                                    eventDetails.endTime?.endsWith(minute) && "bg-[#E65100]",
                                  )}
                                  onClick={(e) => {
                                    e.preventDefault()
                                    handleTimeChange("end", eventDetails.endTime?.split(":")[0] || "00", minute)
                                  }}
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
              {timeError && (
                <div className="flex items-center gap-2 mt-1" role="alert" aria-label={`Time error: ${timeError}`}>
                  <span className="inline-block w-5 h-5 rounded-full border-2 border-[#FF2B2B] flex items-center justify-center">
                    <span className="text-[#FF2B2B] text-xs">!</span>
                  </span>
                  <p className="text-white text-sm">{timeError}</p>
                </div>
              )}
              {errors.endTime && <p className="text-red-500 text-sm mt-1">{errors.endTime}</p>}
              <div className="space-y-2">
                <Label htmlFor="registrationPeriod" className="text-white/70">
                  Registration Period
                </Label>
                <DateRangeInput
                  startDate={eventDetails.registrationStart}
                  endDate={eventDetails.registrationEnd}
                  onChange={({ start, end }) => {
                    handleChange({ registrationStart: start, registrationEnd: end })
                    setIsFormTouched(true)
                  }}
                  error={errors.registrationTime}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location" className="text-white/70">
                  Location
                </Label>
                <Input
                  id="location"
                  value={eventDetails.location}
                  onChange={(e) => {
                    handleChange({ location: e.target.value })
                    setIsFormTouched(true)
                  }}
                  className="bg-[#1A1E2E] border-white/10 text-white placeholder:text-white/40 rounded-md"
                  placeholder="E.g., Broekwegkade 13A, 2725 BX"
                />
              </div>
            </div>
          </CollapsibleCardContent>
        </Card>

        {/* Design Details Card */}
        <Card className="bg-[#2A3142] border-white/5 shadow-none rounded-lg overflow-hidden" collapsible>
          <CardHeader collapsible onToggle={() => toggleCard("backgroundImage")} isOpen={openCards.backgroundImage}>
            <CardTitle className="text-white font-bold">Design Details</CardTitle>
          </CardHeader>
          <CollapsibleCardContent isOpen={openCards.backgroundImage}>
            <div className="space-y-2 mb-2">
              <Label htmlFor="backgroundColor" className="text-white/70">
                Change Background Color
              </Label>
              <ColorPicker
                initialColor={eventDetails.backgroundColor || "#0076BE"}
                onChange={(color) => {
                  handleChange({ backgroundColor: color })
                  setIsFormTouched(true)
                }}
              />
            </div>
            <Button
              variant="secondary"
              className="w-full bg-[#1A1E2E] hover:bg-[#141824] text-[#E65100] transition-colors duration-200"
              onClick={() => {
                document.getElementById("backgroundImage")?.click()
                setIsFormTouched(true)
              }}
            >
              <Upload className="mr-2 h-4 w-4" /> Upload Image
            </Button>
            <Input
              type="file"
              id="backgroundImage"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                handleImageUpload(e)
                setIsFormTouched(true)
              }}
            />
          </CollapsibleCardContent>
        </Card>
      </div>
    </>
  )
}


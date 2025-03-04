"use client"

import { useState, useEffect } from "react"
import { DateForm } from "@/components/date-form"
import { EventPreview } from "@/components/event-preview"
import type { EventFormErrors } from "@/types/event"
import { addDays } from "date-fns"

export type EventDetails = {
  eventName: string
  eventDate: Date
  startTime: string
  endTime: string
  registrationStart: Date
  registrationEnd?: Date
  maxInvitations: number
}

export function EventForm() {
  const [mounted, setMounted] = useState(false)
  const tomorrow = addDays(new Date(), 1)

  const [eventDetails, setEventDetails] = useState<EventDetails>({
    eventName: "Sample Event",
    eventDate: tomorrow,
    startTime: "09:00",
    endTime: "17:00",
    registrationStart: tomorrow, // Set to tomorrow
    registrationEnd: undefined, // Leave end date undefined so user must select it
    maxInvitations: 100,
  })

  const [errors, setErrors] = useState<EventFormErrors>({})
  const [isFormTouched, setIsFormTouched] = useState(false)

  // Handle hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleChange = (changes: Partial<EventDetails>) => {
    const newDetails = { ...eventDetails, ...changes }
    const newErrors = validateDates(newDetails)

    setEventDetails(newDetails)
    setErrors(newErrors)
    setIsFormTouched(true)
  }

  const validateDates = (details: EventDetails): EventFormErrors => {
    const newErrors: EventFormErrors = {}

    // Validate event date is after registration start
    if (details.eventDate && details.registrationStart) {
      if (details.eventDate < details.registrationStart) {
        newErrors.eventDate = "Event date cannot be earlier than the registration start date"
      }
    }

    // Validate registration end is after registration start
    if (details.registrationStart && details.registrationEnd) {
      if (details.registrationEnd < details.registrationStart) {
        newErrors.registrationTime = "Registration end date cannot be earlier than the registration start date"
      }
    }

    // Validate registration end is before event date
    if (details.registrationEnd && details.eventDate) {
      if (details.registrationEnd > details.eventDate) {
        newErrors.registrationTime = "Registration end date cannot be later than the event date"
      }
    }

    // Validate end time is after start time
    if (details.startTime && details.endTime) {
      const [startHour, startMinute] = details.startTime.split(":").map(Number)
      const [endHour, endMinute] = details.endTime.split(":").map(Number)

      const startTimeInMinutes = startHour * 60 + startMinute
      const endTimeInMinutes = endHour * 60 + endMinute

      if (endTimeInMinutes <= startTimeInMinutes) {
        newErrors.endTime = "End time must be later than start time"
      }
    }

    return newErrors
  }

  // Prevent hydration mismatch
  if (!mounted) {
    return null
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Left Column - Date Form */}
      <div>
        <DateForm
          eventDetails={eventDetails}
          errors={errors}
          handleChange={handleChange}
          setErrors={setErrors}
          setIsFormTouched={setIsFormTouched}
        />
      </div>

      {/* Right Column - Event Preview */}
      <div>
        <EventPreview event={eventDetails} isFormTouched={isFormTouched} />
      </div>
    </div>
  )
}


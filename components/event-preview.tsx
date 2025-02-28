"use client"

import type { EventDetails } from "@/types/event"
import { format, isValid } from "date-fns"
import { CalendarDays, Clock, Users, LayoutTemplate, ImageIcon } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"
import { generateEventColors } from "@/lib/utils/color"

interface EventPreviewProps {
  event: Partial<EventDetails>
  isFormTouched: boolean
  onPreviewClick: () => void
}

export function EventPreview({ event, isFormTouched, onPreviewClick }: EventPreviewProps) {
  const [mounted, setMounted] = useState(false)
  const colors = event.backgroundColor ? generateEventColors(event.backgroundColor) : generateEventColors("#0076BE")

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  if (!isFormTouched) {
    return (
      <div className="w-full bg-[#1A1E2E] rounded-lg shadow-lg overflow-hidden">
        <div className="h-[300px] flex items-center justify-center bg-[#2A3142]">
          <div className="text-center">
            <LayoutTemplate className="w-12 h-12 text-white/40 mx-auto" />
            <p className="text-white/40 text-lg text-center px-4 mt-4">Fill the form to preview your event</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full bg-[#1A1E2E] rounded-lg shadow-lg overflow-hidden cursor-default" onClick={onPreviewClick}>
      {/* Background Image Section */}
      <div className="relative w-full h-[300px]">
        {event.backgroundImage ? (
          <Image
            src={event.backgroundImage || "/placeholder.svg"}
            alt="Event background"
            fill
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-b from-gray-700 to-gray-900 flex items-center justify-center">
            <ImageIcon className="w-16 h-16 text-white/40" />
          </div>
        )}
      </div>

      {/* Content Container - Add this wrapper div */}
      <div className="w-[95%] mx-auto -mt-6 relative z-10 rounded-lg overflow-hidden">
        {/* Title Section */}
        <div
          className="p-6"
          style={{
            backgroundColor: colors.primary,
            color: colors.text,
          }}
        >
          <h1 className="text-2xl md:text-4xl font-bold">{event.eventName || "Event Title"}</h1>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 relative">
          {/* Main Info Section - 2 columns layout */}
          <div
            className="col-span-full md:col-span-9 grid grid-cols-2 gap-0 relative z-10"
            style={{
              backgroundColor: colors.secondary,
              color: colors.text,
            }}
          >
            {/* Left Column */}
            <div className="space-y-6 p-6 border-r border-black/10">
              {/* Event Date */}
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs md:text-sm" style={{ color: colors.textMuted }}>
                  <CalendarDays className="h-4 w-4" />
                  Event date
                </div>
                <div className="text-base md:text-lg">
                  {event.eventDate && isValid(new Date(event.eventDate))
                    ? format(new Date(event.eventDate), "EEEE, MMMM d, yyyy")
                    : "-"}
                </div>
              </div>

              {/* Registration Section */}
              <div className="space-y-4">
                {/* Registration Opens */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs md:text-sm" style={{ color: colors.textMuted }}>
                    <CalendarDays className="h-4 w-4" />
                    Registration opens
                  </div>
                  <div className="text-base md:text-lg">
                    {event.registrationStart && isValid(new Date(event.registrationStart))
                      ? format(new Date(event.registrationStart), "EEEE, MMMM d, yyyy")
                      : "-"}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="p-6 space-y-6">
              {/* Time Section */}
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs md:text-sm" style={{ color: colors.textMuted }}>
                  <Clock className="h-4 w-4" />
                  Time
                </div>
                <div className="text-base md:text-lg">
                  {event.startTime && event.endTime ? `${event.startTime} to ${event.endTime}` : "-"}
                </div>
              </div>

              {/* Registration Closes */}
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs md:text-sm" style={{ color: colors.textMuted }}>
                  <CalendarDays className="h-4 w-4" />
                  Registration closes
                </div>
                <div className="text-base md:text-lg">
                  {event.registrationEnd && isValid(new Date(event.registrationEnd))
                    ? format(new Date(event.registrationEnd), "EEEE, MMMM d, yyyy")
                    : "-"}
                </div>
              </div>
            </div>
          </div>

          {/* Statistics Section */}
          <div
            className="col-span-full md:col-span-3 grid grid-cols-1 gap-0"
            style={{
              backgroundColor: colors.tertiary,
              color: colors.text,
            }}
          >
            <div className="p-6 space-y-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  <span className="text-xl md:text-2xl font-semibold">1150</span>
                </div>
                <div className="text-sm" style={{ color: colors.textMuted }}>
                  Confirmed registrations
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  <span className="text-xl md:text-2xl font-semibold">{event.maxInvitations || 2500}</span>
                </div>
                <div className="text-sm" style={{ color: colors.textMuted }}>
                  Total invitations
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


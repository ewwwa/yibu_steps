"use client"

import type { EventDetails } from "@/types/event"
import { format, isValid } from "date-fns"
import { CalendarDays, Clock, Users, LayoutTemplate, ImageIcon } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"
import { getContrastColor } from "@/lib/utils/color"

interface EventPreviewProps {
  event: Partial<EventDetails>
  isFormTouched: boolean
}

export function EventPreview({ event, isFormTouched }: EventPreviewProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  if (!isFormTouched) {
    return (
      <div className="w-full h-[300px] bg-[#2A3142] rounded-lg shadow-lg flex flex-col items-center justify-center overflow-hidden">
        <LayoutTemplate className="w-12 h-12 text-white/40 mb-4" />
        <p className="text-white/40 text-lg">Fill the form to preview your event</p>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Full width container */}
      <div className="w-full bg-[#1A1E2E]">
        {/* Hero Image Section - Full Width */}
        <div className="relative w-full h-[300px]">
          {event.backgroundImage ? (
            <Image
              src={event.backgroundImage || "/placeholder.svg"}
              alt="Event background"
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-gray-700 to-gray-900">
              <ImageIcon className="w-16 h-16 text-white/40" />
            </div>
          )}
        </div>

        {/* Content Container with Padding */}
        <div className="max-w-[1400px] mx-auto px-6 relative -mt-16 pb-8">
          {/* Event Details Panel */}
          <div
            className="rounded-lg shadow-lg overflow-hidden"
            style={{
              backgroundColor: event.backgroundColor || "#0076BE",
              color: getContrastColor(event.backgroundColor || "#0076BE"),
            }}
          >
            <div className="p-6">
              {/* Event Title and Description */}
              <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{event.eventName || "Event Title"}</h1>
              </div>

              {/* Event Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Date and Time Column */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <CalendarDays className="h-5 w-5" />
                    <div>
                      <div className="text-sm opacity-80">Event date</div>
                      <div>
                        {event.eventDate && isValid(new Date(event.eventDate))
                          ? format(new Date(event.eventDate), "EEEE, d MMMM yyyy")
                          : "-"}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5" />
                    <div>
                      <div className="text-sm opacity-80">Time</div>
                      <div>{event.startTime && event.endTime ? `${event.startTime} - ${event.endTime} uur` : "-"}</div>
                    </div>
                  </div>
                </div>

                {/* Registration Period Column */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <CalendarDays className="h-5 w-5" />
                    <div>
                      <div className="text-sm opacity-80">Registration opens</div>
                      <div>
                        {event.registrationStart && isValid(new Date(event.registrationStart))
                          ? format(new Date(event.registrationStart), "EEEE, d MMMM yyyy")
                          : "-"}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CalendarDays className="h-5 w-5" />
                    <div>
                      <div className="text-sm opacity-80">Registration closes</div>
                      <div>
                        {event.registrationEnd && isValid(new Date(event.registrationEnd))
                          ? format(new Date(event.registrationEnd), "EEEE, d MMMM yyyy")
                          : "-"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Registration Stats Column */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5" />
                    <div>
                      <div className="text-sm opacity-80">Confirmed registrations</div>
                      <div>0</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5" />
                    <div>
                      <div className="text-sm opacity-80">Total invitations</div>
                      <div>{event.maxInvitations || 2500}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


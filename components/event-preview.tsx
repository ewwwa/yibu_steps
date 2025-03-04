"use client"

import type { EventDetails } from "./event-form"
import { format, isValid } from "date-fns"
import { CalendarDays } from "lucide-react"
import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"

interface EventPreviewProps {
  event: EventDetails
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

  return (
    <Card className="bg-[#2A3142] border-white/5 shadow-none rounded-lg overflow-hidden">
      <CardContent className="space-y-6">
        <div className="bg-[#1A1E2E] rounded-lg p-6">
          {/* Event Date */}
          <div className="flex items-start space-x-3 mb-4">
            <CalendarDays className="h-5 w-5 text-white mt-0.5" />
            <div>
              <div className="text-sm text-white/80">Event date</div>
              <div className="text-white font-medium">
                {event.eventDate && isValid(event.eventDate) ? format(event.eventDate, "EEEE, d MMMM yyyy") : "-"}
              </div>
            </div>
          </div>

          {/* Registration Period */}
          <div className="bg-[#0076BE] rounded-lg p-4 mb-4">
            <h3 className="text-white font-semibold mb-2">Registration Period</h3>
            <div className="space-y-2">
              <div className="flex items-start space-x-3">
                <CalendarDays className="h-5 w-5 text-white mt-0.5" />
                <div>
                  <div className="text-sm text-white/80">Opens</div>
                  <div className="text-white">
                    {event.registrationStart && isValid(event.registrationStart)
                      ? format(event.registrationStart, "EEEE, d MMMM yyyy")
                      : "-"}
                  </div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CalendarDays className="h-5 w-5 text-white mt-0.5" />
                <div>
                  <div className="text-sm text-white/80">Closes</div>
                  <div className="text-white">
                    {event.registrationEnd && isValid(event.registrationEnd)
                      ? format(event.registrationEnd, "EEEE, d MMMM yyyy")
                      : "-"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}


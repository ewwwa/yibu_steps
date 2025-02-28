"use client"

import { useState } from "react"
import { EventPreview } from "@/components/event-preview"
import { ChevronDown, ChevronUp, Edit, LayoutTemplate } from "lucide-react"
import type { EventDetails, Session } from "@/types/event"

interface ReviewPublishStepProps {
  eventDetails: EventDetails
  sessions: Session[]
  onEditEvent: () => void
  onEditSessions: () => void
  onToastShow: (message: string, type: "default" | "success" | "destructive" | "custom") => void
}

export function ReviewPublishStep({
  eventDetails,
  sessions,
  onEditEvent,
  onEditSessions,
  onToastShow,
}: ReviewPublishStepProps) {
  const [isEventExpanded, setIsEventExpanded] = useState(true)
  const [areSessionsExpanded, setAreSessionsExpanded] = useState(true)

  const handlePreviewClick = (previewType: "event" | "session") => {
    onToastShow(`To update this ${previewType} preview, click the 'Edit' button above`, "custom")
  }

  return (
    <div className="space-y-6 w-full max-w-[1400px] mx-auto">
      {/* Event Preview Section */}
      <div className="bg-[#1E2335] rounded-lg overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4">
          <h2 className="text-lg font-semibold text-white">Event Preview</h2>
          <div className="flex items-center gap-2">
            <button onClick={onEditEvent} className="text-white/60 hover:text-white flex items-center gap-1 text-sm">
              <Edit className="w-4 h-4" />
              Edit
            </button>
            <button onClick={() => setIsEventExpanded(!isEventExpanded)} className="text-white/60 hover:text-white">
              {isEventExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          </div>
        </div>
        {isEventExpanded && (
          <div className="p-6 cursor-pointer" onClick={() => handlePreviewClick("event")}>
            <EventPreview
              event={eventDetails}
              isFormTouched={true}
              onPreviewClick={() => handlePreviewClick("event")}
            />
          </div>
        )}
      </div>

      {/* Sessions Preview Section */}
      <div className="bg-[#1E2335] rounded-lg overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4">
          <h2 className="text-lg font-semibold text-white">Sessions Preview</h2>
          <div className="flex items-center gap-2">
            <button onClick={onEditSessions} className="text-white/60 hover:text-white flex items-center gap-1 text-sm">
              <Edit className="w-4 h-4" />
              Edit
            </button>
            <button
              onClick={() => setAreSessionsExpanded(!areSessionsExpanded)}
              className="text-white/60 hover:text-white"
            >
              {areSessionsExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          </div>
        </div>
        {areSessionsExpanded && (
          <div className="p-6">
            {sessions.length === 0 ? (
              <div className="w-full h-[200px] bg-[#1E2335] rounded-lg flex flex-col items-center justify-center">
                <LayoutTemplate className="w-16 h-16 text-white/20" />
                <p className="text-white/40 mt-4">Fill the form to preview your sessions</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sessions.map((session, index) => (
                  <div
                    key={session.id || index}
                    className="bg-[#1E2335] rounded-lg overflow-hidden shadow-sm cursor-default"
                    onClick={() => handlePreviewClick("session")}
                  >
                    <div className="aspect-video bg-[#374151] flex items-center justify-center">
                      {session.imageUrl ? (
                        <img
                          src={session.imageUrl || "/placeholder.svg"}
                          alt={session.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <LayoutTemplate className="w-12 h-12 text-white/20" />
                      )}
                    </div>
                    <div className="bg-white p-4">
                      <h3 className="font-medium text-black">
                        {session.title || `Session ${String(index + 1).padStart(2, "0")}`}
                      </h3>
                      <div className="flex items-center justify-between mt-2 text-sm text-gray-500">
                        <span>
                          {session.startTime} - {session.endTime}
                        </span>
                        <span>Max Attendees: {session.maxAttendees || 0}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}


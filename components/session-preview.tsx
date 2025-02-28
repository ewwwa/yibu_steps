import { LayoutTemplate, Clock, Users } from "lucide-react"
import type { Session } from "@/types/session"
import Image from "next/image"

interface SessionPreviewProps {
  session?: Partial<Session>
  isFormTouched: boolean
  onPreviewClick: () => void
}

export function SessionPreview({ session, isFormTouched, onPreviewClick }: SessionPreviewProps) {
  return (
    <div className="col-span-full min-[1025px]:col-span-8 order-2 min-[1025px]:order-1 h-full flex items-center justify-center">
      <div
        className="w-[390px] bg-[#1A1E2E] rounded-lg shadow-lg overflow-hidden flex flex-col h-[400px] cursor-default hover:shadow-xl transition-shadow duration-300"
        onClick={onPreviewClick}
      >
        <div className="w-full aspect-[16/9] relative bg-gray-700 flex items-center justify-center">
          {session?.imageUrl ? (
            <Image
              src={session.imageUrl || "/placeholder.svg"}
              alt={session.title || "Session image"}
              layout="fill"
              objectFit="cover"
            />
          ) : (
            <LayoutTemplate className="w-16 h-16 text-white/40" />
          )}
        </div>
        <div className="flex-1 p-4 flex flex-col bg-white text-black overflow-hidden">
          <h2 className="text-lg font-semibold mb-1">{session?.title || "Untitled Session"}</h2>
          {session?.speakers && session.speakers.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {session.speakers.map((speaker, index) => (
                <span key={speaker.id} className="text-sm text-gray-600">
                  {speaker.name}
                  {index < session.speakers!.length - 1 ? ", " : ""}
                </span>
              ))}
            </div>
          )}
          <p className="text-black/70 text-sm leading-snug mb-4 flex-grow overflow-y-auto max-h-[120px] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
            {session?.description || "No description provided"}
          </p>
          <div className="flex items-center justify-between text-xs text-black/70">
            {(session?.startTime || session?.endTime) && (
              <div className="flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                <span>
                  {session?.startTime || "--:--"} - {session?.endTime || "--:--"}
                </span>
              </div>
            )}
            <div className="flex items-center">
              <Users className="w-3 h-3 mr-1" />
              <span>Max Attendees: {session?.maxAttendees || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


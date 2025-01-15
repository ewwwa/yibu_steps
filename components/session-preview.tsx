import { Session } from "@/types/session"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Clock, Users } from 'lucide-react'
import { format } from "date-fns"

interface SessionPreviewProps {
  session: Partial<Session>;
}

export function SessionPreview({ session }: SessionPreviewProps) {
  return (
    <div className="w-full max-w-3xl mx-auto bg-card rounded-lg shadow-lg overflow-hidden">
      {/* Session Image */}
      <div className="relative h-[300px] w-full bg-muted">
        {session.imageUrl ? (
          <img
            src={session.imageUrl}
            alt={session.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            Upload session image
          </div>
        )}
      </div>

      {/* Session Content */}
      <div className="p-6 space-y-6">
        {/* Title */}
        <h1 className="text-2xl font-bold">
          {session.title || "Session Title"}
          {session.title && session.title.length > 0 && (
            <span className="text-sm text-muted-foreground ml-2">
              ({session.title.length}/100 characters)
            </span>
          )}
        </h1>

        {/* Introduction */}
        {session.introduction && (
          <div>
            <p className="text-muted-foreground">
              {session.introduction}
              <span className="text-sm ml-2">
                ({session.introduction.length}/300 characters)
              </span>
            </p>
          </div>
        )}

        {/* Subtitle */}
        {session.subtitle && (
          <div>
            <h2 className="text-xl font-semibold">
              {session.subtitle}
              <span className="text-sm text-muted-foreground ml-2">
                ({session.subtitle.length}/200 characters)
              </span>
            </h2>
          </div>
        )}

        {/* Description */}
        {session.description && (
          <div>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {session.description}
              <span className="text-sm ml-2">
                ({session.description.length}/400 characters)
              </span>
            </p>
          </div>
        )}

        {/* Categories */}
        {session.categories && session.categories.length > 0 && (
          <div className="flex gap-2">
            {session.categories.map((category, index) => (
              <Badge key={index} variant="secondary">
                {category}
              </Badge>
            ))}
          </div>
        )}

        {/* Location & Time */}
        <div className="grid md:grid-cols-2 gap-6 py-4 border-t">
          {/* Location */}
          {session.location && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-5 w-5" />
                <span>Locations</span>
              </div>
              <div className="space-y-1">
                <p className="font-medium">{session.location.centerName}</p>
                <p>Room: {session.location.roomName}</p>
                <p>{session.location.streetAddress}</p>
                <p>{session.location.postalCode}, {session.location.city}</p>
                <p>{session.location.country}</p>
                <Button variant="link" className="p-0 h-auto">
                  View on Map
                </Button>
              </div>
            </div>
          )}

          {/* Time */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="font-medium">Time</div>
                <div className="text-sm text-muted-foreground">
                  {session.startTime && format(new Date(session.startTime), 'HH:mm')}
                  {session.endTime && ` - ${format(new Date(session.endTime), 'HH:mm')}`}
                </div>
              </div>
            </div>
            
            {session.maxAttendees && (
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">Max</div>
                  <div className="text-sm text-muted-foreground">
                    {session.maxAttendees} People
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Speakers */}
        {session.speakers && session.speakers.length > 0 && (
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-4">Speakers</h3>
            <div className="flex flex-wrap gap-4">
              {session.speakers.map((speaker) => (
                <div key={speaker.id} className="flex items-center gap-2">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-muted">
                    {speaker.imageUrl ? (
                      <img
                        src={speaker.imageUrl}
                        alt={speaker.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                        No image
                      </div>
                    )}
                  </div>
                  <span className="font-medium">{speaker.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}


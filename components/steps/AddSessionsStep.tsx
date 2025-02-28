"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import type { Session, Speaker } from "@/types/session"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Clock, Upload, X, ChevronUp, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { CardSession } from "@/components/ui/card-session"
import { SessionPreview } from "@/components/session-preview"

const styles = `
  @keyframes highlightPulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.4); }
    50% { box-shadow: 0 0 0 10px rgba(255, 255, 255, 0); }
  }
  .highlight-new-session {
    animation: highlightPulse 0.5s ease-in-out 1 forwards;
  }
  .no-tooltip::before,
  .no-tooltip::after {
    display: none !important;
  }
  @keyframes speakerChipAnimation {
    0% { background-color: #E65100; }
    100% { background-color: #2A3142; }
  }
  .speaker-chip {
    animation: speakerChipAnimation 0.2s ease-in-out forwards;
  }
`

interface AddSessionsStepProps {
  sessions: Partial<Session>[]
  setSessions: React.Dispatch<React.SetStateAction<Partial<Session>[]>>
  currentSessionIndex: number
  setCurrentSessionIndex: React.Dispatch<React.SetStateAction<number>>
  eventStartTime: string
  eventEndTime: string
  onSessionChange: (session: Partial<Session>, index: number) => void
  onAddSession: () => void
  setIsFormTouched: React.Dispatch<React.SetStateAction<boolean>>
  onRemoveSession: (index: number) => void
  formData: any
  newSessionId: string | null
  selectedSessionId: string | null
  onPreviewClick: () => void
}

export function AddSessionsStep({
  sessions,
  setSessions,
  currentSessionIndex,
  setCurrentSessionIndex,
  eventStartTime,
  eventEndTime,
  onSessionChange,
  onAddSession,
  setIsFormTouched,
  onRemoveSession,
  formData,
  newSessionId,
  selectedSessionId,
  onPreviewClick,
}: AddSessionsStepProps) {
  const [isFormTouched, setIsFormTouchedLocal] = useState(false)
  const [startTimeOpen, setStartTimeOpen] = useState(false)
  const [endTimeOpen, setEndTimeOpen] = useState(false)
  const startTimeRef = useRef<HTMLDivElement>(null)
  const endTimeRef = useRef<HTMLDivElement>(null)
  const [timeError, setTimeError] = useState<string | null>(null)
  const [lastModifiedTime, setLastModifiedTime] = useState<"start" | "end" | null>(null)
  const [speakerError, setSpeakerError] = useState<string | null>(null)
  const [speakerInput, setSpeakerInput] = useState("")

  // Use local state to store session data
  const [localSessions, setLocalSessions] = useState<Partial<Session>[]>(sessions)

  // Update local sessions when props change
  useEffect(() => {
    setLocalSessions(sessions)
    if (sessions.length > 0 && currentSessionIndex >= sessions.length) {
      setCurrentSessionIndex(sessions.length - 1)
    }
  }, [sessions, currentSessionIndex, setCurrentSessionIndex])

  // Get the current session data
  const currentSession = sessions[currentSessionIndex] || {
    title: "",
    description: "",
    speakers: [],
    startTime: eventStartTime,
    endTime: eventEndTime,
    maxAttendees: 0,
    imageUrl: "",
  }

  const handleAddSession = () => {
    const newId = Math.random().toString(36).substr(2, 9)
    const newSession: Partial<Session> = {
      id: newId,
      title: `Session ${(sessions.length + 1).toString().padStart(2, "0")}`,
      description: "",
      speakers: [],
      startTime: eventStartTime,
      endTime: eventEndTime,
      maxAttendees: 0,
      imageUrl: "",
    }
    setSessions([...sessions, newSession])
    setCurrentSessionIndex(sessions.length)
  }

  const handleSessionChange = (changes: Partial<Session>) => {
    const updatedSessions = localSessions.map((session, index) =>
      index === currentSessionIndex ? { ...session, ...changes } : session,
    )
    setLocalSessions(updatedSessions)
    onSessionChange({ ...currentSession, ...changes }, currentSessionIndex)
    setIsFormTouchedLocal(true)
    setIsFormTouched(true)
  }

  const handleSpeakerInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value.endsWith(",")) {
      // Remove the comma and add the speaker
      const speakerName = value.slice(0, -1).trim()
      if (speakerName) {
        addSpeaker(speakerName)
      }
      setSpeakerInput("")
    } else {
      setSpeakerInput(value)
    }
  }

  const handleSpeakerInputBlur = () => {
    if (speakerInput.trim()) {
      addSpeaker(speakerInput.trim())
      setSpeakerInput("")
    }
  }

  const addSpeaker = (name: string) => {
    const capitalizedName = name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
    if (currentSession.speakers?.some((speaker) => speaker.name.toLowerCase() === capitalizedName.toLowerCase())) {
      setSpeakerError("Speaker name already exists")
      return
    }
    const newSpeaker: Speaker = {
      id: Math.random().toString(36).substr(2, 9),
      name: capitalizedName,
    }
    const updatedSession = {
      ...currentSession,
      speakers: [...(currentSession.speakers || []), newSpeaker],
    }
    handleSessionChange(updatedSession)
    setSpeakerInput("")
    setSpeakerError(null)
  }

  const removeSpeaker = (speakerId: string) => {
    const updatedSession = {
      ...currentSession,
      speakers: currentSession.speakers?.filter((speaker) => speaker.id !== speakerId),
    }
    handleSessionChange(updatedSession)
    setSpeakerError(null) // Clear the error message when removing a speaker
  }

  const generateHourOptions = () => {
    const [startHour] = eventStartTime.split(":").map(Number)
    const [endHour] = eventEndTime.split(":").map(Number)

    return [
      Array.from({ length: 6 }, (_, i) => {
        const hour = i + 7
        return {
          value: hour.toString().padStart(2, "0"),
          disabled: hour < startHour || hour > endHour,
        }
      }),
      Array.from({ length: 6 }, (_, i) => {
        const hour = i + 13
        return {
          value: hour.toString().padStart(2, "0"),
          disabled: hour < startHour || hour > endHour,
        }
      }),
      Array.from({ length: 5 }, (_, i) => {
        const hour = (i + 19) % 24
        return {
          value: hour.toString().padStart(2, "0"),
          disabled: hour < startHour || hour > endHour,
        }
      }),
    ]
  }

  const generateMinuteOptions = () => {
    return ["00", "15", "30", "45"]
  }

  useEffect(() => {
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

  const handleTimeChange = (type: "start" | "end", hour: string, minute: string) => {
    const newTime = `${hour}:${minute}`
    const [eventStartHour] = eventStartTime.split(":").map(Number)
    const [eventEndHour] = eventEndTime.split(":").map(Number)
    const newHour = Number.parseInt(hour, 10)

    if (newHour >= eventStartHour && newHour <= eventEndHour) {
      const updatedSession = { ...currentSession, [type === "start" ? "startTime" : "endTime"]: newTime }
      handleSessionChange(updatedSession)
      setLastModifiedTime(type)
      validateTimes(updatedSession.startTime!, updatedSession.endTime!, type)
      if (type === "start") {
        setStartTimeOpen(false)
      } else {
        setEndTimeOpen(false)
      }
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    const updatedValue = name === "maxAttendees" ? (value === "" ? 0 : Math.max(0, Number.parseInt(value, 10))) : value
    const updatedSession = { ...currentSession, [name]: updatedValue }
    handleSessionChange(updatedSession)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        handleSessionChange({ imageUrl: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleTitleChange = (newTitle: string) => {
    handleSessionChange({ title: newTitle })
  }

  const handleSessionSelect = (sessionId: string) => {
    const index = sessions.findIndex((s) => s.id === sessionId)
    if (index !== -1) {
      setCurrentSessionIndex(index)
    }
  }

  return (
    <>
      <style jsx global>
        {styles}
      </style>
      <div className="w-full">
        <CardSession
          key={currentSession.id || currentSessionIndex}
          currentSession={currentSession}
          isFormTouched={true} // Always show the preview when we have session data
          onTitleChange={handleTitleChange}
          isNewSession={currentSession.id === newSessionId}
          isSelected={currentSession.id === selectedSessionId}
        >
          <div className="flex flex-col min-[1025px]:flex-row gap-6">
            {/* Preview section for mobile - shown between title and form */}
            <div className="block min-[1025px]:hidden w-full">
              <SessionPreview session={currentSession} isFormTouched={true} onPreviewClick={onPreviewClick} />
            </div>

            {/* Form section */}
            <div className="w-full min-[1025px]:w-[390px] space-y-6">
              <form className="space-y-4 w-full">
                <div className="space-y-4 w-full">
                  <div className="space-y-2 w-full">
                    <Label htmlFor="description" className="text-white/70">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={currentSession.description || ""}
                      onChange={handleInputChange}
                      placeholder="E.g., A detailed overview of the event's purpose and activities."
                      className="bg-[#1A1E2E] border-white/10 text-white placeholder:text-white/40 h-[72px] resize-none w-full"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="speakerName" className="text-white/70">
                    Speakers (use commas to add more than 1)
                  </Label>
                  <div className="relative">
                    <div className="min-h-[40px] w-full bg-[#1A1E2E] border border-white/10 rounded-md text-white flex items-center flex-wrap gap-2 p-2">
                      {currentSession.speakers &&
                        currentSession.speakers.map((speaker) => (
                          <div
                            key={speaker.id}
                            className="flex items-center gap-1 px-2 py-1 bg-[#2A3142] text-white rounded-full text-sm border border-white/10 transition-all duration-200 ease-in-out speaker-chip"
                          >
                            {speaker.name}
                            <button
                              type="button"
                              onClick={() => removeSpeaker(speaker.id)}
                              className="ml-1 p-0.5 rounded-full hover:bg-white/10 transition-colors"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      <input
                        id="speakerName"
                        value={speakerInput}
                        onChange={(e) => {
                          e.target.removeAttribute("title")
                          handleSpeakerInputChange(e)
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === ",") {
                            e.preventDefault()
                            if (speakerInput.trim()) {
                              addSpeaker(speakerInput.trim())
                            }
                          }
                        }}
                        onBlur={handleSpeakerInputBlur}
                        placeholder={currentSession.speakers?.length === 0 ? "Add speakers..." : ""}
                        className="flex-1 bg-transparent border-none text-white placeholder:text-white/40 focus:outline-none min-w-[120px] h-[24px] no-tooltip"
                      />
                    </div>
                    {speakerError && (
                      <div
                        className="flex items-center gap-2 mt-1"
                        role="alert"
                        aria-label={`Speaker error: ${speakerError}`}
                      >
                        <span className="inline-block w-5 h-5 rounded-full border-2 border-[#FF2B2B] flex items-center justify-center">
                          <span className="text-[#FF2B2B] text-xs">!</span>
                        </span>
                        <p className="text-white text-sm">{speakerError}</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 w-full">
                  <div className="w-1/2 space-y-2">
                    <Label htmlFor="startTime" className="text-white/70">
                      Start Time
                    </Label>
                    <div className="relative" ref={startTimeRef}>
                      <Input
                        id="startTime"
                        value={currentSession.startTime}
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
                                    {column.map(({ value: hour, disabled }) => (
                                      <button
                                        key={`start-hour-${hour}`}
                                        className={cn(
                                          "w-12 h-8 text-center text-white hover:bg-white/10 rounded",
                                          currentSession.startTime?.startsWith(hour) && "bg-[#E65100]",
                                          disabled && "opacity-30 bg-gray-800 cursor-not-allowed hover:bg-gray-800",
                                        )}
                                        onClick={(e) => {
                                          e.preventDefault()
                                          if (!disabled) {
                                            handleTimeChange(
                                              "start",
                                              hour,
                                              currentSession.startTime?.split(":")[1] || "00",
                                            )
                                          }
                                        }}
                                        disabled={disabled}
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
                                      currentSession.startTime?.endsWith(minute) && "bg-[#E65100]",
                                    )}
                                    onClick={(e) => {
                                      e.preventDefault()
                                      handleTimeChange("start", currentSession.startTime?.split(":")[0] || "00", minute)
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
                  <div className="w-1/2 space-y-2">
                    <Label htmlFor="endTime" className="text-white/70">
                      End Time
                    </Label>
                    <div className="relative" ref={endTimeRef}>
                      <Input
                        id="endTime"
                        value={currentSession.endTime}
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
                                    {column.map(({ value: hour, disabled }) => (
                                      <button
                                        key={`end-hour-${hour}`}
                                        className={cn(
                                          "w-12 h-8 text-center text-white hover:bg-white/10 rounded",
                                          currentSession.endTime?.startsWith(hour) && "bg-[#E65100]",
                                          disabled && "opacity-30 bg-gray-800 cursor-not-allowed hover:bg-gray-800",
                                        )}
                                        onClick={(e) => {
                                          e.preventDefault()
                                          if (!disabled) {
                                            handleTimeChange("end", hour, currentSession.endTime?.split(":")[1] || "00")
                                          }
                                        }}
                                        disabled={disabled}
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
                                      currentSession.endTime?.endsWith(minute) && "bg-[#E65100]",
                                    )}
                                    onClick={(e) => {
                                      e.preventDefault()
                                      handleTimeChange("end", currentSession.endTime?.split(":")[0] || "00", minute)
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
                <div className="space-y-2">
                  <Label htmlFor="maxAttendees" className="text-white/70">
                    Number of attendees
                  </Label>
                  <div className="relative h-10 w-full">
                    <Input
                      id="maxAttendees"
                      name="maxAttendees"
                      type="number"
                      value={currentSession.maxAttendees ?? 0}
                      onChange={handleInputChange}
                      className="bg-[#1A1E2E] border-white/10 text-white placeholder:text-white/40 pr-16 h-10 w-full"
                      placeholder="E.g., 100"
                    />
                    <div className="absolute right-2 top-0 bottom-0 flex flex-col justify-center">
                      <button
                        type="button"
                        className="text-white/40 hover:text-white focus:text-white transition-colors h-5 flex items-center justify-center"
                        onClick={() =>
                          handleInputChange({
                            target: { name: "maxAttendees", value: (currentSession.maxAttendees ?? 0) + 1 },
                          } as React.ChangeEvent<HTMLInputElement>)
                        }
                        aria-label="Increase attendees"
                      >
                        <ChevronUp className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        className="text-white/40 hover:text-white focus:text-white transition-colors h-5 flex items-center justify-center"
                        onClick={() =>
                          handleInputChange({
                            target: {
                              name: "maxAttendees",
                              value: Math.max((currentSession.maxAttendees ?? 0) - 1, 0),
                            },
                          } as React.ChangeEvent<HTMLInputElement>)
                        }
                        aria-label="Decrease attendees"
                      >
                        <ChevronDown className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <input
                    type="file"
                    id="imageUpload"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    className="w-full bg-[#1A1E2E] hover:bg-[#141824] text-[#E65100] transition-colors duration-200 h-10"
                    onClick={() => document.getElementById("imageUpload")?.click()}
                  >
                    <Upload className="mr-2 h-4 w-4" /> Upload Image
                  </Button>
                </div>
              </form>
            </div>

            {/* Preview section for desktop - shown on the right */}
            <div className="hidden min-[1025px]:block min-[1025px]:flex-grow">
              <SessionPreview session={currentSession} isFormTouched={true} onPreviewClick={onPreviewClick} />
            </div>
          </div>
        </CardSession>
      </div>
    </>
  )
}


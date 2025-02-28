"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import type { EventDetails, EventFormErrors, Session } from "@/types/event"
import { StepProgress, type Step } from "@/components/step-progress"
import { EventPreview } from "@/components/event-preview"
import { EventDetailsStep } from "@/components/steps/EventDetailsStep"
import { AddSessionsStep } from "@/components/steps/AddSessionsStep"
import { UploadInviteesStep } from "@/components/steps/UploadInviteesStep"
import { ReviewPublishStep } from "@/components/steps/ReviewPublishStep"
import { addDays, isBefore, isAfter, parse } from "date-fns"
import { BottomNavBar } from "@/components/BottomNavBar"
import { Header } from "@/components/header"
import { SessionThumbnailBar } from "@/components/session-thumbnail-bar"
import { useMediaQuery } from "@/hooks/useMediaQuery"
import { useToast } from "@/components/ui/toast"
import { Toaster } from "@/components/ui/toast"

const highlightStyles = `
@keyframes highlightPulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.4); }
  50% { box-shadow: 0 0 0 10px rgba(255, 255, 255, 0); }
}
.highlight-new-session {
  animation: highlightPulse 0.5s ease-in-out 1 forwards;
}
`

const cardTitles = {
  eventDetails: "Event Details",
  dateTime: "Date and Time",
  locationCapacity: "Location and Capacity",
  backgroundImage: "Design Details",
}

export function EventPlanner() {
  const { toast } = useToast()
  const [mounted, setMounted] = useState(false)
  const tomorrow = addDays(new Date(), 1)
  const [currentStep, setCurrentStep] = useState(1)
  const [highestStepReached, setHighestStepReached] = useState(1)
  const [formData, setFormData] = useState({
    eventDetails: {
      eventName: "",
      description: "",
      eventDate: tomorrow,
      startTime: "07:00",
      endTime: "19:00",
      registrationStart: tomorrow,
      registrationEnd: undefined,
      location: "",
      maxInvitations: 2500,
      backgroundImage: undefined,
      backgroundColor: "#FFFFFF",
    },
    sessions: [] as Session[],
    invitees: [] as string[],
  })
  const [errors, setErrors] = useState<EventFormErrors>({})
  const [isFormTouched, setIsFormTouched] = useState(false)
  const [currentSessionIndex, setCurrentSessionIndex] = useState(0)
  const [isValid, setIsValid] = useState(false)
  const [sessions, setSessions] = useState<Partial<Session>[]>([])
  const [newSessionId, setNewSessionId] = useState<string | null>(null)
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null)
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)
  const [highlightedSessionId, setHighlightedSessionId] = useState<string | null>(null)
  const [editedSessions, setEditedSessions] = useState<Set<string>>(new Set())
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Handle hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (sessions.length > 0 && !selectedSessionId) {
      setSelectedSessionId(sessions[0]?.id || null)
    }
  }, [sessions, selectedSessionId])

  const steps: Step[] = [
    { number: 1, title: "Event Details", mobileTitle: "Event" },
    { number: 2, title: "Add Sessions", mobileTitle: "Sessions" },
    { number: 3, title: "Upload Invitees", mobileTitle: "Invitees" },
    { number: 4, title: "Review & Publish", mobileTitle: "Publish" },
  ].map((step) => ({
    ...step,
    status:
      step.number < highestStepReached ? "completed" : step.number === highestStepReached ? "current" : "upcoming",
  }))

  const validateDates = (newDetails: Partial<EventDetails>): EventFormErrors => {
    const newErrors: EventFormErrors = {}

    if (newDetails.eventDate && newDetails.registrationStart) {
      if (isBefore(newDetails.eventDate, newDetails.registrationStart)) {
        newErrors.eventDate = "Event date cannot be earlier than the registration start date"
      }
    }

    if (newDetails.registrationStart && newDetails.eventDate) {
      if (isAfter(newDetails.registrationStart, newDetails.eventDate)) {
        newErrors.registrationTime = "Registration start date cannot be later than the event date"
      }
    }

    if (newDetails.registrationEnd && newDetails.eventDate) {
      if (isAfter(newDetails.registrationEnd, newDetails.eventDate)) {
        newErrors.registrationTime = "Registration end date cannot be later than the event date"
      }
    }

    if (newDetails.startTime && newDetails.endTime) {
      const startTime = parse(newDetails.startTime, "HH:mm", new Date())
      const endTime = parse(newDetails.endTime, "HH:mm", new Date())
      if (isAfter(startTime, endTime)) {
        newErrors.endTime = "End time cannot be earlier than start time"
      }
    }

    return newErrors
  }

  const updateEventDetails = useCallback((newDetails: Partial<EventDetails>) => {
    setFormData((prev) => ({
      ...prev,
      eventDetails: { ...prev.eventDetails, ...newDetails },
    }))
  }, [])

  const updateSessions = useCallback((newSessions: Partial<Session>[]) => {
    setFormData((prev) => ({
      ...prev,
      sessions: newSessions,
    }))
    setSessions(newSessions)
  }, [])

  const updateInvitees = useCallback((newInvitees: string[]) => {
    setFormData((prev) => ({
      ...prev,
      invitees: newInvitees,
    }))
  }, [])

  const handleChange = (changes: Partial<EventDetails>) => {
    updateEventDetails(changes)
    setIsFormTouched(true)
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        handleChange({ backgroundImage: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleStepClick = (stepNumber: number) => {
    if (stepNumber <= highestStepReached) {
      setCurrentStep(stepNumber)
    }
  }

  const handleBackStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleNextStep = () => {
    if (currentStep < steps.length) {
      if (currentStep === 1) {
        const { startTime, endTime } = formData.eventDetails
        setSessions((prevSessions) => {
          if (prevSessions.length === 0) {
            // Initialize the first session with the times from Step 1
            const initialSessionId = Math.random().toString(36).substr(2, 9)
            const initialSession: Partial<Session> = {
              id: initialSessionId,
              title: "Session 01",
              description: "",
              speakers: [],
              startTime,
              endTime,
              maxAttendees: 0,
              imageUrl: "",
            }
            setSelectedSessionId(initialSessionId)
            return [initialSession]
          } else {
            // Update all existing sessions with new times
            return prevSessions.map((session) => ({
              ...session,
              startTime,
              endTime,
            }))
          }
        })
      }
      setCurrentStep(currentStep + 1)
      setHighestStepReached((prev) => Math.max(prev, currentStep + 1))
    }
  }

  const handleSessionChange = useCallback(
    (updatedSession: Partial<Session>, index: number) => {
      setSessions((prevSessions) => {
        const newSessions = [...prevSessions]
        newSessions[index] = { ...newSessions[index], ...updatedSession }
        return newSessions
      })
      updateSessions((prevSessions) => {
        const newSessions = [...prevSessions]
        newSessions[index] = { ...newSessions[index], ...updatedSession }
        return newSessions
      })
    },
    [updateSessions],
  )

  const handleAddSession = () => {
    const newId = Math.random().toString(36).substr(2, 9)
    const newSession: Partial<Session> = {
      id: newId,
      title: `Session ${(sessions.length + 1).toString().padStart(2, "0")}`,
      description: "",
      speakers: [],
      startTime: formData.eventDetails.startTime,
      endTime: formData.eventDetails.endTime,
      maxAttendees: 0,
      imageUrl: "",
    }
    const updatedSessions = [...sessions, newSession]
    setSessions(updatedSessions)
    updateSessions(updatedSessions)
    setCurrentSessionIndex(sessions.length)
    setSelectedSessionId(newId)
    setHighlightedSessionId(newId)
    setTimeout(() => setHighlightedSessionId(null), 2000)
  }

  const handleRemoveSession = (index: number) => {
    const updatedSessions = [...sessions]
    updatedSessions.splice(index, 1)
    setSessions(updatedSessions)
    updateSessions(updatedSessions)
    setCurrentSessionIndex(Math.min(currentSessionIndex, updatedSessions.length - 1))
  }

  const handleSessionSelect = (sessionId: string) => {
    const index = sessions.findIndex((s) => s.id === sessionId)
    if (index !== -1) {
      setCurrentSessionIndex(index)
      setSelectedSessionId(sessionId)
    }
  }

  const handlePreviewClick = () => {
    toast({
      variant: currentStep === 3 ? "default" : "custom",
      description: isMobile
        ? "Please fill out the form below to update the preview."
        : "Please fill out the form to update the preview.",
      step: currentStep,
      duration: currentStep === 3 ? 3000 : 1500,
    })
  }

  const handleToastShow = (message: string, type: "default" | "success" | "destructive" | "custom" = "default") => {
    toast({
      variant: currentStep === 3 ? type : "custom",
      description: message,
      step: currentStep,
      duration: currentStep === 3 ? 3000 : 1500,
    })
  }

  const renderStepContent = () => {
    if (!mounted) return null

    switch (currentStep) {
      case 1:
        return (
          <>
            <div className="col-span-full min-[1025px]:col-span-8 order-1 min-[1025px]:order-2">
              <EventPreview
                event={formData.eventDetails}
                isFormTouched={isFormTouched}
                onPreviewClick={handlePreviewClick}
              />
            </div>
            <div className="col-span-full min-[1025px]:col-span-4 order-2 min-[1025px]:order-1">
              <EventDetailsStep
                eventDetails={formData.eventDetails}
                errors={errors}
                handleChange={updateEventDetails}
                handleImageUpload={handleImageUpload}
                cardTitles={cardTitles}
                setIsFormTouched={setIsFormTouched}
                isValid={isValid}
              />
            </div>
          </>
        )
      case 2:
        return (
          <div className="col-span-full">
            <AddSessionsStep
              sessions={sessions}
              setSessions={updateSessions}
              currentSessionIndex={currentSessionIndex}
              setCurrentSessionIndex={setCurrentSessionIndex}
              eventStartTime={formData.eventDetails.startTime}
              eventEndTime={formData.eventDetails.endTime}
              onSessionChange={handleSessionChange}
              onAddSession={handleAddSession}
              setIsFormTouched={setIsFormTouched}
              onRemoveSession={handleRemoveSession}
              formData={formData}
              newSessionId={newSessionId}
              selectedSessionId={selectedSessionId}
              onPreviewClick={handlePreviewClick}
            />
          </div>
        )
      case 3:
        return (
          <div className="col-span-full">
            <UploadInviteesStep invitees={formData.invitees} setInvitees={updateInvitees} />
          </div>
        )
      case 4:
        return (
          <div className="col-span-full">
            <ReviewPublishStep
              eventDetails={formData.eventDetails}
              sessions={sessions}
              onEditEvent={() => setCurrentStep(1)}
              onEditSessions={() => setCurrentStep(2)}
              onToastShow={handleToastShow}
            />
          </div>
        )
      default:
        return null
    }
  }

  // Prevent hydration mismatch
  if (!mounted) {
    return null
  }

  return (
    <div className={`min-h-screen bg-[#1A1E2E] ${currentStep === 2 ? "pb-[216px] sm:pb-[144px]" : "pb-[144px]"}`}>
      <Header />
      <div className="sticky top-0 z-50 bg-[#1A1E2E] shadow-md">
        <div className="container mx-auto px-4 py-2">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="w-full">
              <StepProgress steps={steps} onStepClick={handleStepClick} currentStep={currentStep} />
            </div>
          </div>
        </div>
      </div>
      <div className={`pt-4 ${currentStep === 1 ? "pb-16 mobile:pb-4" : currentStep === 2 ? "pb-4" : ""}`}>
        <div className={`container mx-auto ${currentStep === 2 ? "px-2 sm:px-4" : "px-2 sm:px-4"}`}>
          <div className="flex justify-center">
            <div
              className={`w-full max-w-[1400px] grid grid-cols-1 sm:grid-cols-12 ${
                currentStep === 1 ? "gap-6" : currentStep === 2 ? "gap-2 sm:gap-4" : "gap-6"
              } mt-2`}
            >
              {renderStepContent()}
            </div>
          </div>
        </div>
      </div>

      {/* Session Thumbnail and Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-20">
        {currentStep === 2 && sessions.length > 0 && (
          <SessionThumbnailBar
            sessions={sessions}
            onAddSession={handleAddSession}
            onRemoveSession={handleRemoveSession}
            onSelectSession={handleSessionSelect}
            highlightedSessionId={highlightedSessionId}
            currentSessionId={currentSessionId}
            selectedSessionId={selectedSessionId}
          />
        )}
        <div className="bg-[#1A1E2E] border-t border-white/10">
          <div className="container mx-auto px-4 py-4">
            <BottomNavBar
              currentStep={currentStep}
              totalSteps={steps.length}
              onBack={handleBackStep}
              onNext={handleNextStep}
            />
          </div>
        </div>
      </div>
      <style jsx>{highlightStyles}</style>
      <Toaster currentStep={currentStep} />
    </div>
  )
}


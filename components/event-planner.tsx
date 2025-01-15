'use client'

import React, { useState, useEffect } from 'react'
import { EventDetails, EventFormErrors, Session } from "@/types/event"
import { Button } from "@/components/ui/button"
import { StepProgress, Step } from "@/components/step-progress"
import { EventPreview } from "@/components/event-preview"
import { EventDetailsStep } from "@/components/steps/EventDetailsStep"
import { AddSessionsStep } from "@/components/steps/AddSessionsStep"
import { UploadInviteesStep } from "@/components/steps/UploadInviteesStep"
import { ReviewPublishStep } from "@/components/steps/ReviewPublishStep"
import { addDays, isBefore, isAfter, parse } from "date-fns"

export function EventPlanner() {
  const [mounted, setMounted] = useState(false)
  const tomorrow = addDays(new Date(), 1)
  const [currentStep, setCurrentStep] = useState(1)
  const [highestStepReached, setHighestStepReached] = useState(1)
  const [eventDetails, setEventDetails] = useState<Partial<EventDetails>>({
    eventName: '',
    description: '',
    eventDate: tomorrow,
    startTime: '07:00',
    endTime: '19:00',
    registrationStart: tomorrow,
    registrationEnd: undefined,
    location: '',
    maxInvitations: 2500,
    backgroundImage: undefined,
  })
  const [sessions, setSessions] = useState<Session[]>([])
  const [invitees, setInvitees] = useState<string[]>([])
  const [errors, setErrors] = useState<EventFormErrors>({})
  const [isFormTouched, setIsFormTouched] = useState(false)

  // Handle hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const steps: Step[] = [
    { number: 1, title: "Event Details" },
    { number: 2, title: "Add Sessions" },
    { number: 3, title: "Upload Invitees" },
    { number: 4, title: "Review & Publish" }
  ].map(step => ({
    ...step,
    status: 
      step.number < highestStepReached ? "completed" :
      step.number === highestStepReached ? "current" :
      "upcoming"
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
      const startTime = parse(newDetails.startTime, 'HH:mm', new Date())
      const endTime = parse(newDetails.endTime, 'HH:mm', new Date())
      if (isAfter(startTime, endTime)) {
        newErrors.endTime = "End time cannot be earlier than start time"
      }
    }

    return newErrors
  }

  const handleChange = (changes: Partial<EventDetails>) => {
    const newDetails = { ...eventDetails, ...changes }
    const newErrors = validateDates(newDetails)

    setEventDetails(newDetails)
    setErrors(newErrors)
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

  const handleNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
      setHighestStepReached(prev => Math.max(prev, currentStep + 1))
    }
  }

  const renderStepContent = () => {
    if (!mounted) return null // Prevent hydration mismatch

    switch (currentStep) {
      case 1:
        return (
          <EventDetailsStep
            eventDetails={eventDetails}
            errors={errors}
            handleChange={handleChange}
            handleImageUpload={handleImageUpload}
          />
        )
      case 2:
        return <AddSessionsStep sessions={sessions} setSessions={setSessions} />
      case 3:
        return <UploadInviteesStep invitees={invitees} setInvitees={setInvitees} />
      case 4:
        return (
          <ReviewPublishStep
            eventDetails={eventDetails}
            sessions={sessions}
            invitees={invitees}
          />
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
    <div className="min-h-screen bg-[#1A1E2E]">
      <div className="container mx-auto px-4">
        <StepProgress steps={steps} onStepClick={handleStepClick} currentStep={currentStep} />
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-4">
          {/* Left Column - Event Form */}
          <div className="md:col-span-4">
            {renderStepContent()}
            <Button 
              className="w-full mt-6 bg-[#FF6B2C] hover:bg-[#FF8B3C] text-white rounded-md"
              onClick={handleNextStep}
              disabled={Object.keys(errors).length > 0}
            >
              {currentStep < 4 ? `Continue to Step ${currentStep + 1}` : "Publish Event"}
            </Button>
          </div>
          {/* Right Column - Event Preview */}
          <div className="md:col-span-8">
            <EventPreview event={eventDetails} isFormTouched={isFormTouched} />
          </div>
        </div>
      </div>
    </div>
  )
}


import React from 'react'
import { EventDetails, Session } from "@/types/event"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"

interface ReviewPublishStepProps {
  eventDetails: Partial<EventDetails>
  sessions: Session[]
  invitees: string[]
}

export function ReviewPublishStep({ eventDetails, sessions, invitees }: ReviewPublishStepProps) {
  return (
    <Card className="bg-[#2A3142] border-white/5 shadow-none rounded-lg">
      <CardHeader>
        <CardTitle className="text-white font-bold">Review & Publish</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-white font-semibold">Event Details</h3>
          <p className="text-white/80">Name: {eventDetails.eventName}</p>
          <p className="text-white/80">Date: {eventDetails.eventDate ? format(eventDetails.eventDate, 'dd/MM/yyyy') : 'Not set'}</p>
          <p className="text-white/80">Time: {eventDetails.startTime} - {eventDetails.endTime}</p>
          <p className="text-white/80">Description: {eventDetails.description}</p>
        </div>
        <div className="space-y-2">
          <h3 className="text-white font-semibold">Sessions</h3>
          {sessions.map((session, index) => (
            <div key={index} className="bg-[#1A1E2E] p-2 rounded-lg mb-2">
              <p className="text-white/80">Title: {session.title}</p>
              <p className="text-white/80">Time: {session.startTime} - {session.endTime}</p>
            </div>
          ))}
        </div>
        <div className="space-y-2">
          <h3 className="text-white font-semibold">Invitees</h3>
          <p className="text-white/80">Total invitees: {invitees.filter(email => email.trim() !== '').length}</p>
        </div>
      </CardContent>
    </Card>
  )
}


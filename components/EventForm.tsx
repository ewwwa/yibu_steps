"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { DatePicker } from "@/components/ui/date-picker"
import { TimePicker } from "@/components/ui/time-picker"

export function EventForm() {
  const [eventDetails, setEventDetails] = useState({
    name: "",
    date: "",
    startTime: "",
    endTime: "",
    location: "",
    description: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEventDetails((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="flex gap-8">
      <Card className="w-1/2 bg-[#2A3142] text-white">
        <CardHeader>
          <CardTitle>Create Event</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div>
              <Label htmlFor="name">Event Name</Label>
              <Input
                id="name"
                name="name"
                value={eventDetails.name}
                onChange={handleInputChange}
                className="bg-[#1A1E2E] border-white/10"
              />
            </div>
            <div>
              <Label htmlFor="date">Date</Label>
              <DatePicker
                id="date"
                name="date"
                value={eventDetails.date}
                onChange={(date) => setEventDetails((prev) => ({ ...prev, date }))}
                className="bg-[#1A1E2E] border-white/10"
              />
            </div>
            <div className="flex gap-4">
              <div className="w-1/2">
                <Label htmlFor="startTime">Start Time</Label>
                <TimePicker
                  id="startTime"
                  name="startTime"
                  value={eventDetails.startTime}
                  onChange={(time) => setEventDetails((prev) => ({ ...prev, startTime: time }))}
                  className="bg-[#1A1E2E] border-white/10"
                />
              </div>
              <div className="w-1/2">
                <Label htmlFor="endTime">End Time</Label>
                <TimePicker
                  id="endTime"
                  name="endTime"
                  value={eventDetails.endTime}
                  onChange={(time) => setEventDetails((prev) => ({ ...prev, endTime: time }))}
                  className="bg-[#1A1E2E] border-white/10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                value={eventDetails.location}
                onChange={handleInputChange}
                className="bg-[#1A1E2E] border-white/10"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={eventDetails.description}
                onChange={handleInputChange}
                className="bg-[#1A1E2E] border-white/10"
              />
            </div>
            <Button type="submit" className="w-full bg-[#FF6B2C] hover:bg-[#FF8B3C]">
              Create Event
            </Button>
          </form>
        </CardContent>
      </Card>
      <EventPreview {...eventDetails} />
    </div>
  )
}

function EventPreview({ name, date, startTime, endTime, location, description }) {
  return (
    <Card className="w-1/2 bg-[#2A3142] text-white">
      <CardHeader>
        <CardTitle>Event Preview</CardTitle>
      </CardHeader>
      <CardContent>
        <h2 className="text-2xl font-bold">{name || "Event Name"}</h2>
        <p>{date || "Date"}</p>
        <p>{startTime && endTime ? `${startTime} - ${endTime}` : "Time"}</p>
        <p>{location || "Location"}</p>
        <p className="mt-4">{description || "Event description"}</p>
      </CardContent>
    </Card>
  )
}


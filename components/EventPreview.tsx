import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"

interface EventPreviewProps {
  eventName: string
  startDate: Date | undefined
  endDate: Date | undefined
}

export default function EventPreview({ eventName, startDate, endDate }: EventPreviewProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Event Preview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">Event Name</h3>
            <p>{eventName || "Not specified"}</p>
          </div>
          <div>
            <h3 className="font-semibold">Registration Period</h3>
            <p>
              {startDate && endDate
                ? `${format(startDate, "PPP")} - ${format(endDate, "PPP")}`
                : "Not specified"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}


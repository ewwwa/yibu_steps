import React from 'react'
import { Session } from "@/types/event"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Plus, Trash2 } from 'lucide-react'

interface AddSessionsStepProps {
  sessions: Session[]
  setSessions: React.Dispatch<React.SetStateAction<Session[]>>
}

export function AddSessionsStep({ sessions, setSessions }: AddSessionsStepProps) {
  return (
    <Card className="bg-[#2A3142] border-white/5 shadow-none rounded-lg">
      <CardHeader>
        <CardTitle className="text-white font-bold">Add Sessions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {sessions.map((session, index) => (
          <div key={index} className="space-y-4 p-4 bg-[#1A1E2E] rounded-lg">
            <div className="flex justify-between items-center">
              <h3 className="text-white font-semibold">Session {index + 1}</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  const newSessions = [...sessions];
                  newSessions.splice(index, 1);
                  setSessions(newSessions);
                }}
              >
                <Trash2 className="h-4 w-4 text-white" />
              </Button>
            </div>
            <div className="space-y-2">
              <Label htmlFor={`session-${index}-title`} className="text-white">Title</Label>
              <Input
                id={`session-${index}-title`}
                value={session.title}
                onChange={(e) => {
                  const newSessions = [...sessions];
                  newSessions[index].title = e.target.value;
                  setSessions(newSessions);
                }}
                className="bg-[#2A3142] border-white/10 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`session-${index}-description`} className="text-white">Description</Label>
              <Textarea
                id={`session-${index}-description`}
                value={session.description}
                onChange={(e) => {
                  const newSessions = [...sessions];
                  newSessions[index].description = e.target.value;
                  setSessions(newSessions);
                }}
                className="bg-[#2A3142] border-white/10 text-white"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`session-${index}-start-time`} className="text-white">Start Time</Label>
                <Input
                  id={`session-${index}-start-time`}
                  type="time"
                  value={session.startTime}
                  onChange={(e) => {
                    const newSessions = [...sessions];
                    newSessions[index].startTime = e.target.value;
                    setSessions(newSessions);
                  }}
                  className="bg-[#2A3142] border-white/10 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`session-${index}-end-time`} className="text-white">End Time</Label>
                <Input
                  id={`session-${index}-end-time`}
                  type="time"
                  value={session.endTime}
                  onChange={(e) => {
                    const newSessions = [...sessions];
                    newSessions[index].endTime = e.target.value;
                    setSessions(newSessions);
                  }}
                  className="bg-[#2A3142] border-white/10 text-white"
                />
              </div>
            </div>
          </div>
        ))}
        <Button
          onClick={() => {
            setSessions([...sessions, { title: '', description: '', startTime: '', endTime: '' }]);
          }}
          className="w-full bg-[#1A1E2E] text-white hover:bg-[#2A3142]"
        >
          <Plus className="h-4 w-4 mr-2" /> Add Session
        </Button>
      </CardContent>
    </Card>
  )
}


import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface UploadInviteesStepProps {
  invitees: string[]
  setInvitees: React.Dispatch<React.SetStateAction<string[]>>
}

export function UploadInviteesStep({ invitees, setInvitees }: UploadInviteesStepProps) {
  return (
    <Card className="bg-[#2A3142] border-white/5 shadow-none rounded-lg">
      <CardHeader>
        <CardTitle className="text-white font-bold">Upload Invitees</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="invitees" className="text-white">Invitees (one email per line)</Label>
          <Textarea
            id="invitees"
            value={invitees.join('\n')}
            onChange={(e) => setInvitees(e.target.value.split('\n'))}
            className="bg-[#1A1E2E] border-white/10 text-white min-h-[200px]"
            placeholder="Enter email addresses, one per line"
          />
        </div>
        <div className="text-white">
          Total invitees: {invitees.filter(email => email.trim() !== '').length}
        </div>
      </CardContent>
    </Card>
  )
}


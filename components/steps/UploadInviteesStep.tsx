import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Users, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"

interface UploadInviteesStepProps {
  invitees: string[]
  setInvitees: React.Dispatch<React.SetStateAction<string[]>>
}

export function UploadInviteesStep({ invitees, setInvitees }: UploadInviteesStepProps) {
  return (
    <Card className="w-full bg-[#2A3142] border-white/5 shadow-none rounded-lg">
      <CardHeader className="pb-6">
        <CardTitle className="text-white font-bold">Upload Invitees</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          variant="secondary"
          className="bg-[#1A1E2E] hover:bg-[#141824] text-[#E65100] transition-colors duration-200"
          onClick={() => document.getElementById("xlsUpload")?.click()}
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload .xls
        </Button>
        <input
          type="file"
          id="xlsUpload"
          accept=".xls,.xlsx"
          className="hidden"
          onChange={(e) => {
            // Handle file upload logic here
            console.log("File selected:", e.target.files?.[0]?.name)
          }}
        />
        <div className="space-y-2">
          <Label htmlFor="invitees" className="text-white">
            Invitees (comma-separated email addresses)
          </Label>
          <Textarea
            id="invitees"
            value={invitees.join(", ")}
            onChange={(e) => setInvitees(e.target.value.split(",").map((email) => email.trim()))}
            className="bg-[#1A1E2E] border-white/10 text-white min-h-[200px] w-full"
            placeholder="Enter email addresses, separated by commas"
          />
        </div>
        <div className="inline-flex items-center px-2 py-1 rounded-sm bg-[#B23F00] text-[#1A1E2E] transition-colors duration-200">
          <Users className="w-4 h-4 mr-2" />
          <span>{invitees.filter((email) => email.trim() !== "").length}</span>
        </div>
      </CardContent>
    </Card>
  )
}


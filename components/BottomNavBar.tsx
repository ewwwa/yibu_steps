import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { SessionIndicator } from "@/components/session-indicator"
import type { Session } from "@/types/session"

interface BottomNavBarProps {
  currentStep: number
  totalSteps: number
  onBack: () => void
  onNext: () => void
  currentSession?: Partial<Session>
}

export function BottomNavBar({ currentStep, totalSteps, onBack, onNext, currentSession }: BottomNavBarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#1A1E2E] border-t border-white/10 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-4">
          {currentStep > 1 && (
            <Button
              onClick={onBack}
              variant="secondary"
              className="bg-[#1A1E2E] hover:bg-[#141824] text-[#E65100] transition-colors duration-200"
            >
              Back
            </Button>
          )}
          {currentStep === 2 && currentSession && <SessionIndicator session={currentSession} />}
        </div>
        <Button onClick={onNext} className="bg-[#E65100] hover:bg-[#B23F00] text-white">
          {currentStep < totalSteps ? (
            <>
              Next <ArrowRight className="ml-2 h-4 w-4" />
            </>
          ) : (
            "Publish"
          )}
        </Button>
      </div>
    </div>
  )
}


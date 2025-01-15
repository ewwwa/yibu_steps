import React from 'react'
import { Check } from 'lucide-react'
import { cn } from "@/lib/utils"

export type Step = {
  number: number
  title: string
  status: "upcoming" | "current" | "completed"
}

interface StepProgressProps {
  steps: Step[]
  onStepClick: (stepNumber: number) => void
  currentStep: number
}

export function StepProgress({ steps, onStepClick, currentStep }: StepProgressProps) {
  return (
    <div className="w-full max-w-4xl mx-auto mb-4">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            <div 
              className={cn(
                "flex flex-col items-center cursor-pointer",
                step.status === "upcoming" && "cursor-not-allowed"
              )}
              onClick={() => step.status !== "upcoming" && onStepClick(step.number)}
            >
              <div
                className={cn(
                  "w-10 h-10 rounded-full border-2 flex items-center justify-center font-medium bg-[#1A1E2E]",
                  {
                    "border-[#229C5D] bg-[#229C5D] text-white": step.status === "completed",
                    "border-[#FF6B2C] text-[#FF6B2C]": step.status === "current",
                    "border-white/20 text-white/40": step.status === "upcoming"
                  }
                )}
              >
                {step.status === "completed" || (step.status === "current" && step.number < currentStep) ? (
                  <Check className="h-5 w-5 text-white" />
                ) : (
                  step.number
                )}
              </div>
              <span
                className={cn(
                  "text-sm text-center mt-2",
                  {
                    "text-white font-medium": step.status !== "upcoming",
                    "text-white/40": step.status === "upcoming"
                  }
                )}
              >
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className="flex-1 h-[2px] bg-white/20">
                <div 
                  className="h-full bg-[#229C5D] transition-all duration-300 ease-in-out"
                  style={{ 
                    width: step.status === "completed" || (step.status === "current" && step.number < currentStep) ? "100%" : "0%" 
                  }}
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}


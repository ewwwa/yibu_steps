import React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

export type Step = {
  number: number
  title: string
  mobileTitle?: string
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
      <div className="flex items-center justify-between px-4">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            <div
              className={cn(
                "flex flex-col items-center cursor-pointer shrink-0",
                step.status === "upcoming" && "cursor-not-allowed",
              )}
              onClick={() => step.status !== "upcoming" && onStepClick(step.number)}
            >
              <div
                className={cn(
                  "w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 flex items-center justify-center text-sm sm:text-base font-medium",
                  {
                    "border-[#4CAF50] bg-[#1A1E2E] text-[#4CAF50]": step.status === "completed",
                    "border-[#E65100] bg-[#1A1E2E] text-[#E65100]": step.status === "current",
                    "border-white/20 bg-[#1A1E2E] text-white/40": step.status === "upcoming",
                  },
                )}
              >
                {step.status === "completed" || (step.status === "current" && step.number < currentStep) ? (
                  <Check className="h-4 w-4 sm:h-5 sm:w-5 text-[#4CAF50]" />
                ) : (
                  step.number
                )}
              </div>
              <span
                className={cn("text-xs sm:text-sm text-center mt-2 whitespace-nowrap", {
                  "text-[#4CAF50] font-medium": step.status === "completed",
                  "text-white font-medium": step.status === "current",
                  "text-white/40": step.status === "upcoming",
                })}
              >
                <span className="hidden sm:inline">{step.title}</span>
                <span className="sm:hidden">{step.mobileTitle || step.title}</span>
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className="flex-1 h-[2px] bg-white/20 mx-2 sm:mx-4">
                <div
                  className="h-full bg-[#4CAF50] transition-all duration-300 ease-in-out"
                  style={{
                    width:
                      step.status === "completed" || (step.status === "current" && step.number < currentStep)
                        ? "100%"
                        : "0%",
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


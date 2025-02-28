"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="flex h-[100vh] w-full flex-col items-center justify-center gap-4">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Something went wrong!</h2>
        <p className="text-white/60">
          {error.message || "An unexpected error occurred"}
          {error.digest && <span className="block text-sm">Digest: {error.digest}</span>}
        </p>
        <Button onClick={reset} className="bg-[#E65100] hover:bg-[#B23F00] text-white">
          Try again
        </Button>
      </div>
    </div>
  )
}


import { EventForm } from "@/components/event-form"

export default function Page() {
  return (
    <div className="min-h-screen bg-[#1A1E2E]">
      <main className="py-8">
        <div className="container mx-auto px-4">
          {/* Removed: <h1 className="text-2xl font-bold text-white mb-6">Event Date & Registration</h1> */}
          <EventForm />
        </div>
      </main>
    </div>
  )
}


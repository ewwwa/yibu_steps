import { Header } from "@/components/header"
import { EventPlanner } from "@/components/event-planner"

export default function Page() {
  return (
    <div className="min-h-screen bg-[#1A1E2E]">
      <Header />
      <main className="py-8">
        <div className="container mx-auto px-4">
          <EventPlanner />
        </div>
      </main>
    </div>
  )
}


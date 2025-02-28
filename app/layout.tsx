import { cn } from "@/lib/utils"
import "./globals.css"
import type React from "react"
import { Suspense } from "react"
import Loading from "./loading"
import { Toaster } from "@/components/ui/toaster"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={cn("min-h-screen bg-[#111827] text-white antialiased")}>
        <Suspense fallback={<Loading />}>{children}</Suspense>
        <Toaster />
      </body>
    </html>
  )
}



import './globals.css'

export const metadata = {
      generator: 'v0.dev'
    };

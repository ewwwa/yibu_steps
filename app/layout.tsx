import { cn } from "@/lib/utils"
import "./globals.css"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#111827] text-white antialiased">
        {children}
      </body>
    </html>
  )
}


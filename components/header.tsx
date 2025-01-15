import Link from "next/link"
import Image from "next/image"

export function Header() {
  return (
    <header className="border-b border-white/10">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-yibu-WpTDQzXD2Y3gLfIKA4tHK10YYdGBMo.png"
            alt="YIBU Logo"
            width={180}
            height={60}
            className="h-14 w-auto pb-2"
            priority
          />
        </Link>
        <nav>
          <span className="font-bold">Event Planner</span>
        </nav>
      </div>
    </header>
  )
}


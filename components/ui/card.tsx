import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { collapsible?: boolean }>(
  ({ className, collapsible, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-lg border bg-card text-card-foreground shadow-sm",
        collapsible && "overflow-hidden",
        className,
      )}
      {...props}
    />
  ),
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { collapsible?: boolean; onToggle?: () => void; isOpen?: boolean }
>(({ className, collapsible, onToggle, isOpen, children, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-row items-center justify-between space-y-1.5 p-6", className)} {...props}>
    <div className="flex-1">{children}</div>
    {collapsible && (
      <button
        onClick={(e) => {
          e.preventDefault()
          onToggle?.()
        }}
        className="rounded-full p-2 hover:bg-white/5"
        aria-label={isOpen ? "Collapse" : "Expand"}
      >
        <ChevronDown
          className={cn("h-6 w-6 text-white/40 transition-transform duration-200", isOpen ? "rotate-180" : "")}
        />
      </button>
    )}
  </div>
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("text-2xl font-semibold leading-none tracking-tight", className)} {...props} />
  ),
)
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
  ),
)
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />,
)
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
  ),
)
CardFooter.displayName = "CardFooter"

const CollapsibleCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { isOpen: boolean }
>(({ className, isOpen, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "overflow-hidden transition-all duration-200 ease-in-out",
        isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0",
        className,
      )}
    >
      <div className={cn(isOpen ? "pt-1 pb-3" : "py-0")}>
        <CardContent {...props} />
      </div>
    </div>
  )
})
CollapsibleCardContent.displayName = "CollapsibleCardContent"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, CollapsibleCardContent }


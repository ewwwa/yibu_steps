"use client"

import type * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"
import { format } from "date-fns"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  const CustomNavigation = ({ month, onPreviousClick, onNextClick }: any) => (
    <div className="flex items-center justify-between px-1">
      <button onClick={onPreviousClick} className="p-2">
        <ChevronLeft className="h-5 w-5 text-white" />
      </button>
      <div className="text-lg font-bold text-white">{format(month, "MMMM yyyy")}</div>
      <button onClick={onNextClick} className="p-2">
        <ChevronRight className="h-5 w-5 text-white" />
      </button>
    </div>
  )

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell: "text-white/60 rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-[#FF6B2C]",
        day: "h-9 w-9 p-0 font-normal text-white aria-selected:opacity-100 hover:bg-white/10",
        day_selected: "bg-[#FF6B2C] text-white hover:bg-[#FF6B2C] hover:text-white focus:bg-[#FF6B2C] focus:text-white",
        day_today: "bg-transparent border border-[#2A3142]",
        day_outside: "text-white/40 opacity-50",
        day_disabled: "text-white/40 opacity-50",
        day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        Navigation: CustomNavigation,
      }}
      {...props}
    />
  )
}

Calendar.displayName = "Calendar"

export { Calendar }


"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { errorContainer } from "@/lib/helper"
import CalendarIconAsset from "@/assets/CalendarIcon"

function FormDatePicker({
    name,
    placeholder = "Select date",
    runForm = null,
    showError = true,
    className,
    buttonClassName,
    ...props
}) {
    const [open, setOpen] = React.useState(false)
    const value = runForm?.values[name]

    return (
        <div className={cn("relative", className)}>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className={cn(
                            "w-full h-11.25 border-muted-foreground rounded-md text-left font-normal px-4 bg-white justify-between",
                            !value && "text-muted-foreground",
                            buttonClassName
                        )}
                        {...props}
                    >
                        <span className="text-[14px]">
                            {value ? format(value, "PPP") : placeholder}
                        </span>
                        <CalendarIconAsset width={16} height={16} color="#858585" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={value}
                        onSelect={(date) => {
                            runForm?.setFieldValue(name, date)
                            setOpen(false)
                        }}
                        initialFocus
                    />
                </PopoverContent>
            </Popover>
            {runForm && showError && (
                <div className="absolute left-0 top-full min-h-4">
                    {errorContainer(runForm, name)}
                </div>
            )}
        </div>
    )
}

export { FormDatePicker }

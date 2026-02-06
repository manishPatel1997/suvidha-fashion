"use client"

import * as React from "react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { errorContainer } from "@/lib/helper"

function FormSelect({
    name,
    options = [],
    placeholder = "Select option",
    runForm = null,
    showError = true,
    className,
    triggerClassName,
    ...props
}) {
    return (
        <div className={cn("relative", className)}>
            <Select
                onValueChange={(value) => runForm?.setFieldValue(name, value)}
                value={runForm?.values[name] || ""}
                {...props}
            >
                <SelectTrigger className={cn(
                    "h-11.25! px-4 py-1 border-muted-foreground rounded-md text-muted-foreground text-[14px] w-full bg-white",
                    triggerClassName
                )}>
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent className="bg-[#F8F5F2] border-[#dcccbd]">
                    {options.map((option) => (
                        <SelectItem
                            key={option.value}
                            value={option.value}
                            className="data-[state=checked]:bg-[#dcccbd] data-[state=checked]:text-primary-foreground"
                        >
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {runForm && showError && (
                <div className="absolute left-0 top-full min-h-4">
                    {errorContainer(runForm, name)}
                </div>
            )}
        </div>
    )
}

export { FormSelect }

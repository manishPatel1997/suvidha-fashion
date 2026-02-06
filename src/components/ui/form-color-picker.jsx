"use client"

import * as React from "react"
import { Pencil } from "lucide-react"
import { cn } from "@/lib/utils"
import { errorContainer } from "@/lib/helper"

function FormColorPicker({
    name,
    placeholder = "Pick a color",
    runForm = null,
    showError = true,
    className,
    ...props
}) {
    const color = runForm?.values[name] || "#D9D1C7"
    const inputRef = React.useRef(null)

    return (
        <div className={cn("relative", className)}>
            <div
                onClick={() => inputRef.current?.click()}
                className={cn(
                    "flex items-center gap-3 border border-muted-foreground rounded-md px-4 h-11.25 bg-white cursor-pointer hover:border-primary transition-colors",
                    runForm?.touched[name] && runForm?.errors[name] && "border-destructive"
                )}
            >
                <div
                    className="w-5 h-5 rounded"
                    style={{ backgroundColor: color }}
                />
                <span className="text-[14px] text-muted-foreground font-sans flex-1">
                    {runForm?.values[name] ? runForm.values[name] : placeholder}
                </span>
                <Pencil className="w-4 h-4 text-muted-foreground" />
            </div>

            <input
                ref={inputRef}
                type="color"
                className="absolute opacity-0 pointer-events-none"
                value={color}
                onChange={(e) => {
                    runForm?.setFieldValue(name, e.target.value)
                }}
                onBlur={runForm?.handleBlur(name)}
                {...props}
            />

            {runForm && showError && (
                <div className="absolute left-0 top-full min-h-4">
                    {errorContainer(runForm, name)}
                </div>
            )}
        </div>
    )
}

export { FormColorPicker }

import * as React from "react"
import { cn } from "@/lib/utils"
import { errorContainer } from "@/lib/helper"

function FileInput({
    className,
    placeholder = "Attach file",
    icon,
    showError = true,
    runForm = null,
    name,
    ...props
}) {
    const fileName = runForm?.values[name] || ""

    return (
        <div className="relative">
            <div className={cn(
                "flex items-center gap-3 border border-muted-foreground rounded-md px-4 h-11.25 bg-white",
                className
            )}>
                {icon}
                <span className="text-[14px] text-muted-foreground font-sans truncate">
                    {fileName || placeholder}
                </span>
            </div>
            <input
                type="file"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={(e) => {
                    const file = e.target.files[0]
                    if (file && runForm) {
                        runForm.setFieldValue(name, file.name)
                    }
                }}
                {...props}
            />
            {/* Error container with fixed height and absolute position */}
            {runForm && showError && (
                <div className="absolute left-0 top-full min-h-4">
                    {errorContainer(runForm, name)}
                </div>
            )}
        </div>
    )
}

export { FileInput }

import * as React from "react"
import { cn } from "@/lib/utils"
import { errorContainer } from "@/lib/helper"
import { Label } from "@/components/ui/label"
import { FileText, Paperclip } from "lucide-react"

export function UploadPdf({
    className,
    label = "Upload PDF",
    placeholder = "Attach PDF",
    showError = true,
    runForm = null,
    name,
    readOnly = false,
    isFloating = true,
    ...props
}) {
    const id = React.useId()
    const value = runForm?.values[name] || ""
    const fileName = typeof value === "object" ? value?.name : (typeof value === "string" ? value.split('/').pop() : "")
    const hasValue = !!fileName

    return (
        <div className="relative w-full">
            <div className={cn(
                "group relative flex items-center gap-3 border border-muted-foreground rounded-md px-3 h-12 bg-transparent transition-all",
                isFloating ? "pt-2" : "py-2",
                readOnly && "border-[#dcccbd] cursor-default",
                !readOnly && "focus-within:ring-1 focus-within:ring-muted-foreground",
                className
            )}>
                {fileName && <Paperclip className="w-5 h-5 text-[#A67F6F] shrink-0 scale-x-[-1] rotate-[44deg]" />}
                <span className={cn(
                    "text-[16px] text-[#1A1A1A] font-sans truncate pr-4 transition-all",
                    isFloating && !hasValue && "opacity-0"
                )}>
                    {fileName || (!isFloating && placeholder)}
                </span>

                {!readOnly && (
                    <input
                        id={id}
                        type="file"
                        accept="application/pdf"
                        className="absolute inset-0 opacity-0 cursor-pointer peer"
                        onChange={(e) => {
                            const file = e.target.files[0]
                            if (file && runForm) {
                                runForm.setFieldValue(name, file)
                            }
                        }}
                        {...props}
                    />
                )}

                {label && (
                    <Label
                        htmlFor={id}
                        className={cn(
                            "select-none absolute left-3 text-[#B0826A] text-[14px] font-semibold capitalize leading-none duration-150 transform scale-100 z-10 origin-left bg-white px-1 transition-all",
                            isFloating ? (
                                hasValue
                                    ? "top-2 -translate-y-4"
                                    : "top-4 translate-y-0 bg-transparent peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:bg-white peer-focus:px-1"
                            ) : "relative"
                        )}
                    >
                        {label}
                    </Label>
                )}
            </div>

            {/* Error container with absolute position below the input */}
            {runForm && showError && (
                <div className="absolute left-0 top-full min-h-4">
                    {errorContainer(runForm, name)}
                </div>
            )}
        </div>
    )
}

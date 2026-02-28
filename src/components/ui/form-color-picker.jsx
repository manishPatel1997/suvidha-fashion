// "use client"

// import * as React from "react"
// import { Pencil } from "lucide-react"
// import { cn } from "@/lib/utils"
// import { errorContainer } from "@/lib/helper"
// import { Label } from "@/components/ui/label"

// function FormColorPicker({
//     name,
//     label,
//     placeholder = "Pick a color",
//     runForm = null,
//     showError = true,
//     className,
//     isEdit = false,
//     readOnly = false,
//     ...props
// }) {
//     const color = runForm?.values[name] || "#D9D1C7"
//     const inputRef = React.useRef(null)
//     const id = React.useId()

//     const hasValue = !!runForm?.values[name]

//     return (
//         <div className={cn("relative", className)}>
//             <div
//                 onClick={() => !readOnly && inputRef.current?.click()}
//                 className={cn(
//                     "flex items-center gap-3 border border-muted-foreground rounded-md px-4 h-12 bg-white transition-colors",
//                     readOnly ? "cursor-default select-none" : "cursor-pointer hover:border-primary",
//                     runForm?.touched[name] && runForm?.errors[name] && "border-destructive"
//                 )}
//             >
//                 <div
//                     className="w-5 h-5 rounded"
//                     style={{ backgroundColor: color }}
//                 />
//                 <span className={cn(
//                     "text-[16px] text-[#1A1A1A] font-sans flex-1 transition-all duration-150",
//                     // label && "pt-4",
//                     !runForm?.values[name] && "text-muted-foreground opacity-0"
//                 )}>
//                     {runForm?.values[name] ? runForm.values[name] : placeholder}
//                 </span>
//                 {isEdit && <Pencil className="w-4 h-4 text-muted-foreground" />}
//             </div>

//             {label && (
//                 <Label
//                     htmlFor={id}
//                     className={cn(
//                         "absolute left-3 transition-all duration-150 transform z-10 origin-left pointer-events-none px-1 bg-white truncate max-w-[calc(100%-40px)]",
//                         "text-[#B0826A] text-[14px] font-semibold capitalize leading-none",
//                         hasValue
//                             ? "top-2 -translate-y-4 scale-100 bg-white"
//                             : "top-4 translate-y-0 scale-100 bg-transparent"
//                     )}
//                     style={{ fontFamily: "Lato" }}
//                 >
//                     {label}
//                 </Label>
//             )}

//             <input
//                 id={id}
//                 ref={inputRef}
//                 type="color"
//                 className="absolute opacity-0 pointer-events-none"
//                 value={color}
//                 disabled={readOnly}
//                 onChange={(e) => {
//                     !readOnly && runForm?.setFieldValue(name, e.target.value)
//                 }}
//                 onBlur={runForm?.handleBlur(name)}
//                 {...props}
//             />

//             {runForm && showError && (
//                 <div className="absolute left-0 top-full min-h-4">
//                     {errorContainer(runForm, name)}
//                 </div>
//             )}
//         </div>
//     )
// }

// export { FormColorPicker }

"use client"

import * as React from "react"
import { Pencil } from "lucide-react"
import { cn } from "@/lib/utils"
import { errorContainer } from "@/lib/helper"
import { Label } from "@/components/ui/label"

function FormColorPicker({
    name,
    label,
    placeholder = "Pick a color",
    runForm = null,
    showError = true,
    className,
    isEdit = false,
    readOnly = false,
    isFloating = true,
    ...props
}) {
    const id = React.useId()
    const inputRef = React.useRef(null)

    const value = runForm?.values[name] || ""

    return (
        <div className={cn("relative w-full", className)}>

            {/* Hidden real color input */}
            <input
                id={id}
                ref={inputRef}
                type="color"
                value={value || "#D9D1C7"}
                disabled={readOnly}
                onChange={(e) => {
                    !readOnly && runForm?.setFieldValue(name, e.target.value)
                }}
                onBlur={runForm?.handleBlur}
                className="absolute opacity-0 pointer-events-none peer"
                {...props}
            />

            {/* Visible UI */}
            <div
                onClick={() => !readOnly && inputRef.current?.click()}
                className={cn(
                    "flex items-center gap-3 border border-muted-foreground rounded-md px-4 bg-white transition-colors min-h-[45px]",
                    isFloating ? "pt-6 pb-1" : "py-0",
                    readOnly
                        ? "cursor-default select-none"
                        : "cursor-pointer hover:border-primary",
                    runForm?.touched?.[name] &&
                    runForm?.errors?.[name] &&
                    "border-muted-foreground"
                )}
            >
                <div
                    className="w-5 h-5 rounded"
                    style={{ backgroundColor: value || "#D9D1C7" }}
                />

                <span
                    className={cn(
                        "text-[16px] text-[#1A1A1A] flex-1 transition-all duration-150",
                        !value && "text-muted-foreground"
                    )}
                >
                    {value || placeholder}
                </span>

                {isEdit && (
                    <Pencil className="w-4 h-4 text-muted-foreground" />
                )}
            </div>

            {/* Floating Label */}
            {isFloating && label && (
                <Label
                    htmlFor={id}
                    className="absolute left-3 top-2 text-[#B0826A] text-[14px] font-semibold capitalize leading-none duration-150 transform -translate-y-4 scale-100 z-10 origin-left bg-white px-1
                    peer-placeholder-shown:scale-100 
                    peer-placeholder-shown:translate-y-0 
                    peer-placeholder-shown:top-4 
                    peer-placeholder-shown:bg-transparent
                    peer-focus:top-2 
                    peer-focus:-translate-y-4 
                    peer-focus:bg-white 
                    peer-focus:px-1"
                >
                    {label}
                </Label>
            )}

            {/* Error */}
            {runForm && showError && (
                <div className="absolute left-0 top-full min-h-4">
                    {errorContainer(runForm, name)}
                </div>
            )}
        </div>
    )
}

export { FormColorPicker }
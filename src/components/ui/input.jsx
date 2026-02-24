import * as React from "react"

import { cn } from "@/lib/utils"
import { errorContainer, formAttr } from "@/lib/helper";

function Input({
  className,
  type,
  showError = true,
  customHandle = false,
  runForm = null,
  ...props
}) {
  return (
    <div className="relative">
      <input
        type={type}
        data-slot="input"
        className={cn(
          // "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-[10px] border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          // "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "focus-visible:ring-0 focus-visible:border-muted-foreground",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          "h-14 text-[18px] border-muted-foreground transition-colors",
          className
        )}
        {...(runForm && !customHandle ? formAttr(runForm, props.name) : {})}
        {...(runForm && customHandle ? { onBlur: runForm.handleBlur } : {})}
        {...props}
      />
      {props?.icon && (
        <span
          className="absolute left-4 top-1/2 -translate-y-1/2  text-muted-foreground"
        >
          {props.icon}
        </span>
      )}
      {/* Error container with fixed height and absolute position */}
      {runForm && showError && <div className="absolute left-0 top-full min-h-4 ">
        {errorContainer(runForm, props.name)}
      </div>}
    </div>
  );
}

export { Input }

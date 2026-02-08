import * as React from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { errorContainer, formAttr } from "@/lib/helper";

export function FloatingTextarea({
  label,
  className,
  showError = true,
  customHandle = false,
  runForm = null,
  isFloating = true,
  ...props
}) {
  const id = React.useId();
  return (
    <div className="relative w-full">
      <textarea
        id={id}
        className={cn(
          "block w-full rounded-md border border-muted-foreground bg-transparent px-3 text-[16px] text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-muted-foreground peer resize-none min-h-25 transition-colors",
          isFloating ? "pb-1 pt-6" : "py-3",
          "focus-visible:ring-0 focus-visible:border-primary",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          "read-only:focus:ring-0 read-only:border-[#dcccbd] read-only:cursor-default",
          className,
        )}
        placeholder={isFloating ? " " : label || props.placeholder}
        {...(runForm && !customHandle ? formAttr(runForm, props.name) : {})}
        {...(runForm && customHandle ? { onBlur: runForm.handleBlur } : {})}
        {...props}
      />
      {isFloating && label && (
        <Label
          htmlFor={id}
          className="select-none absolute left-3 placeholder:text-muted-foreground top-2 text-[#B0826A] text-[14px] font-semibold capitalize leading-none duration-150 transform -translate-y-4 scale-100 z-10 origin-left bg-white px-1
          peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:top-4 peer-placeholder-shown:bg-transparent
          peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:bg-white peer-focus:px-1"
        >
          {label}
        </Label>
      )}
      {/* Error container with fixed height and absolute position */}
      {runForm && showError && (
        <div className="absolute left-0 top-full min-h-4 ">
          {errorContainer(runForm, props.name)}
        </div>
      )}
    </div>
  );
}

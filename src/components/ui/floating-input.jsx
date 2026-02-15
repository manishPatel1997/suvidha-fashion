import * as React from "react";
import { Label } from "@/components/ui/label";
import { Edit2 } from "lucide-react"; // content: "Edit2" is used in the component
import clsx from "clsx";
import { errorContainer, formAttr } from "@/lib/helper";

export function FloatingInput({
  label,
  hasEdit,
  className,
  showError = true,
  customHandle = false,
  runForm = null,
  ...props
}) {
  const id = React.useId();
  return (
    <div className="relative">
      <input
        id={id}
        className={clsx(
          "block h-12 w-full rounded-md border border-muted-foreground bg-transparent px-3 pb-1 text-[16px] text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-muted-foreground peer",
          className,
        )}
        placeholder=" "
        {...(runForm && !customHandle ? formAttr(runForm, props.name) : {})}
        {...(runForm && customHandle ? { onBlur: runForm.handleBlur } : {})}
        {...props}
      />
      <Label
        htmlFor={id}
        className="absolute left-3 top-2 text-[#B0826A] text-[14px] font-semibold capitalize leading-none duration-150 transform -translate-y-4 scale-100 z-10 origin-left bg-white px-1
        peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:top-4 peer-placeholder-shown:bg-transparent
        peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:bg-white peer-focus:px-1"
        style={{ fontFamily: "Lato" }}
      >
        {label}
      </Label>
      {hasEdit && (
        <Edit2 className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer pointer-events-none" />
      )}

      {/* Error container with absolute position below the input */}
      {runForm && showError && (
        <div className="absolute left-0 top-full min-h-4">
          {errorContainer(runForm, props.name)}
        </div>
      )}
    </div>
  );
}

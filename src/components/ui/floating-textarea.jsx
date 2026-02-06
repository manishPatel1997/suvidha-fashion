import * as React from "react";
import { Label } from "@/components/ui/label";
import clsx from "clsx";

export function FloatingTextarea({ label, className, ...props }) {
  const id = React.useId();
  return (
    <div className="relative">
      <textarea
        id={id}
        className={clsx(
          "block w-full rounded-[6px] border border-[#858585] bg-transparent px-3 pb-1 pt-6 text-[16px] text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-[#858585] peer resize-none min-h-[100px]",
          className,
        )}
        placeholder=" "
        {...props}
      />
      <Label
        htmlFor={id}
        className="absolute left-3 top-2 text-[#B0826A] text-[14px] font-semibold capitalize leading-none duration-150 transform -translate-y-4 scale-100 z-10 origin-[0] bg-white px-1
        peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:top-4 peer-placeholder-shown:bg-transparent
        peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:bg-white peer-focus:px-1"
        style={{ fontFamily: "Lato" }}
      >
        {label}
      </Label>
    </div>
  );
}

"use client"

import * as React from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import CloseIcon from "@/assets/CloseIcon"
import { cn } from "@/lib/utils"

export function CommonModal({
    open,
    onOpenChange,
    title,
    children,
    className,
    contentClassName,
    containerClassName
}) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className={cn(
                    "max-w-[95vw] sm:max-w-295.5 w-[90%] lg:w-full p-0 border-none bg-[#FFFFFF] shadow-none rounded-design overflow-hidden block!",
                    className
                )}
                showCloseButton={false}
            >
                <div className={cn(
                    "relative w-full min-h-fit flex items-center justify-center px-4 py-10 sm:px-6 sm:py-10 lg:px-23.2 lg:py-21",
                    containerClassName
                )}>
                    <button
                        onClick={() => onOpenChange(false)}
                        className="absolute top-4 right-4 sm:top-6 sm:right-6 md:top-8 md:right-10 text-primary-foreground hover:opacity-70 transition-opacity z-20"
                    >
                        <CloseIcon width={17} height={17} color="#1a1a1a" />
                    </button>

                    <div className={cn(
                        "border-2 border-[#dcccbd] rounded-[20px] overflow-hidden bg-white w-full max-w-248.5 flex flex-col",
                        contentClassName
                    )}>
                        {title && (
                            <DialogHeader className="m-0 p-0">
                                <DialogTitle className="text-[20px] p-2.5 font-semibold text-center font-sans tracking-wide text-primary-foreground bg-[#F8F5F2] border-b-2 border-[#dcccbd]">
                                    {title}
                                </DialogTitle>
                            </DialogHeader>
                        )}
                        {children}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

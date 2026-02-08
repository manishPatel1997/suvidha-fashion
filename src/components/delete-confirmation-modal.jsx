"use client"

import * as React from "react"
import { Trash2 } from "lucide-react"
import { CommonModal } from "./CommonModal"
import { Button } from "@/components/ui/button"
import DeleteIcon from "@/assets/DeleteIcon"

export function DeleteConfirmationModal({
    open,
    onOpenChange,
    onConfirm,
    title = "Are you sure?",
    description = "Are you sure you want to delete this? This action can't be undone"
}) {
    return (
        <CommonModal
            open={open}
            onOpenChange={onOpenChange}
            className="sm:max-w-[500px]"
            contentClassName="max-w-[440px] border-none shadow-none bg-transparent"
            containerClassName="py-10 lg:px-10 lg:py-10"
        >
            <div className="bg-white rounded-[20px] overflow-hidden flex flex-col p-8 items-center text-center">
                {/* Icon */}
                <DeleteIcon />

                {/* Text Content */}
                <h2 className="text-[24px] font-bold text-primary-foreground mb-2">
                    {title}
                </h2>
                <p className="text-[16px] text-muted-foreground mb-8 text-center max-w-[280px] leading-snug">
                    {description}
                </p>

                {/* Actions */}
                <div className="flex items-center gap-4 w-full">
                    <Button
                        variant="ghost"
                        onClick={() => onOpenChange(false)}
                        className="flex-1 h-12 bg-[#F8F5F2] hover:bg-[#F3F0EC] text-primary-foreground rounded-[10px] text-[18px] font-semibold"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={() => {
                            if (onConfirm) onConfirm()
                            onOpenChange(false)
                        }}
                        className="flex-1 h-12 bg-[#CB7171] hover:bg-[#B66565] text-white rounded-[10px] text-[18px] font-semibold"
                    >
                        Delete
                    </Button>
                </div>
            </div>
        </CommonModal>
    )
}

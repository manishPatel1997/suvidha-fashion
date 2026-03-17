"use client"

import * as React from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit2, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

export function VendorCard({
    id,
    name,
    category,
    contact,
    address,
    onEdit,
    onDelete,
    className
}) {
    return (
        <Card className={cn("w-full border border-[#dcccbd] rounded-[10px] bg-white overflow-hidden shadow-none flex flex-col py-0 gap-0", className)}>
            {/* Header Area */}
            <div className="bg-[#f8f5f2] px-5 py-3 border-b border-[#dcccbd]">
                <h3 className="text-[18px] font-bold text-primary-foreground truncate">
                    {name}
                </h3>
            </div>

            {/* Content Area */}
            <div className="px-5 py-4 flex-1 space-y-3">
                <div className="grid grid-cols-[80px_1fr] gap-2 items-baseline">
                    <span className="text-[14px] text-[#B0826A] font-medium">Category</span>
                    <span className="text-[14px] text-primary-foreground font-semibold truncate capitalize">{category}</span>
                </div>

                <div className="grid grid-cols-[80px_1fr] gap-2 items-baseline border-t border-[#dcccbd]/30 pt-3">
                    <span className="text-[14px] text-[#B0826A] font-medium">Contact</span>
                    <span className="text-[14px] text-primary-foreground font-semibold truncate">{contact}</span>
                </div>

                <div className="grid grid-cols-[80px_1fr] gap-2 items-baseline border-t border-[#dcccbd]/30 pt-3">
                    <span className="text-[14px] text-[#B0826A] font-medium">Address</span>
                    <span className="text-[14px] text-primary-foreground font-semibold line-clamp-3">
                        {address}
                    </span>
                </div>
            </div>

            {/* Footer Area */}
            <div className="px-5 py-3 border-t border-[#dcccbd] flex items-center gap-3">
                <Button
                    variant="outline"
                    onClick={onEdit}
                    className="flex-1 h-9 bg-[#F8F5F2] hover:bg-[#F3F0EC] border-[#dcccbd] text-primary-foreground gap-2 text-[14px] font-semibold"
                >
                    <Edit2 className="w-3.5 h-3.5" />
                    Edit
                </Button>
                <Button
                    variant="outline"
                    onClick={onDelete}
                    className="flex-1 h-9 bg-[#F8F5F2] hover:bg-[#CB7171]/10 border-[#dcccbd] text-[#CB7171] hover:text-[#CB7171] gap-2 text-[14px] font-semibold"
                >
                    <Trash2 className="w-3.5 h-3.5 mr-0.5" />
                    Delete
                </Button>
            </div>
        </Card>
    )
}

import { statusColors } from '@/lib/helper'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import React from 'react'

function PostProductionItemCard({ item, onClick, titleName = "Sample ID" }) {
    const status = item?.status || "running" // default to running for showing "In Process"
    const assignedName = item?.assign_user_name || "Name"
    const sampleId = item?.sample_id || "S-480"

    return (
        <div className="flex flex-col w-[218px] rounded-[12px] bg-white border border-[#dcccbd] p-4  space-y-2">
            {/* Header */}
            <div className="px-1 pt-1">
                <span className="text-[13px] font-medium text-primary-foreground">
                    {titleName}: {sampleId}
                </span>
            </div>

            {/* Image Container */}
            <div
                onClick={onClick}
                className="relative w-[184px] h-[116px] cursor-pointer hover:opacity-95 transition-opacity rounded-[10px] overflow-hidden border border-[#dcccbd]/40"
            >
                <Image
                    src={item?.src || "/design-thumb.png"}
                    alt="Work item"
                    fill
                    className="object-cover"
                />
            </div>

            {/* Footer */}
            <div className="px-1 pb-1 space-y-1.5 mt-1">
                <div className="flex items-center justify-between">
                    <span className="text-[13px] text-[#A67F6F] font-medium font-sans">Status:</span>
                    <div className={cn(
                        "px-2.5 py-0.5 rounded-full text-[10px] font-medium",
                        statusColors[status] || "bg-[#EAB308] text-white"
                    )}>
                        {status === 'running' ? "In Process" : status}
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-[13px] text-[#A67F6F] font-medium font-sans">Assign:</span>
                    <span className="text-[14px] font-semibold text-primary-foreground truncate ml-1 font-sans">
                        {assignedName}
                    </span>
                </div>
            </div>
        </div>
    )
}

export default PostProductionItemCard

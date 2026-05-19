import { BASE_URL } from '@/lib/api'
import { statusColors } from '@/lib/helper'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import React from 'react'

function PostProductionItemCard({ item, onClick, titleName = "Sample ID" }) {
    const status = item?.status || "running" // default to running for showing "In Process"
    const assignedName = item?.sample_details?.name || item?.sample_details?.assign_name || ""
    const sampleId = item?.sample_details?.sample_id || ""
    return (
        <div
            onClick={onClick}
            className="flex flex-col w-[218px] rounded-[12px] bg-white border border-[#dcccbd] p-4 space-y-2 cursor-pointer hover:shadow-md transition-all group"
        >
            {/* Header */}
            <div className="flex flex-col items-center gap-1 border-b border-[#DCCCBD]/50 pb-2">
                <span className="text-[13px] font-semibold text-primary-foreground font-sans">
                    {titleName}: {sampleId}
                </span>
            </div>

            {/* Image Container */}
            <div
                className="relative w-[184px] h-[116px] rounded-[10px] overflow-hidden border border-[#dcccbd]/40 group-hover:opacity-95 transition-opacity"
            >
                <Image
                    src={item?.image_url ? `${BASE_URL}${item.image_url}` : "/design-thumb.png"}
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

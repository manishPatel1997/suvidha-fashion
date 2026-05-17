import { statusColors } from '@/lib/helper'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import React from 'react'

function PostMillCard({ item, onClick }) {
    const status = item?.status || "running" // default to running for showing "In Process"
    const assignedName = item?.sample_details?.name || item?.sample_details?.assign_name || ""
    const imagesArray = Array.from({ length: 4 }).map((_, i) => item?.images?.[i] || null)

    return (
        <div
            onClick={onClick}
            className="flex flex-col w-[218px] rounded-[12px] bg-white border border-[#dcccbd] p-4 space-y-2 cursor-pointer hover:shadow-md transition-all group"
        >
            {/* Header */}
            <div className="flex flex-col items-center gap-1 border-b border-[#DCCCBD]/50 pb-2">
                <span className="text-[13px] font-semibold text-primary-foreground font-sans">
                    Sample ID: {item?.sample_details?.sample_id || ""}
                </span>
            </div>

            {/* Image Grid */}
            <div className="grid grid-cols-2 gap-[8px]">
                {imagesArray.map((val, idx) => (
                    val?.image_url ? (
                        <div
                            key={idx}
                            className="relative aspect-square rounded-[8px] overflow-hidden border border-[#DCCCBD]/40 group-hover:opacity-90 transition-opacity"
                        >
                            <Image
                                src={`${process.env.NEXT_PUBLIC_API_URL}${val.image_url}`}
                                alt={`Work item ${idx + 1}`}
                                fill
                                className="object-cover"
                            />
                        </div>
                    ) : (
                        <div
                            key={idx}
                            className="aspect-square rounded-[8px] bg-[#E6D9CB]/30 border border-dashed border-[#B0826A]/40 flex items-center justify-center group-hover:bg-[#E6D9CB]/50 transition-colors"
                        >
                            <span className="text-xl font-light text-[#B0826A] group-hover:scale-110 transition-transform">+</span>
                        </div>
                    )
                ))}
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

export default PostMillCard

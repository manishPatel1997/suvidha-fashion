import { cn } from '@/lib/utils'
import Image from 'next/image'
import React from 'react'

const statusColors = {
    Pending: "bg-[#858585] text-white",
    "In Process": "bg-[#EAB308] text-white",
    Completed: "bg-[#22C55E] text-white",
}

function WorkItemCard({ item, onClick, isFabric = false, isYarn = false, isSequence = false, isStatus = false }) {
    const src = typeof item === "string" ? item : item.src
    const status = item?.status || "Completed"
    const assignedName = item?.assignedName || "Name"
    return (
        <div className="flex flex-col w-full sm:w-[162px] rounded-[12px] overflow-hidden bg-[#F8F5F2] border border-[#dcccbd]/30">
            <div
                onClick={onClick}
                className="relative h-[124px] w-full cursor-pointer hover:opacity-90 transition-opacity"
            >
                <Image
                    src={src}
                    alt="Work item"
                    fill
                    className="object-cover"
                />
                {isStatus && status && (
                    <div className={cn(
                        "absolute top-2 right-2 px-2.5 py-0 rounded-full text-[10px] font-medium",
                        statusColors[status]
                    )}>
                        {status}
                    </div>
                )}
            </div>
            {isFabric ?
                <div className="space-y-1 py-1">
                    <ObjVal title="Fabric" value={assignedName} />
                    <ObjVal title="Meter" value={assignedName} />
                </div>
                :
                isYarn ?
                    <div className="space-y-1 py-1">
                        <ObjVal title="Yarn" value={assignedName} />
                        <ObjVal title="Yarn num cons" value={assignedName} />
                    </div>

                    :
                    isSequence ?
                        <div className="space-y-1 py-1">
                            <ObjVal title="Sequence" value={assignedName} />
                            <ObjVal title="Sequence CD" value={assignedName} />
                        </div>
                        :
                        <div className="px-3 py-2 flex items-center justify-between">
                            <span className="text-[13px] text-[#A67F6F] font-medium">Assign:</span>
                            <span className="text-[14px] font-semibold text-primary-foreground truncate ml-1">
                                {assignedName}
                            </span>
                        </div>
            }
        </div>
    )
}

export default WorkItemCard


function ObjVal({ title, value }) {
    return (
        <div className="px-3 flex items-center justify-between">
            <span className="text-[13px] text-[#A67F6F] font-medium">{title}:</span>
            <span className="text-[14px] font-semibold text-primary-foreground truncate ml-1">
                {value}
            </span>
        </div>
    )
}
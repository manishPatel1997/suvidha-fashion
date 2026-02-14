import { statusColors } from '@/lib/helper'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import React from 'react'

function WorkItemCard({ item, onClick, isFabric = false, isYarn = false, isSequence = false, isStatus = false, priority = false }) {
    const status = item?.status || "Completed"
    const assignedName = item?.assignedName || "Name"
    return (
        <div className="flex flex-col w-full sm:w-[162px] rounded-[12px] overflow-hidden bg-[#F8F5F2] border border-[#dcccbd]/30">
            <div
                onClick={onClick}
                className="relative h-[124px] w-full cursor-pointer hover:opacity-90 transition-opacity"
            >
                <Image
                    src={item.src}
                    alt="Work item"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 150px"
                    priority={priority}
                    loading={priority ? undefined : "lazy"}
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
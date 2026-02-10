import { statusColors } from '@/lib/helper'
import { cn } from '@/lib/utils'
import Image from 'next/image'

function ProductionItemCard({ id = "S-480", status = "Pending", src = "/design-thumb.png" }) {
    return (
        <div className='flex items-center gap-4 p-3 border border-[#dcccbd]/30 rounded-[10px] w-full h-[95px] bg-[#f8f5f2]'>
            <div className="relative w-[100px] h-[68px] cursor-pointer  hover:opacity-90 ">
                <Image
                    src={src}
                    alt="Work item"
                    fill
                    className="object-cover"
                />
            </div>
            <div className="flex flex-col gap-2 flex-1">
                <div className="flex items-center justify-between">
                    <span className="text-[14px] text-[#A67F6F] font-medium">Sample ID:</span>
                    <span className="text-[15px] font-bold text-primary-foreground">{id}</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-[14px] text-[#A67F6F] font-medium">Status:</span>
                    <div className="px-3 py-0.5 bg-[#858585] text-white text-[10px] font-medium rounded-full">
                        <div className={cn(
                            "px-0 py-0 rounded-full text-[10px] font-medium",
                            statusColors[status]
                        )}>
                            {status}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductionItemCard
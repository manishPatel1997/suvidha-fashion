import { statusColors } from '@/lib/helper'
import { cn } from '@/lib/utils'
import Image from 'next/image'

function ProductionItemCard({ sample_id, status = "pending", image, image_url, onClick }) {
    const displayId = sample_id ? `S-${sample_id}` : "N/A"
    const imgPath = image_url || image
    const imageUrl = imgPath ? `${process.env.NEXT_PUBLIC_API_URL}${imgPath}` : "/design-thumb.png"

    return (
        <div
            onClick={onClick}
            className='flex items-center gap-4 p-3 border border-[#dcccbd]/30 rounded-[10px] w-full h-[95px] bg-[#f8f5f2] cursor-pointer hover:bg-[#F0EDE9] transition-colors group'
        >
            <div className="relative w-[100px] h-[68px]">
                <Image
                    src={imageUrl}
                    alt="Work item"
                    fill
                    className="object-cover rounded-sm group-hover:scale-105 transition-transform duration-300"
                />
            </div>
            <div className="flex flex-col gap-2 flex-1">
                <div className="flex items-center justify-between">
                    <span className="text-[14px] text-[#A67F6F] font-medium">Sample ID:</span>
                    <span className="text-[15px] font-bold text-primary-foreground">{displayId}</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-[14px] text-[#A67F6F] font-medium">Status:</span>
                    <div className={cn(
                        "px-3 py-0.5 text-[10px] font-medium rounded-full",
                        statusColors[status.toLowerCase()] || "bg-gray-500 text-white"
                    )}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductionItemCard
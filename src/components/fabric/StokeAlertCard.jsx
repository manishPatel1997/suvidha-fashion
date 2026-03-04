import React from 'react'
import { Card } from '@/components/ui/card'
import { TriangleAlert } from 'lucide-react'

function StokeAlertCard() {
    return (
        <Card className="@container w-full border border-[#dcccbd] rounded-[10px] bg-white overflow-hidden shadow-none py-0 gap-0 min-w-0 relative">
            {/* Header */}
            <div className="bg-[#fcf8f4] px-[19px] py-[10px] border-b border-[#dcccbd] flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <TriangleAlert className='size-4 text-[#C26B6E]' />
                    <span className="text-[#C26B6E] font-semibold text-[18px] "> Stock Alert</span>
                </div>
            </div>
            {/* Main Content */}
            <div className="*:border-b *:border-[#dcccbd] [&>*:last-child]:border-b-0 *:px-[19px] *:py-3 *:flex *:items-center *:gap-2">
                <div>
                    <span className=''>Fabric ID:F-1280</span>
                    -
                    <span className='text-[#C26B6E]'>Low stock: 08 meter needed</span>
                </div>
                <div>
                    <span className=''>Fabric ID:F-1280</span>
                    -
                    <span className='text-[#C26B6E]'>Low stock: 08 meter needed</span>
                </div>
                <div>
                    <span className=''>Fabric ID:F-1280</span>
                    -
                    <span className='text-[#C26B6E]'>Low stock: 08 meter needed</span>
                </div>
            </div>

        </Card>
    )
}

export default StokeAlertCard
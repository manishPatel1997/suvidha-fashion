'use client'
import { Button } from '@/components/ui/button'
import { WorkflowProgressCard } from '@/components/workflow-progress-card'
import { ChevronLeft } from 'lucide-react'
import { useState } from 'react'

function page() {
    const [isModalOpen, setIsModalOpen] = useState(false)
    return (
        <div className="space-y-8">
            <div className="flex flex-row sm:items-center justify-between gap-4">
                <h1 className="text-[28px] sm:text-[35px] md:text-[45px] font-serif font-bold text-primary-foreground flex items-center gap-3">
                    <ChevronLeft className="w-[1em] h-[1em] text-primary-foreground" />
                    <span>Pre Production</span>
                </h1>
                <Button
                    className="bg-[#dcccbd] hover:bg-[#dcccbd]/90 text-primary-foreground  px-4 rounded-lg gap-2 font-semibold"
                >
                    Design ID: D-1425
                </Button>
            </div>

            <WorkflowProgressCard
                title="1. Inspirations"
                progress={50}
                currentCount={5}
                totalCount={20}
                images={[
                    "/design-thumb.png",
                    "/design-thumb.png",
                    "/design-thumb.png",
                ]}
            />
            <WorkflowProgressCard
                title="2. Sketches"
                progress={50}
                currentCount={5}
                totalCount={20}
                images={[
                    "/design-thumb.png",
                    "/design-thumb.png",
                    "/design-thumb.png",
                ]}
                IsBlur
            />
        </div>
    )
}

export default page

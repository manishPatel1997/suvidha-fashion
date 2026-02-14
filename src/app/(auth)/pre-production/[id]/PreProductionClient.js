'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { WorkflowProgressCard } from '@/components/workflow-progress-card'
import { SampleWorkflowCard } from '@/components/sample-workflow-card'
import { ChevronLeft } from 'lucide-react'
import { AddDetailsModal } from '@/components/add-details-modal'
import { AddDesignModal } from '@/components/add-design-modal'

export function PreProductionClient({ id, inspirationData }) {
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
    const [isDesignModalOpen, setIsDesignModalOpen] = useState(false)

    const designId = inspirationData?.design_slug_id
    // const inspirations = inspirationData?.inspirations?.map(img => `${process.env.NEXT_PUBLIC_API_URL}${img.image}`) || []
    console.log('inspirationData', inspirationData)

    return (
        <div className="space-y-8">
            <div className="flex flex-row sm:items-center justify-between gap-4">
                <h1 className="text-[26px] sm:text-[35px] md:text-[45px] font-serif font-bold text-primary-foreground flex items-center gap-1 sm:gap-3">
                    <ChevronLeft className="w-[1em] h-[1em] text-primary-foreground" />
                    <span className='text-nowrap sm:text-normal '>Pre Production</span>
                </h1>
                <Button
                    className="text-[12px] sm:text-[14px] bg-[#dcccbd] hover:bg-[#dcccbd]/90 text-primary-foreground  sm:px-4 rounded-lg gap-2 font-semibold"
                >
                    Design ID: {designId || `D-${id}`}
                </Button>
            </div>

            {inspirationData &&
                <WorkflowProgressCard
                    defaultOpen
                    title="1. Inspirations"
                    inspirationData={inspirationData}
                    onCompleted={() => setIsDetailsModalOpen(true)}
                />
            }
            {/* <WorkflowProgressCard
                title="2. Sketches"
                progress={50}
                currentCount={5}
                totalCount={20}
                images={[
                    "/design-thumb.png",
                    "/design-thumb.png",
                    "/design-thumb.png",
                ]}
            // IsBlur
            />
            <WorkflowProgressCard
                title="3. Design"
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
                title="4. Fabric"
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
                title="5. Yarn"
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
                title="6. Sequence"
                progress={50}
                currentCount={5}
                totalCount={20}
                images={[
                    "/design-thumb.png",
                    "/design-thumb.png",
                    "/design-thumb.png",
                ]}
            /> */}

            {/* <SampleWorkflowCard
                title="7. Sample"
                progress={50}
                onAddDesign={() => setIsDetailsModalOpen(true)}
            /> */}

            <AddDetailsModal
                open={isDetailsModalOpen}
                onOpenChange={setIsDetailsModalOpen}
                onAdd={(values) => console.log("Added details:", values)}
            />

            <AddDesignModal
                open={isDesignModalOpen}
                onOpenChange={setIsDesignModalOpen}
                onAdd={(values) => console.log("Added design:", values)}
            />
        </div>
    )
}

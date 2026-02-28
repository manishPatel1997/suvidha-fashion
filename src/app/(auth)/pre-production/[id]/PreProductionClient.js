'use client'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { SampleWorkflowCard } from '@/components/sample-workflow-card'
import { usePost } from '@/hooks/useApi'
import { StateUpdate } from '@/lib/helper'
import { InspirationsCardView } from '@/components/pre-production/inspirations/InspirationsCardView'
import { API_LIST_AUTH } from '@/hooks/api-list'
import { SketchesCardView } from '@/components/pre-production/sketches/SketchesCardView'
import PageHeader from '@/components/PageHeader'

export function PreProductionClient({ id, inspirationData = null, sketchesData = null, visualDesignersData = null, fabricData = null, yarnData = null, sequencesData = null, sampleData = null }) {
    const [PreData, setPreData] = useState({
        inspirationData: inspirationData,
        sketchesData: sketchesData,
        visualDesignersData: visualDesignersData,
        fabricData: fabricData,
        yarnData: yarnData,
        sequencesData: sequencesData,
        sampleData: sampleData,
    })

    useEffect(() => {
        // Only update if the props are different from what we've already stored
        // This prevents an extra render on mount since we already initialized useState with these props
        if (
            PreData.inspirationData !== inspirationData ||
            PreData.sketchesData !== sketchesData ||
            PreData.visualDesignersData !== visualDesignersData ||
            PreData.fabricData !== fabricData ||
            PreData.yarnData !== yarnData ||
            PreData.sequencesData !== sequencesData ||
            PreData.sampleData !== sampleData
        ) {
            setPreData({
                inspirationData: inspirationData,
                sketchesData: sketchesData,
                visualDesignersData: visualDesignersData,
                fabricData: fabricData,
                yarnData: yarnData,
                sequencesData: sequencesData,
                sampleData: sampleData,
            })
        }
    }, [inspirationData, sketchesData, visualDesignersData, fabricData, yarnData, sequencesData, sampleData])

    const designId = inspirationData?.design_slug_id

    const useFetchAndStore = (api, stateKey) => {
        return usePost(api, {
            onSuccess: (res) => {
                if (res?.success) {
                    StateUpdate(
                        { [stateKey]: res?.data || null },
                        setPreData
                    );
                }
            },
            onError: (error) => {
                console.error(`Error fetching ${stateKey}:`, error);
            },
        });
    };

    // const inspirations = inspirationData?.inspirations?.map(img => `${process.env.NEXT_PUBLIC_API_URL}${img.image}`) || []
    const { mutate: getInspirationData } = useFetchAndStore(
        API_LIST_AUTH.Sketches.get,
        "sketchesData"
    );

    const { mutate: getVisualDesignersData } = useFetchAndStore(
        API_LIST_AUTH.VisualDesigners.get,
        "visualDesignersData"
    );

    const { mutate: getFabricData } = useFetchAndStore(
        API_LIST_AUTH.Fabric.get,
        "fabricData"
    );

    const { mutate: getYarnData } = useFetchAndStore(
        API_LIST_AUTH.Yarn.get,
        "yarnData"
    );

    const { mutate: getSequencesData } = useFetchAndStore(
        API_LIST_AUTH.Sequences.get,
        "sequencesData"
    );

    const { mutate: getSampleData } = useFetchAndStore(
        API_LIST_AUTH.Sample.get,
        "sampleData"
    );


    return (
        <div className="space-y-8">
            <div className="flex flex-row sm:items-center justify-between gap-4">
                {/* <Link href="/dashboard">
                    <h1 className="text-[26px] sm:text-[35px] md:text-[45px] font-serif font-bold text-primary-foreground flex items-center gap-1 sm:gap-3">
                        <ChevronLeft className="w-[1em] h-[1em] text-primary-foreground" />
                        <span className='text-nowrap sm:text-normal '>Pre Production</span>
                    </h1>
                </Link> */}
                <PageHeader
                    title="Pre Production"
                    href="/dashboard"
                    preserveQuery
                />
                <Button
                    className="text-[12px] sm:text-[14px] bg-[#dcccbd] hover:bg-[#dcccbd]/90 text-primary-foreground  sm:px-4 rounded-lg gap-2 font-semibold"
                >
                    Design ID: {designId || `${id}`}
                </Button>
            </div>

            {PreData.inspirationData &&
                <InspirationsCardView
                    getInspirationData={getInspirationData}
                    defaultOpen
                    title="1. Inspirations"
                    inspirationData={PreData.inspirationData}
                />
            }
            {PreData.sketchesData &&
                <SketchesCardView
                    title="2. Sketches"
                    sketchesData={PreData.sketchesData}
                    getVisualDesignersData={getVisualDesignersData}
                />
            }
            {PreData.visualDesignersData &&
                <SketchesCardView
                    title="3. Design"
                    sketchesData={PreData.visualDesignersData}
                    getVisualDesignersData={getFabricData}
                />
            }
            {PreData.fabricData &&
                <SketchesCardView
                    title="4. Fabric"
                    // sketchesData={{ ...PreData.fabricData, assign: PreData.fabricData?.assign || [] }}
                    sketchesData={PreData.fabricData}
                    getVisualDesignersData={getYarnData}
                />
            }
            {
                PreData.yarnData &&
                <SketchesCardView
                    title="5. Yarn"
                    sketchesData={PreData.yarnData}
                    getVisualDesignersData={getSequencesData}
                />
            }
            {
                PreData.sequencesData &&
                <SketchesCardView
                    title="6. Sequences"
                    sketchesData={PreData.sequencesData}
                    getVisualDesignersData={getSampleData}
                />
            }
            {PreData.sampleData &&
                <SampleWorkflowCard
                    PreData={PreData}
                    title="7. Sample"
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

            {/* <AddDesignModal
                open={isDesignModalOpen}
                onOpenChange={setIsDesignModalOpen}
                onAdd={(values) => console.log("Added design:", values)}
            /> */}
        </div>
    )
}

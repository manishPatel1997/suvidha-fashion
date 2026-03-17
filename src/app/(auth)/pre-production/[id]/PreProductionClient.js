'use client'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { SampleWorkflowCard } from '@/components/pre-production/sample-workflow-card'
import { usePost } from '@/hooks/useApi'
import { StateUpdate } from '@/lib/helper'
import { InspirationsCardView } from '@/components/pre-production/inspirations/InspirationsCardView'
import { API_LIST_AUTH } from '@/hooks/api-list'
import { SketchesCardView } from '@/components/pre-production/sketches/SketchesCardView'
import PageHeader from '@/components/PageHeader'
import usePreProductionStore from '@/store/preProductionStore'

export function PreProductionClient({ id, inspirationData = null, sketchesData = null, visualDesignersData = null, fabricData = null, yarnData = null, sequencesData = null, sampleData = null }) {
    console.log('yarnData', yarnData)
    const [PreData, setPreData] = useState({
        inspirationData: inspirationData,
        sketchesData: sketchesData,
        visualDesignersData: visualDesignersData,
        fabricData: fabricData,
        yarnData: yarnData,
        sequencesData: sequencesData,
        sampleData: sampleData,
    })

    const { setFabricAssignData, setYarnAssignData, setSequenceAssignData } = usePreProductionStore()

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

    useEffect(() => {
        if (fabricData) {
            setFabricAssignData(fabricData.fabrics)
        }
        if (yarnData) {
            setYarnAssignData(yarnData.yarns)
        }
        if (sequencesData) {
            setSequenceAssignData(sequencesData.sequences)
        }
    }, [fabricData, yarnData, sequencesData])

    const designId = inspirationData?.design_slug_id

    const useFetchAndStore = (api, stateKey, extraOnSuccess) => {
        return usePost(api, {
            onSuccess: (res) => {
                if (res?.success) {
                    const data = res?.data || null;

                    StateUpdate(
                        { [stateKey]: data },
                        setPreData
                    );

                    // 🔥 extra custom logic
                    if (extraOnSuccess) {
                        extraOnSuccess(data);
                    }
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
        "fabricData",
        (data) => {
            setFabricAssignData(data?.fabrics || []);
        }
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

    const getFabricAndSampleData = (payload) => {
        getFabricData(payload);
        getSampleData(payload);
    };


    const [stepStatuses, setStepStatuses] = useState({})

    const isStepDone = (stepData, stepKey) => {
        const trackedStatus = stepStatuses[stepKey]
        const dataStatus = stepData?.status
        const status = trackedStatus || dataStatus
        return status === "completed" || status === "skipped"
    }

    const updateStepStatus = (stepKey, status) => {
        setStepStatuses(prev => ({ ...prev, [stepKey]: status }))
        // Also update PreData so the prop passed to the card matches the local state immediately
        setPreData(prev => ({
            ...prev,
            [stepKey]: prev[stepKey] ? { ...prev[stepKey], status } : { status }
        }))
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-row sm:items-center justify-between gap-4">
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

            <InspirationsCardView
                isLocked={isStepDone(PreData.inspirationData, 'inspirationData')}
                getInspirationData={getInspirationData}
                defaultOpen
                title="1. Inspirations"
                inspirationData={PreData.inspirationData}
                onStatusChange={(status) => updateStepStatus('inspirationData', status)}
            />
            <SketchesCardView
                isLocked={!isStepDone(PreData.inspirationData, 'inspirationData')}
                title="2. Sketches"
                sketchesData={PreData.sketchesData}
                getVisualDesignersData={getVisualDesignersData}
                onStatusChange={(status) => updateStepStatus('sketchesData', status)}
            />
            <SketchesCardView
                isLocked={!isStepDone(PreData.sketchesData, 'sketchesData')}
                title="3. Design"
                sketchesData={PreData.visualDesignersData}
                getVisualDesignersData={getFabricData}
                onStatusChange={(status) => updateStepStatus('visualDesignersData', status)}
            />
            <SketchesCardView
                isLocked={!isStepDone(PreData.visualDesignersData, 'visualDesignersData')}
                title="4. Fabric"
                sketchesData={PreData.fabricData}
                getVisualDesignersData={getYarnData}
                onStatusChange={(status) => updateStepStatus('fabricData', status)}
            />
            <SketchesCardView
                isLocked={!isStepDone(PreData.fabricData, 'fabricData')}
                title="5. Yarn"
                sketchesData={PreData.yarnData}
                getVisualDesignersData={getSequencesData}
                onStatusChange={(status) => updateStepStatus('yarnData', status)}
            />
            <SketchesCardView
                isLocked={!isStepDone(PreData.yarnData, 'yarnData')}
                title="6. Sequences"
                sketchesData={PreData.sequencesData}
                getVisualDesignersData={getFabricAndSampleData}
                onStatusChange={(status) => updateStepStatus('sequencesData', status)}
            />
            <SampleWorkflowCard
                isLocked={!isStepDone(PreData.sequencesData, 'sequencesData')}
                PreData={PreData}
                title="7. Sample"
                onStatusChange={(status) => updateStepStatus('sampleData', status)}
            />
        </div>
    )
}

'use client'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { SampleWorkflowCard } from '@/components/pre-production/sample-workflow-card'
import { usePost } from '@/hooks/useApi'
import { StateUpdate } from '@/lib/helper'
import { InspirationsCardView } from '@/components/pre-production/inspirations/InspirationsCardView'
import { SketchesCardView } from '@/components/pre-production/sketches/SketchesCardView'
import PageHeader from '@/components/PageHeader'
import usePreProductionStore from '@/store/preProductionStore'

export function PreProductionClient({ designData, id, inspirationData = null, sketchesData = null, visualDesignersData = null, fabricData = null, yarnData = null, sequencesData = null, sampleData = null }) {
    const [PreData, setPreData] = useState({
        inspirationData: inspirationData,
        sketchesData: sketchesData,
        visualDesignersData: visualDesignersData,
        fabricData: fabricData,
        yarnData: yarnData,
        sequencesData: sequencesData,
        sampleData: sampleData,
    })
    const { setFabricAssignData, setYarnAssignData, setSequenceAssignData, setDesignAssignData } = usePreProductionStore()

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
        if (visualDesignersData) {
            setDesignAssignData(visualDesignersData.assign)
        }
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

    const getSketchDataClick = (payload) => {
        const updatedInspirationData = { ...PreData.inspirationData, images: payload.images, status: payload.status, inspiration_target: payload.inspiration_target, note: payload.note }
        setPreData(prev => ({
            ...prev,
            inspirationData: updatedInspirationData,
        }))
    }


    const getVisualDesignersDataClick = (payload) => {
        const updatedInspirationData = { ...PreData.sketchesData, assign: payload.assign, note: payload.note, status: payload.status, sketche_target: payload.sketche_target }
        setPreData(prev => ({
            ...prev,
            sketchesData: updatedInspirationData,
        }))
    }

    const getFabricDataClick = (payload) => {
        const updatedInspirationData = {
            ...PreData.visualDesignersData,
            assign: payload.assign,
            note: payload.note,
            status: payload.status,
            visual_designer_target: payload.visual_designer_target
        }
        setPreData(prev => ({
            ...prev,
            visualDesignersData: updatedInspirationData,
        }))
    }

    const getYarnDataClick = (payload) => {
        const updatedInspirationData = {
            ...PreData.fabricData,
            fabrics: payload.assign,
            note: payload.note,
            status: payload.status,
            fabric_target: payload.fabric_target
        }
        setPreData(prev => ({
            ...prev,
            fabricData: updatedInspirationData,
        }))
    }

    const getSequencesDataClick = (payload) => {
        const updatedInspirationData = {
            ...PreData.yarnData,
            yarns: payload.assign,
            note: payload.note,
            status: payload.status,
            yarn_target: payload.yarn_target
        }
        setPreData(prev => ({
            ...prev,
            yarnData: updatedInspirationData,
        }))
    }

    const getSampleDataClick = (payload) => {
        const updatedInspirationData = {
            ...PreData.sequencesData,
            sequences: payload.assign,
            note: payload.note,
            status: payload.status,
            sequence_target: payload.sequence_target
        }
        setPreData(prev => ({
            ...prev,
            sequencesData: updatedInspirationData,
        }))
    }

    const getFabricAndSampleData = (payload) => {
        getSampleDataClick(payload);
    };

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
                    Design ID: {designData?.design_slug_id || `${id}`}
                </Button>
            </div>
            <InspirationsCardView
                getInspirationData={getSketchDataClick}
                defaultOpen
                title="1. Inspirations"
                inspirationData={PreData.inspirationData}
            />
            <SketchesCardView
                title="2. Sketches"
                sketchesData={PreData.sketchesData}
                getVisualDesignersData={getVisualDesignersDataClick}
            />
            <SketchesCardView
                title="3. Design"
                sketchesData={PreData.visualDesignersData}
                getVisualDesignersData={getFabricDataClick}
            />
            <SketchesCardView
                title="4. Fabric"
                sketchesData={PreData.fabricData}
                getVisualDesignersData={getYarnDataClick}
            />
            <SketchesCardView
                title="5. Yarn"
                sketchesData={PreData.yarnData}
                getVisualDesignersData={getSequencesDataClick}
            />
            <SketchesCardView
                title="6. Sequences"
                sketchesData={PreData.sequencesData}
                getVisualDesignersData={getFabricAndSampleData}
            />
            <SampleWorkflowCard
                PreData={PreData}
                title="7. Sample"
            />
        </div>
    )
}

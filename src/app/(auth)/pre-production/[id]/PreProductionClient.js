'use client'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { SampleWorkflowCard } from '@/components/pre-production/sample-workflow-card'
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

    const getSketchDataClick = (payload) => {
        setPreData(prev => ({
            ...prev,
            inspirationData: { ...prev.inspirationData, ...payload },
        }))
    }


    const getVisualDesignersDataClick = (payload) => {
        setPreData(prev => ({
            ...prev,
            sketchesData: { ...prev.sketchesData, ...payload, sketche_target: payload.sketche_target },
        }))
    }

    const getFabricDataClick = (payload) => {
        setPreData(prev => ({
            ...prev,
            visualDesignersData: { ...prev.visualDesignersData, ...payload, visual_designer_target: payload.visual_designer_target },
        }))
    }

    const getYarnDataClick = (payload) => {
        setPreData(prev => ({
            ...prev,
            fabricData: { ...prev.fabricData, ...payload, fabrics: payload.assign, fabric_target: payload.fabric_target },
        }))
    }

    const getSequencesDataClick = (payload) => {
        setPreData(prev => ({
            ...prev,
            yarnData: { ...prev.yarnData, ...payload, yarns: payload.assign, yarn_target: payload.yarn_target },
        }))
    }

    const getSampleDataClick = (payload) => {
        setPreData(prev => ({
            ...prev,
            sequencesData: { ...prev.sequencesData, ...payload, sequences: payload.assign, sequence_target: payload.sequence_target },
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
                designId={id}
            />
            <SketchesCardView
                title="2. Sketches"
                sketchesData={PreData.sketchesData}
                getVisualDesignersData={getVisualDesignersDataClick}
                designId={id}
            />
            <SketchesCardView
                title="3. Design"
                sketchesData={PreData.visualDesignersData}
                getVisualDesignersData={getFabricDataClick}
                designId={id}
            />
            <SketchesCardView
                title="4. Fabric"
                sketchesData={PreData.fabricData}
                getVisualDesignersData={getYarnDataClick}
                designId={id}
            />
            <SketchesCardView
                title="5. Yarn"
                sketchesData={PreData.yarnData}
                getVisualDesignersData={getSequencesDataClick}
                designId={id}
            />
            <SketchesCardView
                title="6. Sequences"
                sketchesData={PreData.sequencesData}
                getVisualDesignersData={getFabricAndSampleData}
                designId={id}
            />
            <SampleWorkflowCard
                PreData={PreData}
                title="7. Sample"
            />
        </div>
    )
}

"use client"

import * as React from "react"
import { PlusIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import LockBlur from "@/assets/LockBlur"
import clsx from "clsx"
import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from "@/components/ui/accordion"
import { modalOpen, StateUpdate } from "@/lib/helper"
import { usePost } from "@/hooks/useApi"
import dynamic from "next/dynamic"

const EditTargetModal = dynamic(() =>
    import("@/components/edit-target-modal").then((mod) => mod.EditTargetModal)
)
const AddImageModal = dynamic(() =>
    import("@/components/add-image-modal").then((mod) => mod.AddImageModal)
)
import { API_LIST_AUTH } from "@/hooks/api-list"
import WorkItemCard from "@/components/pre-production/WorkItemCard"
import { DesignViewModalImage } from "./DesignViewModalImage"
import { FabricViewModalImage } from "../FabricViewModalImage"
import { YarnViewModalImage } from "../YarnViewModalImage"
import { toast } from "sonner"

const SketchesViewImage = dynamic(() =>
    import("@/components/pre-production/sketches/SketchesViewModal").then((mod) => mod.SketchesViewImage)
)

const STEP_CONFIG = {
    Sketches: {
        assignStatus: API_LIST_AUTH.Sketches.assignStatus,
        target: API_LIST_AUTH.Sketches.target,
        assign: API_LIST_AUTH.Sketches.assign,
        targetKey: "sketche_target",
        idKey: "sketche_id",
        targetImg: "sketche_image"
    },
    Design: {
        assignStatus: API_LIST_AUTH.VisualDesigners.assignStatus,
        target: API_LIST_AUTH.VisualDesigners.target,
        assign: API_LIST_AUTH.VisualDesigners.assign,
        targetKey: "visual_designer_target",
        idKey: "visual_designer_id",
        targetImg: "visual_designer_image"
    },
    Fabric: {
        assignStatus: API_LIST_AUTH.Fabric.assignStatus,
        target: API_LIST_AUTH.Fabric.target,
        assign: API_LIST_AUTH.Fabric.assign,
        targetKey: "fabric_target",
        targetImg: "fabric_image",
        idKey: "id"
    },
    Yarn: {
        assignStatus: API_LIST_AUTH.Yarn.assignStatus,
        target: API_LIST_AUTH.Yarn.target,
        assign: API_LIST_AUTH.Yarn.assign,
        targetKey: "yarn_target",
        idKey: "id",
        targetImg: "yarn_image"
    },
    Sequences: {
        assignStatus: API_LIST_AUTH.Sequences.assignStatus,
        target: API_LIST_AUTH.Sequences.target,
        assign: API_LIST_AUTH.Sequences.assign,
        targetKey: "sequence_target",
        idKey: "id",
        targetImg: "sequence_image"
    }
}

export function SketchesCardView({
    title = "1. Inspirations",
    sketchesData = null,
    defaultOpen = false,
    getVisualDesignersData,
    getYarnData
}) {
    console.log('sketchesData', sketchesData)
    const titleName = title.split('.').pop()?.trim() || title
    const modalTitle = `${titleName} Target`
    const config = titleName === "Fabric" ? STEP_CONFIG.Fabric : STEP_CONFIG[titleName] || STEP_CONFIG.Sketches
    const [clickedAction, setClickedAction] = React.useState(null)

    const initialAssign = titleName === "Sequences" ? sketchesData?.sequences || [] : sketchesData?.yarns || sketchesData?.fabrics || sketchesData?.assign || []
    console.log('initialAssign', initialAssign)
    const [data, setData] = React.useState({
        assign: initialAssign,
        IsBlur: sketchesData?.status === "pending",
        note: sketchesData?.note || "",
        [config.targetKey]: sketchesData?.[config.targetKey] || 0,
        status: sketchesData?.status || "",
        progress: (initialAssign.length === 0 || !sketchesData) ? 0 : (initialAssign.length / sketchesData[config.targetKey]) * 100,
        selectedData: null,
    })

    const [openModal, setOpenModal] = React.useState({
        isAddImageModalOpen: false,
        InspirationsImg: false,
        isEditModalOpen: false,
        // flag for modal api call
        IsEditTarget: false,
        [config.targetKey]: 0
    })

    React.useEffect(() => {
        if (sketchesData) {
            const assignData = titleName === "Sequences" ? sketchesData?.sequences || [] : sketchesData?.yarns || sketchesData.fabrics || sketchesData.assign || []
            // Only update if something actually changed
            if (
                data.assign !== assignData ||
                data.status !== sketchesData.status ||
                data[config.targetKey] !== sketchesData[config.targetKey] ||
                data.note !== sketchesData.note
            ) {
                StateUpdate({
                    assign: assignData,
                    IsBlur: sketchesData.status === "pending" && data.status !== "completed",
                    note: sketchesData.note,
                    [config.targetKey]: sketchesData[config.targetKey],
                    status: sketchesData.status,
                    progress: assignData.length === 0 ? 0 : (assignData.length / sketchesData[config.targetKey]) * 100
                }, setData)
            }
        }
    }, [
        sketchesData?.assign,
        sketchesData?.status,
        sketchesData?.[config.targetKey],
        sketchesData?.note
    ])



    const handleModalOpen = (val, selectedData, index = 0) => {
        StateUpdate({ selectedData: selectedData }, setData)
        // modalOpen("SketchesImg", true, setOpenModal)
        if (val === "Sketches") {
            modalOpen("SketchesImg", true, setOpenModal)
            // modalOpen("SketchesIndex", index, setOpenModal)
        }
        if (val === "Design") {
            modalOpen("DesignViewModalImage", true, setOpenModal)
            // modalOpen("SketchesIndex", index, setOpenModal)
        }
        if (val === "Fabric") {
            modalOpen("FabricViewModalImage", true, setOpenModal)
        }
        if (val === "Yarn") {
            modalOpen("FabricViewModalImage", true, setOpenModal)
        }
    }


    const { mutate: updateTarget, isPending } = usePost(config.target, {
        onSuccess: (res, variables) => {
            if (res.success) {
                StateUpdate({
                    [config.targetKey]: Number(variables[config.targetKey]),
                    progress: (data.assign.length / Number(variables[config.targetKey])) * 100,
                    IsBlur: false,
                    status: "running"
                }, setData)
                StateUpdate({ isEditModalOpen: false, IsEditTarget: false }, setOpenModal)
            }
        },
        onError: (error) => {
            console.error("Error updating target:", error)
        }
    })

    const { mutate: assignTo, isPending: isAssignTo } = usePost(config.assign, {
        onSuccess: (res) => {
            if (res.success) {
                if (titleName === "Fabric") {
                    // {
                    //     "success": true,
                    //     "code": null,
                    //     "message": "Success",
                    //     "data": {
                    //         "fabric_id": "2",
                    //         "fabric_meter": "444",
                    //         "fabric_stock_id": "1",
                    //         "note": "test 444",
                    //         "id": 4,
                    //         "fabric_name": "test123456789",
                    //         "fabric_image": "/upload/fabrics/Group-1-1771865513783-730084220.png"
                    //     }
                    // }

                    const UpadetData = [...data.assign, res.data]
                    StateUpdate({
                        assign: UpadetData,
                        progress: (UpadetData.length / Number(data[config.targetKey])) * 100,
                        IsBlur: false,
                        status: "running"
                    }, setData)
                    StateUpdate({ isAddImageModalOpen: false }, setOpenModal)
                }
                else if (titleName === "Yarn") {
                    const UpadetData = [...data.assign, res.data]
                    StateUpdate({
                        assign: UpadetData,
                        progress: (UpadetData.length / Number(data[config.targetKey])) * 100,
                        IsBlur: false,
                        status: "running"
                    }, setData)
                    StateUpdate({ isAddImageModalOpen: false }, setOpenModal)
                    //                     {
                    //     "yarn_id": "2",
                    //     "yarn_num_cons": "99",
                    //     "yarn_stock_id": "1",
                    //     "note": "99 add nore",
                    //     "id": 2,
                    //     "yarn_name": "test123456789",
                    //     "yarn_image": "/upload/yarns/Group-1-1771865542775-521619552.png"
                    // }
                }
                else {
                    const assignUserId = Number(res.data.assign_user)

                    const exists = data.assign.some(
                        item => item.assign_user === assignUserId
                    )
                    let newImages

                    if (exists) {
                        // Replace existing item
                        newImages = data.assign.map(item =>
                            item.assign_user === assignUserId ? res.data : item
                        )
                    } else {
                        // Add new item
                        newImages = [...data.assign, res.data]
                    }
                    StateUpdate({
                        assign: newImages,
                        progress: newImages.length === 0 ? 0 : (newImages.length / Number(data[config.targetKey])) * 100
                    }, setData)
                }
                StateUpdate({ isAddImageModalOpen: false }, setOpenModal)
            }
        },
        onError: (error) => {
            toast.error(error.message || "Something went wrong")
        }
    })
    const { mutate: updateStatus, isPending: isUpdatingStatus } = usePost(config.assignStatus, {
        onSuccess: (res, variables) => {
            setClickedAction(null)
            if (res.success) {
                StateUpdate({ IsBlur: false, status: variables.status }, setData)
                if (titleName === "Fabric") {
                    getYarnData({ design_id: sketchesData?.design_id?.toString() })
                } else {
                    getVisualDesignersData({ design_id: sketchesData?.design_id?.toString() })
                }
            }
        },
        onError: (error) => {
            setClickedAction(null)
            console.error("Error updating status:", error)
        }
    })

    const handleAddImage = async (values) => {

        const payload = {
            ...values,
            [config.idKey]: sketchesData.id.toString(),
            note: values.note || ""
        }
        if (titleName === "Fabric") {
            delete payload[config.idKey]
            payload.fabric_meter = payload.fabric_meter.toString()
            payload.fabric_id = sketchesData.id.toString()
            payload.fabric_stock_id = payload.fabric_stock_id.toString()
        }

        if (titleName === "Yarn") {
            delete payload[config.idKey]
            payload.yarn_num_cons = payload.yarn_num_cons.toString()
            payload.yarn_id = sketchesData.id.toString()
            payload.yarn_stock_id = payload.yarn_stock_id.toString()
        }
        // console.log('payload', payload)
        assignTo(payload)
    }

    const onEditTarget = async (val) => {
        const body = {
            design_id: sketchesData.design_id.toString(),
            [config.targetKey]: val.toString(),
            status: "running", // running
            note: ""
        }
        updateTarget(body)
    }

    const handleOnCompleted = (type) => {
        setClickedAction(type)
        const body = {
            design_id: sketchesData.design_id.toString(),
            status: type
        }
        updateStatus(body)
    }

    return (
        <Accordion
            type="single"
            collapsible
            className="w-full"
            defaultValue={defaultOpen ? "workflow" : undefined}
        >
            <AccordionItem
                value="workflow"
                className="border border-[#dcccbd] rounded-md bg-white shadow-sm overflow-hidden group"
            >
                {/* HEADER */}
                <div className="relative">
                    <AccordionTrigger
                        className={clsx(
                            "px-6 py-3 bg-[#F8F5F2] border-b border-[#dcccbd] ",
                            "flex items-start justify-between",
                            "hover:no-underline",
                            "data-[state=closed]:h-[73.74px]"
                        )}
                    >

                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 w-full ">
                            <div className="flex-1 space-y-2">
                                <div className="flex justify-between items-center font-semibold text-primary-foreground w-full">
                                    <h3 className="text-[18px] font-semibold text-primary-foreground font-sans">
                                        {title}
                                    </h3>
                                    <span className=" group-data-[state=open]:hidden">{Math.round(data.progress)}%</span>
                                </div>

                                <div className="relative w-full lg:w-[80%] h-2 bg-[#F0F0F0] rounded-full overflow-hidden  group-data-[state=open]:hidden">
                                    <div
                                        className="absolute top-0 left-0 h-full rounded-full transition-all duration-300"
                                        style={{
                                            width: `${data.progress}%`,
                                            background:
                                                "linear-gradient(90deg, #D47A7A 0%, #D4A57A 50%, #8DB88D 100%)",
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                    </AccordionTrigger>
                    <div className="absolute right-14 top-[50%] -translate-y-1/2 flex items-center space-x-2 z-10 group-data-[state=closed]:hidden">
                        {data.IsBlur && <Button
                            variant="outline"
                            size="xs"
                            onClick={() => StateUpdate({ isEditModalOpen: true }, setOpenModal)}
                            className="h-7 px-4 py-0 border-[#dcccbd] bg-[#7DAA7B] text-[14px] font-medium text-white rounded-md hover:bg-[#5d8d5b]"
                        >
                            Start
                        </Button>}
                        {!data.IsBlur && data.status !== "completed" && data.status !== "skipped" && <Button
                            variant="outline"
                            size="xs"
                            disabled={data.IsBlur || isUpdatingStatus}
                            onClick={() => handleOnCompleted("skipped")}
                            className="h-7 px-4 py-0 border-[#dcccbd] bg-[#F8F5F2] text-[14px] font-medium text-primary-foreground rounded-md hover:bg-[#f1ede9]"
                        >
                            {isUpdatingStatus && clickedAction === "skipped" ? "..." : "Skip"}
                        </Button>}
                    </div>
                </div>

                {/* CONTENT */}
                <AccordionContent className="p-0">
                    <div className={clsx(data.IsBlur && "relative")}>
                        {data.IsBlur && (
                            <LockBlur className="absolute inset-0 z-50 w-full" />
                        )}

                        <div
                            className={clsx(
                                " space-y-6",
                                data.IsBlur && "blur-sm"
                            )}
                        >
                            {/* Progress */}
                            <div className="p-6 pb-0 flex flex-col md:flex-row md:items-end justify-between gap-6">
                                <div className="flex-1 space-y-2">
                                    <div className="flex justify-between items-center font-semibold text-primary-foreground w-full lg:w-[80%]">
                                        <span>Workflow Progress</span>
                                        <span>{data?.progress ? Math.round(data.progress) : 0}%</span>
                                    </div>

                                    <div className="relative w-full lg:w-[80%] h-2 bg-[#F0F0F0] rounded-full overflow-hidden">
                                        <div
                                            className="absolute top-0 left-0 h-full rounded-full transition-all duration-300"
                                            style={{
                                                width: `${data.progress}%`,
                                                background:
                                                    "linear-gradient(90deg, #D47A7A 0%, #D4A57A 50%, #8DB88D 100%)",
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 min-w-fit">
                                    <span className="font-medium space-x-1">
                                        <span className="text-[#8DB88D]">
                                            {data.assign.length}
                                        </span>
                                        <span>/</span>
                                        <span className="text-primary-foreground">
                                            {data[config.targetKey]}
                                        </span>
                                    </span>

                                    {data.status !== "completed" && data.status !== "skipped" && <Button
                                        disabled={data.IsBlur}
                                        variant="outline"
                                        onClick={() => StateUpdate({ isEditModalOpen: true, IsEditTarget: true }, setOpenModal)}
                                        className="h-[36px] bg-[#F8F5F2] border-none hover:bg-[#F0EDE9]"
                                    >
                                        Edit Target
                                    </Button>}
                                </div>
                            </div>
                            <div className="border-b border-[#dcccbd]"></div>
                            {/* Gallery */}
                            <div className="p-6 pt-0 grid grid-cols-2 md:flex flex-wrap items-center gap-4">
                                {console.log('data.assign', data.assign)}
                                {data.assign.map((img, idx) => {
                                    const src = (img[config.targetImg] && img[config.targetImg] !== "") ? `${process.env.NEXT_PUBLIC_API_URL}${img[config.targetImg]}` : "/design-thumb.png"
                                    let itemData = { ...img, src: src }

                                    if (titleName === "Yarn" || titleName === "Fabric" || titleName === "Sequence") {
                                        return (
                                            <WorkItemCard
                                                isFabric={titleName === "Fabric"}
                                                isYarn={titleName === "Yarn"}
                                                isSequence={titleName === "Sequence"}
                                                key={idx}
                                                item={itemData}
                                                priority={idx === 0}
                                                onClick={() => handleModalOpen(titleName, img)}
                                            />
                                        )
                                    }

                                    return (
                                        <WorkItemCard
                                            isStatus
                                            key={idx}
                                            item={itemData}
                                            priority={idx === 0}
                                            onClick={() => handleModalOpen(titleName, img)}
                                        />
                                    )
                                })}

                                {!data.IsBlur && data.assign.length < Number(data[config.targetKey]) && data.status !== "completed" && data.status !== "skipped" && (
                                    <button
                                        disabled={data.IsBlur}
                                        onClick={() =>
                                            StateUpdate({ isAddImageModalOpen: true }, setOpenModal)
                                        }
                                        className={clsx(
                                            "rounded-[10px] bg-[#F8F5F2] flex items-center justify-center hover:bg-[#F0EDE9] transition-colors w-full sm:w-[150px] h-[164px]",
                                            // (titleName === "Sketches" || titleName === "Design")
                                            //     ? "w-[150px] h-[164px] border border-[#dcccbd]/30"
                                            //     : "w-[85px] h-[85px]"
                                        )}
                                    >
                                        <PlusIcon className={clsx(
                                            "text-[#dcccbd] w-10 h-10",
                                            // (titleName === "Sketches" || titleName === "Design") ? "w-10 h-10" : "w-8 h-8"
                                        )} />
                                    </button>
                                )}
                                {!data.IsBlur && data.status !== "completed" && data.status !== "skipped" && (
                                    <div className="flex justify-end flex-auto self-end">
                                        <Button
                                            disabled={data.IsBlur || isUpdatingStatus}
                                            onClick={() => handleOnCompleted("completed")}
                                            className="bg-[#dcccbd] hover:bg-[#dcccbd]/90 h-[36px] px-8 rounded-[8px]"
                                        >
                                            {isUpdatingStatus && clickedAction === "completed" ? "Processing..." : "Completed"}
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </AccordionContent>
            </AccordionItem>


            {/* taeget modal */}
            {/* taeget modal */}
            <EditTargetModal
                open={openModal.isEditModalOpen}
                onOpenChange={(isOpen) => { StateUpdate({ isEditModalOpen: isOpen }, setOpenModal) }}
                title={modalTitle}
                initialValue={data[config.targetKey]}
                onSave={onEditTarget}
                isLoading={isPending}
                IsEditTarget={openModal.IsEditTarget}
                min={data.assign.length}
            />
            {/* taeget modal */}
            {/* taeget modal */}

            {
                openModal.SketchesImg &&
                <SketchesViewImage
                    isDone={data.status === "completed" || data.status === "skipped"}
                    onUpdateSuccess={(res) => {
                        let newImages = data.assign.map(item =>
                            Number(item.assign_user) === res.assign_user ? res : item
                        )
                        StateUpdate({
                            assign: newImages,
                        }, setData)
                        modalOpen("SketchesImg", false, setOpenModal)

                    }}
                    open={openModal.SketchesImg}
                    selectedData={data.selectedData}
                    onOpenChange={(isOpen) => { modalOpen("SketchesImg", isOpen, setOpenModal) }}
                    onDelete={(deletedId) => {
                        const updatedImages = data.assign.filter(img => img.id !== Number(deletedId))
                        StateUpdate({
                            assign: updatedImages,
                            progress: data[config.targetKey] === 0 ? 0 : (updatedImages.length / data[config.targetKey]) * 100
                        }, setData)
                    }}
                />
            }

            {
                openModal.DesignViewModalImage &&
                <DesignViewModalImage
                    isDone={data.status === "completed" || data.status === "skipped"}
                    open={openModal.DesignViewModalImage}
                    selectedData={data.selectedData}
                    onOpenChange={(isOpen) => { modalOpen("DesignViewModalImage", isOpen, setOpenModal) }}
                    onDelete={(deletedId) => {
                        const updatedImages = data.assign.filter(img => img.id !== Number(deletedId))
                        StateUpdate({
                            assign: updatedImages,
                            progress: data[config.targetKey] === 0 ? 0 : (updatedImages.length / data[config.targetKey]) * 100
                        }, setData)
                    }}
                    onUpdateSuccess={(res) => {
                        let newImages = data.assign.map(item =>
                            Number(item.assign_user) === res.assign_user ? res : item
                        )
                        StateUpdate({
                            assign: newImages,
                        }, setData)
                        modalOpen("DesignViewModalImage", false, setOpenModal)
                    }}
                />
            }

            {
                openModal.FabricViewModalImage &&
                <FabricViewModalImage
                    selectedData={data.selectedData}
                    open={openModal.FabricViewModalImage}
                    onOpenChange={(isOpen) => { modalOpen("FabricViewModalImage", isOpen, setOpenModal) }}
                    title={titleName}
                />
            }

            {
                openModal.YarnViewModalImage &&
                <YarnViewModalImage
                    selectedData={data.selectedData}
                    open={openModal.YarnViewModalImage}
                    onOpenChange={(isOpen) => { modalOpen("YarnViewModalImage", isOpen, setOpenModal) }}
                />
            }


            <AddImageModal
                open={openModal.isAddImageModalOpen}
                onOpenChange={(isOpen) => { StateUpdate({ isAddImageModalOpen: isOpen }, setOpenModal) }}
                title={titleName}
                onAdd={handleAddImage}
                isLoading={isAssignTo}
            />
        </Accordion>
    )
}

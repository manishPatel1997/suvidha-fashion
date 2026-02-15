"use client"

import * as React from "react"
import Image from "next/image"
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
import { modalOpen, StateUpdate, toFormData } from "@/lib/helper"
import { usePost } from "@/hooks/useApi"
import { API_LIST_AUTH } from "@/hooks/api-list"
import dynamic from "next/dynamic"


const InspirationsViewImage = dynamic(() =>
    import("@/components/pre-production/inspirations/InspirationsViewImage").then((mod) => mod.InspirationsViewImage)
)
const EditTargetModal = dynamic(() =>
    import("@/components/edit-target-modal").then((mod) => mod.EditTargetModal)
)
const AddImageModal = dynamic(() =>
    import("@/components/add-image-modal").then((mod) => mod.AddImageModal)
)

export function InspirationsCardView({
    title = "1. Inspirations",
    inspirationData = null,
    defaultOpen = false,
    getInspirationData
}) {
    const [data, setData] = React.useState({
        images: inspirationData?.images || [],
        currentCount: 0,
        target_count: 0,
        IsBlur: inspirationData?.status === "pending",
        note: inspirationData?.note || "",
        progress: (inspirationData?.inspiration_target === 0 || !inspirationData) ? 0 : (inspirationData.images.length / inspirationData.inspiration_target) * 100,
        selectedData: null,
        status: inspirationData?.status || "",
        inspiration_target: inspirationData?.inspiration_target || 0
    })
    const [openModal, setOpenModal] = React.useState({
        isAddImageModalOpen: false,
        InspirationsImg: false,
        isEditModalOpen: false,
        // flag for modal api call
        IsEditTarget: false
    })
    React.useEffect(() => {
        if (inspirationData) {
            // Only update if something actually changed
            if (
                data.images !== inspirationData.images ||
                data.status !== inspirationData.status ||
                data.inspiration_target !== inspirationData.inspiration_target ||
                data.note !== inspirationData.note
            ) {
                StateUpdate({
                    images: inspirationData.images,
                    inspiration_target: inspirationData.inspiration_target,
                    IsBlur: inspirationData.status === "pending",
                    note: inspirationData.note,
                    status: inspirationData.status,
                    progress: inspirationData.inspiration_target === 0 ? 0 : (inspirationData.images.length / inspirationData.inspiration_target) * 100
                }, setData)
            }
        }
    }, [inspirationData])

    const titleName = title.split('.').pop()?.trim() || title
    const modalTitle = `${titleName} Target`


    const handleModalOpen = (val, selectedData, index = 0) => {
        StateUpdate({ selectedData: selectedData }, setData)
        modalOpen("InspirationsImg", true, setOpenModal)
    }


    const { mutate: updateTarget, isPending } = usePost(API_LIST_AUTH.Inspirations.target, {
        onSuccess: (res, variables) => {
            if (res.success) {
                StateUpdate({
                    inspiration_target: Number(variables.inspiration_target),
                    progress: (data.images.length / Number(variables.inspiration_target)) * 100,
                    IsBlur: false
                }, setData)
                StateUpdate({ isEditModalOpen: false, IsEditTarget: false }, setOpenModal)
            }
        },
        onError: (error) => {
            console.error("Error updating target:", error)
        }
    })
    const { mutate: addInspiration, isPending: isAddingImage } = usePost(API_LIST_AUTH.Inspirations.create, {
        isFormData: true,
        onSuccess: (res) => {
            if (res.success) {
                const newImages = [...data.images, res.data]
                StateUpdate({
                    images: newImages,
                    progress: data.inspiration_target === 0 ? 0 : (newImages.length / data.inspiration_target) * 100
                }, setData)
                StateUpdate({ isAddImageModalOpen: false }, setOpenModal)
            }
        },
        onError: (error) => {
            console.error("Error creating inspiration:", error)
        }
    })

    const { mutate: updateStatus, isPending: isUpdatingStatus } = usePost(API_LIST_AUTH.Inspirations.status, {
        onSuccess: (res, variables) => {
            setClickedAction(null)
            if (res.success) {
                StateUpdate({ IsBlur: false, status: variables.status }, setData)
                getInspirationData({ design_id: inspirationData?.design_id?.toString() })
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
            inspiration_id: inspirationData.id.toString(),
            note: values.note || ""
        }
        addInspiration(toFormData(payload))
    }

    const onEditTarget = async (val) => {
        const body = {
            design_id: inspirationData.design_id.toString(),
            inspiration_target: val.toString(),
            status: "running", // running
            note: ""
        }
        updateTarget(body)
    }

    const handleOnCompleted = (type) => {
        setClickedAction(type)
        const body = {
            design_id: inspirationData.design_id.toString(),
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
                                        <span>{Math.round(data.progress)}%</span>
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
                                            {data.images.length}
                                        </span>
                                        <span>/</span>
                                        <span className="text-primary-foreground">
                                            {data.inspiration_target}
                                        </span>
                                    </span>

                                    {data.status !== "completed" && data.status !== "skipped" &&
                                        <Button
                                            disabled={data.IsBlur}
                                            variant="outline"
                                            onClick={() => StateUpdate({ isEditModalOpen: true, IsEditTarget: true }, setOpenModal)}
                                            className="h-[36px] bg-[#F8F5F2] border-none hover:bg-[#F0EDE9]"
                                        >
                                            Edit Target
                                        </Button>
                                    }
                                </div>
                            </div>
                            <div className="border-b border-[#dcccbd]"></div>
                            {/* Gallery */}
                            <div className="p-6 pt-0 grid grid-cols-2 md:flex flex-wrap items-center gap-4">
                                {data.images.map((img, idx) => {
                                    const src = `${process.env.NEXT_PUBLIC_API_URL}${img.image_url}`
                                    return (
                                        <div
                                            key={idx}
                                            onClick={() => handleModalOpen(titleName, img, idx)}
                                            className="relative w-full sm:w-[162px] h-[162px] rounded-[10px] overflow-hidden border border-[#dcccbd] cursor-pointer hover:opacity-90 transition-opacity"
                                        >
                                            <Image
                                                src={src}
                                                alt={`Work ${idx}`}
                                                fill
                                                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 150px"
                                                className="object-cover"
                                                priority={idx === 0}
                                                loading={idx === 0 ? undefined : "lazy"}
                                            />
                                        </div>
                                    )
                                })}

                                {!data.IsBlur && data.images.length < Number(data.inspiration_target) && data.status !== "completed" && data.status !== "skipped" && (
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
                initialValue={data.inspiration_target}
                onSave={onEditTarget}
                isLoading={isPending}
                IsEditTarget={openModal.IsEditTarget}
                min={data.images.length}
            />
            {/* taeget modal */}
            {/* taeget modal */}
            {
                openModal.InspirationsImg &&
                <InspirationsViewImage
                    isDone={data.status === "completed" || data.status === "skipped"}
                    open={openModal.InspirationsImg}
                    onOpenChange={(isOpen) => { modalOpen("InspirationsImg", isOpen, setOpenModal), !isOpen && StateUpdate({ selectedData: null }, setData) }}
                    selectedData={data.selectedData}
                    onUpdateSuccess={(updatedInspiration) => {
                        const updatedImages = data.images.map(img =>
                            img.id === updatedInspiration.id ? updatedInspiration : img
                        )
                        StateUpdate({ images: updatedImages }, setData)
                        modalOpen("InspirationsImg", false, setOpenModal)
                    }}
                    onDeleteSuccess={(deletedId) => {
                        const updatedImages = data.images.filter(img => img.id !== deletedId)
                        StateUpdate({
                            images: updatedImages,
                            progress: data.inspiration_target === 0 ? 0 : (updatedImages.length / data.inspiration_target) * 100
                        }, setData)
                    }}
                />
            }

            <AddImageModal
                open={openModal.isAddImageModalOpen}
                onOpenChange={(isOpen) => { StateUpdate({ isAddImageModalOpen: isOpen }, setOpenModal) }}
                title={titleName}
                onAdd={handleAddImage}
                isLoading={isAddingImage}
            />
        </Accordion >
    )
}

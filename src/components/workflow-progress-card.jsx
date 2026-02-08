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
import { EditTargetModal } from "./edit-target-modal"
import { InspirationsViewImage } from "./pre-production/InspirationsViewImage"
import { SketchesViewImage } from "./pre-production/SketchesViewModal"
import { AddImageModal } from "./add-image-modal"
import { cn } from "@/lib/utils"
import { modalOpen } from "@/lib/helper"
import { DesignViewModalImage } from "./pre-production/DesignViewModalImage"
import { YarnViewModalImage } from "./pre-production/YarnViewModalImage"
import { FabricViewModalImage } from "./pre-production/FabricViewModalImage"
import { SequenceViewModalImage } from "./pre-production/SequenceViewModalImage"
import WorkItemCard from "./pre-production/WorkItemCard"

const ASSIGNED_OPTIONS = [
    { value: "1", label: "Devon Lane" },
    { value: "2", label: "Jenny Wilson" },
    { value: "3", label: "Robert Fox" },
    { value: "4", label: "Cody Fisher" },
    { value: "5", label: "Bessie Cooper" },
]

export function WorkflowProgressCard({
    title = "1. Inspirations",
    progress = 50,
    currentCount = 5,
    totalCount = 20,
    images: initialImages = [],
    onSkip,
    onEditTarget,
    onCompleted,
    IsBlur = false,
    defaultOpen = false,
}) {
    const [images, setImages] = React.useState(() => {
        // Normalize initial images to objects
        return initialImages.map(img => typeof img === "string" ? { src: img } : img)
    })
    const [isEditModalOpen, setIsEditModalOpen] = React.useState(false)
    const [isAddImageModalOpen, setIsAddImageModalOpen] = React.useState(false)
    const [selectedImage, setSelectedImage] = React.useState(null)
    const fileInputRef = React.useRef(null)
    const [openModal, setOpenModal] = React.useState({
        InspirationsImg: false,
        SketchesImg: false,
        SketchesIndex: null,
        DesignViewModalImage: false,
        FabricViewModalImage: false,
        YarnViewModalImage: false,
        SequenceViewModalImage: false,
    })


    // Extract title name without number prefix (e.g., "1. Inspirations" -> "Inspirations")
    const titleName = title.split('.').pop()?.trim() || title
    const modalTitle = `${titleName} Target`

    const handleAddImage = (values) => {
        console.log("Add image values:", values)
        const file = values.attachImage
        if (!file) return

        const url = typeof file === "string" ? file : URL.createObjectURL(file)

        const assigned = ASSIGNED_OPTIONS.find(opt => opt.value === values.assignedTo)
        const assignedName = assigned ? assigned.label : "Name"

        const newItem = {
            src: url,
            assignedTo: values.assignedTo,
            assignedName: assignedName,
            note: values.note,
            designNo: values.designNo,
            status: "Completed"
        }
        setImages((prev) => [...prev, newItem])
    }

    React.useEffect(() => {
        return () => {
            images.forEach((img) => {
                const src = typeof img === "string" ? img : img.src
                if (src.startsWith("blob:")) URL.revokeObjectURL(src)
            })
        }
    }, [images])

    // const isDetailed = titleName === "Sketches" || titleName === "Design"

    const handleModalOpen = (val, index = 0) => {
        if (val === "Inspirations") {
            modalOpen("InspirationsImg", true, setOpenModal)
        }
        if (val === "Sketches") {
            modalOpen("SketchesImg", true, setOpenModal)
            modalOpen("SketchesIndex", index, setOpenModal)
        }
        if (val === "Design") {
            modalOpen("DesignViewModalImage", true, setOpenModal)
            modalOpen("SketchesIndex", index, setOpenModal)
        }
        if (val === "Yarn") {
            modalOpen("YarnViewModalImage", true, setOpenModal)
            modalOpen("SketchesIndex", index, setOpenModal)
        }
        if (val === "Fabric") {
            modalOpen("FabricViewModalImage", true, setOpenModal)
            modalOpen("SketchesIndex", index, setOpenModal)
        }
        if (val === "Sequence") {
            modalOpen("SequenceViewModalImage", true, setOpenModal)
            modalOpen("SketchesIndex", index, setOpenModal)
        }
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
                                    <span className=" group-data-[state=open]:hidden">{progress}%</span>
                                </div>

                                <div className="relative w-full lg:w-[80%] h-2 bg-[#F0F0F0] rounded-full overflow-hidden  group-data-[state=open]:hidden">
                                    <div
                                        className="absolute top-0 left-0 h-full rounded-full transition-all duration-300"
                                        style={{
                                            width: `${progress}%`,
                                            background:
                                                "linear-gradient(90deg, #D47A7A 0%, #D4A57A 50%, #8DB88D 100%)",
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                    </AccordionTrigger>
                    <div className="absolute right-14 top-[50%] -translate-y-1/2 flex items-center space-x-2 z-10 group-data-[state=closed]:hidden">
                        {IsBlur && <Button
                            variant="outline"
                            size="xs"
                            onClick={(e) => {
                                e.stopPropagation();
                                onSkip();
                            }}
                            className="h-7 px-4 py-0 border-[#dcccbd] bg-[#7DAA7B] text-[14px] font-medium text-white rounded-md hover:bg-[#5d8d5b]"
                        >
                            Start
                        </Button>}
                        <Button
                            variant="outline"
                            size="xs"
                            onClick={(e) => {
                                e.stopPropagation();
                                onSkip();
                            }}
                            className="h-7 px-4 py-0 border-[#dcccbd] bg-[#F8F5F2] text-[14px] font-medium text-primary-foreground rounded-md hover:bg-[#f1ede9]"
                        >
                            Skip
                        </Button>
                    </div>
                </div>

                {/* CONTENT */}
                <AccordionContent className="p-0">
                    <div className={clsx(IsBlur && "relative")}>
                        {IsBlur && (
                            <LockBlur className="absolute inset-0 z-50 w-full" />
                        )}

                        <div
                            className={clsx(
                                " space-y-6",
                                IsBlur && "blur-sm"
                            )}
                        >
                            {/* Progress */}
                            <div className="p-6 pb-0 flex flex-col md:flex-row md:items-end justify-between gap-6">
                                <div className="flex-1 space-y-2">
                                    <div className="flex justify-between items-center font-semibold text-primary-foreground w-full lg:w-[80%]">
                                        <span>Workflow Progress</span>
                                        <span>{progress}%</span>
                                    </div>

                                    <div className="relative w-full lg:w-[80%] h-2 bg-[#F0F0F0] rounded-full overflow-hidden">
                                        <div
                                            className="absolute top-0 left-0 h-full rounded-full transition-all duration-300"
                                            style={{
                                                width: `${progress}%`,
                                                background:
                                                    "linear-gradient(90deg, #D47A7A 0%, #D4A57A 50%, #8DB88D 100%)",
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 min-w-fit">
                                    <span className="font-medium">
                                        <span className="text-[#8DB88D]">
                                            {String(currentCount).padStart(
                                                2,
                                                "0"
                                            )}
                                        </span>
                                        <span className="text-primary-foreground">
                                            /{totalCount}
                                        </span>
                                    </span>

                                    <Button
                                        variant="outline"
                                        onClick={() => setIsEditModalOpen(true)}
                                        className="h-[36px] bg-[#F8F5F2] border-none hover:bg-[#F0EDE9]"
                                    >
                                        Edit Target
                                    </Button>
                                </div>
                            </div>
                            <div className="border-b border-[#dcccbd]"></div>
                            {/* Gallery */}
                            <div className="p-6 pt-0 grid grid-cols-2 md:flex flex-wrap items-center gap-4">
                                {images.map((img, idx) => {
                                    const src = typeof img === "string" ? img : img.src
                                    const isDetailed = titleName === "Sketches" || titleName === "Design"

                                    if (titleName === "Yarn" || titleName === "Fabric" || titleName === "Sequence") {
                                        return (
                                            <WorkItemCard
                                                isFabric={titleName === "Fabric"}
                                                isYarn={titleName === "Yarn"}
                                                isSequence={titleName === "Sequence"}
                                                key={idx}
                                                item={img}
                                                onClick={() => handleModalOpen(titleName)}
                                            />
                                        )
                                    }

                                    if (isDetailed) {
                                        return (
                                            <WorkItemCard
                                                isStatus
                                                key={idx}
                                                item={img}
                                                onClick={() => handleModalOpen(titleName)}
                                            />
                                        )
                                    }

                                    return (
                                        <div
                                            key={idx}
                                            onClick={() => handleModalOpen(titleName, idx)}
                                            className="relative w-full sm:w-[162px] h-[162px] rounded-[10px] overflow-hidden border border-[#dcccbd] cursor-pointer hover:opacity-90 transition-opacity"
                                        >
                                            <Image
                                                src={src}
                                                alt={`Work ${idx}`}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    )
                                })}

                                {!IsBlur && (
                                    <button
                                        onClick={() =>
                                            setIsAddImageModalOpen(true)
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

                                {!IsBlur && (
                                    <div className="flex justify-end flex-auto self-end">
                                        <Button
                                            onClick={onCompleted}
                                            className="bg-[#dcccbd] hover:bg-[#dcccbd]/90 h-[36px] px-8 rounded-[8px]"
                                        >
                                            Completed
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </AccordionContent>
            </AccordionItem>

            <EditTargetModal
                open={isEditModalOpen}
                onOpenChange={setIsEditModalOpen}
                title={modalTitle}
                initialValue={totalCount.toString()}
                onSave={(val) => {
                    if (onEditTarget) onEditTarget(val)
                }}
            />

            {openModal.InspirationsImg &&
                <InspirationsViewImage
                    open={openModal.InspirationsImg}
                    onOpenChange={(isOpen) => { modalOpen("InspirationsImg", isOpen, setOpenModal), !isOpen && setSelectedImage(null) }}
                    imageSrc={typeof selectedImage === "string" ? selectedImage : selectedImage?.src}
                    onDelete={() => {
                        setImages(prev => prev.filter(img => (typeof img === "string" ? img : img.src) !== (typeof selectedImage === "string" ? selectedImage : selectedImage?.src)))
                        setSelectedImage(null)
                    }}
                />
            }
            {openModal.SketchesImg &&
                <SketchesViewImage
                    open={openModal.SketchesImg}
                    onOpenChange={(isOpen) => { modalOpen("SketchesImg", isOpen, setOpenModal), !isOpen && setSelectedImage(null) }}
                    images={images}
                    currentImg={openModal.SketchesIndex}
                    note={selectedImage?.note}
                    assignedTo={selectedImage?.assignedName}
                    status={selectedImage?.status}
                    onDelete={() => {
                        setImages(prev => prev.filter(img => (typeof img === "string" ? img : img.src) !== (typeof selectedImage === "string" ? selectedImage : selectedImage?.src)))
                        setSelectedImage(null)
                    }}
                />
            }
            {openModal.DesignViewModalImage &&
                <DesignViewModalImage
                    open={openModal.DesignViewModalImage}
                    onOpenChange={(isOpen) => { modalOpen("DesignViewModalImage", isOpen, setOpenModal), !isOpen && setSelectedImage(null) }}
                    images={images}
                    currentImg={openModal.SketchesIndex}
                    note={selectedImage?.note}
                    assignedTo={selectedImage?.assignedName}
                    status={selectedImage?.status}
                    onDelete={() => {
                        setImages(prev => prev.filter(img => (typeof img === "string" ? img : img.src) !== (typeof selectedImage === "string" ? selectedImage : selectedImage?.src)))
                        setSelectedImage(null)
                    }}
                />
            }
            {openModal.YarnViewModalImage &&
                <YarnViewModalImage
                    open={openModal.YarnViewModalImage}
                    onOpenChange={(isOpen) => { modalOpen("YarnViewModalImage", isOpen, setOpenModal), !isOpen && setSelectedImage(null) }}
                />
            }
            {openModal.FabricViewModalImage &&
                <FabricViewModalImage
                    open={openModal.FabricViewModalImage}
                    onOpenChange={(isOpen) => { modalOpen("FabricViewModalImage", isOpen, setOpenModal), !isOpen && setSelectedImage(null) }}
                />
            }
            {openModal.SequenceViewModalImage &&
                <SequenceViewModalImage
                    open={openModal.SequenceViewModalImage}
                    onOpenChange={(isOpen) => { modalOpen("SequenceViewModalImage", isOpen, setOpenModal), !isOpen && setSelectedImage(null) }}
                />
            }

            <AddImageModal
                open={isAddImageModalOpen}
                onOpenChange={setIsAddImageModalOpen}
                title={titleName}
                onAdd={handleAddImage}
            />
        </Accordion>
    )
}

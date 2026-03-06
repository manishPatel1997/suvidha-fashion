import clsx from 'clsx'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion'
import { Button } from '../ui/button'
import { StateUpdate } from '@/lib/helper'
import LockBlur from '@/assets/LockBlur'
import { API_LIST_AUTH } from '@/hooks/api-list'
import React from 'react'
import PostProductionItemCard from './PostProductionItemCard'

const POST_PRODUCTION_CONFIG = {
    Deko: {
        assignStatus: API_LIST_AUTH.Deko.assignStatus,
        target: API_LIST_AUTH.Deko.target,
        assign: API_LIST_AUTH.Deko.assign,
        targetKey: "deko_target",
        idKey: "deko_id",
        targetImg: "deko_image"
    },
    Mill: {
        assignStatus: API_LIST_AUTH.Mill.assignStatus,
        target: API_LIST_AUTH.Mill.target,
        assign: API_LIST_AUTH.Mill.assign,
        targetKey: "mill_target",
        idKey: "mill_id",
        targetImg: "mill_image"
    },
    Photography: {
        assignStatus: API_LIST_AUTH.Photography.assignStatus,
        target: API_LIST_AUTH.Photography.target,
        assign: API_LIST_AUTH.Photography.assign,
        targetKey: "photography_target",
        targetImg: "photography_image",
        idKey: "id"
    },
    Folder: {
        assignStatus: API_LIST_AUTH.Folder.assignStatus,
        target: API_LIST_AUTH.Folder.target,
        assign: API_LIST_AUTH.Folder.assign,
        targetKey: "folder_target",
        idKey: "id",
        targetImg: "folder_image"
    }
}


function PostProductionHome({
    defaultOpen = false,
    titleName = "Deko",
    Idx = "1",
    sketchesData = null,
    progress = 50,
}) {
    const config = POST_PRODUCTION_CONFIG[titleName] || POST_PRODUCTION_CONFIG.Deko
    const [clickedAction, setClickedAction] = React.useState(null)
    const initialAssign = titleName === "Sequences" ? sketchesData?.sequences || [] : sketchesData?.yarns || sketchesData?.fabrics || sketchesData?.assign || []

    // Temporary dummy data for preview
    const dummyAssign = [
        { status: "running", assign_user_name: "John Doe", sample_id: "S-501" },
        { status: "completed", assign_user_name: "Jane Smith", sample_id: "S-502" },
        { status: "pending", assign_user_name: "Mike Ross", sample_id: "S-503" },
        { status: "running", assign_user_name: "Harvey Specter", sample_id: "S-504" },
    ]

    const [data, setData] = React.useState({
        assign: initialAssign.length > 0 ? initialAssign : dummyAssign,
        IsBlur: false,
        // IsBlur: sketchesData?.status === "pending",
        note: sketchesData?.note || "",
        [config.targetKey]: sketchesData?.[config.targetKey] || 0,
        status: sketchesData?.status || "",
        progress: (initialAssign.length === 0 || !sketchesData) ? 0 : (initialAssign.length / sketchesData[config.targetKey]) * 100,
        selectedData: null,
    })
    const [openModal, setOpenModal] = React.useState({
        DekoViewModalImage: false,
        MillViewModalImage: false,
        PhotographyViewModalImage: false,
        FolderViewModalImage: false,

        // flag for modal api call
        IsEditTarget: false,
        [config.targetKey]: 0
    })

    const handleModalOpen = (val, selectedData, index = 0) => {
        StateUpdate({ selectedData: selectedData }, setData)
        // modalOpen("SketchesImg", true, setOpenModal)
        if (val === "Deko") {
            modalOpen("DekoViewModalImage", true, setOpenModal)
            // modalOpen("SketchesIndex", index, setOpenModal)
        }
        if (val === "Mill") {
            modalOpen("MillViewModalImage", true, setOpenModal)
            // modalOpen("SketchesIndex", index, setOpenModal)
        }
        if (val === "Photography") {
            modalOpen("PhotographyViewModalImage", true, setOpenModal)
        }
        if (val === "Folder") {
            modalOpen("FolderViewModalImage", true, setOpenModal)
        }
    }

    const onEditTarget = async (val) => {
        // const body = {
        //     design_id: sketchesData.design_id.toString(),
        //     [config.targetKey]: val.toString(),
        //     status: "running", // running
        //     note: ""
        // }
        // updateTarget(body)
    }

    const handleOnCompleted = (type) => {
        // setClickedAction(type)
        // const body = {
        //     design_id: sketchesData.design_id.toString(),
        //     status: type
        // }
        // updateStatus(body)
    }


    const isUpdatingStatus = false

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
                                        {Idx}. {titleName}
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
                                {data.assign.map((item, index) => (
                                    <PostProductionItemCard
                                        key={index}
                                        item={item}
                                        titleName={titleName === "Photography" || titleName === "Folder" ? "Design ID" : "Sample ID"}
                                        onClick={() => handleModalOpen(titleName, item, index)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </AccordionContent>
            </AccordionItem>

        </Accordion>
    )
}

export default PostProductionHome
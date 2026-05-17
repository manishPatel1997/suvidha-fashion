'use client'
import clsx from 'clsx'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion'
import { Button } from '../ui/button'
import { modalOpen, StateUpdate } from '@/lib/helper'
import LockBlur from '@/assets/LockBlur'
import { API_LIST_AUTH } from '@/hooks/api-list'
import React from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import PostProductionItemCard from './PostProductionItemCard'
import { PostProductionViewModal } from './PostProductionViewModal'
import { PostProductionFolderModal } from './PostProductionFolderModal'
import PostMillCard from './PostMillCard'

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
}) {
    const config = POST_PRODUCTION_CONFIG[titleName] || POST_PRODUCTION_CONFIG.Deko
    const initialAssign = sketchesData?.assign || sketchesData?.assigns || []

    const [data, setData] = React.useState({
        assign: initialAssign,
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

    const handleModalOpen = (val, selectedData, groupItems = null) => {
        StateUpdate({ selectedData: selectedData, groupItems: groupItems }, setData)
        if (val === "Deko") {
            modalOpen("DekoViewModalImage", true, setOpenModal)
        }
        if (val === "Mill") {
            modalOpen("MillViewModalImage", true, setOpenModal)
        }
        if (val === "Photography") {
            modalOpen("PhotographyViewModalImage", true, setOpenModal)
        }
        if (val === "Folder") {
            modalOpen("FolderViewModalImage", true, setOpenModal)
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
                            "data-[state=closed]:h-[54px]"
                        )}
                    >
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 w-full ">
                            <div className="flex-1 space-y-2">
                                <div className="flex justify-between items-center font-semibold text-primary-foreground w-full">
                                    <h3 className="text-[18px] font-semibold text-primary-foreground font-sans">
                                        {Idx}. {titleName}
                                    </h3>
                                    {/* <span className=" group-data-[state=open]:hidden">{Math.round(data.progress)}%</span> */}
                                </div>

                                {/* <div className="relative w-full lg:w-[80%] h-2 bg-[#F0F0F0] rounded-full overflow-hidden  group-data-[state=open]:hidden">
                                    <div
                                        className="absolute top-0 left-0 h-full rounded-full transition-all duration-300"
                                        style={{
                                            width: `${data.progress}%`,
                                            background:
                                                "linear-gradient(90deg, #D47A7A 0%, #D4A57A 50%, #8DB88D 100%)",
                                        }}
                                    />
                                </div> */}
                            </div>
                        </div>

                    </AccordionTrigger>
                    {/* <div className="absolute right-14 top-[50%] -translate-y-1/2 flex items-center space-x-2 z-10 group-data-[state=closed]:hidden">

                        <Button
                            variant="outline"
                            size="xs"
                            onClick={() => StateUpdate({ isEditModalOpen: true }, setOpenModal)}
                            className="h-7 px-4 py-0 border-[#dcccbd] bg-[#7DAA7B] text-[14px] font-medium text-white rounded-md hover:bg-[#5d8d5b]"
                        >
                            Start
                        </Button>
                        {data.status !== "completed" && data.status !== "skipped" && <Button
                            variant="outline"
                            size="xs"
                            disabled={isUpdatingStatus}
                            onClick={() => handleOnCompleted("skipped")}
                            className="h-7 px-4 py-0 border-[#dcccbd] bg-[#F8F5F2] text-[14px] font-medium text-primary-foreground rounded-md hover:bg-[#f1ede9]"
                        >
                            {isUpdatingStatus && clickedAction === "skipped" ? "..." : "Skip"}
                        </Button>}
                    </div> */}
                </div>

                {/* CONTENT */}
                <AccordionContent className="p-0">
                    <div >
                        <div
                            className={clsx(
                                titleName === "Folder" ? "" : "space-y-6",
                            )}
                        >
                            {/* Progress */}
                            {/* <div className="p-6 pb-0 flex flex-col md:flex-row md:items-end justify-between gap-6">
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
                                        variant="outline"
                                        onClick={() => StateUpdate({ isEditModalOpen: true, IsEditTarget: true }, setOpenModal)}
                                        className="h-[36px] bg-[#F8F5F2] border-none hover:bg-[#F0EDE9]"
                                    >
                                        Edit Target
                                    </Button>}
                                </div>
                            </div> */}
                            <div className="border-b border-[#dcccbd]"></div>
                            {/* Gallery */}
                            <div className={cn(
                                titleName === "Folder" ? "p-0" : "p-6",
                                "pt-0",
                                "flex flex-wrap items-center gap-4"
                            )}>
                                {titleName === "Photography" ? (
                                    data.assign.map((item) => {
                                        let arr = [...(item?.images || [])]
                                        while (arr.length < 4) {
                                            arr.push({
                                                "image_url": null
                                            });
                                        }
                                        if (arr.length > 4) {
                                            arr = arr.slice(0, 4)
                                        }
                                        return (
                                            <div
                                                className="flex flex-col w-[218px] rounded-[16px] bg-[#FAF8F6] border border-[#DCCCBD] p-4 space-y-3 shadow-sm hover:shadow-md transition-all group/card cursor-pointer"
                                                key={item.photography_id}
                                                onClick={() => handleModalOpen(titleName, item)}
                                            >
                                                <div className="flex flex-col items-center gap-1 border-b border-[#DCCCBD]/50 pb-2">
                                                    <span className="text-[13px] font-semibold text-primary-foreground font-sans">
                                                        Sample ID: {item.photography_id}
                                                    </span>
                                                </div>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {arr.map((val, idx) => {
                                                        return val?.image_url ? (
                                                            <div
                                                                key={idx}
                                                                className="relative aspect-square rounded-[12px] overflow-hidden border border-[#DCCCBD]/40 hover:opacity-90 transition-opacity"
                                                            >
                                                                <Image
                                                                    src={`${process.env.NEXT_PUBLIC_API_URL}${val.image_url}`}
                                                                    alt="Work"
                                                                    fill
                                                                    className="object-cover"
                                                                />
                                                            </div>
                                                        ) : (
                                                            <div
                                                                key={idx}
                                                                className="aspect-square rounded-[12px] bg-[#E6D9CB]/30 border border-dashed border-[#B0826A]/40 flex items-center justify-center hover:bg-[#E6D9CB]/50 transition-colors group"
                                                            >
                                                                <span className="text-2xl font-light text-[#B0826A] group-hover:scale-110 transition-transform">+</span>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        )
                                    })
                                ) : titleName === "Folder" ? (
                                    <div className="flex flex-col gap-3 w-full">
                                        {data.assign.map((item, index) => (
                                            <div
                                                key={item.folder_id || item.id}
                                                onClick={() => handleModalOpen(titleName, item, data.assign)}
                                                className={
                                                    clsx(
                                                        data.assign.length > 1 && index !== data.assign.length - 1
                                                            ? "border-b border-[#DCCCBD]"
                                                            : "",
                                                        "flex items-center gap-4 py-3  cursor-pointer group",
                                                    )
                                                }
                                            >
                                                <div className="flex items-center gap-2 px-2">
                                                    <span className="text-[13px]  font-sans">Sample ID:</span>
                                                    <span className="text-[14px] font-semibold text-primary-foreground font-sans">
                                                        {item?.sample_details?.sample_id || ""}
                                                    </span>
                                                </div>

                                                <span className="text-[#DCCCBD] font-light">|</span>

                                                <div className="flex items-center gap-2">
                                                    <span className="text-[13px]  font-sans">Folder No:</span>
                                                    <span className="text-[14px] font-semibold text-primary-foreground font-sans">
                                                        {item?.folder_name || "F-01"}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) :
                                    titleName === "Deko" ?
                                        <>
                                            {data.assign.map((item, index) => (
                                                <PostProductionItemCard
                                                    key={index}
                                                    item={item}
                                                    titleName={titleName === "Folder" ? "Design ID" : "Sample ID"}
                                                    onClick={() => handleModalOpen(titleName, item, data.assign)}
                                                />
                                            ))}
                                        </> :
                                        <>
                                            {
                                                data.assign.map((item, index) => (
                                                    <PostMillCard
                                                        key={index}
                                                        item={item}
                                                        titleName={titleName === "Folder" ? "Design ID" : "Sample ID"}
                                                        onClick={() => handleModalOpen(titleName, item, data.assign)}
                                                    />
                                                ))
                                            }</>
                                }
                            </div>
                            {data.selectedData && titleName === "Folder" ? (
                                <PostProductionFolderModal
                                    open={openModal.FolderViewModalImage}
                                    onOpenChange={(val) => modalOpen("FolderViewModalImage", val, setOpenModal)}
                                    selectedData={data.selectedData}
                                    onSuccess={(updatedItem) => {
                                        setData(prev => ({
                                            ...prev,
                                            assign: prev.assign.map(item => (item.folder_id || item.id) === (updatedItem.folder_id || updatedItem.id) ? updatedItem : item)
                                        }))
                                    }}
                                />
                            ) : data.selectedData && (
                                <PostProductionViewModal
                                    open={openModal.DekoViewModalImage || openModal.MillViewModalImage || openModal.PhotographyViewModalImage || openModal.FolderViewModalImage}
                                    onOpenChange={(val) => {
                                        setOpenModal(prev => ({
                                            ...prev,
                                            DekoViewModalImage: false,
                                            MillViewModalImage: false,
                                            PhotographyViewModalImage: false,
                                            FolderViewModalImage: false,
                                        }))
                                    }}
                                    selectedData={data.selectedData}
                                    groupData={data.groupItems}
                                    titleName={titleName}
                                    onUpdateSuccess={(updatedItem) => {
                                        if (data.selectedData?.photography_id) {
                                            setData(prev => ({
                                                ...prev,
                                                assign: updatedItem?.assigns || []
                                            }))
                                            modalOpen("PhotographyViewModalImage", false, setOpenModal)
                                        } else {
                                            const finalData = updatedItem?.assign?.find((item) => Number(item.production_items_id) === Number(data.selectedData?.production_items_id))
                                            setData(prev => ({
                                                ...prev,
                                                assign: prev.assign.map(item => item.id === updatedItem.id ? { ...finalData } : item)
                                            }))
                                        }
                                    }}
                                />
                            )}
                        </div>
                    </div>
                </AccordionContent>
            </AccordionItem>

        </Accordion>
    )
}

export default PostProductionHome